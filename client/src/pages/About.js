import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import '../styles/AboutStyles.css';

const AboutMe = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <div className="hero-section relative bg-cover bg-center">
      <img className="hero-image" src="/Aboutpic.jpg" alt="hero_bg" />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="text-white text-center px-5">
            <h1 className="headline">About <span className="accent-text">JKL Cleaning Service</span></h1>
            <p className="description-text">
              JKL Cleaning Service is committed to providing the highest quality cleaning services to our customers.
              <br /> 
              Our motto is simple: We believe in delivering cleanliness and satisfaction beyond expectations.
              <br />
              With our dedicated team and attention to detail, we ensure that every corner is spotless and every customer is delighted.
            </p>
            <p className="description-text">
              Founded in the heart of Calgary, Alberta, JKL Cleaning Service has been a trusted name in the cleaning industry for <b><span className="accent-text">15 years.</span></b> Our journey began with a commitment to providing unparalleled cleaning services to our community, and today, we continue to uphold that promise with passion and dedication.
              At JKL Cleaning Service, we understand the importance of a clean and inviting space, and our journey started with the vision of making this a reality for homes and businesses in Calgary. Over the years, our commitment to excellence has allowed us to expand our services and establish a reputation for delivering exceptional cleaning solutions.
              What sets JKL Cleaning Service apart is our unwavering dedication to customer satisfaction. We take pride in our skilled and professional team, who bring years of experience to every cleaning project. Our meticulous attention to detail ensures that your home or business receives the thorough cleaning it deserves.
              Having originated in Calgary, Alberta, we have deep roots in the community we serve. Our local understanding, combined with 15 years of industry expertise, positions us as a reliable and trusted cleaning partner for our clients.
              Whether you're looking for residential or commercial cleaning services, JKL Cleaning Service is here to exceed your expectations. Join the many satisfied customers who have entrusted us with their cleaning needs, and experience the difference that 15 years of dedication to excellence can make.
              Choose JKL Cleaning Service for a cleaner, healthier, and happier living or working space. We look forward to continuing our journey of providing top-notch cleaning services to the vibrant community we call home.
            </p>
            <h1 className="headline">A Professional Cleaning <span className="accent-text">Service You Can Trust</span></h1>
            <p className="Golden"><b>Immaculate Precision <br/>Spotless Excellence<br/>Thorough Cleanliness<br/>Pristine Perfection<br/> Meticulous Care<br/>Exemplary Hygiene<br/>Sparkling Brilliance<br/>Supreme Freshness<br/>Unmatched Clean<br/>Top-Tier Sanitation</b></p><br/>
            <button className="view-more-button" onClick={() => navigateTo("/contact")}>Contact</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutMe;