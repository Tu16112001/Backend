const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./cart_item.service');
const isAuth = authMiddleWare.isAuth;

let create = async (req, res, next) => {
    service.create(req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function createSchema(req, res, next) {
    const schema = Joi.object({
        productId: Joi.number().required(),
        cartId: Joi.number().required(),
        price: Joi.number.required(),
        quantity: Joi.number().required().default(0),
        note: Joi.string().required().default(""),
    });

    validateRequest(req, next, schema);
}

let update = async (req, res, next) => {
    service.update(req.params.id, req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function updateSchema(req, res, next) {
    const schema = Joi.object({
        productId: Joi.number().required(),
        cartId: Joi.number().required(),
        price: Joi.number.required(),
        quantity: Joi.number().required().default(0),
        note: Joi.string().required().default(""),
    });

    validateRequest(req, next, schema);
}

let deleteOne = async (req, res, next) => {
    service.deleteOne(req.params.id)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

/*CRUD*/
router.post('/', isAuth, createSchema, create);
router.put('/:id', isAuth, updateSchema, update);
router.delete('/:id', isAuth, deleteOne);

/*QUERIES*/

module.exports = router;