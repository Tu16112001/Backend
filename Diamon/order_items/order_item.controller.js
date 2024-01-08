const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./order_item.service');
const isAuth = authMiddleWare.isAuth;

module.exports = router;