// routes/preferences.route.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const prefCtrl = require('../controllers/preferences.controller');

router.use(authMiddleware);

router.post('/', prefCtrl.setPreferences);
router.get('/:applicationId', prefCtrl.getPreferences);

module.exports = router;