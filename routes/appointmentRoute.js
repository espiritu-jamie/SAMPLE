// routes/appointmentRoute.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware
const router = express.Router();
const {
    submitAppointmentController,
    getAllAppointmentsController,
    getAvailableEmployeesForAppointmentController,
    updateAppointmentStatusController,
    assignEmployeesToAppointmentController,
    cancelAppointmentController,
    deleteAppointmentController,
    getConfirmedAppointmentsForEmployee,
    rescheduleAppointmentController,
    getFullDaysController,
    getBookedSlotsController,
    } = require('../controllers/appointmentController');

// Submitting a new appointment for authenticated customers
router.post('/', authMiddleware, submitAppointmentController);

// Fetching All Appointments (for admins)
router.get('/', authMiddleware, getAllAppointmentsController);

// Fetching available employees for a specific appointment
router.get('/available-employees', authMiddleware, getAvailableEmployeesForAppointmentController);

// Manually assigning an appointment to an employee (for admins)
router.post('/assign-employees', authMiddleware, assignEmployeesToAppointmentController);

// Cancelling an appointment (for customers)
router.patch('/cancel-appointment/:appointmentId', authMiddleware, cancelAppointmentController);

// Deleting an appointment (for admins)
router.delete('/:appointmentId', authMiddleware, deleteAppointmentController);

// Fetching the confirmed appointments for the logged-in employee
router.get('/confirmed-for-employee', authMiddleware, getConfirmedAppointmentsForEmployee);

// Updating the status of an appointment (for admins)
router.patch('/update-status/:appointmentId', authMiddleware, updateAppointmentStatusController);

// Rescheduling an appointment (on admin page)
router.patch('/reschedule-appointment/:appointmentId', authMiddleware, rescheduleAppointmentController);

// Fetching full days for a specific month
router.get('/full-days', authMiddleware, getFullDaysController);

// Fetching booked slots for a specific day
router.get('/booked-slots', authMiddleware, getBookedSlotsController);

module.exports = router;
