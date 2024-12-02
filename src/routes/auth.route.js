// Dependencies
const express = require('express');

// Controller
const authController = require("../controllers/auth.controller");
const { authenticate } = require('../middlewares/auth');

// Module scaffolding
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh-token", authenticate, authController.refreshToken);
authRouter.delete("/logout", authenticate, authController.logout);

// Export module
module.exports = authRouter;