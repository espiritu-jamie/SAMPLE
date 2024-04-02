import React from "react";
import Layout from "../components/Layout";
import Announcements from "../components/Announcement";
import { useSelector } from "react-redux";
import { Divider } from "antd";

const HomePage = () => {
  const { user } = useSelector((state) => state.user);
  
  const getWelcomeMessage = () => {
    if (user && user.userRole) {
      switch (user.userRole) {
        case "admin": return "Welcome to the Admin Page!";
        case "employee": return "Welcome to the Employee Page!";
        default: return "Welcome!";
      }
    }
    return "Welcome, Guest!";
  };


  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
        {/* Main content section */}
        <div style={{ flex: 3, marginRight: '20px' }}>
          <h2>{getWelcomeMessage()}</h2>
          {/* Other main content goes here */}
        </div>
        <Divider type="vertical" style={{ height: 'auto' }} />
        {/* Announcements section */}
        <Announcements />
      </div>
    </Layout>
  );
};

export default HomePage;

