const express = require('express');
const router = express.Router();

const {
  createSubOffice,
  getAllSubOffices,
  getSubOfficesByOfficeId,
  updateSubOffice,
  deactivateSubOffice
} = require('../controllers/subOffices.controller');

const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: SubOffices
 *   description: Sub-office management (create, update, list, deactivate)
 */

/**
 * @swagger
 * /sub-office:
 *   post:
 *     summary: Create a new sub-office
 *     tags: [SubOffices]
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
 *               - name
 *             properties:
 *               office_id:
 *                 type: string
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sub-office created
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, roleCheck('super_admin', 'group_b_admin'), createSubOffice);

/**
 * @swagger
 * /sub-office:
 *   get:
 *     summary: Get all active sub-offices
 *     tags: [SubOffices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active sub-offices
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getAllSubOffices);

/**
 * @swagger
 * /sub-office/office/{id}:
 *   get:
 *     summary: Get sub-offices by office ID
 *     tags: [SubOffices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: officeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the parent office
 *     responses:
 *       200:
 *         description: List of sub-offices for the given office
 *       500:
 *         description: Server error
 */
router.get('/office/:id', authMiddleware, getSubOfficesByOfficeId);

/**
 * @swagger
 * /sub-office/{id}:
 *   put:
 *     summary: Update a sub-office
 *     tags: [SubOffices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sub-office
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sub-office updated
 *       404:
 *         description: Sub-office not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, roleCheck('super_admin', 'group_b_admin'), updateSubOffice);

/**
 * @swagger
 * /sub-office/deactivate/{id}:
 *   patch:
 *     summary: Deactivate a sub-office (soft delete)
 *     tags: [SubOffices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sub-office
 *     responses:
 *       200:
 *         description: Sub-office deactivated
 *       404:
 *         description: Sub-office not found
 *       500:
 *         description: Server error
 */
router.patch('/deactivate/:id', authMiddleware, roleCheck('super_admin', 'group_b_admin'), deactivateSubOffice);

module.exports = router;
