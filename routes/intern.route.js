const express=require('express')
const router=express.Router()
const internController=require('../controllers/intern.controller')
const{authMiddleware,roleCheck}=require('../middlewares/auth.middleware')


router.post('/profile',authMiddleware,roleCheck('intern'),internController.createProfile)

module.exports=router