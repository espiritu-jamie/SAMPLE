// import { Row } from "antd";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import DoctorList from "../components/DoctorList";
// import Layout from "./../components/Layout";

// const HomePage = () => {
//   const [doctors, setDoctors] = useState([]);
//   // login user data
//   const getUserData = async () => {
//     try {
//       const res = await axios.get(
//         "/api/user/getAllDoctors",

//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);
//   return (
//     <Layout>
//       <h3 className="text-center">Home Page</h3>
//       <br/>
//       <Row>
//         {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
//       </Row>
//     </Layout>
//   );
// };

// export default HomePage;

import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access the state
import Layout from "./../components/Layout";

const HomePage = () => {
  const { user } = useSelector((state) => state.user); // Retrieve the user from state

  // Define a function to determine what welcome message to display
  const getWelcomeMessage = () => {
    if (user && user.userRole) {
      switch (user.userRole) {
        case "admin":
          return "Welcome, Admin!";
        case "employee":
          return "Welcome, Employee!";
        default:
          return "Welcome!";
      }
    }
    return "Welcome, Guest!";
  };

  return (
    <Layout>
      <h3 className="text-center">{getWelcomeMessage()}</h3>
      {/* You can remove the rest of the code related to doctors if it's not needed */}
    </Layout>
  );
};

export default HomePage;
