const router = require('express').Router();
const { authMiddleware, roleCheck } = require('../middlewares/auth.middleware');
const vacCtrl = require('../controllers/vacancy.controller');

router.post(
  '/',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  vacCtrl.createVacancy
);
router.patch(
  '/:officeId',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  vacCtrl.UpdateVacancy
)

router.get(
  '/cycle/:cycleId',
  authMiddleware,
  roleCheck('super_admin','group_a_admin','group_b_admin'),
  vacCtrl.getVacanciesByCycle
);

module.exports = router;
