const userModel = require("../models/userModel");

const getUserRole = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error('User not found');
    return user.userRole;
  };

module.exports = {
    getUserRole,
    };