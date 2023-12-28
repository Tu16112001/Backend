const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// routes
router.post('/register', registerSchema, register);
router.post('/login', login);

module.exports = router;

// route functions
function register(req, res, next) {
    userService.register(req)
        .then(result => res.json({
            isSuccess: result,
            message: result == true ? "Đăng ký thành công" : "Email đã được sử dụng trước đó",
            errorCode: result == true ? null : 100,
            data: {}
        }))
        .catch(next)
}

function login(req, res, next) {
    userService.login(req)
        .then(result => res.json(result))
        .catch(next)
}


// schema functions
function registerSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        fullName: Joi.string(),
        address: Joi.string(),
        phone: Joi.string()
    });
    validateRequest(req, next, schema);
}
