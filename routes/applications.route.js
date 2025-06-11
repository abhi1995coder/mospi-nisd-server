// routes/applications.routes.js
const express = require('express');
const router = express.Router();

const {
  createApplication,
  getApplicationByInternId,
  submitPreferences,
  submitApplication
} = require('../controllers/applications.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

// Intern creates application
router.post('/', authMiddleware, createApplication);

// Intern submits internship preferences
router.post('/:applicationId/preferences', authMiddleware, submitPreferences);

// Intern final submission
router.patch('/:applicationId/submit', authMiddleware, submitApplication);

// View application by intern
router.get('/intern/:internId', authMiddleware, getApplicationByInternId);

module.exports = router;
