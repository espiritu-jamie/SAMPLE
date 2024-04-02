// Home.js
import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <img className="hero-image " src="/Cleaning1.jpg" alt="hero_bg" />
        <div className="content-container">
          <div className="text-container">
            <h1 className="headline">Why <span className="accent-text">JKL Service?</span></h1>
            <p className="choice-text">Wide Options of Choice</p>
            <p className="description-text">
              The Best Cleaning Service in Town.
              <br /> What are you waiting for?
            </p>
            <button className="view-more-button" >View More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
