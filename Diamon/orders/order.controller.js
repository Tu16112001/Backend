const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./order.service');
const isAuth = authMiddleWare.isAuth;

let create = async (req, res, next) => {
    service.create(req)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let updateStatus = async (req, res, next) => {
    service.updateStatus(req.params.id, req.body.status)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function createSchema(req, res, next) {
    const schema = Joi.object({
        cartId: Joi.number().required()
    });

    validateRequest(req, next, schema);
}

let getByUser = async (req, res, next) => {
    service.getByUser(req)
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

let getAll = async (req, res, next) => {
    service.getAllOrder(req)
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

router.post('/', isAuth, createSchema, create);
router.get('/', isAuth, getAll);
router.get('/byCurrentUser', isAuth, getByUser);
router.put('/status/:id', isAuth, updateStatus);

module.exports = router;