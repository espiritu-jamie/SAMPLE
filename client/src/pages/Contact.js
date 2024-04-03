import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Contact = () => {
  return (
    <div className="Contact-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image rounded-full" src="/Cleaning2.jpg" alt="hero_bg" />
        <div className="content-container">
          <div className="text-container">
            <h1 className="headline"><span className="accent-text">Contact</span> Us</h1>
            <p className="description-text">
                If you have any questions about JKL Cleaning Service or want to inquire about out services and pricing please contact JKL Cleaning Service.<br/>The form and provided contact information are exclusively for general inquires directed to the JKL Cleaning Services Support Office. 
                <br/><br/><b>JKL Cleaning Service</b><br/>123 Main Street,<br/>Calgary, Alberta J9K9L9<br/>Toll-free: 1-587-999-9999<br/>Email: <u>info@jklCleaning.com</u>
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