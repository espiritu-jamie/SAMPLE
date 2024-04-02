import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const AboutMe = () => {
  return (
    <div className="aboutme-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image rounded-full" src="/Cleaning2.jpg" alt="hero_bg" />
        <div className="content-container flex-col">
          <div className="text-container ">
            <h1 className="headline">About <span className="accent-text">JKL Cleaning Service</span></h1>
            <p className="description-text">
              JKL Cleaning Service is committed to providing the highest quality cleaning services to our customers.
              <br /> 
              Our motto is simple: We believe in delivering cleanliness and satisfaction beyond expectations.
              <br />
              With our dedicated team and attention to detail, we ensure that every corner is spotless and every customer is delighted.
            </p>
            <button className="view-more-button" >Contact Us</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutMe;
