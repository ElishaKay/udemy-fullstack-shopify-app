const { check } = require('express-validator');

exports.userSigninValidator = [
    check('client_email')
        .isEmail()
        .withMessage('Must be a valid email address'),
    check('client_password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];
