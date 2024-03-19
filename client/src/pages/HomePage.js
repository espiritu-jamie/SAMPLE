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
          return "Welcome to the Admin Page!";
        case "employee":
          return "Welcome to the Employee Page!";
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
