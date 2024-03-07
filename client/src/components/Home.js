import React from "react";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="relative min-h-screen">
    <Navbar />
      <img
        className="lg:w-[580px] xl:w-[620px] h-auto absolute right-0 top-0 -z-10"
        src="/Cleaning1.jpg"
        width={1000}
        height={600}
        alt="hero_bg"
      />
      <div className="container h-[calc(100vh-120px)] grid items-center">
        <div className="space-y-4 bg-[#ffffff98] w-fit p-4">
          <p className="uppercase font-medium">Wide options of choice</p>
          <h2 className="text-4xl sm:text-6xl font-bold">
          About <span className="text-accent">Us</span>
          </h2>
          <p className="text-gray-700 text-[14px] sm:text-[16px]">
            Best Cleaning Service in the Town.
            <br /> What are you waiting for?
          </p>

          <button className="bg-accent text-white px-6 py-2 rounded-3xl text-[14px] sm:text-[16px]">
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
