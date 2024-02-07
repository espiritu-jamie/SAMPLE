// routes/userRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    loginController,
    registerController,
    authController,
    getAllNotificationController,
    updateprofilecontroller,
    viewprofilecontroller,
    deleteAllNotificationController
} = require('../controllers/userController');

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
router.post('/update-profile', authMiddleware, updateprofilecontroller);

// Route to view user profile
router.get('/view-profile/:userId', authMiddleware, viewprofilecontroller);

module.exports = router;
