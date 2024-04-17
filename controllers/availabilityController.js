const moment = require('moment');
const { getUserRole } = require('../utils/userUtils');
const Availability = require('../models/availabilityModel');
const Notification = require('../models/notificationModel');
const userModel = require('../models/userModel');

const submitAvailabilityController = async (req, res) => {
  try {
      const { userId, dates, starttime, endtime } = req.body;
      const userRole = await getUserRole(userId);

      if (userRole !== 'employee') {
          return res.status(403).send({ message: "Unauthorized - Only employees can submit availability" });
      }

      let availabilitiesProcessed = 0; // Track how many availabilities were processed

      await Promise.all(dates.map(async (date) => {
          const existingAvailability = await Availability.findOne({ userId, date });
          if (existingAvailability) {
              // Update existing availability
              existingAvailability.starttime = starttime;
              existingAvailability.endtime = endtime;
              await existingAvailability.save();
          } else {
              // Create new availability
              const newAvailability = new Availability({ userId, date, starttime, endtime });
              await newAvailability.save();
          }
          availabilitiesProcessed++;
      }));

      // Assuming we want to send notifications after processing all dates
      if (availabilitiesProcessed > 0) {
          // Create a notification for each admin about new or updated availability
          const notificationMessage = `Employee has submitted/updated availability for ${availabilitiesProcessed} dates.`;
          
          const adminUsers = await userModel.find({ userRole: 'admin' });

          console.log("Admin users:", adminUsers);
          
          // Loop through admin users and create/save notification for each
          await Promise.all(adminUsers.map(async (adminUser) => {
              const notification = new Notification({
                  userId: adminUser._id,
                  type: "new-employee-availability",
                  message: notificationMessage,
              });
              await notification.save();
              adminUser.notification.push(notification);
              await adminUser.save();
          }));
      }

      res.status(201).send({ success: true, message: "Availability submitted/updated successfully" });
  } catch (error) {
      console.error("Error submitting/updating availability:", error);
      res.status(500).send({ success: false, message: error.message });
  }
};


  
  // Get All Availability Controller (Admins get all, Employees get theirs)
  const getAllAvailabilityController = async (req, res) => {
    try {
      const { userId } = req.body; 
      const userRole = await getUserRole(userId);
      
      if (userRole === 'general') {
        return res.status(403).send({ message: "Unauthorized - Access is restricted" });
      }

      let query = {};
      
      if (userRole === 'employee') {
        query.userId = userId;
      }
      
      const availabilities = await Availability.find(query).populate('userId', 'name');
  
      const data = availabilities.map(avail => ({
        _id: avail._id,
        date: avail.date,
        starttime: avail.starttime,
        endtime: avail.endtime,
        user: {
          _id: avail.userId._id,
          name: avail.userId.name,
        },
      }));
      
      res.status(200).send({
        success: true,
        message: "Availabilities fetched successfully",
        data: data,
      });
    } catch (error) {
      console.error("Error fetching availabilities:", error);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };
  
  const deleteAvailabilityController = async (req, res) => {
    try {
        const userId = req.body.userId; 
        const availabilityId = req.params.id; 
  
        const availability = await Availability.findById(availabilityId);
  
        if (!availability) {
            return res.status(404).send({ message: "Availability not found" });
        }
  
        if (availability.userId.toString() !== userId) {
            return res.status(403).send({ message: "Unauthorized - You can only delete your own availability" });
        }
  
        await Availability.deleteOne({ _id: availabilityId });
  
        res.status(200).send({
            success: true,
            message: "Availability deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting availability:", error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
  };
  
module.exports = {
        submitAvailabilityController,
        getAllAvailabilityController,
        deleteAvailabilityController,
    };