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
    axios.get("/view-profile/:userId")
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
  
    try {
      const response = await axios.get("/auth", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      const userId = response.data.data.id;

      console.log("Profile object:", profile);
  
      // Now, you can use the userId to update the profile
      axios.put(`/update-profile/${userId}`, profile)
        .then(() => {
          message.success("Profile updated successfully");
        })
        .catch((error) => {
          message.error("Failed to update profile");
        });
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to fetch user data");
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
