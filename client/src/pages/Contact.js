import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/ContactStyles.css';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="contact-page-container"> 
        <div className="contact-container"> 
          <h1 className="headline"><span className="accent-text">Contact</span> Us</h1>
          <p className="description-text">
            If you have any questions about JKL Cleaning Service or wish to inquire about our services and pricing, please feel free to reach out. We're here to help with any inquiries or assistance you might need.
          </p>
        
        <div className="contact-details-container"> 
          <div className="contact-detail email-container"> 
            <h2 className="contact-method">Send us an email</h2>
            <p className="contact-description">
              Pen us your concerns or requests. We'll make sure to sweep up a response in no time!
            </p>
            <p className="contact-info"><u>info@jklCleaning.com</u></p>
          </div>

          <div className="contact-detail phone-container"> 
            <h2 className="contact-method">Talk with us</h2>
            <p className="contact-description">
              Got questions or need immediate assistance? Call us now. Our team is always ready to mop up your worries!
            </p>
            <p className="contact-info">(403) 403-4003</p>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
