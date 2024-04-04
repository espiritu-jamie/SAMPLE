import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Home = () => {
  return (
    <div className="home-container">
  <Navbar />
  <div className="hero-section">
    <img className="hero-image rounded-full" src="/ThreeCleaners.jpg" alt="hero_bg" />
    <div className="content-container flex-col">
      <div className="text-logo-container">
        <div className="text-box">
          <p><b>JKL CLEANING SERVICE</b>We Treat Your House Like Ours</p>
        </div>
        <img src="/jkl.png" alt="JKL Logo" className="top-image" />
      </div>
    </div>
  </div>
  {/* New container for three divs */}
  <div className='text-bottom'>
  <p class>HOW JKL CLEANING SERVICE WORKS</p>
  </div>
  <div className="feature-container">
    <div className="feature">
      <img src="/BookingPerson.avif" alt="Feature 1" />
      <p>Select the time and date</p>
    </div>
    <div className="feature">
      <img src="/VacuumImage.jpeg" alt="Feature 2" />
      <p>Cleaners come cover to clean your house</p>
    </div>
    <div className="feature">
      <img src="/RelaxingPerson.webp" alt="Feature 3" />
      <p>Sit back and relax. Enjoy your clean house!</p>
    </div>
    <div className="gold-rectangle"></div>
  </div>
</div>
  
  );
}

export default Home;