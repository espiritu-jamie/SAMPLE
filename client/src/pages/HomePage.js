import React from "react";
import Layout from "../components/Layout";
import Announcements from "../components/Announcement";
import { useSelector } from "react-redux";
import { Divider } from "antd";
import { Carousel } from "antd";

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
        <div style={{ flex: 3, marginRight: '20px', maxWidth: '700px' }}>
          <h2 style={{ paddingBottom: '20px'}}>{getWelcomeMessage()}</h2>
          {/* <img src="/house-cleaning-service.jpg" alt="Cleaning Service" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '20px', paddingTop: '10px' }} /> */}
          <Carousel autoplay style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div>
              <img src="/man-cleaning-house.jpg" alt="Man Cleaning" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
            </div>
            <div>
              <img src="/clean-kitchen.jpg" alt="Clean Kitchen" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
            </div>
            <div>
              <img src="/house-cleaning-service.jpg" alt="Cleaning Service" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
            </div>
            <div>
              <img src="/clean-bedroom.jpg" alt="Clean Bedroom" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
            </div>
          </Carousel>
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

