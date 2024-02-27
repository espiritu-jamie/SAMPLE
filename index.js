const express = require("express");
const colors = require("colors");
const morgan = require("morgan"); // Corrected typo from 'moragan' to 'morgan'
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoute');
const availabilityRoutes = require('./routes/availabilityRoute'); 
const notificationRoutes = require('./routes/notificationRoute'); 
const appointmentRoutes = require('./routes/appointmentRoute');
const connectDb = require("./config/connectDb");
const path = require("path");

//dotenv config
dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(morgan("dev")); // Corrected typo

// Routes
app.use("/api/user", userRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use("/api/notification", notificationRoutes); 
app.use("/api/appointment", appointmentRoutes);

// Static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.green); // Example of using 'colors'
});
