const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    submitAvailabilityController,
    getAllNotificationController, 
    deleteAllNotificationController,
    markNotificationAsReadController, } = require('../controllers/userController');

// Send Notification through submitting availability
router.post('/', authMiddleware, submitAvailabilityController);

// Get All Notifications
router.get('/', authMiddleware, getAllNotificationController);

// Delete All Notifications
router.delete('/', authMiddleware, deleteAllNotificationController);

// Mark Notification As Read
//router.put('/', authMiddleware, markNotificationAsReadController);

module.exports = router;
