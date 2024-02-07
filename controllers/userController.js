const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Availability = require("../models/availabilityModel");
const Notification = require("../models/notificationModel");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid Password');
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:"1d"},);
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      user.password = undefined; // move this line here
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const getUserRole = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('User not found');
  return user.userRole; // Assuming userRole field exists
};

// Function to send a notification
const sendNotificationController = async (userId, type, message, data) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message,
      data,
    });
    await notification.save();
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Submit Availability Controller (Employees Only)
const submitAvailabilityController = async (req, res) => {
  try {
      const { userId, date, starttime, endtime } = req.body;
      const userRole = await getUserRole(userId);
      
      if (userRole !== 'employee') {
          return res.status(403).send({ message: "Unauthorized - Only employees can submit availability" });
      }

      const newAvailability = new Availability({
          userId,
          date: moment(date, "YYYY-MM-DD").toDate(),
          starttime,
          endtime,
      });
      await newAvailability.save();

      // Send a notification to the admin
      const notification = new Notification({
        userId,
        type: "new-employee-availability",
        message: "New employee availability submitted",
      });
      await notification.save();

      const adminUser = await userModel.findOne({ userRole: 'admin' });

      if (adminUser) {
        adminUser.notification.push(notification);
        await adminUser.save();
      }

      // Employee gets a notification
      res.status(201).send({
          success: true,
          message: "Availability submitted successfully",
          data: newAvailability,
      });

  } catch (error) {
      console.error("Error submitting availability:", error);
      res.status(500).send({
          success: false,
          message: error.message,
      });
  }
};

// Get All Availability Controller (Admins get all, Employees get theirs)
const getAllAvailabilityController = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming the userId is securely obtained (e.g., from token)
    const userRole = await getUserRole(userId);
    
    // Restrict access for "general" users
    if (userRole === 'general') {
      return res.status(403).send({ message: "Unauthorized - Access is restricted" });
    }

    // Initialize the query object based on user role
    let query = {};
    
    // Restrict "employee" users to only see their own availabilities
    if (userRole === 'employee') {
      query.userId = userId;
    }
    // Admins can see all availabilities, so no need to modify the query for them
    
    const availabilities = await Availability.find(query).populate('userId', 'name');

    const data = availabilities.map(avail => ({
      _id: avail._id,
      date: avail.date,
      starttime: avail.starttime,
      endtime: avail.endtime,
      user: {
        _id: avail.userId._id,
        name: avail.userId.name,
      },
    }));
    
    res.status(200).send({
      success: true,
      message: "Availabilities fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching availabilities:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};





// Notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notifications Marked As Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error In Notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable To Delete All Notifications",
      error,
    });
  }
};

module.exports = { loginController, registerController, authController, getUserRole, sendNotificationController, submitAvailabilityController, getAllAvailabilityController, getAllNotificationController, deleteAllNotificationController };



//BOOK APPOINTMENT
/*const bookAppointmentController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const startTime = moment(req.body.time, "HH:mm").toISOString();
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();
    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(400).send({
        message: "Selected time is not within doctor's available range",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({
      doctorId,
      date,
    });
    if (appointments.length >= doctor.maxPatientsPerDay) {
      return res.status(400).send({
        message: "Maximum number of appointments reached for this day",
        success: false,
      });
    }
    const newAppointment = new appointmentModel({
      doctorId,
      userId: req.body.userId,
      date,
      time: startTime,
      doctorInfo: req.body.doctorInfo,
      userInfo: req.body.userInfo,
    });
    await newAppointment.save();
    return res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking Appointment",
    });
  }
};*/





