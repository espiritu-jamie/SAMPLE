// routes/userRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    loginController,
    registerController,
    authController,
    viewprofilecontroller,
    updateprofilecontroller,
} = require('../controllers/userController');
const { 
    getAllNotificationController, 
    deleteAllNotificationController 
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
router.put('/update-profile/:userId', authMiddleware, updateprofilecontroller);

// Route to view user profile
router.get('/view-profile/:userId', authMiddleware, viewprofilecontroller); // Ensure the route handles userId parameter

module.exports = router;