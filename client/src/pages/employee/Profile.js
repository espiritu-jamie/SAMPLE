// Profile.js
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
    axios.get("/view-profile")
      .then((response) => {
        setProfile(response.data.userProfile);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    axios.put("/update-profile", profile)
      .then(() => {
        message.success("Profile updated successfully");
      })
      .catch((error) => {
        message.error("Failed to update profile");
      });
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
          <Form.Item label="First Name" name="firstName">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Street Address" name={["address", "streetAddress"]}>
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="City" name={["address", "city"]}>
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="State" name={["address", "state"]}>
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Postal Code" name={["address", "postalCode"]}>
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