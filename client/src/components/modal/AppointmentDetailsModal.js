import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Select, message } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const AppointmentDetailsModal = ({ isVisible, onClose, appointment, fetchAppointments, userRole }) => {
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    useEffect(() => {
        if (!isVisible || !appointment) {
            setAvailableEmployees([]);
            setSelectedEmployees([]);
            return;
        }
    
        if (appointment?.status === 'confirmed' && appointment?.assignedEmployees) {
            console.log("assignedEmployees at useEffect:", appointment.assignedEmployees);
            setSelectedEmployees(appointment.assignedEmployees);
        } else {
            setSelectedEmployees([]);
        }
    
        // Fetch available employees only if the user is an admin
        if (userRole === 'admin') {
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
                    console.log("availableEmployees", response.data.availableEmployees);
                    setAvailableEmployees(response.data.availableEmployees || []);
                } catch (error) {
                    console.error("Failed to fetch available employees", error);
                    message.error("Failed to fetch available employees");
                }
                
            };
    
            fetchAvailableEmployees();


        }
    }, [isVisible, appointment, userRole]);

    // const handleUpdateAssignees = async () => {
    //     console.log("Sending these employees for update:", selectedEmployees);
    //     try {
    //         const response = await axios.post('/api/appointment/assign-employees', {
    //             appointmentId: appointment._id,
    //             assignedEmployees: selectedEmployees

    //         }, {
    //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //         });

    //         console.log("response", response.data);
    //         message.success(response.data.message);
    //         fetchAppointments();
    //         onClose();
    //     } catch (error) {
    //         console.error("Failed to update appointment assignees", error);
    //         message.error("Failed to update appointment assignees");
    //     }
    // };

    const handleUpdateAssignees = async () => {
        console.log("Sending these employees for update:", selectedEmployees);
        try {
            const response = await axios.post('/api/appointment/assign-employees', {
                appointmentId: appointment._id,
                assignedEmployees: selectedEmployees
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
    
            console.log("response", response.data);
            message.success(response.data.message);
            fetchAppointments(); // Refresh the appointments list
            onClose(); // Close the modal
        } catch (error) {
            console.error("Failed to update appointment assignees", error);
            message.error("Failed to update appointment assignees");
        }
    };

    console.log("Available Employees", availableEmployees); 

    return (
        <Modal
            title="Appointment Details"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>Close</Button>,
                userRole === 'admin' && (
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
            </Descriptions>
            {userRole === 'admin' && (
                <Select
                mode="multiple"
                style={{ width: '100%', marginTop: 16 }}
                placeholder="Select available employees"
                value={selectedEmployees}
                onChange={setSelectedEmployees}
                maxTagCount="responsive"
            >
                {availableEmployees.map((employee) => (
                    <Option key={employee.id} value={employee.id}>{employee.name}</Option>
                ))}

                
            </Select>
            )}
        </Modal>
    );
};

export default AppointmentDetailsModal;