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

import React,{useState} from "react";
import { useSelector } from "react-redux"; // Import useSelector to access the state
import Layout from "./../components/Layout";

const HomePage = () => {
  const { user } = useSelector((state) => state.user); // Retrieve the user from state
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  // Define a function to determine what welcome message to display
  const getWelcomeMessage = () => {
    if (user && user.userRole) {
      switch (user.userRole) {
        case "admin":
          return "Welcome to the Admin Page!";

        case "employee":
          return "Welcome to the Employee Page!";
        default:
          return "Welcome!";
      }
    }
    return "Welcome, Guest!";
  };
  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, newItem.trim()]); // Add the new item to the list
      setNewItem(""); // Clear the input field
    }
  };
 const renderAdminList = () => {
    if (user && user.userRole === "admin") {
      return (
        <div>
          <h4 className="text-center text-2xl mt-3">Ratings</h4>
          <ul className="border border-gray-300 rounded p-4 mt-4">
            <li className="border-b border-gray-300 py-2">Very good experience</li>
          </ul>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-auto block" onClick={handleAddItem}>Add</button>
        </div>
      );
    }
    return null; // If the user is not an admin, return null (or an empty section)
  };

  return (
    <Layout>
      <h3 className="text-center">{getWelcomeMessage()}</h3>
      {renderAdminList()}
    </Layout>
  );
};

export default HomePage;