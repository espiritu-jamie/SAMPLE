import React, { useState } from 'react';
import login from "../App" 
//import { AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  return (
    <nav className="container pt-6">
      <div className="flex justify-between items-center shadow-lg w-auto" >
        <img src="/jkl.png" width={100} height={100} alt="logo" />

        <ul className="md:flex gap-8 items-center font-semibold text-[14px] hidden">
          <li className="text-[24px] text-cyan-800"> JKL CLeaning Services</li>
          </ul>
        <ul className="md:flex gap-8 items-center font-semibold text-[20px] hidden">
          <li><button className="bg-yellow-600 text-white px-6 py-2 rounded-3xl text-[14px] sm:text-[16px] shadow-lg">
            Home
          </button></li>
          <li><button className="bg-yellow-600 text-white px-6 py-2 rounded-3xl text-[14px] sm:text-[16px] shadow-lg">
            About Us
          </button></li>
          <li><button  className="bg-yellow-600 text-white px-6 py-2 rounded-3xl text-[14px] sm:text-[16px] shadow-lg">
           Book Now!
          </button></li>
        </ul>

       
      </div>
    </nav>
  );
};

export default Navbar;
