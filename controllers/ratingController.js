const Rating = require("../models/ratingModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const moment = require("moment");

// Function to submit a new rating for an appointment
const submitRatingController = async (req, res) => {
    const userId = req.body.userId;
    const { appointmentId, rating, comment } = req.body;

    try {
        // Check if the user already submitted a rating for this appointment
        const existingRating = await Rating.findOne({ userId, appointmentId });
        if (existingRating) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted a rating for this appointment.",
            });
        }

        // Fetch the appointment to get the date
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }
        const appointmentDate = moment(appointment.date).format("MMMM D, YYYY"); // Format the date as needed

        console.log("appointmentDate", appointmentDate);

        const newRating = new Rating({
            userId,
            appointmentId,
            rating,
            comment,
        });

        await newRating.save();

        // Find all admin users
        const adminUsers = await User.find({ userRole: 'admin' });

        // Send a notification to each admin
        const notificationPromises = adminUsers.map(admin => {
            const notificationMessage = `A new rating has been submitted for the appointment last ${appointmentDate}.`;
            return new Notification({
                userId: admin._id, 
                type: 'new-rating',
                message: notificationMessage,
            }).save();
        });

        console.log("notificationPromises", notificationPromises);

        // Wait for all notifications to be saved
        await Promise.all(notificationPromises);

        return res.status(201).json({
            success: true,
            message: "Rating submitted successfully, admins notified",
            data: newRating,
        });
    } catch (error) {
        console.error("Error submitting rating:", error);
        return res.status(500).json({
            success: false,
            message: `Error submitting rating: ${error.message}`,
        });
    }
};



// Function to get ratings for an appointment
const getRatingsForAppointmentController = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const ratings = await Rating.find({ appointmentId }).populate('userId', 'name');

    return res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings for appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching ratings: ${error.message}`,
    });
  }
};

module.exports = {
  submitRatingController,
  getRatingsForAppointmentController,
};
