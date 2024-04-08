const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");


// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid Password');
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:"1d"},);
    res.status(200).send({ message: "Login Success", success: true, token, userId: user._id });
  } catch (error) {
    console.log(error);
    console.log(process.env.JWT_SECRET);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      newUser,
      userId: newUser._id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

const viewprofilecontroller = async (req, res) => {
  try {
    // Check if user object is available in the request
    // if (!req.user) {
    //     return res.status(401).json({ success: false, message: 'User not authenticated' });
    // }

    // Log the userId received from the frontend
    const userId = req.body.userId; // Extract the userId from the URL parameter

    // Optionally, compare the userId with req.user._id (if your logic requires)
    // This depends on your application's requirements
    // For example, you might want to ensure that users can only view their own profile
    // if (req.user._id !== userId) {
    //   // Handle the case where the user is trying to access someone else's profile, if needed
    // }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Since the example shows you are using req.user for user data,
    // the rest of the function might not need significant changes.

    // const { name, email, address, phoneNumber } = req.user;

    // Construct the user profile object
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      phoneNumber: user.phoneNumber
    };

    // Send the user profile as the response
    res.status(200).json({ success: true, userProfile });
  } catch (error) {
    console.error('Error viewing profile:', error);
    res.status(500).json({ success: false, message: 'Error viewing profile', error });
  }
};

// updateprofilecontroller
const updateProfileController = async (req, res) => {
  console.log("updateProfileController");
  try {
    const userId = req.params.userId; // Extract userId from URL parameters
    const { name, email, address, phoneNumber } = req.body;
    // console.log(name, email, address, phoneNumber);

    const missingFields = [];

    // Check if all required fields are provided
    if (!name) {
      missingFields.push('name');
    }
    if (!email) {
      missingFields.push('email');
    }
    if (!address) {
      missingFields.push('address');
    }

    if (missingFields.length > 0) {
      return res.status(400).send({ success: false, message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Find the user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: 'User not found' });
    }

    // Update user profile fields
    user.name = name;
    user.email = email;
    user.address = address;
    user.phoneNumber = phoneNumber;

    // Save changes to the user profile
    await user.save();

    // Send success response
    res.status(200).send({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ success: false, message: 'Error updating profile', error: error.message });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      user.password = undefined; // move this line here
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};




module.exports = { loginController, registerController, authController };


