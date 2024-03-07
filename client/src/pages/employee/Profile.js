// import React, { useState, useEffect } from "react";
// import { Form, Input, message, Button } from "antd";
// import axios from "axios";
// import Layout from "../../components/Layout";


// const Profile = ({ user }) => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     phoneNumber: "",
//   });

//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const loadUserProfile = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       const response = await axios.get(`/api/user/view-profile/${user.userId}`, { headers });
//       const userProfile = response.data;

//       setFormData({
//         firstName: userProfile.firstName,
//         lastName: userProfile.lastName,
//         address: userProfile.address,
//         phoneNumber: userProfile.phoneNumber,
//       });
//     } catch (error) {
//       console.error("Error loading profile:", error);
//       message.error("Something went wrong");
//     }
//   };

//   const submitHandler = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };

//       const updatedUser = await axios.put(`/api/user/update-profile`, formData, { headers });
//       message.success("Profile updated successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       message.error("Something went wrong");
//     }
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   return (
//     <Layout>
//     <div className="profile-page">
//       <h1>Profile</h1>
//       <div>
//         <h2>Current Profile Information:</h2>
//         <p>First Name: {formData.firstName}</p>
//         <p>Last Name: {formData.lastName}</p>
//         <p>Address: {formData.address}</p>
//         <p>Phone Number: {formData.phoneNumber}</p>
//       </div>
//       <Form layout="vertical" onFinish={submitHandler}>
//         <Form.Item label="First Name" name="firstName" initialValue={formData.firstName}>
//           <Input name="firstName" onChange={handleChange} />
//         </Form.Item>
//         <Form.Item label="Last Name" name="lastName" initialValue={formData.lastName}>
//           <Input name="lastName" onChange={handleChange} />
//         </Form.Item>
//         <Form.Item label="Address" name="address" initialValue={formData.address}>
//           <Input name="address" onChange={handleChange} />
//         </Form.Item>
//         <Form.Item label="Phone Number" name="phoneNumber" initialValue={formData.phoneNumber}>
//           <Input name="phoneNumber" onChange={handleChange} />
//         </Form.Item>
//         <Button type="primary" htmlType="submit">Update Profile</Button>
//       </Form>
//     </div>
//     </Layout>
//   );
// };

// export default Profile;