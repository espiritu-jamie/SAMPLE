const Announcement = require("../models/announcementModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

const createAnnouncementController = async (req, res) => {
  const { title, content, targetRoles } = req.body;

  try {
    const newAnnouncement = new Announcement({
      title,
      content,
      targetRoles,
  
    });
    await newAnnouncement.save();

    const targetUsers = await User.find({ userRole: { $in: targetRoles } });

    const notificationPromises = targetUsers.map(user => {
      return new Notification({
        userId: user._id,
        type: 'announcement',
        message: `New Announcement: ${title}`,


      }).save();
    });

    await Promise.all(notificationPromises);

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully and notifications sent",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({
      success: false,
      message: `Error creating announcement: ${error.message}`,
    });
  }
};


const getAnnouncementsForUserController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);

    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const announcements = await Announcement.find({
      _id: { $nin: user.dismissedAnnouncements },
      targetRoles: { $in: [req.params.role] },
    });

    return res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching announcements: ${error.message}`,
    });
  }
};

const dismissAnnouncementController = async (req, res) => {
  try {
    const userId = req.body.userId; 
    const { announcementId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.dismissedAnnouncements.includes(announcementId)) {
      user.dismissedAnnouncements.push(announcementId);
      await user.save();
    }

    return res.status(200).json({ success: true, message: "Announcement dismissed successfully" });
  } catch (error) {
    console.error("Error dismissing announcement:", error);
    return res.status(500).json({
      success: false,
      message: `Error dismissing announcement: ${error.message}`,
    });
  }
};


module.exports = {
  createAnnouncementController,
  getAnnouncementsForUserController,
  dismissAnnouncementController,
};
