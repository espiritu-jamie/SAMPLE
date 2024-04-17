import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, DatePicker, Typography, Select, message, Radio, Divider } from 'antd';
import axios from 'axios';
import Layout from '../../components/Layout';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const BookingPage = () => {
  const [form] = Form.useForm();
  const [cost, setCost] = useState(0);
  const [endTime, setEndTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [areSlotsAvailable, setAreSlotsAvailable] = useState(true);

  const COST_PER_SQFT = 0.10;

  const allTimeSlots = [
    { start: "07:00", end: "09:00" },
    { start: "09:30", end: "11:30" },
    { start: "12:00", end: "14:00" },
    { start: "14:30", end: "16:30" },
    { start: "17:00", end: "19:00" }
  ].map(slot => `${slot.start} - ${slot.end}`);

  const fetchBookedSlots = async (date) => {
    try {
      const formattedDate = date.format('YYYY-MM-DD');
      const response = await axios.get(`/api/appointment/booked-slots?date=${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBookedSlots(response.data.bookedSlots);
    } catch (error) {
      console.error('Failed to fetch booked slots:', error);
      message.error('Failed to fetch booked slots. Please try again.');
    }
  };

  useEffect(() => {
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
    setAreSlotsAvailable(availableSlots.length > 0);
  }, [bookedSlots, allTimeSlots]);
  
  const getAvailableTimeSlots = () => {
    return allTimeSlots.filter(slot => !bookedSlots.includes(slot));
  };

  const handleStartTimeChange = (value) => {
    const selectedSlot = allTimeSlots.find(slot => slot.startsWith(value));
    const calculatedEndTime = selectedSlot.split(" - ")[1];
    setEndTime(calculatedEndTime);
  };

  const handleSubmit = async (values) => {
    const calculatedCost = parseFloat((values.area * COST_PER_SQFT).toFixed(2));
    const [startTime, endTime] = values.starttime.split(" - ");
    const dataToSend = {
      ...values,
      cost: calculatedCost,
      date: values.date.format('YYYY-MM-DD'),
      starttime: startTime,
      endtime: endTime,
    };

    try {
      const response = await axios.post('/api/appointment/', dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        message.success('Appointment submitted successfully');
  
        form.resetFields();
        setCost(0);
        setEndTime("");
        fetchBookedSlots(values.date);
      } else {
        message.error('Failed to submit appointment.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      message.error('Failed to submit appointment. Please try again.');
    }
  };

  const onAreaChange = value => {
    setCost(parseFloat((value * COST_PER_SQFT).toFixed(2)));
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf('day').add(3, 'days');
  };


  return (
    <Layout>
      <div className="container" style={{ maxWidth: '600px', margin: 'auto', padding: '24px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>Book Your Appointment</Title>
        <Card>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Title level={4}>Contact Information</Title>
            <Paragraph>
              The email address associated with your account will also be used for any booking-related inquiries.
            </Paragraph>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                { 
                  required: true, 
                  message: 'Phone number is required',
                  pattern: new RegExp(/^\(\d{3}\)\d{3}-\d{4}$/),
                  message: 'Phone number must be in the format (XXX)XXX-XXXX'
                }
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item
              name="specialInstructions"
              label="Special Instructions (optional)"
            >
              <Input.TextArea rows={4} placeholder="Special Instructions" />
            </Form.Item>
  
            <Divider />
            <Title level={4}>Booking Details</Title>
            <Paragraph>
              <ExclamationCircleOutlined style={{ color: 'red', marginRight: '4px' }} />
              <strong>Note:</strong><span style={{ fontStyle: 'italic' }}> To book an appointment for the next 3 days, please call (403)403-4003.</span>
            </Paragraph>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Date is required' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                onChange={() => {
                  setBookedSlots([]);
                  form.resetFields(['starttime']); // Only reset starttime as endtime is derived from it
                  fetchBookedSlots(form.getFieldValue('date'));
                }}
              />
            </Form.Item>
            <Form.Item
              name="starttime"
              label={
                areSlotsAvailable
                  ? "Time Slot"
                  : <span style={{ color: 'red', fontWeight: 'bold' }}>We are fully booked for this date. Please select a different date.</span>
              }
              rules={[{ required: areSlotsAvailable, message: 'Time Slot is required' }]} 
            >
              <Select 
                placeholder="Select a time slot" 
                onChange={handleStartTimeChange}
                disabled={!areSlotsAvailable}
              >
                {getAvailableTimeSlots().map(slot => (
                  <Option key={slot} value={slot}>{slot}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="area"
              label="Enter the Area you want to get cleaned (in sqft)"
              rules={[{ required: true, message: 'Area is required' }]}
            >
              <InputNumber
                placeholder="Enter the Area in sqft"
                min={1}
                style={{ width: '100%' }}
                onChange={onAreaChange}
              />
            </Form.Item>
            <Form.Item
              name="paymentMethod"
              label="Select Payment Method"
              rules={[{ required: true, message: 'Payment method is required' }]}
            >
              <Radio.Group>
                <Radio value="cheque">Cheque</Radio>
                <Radio value="eTransfer">E-Transfer</Radio>
              </Radio.Group>
            </Form.Item>
            <div style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>
              Approximate Cost for Cleaning: ${cost.toFixed(2)}
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit Appointment
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
};

export default BookingPage;