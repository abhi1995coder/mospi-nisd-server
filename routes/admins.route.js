const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management routes (only accessible by super_admin)
 */

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create a new admin (group A or B)
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [group_a_admin, group_b_admin]
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */
router.post('/create', authMiddleware, roleCheck('super_admin'), adminController.createAdmin);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Edit an existing admin's details
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [group_a_admin, group_b_admin]
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Invalid role
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Failed to update admin
 */
router.put('/:id', authMiddleware, roleCheck('super_admin'), adminController.editAdmin);

/**
 * @swagger
 * /admin/{id}/disable:
 *   patch:
 *     summary: Disable an admin account
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Admin disabled successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Failed to disable admin
 */
router.patch('/:id/disable', authMiddleware, roleCheck('super_admin'), adminController.disableAdmin);

/**
 * @swagger
 * /admin/list:
 *   get:
 *     summary: Get list of all group_a and group_b admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Failed to fetch admins
 */
router.get('/list', authMiddleware, roleCheck('super_admin'), adminController.getAllAdmins);

module.exports = router;
