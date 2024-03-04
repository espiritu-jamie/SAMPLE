import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import axios from 'axios';
import Layout from '../../components/Layout'; // Assuming you have a Layout component

const CustomerAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customer/appointments', {
        headers: {
        },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      message.error('Failed to load appointments.');
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status === 'Confirmed' ? 'green' : 'volcano';
        return (
          <span style={{ color }}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="appointments-container">
        <h2>Your Appointments</h2>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey={record => record.id}
          loading={loading}
        />
      </div>
    </Layout>
  );
};

export default CustomerAppointmentsPage;
