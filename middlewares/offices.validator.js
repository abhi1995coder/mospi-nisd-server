// middlewares/offices.validator.js
const { body } = require('express-validator');

exports.validateOffice = [
  body('office_name')
    .trim().notEmpty().withMessage('office_name is required'),
  body('office_type')
    .isIn(['A','B'])
    .withMessage('office_type must be "A" or "B"'),
  body('city').notEmpty(),
  body('state').notEmpty(),
  body('address').notEmpty(),
  body('contact_person').notEmpty(),
  body('contact_email').isEmail(),
  body('contact_phone').notEmpty(),
];
