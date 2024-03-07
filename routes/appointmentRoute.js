// routes/appointmentRoute.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware
const router = express.Router();
const {
    submitAppointmentController,
    getAllAppointmentsController,
    getAvailableEmployeesForAppointmentController,
    autoAssignAppointments,
    assignEmployeesToAppointmentController,
    } = require('../controllers/appointmentController');

// Submitting a new appointment for authenticated customers
router.post('/', authMiddleware, submitAppointmentController);

// Fetching All Appointments (for admins)
router.get('/', authMiddleware, getAllAppointmentsController);

// Fetching available employees for a specific appointment
router.get('/available-employees', authMiddleware, getAvailableEmployeesForAppointmentController);

// Auto-assigning appointments to employees (for admins)
router.post('/auto-assign', authMiddleware, autoAssignAppointments);

// Manually assigning an appointment to an employee (for admins)
router.post('/assign-employees', authMiddleware, assignEmployeesToAppointmentController);

module.exports = router;
