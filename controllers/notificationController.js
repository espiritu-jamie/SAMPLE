const Notification = require('../models/notificationModel');
const userModel = require('../models/userModel');

const sendNotificationController = async (req, res) => {
  try {
      const { userId, type, message, data } = req.body;
      const notification = new Notification({
          userId,
          type,
          message,
          data,
      });
      await notification.save();
      res.status(201).json({ success: true, message: 'Notification sent successfully', data: notification });
  } catch (error) {
      console.error('Error sending notification:', error);
      res.status(500).json({ success: false, message: 'Error sending notification' });
  }
};

// Fetch all notifications for a user
const getAllNotificationController = async (req, res) => {
  try {
      const userId = req.body.userId; // Assuming you have a way to identify the user (e.g., JWT token)
      const notifications = await Notification.find({ userId }).populate('userId', 'name');
      res.status(200).json({ success: true, message: 'Notifications fetched successfully', data: notifications });
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};

// Mark a notification as read
const markNotificationAsReadController = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const userId = req.body.userId;
      const notification = await Notification.findOneAndUpdate(
          { _id: notificationId, 'readBy.userId': { $ne: userId } },
          { $push: { readBy: { userId, readAt: new Date() } } },
          { new: true }
      );
      if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found or already marked as read' });
      }
      res.status(200).json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, message: 'Error marking notification as read' });
  }
};

// Mark a notification as dismissed
const dismissNotificationController = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const userId = req.body.userId;
      const notification = await Notification.findOneAndUpdate(
          { _id: notificationId },
          { $addToSet: { dismissedBy: { userId, dismissedAt: new Date() } } },
          { new: true }
      );
      if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.status(200).json({ success: true, message: 'Notification dismissed', data: notification });
  } catch (error) {
      console.error('Error dismissing notification:', error);
      res.status(500).json({ success: false, message: 'Error dismissing notification' });
  }
};

const markNotificationAsUnreadController = async (req, res) => {
  try {
      const { notificationId } = req.params;
      const userId = req.body.userId; // or extract from JWT token if using authentication
      const notification = await Notification.findByIdAndUpdate(
          notificationId,
          { $pull: { readBy: { userId } } },
          { new: true }
      );
      if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      res.status(200).json({ success: true, message: 'Notification marked as unread', data: notification });
  } catch (error) {
      console.log('Error marking notification as unread:', error);
      res.status(500).json({ success: false, message: 'Error marking notification as unread' });
  }
};


// Mark all notifications as read for a user
const markAllNotificationsAsReadController = async (req, res) => {
  try {
    const userId = req.body.userId;
    await Notification.updateMany(
      { userId, 'readBy.userId': { $ne: userId } },
      { $push: { readBy: { userId, readAt: new Date() } } }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Error marking all notifications as read' });
  }
};

// Dismiss (delete) all notifications for a user
const dismissAllNotificationsController = async (req, res) => {
  try {
    const userId = req.body.userId;
    await Notification.updateMany(
      { userId },
      { $addToSet: { dismissedBy: { userId, dismissedAt: new Date() } } }
    );
    res.status(200).json({ success: true, message: 'All notifications dismissed' });
  } catch (error) {
    console.error('Error dismissing all notifications:', error);
    res.status(500).json({ success: false, message: 'Error dismissing all notifications' });
  }
};

// Mark all notifications as unread for a user
const markAllNotificationsAsUnreadController = async (req, res) => {
  try {
    const userId = req.body.userId; // or req.user._id if you're extracting the user from a JWT token

    const result = await Notification.updateMany(
      { 'readBy.userId': userId },
      { $pull: { readBy: { userId: userId } } }
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ success: true, message: "All notifications marked as unread" });
    } else {
      return res.status(200).json({ success: true, message: "No notifications to mark as unread" });
    }
  } catch (error) {
    console.error('Error marking all notifications as unread:', error);
    res.status(500).json({ success: false, message: 'Error marking all notifications as unread' });
  }
};





module.exports = {
  sendNotificationController,
  getAllNotificationController,
  markNotificationAsReadController,
  dismissNotificationController,
  markNotificationAsUnreadController,
  markAllNotificationsAsReadController,
  dismissAllNotificationsController,
  markAllNotificationsAsUnreadController,
};