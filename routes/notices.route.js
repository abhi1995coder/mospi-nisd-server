const express = require('express');
const router = express.Router();

const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deactivateNotice
} = require('../controllers/notices.controller');

const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const { validateNotice } = require('../middlewares/notices.validator');
const { handleValidation } = require('../middlewares/validator');

/**
 * @swagger
 * tags:
 *   name: Notices
 *   description: Notice board management
 */

/**
 * @swagger
 * /notice:
 *   post:
 *     summary: Create a new notice
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notice created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin'),
  validateNotice,
  handleValidation,
  createNotice
);

/**
 * @swagger
 * /notice:
 *   get:
 *     summary: Get all notices
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notices
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getAllNotices);

/**
 * @swagger
 * /notice/{id}:
 *   get:
 *     summary: Get a single notice by ID
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice ID
 *     responses:
 *       200:
 *         description: Notice found
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, getNoticeById);

/**
 * @swagger
 * /notice/{id}:
 *   put:
 *     summary: Update a notice
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notice updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin'),
  validateNotice,
  handleValidation,
  updateNotice
);

/**
 * @swagger
 * /notice/{id}:
 *    patch:
 *     summary: Deactivate a notice
 *     tags: [Notices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Notice ID
 *     responses:
 *       200:
 *         description: Notice deactivated
 *       404:
 *         description: Notice not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin'),
  deactivateNotice
);

module.exports = router;
