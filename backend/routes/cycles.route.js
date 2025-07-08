const router = require('express').Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const cycleCtrl = require('../controllers/cycle.controller');

router.post(
  '/',
  authMiddleware,
  roleCheck('super_admin'),
  cycleCtrl.createCycle
);

router.patch(
  '/update/:id',
  authMiddleware,
  roleCheck('super_admin'),
  cycleCtrl.updateCycle
)
router.put(
  '/:id',
  authMiddleware,
  roleCheck('super_admin'),
  cycleCtrl.disableCycle
)

router.get(
  '/',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  cycleCtrl.getAllCycles
);
router.get(
  '/:id',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  cycleCtrl.getCycleById
);
module.exports = router;