const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { 
    getAppointmentsWithAdditionalDetailsController 
} = require('../controllers/additionalController');

// Endpoint to get appointments with additional details
router.get('/:appointmentId', authMiddleware, getAppointmentsWithAdditionalDetailsController);

module.exports = router;