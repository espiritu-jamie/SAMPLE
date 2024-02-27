import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Tabs, Select } from 'antd';
import Layout from '../../components/Layout';

const { Option } = Select;

const AdminAllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [sortOrder, setSortOrder] = useState('earliest');
  const [sortMode, setSortMode] = useState('byDate'); // Default sort mode

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get('/api/appointments', { headers });
        setAppointments(response.data.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const getSortedAppointments = () => {
    return appointments.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortMode === 'byDate') {
        return sortOrder === 'earliest' ? dateA - dateB : dateB - dateA;
      } else {
        // Implement any other sorting logic if needed
      }
    });
  };

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  const tabsItems = () => {
    const items = [
      {
        label: 'All Appointments',
        key: 'all',
        children: getSortedAppointments().map((appointment, index) => (
          <Card key={index}>
            Customer ID: {appointment.userId} <br />
            Date & Time: {formatDate(appointment.date)} <br />
          </Card>
        )),
      },
    ];
    return items;
  };

  return (
    <Layout>
      <div>
        <h2>Customer Appointments</h2>
        <Select defaultValue="byDate" style={{ width: 200, marginRight: 20 }} onChange={setSortMode}>
          {/* Adjust or add more sorting modes as needed */}
          <Option value="byDate">Sort by Date</Option>
        </Select>
        <Select defaultValue="earliest" style={{ width: 200 }} onChange={value => setSortOrder(value)}>
          <Option value="earliest">Earliest First</Option>
          <Option value="latest">Latest First</Option>
        </Select>
        <Tabs items={tabsItems()} />
      </div>
    </Layout>
  );
};

export default AdminAllAppointments;
