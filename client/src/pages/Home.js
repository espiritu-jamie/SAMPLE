// Home.js
// import React from 'react';
// import Navbar from '../components/Navbar';
// import '../styles/HomeStyles.css';

// const Home = () => {
//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="hero-section">
//       </div>
//     </div>
//   );
// };

// export default Home;
import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="hero-section">
        <div className="hero-content">
          {/* Place your content here */}
          <h1>Welcome to Our Website</h1>
          <p>This is a great place to introduce visitors to your site.</p>
        </div>
        <div className="hero-image">
          {/* Replace 'image-url.jpg' with the path to your image */}
          <img src="/cleaning-made-easy.jpg"/>
        </div>
      </div>
    </div>
  );
};

export default Home;