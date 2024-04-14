import React from 'react';
import { Carousel, Row, Col, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/HomeStyles.css';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Navbar />
    <div className="home-container">
      <div className="combined-section">
        <div className="carousel-wrapper">
          <Carousel autoplay style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div>
              <img className="carousel-image" src="/jkl.png" alt="JKL Logo" />
            </div>
            <div>
              <img className="carousel-image" src="/ThreeCleaners.jpg" alt="Cleaning Team" />
            </div>
            <div>
              <img className="carousel-image" src="/Cleaning1.jpg" alt="Additional Image" />
            </div>
            <div>
              <img className="carousel-image" src="/Cleaning2.jpg" alt="More Scenes" />
            </div>
          </Carousel>
        </div>
        <div className="text-section">
          <h1>JKL <span className="accent-text">CLEANING SERVICE</span></h1>
          <p>We treat your house like ours!</p>
          <p>With a team of trusted professionals, we ensure every nook and cranny is handled with care, providing a spotless, refreshing home environment for you and your loved ones.</p>
          <button className="book-now-button" onClick={() => navigateTo("/register")}>Book Now</button>
        </div>

      </div>
      {/* New container for three divs */}
      <div className='how-it-works-container'>
      <div className='text-bottom'>
        <h3>HOW IT WORKS</h3>
      <div className="feature-container">
        {renderFeatures()}
      </div>
      </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

const renderFeatures = () => {
  const features = [
    {
      src: "/BookingPerson.avif",
      alt: "Feature 1",
      title: "Select the time and date",
      description: "Choose a time that works best for you with our flexible scheduling."
    },
    {
      src: "/VacuumImage.jpeg",
      alt: "Feature 2",
      title: "We clean your house",
      description: "Our trained professionals will take care of your space as if it were their own."
    },
    {
      src: "/RelaxingPerson.webp",
      alt: "Feature 3",
      title: "Relax and enjoy",
      description: "Sit back and relax. Enjoy your sparkling clean home!"
    }
  ];

  return (
    <Row gutter={100} justify="center">
      {features.map((feature, index) => (
        <Col key={index} xs={24} sm={12} md={8}>
          <Card
            style={{
              width: 330,
              textAlign: 'center',
              boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.2)'
            }}
            cover={<img alt={feature.alt} src={feature.src} />}
          >
            <Card.Meta
              className="feature-title"
              title={<div className="custom-title">{feature.title}</div>}
              description={<div className="custom-description">{feature.description}</div>}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}


export default Home;


