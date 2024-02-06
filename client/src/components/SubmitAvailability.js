import React, { useState } from "react";
import { Col, Form, Row, TimePicker, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";
import { DatePicker } from "antd";

const SubmitAvailability = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [availabilityData, setAvailabilityData] = useState({
    date: null,
    starttime: null,
    endtime: null,
    createdAt: null,
  });

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const { date, starttime, endtime, createdAt } = availabilityData;
      const res = await axios.post(
        "/api/availability", // Assuming this is the correct API endpoint
        {
          userId: user._id,
          date,
          starttime,
          endtime,
          createdAt,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const handleDateChange = (date) => {
    setAvailabilityData({ ...availabilityData, date });
  };

  const handleStartTimeChange = (starttime) => {
    setAvailabilityData({ ...availabilityData, starttime });
  };

  const handleEndTimeChange = (endtime) => {
    setAvailabilityData({ ...availabilityData, endtime });
  };



  return (
    <Layout>
      <h3 className="text-center">Enter Availability</h3>
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Date is required" }]}
            >
              <DatePicker onChange={handleDateChange} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="starttime"
              label="Start Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" onChange={handleStartTimeChange} />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              name="endtime"
              label="End Time"
              rules={[{ required: true }]}
            >
              <TimePicker format="HH:mm" onChange={handleEndTimeChange} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <button className="btn btn-primary form-btn" type="submit">
              Submit Availability
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default SubmitAvailability;
