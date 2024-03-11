import React from "react";
import { Link } from "react-router-dom";

const BusinessHome = () => {
    return (
    <div>
        <Link to="/Login" aria-label="Login">
            <button className="bg-blue-700 text-black text-center">Login</button>
        </Link>
        <div className="h-screen flex flex-col items-start content-center">
            <div className="bg-gray-200 p-8 w-full  max-w-screen-xl">
                <div className="bg-blue-300 w-2/5 mx-auto p-4">
                    <p className="text-xl text-black font-bold text-center"> Welcome to JKL Cleaning Services!</p>
                    <p className="text-l text-black text-center">Your spotless</p>
                    <p className="text-l text-black text-center">sanctuary starts here!</p>
                    <hr className="my-4 border-2 border-black" aria-hidden="true" />
                    <p className="text-lg text-black text-center">Contact us!</p>
                    <p className="text-l text-yellow-600 font-bold text-center">(587) 999 9999</p>
                </div>
            </div>
        </div>
    </div>
    );
}

export default BusinessHome;