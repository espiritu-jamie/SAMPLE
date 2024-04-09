const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getAllNotificationController, 
    dismissNotificationController,
    markNotificationAsReadController,
    markNotificationAsUnreadController,
    markAllNotificationsAsReadController,
    dismissAllNotificationsController,
    markAllNotificationsAsUnreadController,
} = require('../controllers/notificationController');


// Get All Notifications
router.get('/get-all-notifications', authMiddleware, getAllNotificationController);

// Delete All Read Notifications
router.put('/dismiss-notification/:notificationId', authMiddleware, dismissNotificationController);

// Mark All Notifications As Read
router.put('/mark-all-as-read', authMiddleware, markAllNotificationsAsReadController);

// Mark Notification As Read
router.put('/mark-as-read/:notificationId', authMiddleware, markNotificationAsReadController);

// Delete All Notifications
router.put('/dismiss-all-notifications', authMiddleware, dismissAllNotificationsController);

// Mark Notification As Unread
router.put('/mark-as-unread/:notificationId', authMiddleware, markNotificationAsUnreadController);

// Mark All Notifications As Unread
router.put('/mark-all-as-unread', authMiddleware, markAllNotificationsAsUnreadController);

module.exports = router;
