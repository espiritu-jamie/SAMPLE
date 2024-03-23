

import React, { useState, useEffect } from "react";
import { Form, Input, message, Button } from "antd";
import axios from "axios";
import Layout from "../../components/Layout";

const Profile = () => {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile(); // Fetch user profile when component mounts
  }, []);

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    axios.get("/view-profile/:userId", { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const userProfile = response.data.userProfile;
        setProfile(userProfile); // Assuming the response includes user data directly
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async () => {
  //   const token = localStorage.getItem("token"); // Retrieve the JWT token stored in localStorage
  
  //   // Adjust the profileUpdateData object to match the userModel structure
  //   const profileUpdateData = {
  //     name: profile.name,
  //     email: profile.email,
  //     address: {
  //       streetAddress: profile.streetAddress,
  //       postalCode: profile.postalCode,
  //     },
  //     phoneNumber: profile.phoneNumber,
  //   };

    
  
  //   try {
  //     // Sending the PUT request to the update profile endpoint
  //     const response = await axios.put('/update-profile/:userId', profileUpdateData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Include the JWT token in the authorization header
  //       },
  //     });
  
  //     // Handle the response from the backend
  //     if (response.data.success) {
  //       message.success("Profile updated successfully");
  //       // Optionally, you might want to fetch the updated profile data here or update the UI accordingly
  //     } else {
  //       // Handle cases where the backend response indicates failure
  //       message.error("Failed to update profile. Please try again.");
  //     }
  //   } catch (error) {
  //     // Handle any errors that occur during the API request
  //     console.error("Error updating profile:", error);
  //     message.error("Failed to update profile due to an error.");
  //   }
  // };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token stored in localStorage
  
    // Adjust the URL to include the actual userId
    const updateProfileUrl = `/update-profile/${profile.userId}`;
  
    const profileUpdateData = {
      name: profile.name,
      email: profile.email,
      address: {
        streetAddress: profile.streetAddress,
        postalCode: profile.postalCode,
      },
      phoneNumber: profile.phoneNumber,
    };
  
    try {
      const response = await axios.put(updateProfileUrl, profileUpdateData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the authorization header
        },
      });
  
      if (response.data.success) {
        message.success("Profile updated successfully");
      } else {
        message.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile due to an error.");
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
    <div className="profile-container">
      <h2>Profile</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={profile}
        layout="vertical"
      >
        <Form.Item label="Name" name="name">
          <Input onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Postal Code" name="postalCode">
          <Input onChange={handleInputChange} />
        </Form.Item>
        <Form.Item label="Phone Number" name="phoneNumber">
          <Input onChange={handleInputChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    </div>
  </Layout>
  );
};

export default Profile;
