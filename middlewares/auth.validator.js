const{body}=require('express-validator')

exports.validateRegister=[
    body('email').isEmail().withMessage('Valid email is recquired'),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 digits')
]
exports.validateOTP=[
     body('email').isEmail().withMessage('Valid email is recquired'),
    body('otp').isLength({min:6}).isNumeric().withMessage('OTP must be numeric')
]
exports.validateLogin=[
     body('email').isEmail().withMessage('Valid email is recquired'),
     body('password').notEmpty().withMessage('Password is recquired')
]
exports.validateResetPassword=[
       body('email').isEmail().withMessage('Valid email is recquired'),
       body('password').isLength({min:6}).withMessage('Password should be greater than 6 digits'),
       body('otp').isLength({min:6,max:6}).isNumeric().withMessage('OTP should be numeric and 6 digits')
]

