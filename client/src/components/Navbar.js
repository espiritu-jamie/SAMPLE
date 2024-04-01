// Navbar.js
import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/NavbarStyles.css';
import About from '../pages/About';

const Navbar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <img src="/jkl.png" alt="logo" className="navbar-logo" />
        <div className="navbar-brand">JKL Cleaning Services</div>
        <ul className="navbar-menu">
          <li><button onClick={() => navigateTo("/")}>Home</button></li>
          <li><button onClick={() => navigateTo("/about")}>About Us</button></li>
          <li><button onClick={() => navigateTo("/book-appointment")}>Book Now</button></li>
          <li><button onClick={() => navigateTo("/login")}>Login</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;