import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import '../../styles/ProfileStyles.css';
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { Form, Input, message, Button, Row, Col } from "antd";


const Profile = () => {

  const [form] = Form.useForm();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    postalCode: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token"); 
    const userId = user._id;

    axios.get(`/api/user/view-profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const userProfile = response.data.userProfile;

        if (userProfile) {
          console.log('userProfile: ', userProfile);
          setProfile({
            name: userProfile.name || '',
            email: userProfile.email || '',
            address: userProfile.address.streetAddress || '',
            postalCode: userProfile.address.postalCode || '',
            phoneNumber: userProfile.phoneNumber || ''
          });
        }
        console.log('user: ', userProfile);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); 

    const userId = user._id;
    const updateProfileUrl = `/api/user/update-profile/${userId}`; 

    const profileUpdateData = {
      name: profile.name,
      email: profile.email,
      address: {
        streetAddress: profile.address,
        postalCode: profile.postalCode,
      },
      phoneNumber: profile.phoneNumber,
    };

    try {
      const response = await axios.put(updateProfileUrl, profileUpdateData, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const numericValidator = (_, value) => {
    if (!value || /^\d*$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a numeric value'));
  };


  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      {loading ? <Spinner /> : (
        <div className="profile-main-container">
          <h2 className="profile-heading">Profile</h2>
          <div className="profile-container" style={{ padding: '20px' }}>
            <Form
              form={form}
              onFinish={handleSubmit}
              initialValues={profile}
              layout="vertical"
              style={{ maxWidth: '95%', margin: '0 auto' }}
            >
              <Row gutter={[24, 16]}> 
                <Col xs={24} sm={24} md={12}> 
                  <Form.Item label="Name" name="name" rules={[
                    {
                      required: true,
                      message: 'Please input your Name!',
                    },
                  ]} style={{ fontSize: '' }}>
                    <Input name="name" onChange={handleInputChange} placeholder="Enter your name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not a valid email!',
                      },
                      {
                        required: true,
                        message: 'Please input your email!',
                      },
                    ]}
                  >
                    <Input name="email" onChange={handleInputChange} placeholder="Enter your email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 16]}>
                <Col xs={24}>
                  <Form.Item label="Address" name="address" rules={[
                    {
                      required: true,
                      message: 'Please input your Address!',
                    },
                  ]}>
                    <Input name="address" onChange={handleInputChange} placeholder="Enter your address" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12}>
                <Form.Item
  label="Postal Code"
  name="postalCode"
  rules={[
    {
      required: true,
      message: 'Please input your Postal Code!',
    },
    () => ({
      validator(_, value) {
        const pattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        if (!value || pattern.test(value.toUpperCase())) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Postal Code must be in the format A1A1A1'));
      },
    }),
  ]}
>
  <Input name="postalCode" onChange={handleInputChange} placeholder="Enter your postal code" />
</Form.Item>

                </Col>
                <Col xs={24} sm={12}>
                <Form.Item
  label="Phone Number"
  name="phoneNumber"
  rules={[
    {
      required: true,
      message: 'Please input your phone number!',
    },
    () => ({
      validator(_, value) {
        const pattern = /^\(\d{3}\)\d{3}-\d{4}$/;
        if (!value || pattern.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Phone Number must be in the format (403)403-4003'));
      },
    }),
  ]}
>
  <Input name="phoneNumber" onChange={handleInputChange} placeholder="Enter your phone number" />
</Form.Item>

                </Col>
              </Row>
              <Row justify="center" style={{ marginTop: '20px' }}>
                <Col>
                  <button className="btn btn-primary form-btn" type="submit">
                    Save
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      )}
    </Layout>


  );
};

export default Profile;