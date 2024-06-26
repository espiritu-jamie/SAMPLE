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
  address: {
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    postalCode: {
      type: String,
      validate: {
        validator: function(value) {
          return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value);
        },
        message: props => `${props.value} is not a valid postal code format (e.g., A1A 1A1)`
      }
    },
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(value) {
        return /^\(\d{3}\)\d{3}-\d{4}$/.test(value);
      },
      message: props => `${props.value} is not a valid phone number format (e.g., (403)403-4003)`
    },
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
  address: Joi.object({
    streetAddress: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    postalCode: Joi.string()
      .pattern(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'postal code')
      .message('Postal Code must be in the format A1A 1A1'),
    }),
  phoneNumber: Joi.string()
    .pattern(/^\(\d{3}\)\d{3}-\d{4}$/, 'phone number')
    .message('Phone Number must be in the format (403)403-4003'),
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

