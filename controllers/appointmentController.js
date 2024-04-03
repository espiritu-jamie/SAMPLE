const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel"); // If needed for role checking
const Availability = require("../models/availabilityModel");
const moment = require("moment");
const { getUserRole } = require("../utils/userUtils");

// Function to submit a new appointment
const submitAppointmentController = async (req, res) => {
  const { userId, date, starttime, endtime, phoneNumber, address, specialInstructions, cost, paymentMethod } = req.body;
  

  try {
    const newAppointment = new Appointment({
      userId,
      date: moment(date, "YYYY-MM-DD").toDate(),
      starttime,
      endtime,
      phoneNumber,
      address,
      specialInstructions,
      cost,
      paymentMethod,
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
      const userId = req.body.userId;
      const userRole = await getUserRole(userId);

      let query = {};
      if (userRole !== "admin") {
          query.userId = userId; // Limit to user's own appointments if not an admin
      }

      // Assuming 'userId' references another document, keep the populate for user details
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


const getAvailableEmployeesForAppointmentController = async (req, res) => {
  
  const { date, starttime, endtime } = req.query;

  try {
  

    // Convert query parameters to moment objects for easier comparison
    const appointmentStart = moment(`${date} ${starttime}`, "YYYY-MM-DD HH:mm");
    const appointmentEnd = moment(`${date} ${endtime}`, "YYYY-MM-DD HH:mm");

    // Fetch availabilities on the given date
    const availabilities = await Availability.find({
      date: moment.utc(date, "YYYY-MM-DD").startOf('day').toDate(),
    }).populate('userId');

    console.log("availabilities",availabilities);

    const availableEmployees = availabilities.filter(({ starttime: availStart, endtime: availEnd }) => {
      // Convert availability times to moment objects
      const availStartMoment = moment(`${date} ${availStart}`, "YYYY-MM-DD HH:mm");
      const availEndMoment = moment(`${date} ${availEnd}`, "YYYY-MM-DD HH:mm");

      // Check if availability overlaps with the appointment time
      return availStartMoment.isSameOrBefore(appointmentStart) && availEndMoment.isSameOrAfter(appointmentEnd);
    }).map(avail => ({
      id: avail.userId._id.toString(),
      name: avail.userId.name,
    }));

    res.json({
      success: true,
      availableEmployees,
    });
  } catch (error) {
    console.error("Error fetching available employees:", error);
    res.status(500).json({
      success: false,
      message: `Error fetching available employees: ${error.message}`,
    });
  }
};

const updateAppointmentStatusController = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      appointment.status = status;
      await appointment.save();

      return res.status(200).json({ success: true, message: "Appointment status updated successfully", data: appointment });
  } catch (error) {
      console.error("Error updating appointment status:", error);
      return res.status(500).json({ success: false, message: `Error updating appointment status: ${error.message}` });
  }
};


const autoAssignAppointments = async (req, res) => {
  try {
    // Fetch unassigned appointments
    const unassignedAppointments = await Appointment.find({ assignedEmployee: { $exists: false } });

    // Iterate over unassigned appointments
    for (let appointment of unassignedAppointments) {
      // Find available employees for each appointment
      const availableEmployees = await Availability.find({
        date: appointment.date,
        // Ensure to convert appointment start and end times to match your availability model
      });

      // Implement logic to filter based on proximity and workload (not shown here for brevity)

      if (availableEmployees.length > 0) {
        // Example: Assign to the first available employee
        appointment.assignedEmployee = availableEmployees[0].userId;
        await appointment.save();
      }
    }

    res.status(200).json({ message: "Auto-assignment completed" });
  } catch (error) {
    console.error("Auto-assignment error:", error);
    res.status(500).json({ message: "Failed to auto-assign appointments" });
  }
};

const assignEmployeesToAppointmentController = async (req, res) => {
  const { appointmentId, assignedEmployees } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    appointment.assignedEmployees = assignedEmployees;
    // Update status to 'confirmed' when at least one employee is assigned
    appointment.status = assignedEmployees.length > 0 ? 'confirmed' : 'pending';
    
    await appointment.save();

    return res.status(200).json({ success: true, message: "Employees updated successfully", data: appointment });
  } catch (error) {
    console.error("Error assigning employees to appointment:", error);
    return res.status(500).json({ success: false, message: `Error assigning employees to appointment: ${error.message}` });
  }
};

const cancelAppointmentController = async (req, res) => {
  const { appointmentId } = req.params; // Assuming appointmentId is passed as URL parameter
  const { cancellationReason } = req.body; // Receive the cancellation reason from request body

  
  if (!cancellationReason.trim()) {
    return res.status(400).json({ success: false, message: "Cancellation reason is required." });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update the appointment status to 'cancelled' and add the cancellation reason
    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason || 'No reason provided'; // Store the reason or a default message

    await appointment.save();

    return res.status(200).json({ success: true, message: "Appointment cancelled successfully", data: appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({ success: false, message: `Error cancelling appointment: ${error.message}` });
  }
};


// Get confirmed appointments for the logged-in employee
const getConfirmedAppointmentsForEmployee = async (req, res) => {
  const employeeId = req.body.userId; // Assuming req.user is populated with the authenticated user's information

  try {
    const confirmedAppointments = await Appointment.find({
      assignedEmployees: employeeId,
      status: 'confirmed'
    }).populate('userId', 'name').populate('assignedEmployees', 'name');

    return res.status(200).json({
      success: true,
      data: confirmedAppointments,
    });
  } catch (error) {
    console.error("Error fetching confirmed appointments:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching confirmed appointments: ${error.message}`,
    });
  }
};

const rescheduleAppointmentController = async (req, res) => {
  const { appointmentId } = req.params;
  const { newDate, cancellationReason } = req.body;

  
  if (!cancellationReason.trim()) {
    return res.status(400).json({ success: false, message: "Cancellation reason is required." });
  }

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.date = newDate;
    appointment.cancellationReason = cancellationReason || '';
    appointment.status = 'pending'; // Consider adding 'rescheduled' to your status enum
    await appointment.save();

    return res.status(200).json({ success: true, message: "Appointment rescheduled successfully", data: appointment });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return res.status(500).json({ success: false, message: `Error rescheduling appointment: ${error.message}` });
  }
};


// controllers/appointmentController.js
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





module.exports = {
  submitAppointmentController,
  getAllAppointmentsController,
  getAvailableEmployeesForAppointmentController,
  updateAppointmentStatusController,
  autoAssignAppointments,
  assignEmployeesToAppointmentController,
  cancelAppointmentController,
  deleteAppointmentController,
  getConfirmedAppointmentsForEmployee,
  rescheduleAppointmentController,
};
