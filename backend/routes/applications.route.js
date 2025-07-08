const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const appCtrl = require('../controllers/applications.controller');

router.use(authMiddleware);

router.post('/', appCtrl.createApplication);
router.get('/', appCtrl.getApplicationsByUser);
router.get('/:id', appCtrl.getApplicationById);
router.patch('/:id/status', appCtrl.updateApplicationStatus);

module.exports = router;


