// import { Form, Input, message } from "antd";
// import axios from "axios";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { hideLoading, showLoading } from "../redux/features/alertSlice";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Submit for Login
//   const submitHandler = async (values) => {
//     try {
//       dispatch(showLoading());
//       const { data } = await axios.post("/api/user/login", values);
//       window.location.reload();
//       dispatch(hideLoading());

//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         message.success("Login Successfully");
//         navigate("/");

//       } else {
//         message.error(data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       message.error("Something went wrong");
//     }
//   };

//   return (
//     <>
//       <div className="register-page">
//         <Form layout="vertical" onFinish={submitHandler}>
//           <h1>Login</h1>
//           <Form.Item label="Email" name="email">
//             <Input type="email" />
//           </Form.Item>
//           <Form.Item label="Password" name="password">
//             <Input.Password />
//           </Form.Item>
//           <div className="d-flex justify-content-between">
//             <Link to="/register">Not a User? Click Here to Register</Link>
//             <button className="btn btn-primary">Login</button>
//           </div>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default Login;

import { Form, Input, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Submit for Login
  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/login", values);

      dispatch(hideLoading());
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        dispatch(setUser(data.user));
        message.success("Login Successfully");
        // Trigger an update in your app state as needed, e.g., update user role in global state here
        navigate("/HomePage", { replace: true }); // Use navigate to change the route without reloading the page

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
      <div className="register-page">
      <img className="hero-image rounded-full" src="/Cleaning2.jpg" alt="hero_bg" />
        <Form layout="vertical" onFinish={submitHandler}>
          <h1>Login</h1>
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