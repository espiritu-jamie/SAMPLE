import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import '../styles/AboutStyles.css'; 
import Footer from '../components/Footer';

const AboutMe = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div>
    <Navbar />
    <div className='aboutme-container'>

          <div className="text-container">
          <h1 className="headline">About <span className="accent-text">JKL Cleaning Service</span></h1>
  
  <h2 className="subheading">Our Mission</h2>
  <p className="description-text">
    JKL Cleaning Service is committed to providing the highest quality cleaning services to our customers.
    Our motto is simple: We believe in delivering cleanliness and satisfaction beyond expectations.
    With our dedicated team and attention to detail, we ensure that every corner is spotless and every customer is delighted.
  </p>

  <h2 className="subheading">Our Journey</h2>
  <p className="description-text">
    Founded in the heart of Calgary, Alberta, JKL Cleaning Service has been a trusted name in the cleaning industry for 15 years.
  </p>
  <ul className="description-list">
    <li>Our journey began with a commitment to providing unparalleled cleaning services to our community.</li>
    <li>Over the years, our commitment to excellence has allowed us to expand our services and establish a reputation for delivering exceptional cleaning solutions.</li>
    <li>What sets us apart is our unwavering dedication to customer satisfaction.</li>
  </ul>
  
  <h2 className="subheading">Why Choose Us?</h2>
  <p className="description-text">
    Whether you're looking for residential or commercial cleaning services, JKL Cleaning Service is here to exceed your expectations. Join the many satisfied customers who have entrusted us with their cleaning needs.
  </p>
  <ul className="description-list">
    <li>Skilled and professional team with years of experience.</li>
    <li>Meticulous attention to detail for thorough cleaning.</li>
    <li>Deep roots in Calgary, Alberta, with 15 years of industry expertise.</li>
  </ul>
            <button className="view-more-button" onClick={() => navigateTo("/register")}>Book Now</button>
          </div>
        </div>
        <Footer />
</div>

  );
};

export default AboutMe;

