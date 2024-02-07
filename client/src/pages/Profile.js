import { Form, Input, message, Button } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/features/userSlice";
import { updateprofilecontroller, viewprofilecontroller } from "../controllers/profileControl"; // Import the profile control functions

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Assuming user data is stored in Redux state

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    phoneNumber: user.phoneNumber,
  });

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

  // Function to view user profile
  const viewProfile = async () => {
    try {
      const userProfile = await viewprofilecontroller(user.userId); // Call the viewprofilecontroller function
      if (userProfile.success) {
        // Display user profile data
        console.log("User Profile:", userProfile.userProfile);
      } else {
        message.error(userProfile.message);
      }
    } catch (error) {
      console.error("Error viewing profile:", error);
      message.error("Something went wrong");
    }
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
        <Form.Item label="First Name" name="firstName" initialValue={user.firstName}>
          <Input name="firstName" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" initialValue={user.lastName}>
          <Input name="lastName" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Address" name="address" initialValue={user.address}>
          <Input name="address" onChange={handleChange} />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber" initialValue={user.phoneNumber}>
          <Input name="phoneNumber" onChange={handleChange} />
        </Form.Item>
        <Button type="primary" htmlType="submit">Update Profile</Button>
      </Form>
      <Button onClick={viewProfile}>View Profile</Button>
    </div>
  );
};

export default Profile;