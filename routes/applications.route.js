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


router.post('/', authMiddleware, createApplication);


router.post('/:applicationId/preferences', authMiddleware, submitPreferences);


router.patch('/:applicationId/submit', authMiddleware, submitApplication);


router.get('/intern/:internId', authMiddleware, getApplicationByInternId);

module.exports = router;
