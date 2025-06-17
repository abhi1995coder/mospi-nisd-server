const express = require('express');
const router = express.Router();

const { handleValidation } = require('../middlewares/validator');


const {
  createApplication,
  getApplicationByInternId,
  submitPreferences,
  submitApplication,
  updateApplicationStatus
} = require('../controllers/applications.controller');

const { runAllocationAPI } = require('../controllers/allocation.controller');

const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Internship application and allocation APIs
 */

/**
 * @swagger
 * /application:
 *   post:
 *     summary: Create a new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - intern_id
 *               - group_type
 *             properties:
 *               intern_id:
 *                 type: string
 *               group_type:
 *                 type: string
 *                 enum: [A, B]
 *     responses:
 *       201:
 *         description: Application created
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createApplication);

/**
 * @swagger
 * /application/{applicationId}/preferences:
 *   post:
 *     summary: Submit internship preferences
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferences
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     internship_id:
 *                       type: string
 *                     preference_order:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Preferences submitted successfully
 *       400:
 *         description: Invalid preferences
 *       500:
 *         description: Server error
 */
router.post('/:applicationId/preferences', authMiddleware, submitPreferences);

/**
 * @swagger
 * /application/{applicationId}/submit:
 *   patch:
 *     summary: Submit the application for review
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: applicationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application submitted
 *       400:
 *         description: Already submitted
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.patch('/:applicationId/submit', authMiddleware, submitApplication);

/**
 * @swagger
 * /application/intern/{internId}:
 *   get:
 *     summary: Get applications of an intern
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: internId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Applications retrieved
 *       500:
 *         description: Server error
 */
router.get('/intern/:internId', authMiddleware, getApplicationByInternId);

/**
 * @swagger
 * /application/allocate/run:
 *   post:
 *     summary: Run the internship allocation script (admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Allocation completed
 *       500:
 *         description: Allocation failed
 */
router.post('/allocate/run', authMiddleware, roleCheck('super_admin'), runAllocationAPI);

/**
 * @swagger
 * /api/application/{applicationId}/status:
 *   patch:
 *     summary: Manually update application status (admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [incomplete, under_review, rejected]
 *               rejection_reason:
 *                 type: string
 *                 description: Required if status is 'incomplete' or 'rejected'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:applicationId/status',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  // Validate presence of status field
  body('status')
    .isIn(['incomplete','under_review','rejected'])
    .withMessage('status must be one of incomplete, under_review, rejected'),
  handleValidation,
  updateApplicationStatus
);

module.exports = router;
