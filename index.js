const express = require("express");
const colors = require("colors");
const morgan = require("morgan"); 
const dotenv = require("dotenv");
const userRoutes = require('./routes/userRoute');
const availabilityRoutes = require('./routes/availabilityRoute'); 
const notificationRoutes = require('./routes/notificationRoute'); 
const appointmentRoutes = require('./routes/appointmentRoute');
const announcementRoutes = require('./routes/announcementRoute');
const ratingRoutes = require('./routes/ratingRoute');
const connectDb = require("./config/connectDb");
const path = require("path");

//dotenv config
dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(morgan("dev")); 

// Routes
app.use("/api/user", userRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use("/api/notification", notificationRoutes); 
app.use("/api/appointment", appointmentRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/rating", ratingRoutes);

// Static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Data successfully fetched!' });
});

const PORT = process.env.PORT || 4001;

const cors = require('cors');

// CORS configuration - adjust the origin to match your deployment URL
app.use(cors({
    origin: 'https://your-vercel-deployment-url.vercel.app', // Adjust this to your Vercel frontend URL
}));


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`.green); 
});
