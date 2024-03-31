import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, message, Button, Modal, Rate } from 'antd';
import Layout from '../components/Layout';
import moment from 'moment';

const { Option } = Select;

const ViewAppointments = ({ isAdminView }) => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [ratingsModalVisible, setRatingsModalVisible] = useState(false);
  const [selectedAppointmentForRatings, setSelectedAppointmentForRatings] = useState(null);
  const [ratings, setRatings] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointment', { headers });
        setAppointments(response.data.data);

        console.log("response.data.data", response.data.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        message.error('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const now = moment();
    const appointmentDate = moment(appointment.date);
    return filter === 'upcoming' ? appointmentDate.isAfter(now) : appointmentDate.isBefore(now);
  });

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: text => moment(text).format('LL'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Time',
      dataIndex: 'starttime',
      key: 'time',
      render: (_, record) => `${moment(record.starttime, "HH:mm").format('hh:mm A')} - ${moment(record.endtime, "HH:mm").format('hh:mm A')}`,
    },
    {
      title: 'Customer Name',
      dataIndex: 'userId',
      key: 'name',
      render: userId => userId.name,
      ...(isAdminView ? {} : { className: 'hide' }),
    },
    {
      title: 'Customer Email',
      dataIndex: 'userId',
      key: 'email',
      render: userId => userId.email,
      ...(isAdminView ? {} : { className: 'hide' }),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Special Instructions',
      dataIndex: 'specialInstructions',
      key: 'specialInstructions',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Ratings',
      key: 'ratings',
      render: (_, record) => (
        isAdminView ? (
          <Button onClick={() => handleViewRatings(record._id)}>View Ratings</Button>
        ) : null
      ),
    },
    // You can add more columns if needed.
  ];

  const handleViewRatings = async (appointmentId) => {
    setSelectedAppointmentForRatings(appointmentId);
    try {
      const response = await axios.get(`/api/rating/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRatings(response.data.data);
      setRatingsModalVisible(true);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      message.error('Failed to fetch ratings');
    }
  };
  

  return (
    <Layout>
      <h2>{isAdminView ? 'All Customer Appointments' : 'Your Appointments'}</h2>
      <Select defaultValue="upcoming" style={{ width: 200, marginBottom: 20 }} onChange={handleFilterChange}>
        <Option value="upcoming">Upcoming</Option>
        <Option value="past">Past</Option>
      </Select>
      <Table dataSource={filteredAppointments} columns={columns} rowKey="_id" />
      <Modal
  title="View Ratings"
  visible={ratingsModalVisible}
  onCancel={() => setRatingsModalVisible(false)}
  footer={[
    <Button key="back" onClick={() => setRatingsModalVisible(false)}>
      Close
    </Button>,
  ]}
>
  {ratings.length > 0 ? (
    ratings.map((rating) => (
      <div key={rating._id} style={{ marginBottom: '10px' }}>
        <Rate disabled value={rating.rating} style={{ marginBottom: '20px' }} />
        <p>{rating.comment}</p>
      </div>
    ))
  ) : (
    <p>No ratings available for this appointment.</p>
  )}
</Modal>

    </Layout>
  );
};

export default ViewAppointments;
