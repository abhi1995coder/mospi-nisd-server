const express = require('express');
const router  = express.Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const attendCtrl = require('../controllers/attendence.controller');

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Check-in/out and attendance summary
 */

/**
 * @swagger
 * /attendance/check-in:
 *   post:
 *     summary: Mark your check-in for today
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checked in successfully
 */
router.post(
  '/check-in',
  authMiddleware,
  roleCheck('intern'),
  attendCtrl.checkIn
);

/**
 * @swagger
 * /attendance/check-out:
 *   post:
 *     summary: Mark your check-out for today
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checked out successfully
 */
router.post(
  '/check-out',
  authMiddleware,
  roleCheck('intern'),
  attendCtrl.checkOut
);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: List all your attendance entries
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of attendance records
 */
router.get(
  '/',
  authMiddleware,
  roleCheck('intern'),
  attendCtrl.getMyAttendance
);

/**
 * @swagger
 * /attendance/summary:
 *   get:
 *     summary: Get attendance percentage over a date range
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Attendance summary
 */
router.get(
  '/summary',
  authMiddleware,
  roleCheck('intern'),
  attendCtrl.getSummary
);

module.exports = router;
