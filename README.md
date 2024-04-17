# JKL Cleaning Service Web-based Platform

## Project Overview

The JKL Cleaning Service Web-based Platform is dedicated to modernizing the operational aspects of JKL Cleaning Service. This intuitive online platform enhances customer interaction and employee management, featuring critical functionalities such as online booking, employee scheduling, and comprehensive administrative tools. Our aim is to improve efficiency, accuracy, and customer satisfaction, driving continuous growth and prosperity in the digital age.

## Main Features

- **Online Booking:** Allows customers to book cleaning services online at their convenience.
- **Employee Scheduling:** Enables efficient management of employee schedules, reducing conflicts and optimizing workforce utilization.
- **Administrative Tools:** Comprehensive set of tools for managing schedules, appointments, and customer interactions seamlessly.

## Technical Stack

This platform is built using the MERN stack (MongoDB, Express.js, React, Node.js), ensuring a robust, scalable, and responsive user experience.

- **MongoDB:** A document-oriented NoSQL database used to store application data.
- **Express.js:** A web application framework for Node.js, designed for building web applications and APIs.
- **React:** A JavaScript library for building user interfaces, particularly single-page applications where you need fast interactions.
- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine, used for building scalable network applications.

Additionally, we utilize the following technologies for enhanced security and functionality:

- **JWT (JSON Web Token):** Used for secure user authentication and authorization. JWTs allow us to transmit secure information between the client and server as a JSON object.
- **Bcrypt:** A password hashing library that helps us securely store user passwords. By hashing and salting the passwords, bcrypt ensures that even if the password data is compromised, the actual passwords remain secure.

## Adaptation from Existing Repository

This project is adapted from the [AppointDoc repository](https://github.com/OviSarkar62/AppointDoc) by OviSarkar62, which originally focuses on patient/doctor appointments. We have customized and extended this to fit the specific needs of a cleaning service management system.

## Collaboration

This project is developed in collaboration with JKL Cleaning Service to tailor every aspect of the platform to the unique requirements of their business operations.

## Installation

### Prerequisites

- Node.js
- npm (Node Package Manager)

Ensure you have Node.js and npm installed on your system. If not, you can download and install them from [Node.js official website](https://nodejs.org/).

### Setup

Clone the repository and navigate into it:

```bash
git clone <repository-url>
cd <repository-directory>
```

Create a .env file in the root directory with the following contents:

```bash
DB_URL = mongodb+srv://<user>:<pass>@cluster0.l17quyr.mongodb.net/database
JWT_SECRET = <your-jwt-secret>
PORT = 4000
```

Install dependencies in both the root and client directories:

```bash
# Install server dependencies
npm install
# Navigate to the client directory
cd client
# Install client dependencies
npm install
```

### Running the Application
To start the server:

```bash
# In the root directory
npm start
```

To start the client:

```bash
# In the client directory
npm start
```

Access the application by navigating to http://localhost:3000 in your web browser.

## Security
Data security is a paramount aspect of the JKL Cleaning Service Web-based Platform. We employ advanced security measures including encrypted data storage, secure authentication mechanisms, and robust access controls to protect sensitive information.

## Future Enhancements
We are committed to continuously improving the platform by integrating more features based on user feedback and advancing technology to support the growing needs of JKL Cleaning Service.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments
Thanks to OviSarkar62 for the original AppointDoc repository, which provided a solid foundation for our adaptation.
Gratitude to the team members and contributors who have made this project possible.

