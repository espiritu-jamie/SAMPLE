const mongoose = require('mongoose');
const Joi = require('joi');

const announcementMongooseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000,
  },
  targetRoles: [{
    type: String,
    enum: ['admin', 'employee', 'general'],
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Validation schema using Joi
const announcementSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  content: Joi.string().min(1).max(1000).required(),
  targetRoles: Joi.array().items(Joi.string().valid('admin', 'employee', 'general')).required(),
});

announcementMongooseSchema.statics.validateAnnouncement = async function (announcement) {
  return announcementSchema.validateAsync(announcement);
};

const Announcement = mongoose.model('Announcement', announcementMongooseSchema);
module.exports = Announcement;
