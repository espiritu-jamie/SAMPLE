import { Form, Input, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import Navbar from '../components/Navbar';
import '../styles/LoginStyles.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`, values);

      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        dispatch(setUser(data.user));
        message.success("Login Successfully");
        navigate("/HomePage", { replace: true }, 100); 

      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
    }
  };

  return (
    <>
    <Navbar />
        <div className="register-page">
            <Form className="login-card" layout="vertical" onFinish={submitHandler}>
              <h1 className="h1">Login</h1>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input type="email" />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/register">Not a User? Click Here to Register</Link>
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </Form>
          </div>

</>


  );
};

export default Login;