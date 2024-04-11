import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { message, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';
import AppointmentDetailsModal from '../../components/modal/AppointmentDetailsModal';
import '../../styles/FullCalendarStyles.css';

const { Option } = Select;

const ScheduleManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
 

    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
    
        try {
            const response = await axios.get('/api/appointment', { headers });
            const filteredAppointments = response.data.data
                .filter(appointment => filter === 'all' || appointment.status === filter)
                .map(appointment => ({
                    id: appointment._id,
                    title: `Appointment: ${appointment.userId.name} - ${appointment.status.toUpperCase()}`,
                    start: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.starttime,
                    end: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.endtime,
                    allDay: false,
                    extendedProps: {
                        ...appointment
                    },
                    color: appointment.status === 'confirmed' ? '#33CC33' : appointment.status === 'cancelled' ? 'red' : 'blue',
                    textColor: 'white',
                }));
            setAppointments(filteredAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            message.error('Failed to fetch appointments');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const handleEventClick = ({ event }) => {
        setIsModalVisible(true);
        setCurrentAppointment({
            ...event.extendedProps,
            starttime: moment(event.start).format("HH:mm"),
            endtime: moment(event.end).format("HH:mm")
        });
    };

    return (
        <Layout>
            <div>
                <h2>Schedule Management</h2>
                <Select defaultValue="all" style={{ width: 200, marginBottom: 20 }} onChange={setFilter}>
                    <Option value="all">All</Option>
                    <Option value="confirmed">Confirmed</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="cancelled">Cancelled</Option>
                </Select>
                <FullCalendar
                    aspectRatio={1.5} // Adjust the width to height ratio
                    contentHeight="auto" // or you can use a specific height like '600px'
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        right: 'today prev,next',

                    }}
                    events={appointments}
                    eventClick={handleEventClick}
                />
                {currentAppointment && (
                    <AppointmentDetailsModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        appointment={currentAppointment}
                        fetchAppointments={fetchAppointments} 
                        userRole="admin"
                    />
                )}
            </div>
        </Layout>
    );
};

export default ScheduleManagement;
