const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel"); 
const Availability = require("../models/availabilityModel");
const Notification = require("../models/notificationModel");
const moment = require("moment");
const { getUserRole } = require("../utils/userUtils");

const submitAppointmentController = async (req, res) => {
  const { userId, date, starttime, endtime, phoneNumber, address, specialInstructions, cost, paymentMethod } = req.body;

  try {
    const startTimeMoment = moment(`${date} ${starttime}`, 'YYYY-MM-DD HH:mm');
    const endTimeMoment = moment(`${date} ${endtime}`, 'YYYY-MM-DD HH:mm');

    const overlappingAppointments = await Appointment.find({
      date: moment(date, "YYYY-MM-DD").toDate(),
      $or: [
        { starttime: { $lt: endtime }, endtime: { $gt: starttime } }, 
      ],
      status: { $ne: 'cancelled' } 
    });

    if (overlappingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'There is already an appointment scheduled for the selected time slot. Please choose another time.',
      });
    }

    const dayAppointments = await Appointment.countDocuments({
      date: moment(date, "YYYY-MM-DD").toDate(),
      status: { $ne: 'cancelled' }
    });

    if (dayAppointments >= 5) {
      return res.status(400).json({
        success: false,
        message: 'The maximum number of appointments for this day has been reached. Please select another day.',
      });
    }

    const newAppointment = new Appointment({
      userId,
      date: moment(date, "YYYY-MM-DD").toDate(),
      starttime,
      endtime,
      phoneNumber,
      address,
      specialInstructions,
      cost,
      paymentMethod,
    });
    await newAppointment.save();

    const adminUsers = await User.find({ userRole: 'admin' });

    const notificationMessage = `A new appointment has been booked for ${moment(date).format("MMMM Do YYYY")}.`;

    const notificationPromises = adminUsers.map(admin => {
      return new Notification({
        userId: admin._id,
        type: 'new-appointment',
        message: notificationMessage,
      }).save();
    });

    await Promise.all(notificationPromises);

    return res.status(201).json({
      success: true,
      message: "Appointment submitted successfully, and admins notified",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error submitting appointment:", error);
    return res.status(500).json({
      success: false,
      message: `Error submitting appointment: ${error.message}`,
    });
  }
};

const getAllAppointmentsController = async (req, res) => {
  try {
      const userId = req.body.userId;
      const userRole = await getUserRole(userId);

      let query = {};
      if (userRole !== "admin") {
          query.userId = userId;
      }

      const appointments = await Appointment.find(query).populate('userId', 'name email');
      return res.status(200).json({
          success: true,
          data: appointments,
      });
  } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({
          success: false,
          message: `Error fetching appointments: ${error.message}`,
      });
  }
};


const getAvailableEmployeesForAppointmentController = async (req, res) => {
  
  const { date, starttime, endtime } = req.query;

  try {
    const appointmentStart = moment(`${date} ${starttime}`, "YYYY-MM-DD HH:mm");
    const appointmentEnd = moment(`${date} ${endtime}`, "YYYY-MM-DD HH:mm");


    const availabilities = await Availability.find({
      date: moment.utc(date, "YYYY-MM-DD").startOf('day').toDate(),
    }).populate('userId');

    console.log("availabilities",availabilities);

    const availableEmployees = availabilities.filter(({ starttime: availStart, endtime: availEnd }) => {
      const availStartMoment = moment(`${date} ${availStart}`, "YYYY-MM-DD HH:mm");
      const availEndMoment = moment(`${date} ${availEnd}`, "YYYY-MM-DD HH:mm");

      return availStartMoment.isSameOrBefore(appointmentStart) && availEndMoment.isSameOrAfter(appointmentEnd);
    }).map(avail => ({
      id: avail.userId._id.toString(),
      name: avail.userId.name,
    }));

    res.json({
      success: true,
      availableEmployees,
    });
  } catch (error) {
    console.error("Error fetching available employees:", error);
    res.status(500).json({
      success: false,
      message: `Error fetching available employees: ${error.message}`,
    });
  }
};

