const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel"); // If needed for role checking
const Availability = require("../models/availabilityModel");
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
      date: moment(date, "YYYY-MM-DD").startOf('day').toDate(),
    }).populate('userId');

    

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
      // Fetch the appointment and update it with assigned employees
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
          return res.status(404).json({
              success: false,
              message: "Appointment not found",
          });
      }

      // Assign employees to the appointment
      appointment.assignedEmployees = assignedEmployees;
      appointment.isConfirmed = true;
      await appointment.save();

      return res.status(200).json({
          success: true,
          message: "Employees assigned to appointment successfully",
          data: appointment,
      });
  } catch (error) {
      console.error("Error assigning employees to appointment:", error);
      return res.status(500).json({
          success: false,
          message: `Error assigning employees to appointment: ${error.message}`,
      });
  }
};





module.exports = {
  submitAppointmentController,
  getAllAppointmentsController,
  getAvailableEmployeesForAppointmentController,
  autoAssignAppointments,
  assignEmployeesToAppointmentController,
};
