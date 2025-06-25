const{body}=require('express-validator')

exports.validateStatus=[
    body('status')
    .isIn(['incomplete','under_review','rejected'])
    .withMessage('status must be one of incomplete, under_review, rejected'),
]