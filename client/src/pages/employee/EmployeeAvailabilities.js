
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Modal, Button, Select } from 'antd';
import Layout from '../../components/Layout';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment'; // Import moment
import FullCalendar from '@fullcalendar/react'; // import the FullCalendar component
import dayGridPlugin from '@fullcalendar/daygrid'; // import the day grid plugin

const { Option } = Select;

const EmployeeAvailabilities = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // State to track the selected view mode

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


  return (
    <Layout>
      <div>
        <h2>My Availability</h2>
        <Select defaultValue="list" style={{ width: 120, marginBottom: 20 }} onChange={(value) => setViewMode(value)}>
          <Option value="list">List</Option>
          <Option value="calendar">Calendar</Option>
        </Select>
        {viewMode === 'list' ? (
          availabilities.map((availability) => (
            <Card key={availability._id}>
              Date: {formatDateWithDayOfWeek(availability.date)} <br />
              Start Time: {formatTime(availability.starttime)} <br />
              End Time: {formatTime(availability.endtime)} <br />
              <Button type="primary" icon={<DeleteOutlined />} onClick={() => handleDelete(availability._id)} danger>
                Delete
              </Button>
            </Card>
          ))
        ) : (
          <FullCalendar
  plugins={[dayGridPlugin]}
  initialView="dayGridMonth"
  timeZone="UTC" // Explicitly set FullCalendar to use UTC
  events={availabilities.map((availability) => ({
    title: `Available: ${formatTime(availability.starttime)} - ${formatTime(availability.endtime)}`,
    start: moment.utc(availability.date).format(), // Format as UTC
    end: moment.utc(availability.date).add(1, 'days').format(), // Add one day in UTC
  }))}

/>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeAvailabilities;
