const express=require('express')
const router=express.Router()
const {authMiddleware,roleCheck}=require('../middlewares/auth.middleware')
const internshipController=require('../controllers/internships.controller')

router.post('/',authMiddleware,roleCheck('super_admin','group_a_admin','group_b_admin'),internshipController.createInternship)

router.put('/:id',authMiddleware,roleCheck('super_admin','group_a_admin','group_b_admin'),internshipController.updateInternship)

router.get('/',internshipController.getAllInternship)
router.get('/:id',internshipController.getInternshipById)



module.exports=router