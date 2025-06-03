const express=require('express')
const router=express.Router()
const{handleValidation}=require('../middlewares/validate')
const{validateRegister,
    validateOTP,
    validateLogin,
    validateResetPassword
}=require('../middlewares/auth.validate')
const authController=require('../controllers/auth.controller')

//Routes
router.post('/register',handleValidation,validateRegister,authController.register)
router.post('/verify-otp',handleValidation,validateOTP,authController.verifyOtp)
router.post('/login',handleValidation,validateLogin,authController.login)
router.post('/request-password-reset',handleValidation,validateOTP,authController.requestPasswordReset)
router.post('/reset-password',handleValidation,validateResetPassword,authController.resetPassword)

module.exports=router