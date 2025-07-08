// routes/notices.route.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const noticeCtrl = require('../controllers/notices.controller');

// Configure multer storage for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/notices');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF format is allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Admin uploads a notice
router.post(
  '/',
  authMiddleware,
  roleCheck('super_admin', 'group_a_admin'),
  upload.single('file'),
  noticeCtrl.uploadNotice
);

// Public endpoint for homepage to list notices
router.get('/', noticeCtrl.getNotices);

module.exports = router;
