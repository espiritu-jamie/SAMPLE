const Notification = require('../models/notificationModel');
const userModel = require('../models/userModel');



// Function to send a notification
const sendNotificationController = async (userId, type, message, data) => {
    try {
      const notification = new Notification({
        userId,
        type,
        message,
        data,
      });
      await notification.save();
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  
  
  // Notification controller
  const getAllNotificationController = async (req, res) => {
    try {
      const userId = req.body._id;
  
      const notifications = await Notification.find({ userId: userId });
  
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
      });
    } catch (error) {
      console.log("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching notifications",
      });
    }
  };

  // delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findOne({ _id: userId });

    // Filter out read notifications
    const updatedNotifications = user.notification.filter(notification => notification.isRead === false);
    
    user.notification = updatedNotifications;
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Read Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable To Delete All Read Notifications",
      error,
    });
  }
};

  
  // Mark all notifications as read
  const markAllNotificationAsReadController = async (req, res) => {
    try {
      const userId = req.body.userId;
  
      console.log("UserID for update:", userId );
  
      await Notification.updateMany(
        { userId: userId, isRead: false }, 
        { $set: { isRead: true } });
        
      res.status(200).json({
        success: true,
        message: "All Notifications Marked As Read",
      });
    } catch (error) {
      console.log("Error marking notifications as read:", error);
      res.status(500).json({
        success: false,
        message: "Error marking notifications as read",
      });
    }
  };

// Mark notification as read
const markNotificationAsReadController = async (req, res) => {
  try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findByIdAndUpdate(notificationId, { $set: { isRead: true } }, { new: true });

      if (!notification) {
          return res.status(404).json({
              success: false,
              message: "Notification not found",
          });
      }

      res.status(200).json({
          success: true,
          message: "Notification marked as read",
          data: notification,
      });
  } catch (error) {
      console.log("Error marking notification as read:", error);
      res.status(500).json({
          success: false,
          message: "Error marking notification as read",
      });
  }
};

// Mark notification as unread
const markNotificationAsUnreadController = async (req, res) => {
  try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findByIdAndUpdate(notificationId, { $set: { isRead: false } }, { new: true });

      if (!notification) {
          return res.status(404).json({
              success: false,
              message: "Notification not found",
          });
      }

      res.status(200).json({
          success: true,
          message: "Notification marked as unread",
          data: notification,
      });
  } catch (error) {
      console.log("Error marking notification as unread:", error);
      res.status(500).json({
          success: false,
          message: "Error marking notification as unread",
      });
  }
};

module.exports = {
  sendNotificationController,
  getAllNotificationController,
  deleteAllNotificationController,
  markAllNotificationAsReadController,
  markNotificationAsReadController,
  markNotificationAsUnreadController,
};
