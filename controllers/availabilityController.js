const moment = require('moment');
const { getUserRole } = require('../utils/userUtils');
const Availability = require('../models/availabilityModel');
const Notification = require('../models/notificationModel');
const userModel = require('../models/userModel');




// Submit Availability Controller (Employees Only)
const submitAvailabilityController = async (req, res) => {
    try {
        const { userId, date, starttime, endtime } = req.body;
        const userRole = await getUserRole(userId);
        
        if (userRole !== 'employee') {
            return res.status(403).send({ message: "Unauthorized - Only employees can submit availability" });
        }
  
        const newAvailability = new Availability({
            userId,
            date: moment(date, "YYYY-MM-DD").toDate(),
            starttime,
            endtime,
        });
        await newAvailability.save();
  
        // Send a notification to the admin
        const notification = new Notification({
          userId,
          type: "new-employee-availability",
          message: "New employee availability submitted",
        });
        await notification.save();
  
        const adminUser = await userModel.findOne({ userRole: 'admin' });
  
        if (adminUser) {
          adminUser.notification.push(notification);
          await adminUser.save();
        }
  
        // Employee gets a notification
        res.status(201).send({
            success: true,
            message: "Availability submitted successfully",
            data: newAvailability,
        });
  
    } catch (error) {
        console.error("Error submitting availability:", error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
  };
  
  // Get All Availability Controller (Admins get all, Employees get theirs)
  const getAllAvailabilityController = async (req, res) => {
    try {
      const { userId } = req.body; // Assuming the userId is securely obtained (e.g., from token)
      const userRole = await getUserRole(userId);
      
      // Restrict access for "general" users
      if (userRole === 'general') {
        return res.status(403).send({ message: "Unauthorized - Access is restricted" });
      }
  
      // Initialize the query object based on user role
      let query = {};
      
      // Restrict "employee" users to only see their own availabilities
      if (userRole === 'employee') {
        query.userId = userId;
      }
      // Admins can see all availabilities, so no need to modify the query for them
      
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
        const userId = req.body.userId; // Using userId from req.body as set by authMiddleware
        const availabilityId = req.params.id; // The ID of the availability to delete
  
        // Find the availability to ensure it exists and to check ownership
        const availability = await Availability.findById(availabilityId);
  
        if (!availability) {
            return res.status(404).send({ message: "Availability not found" });
        }
  
        // Ensure the availability belongs to the user making the request
        if (availability.userId.toString() !== userId) {
            return res.status(403).send({ message: "Unauthorized - You can only delete your own availability" });
        }
  
        // Delete the availability
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