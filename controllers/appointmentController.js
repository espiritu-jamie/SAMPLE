const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel"); // If needed for role checking
const moment = require("moment");
const { getUserRole } = require("../utils/userUtils");

// Function to submit a new appointment
const submitAppointmentController = async (req, res) => {
  const { date, starttime, endtime, phoneNumber, address, specialInstructions, userId } = req.body;

  try {
    const newAppointment = new Appointment({
      userId,
      date: moment(date, "YYYY-MM-DD").toDate(),
      starttime,
      endtime,
      phoneNumber,
      address,
      specialInstructions,
    });
    await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment submitted successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error submitting appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Error submitting appointment: ${error.message}`,
    });
  }
};

// Function to get all appointments for an admin, or just the user's appointments if not an admin
const getAllAppointmentsController = async (req, res) => {
    try {
        const userRole = req.user.role; // Directly using req.user.role

    let query = {};
    if (userRole !== "admin") {
        query.userId = req.user._id; // Limit to user's own appointments if not an admin
    }
  
      const appointments = await Appointment.find(query).populate('userId', 'name email');
      return res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({
        success: false,
        message: `Error fetching appointments: ${error.message}`,
      });
    }
  };

module.exports = {
  submitAppointmentController,
  getAllAppointmentsController,
};
