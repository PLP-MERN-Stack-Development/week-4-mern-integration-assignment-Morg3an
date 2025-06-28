// middleware/validationMiddleware.js

const { validationResult } = require('express-validator');

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            [err.param]: err.msg,
        }));

        return res.status(422).json({
            success: false,
            errors: extractedErrors,
        });
    }

    next();
};