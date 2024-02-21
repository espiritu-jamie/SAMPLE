const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllNotificationController, 
    deleteAllNotificationController,
    markAllNotificationAsReadController, } = require('../controllers/notificationController');
const { submitAvailabilityController } = require('../controllers/availabilityController');

// Send Notification through submitting availability
router.post('/', authMiddleware, submitAvailabilityController);

// Get All Notifications
router.get('/get-all-notifications', authMiddleware, getAllNotificationController);

// Delete All Notifications
router.delete('/delete-all-notifications', authMiddleware, deleteAllNotificationController);

// Mark Notification As Read
// router.put('/mark-all-notification-as-read', authMiddleware, markAllNotificationAsReadController);

module.exports = router;
