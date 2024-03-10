import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Modal, Button, Select, Form, Row, Col, TimePicker, DatePicker, List, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import Layout from '../../components/Layout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { hideLoading, showLoading } from '../../redux/features/alertSlice'; // Update the path as needed

const { Option } = Select;

const EmployeeAvailabilitySchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [availabilities, setAvailabilities] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [dates, setDates] = useState([]);
  const [time, setTime] = useState({ starttime: null, endtime: null });

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

  const handleDateChange = (value) => {
    const dateString = value ? value.format("YYYY-MM-DD") : null;
    if (dateString && !dates.includes(dateString)) {
      setDates([...dates, dateString]);
    } else {
      message.warning("This date has already been added or is invalid.");
    }
  };

  const handleTimeChange = (timeValue, timeString, type) => {
    setTime({ ...time, [type]: timeString });
  };

  const handleFinish = async () => {
    if (dates.length === 0 || !time.starttime || !time.endtime) {
      message.error("Please fill in all fields.");
      return;
    }

    try {
      dispatch(showLoading());

      await axios.post(
        "/api/availability/submit-multiple",
        {
          userId: user._id,
          dates,
          starttime: time.starttime,
          endtime: time.endtime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      message.success("Availability submitted successfully");
      fetchAvailabilities(); // Refresh the availabilities
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Failed to submit availability");
    }
  };

  const removeDate = (dateToRemove) => {
    setDates(dates.filter(date => date !== dateToRemove));
  };

  const handleDelete = async (availabilityId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this availability?',
      onOk: async () => {
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
      },
    });
  };

  const formatTime = (time) => {
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  const formatDateWithDayOfWeek = (date) => {
    return moment.utc(date).format('dddd, MMMM Do YYYY');
  };


  return (
    <Layout>
      <h2 style={{ textAlign: 'center', margin: '16px 0' }}>My Availability Schedule</h2>
      <Row gutter={26} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Col span={12} style={{ padding: '10px' }}>
          {/* Form Fields */}
          <Form layout="vertical" onFinish={handleFinish}>
            <Form.Item label="Date" rules={[{ required: true, message: "Please select a date!" }]}>
              <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Start Time" rules={[{ required: true, message: "Start time is required" }]}>
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'starttime')} format="HH:mm" />
            </Form.Item>
            <Form.Item label="End Time" rules={[{ required: true, message: "End time is required" }]}>
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'endtime')} format="HH:mm" />
            </Form.Item>
          </Form>
          {/* Selected Dates */}
          <List
            size="small"
            header={<div>Selected Dates</div>}
            bordered
            dataSource={dates}
            renderItem={date => (
              <List.Item actions={[<a key="list-remove" onClick={() => removeDate(date)}>Remove</a>]}>
                {date}
              </List.Item>
            )}
            style={{ maxHeight: '280px', overflowY: 'auto', marginTop: '10px' }}
          />
            <Button type="primary" htmlType="submit" 
                style={{marginTop: '10px'}}>Submit Availability</Button>
        </Col>
        <Col span={12}>
        {/* Small Calendar */}
        <div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'today'
            }}
            timeZone="UTC"
            initialView="dayGridMonth"
            height="auto"
            events={availabilities.map((availability) => ({
                title: `Available: ${formatTime(availability.starttime)} - ${formatTime(availability.endtime)}`,
                start: moment.utc(availability.date).format(), // Format as UTC
                end: moment.utc(availability.date).add(1, 'days').format(), // Add one day in UTC
            }))}
          />
        </div>
      </Col>
    </Row>
    </Layout>
  );
  
  
}

export default EmployeeAvailabilitySchedule;