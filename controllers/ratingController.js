const Rating = require("../models/ratingModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

// Function to submit a new rating for an appointment
const submitRatingController = async (req, res) => {
    const userId = req.body.userId;
  const { appointmentId, rating, comment } = req.body;

  try {
    // Optionally, you might want to check if the user already submitted a rating for this appointment
    const existingRating = await Rating.findOne({ userId, appointmentId });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a rating for this appointment.",
      });
    }

    const newRating = new Rating({
      userId,
      appointmentId,
      rating,
      comment,
    });

    await newRating.save();

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
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
