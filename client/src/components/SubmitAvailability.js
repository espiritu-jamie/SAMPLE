import React, { useState } from "react";
import { Col, Form, Row, TimePicker, DatePicker, Button, List, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import moment from "moment";

const SubmitAvailability = ({ onAvailabilitySubmitted }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [dates, setDates] = useState([]);
  const [time, setTime] = useState({ starttime: null, endtime: null });

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
    if (!dates.length || !time.starttime || !time.endtime) {
      message.error("Please fill in all fields.");
      return;
    }

    // Convert time strings to moment objects for comparison
    const startTimeMoment = moment(time.starttime, 'HH:mm');
    const endTimeMoment = moment(time.endtime, 'HH:mm');

    // Check if end time is before or equal to start time
    if (!endTimeMoment.isAfter(startTimeMoment)) {
      message.error("End time must be later than start time.");
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
      onAvailabilitySubmitted(); // Refresh availabilities on parent component
      setDates([]); // Clear dates after successful submission
      setTime({ starttime: null, endtime: null }); // Clear times after successful submission
    } catch (error) {
      dispatch(hideLoading());
      message.error("Failed to submit availability");
      console.error(error);
    }
};


  const removeDate = (dateToRemove) => {
    setDates(dates.filter(date => date !== dateToRemove));
  };

  return (
    <div>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={20}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Date"
              rules={[{ required: true, message: "Please select a date!" }]}
            >
              <DatePicker 
                onChange={handleDateChange} 
                format="YYYY-MM-DD" 
                style={{ width: '100%'}}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Form.Item
              label="Start Time"
              rules={[{ required: true, message: "Start time is required" }]}
            >
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'starttime')} format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6} lg={4}>
            <Form.Item
              label="End Time"
              rules={[{ required: true, message: "End time is required" }]}
            >
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'endtime')} format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} lg={8} style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit Availability
            </Button>
          </Col>
        </Row>
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
          style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}
        />
      </Form>
    </div>
  );
};

export default SubmitAvailability;
