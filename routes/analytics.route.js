const express = require('express');
const router  = express.Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const analytics = require('../controllers/analytics.controller');

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Dashboard metrics and CSV exports
 */

/**
 * @swagger
 * /analytics/applications-summary:
 *   get:
 *     summary: Get counts of applications by status & group
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: summary data
 */
router.get(
  '/applications-summary',
  authMiddleware,
  roleCheck('super_admin','group_a_admin'),
  analytics.applicationsSummary
);

/**
 * @swagger
 * /analytics/interns-summary:
 *   get:
 *     summary: Get interns count per office & avg attendance % (30d)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: summary data
 */
router.get(
  '/interns-summary',
  authMiddleware,
  roleCheck('super_admin','group_a_admin'),
  analytics.internsSummary
);

/**
 * @swagger
 * /analytics/export-applications:
 *   get:
 *     summary: Export all applications as CSV
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file
 */
router.get(
  '/export-applications',
  authMiddleware,
  roleCheck('super_admin'),
  analytics.exportApplications
);

module.exports = router;
