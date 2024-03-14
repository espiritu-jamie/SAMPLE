import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Layout from '../../components/Layout';
import AppointmentDetailsModal from '../../components/modal/AppointmentDetailsModal';
import moment from 'moment';
import { message } from 'antd';


const EmployeeShiftsPage = () => {
    const [confirmedAppointments, setConfirmedAppointments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchConfirmedAppointments();
    }, []);

    const fetchConfirmedAppointments = async () => {
        try {
            const { data } = await axios.get('/api/appointment/confirmed-for-employee', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setConfirmedAppointments(data.data.map(appointment => ({
                id: appointment._id,
                title: `Appointment with ${appointment.userId.name}`,
                start: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.starttime,
                end: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.endtime,
                allDay: false,
                color: '#33CC33',
                extendedProps: { ...appointment }
            })));
        } catch (error) {
            console.error('Error fetching confirmed appointments:', error);
            message.error('Failed to fetch confirmed appointments');
        }
    };

    const handleEventClick = ({ event }) => {
        setSelectedAppointment({
            ...event.extendedProps,
            date: moment(event.start).format('YYYY-MM-DD'), // Ensure date is in the correct format
            starttime: moment(event.start).format('HH:mm'),
            endtime: moment(event.end).format('HH:mm'),
        });
        setIsModalVisible(true);
    };

    return (
        <Layout>
            <h2>My Shifts</h2>
            <FullCalendar
                aspectRatio={1.5}
                contentHeight="auto"
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={confirmedAppointments}
                eventClick={handleEventClick}
            />
            {selectedAppointment && (
                <AppointmentDetailsModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    appointment={selectedAppointment}
                    userRole="employee"
                    fetchAppointments={fetchConfirmedAppointments} // This prop might need to be adjusted based on your implementation
                />
            )}
        </Layout>
    );
};

export default EmployeeShiftsPage;
