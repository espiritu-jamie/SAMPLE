import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { message, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';
import AppointmentDetailsModal from '../../components/modal/AppointmentDetailsModal';

const { Option } = Select;

const ScheduleManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);

    useEffect(() => {
        // Now the fetchAppointments function is defined inside useEffect, making it unnecessary to add to dependencies
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
                        }
                    }));
                setAppointments(filteredAppointments);
            } catch (error) {
                console.error('Error fetching appointments:', error);
                message.error('Failed to fetch appointments');
            }
        };

        fetchAppointments();
    }, [filter]); // filter is the only dependency now

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
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={appointments}
                    eventClick={handleEventClick}
                />
                {currentAppointment && (
                    <AppointmentDetailsModal
                        isVisible={isModalVisible}
                        onClose={() => setIsModalVisible(false)}
                        appointment={currentAppointment}
                        fetchAppointments={() => {}}
                        userRole="admin"
                    />
                )}
            </div>
        </Layout>
    );
};

export default ScheduleManagement;
