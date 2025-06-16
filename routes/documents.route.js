const express = require('express');
const router = express.Router();
const { uploadDocument, getDocumentsByIntern,verifyDocument } = require('../controllers/documents.controller');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const { uploadSingleDocument } = require('../middlewares/documents.validator');



/**
 * @swagger
 * /documents:
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
 *                 description: Type of the document
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

router.post('/', authMiddleware, roleCheck('intern'), uploadSingleDocument, uploadDocument);


/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get all documents uploaded by the intern
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded documents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       document_type:
 *                         type: string
 *                       document_url:
 *                         type: string
 *                       verification_status:
 *                         type: string
 *                         enum: [pending, verified, rejected]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */

router.get('/',authMiddleware,roleCheck('intern'),getDocumentsByIntern);

/**
 * @swagger
 * /documents/{id}/verify:
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

router.patch('/:id/verify', authMiddleware, roleCheck('super_admin', 'group_a_admin', 'group_b_admin'), verifyDocument);


module.exports = router;
