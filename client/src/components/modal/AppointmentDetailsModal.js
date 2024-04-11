import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Descriptions, Select, 
    message, Input, DatePicker, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const AppointmentDetailsModal = ({ isVisible, onClose, appointment, fetchAppointments, userRole }) => {
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [cancellationReason, setCancellationReason] = useState('');
    const [rescheduledDate, setRescheduledDate] = useState(null);

    const isCanceled = appointment?.status === 'cancelled';

    useEffect(() => {
        console.log('available employees:', availableEmployees);
        if (!isVisible || !appointment) {
            setAvailableEmployees([]);
            setSelectedEmployees([]);
            setCancellationReason('');
            setRescheduledDate(null);
            return;
        }
    
        if (!isCanceled && appointment?.status === 'confirmed' && appointment?.assignedEmployees) {
            setSelectedEmployees(appointment.assignedEmployees);
        } else {
            setSelectedEmployees([]);
        }
    
        if (userRole === 'admin' && !isCanceled) {
            fetchAvailableEmployees();
        }
    }, [isVisible, appointment, userRole, isCanceled]);

    const fetchAvailableEmployees = useCallback(async () => {
        try {
            const formattedDate = moment(appointment.date).format("YYYY-MM-DD");
            const response = await axios.get(`/api/appointment/available-employees`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                params: {
                    date: formattedDate,
                    starttime: appointment.starttime,
                    endtime: appointment.endtime,
                },
            });
            setAvailableEmployees(response.data.availableEmployees || []);
        } catch (error) {
            console.error("Failed to fetch available employees", error);
            message.error("Failed to fetch available employees");
        }
    }, [appointment?.date, appointment?.starttime, appointment?.endtime]);

    const handleUpdateAssignees = async () => {
        if (appointment?.status !== 'confirmed' && selectedEmployees.length === 0) {
            message.error("Please select at least one employee to assign.");
            return;
        }
    
        try {
            const response = await axios.post('/api/appointment/assign-employees', {
                appointmentId: appointment._id,
                assignedEmployees: selectedEmployees
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            message.success(response.data.message);
            fetchAppointments();
            onClose();
        } catch (error) {
            console.error("Failed to update appointment assignees", error);
            message.error("Failed to update appointment assignees");
        }
    };
    

    const handleCancelAppointment = async () => {
        if (!cancellationReason.trim()) {
            message.error("Please provide a reason for cancellation/rescheduling.");
            return;
        }

        try {
            await axios.patch(`/api/appointment/cancel-appointment/${appointment._id}`, {
                cancellationReason
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            message.success("Appointment cancelled successfully");
            fetchAppointments();
            onClose();
        } catch (error) {
            console.error("Failed to cancel appointment", error);
            message.error("Failed to cancel appointment");
        }
    };

    const handleRescheduleAppointment = async () => {
        if (!cancellationReason.trim()) {
            message.error("Please provide a reason for rescheduling.");
            return;
        }
        if (!rescheduledDate) {
            message.error("Please select a new date for the appointment.");
            return;
        }

        try {
            await axios.patch(`/api/appointment/reschedule-appointment/${appointment._id}`, {
                newDate: rescheduledDate,
                cancellationReason
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            message.success("Appointment rescheduled successfully");
            fetchAppointments();
            onClose();
        } catch (error) {
            console.error("Failed to reschedule appointment", error);
            message.error("Failed to reschedule appointment");
        }
    };

    const MoreActionsMenu = (
        <Menu
          items={[
            userRole === 'admin' && !isCanceled && {
              key: 'cancel',
              label: 'Cancel Appointment',
              onClick: handleCancelAppointment,
            },
            userRole === 'admin' && !isCanceled && {
              key: 'reschedule',
              label: 'Reschedule Appointment',
              onClick: handleRescheduleAppointment,
            },
          ].filter(Boolean)}
        />
      );

        const isPastAppointment = useCallback(() => {
            const now = moment();
            const appointmentEnd = moment(appointment.date + ' ' + appointment.endtime, "YYYY-MM-DD HH:mm");
            return appointmentEnd.isBefore(now);
        }, [appointment.date, appointment.endtime]);


        const isDisabled = isCanceled || isPastAppointment();

    console.log('selected employees:', selectedEmployees);

    return (
        <Modal
            title="Appointment Details"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>Close</Button>,
                userRole === 'admin' && !isDisabled && (
                    <Dropdown overlay={MoreActionsMenu} key="more">
                        <Button>
                            More Actions <DownOutlined />
                        </Button>
                    </Dropdown>
                ),
                userRole === 'admin' && !isDisabled && (
                    <Button key="submit" type="primary" onClick={handleUpdateAssignees}>
                        {appointment?.status === 'confirmed' ? 'Update Assignment' : 'Assign'}
                    </Button>
                ),
            ]}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Booked by">{appointment?.userId?.name || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Start Time">
                    {moment(appointment?.starttime, "HH:mm").isValid() ? moment(appointment?.starttime, "HH:mm").format("hh:mm A") : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="End Time">
                    {moment(appointment?.endtime, "HH:mm").isValid() ? moment(appointment?.endtime, "HH:mm").format("hh:mm A") : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Special Instructions">{appointment?.specialInstructions || 'None'}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{appointment?.phoneNumber || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Address">{appointment?.address || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Cost">{appointment?.cost.toFixed(2) || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Payment Method">{appointment?.paymentMethod || 'N/A'}</Descriptions.Item>
            </Descriptions>
            {userRole === 'admin' && (
            <>
                <Select
                        mode="multiple"
                        style={{ width: '100%', marginTop: 16 }}
                        placeholder="Select available employees"
                        value={selectedEmployees}
                        onChange={setSelectedEmployees}
                        maxTagCount="responsive"
                        disabled={isDisabled} // Apply isDisabled here
                    >
                        {availableEmployees.map((employee) => (
                            <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                        ))}  
                    </Select>
                    <Input.TextArea
                        rows={4}
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Cancellation/Rescheduling Reason"
                        style={{ marginTop: 16 }}
                        disabled={isDisabled} // Apply isDisabled here
                    />
                    <DatePicker
                        style={{ width: '100%', marginTop: 16 }}
                        value={rescheduledDate}
                        onChange={setRescheduledDate}
                        placeholder="Reschedule Appointment To"
                        disabled={isDisabled} // Apply isDisabled here
                    />
            </>
            )}
        </Modal>
    );
    
};

export default AppointmentDetailsModal;