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

// Create: only super_admin & group_a_admin
router.post(
  '/',
  authMiddleware,
  roleCheck('super_admin','group_a_admin'),
  
  createSubOffice
);

// List all active sub-offices:
//  - super_admin & group_a_admin see all
//  - group_b_admin sees only their office’s sub-offices
router.get(
  '/',
  authMiddleware,
  getAllSubOffices
);

// List sub-offices for a single office
router.get(
  '/office/:id',
  authMiddleware,
  getSubOfficesByOfficeId
);

// Update: only super_admin & group_a_admin
router.put(
  '/:id',
  authMiddleware,
  roleCheck('super_admin','group_a_admin'),
  
  updateSubOffice
);

// Deactivate: only super_admin & group_a_admin
router.patch(
  '/deactivate/:id',
  authMiddleware,
  roleCheck('super_admin','group_a_admin'),
  deactivateSubOffice
);

module.exports = router;