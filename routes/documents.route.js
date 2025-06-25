

const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getDocumentsByIntern,
  getDocumentsByInternId,    // new import
  verifyDocument
} = require('../controllers/documents.controller');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const { uploadSingleDocument } = require('../middlewares/documents.validator');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document upload and verification
 */

/**
 * @swagger
 * /api/document:
 *   post:
 *     summary: Upload a document for the intern
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - document_type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               document_type:
 *                 type: string
 *                 enum:
 *                   - aadhar_card
 *                   - photo
 *                   - marksheet_12
 *                   - marksheet_grad
 *                   - marksheet_pg
 *                   - noc
 *                   - conversion_proof
 *                   - research_enrollment
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Missing or invalid file
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  roleCheck('intern'),
  uploadSingleDocument,
  uploadDocument
);

/**
 * @swagger
 * /api/document:
 *   get:
 *     summary: Get all documents uploaded by the logged-in intern
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded documents
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authMiddleware,
  roleCheck('intern'),
  getDocumentsByIntern
);

/**
 * @swagger
 * /api/document/intern/{internId}:
 *   get:
 *     summary: Get all documents for a specific intern (admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: internId
 *         schema:
 *           type: string
 *         required: true
 *         description: Intern user ID
 *     responses:
 *       200:
 *         description: List of documents for that intern
 *       404:
 *         description: Intern not found
 *       500:
 *         description: Server error
 */
router.get(
  '/intern/:internId',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin', 'group_b_admin'),
  getDocumentsByInternId
);

/**
 * @swagger
 * /api/document/{id}/verify:
 *   patch:
 *     summary: Verify or reject a submitted document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID
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
 *                 enum: [verified, rejected]
 *     responses:
 *       200:
 *         description: Document verification status updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.patch(
  '/:id/verify',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin', 'group_b_admin'),
  verifyDocument
);

module.exports = router;
