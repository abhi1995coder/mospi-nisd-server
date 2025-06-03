const express=require('express')
const router=express.Router()
const{handleValidation}=require('../middlewares/validator')
const{validateRegister,
    validateOTP,
    validateLogin,
    validateResetPassword
}=require('../middlewares/auth.validator')
const authController=require('../controllers/auth.controller')

//Routes
router.post('/register',validateRegister,handleValidation,authController.register)
router.post('/verify-otp',validateOTP,handleValidation,authController.verifyOtp)
router.post('/login',validateLogin,handleValidation,authController.login)
router.post('/request-password-reset',validateOTP,handleValidation,authController.requestPasswordReset)
router.post('/reset-password',validateResetPassword,handleValidation,authController.resetPassword)

module.exports=router