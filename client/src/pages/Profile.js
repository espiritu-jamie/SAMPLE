import { Form, Input, message, Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/features/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Assuming user data is stored in Redux state

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Load user profile when component mounts
    loadUserProfile();
  }, []);

  // Load user profile
const loadUserProfile = async () => {
    try {
      const response = await axios.get(`/api/user/profile/${user.userId}`);
      const userProfile = response.data; // Assuming the response contains user profile data
  
      // Update form data with user profile
      setFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        address: userProfile.address,
        phoneNumber: userProfile.phoneNumber,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      message.error("Something went wrong");
    }
  };

  // Handle form submission to update profile
  const submitHandler = async () => {
    try {
      const updatedUser = await updateprofilecontroller(formData); // Call the updateprofilecontroller function
      if (updatedUser.success) {
        dispatch(updateUser(updatedUser.user)); // Update user data in Redux state
        message.success("Profile updated successfully");
      } else {
        message.error(updatedUser.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Something went wrong");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div>
        <h2>Current Profile Information:</h2>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Address: {user.address}</p>
        <p>Phone Number: {user.phoneNumber}</p>
      </div>
      <Form layout="vertical" onFinish={submitHandler}>
        <Form.Item label="First Name" name="firstName" initialValue={formData.firstName}>
          <Input name="firstName" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" initialValue={formData.lastName}>
          <Input name="lastName" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Address" name="address" initialValue={formData.address}>
          <Input name="address" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" initialValue={formData.phoneNumber}>
          <Input name="phoneNumber" onChange={handleChange} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Update Profile</Button>
      </Form>
    </div>
  );
};

export default Profile;