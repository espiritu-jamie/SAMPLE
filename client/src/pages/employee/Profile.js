// import React, { useState, useEffect } from "react";
// import { Form, Input, message, Button } from "antd";
// import axios from "axios";
// import Layout from "../../components/Layout";

// const Profile = () => {
//   const [form] = Form.useForm();
//   const [profile, setProfile] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchUserProfile(); // Fetch user profile when component mounts
//   }, []);

//   const fetchUserProfile = () => {
//     axios.get("/view-profile/:userId")
//       .then((response) => {
//         const userProfile = response.data.userProfile;
//         setProfile(userProfile); // Assuming the response includes user data directly
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error.message);
//         setLoading(false);
//       });
//   };

//   const handleInputChange = (e) => {
//     setProfile({
//       ...profile,
//       [e.target.name]: e.target.value,
//     });
//   };

//  const handleSubmit = () => {
//   const userId = profile.user._id; // Assuming userId is stored in the profile object
//   axios.put(`/update-profile/${userId}`, profile) // Updated URL with userId parameter
//     .then(() => {
//       message.success("Profile updated successfully");
//     })
//     .catch((error) => {
//       message.error("Failed to update profile");
//     });
// };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <Layout>
//       <div className="profile-container">
//         <h2>Profile</h2>
//         <Form
//           form={form}
//           onFinish={handleSubmit}
//           initialValues={profile}
//           layout="vertical"
//         >
//           <Form.Item label="First Name" name="firstName">
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="Last Name" name="lastName">
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="Email" name="email">
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="Street Address" name={["address", "streetAddress"]}>
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="City" name={["address", "city"]}>
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="State" name={["address", "state"]}>
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="Postal Code" name={["address", "postalCode"]}>
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item label="Phone Number" name="phoneNumber">
//             <Input onChange={handleInputChange} />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit">Save</Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </Layout>
//   );
// };

// export default Profile;

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

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token stored in localStorage
  
    // Adjust the profileUpdateData object to match the userModel structure
    const profileUpdateData = {
      name: profile.name, // Assuming you have a name field in your profile state
      email: profile.email,
      address: {
        streetAddress: profile.streetAddress, // Make sure these fields are managed in your profile state
        city: profile.city,
        state: profile.state,
        postalCode: profile.postalCode,
      },
      // Add any other fields you want to update that match the userModel structure
    };
  
    try {
      // Sending the PUT request to the update profile endpoint
      const response = await axios.put('/update-profile', profileUpdateData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the authorization header
        },
      });
  
      // Handle the response from the backend
      if (response.data.success) {
        message.success("Profile updated successfully");
        // Optionally, you might want to fetch the updated profile data here or update the UI accordingly
      } else {
        // Handle cases where the backend response indicates failure
        message.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during the API request
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
          <Form.Item label="First Name" name="firstName">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Email" name="email">
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