const updateAppointmentStatusController = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      appointment.status = status;
      await appointment.save();

      return res.status(200).json({ success: true, message: "Appointment status updated successfully", data: appointment });
  } catch (error) {
      console.error("Error updating appointment status:", error);
      return res.status(500).json({ success: false, message: `Error updating appointment status: ${error.message}` });
  }
};


const assignEmployeesToAppointmentController = async (req, res) => {
  const { appointmentId, assignedEmployees } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    
    const previousAssignedEmployees = appointment.assignedEmployees.map(emp => emp.toString());
    const newAssignedEmployees = assignedEmployees.map(emp => emp.toString());

    const employeesBeingUnassigned = previousAssignedEmployees.filter(emp => !newAssignedEmployees.includes(emp));
    
    appointment.assignedEmployees = assignedEmployees;
    appointment.status = assignedEmployees.length > 0 ? 'confirmed' : 'pending';
    await appointment.save();

    const formattedDate = moment(appointment.date).format('dddd, MMMM Do YYYY');

    // Notifications for newly assigned employees
    const notificationsForNewAssignees = newAssignedEmployees
      .filter(emp => !previousAssignedEmployees.includes(emp)) 
      .map(employeeId => {
        const notificationMessage = `You have been assigned to a new appointment on ${formattedDate}.`;
        return new Notification({
          userId: employeeId,
          type: "appointment-assignment",
          message: notificationMessage,
        }).save();
      });

    const notificationsForUnassigned = employeesBeingUnassigned.map(employeeId => {
      const notificationMessage = `You have been unassigned from the appointment on ${formattedDate}.`;
      return new Notification({
        userId: employeeId,
        type: "appointment-unassignment",
        message: notificationMessage,
      }).save();
    });

    let customerNotification = [];
    if (assignedEmployees.length > 0 && previousAssignedEmployees.length === 0) {
      const customerNotificationMessage = `Your appointment on ${formattedDate} has been confirmed.`;
      customerNotification.push(new Notification({
        userId: appointment.userId,
        type: "appointment-confirmation",
        message: customerNotificationMessage,
      }).save());
    }

    await Promise.all([...notificationsForNewAssignees, ...notificationsForUnassigned, ...customerNotification]);

    return res.status(200).json({ success: true, message: "Appointment updated successfully, notifications sent", data: appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ success: false, message: `Error updating appointment: ${error.message}` });
  }
};





