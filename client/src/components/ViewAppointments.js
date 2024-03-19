import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Select, message } from 'antd';
import Layout from '../components/Layout';
import moment from 'moment';

const { Option } = Select;

const ViewAppointments = ({ isAdminView }) => {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('upcoming');
    const [userRole, setUserRole] = useState('');
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      // If isAdminView is true, we force the role to 'admin', otherwise, get the role from localStorage
      const role = isAdminView ? 'admin' : localStorage.getItem('role');
      setUserRole(role);
  
      const headers = { Authorization: `Bearer ${token}` };
  
      const fetchAppointments = async () => {
        try {
          const response = await axios.get('/api/appointment', { headers });
          setAppointments(response.data.data);
        } catch (error) {
          console.error('Error fetching appointments:', error);
          message.error('Failed to fetch appointments');
        }
      };
  
      fetchAppointments();
    }, [isAdminView]); // Depend on isAdminView to refetch if the prop changes
  
  

  const filteredAppointments = appointments.filter((appointment) => {
    const now = moment();
    const appointmentDate = moment(appointment.date);
    return filter === 'upcoming' ? appointmentDate.isAfter(now) : appointmentDate.isBefore(now);
  });

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  return (
    <Layout>
      <h2>{userRole === 'admin' ? 'All Customer Appointments' : 'Your Appointments'}</h2>
      <Select defaultValue="upcoming" style={{ width: 200, marginBottom: 20 }} onChange={handleFilterChange}>
        <Option value="upcoming">Upcoming</Option>
        <Option value="past">Past</Option>
      </Select>
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appointment, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            {userRole === 'admin' && (
              <>
                <p>Customer Name: {appointment.userId.name}</p>
                <p>Customer Email: {appointment.userId.email}</p>
              </>
            )}
            <p>Phone Number: {appointment.phoneNumber}</p>
            <p>Date: {moment(appointment.date).format('LL')}</p>
            <p>Time: {moment(appointment.starttime, "HH:mm").format('hh:mm A')} - {moment(appointment.endtime, "HH:mm").format('hh:mm A')}</p>
            <p>Address: {appointment.address}</p>
            <p>Special Instructions: {appointment.specialInstructions}</p>
            <p>Created At: {moment(appointment.createdAt).format('LLLL')}</p>
          </Card>
        ))
      ) : (
        <p>No appointments found.</p>
      )}
    </Layout>
  );
};

export default ViewAppointments;
