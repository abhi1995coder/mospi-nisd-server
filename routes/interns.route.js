const express=require('express')
const router=express.Router()
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')
const{handleValidation}=require('../middlewares/validator')
const internValidator=require('../middlewares/interns.validator')
const internController=require('../controllers/interns.controller')



router.post('/',authMiddleware,roleCheck('intern'),internValidator.createOrUpdateProfile,handleValidation,internController.createIntern)
router.get('/:userId',authMiddleware,roleCheck('intern','super_admin','group_a_admin','group_b_admin'),internController.getInternByUserId)
router.put('/:userId',authMiddleware,roleCheck('intern'),internValidator.createOrUpdateProfile,handleValidation,internController.updateIntern)
router.get('/:userId/qualifications',authMiddleware,roleCheck('intern','super_admin','group_a_admin','group_b_admin'),internController.getQualifications)
router.post('/:userId/qualifications',authMiddleware,roleCheck('intern'),internController.upsrtQualifications)

module.exports=router