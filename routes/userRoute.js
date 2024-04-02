// routes/userRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    loginController,
    registerController,
    authController,
    viewprofilecontroller,
    updateProfileController,
} = require('../controllers/userController');
const { 
    getAllNotificationController, 
    deleteAllNotificationController,
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

// Delete All Notifications for a User
router.post('/delete-all-notifications', authMiddleware, deleteAllNotificationController);

// Route to update user profile
router.put('/update-profile/:userId', authMiddleware, updateProfileController);

// Route to view user profile
router.get('/view-profile/:userId', authMiddleware, viewprofilecontroller); // Ensure the route handles userId parameter

router.put('/mark-as-read/:notificationId', authMiddleware, markNotificationAsReadController);
router.put('/mark-as-unread/:notificationId', authMiddleware, markNotificationAsUnreadController);

module.exports = router;