const cancelAppointmentController = async (req, res) => {
  const { appointmentId } = req.params;
  const userId = req.body.userId;
  const { cancellationReason } = req.body;

  if (!cancellationReason.trim()) {
    return res.status(400).json({ success: false, message: "Cancellation reason is required." });
  }

  try {
    const userRole = await getUserRole(userId);
    const appointment = await Appointment.findById(appointmentId).populate('userId');
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancellationReason;
    await appointment.save();

    let targetUsers = [];
    if (userRole === 'admin') {
      targetUsers.push(appointment.userId._id);
    } else {
      const adminUsers = await User.find({ userRole: 'admin' });
      targetUsers = adminUsers.map(admin => admin._id);
    }

    if (appointment.assignedEmployees && appointment.assignedEmployees.length > 0) {
      targetUsers = [...new Set([...targetUsers, ...appointment.assignedEmployees])];
    }

    const notificationMessageForAdmin = userRole === 'admin' ? 
      `An admin has cancelled the appointment scheduled for ${moment(appointment.date).format("dddd, MMMM Do YYYY")} with ${appointment.userId.name}.` : 
      `The customer ${appointment.userId.name} has cancelled the appointment scheduled for ${moment(appointment.date).format("dddd, MMMM Do YYYY")}.`;

    const notificationMessageForCustomer = userRole === 'admin' ? 
      `An admin has cancelled your appointment scheduled for ${moment(appointment.date).format("dddd, MMMM Do YYYY")}.` : 
      `You have cancelled your appointment scheduled for ${moment(appointment.date).format("dddd, MMMM Do YYYY")}.`;

    const notificationMessageForEmployee = userRole === 'admin' ? 
      `An admin has cancelled the appointment you were assigned to on ${moment(appointment.date).format("dddd, MMMM Do YYYY")}.` : 
      `The appointment you were assigned to on ${moment(appointment.date).format("dddd, MMMM Do YYYY")} has been cancelled by the customer.`;

    const notificationsPromises = targetUsers.map(userId => {
      let message = '';
      if (userId.toString() === appointment.userId._id.toString()) {
        message = notificationMessageForCustomer;
      } else if (appointment.assignedEmployees.includes(userId)) {
        message = notificationMessageForEmployee;
      } else {
        message = notificationMessageForAdmin;
      }

      return new Notification({
        userId,
        type: 'appointment-cancelled',
        message,
      }).save();
    });

    await Promise.all(notificationsPromises);

    return res.status(200).json({ success: true, message: "Appointment cancelled successfully, notifications sent", data: appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({ success: false, message: `Error cancelling appointment: ${error.message}` });
  }
};





// Get confirmed appointments for the logged-in employee
const getConfirmedAppointmentsForEmployee = async (req, res) => {
  const employeeId = req.body.userId;

  try {
    const confirmedAppointments = await Appointment.find({
      assignedEmployees: employeeId,
      status: 'confirmed'
    }).populate('userId', 'name').populate('assignedEmployees', 'name');

    return res.status(200).json({
      success: true,
      data: confirmedAppointments,
    });
  } catch (error) {
    console.error("Error fetching confirmed appointments:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching confirmed appointments: ${error.message}`,
    });
  }
};

const rescheduleAppointmentController = async (req, res) => {
  const { appointmentId } = req.params;
  const { newDate } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const oldDateFormatted = moment(appointment.date).format('dddd, MMMM Do YYYY');
    appointment.date = newDate;
    await appointment.save();
    
    const customerNotificationMessage = `Your appointment initially scheduled for ${oldDateFormatted} has been rescheduled to ${moment(newDate).format('dddd, MMMM Do YYYY')}.`;
    await new Notification({
      userId: appointment.userId,
      type: "appointment-rescheduled",
      message: customerNotificationMessage,
    }).save();

    const notificationsForEmployees = appointment.assignedEmployees.map(employeeId => {
      const employeeNotificationMessage = `The appointment initially scheduled for ${oldDateFormatted} has been rescheduled to ${moment(newDate).format('dddd, MMMM Do YYYY')}.`;
      return new Notification({
        userId: employeeId,
        type: "appointment-rescheduled",
        message: employeeNotificationMessage,
      }).save();
    });

    await Promise.all(notificationsForEmployees);

    return res.status(200).json({ success: true, message: "Appointment rescheduled successfully, notifications sent", data: appointment });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return res.status(500).json({ success: false, message: `Error rescheduling appointment: ${error.message}` });
  }
};

const getFullDaysController = async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      { $match: { count: { $gte: 5 } } }
    ]);

    const fullDays = appointments.map(appointment => appointment._id);
    res.json({ success: true, fullDays });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBookedSlotsController = async (req, res) => {
  const { date } = req.query;
  
  try {
    const appointments = await Appointment.find({
      date: moment(date, "YYYY-MM-DD").toDate(),
      status: { $ne: 'cancelled' }
    }, 'starttime endtime');

    const bookedSlots = appointments.map(appointment => `${appointment.starttime} - ${appointment.endtime}`);
    res.json({ success: true, bookedSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllConfirmedAppointments = async (req, res) => {
  try {
    const confirmedAppointments = await Appointment.find({ status: 'confirmed' })
      .populate({
        path: 'assignedEmployees',
        select: 'name',
      })
      .populate('userId', 'name email');

    return res.status(200).json({
      success: true,
      data: confirmedAppointments,
    });
  } catch (error) {
    console.error("Error fetching confirmed appointments:", error);
    return res.status(500).json({
      success: false,
      message: `Error fetching confirmed appointments: ${error.message}`,
    });
  }
};



module.exports = {
  submitAppointmentController,
  getAllAppointmentsController,
  getAvailableEmployeesForAppointmentController,
  updateAppointmentStatusController,
  assignEmployeesToAppointmentController,
  cancelAppointmentController,
  getConfirmedAppointmentsForEmployee,
  rescheduleAppointmentController,
  getFullDaysController,
  getBookedSlotsController,
  getAllConfirmedAppointments,
};