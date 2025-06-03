const express=require('express')
const router=express.Router()
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')
const{handleValidation}=require('../middlewares/validate')
const {validateInternProfile}=require('../middlewares/interns.validator')
const internController=require('../controllers/interns.controller')



router.post('/',authMiddleware,roleCheck('intern'),handleValidation,validateInternProfile,internController.createIntern)
router.get('/:userId',authMiddleware,roleCheck('intern','super_admin','group_a_admin','group_b_admin'),handleValidation,validateInternProfile,internController.getInternByUserId)
router.put('/:userId',authMiddleware,roleCheck('intern'),handleValidation,validateInternProfile,internController.updateIntern)
router.get('/:userId/qualification',authMiddleware,roleCheck('intern','super_admin','group_a_admin','group_b_admin'),handleValidation,validateInternProfile,internController.getQualifications)
router.post('/:userId/qualifications',authMiddleware,roleCheck('intern'),handleValidation,validateInternProfile,internController.updateQualifications)

module.exports=router