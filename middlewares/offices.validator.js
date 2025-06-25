// middlewares/offices.validator.js
const { body } = require('express-validator');

exports.validateOffice = [
  body('office_name')
    .trim().notEmpty().withMessage('office_name is required'),
  body('office_type')
    .isIn(['group_a','group_b'])
    .withMessage('office_type must be "group_a" or "group_b"'),
  body('city').notEmpty(),
  body('state').notEmpty(),
  body('address').notEmpty(),
  body('contact_person').notEmpty(),
  body('contact_email').isEmail(),
  body('contact_phone').notEmpty(),
];
