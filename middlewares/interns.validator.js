const{body}=require('express-validator')
const internValidator={
    createOrUpdateProfile:[
        body('full_name').notEmpty().withMessage('Full name is recquired'),

        body('aadhar_number').notEmpty().withMessage('Aadhar number is recquired')
        .isLength({min:12,max:12}).withMessage("Aaadhar number should be 12 characters")
        .isNumeric().withMessage('Aadhar number should be numeric'),

        body('contact_number').optional().isMobilePhone().withMessage('Invalid contact number'),

        body('alt_contact_number').optional().isMobilePhone().withMessage('Invalid contact number'),

        body('date_of_birth').optional().isISO8601().withMessage('DOB should be in ISO format (YYYY-MM-DD)'),

        body('nationality').optional().isString().withMessage('Nationality should be string'),

        body('university').optional().isString().withMessage('University should be string'),

        body('address').optional().isString().withMessage('Address should be string'),

        body('aadhar_card_url').optional().isURL().withMessage('Invalid aadhar card url'),

        body('profile_photo_url').optional().isURL().withMessage('Invalid profile photo url'),
    ]
}
module.exports=internValidator