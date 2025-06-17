const express = require('express');
const router = express.Router();

const { handleValidation } = require('../middlewares/validator');
const { validateOffice } = require('../middlewares/offices.validator');

const {
  createOffice,
  getAllOffices,
  getOfficeById,
  updateOffice,
  disableOffice,
} = require('../controllers/offices.controller');

const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');


/**
 * @swagger
 * tags:
 *   name: Offices
 *   description: Office management (CRUD operations)
 */

/**
 * @swagger
 * /office:
 *   post:
 *     summary: Create a new office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - office_name
 *               - office_type
 *               - city
 *               - state
 *               - address
 *               - contact_person
 *               - contact_email
 *               - contact_phone
 *             properties:
 *               office_name:
 *                 type: string
 *               office_type:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Office created successfully
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware,handleValidation,validateOffice, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), createOffice);

/**
 * @swagger
 * /office:
 *   get:
 *     summary: Get all offices
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of offices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offices:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Office'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getAllOffices);

/**
 * @swagger
 * /office/{id}:
 *   get:
 *     summary: Get a single office by ID
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     responses:
 *       200:
 *         description: Office found
 *       404:
 *         description: Office not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getOfficeById);

/**
 * @swagger
 * /office/{id}:
 *   put:
 *     summary: Update an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               office_name:
 *                 type: string
 *               office_type:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               address:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Office updated
 *       404:
 *         description: Office not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), updateOffice);

/**
 * @swagger
 * /office/{id}:
 *   patch:
 *     summary: Disable an office
 *     tags: [Offices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Office ID
 *     responses:
 *       200:
 *         description: Office disabled
 *       404:
 *         description: Office not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', authMiddleware, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), disableOffice);

module.exports = router;
