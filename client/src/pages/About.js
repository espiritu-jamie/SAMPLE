//About.js
import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';



const About = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image" src="/Cleaning1.jpg" alt="hero_bg" />
        <div className="content-container">
          <div className="text-container">
            <p className="choice-text">Wide Options of Choice</p>
            <h1 className="headline">About <span className="accent-text">Us</span></h1>
            <p className="description-text">
              The Best Cleaning Service in Town.
              <br /> What are you waiting for?
            </p>
            <button className="view-more-button">HALLOW</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
