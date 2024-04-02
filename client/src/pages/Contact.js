import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Contact = () => {
  return (
    <div className="Contact-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image rounded-full" src="/login.jpg" alt="hero_bg" />
        <div className="content-container">
          <div className="text-container">
            <h1 className="headline">Contact Us</h1>
            <p className="description-text">
              At JKL Cleaning Service, we value open communication with our customers. Your feedback, questions, and concerns are important to us as they help us serve you better. Whether you have inquiries about our services, want to provide feedback, or need assistance with a cleaning project, we encourage you to reach out to us. Our dedicated team is here to assist you and ensure your experience with us is nothing short of exceptional.
            </p>
            <p className="description-text">
              For any inquiries or assistance, please don't hesitate to contact us at:
              <br />
              Phone Number: XXX XXX XXXX
            </p>
            {/* You can add more contact information here, like email, address, etc. */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
