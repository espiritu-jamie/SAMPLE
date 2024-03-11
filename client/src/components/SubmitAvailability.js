import React, { useState } from "react";
import { Col, Form, Row, TimePicker, message, DatePicker } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";

const SubmitAvailability = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [availabilityData, setAvailabilityData] = useState({
    date: null,
    starttime: null,
    endtime: null,
  });

  const handleDateChange = (date, dateString) => {
    setAvailabilityData({ ...availabilityData, date: dateString });
  };

  const handleTimeChange = (time, timeString, type) => {
    setAvailabilityData({ ...availabilityData, [type]: timeString });
  };

  const handleFinish = async () => {
    try {
      dispatch(showLoading());
      const { date, starttime, endtime } = availabilityData;
      await axios.post(
        "/api/availability", // Ensure this matches your API endpoint
        {
          userId: user._id,
          date, // Ensure date is formatted as "YYYY-MM-DD"
          starttime, // "HH:mm" string format
          endtime, // "HH:mm" string format
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      message.success("Availability submitted successfully");
      navigate("/");
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Failed to submit availability");
    }
  };

  return (
    <Layout>
      <h3 className="text-center">Enter Availability</h3>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={20}>
          {/* Date Picker */}
          <Col xs={24} md={24} lg={8}>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: "Date is required" }]}>
              <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          {/* Start Time Picker */}
          <Col xs={24} md={24} lg={8}>
            <Form.Item name="starttime" label="Start Time" rules={[{ required: true }]}>
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'starttime')} format="HH:mm" />
            </Form.Item>
          </Col>
          {/* End Time Picker */}
          <Col xs={24} md={24} lg={8}>
            <Form.Item name="endtime" label="End Time" rules={[{ required: true }]}>
              <TimePicker onChange={(time, timeString) => handleTimeChange(time, timeString, 'endtime')} format="HH:mm" />
            </Form.Item>
          </Col>
        </Row>
        <button className="btn btn-primary form-btn" type="submit">Submit Availability</button>
      </Form>
    </Layout>
  );
};

export default SubmitAvailability;

