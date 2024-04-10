const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel"); // If needed for role checking

const { getUserRole } = require("../utils/userUtils");

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
  module.exports = {
    getAllAppointmentsController,
  };