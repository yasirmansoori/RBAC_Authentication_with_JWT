// Dependencies
const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchemaUpdate } = require('../validations/user.validation');
require('dotenv').config('../../.env');

// Module scaffolding
const adminController = {};

// Get all users
adminController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    // Send response
    const payload = {
      message: "All users",
      Total: users.length,
      data: users.map(user => {
        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role
        }
      })
    };

    res.status(200).json(payload)
  } catch (error) {
    next(error)
  }
};

// Get user by id
adminController.getUserById = async (req, res, next) => {
  try {
    // Get user id from request params
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id).select('-__v');
    if (!user) throw createError.NotFound("User not found")

    // Send response
    const payload = {
      message: "User found",
      data: user
    };
    res.status(200).json(payload)
  }
  catch (error) {
    next(error)
  }
};

// Update user by id
adminController.updateUserById = async (req, res, next) => {
  try {
    // Get user id from request params
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) throw createError.NotFound("User not found")

    // validate request body
    const result = await authSchemaUpdate.validateAsync(req.body);

    // if email is provided, check if it already exists
    if (result.email) {
      const emailExists = await User.findOne({ email: result.email, _id: { $ne: id } });
      if (emailExists) throw createError.Conflict("Email already exists")
    }

    // if role is not provided, set already existing role
    if (!result.role) result.role = user.role;

    // Update user
    const updated = await User.findByIdAndUpdate(id, result, { new: true }).select('-__v');

    // Send response
    const payload = {
      message: "User updated",
      data: updated
    };

    res.status(200).json(payload)
  } catch (error) {
    next(error)
  }
};

// Delete user by id
adminController.deleteUserById = async (req, res, next) => {
  try {
    // Get user id from request params
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) throw createError.NotFound("User not found")

    // Delete user
    const deleted = await User.findByIdAndDelete(id);

    // Send response
    const payload = {
      message: "User deleted",
      data: deleted
    };

    res.status(200).json(payload)
  } catch (error) {
    next(error)
  }
};

module.exports = adminController;

