const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    registerValidator,
    loginValidator,
};

let raiseErr = async (req) => {
    let errors = await req.getValidationResult();
    if (!errors.isEmpty()) {
        let err = errors.array();
        let firstError = err.map(error => error.msg)[0];
        return firstError
    }
    return null;
}

let registerValidator = async (req) => {
    req.check('email', 'email is required.').not().isEmpty();
    req.check('email', 'Invalid email.').isEmail();
    req.check('password', 'password is required.').not().isEmpty();
    req.check('password', 'Password must be more than 6 characters').isLength({ min: 6 });
    //check for errors
    return await raiseErr(req);
}

let loginValidator = async (req) => {
    req.check('email', 'email is required.').not().isEmpty();
    req.check('email', 'Invalid email.').isEmail();
    req.check('password', 'password is required.').not().isEmpty();
    req.check('password', 'Password must be more than 6 characters').isLength({ min: 6 });

    //check for errors
    return await raiseErr(req);
}