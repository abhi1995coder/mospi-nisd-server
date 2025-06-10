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

// Admin routes
router.post('/', authMiddleware, roleCheck('super_admin', 'group_b_admin'), createSubOffice);
router.put('/:id', authMiddleware, roleCheck('super_admin', 'group_b_admin'), updateSubOffice);
router.patch('/deactivate/:id', authMiddleware, roleCheck('super_admin', 'group_b_admin'), deactivateSubOffice);

// All users
router.get('/', authMiddleware, getAllSubOffices);
router.get('/office/:officeId', authMiddleware, getSubOfficesByOfficeId);

module.exports = router;
