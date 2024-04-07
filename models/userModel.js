// userModel.js
const mongoose = require('mongoose');
const Joi = require('joi');
const zxcvbn = require('zxcvbn');


const userMongooseSchema = new mongoose.Schema({
  userId: Joi.string(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?])'))
    .min(8)
    .max(128)
    .required(),
  userRole: Joi.string().valid("general", "admin", "employee").default("general"),
  address: Joi.object({
    streetAddress: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string()
      .pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'postal code')
      .message('Postal Code must be in the format A1A1A1'),
  }),
  phoneNumber: Joi.string()
    .pattern(/^\(\d{3}\)\d{3}-\d{4}$/, 'phone number')
    .message('Phone Number must be in the format (403)403-4003'),
  notification: Joi.array().items(Joi.object({
    type: Joi.string(),
    message: Joi.string(),
    data: Joi.object({
      employeeId: Joi.string(),
      name: Joi.string(),
      onClickPath: Joi.string(),
    }),
    createdAt: Joi.date(),
  })),
  seennotification: Joi.array().items(Joi.object({
    type: Joi.string(),
    message: Joi.string(),
    data: Joi.object({
      employeeId: Joi.string(),
      name: Joi.string(),
      onClickPath: Joi.string(),
    })})),
  createdAt: Joi.date(),
  dismissedAnnouncements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement'
  }],
});

const userSchema = Joi.object({
  userId: Joi.string(),
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\'":\\\\|,.<>\\/?])'))
    .min(8)
    .max(128)
    .required(),
  userRole: Joi.string().valid("general", "admin", "employee").default("general"),
  address: Joi.object({ // Add the address portion to the validation schema
    streetAddress: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string(),
  }),
  notification: Joi.array().items(Joi.object({
    type: Joi.string(),
    message: Joi.string(),
    data: Joi.object({
      employeeId: Joi.string(),
      name: Joi.string(),
      onClickPath: Joi.string(),
    }),
    createdAt: Joi.date(),
  })),
  seennotification: Joi.array().items(Joi.object({
    type: Joi.string(),
    message: Joi.string(),
    data: Joi.object({
      employeeId: Joi.string(),
      name: Joi.string(),
      onClickPath: Joi.string(),
    }),
    createdAt: Joi.date(),
  })),
});
userMongooseSchema.validateUser = async function (user) {
  return userSchema.validateAsync(user);
};
const User = mongoose.model('User', userMongooseSchema);
module.exports = User;