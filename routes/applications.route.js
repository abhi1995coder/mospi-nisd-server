const express=require('express')
const router=express.Router()
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')
const {
    createApplication,
    getApplicationByInternId,
    updateApplication,
    submitApplication
}=require('../controllers/applications.controller')

router.post('/',authMiddleware,roleCheck('intern'),createApplication)
router.get('/:internId',authMiddleware,roleCheck('super_admin','group_a_admin','group_b_admin'),getApplicationByInternId)
router.patch('/:applicationId',authMiddleware,roleCheck('intern'),updateApplication)
router.put('/:applicationId/submit',authMiddleware,roleCheck('intern'),submitApplication)

module.exports=router