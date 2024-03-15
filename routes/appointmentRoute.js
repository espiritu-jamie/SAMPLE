// routes/appointmentRoute.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware
const router = express.Router();
const {
    submitAppointmentController,
    getAllAppointmentsController,
    deleteAppointmentController,

    } = require('../controllers/appointmentController');

// Submitting a new appointment for authenticated customers
router.post('/', authMiddleware, submitAppointmentController);

// Fetching All Appointments (for admins)
router.get('/', authMiddleware, getAllAppointmentsController);

// Deleting an appointment for authenticated customers
router.delete('/:appointmentId', authMiddleware, deleteAppointmentController);

// // Fetching a single appointment for authenticated users
// router.get('/:appointmentId', authMiddleware, getAppointmentByIdController);

module.exports = router;
