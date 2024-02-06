// userModel.js
const mongoose = require('mongoose');
const Joi = require('joi');
const zxcvbn = require('zxcvbn');

const userMongooseSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: [
      {
        validator: value => zxcvbn(value).score >= 3,
        message: 'Password is too weak',
      },
      {
        validator: value => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value),
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ],
  },
  userRole: {
    type: String,
    default: "general", // Possible values: "general", "admin", "employee"
  },
  notification: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
