var {validationResult} = require('express-validator');

const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        console.warn(errors);
        errors.array().map((err) => (error[err.path] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};
module.exports = Validate;