const express=require('express')
const router=express.Router()
const authController=require('../controllers/auth.controller')

//Routes
router.post('/register',authController.register)
router.post('/verify-otp',authController.verifyOtp)
router.post('/login',authController.login)
router.post('/request-password-reset',authController.requestPasswordReset)
router.post('/reset-password',authController.resetPassword)

module.exports=router