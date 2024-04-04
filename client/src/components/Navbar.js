// Navbar.js
import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/NavbarStyles.css';
// import { Link } from 'react-router-dom';



const Navbar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };


  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <li><button onClick={() => navigateTo("/")}>Home</button></li>
          <li><button onClick={() => navigateTo("/about")}>About Us</button></li>
          <li><button onClick={() => navigateTo("/Contact")}>Contact Us</button></li>
          <li><button onClick={() => navigateTo("/login")}>Login</button></li>
          {/* <img src="/phoneICON.png" alt="logo" className="navbar-logo" />
      <span className="phone-number">587-897-6290</span> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;