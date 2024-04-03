import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <div className="hero-image">
          <img src="/cleaning-made-easy.jpg" alt="Effortless cleaning in action"/>
        </div>
        <div className="text-container">
          <div className="hero-content">
            <h1>JKL CLEANING SERVICE</h1>
            <p>We Treat Your House Like Ours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;