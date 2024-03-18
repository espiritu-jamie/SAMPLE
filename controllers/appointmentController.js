// const Appointment = require("../models/appointmentModel");
// const User = require("../models/userModel");
// const moment = require("moment");
// const { getUserRole } = require("../utils/userUtils");

// // Function to submit a new appointment
// const submitAppointmentController = async (req, res) => {
//   const { date, starttime, endtime, phoneNumber, address, specialInstructions, userId } = req.body;

//   try {
//     const newAppointment = new Appointment({
//       userId,
//       date: moment(date, "YYYY-MM-DD").toDate(),
//       starttime,
//       endtime,
//       phoneNumber,
//       address,
//       specialInstructions,
//     });
//     await newAppointment.save();

//     return res.status(201).json({
//       success: true,
//       message: "Appointment submitted successfully",
//       data: newAppointment,
//     });
//   } catch (error) {
//     console.error("Error submitting appointment:", error);
//     return res.status(500).json({
//       success: false,
//       message: `Error submitting appointment: ${error.message}`,
//     });
//   }
// };

// // Function to get all appointments for an admin, or just the user's appointments if not an admin
// const getAllAppointmentsController = async (req, res) => {
//   try {
//     console.log("req.user", req);
//     const userId = req.body.userId; // Get user id from request
//     const userRole = await getUserRole(userId); // Get user role using the utility function

//     let query = {};
//     if (userRole !== "admin") {
//       query.userId = userId; // Limit to user's own appointments if not an admin
//     }
  
//     const appointments = await Appointment.find(query).populate('userId', 'name email');
//     return res.status(200).json({
//       success: true,
//       data: appointments,
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return res.status(500).json({
//       success: false,
//       message: `Error fetching appointments: ${error.message}`,
//     });
//   }
// };

// // controllers/appointmentController.js
// const Appointment = require('../models/Appointment'); // Assuming you have a model for appointments

// exports.deleteAppointmentController = async (req, res) => {
//     try {
//         const { appointmentId } = req.params;
//         // Find the appointment by ID and delete it
//         await Appointment.findByIdAndDelete(appointmentId);
//         res.status(200).send({ message: 'Appointment deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting appointment:', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// };

// module.exports = {
//   submitAppointmentController,
//   getAllAppointmentsController,
//   deleteAppointmentController,
// };

const Appointment = require("../models/appointmentModel"); // Correct this line if your actual file name or path differs
const User = require("../models/userModel");
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
    const userId = req.body.userId; // Get user id from request
    const userRole = await getUserRole(userId); // Get user role using the utility function

    let query = {};
    if (userRole !== "admin") {
      query.userId = userId; // Limit to user's own appointments if not an admin
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

// Delete Appointment Controller
const deleteAppointmentController = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        // Find the appointment by ID and delete it
        await Appointment.findByIdAndDelete(appointmentId);
        res.status(200).send({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

// const updateAppointmentController = async (req, res) => {
//     try {
//         const { appointmentId } = req.params;
//         const updateData = req.body;
//         const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, { new: true });
//         res.status(200).json({
//             message: 'Appointment updated successfully',
//             data: updatedAppointment
//         });
//     } catch (error) {
//         console.error('Error updating appointment:', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// };

module.exports = {
  submitAppointmentController,
  getAllAppointmentsController,
  deleteAppointmentController,
};