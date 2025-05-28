const express=require('express')
const router=express.Router()
const adminController=require('../controllers/admin.controller')
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')

router.post('/create',authMiddleware,roleCheck('superadmin'),adminController.createAdmin)

module.exports=router