const express = require('express');
const router = express.Router();
const { handleValidation } = require('../middlewares/validator');
const {
  validateRegister,
  validateOTP,
  validateLogin,
  validateEmail,
  validateResetPassword
} = require('../middlewares/auth.validator');
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registered successfullly,OTP sent
 */
router.post('/register', validateRegister, handleValidation, authController.register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP for registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified and token sent
 */
router.post('/verify-otp', validateOTP, handleValidation, authController.verifyOtp);

/**
 * @swagger
 * /auth/request-login-otp:
 *   post:
 *     summary: Request OTP for login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent for login
 */
router.post('/request-login-otp', validateLogin, handleValidation, authController.requestOtpLogin);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post('/login', validateOTP, handleValidation, authController.login);

/**
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent to email
 */
router.post('/forget-password', validateEmail, handleValidation, authController.requestPasswordReset);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - new_password
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', validateResetPassword, handleValidation, authController.resetPassword);

module.exports = router;
