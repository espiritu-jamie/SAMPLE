import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import '../../styles/ProfileStyles.css';
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { Form, Input, message, Button, Row, Col } from "antd";


const Profile = () => {

  // State for managing the form data
  const [form] = Form.useForm();
  // correctly set the default params of profile.
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    postalCode: '',
    phoneNumber: ''
  });

  // State for managing loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Accessing the current user from Redux store
  const { user } = useSelector((state) => state.user);

  // useEffect hook to fetch the user's profile data when the component mounts. 
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, []);

  // Function to fetch the user's profile using an API call
  const fetchUserProfile = () => {
    const token = localStorage.getItem("token"); // Retrieving token from localStorage

    // Retrieve the user's ID from the Redux store's user state. This ID is necessary to construct the URL. 
    const userId = user._id;

    // Make a GET request to the server using axios to fetch the profile information of the user.
    // The URL includes the userId to specify which user's profile to retrieve.
    // The Authorization header is included in the request to provide the JWT token for authentication. 
    axios.get(`/api/user/view-profile/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const userProfile = response.data.userProfile;

        // Check if userProfile is not null or undefined. This is to ensure that we only attempt to
        // update the component's state if valid profile data was returned from the server.
        if (userProfile) {
          // Update the component's state with the fetched profile data. Each piece of information is
          // extracted from the userProfile object. Default values ('') are provided in case any piece of
          // information is missing from the userProfile to prevent undefined values in the state.  
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
        setLoading(false); // Setting loading to false after fetching data
      })
      .catch((error) => {
        setError(error.message); // Handling errors by setting error state
        setLoading(false);
      });
  };

  // Handler for form input changes, updates the profile state with the new values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the profile state using a functional update. The 'prevProfile' parameter
    // represents the current state. A new state object is returned, created by spreading the
    // properties of 'prevProfile' into a new object and then updating the property corresponding
    // to the 'name' of the input field that triggered the change event with the new 'value'.
    // This approach ensures that the state update is based on the most recent state and avoids direct state mutations.  
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value, // Dynamically updating the right profile attribute based on input name
    }));
  };

  // Function to submit the profile form, sending a PUT request to the API
  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token stored in localStorage

    // added the user.id from the user saved in the redux store 
    const userId = user._id;
    const updateProfileUrl = `/api/user/update-profile/${userId}`; // 

    // Prepare the profile update data to be sent in the PUT request payload.
    // This object structure should align with what the server expects for the profile update endpoint.  
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

  // Custom numeric validator for form fields
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
              <Row gutter={[24, 16]}> {/* Adjusted gutter for better spacing on smaller screens */}
                <Col xs={24} sm={24} md={12}> {/* Full width on small screens, half width on medium and larger screens */}
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
        // Regular expression to match Canadian postal code format A1A1A1
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
        // Regular expression to match the phone number format (403)403-4003
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