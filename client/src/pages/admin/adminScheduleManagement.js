import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Button, message, Select } from 'antd';
import Layout from '../../components/Layout';
import moment from 'moment';
import AssignmentModal from '../../components/modal/AppointmentDetailsModal';


const { Option } = Select;

const ScheduleManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
const [currentAppointment, setCurrentAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.get('/api/appointment', { headers });
      const fetchedAppointments = response.data.data.map(appointment => {
        return {
            id: appointment._id,
          title: `Appointment: ${appointment.userId.name}`,
          start: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.starttime,
          end: moment(appointment.date).format('YYYY-MM-DD') + 'T' + appointment.endtime,
          allDay: false,
          extendedProps: {
            phoneNumber: appointment.phoneNumber,
            address: appointment.address,
            specialInstructions: appointment.specialInstructions,
            userId: appointment.userId,
          }
        };
      });
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      message.error('Failed to fetch appointments');
    }
  };

  const handleAutoAssign = async () => {
    // Your existing auto-assign logic here
    message.success('Auto-assignment successful');
  };

  // Event click handler
  const handleEventClick = ({ event }) => {

    const date = moment(event.start).format('YYYY-MM-DD');

    // Constructing the appointment object correctly
    setCurrentAppointment({
      ...event.extendedProps, // Spread existing properties
      id: event.id, // Ensure you have an ID property if your modal needs it
      date,
      // Format or include additional properties as needed
      name: event.title.replace("Appointment: ", ""), // Example adjustment
      starttime: moment(event.start).format("HH:mm"), // Format start time
      endtime: moment(event.end).format("HH:mm"), // Format end time
    });
    setIsModalVisible(true);
  };

  // Filter logic
  const filteredAppointments = appointments.filter(appointment => {
    const now = moment();
    if (filter === 'all') {
      return true;
    }
    return filter === 'upcoming' ? moment(appointment.start).isAfter(now) : moment(appointment.start).isBefore(now);
  });

  return (
    <Layout>
      <div>
        <h2>Schedule Management</h2>
        <Select defaultValue="all" style={{ width: 200, marginBottom: 20 }} onChange={setFilter}>
          <Option value="all">All</Option>
          <Option value="upcoming">Upcoming</Option>
          <Option value="past">Past</Option>
        </Select>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={filteredAppointments}
          eventClick={handleEventClick}
        />
        <AssignmentModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        appointment={currentAppointment}
        fetchAppointments={fetchAppointments}
        />
        <Button onClick={handleAutoAssign} style={{ marginTop: 20 }}>
          Auto-assign Appointments
        </Button>
      </div>
    </Layout>
  );
};

export default ScheduleManagement;
