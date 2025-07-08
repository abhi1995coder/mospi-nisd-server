const { body } = require('express-validator');

exports.validateNotice = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be at most 255 characters'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
];
