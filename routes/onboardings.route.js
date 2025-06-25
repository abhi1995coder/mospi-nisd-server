// routes/onboarding.route.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');

const upload = multer({ storage: multer.memoryStorage() });
const {
  createOnboarding,
  getOnboarding,
  getOfferLetter,
  respondOffer,
  uploadJoiningReport,
  selectJoinDate,
  uploadBankDetails
} = require('../controllers/onboardings.controller');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const { handleValidation } = require('../middlewares/validator');

// All routes under /api/onboarding

/**
 * @swagger
 * tags:
 *   name: Onboarding
 *   description: Offer & Onboarding flows
 */

/**
 * @swagger
 * /api/onboarding/{applicationId}:
 *   post:
 *     summary: create an onboarding record
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Onboarding details
 */
router.post(
  '/:applicationId',
  authMiddleware,
  roleCheck('intern','super_admin','group_a_admin','group_b_admin'),
  createOnboarding
);

/**
 * @swagger
 * /api/onboarding/{applicationId}:
 *   get:
 *     summary: Get an onboarding record
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Onboarding details
 */
router.get(
  '/:applicationId',
  authMiddleware,
  roleCheck('intern','super_admin','group_a_admin','group_b_admin'),
  getOnboarding
);

/**
 * @swagger
 * /api/onboarding/{applicationId}/offer-letter:
 *   get:
 *     summary: Get the URL of the offer letter
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Offer letter URL
 *       404:
 *         description: Not available
 */
router.get(
  '/:applicationId/offer-letter',
  authMiddleware,
  roleCheck('intern','super_admin','group_a_admin','group_b_admin'),
  getOfferLetter
);

/**
 * @swagger
 * /api/onboarding/{applicationId}/respond-offer:
 *   patch:
 *     summary: Accept or reject the internship offer
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accepted
 *             properties:
 *               accepted:
 *                 type: boolean
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Offer response saved
 */
router.patch(
  '/:applicationId/respond-offer',
  authMiddleware,
  roleCheck('intern'),
  body('accepted').isBoolean(),
  body('reason')
    .if(body('accepted').equals('false'))
    .notEmpty().withMessage('reason is required when rejecting'),
  handleValidation,
  respondOffer
);

/**
 * @swagger
 * /api/onboarding/{applicationId}/joining-report:
 *   post:
 *     summary: Upload the signed joining report
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: file
 *         type: file
 *         description: PDF of joining report
 *     responses:
 *       201:
 *         description: Joining report uploaded
 */
router.post(
  '/:applicationId/joining-report',
  authMiddleware,
  roleCheck('intern'),
  upload.single('file'),
  uploadJoiningReport
);

/**
 * @swagger
 * /api/onboarding/{applicationId}/join-date:
 *   patch:
 *     summary: Select the date of joining
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - join_date
 *             properties:
 *               join_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Join date set
 */
router.patch(
  '/:applicationId/join-date',
  authMiddleware,
  roleCheck('intern'),
  body('join_date').isISO8601().withMessage('join_date must be a valid date'),
  handleValidation,
  selectJoinDate
);

/**
 * @swagger
 * /api/onboarding/{applicationId}/bank-details:
 *   patch:
 *     summary: Upload bank details & passbook
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         schema:
 *           type: string
 *         required: true
 *       - in: formData
 *         name: bank_name
 *         type: string
 *       - in: formData
 *         name: bank_account_no
 *         type: string
 *       - in: formData
 *         name: ifsc_code
 *         type: string
 *       - in: formData
 *         name: passbook
 *         type: file
 *         description: PDF of passbook
 *     responses:
 *       200:
 *         description: Bank details saved
 */
router.patch(
  '/:applicationId/bank-details',
  authMiddleware,
  roleCheck('intern'),
  upload.single('passbook'),
  body('bank_name').notEmpty(),
  body('bank_account_no').notEmpty(),
  body('ifsc_code').notEmpty(),
  handleValidation,
  uploadBankDetails
);

module.exports = router;
