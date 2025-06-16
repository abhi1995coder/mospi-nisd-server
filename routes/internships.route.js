const express = require('express');
const router = express.Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const internshipController = require('../controllers/internships.controller');

/**
 * @swagger
 * tags:
 *   name: Internships
 *   description: Internship management routes
 */

/**
 * @swagger
 * /internships:
 *   post:
 *     summary: Create a new internship
 *     tags: [Internships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - office_id
 *               - title
 *               - group_type
 *               - duration_months
 *               - start_date
 *               - end_date
 *               - available_slots
 *               - status
 *             properties:
 *               office_id:
 *                 type: string
 *               title:
 *                 type: string
 *               group_type:
 *                 type: string
 *                 enum: [A, B]
 *               duration_months:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               available_slots:
 *                 type: integer
 *               status:
 *                 type: string
 *                 example: "open"
 *     responses:
 *       201:
 *         description: Internship created
 *       404:
 *         description: Office not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), internshipController.createInternship);

/**
 * @swagger
 * /internships:
 *   get:
 *     summary: Get all internships (filterable by group_type)
 *     tags: [Internships]
 *     parameters:
 *       - name: group_type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [A, B]
 *         description: Filter internships by group type
 *     responses:
 *       200:
 *         description: List of internships
 *       500:
 *         description: Server error
 */
router.get('/', internshipController.getAllInternship);

/**
 * @swagger
 * /internships/{id}:
 *   get:
 *     summary: Get internship by ID
 *     tags: [Internships]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *     responses:
 *       200:
 *         description: Internship details
 *       404:
 *         description: Internship not found
 *       500:
 *         description: Server error
 */
router.get('/:id', internshipController.getInternshipById);

/**
 * @swagger
 * /internships/{id}:
 *   put:
 *     summary: Update an internship
 *     tags: [Internships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Internship ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               group_type:
 *                 type: string
 *               duration_months:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               available_slots:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Internship updated
 *       404:
 *         description: Internship not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), internshipController.updateInternship);

module.exports = router;
