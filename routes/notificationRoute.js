const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllNotificationController, 
    deleteAllNotificationController,
    markAllNotificationAsReadController,
    markNotificationAsReadController,
    markNotificationAsUnreadController, // Add this line
} = require('../controllers/notificationController');

// Send Notification through submitting availability
router.post('/', authMiddleware, submitAvailabilityController);

// Get All Notifications
router.get('/get-all-notifications', authMiddleware, getAllNotificationController);

// Delete All Notifications
router.delete('/delete-all-notifications', authMiddleware, deleteAllNotificationController);

// Mark All Notifications As Read
router.put('/mark-all-notification-as-read', authMiddleware, markAllNotificationAsReadController);

// Mark Notification As Read
router.put('/mark-notification-as-read/:notificationId', authMiddleware, markNotificationAsReadController);

// Mark Notification As Unread
router.put('/mark-notification-as-unread/:notificationId', authMiddleware, markNotificationAsUnreadController);

module.exports = router;
