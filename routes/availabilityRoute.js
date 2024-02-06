// routes/availabilityRoute.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware
const router = express.Router();
const {
    submitAvailabilityController,
    getAllAvailabilityController
    } = require('../controllers/userController');

// Submitting Availability (for employees)
router.post('/', authMiddleware, submitAvailabilityController);

// Fetching All Availabilities (for admins or an employee's own)
router.get('/', authMiddleware, getAllAvailabilityController);

// Deleting an availability (for employees or admin)
router.delete('/:availabilityId', authMiddleware, deleteAvailabilityController);


module.exports = router;
