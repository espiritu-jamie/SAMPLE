// routes/userRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    loginController,
    registerController,
    authController
} = require('../controllers/userController');
const { 
    getAllNotificationController, 

    markNotificationAsReadController,
    markNotificationAsUnreadController
} = require('../controllers/notificationController');

// User Registration
router.post('/register', registerController);

// User Login
router.post('/login', loginController);

// User Authentication Check
router.post('/getUserData', authMiddleware, authController);

// Get All Notifications for a User
router.get('/get-all-notifications', authMiddleware, getAllNotificationController);


router.put('/mark-as-read/:notificationId', authMiddleware, markNotificationAsReadController);
router.put('/mark-as-unread/:notificationId', authMiddleware, markNotificationAsUnreadController);

module.exports = router;
