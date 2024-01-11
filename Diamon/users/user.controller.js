const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const userService = require('./user.service');
const resp = require('../variables/response');
const { isAuth } = require('../_middleware/authentication');

// routes
router.post('/register', registerSchema, register);
router.post('/login', login);
router.get('/logout', isAuth, logout);

module.exports = router;

// route functions
function register(req, res, next) {
    userService.register(req)
        .then(result => res.json(
            resp.response(result, 
                result == true ? null : 100, 
                result == true ? "Đăng ký thành công" : "Email đã được sử dụng trước đó", 
                {}
            )
        ))
        .catch(next)
}

function login(req, res, next) {
    userService.login(req)
        .then(result => res.json(result))
        .catch(next)
}

function logout(req, res, next) {
    userService.logout(req)
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
