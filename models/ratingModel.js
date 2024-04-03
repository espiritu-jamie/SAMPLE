const mongoose = require('mongoose');
const Joi = require('joi');

const ratingMongooseSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Validation schema using Joi
const ratingSchema = Joi.object({
  appointmentId: Joi.string().required(),
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().required(),
});

ratingMongooseSchema.statics.validateRating = async function (rating) {
  return ratingSchema.validateAsync(rating);
};

const Rating = mongoose.model('Rating', ratingMongooseSchema);
module.exports = Rating;
