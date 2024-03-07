import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Descriptions } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const AssignmentModal = ({ isVisible, onClose, appointment, fetchAppointments }) => {
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);

    useEffect(() => {
        if (!isVisible || !appointment || !appointment.id) {
            setAvailableEmployees([]);
            setSelectedEmployees([]);
            return;
        }

        const fetchAvailableEmployees = async () => {
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
        };

        fetchAvailableEmployees();
    }, [isVisible, appointment]);

    const handleAssign = async () => {
        if (!selectedEmployees.length) {
            message.warning("Please select at least one employee");
            return;
        }

        try {
            await axios.post('/api/appointment/assign-employees', {
                appointmentId: appointment.id,
                assignedEmployees: selectedEmployees
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            message.success("Appointment assigned successfully");
            fetchAppointments();
            onClose();
        } catch (error) {
            console.error("Failed to assign employees", error);
            message.error("Failed to assign employees");
        }
    };

    return (
        <Modal
            title="Appointment Details and Assignment"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleAssign}>Assign</Button>,
            ]}
        >
            {appointment && (
                <>
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Booked by">{appointment.name || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Start Time">{appointment.starttime || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="End Time">{appointment.endtime || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Special Instructions">{appointment.specialInstructions || 'None'}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{appointment.phoneNumber}</Descriptions.Item>
                        <Descriptions.Item label="Address">{appointment.address}</Descriptions.Item>
                    </Descriptions>
                    <Select
                        mode="multiple"
                        style={{ width: '100%', marginTop: 16 }}
                        placeholder="Select available employees"
                        value={selectedEmployees}
                        onChange={(value) => setSelectedEmployees(value)}
                        maxTagCount="responsive"
                    >
                        {availableEmployees.map(employee => (
                            <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                        ))}
                    </Select>
                </>
            )}
        </Modal>
    );
};

export default AssignmentModal;
