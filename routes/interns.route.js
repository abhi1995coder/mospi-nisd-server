const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const { handleValidation } = require('../middlewares/validator');
const internValidator = require('../middlewares/interns.validator');
const internController = require('../controllers/interns.controller');

/**
 * @swagger
 * tags:
 *   name: Interns
 *   description: Intern profile and qualification management
 */

/**
 * @swagger
 * /intern:
 *   post:
 *     summary: Create or update intern profile (if already exists)
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               father_name:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile created or updated
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, roleCheck('intern'), internValidator.createOrUpdateProfile, handleValidation, internController.createIntern);

/**
 * @swagger
 * /intern/{userId}:
 *   get:
 *     summary: Get intern profile by user ID
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID of intern
 *     responses:
 *       200:
 *         description: Intern profile
 *       404:
 *         description: Intern not found
 *       500:
 *         description: Server error
 */
router.get('/:userId', authMiddleware, roleCheck('intern', 'super_admin', 'group_a_admin', 'group_b_admin'), internController.getInternByUserId);

/**
 * @swagger
 * /intern/{userId}:
 *   put:
 *     summary: Update intern profile by user ID
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               father_name:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               state:
 *                 type: string
 *               district:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       404:
 *         description: Intern not found
 *       500:
 *         description: Server error
 */
router.put('/:userId', authMiddleware, roleCheck('intern'), internValidator.createOrUpdateProfile, handleValidation, internController.updateIntern);

/**
 * @swagger
 * /intern/{userId}/qualifications:
 *   get:
 *     summary: Get qualifications of an intern
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Qualification data
 *       404:
 *         description: Intern or qualification not found
 *       500:
 *         description: Server error
 */
router.get('/:userId/qualifications', authMiddleware, roleCheck('intern', 'super_admin', 'group_a_admin', 'group_b_admin'), internController.getQualifications);

/**
 * @swagger
 * /intern/{userId}/qualifications:
 *   post:
 *     summary: Upsert (create or update) qualifications for an intern
 *     tags: [Interns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             
 *     responses:
 *       200:
 *         description: Qualification created or updated
 *       404:
 *         description: Intern not found
 *       500:
 *         description: Server error
 */
router.post('/:userId/qualifications', authMiddleware, roleCheck('intern'), internController.upsrtQualifications);

module.exports = router;
