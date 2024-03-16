
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Select, Divider } from 'antd';
import Layout from '../../components/Layout';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment'; // Import moment
import FullCalendar from '@fullcalendar/react'; // import the FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid'; // import the day grid plugin
import SubmitAvailability from '../../components/SubmitAvailability'; // Import the SubmitAvailability component

const { Option } = Select;

const EmployeeAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // State to track the selected view mode

  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('/api/availability', { headers });
      setAvailabilities(response.data.data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const formatTime = (time) => {
    // Convert to 12-hour format with AM/PM
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  const formatDateWithDayOfWeek = (date) => {
    // Format the date with the day of the week, year, month, and day
    return moment.utc(date).format('dddd, MMMM Do YYYY');
  };

  const handleDelete = (availabilityId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this availability?',
      onOk() {
        deleteAvailability(availabilityId);
      },
    });
  };

  const deleteAvailability = async (availabilityId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`/api/availability/${availabilityId}`, { headers });
      fetchAvailabilities(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting availability:', error);
      Modal.error({
        title: 'An error occurred while deleting the availability',
        content: 'Something went wrong. Please try again later.',
      });
    }
  };

  const onEventClick = (clickInfo) => {
    // Find the clicked availability details by its ID
    const availability = availabilities.find(a => a._id === clickInfo.event.id);
    setSelectedAvailability(availability);
    setIsDetailModalVisible(true); // Show the details modal
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedAvailability(null); // Reset selected availability
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text, record) => formatDateWithDayOfWeek(record.date),
      // Add a sorter function for the date column
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Start Time',
      dataIndex: 'starttime',
      key: 'starttime',
      render: (text) => formatTime(text),
    },
    {
      title: 'End Time',
      dataIndex: 'endtime',
      key: 'endtime',
      render: (text) => formatTime(text),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger>
          Delete
        </Button>
      ),
    },
  ];
  


  return (
    <Layout>
      <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        {/* Render SubmitAvailability component and pass fetchAvailabilities to refresh list */}
        <SubmitAvailability onAvailabilitySubmitted={fetchAvailabilities} />

      <Divider />

      <Modal
        title="Availability Details"
        open={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={[
          <Button key="back" onClick={closeDetailModal}>
            Close
          </Button>,
          <Button key="delete" type="primary" danger onClick={() => {
            handleDelete(selectedAvailability._id);
            closeDetailModal();
          }}>
            Delete Availability
          </Button>,
        ]}
      >
        {selectedAvailability && (
          <div>
            <p>Date: {formatDateWithDayOfWeek(selectedAvailability.date)}</p>
            <p>Start Time: {formatTime(selectedAvailability.starttime)}</p>
            <p>End Time: {formatTime(selectedAvailability.endtime)}</p>
          </div>
        )}
      </Modal>

      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>My Availability</h2>
        <Select defaultValue="list" style={{ width: 120, marginBottom: 20 }} onChange={(value) => setViewMode(value)}>
          <Option value="list">List</Option>
          <Option value="calendar">Calendar</Option>
        </Select>
        {viewMode === 'list' ? (
          <Table dataSource={availabilities} columns={columns} rowKey="_id" />
        ) : (
          
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            timeZone="UTC" // Explicitly set FullCalendar to use UTC
            events={availabilities.map((availability) => ({
              id: availability._id,
              title: `Available: ${moment(availability.starttime, 'HH:mm').format('hh:mm A')} - ${moment(availability.endtime, 'HH:mm').format('hh:mm A')}`,
              start: moment.utc(availability.date).startOf('day').add(moment.duration(availability.starttime)).toISOString(),
              end: moment.utc(availability.date).startOf('day').add(moment.duration(availability.endtime)).toISOString(),
              // Use moment.duration to properly parse the "HH:mm" formatted times
            }))}
            eventClick={onEventClick} // Attach event click listener

/>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeAvailabilities;
