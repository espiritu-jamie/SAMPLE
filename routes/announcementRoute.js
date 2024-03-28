const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { createAnnouncementController,
    getAnnouncementsForUserController,
    dismissAnnouncementController,
 } = require('../controllers/announcementController');

// POST endpoint to create a new announcement
router.post('/', authMiddleware, createAnnouncementController);

// GET endpoint to fetch announcements for the logged-in user
router.get('/:role', authMiddleware, getAnnouncementsForUserController);

// POST endpoint to dismiss an announcement
router.post('/dismiss', authMiddleware, dismissAnnouncementController);

module.exports = router;
