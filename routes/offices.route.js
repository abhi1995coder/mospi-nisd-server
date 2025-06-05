const express = require('express');
const router = express.Router();

const {
  createOffice,
  getAllOffices,
  getOfficeById,
  updateOffice,
  deleteOffice,
} = require('../controllers/offices.controller');

const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');

// Admin only
router.post(
  '/',
  authMiddleware,
  roleCheck('admin'),
  createOffice
);

router.put(
  '/:id',
  authMiddleware,
  roleCheck('admin'),
  updateOffice
);

router.delete(
  '/:id',
  authMiddleware,
  roleCheck('admin'),
  deleteOffice
);

// Accessible to both admin and interns
router.get('/', authMiddleware, getAllOffices);
router.get('/:id', authMiddleware, getOfficeById);

module.exports = router;
