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
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
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
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 *       404:
 *         description: User not found
 *       403:
 *         description: Account not verified/Account disabled
 *       400:
 *         description: Invalid password
 *       500:
 *         description: Internal server error
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
 *       404:
 *         description: User not found
 *       400:
 *          description: Invalid or expired otp
 *       500:
 *          description: Internal server error
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
 *       500:
 *         description: Internal server error
 *       404:
 *          description: Invalid credentials
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
 *       500:
 *         description: Internal server error
 *       400:
 *         description: Invalid/Expired OTP
 */
router.post('/reset-password', validateResetPassword, handleValidation, authController.resetPassword);

module.exports = router;
