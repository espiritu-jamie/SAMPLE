const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { 
    submitRatingController, 
    getRatingsForAppointmentController 
} = require('../controllers/ratingController');

// Endpoint to submit a new rating
router.post('/submit', authMiddleware, submitRatingController);

// Endpoint to get ratings for a specific appointment
router.get('/:appointmentId', authMiddleware, getRatingsForAppointmentController);

module.exports = router;
