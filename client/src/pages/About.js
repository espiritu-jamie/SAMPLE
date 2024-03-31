import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css'; 
const About = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image" src="/About.jpg" alt="hero_bg" /> 
        <div className="content-container">
          <div className="text-container">
            <p className="choice-text">Our Story</p>
            <h1 className="headline">About <span className="accent-text">Us</span></h1>
            <p className="description-text">
              Welcome to Our Company! We are dedicated to providing the best services to our customers.
              <br /> Learn more about our journey and our team.
            </p>
            <button className="view-more-button">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
