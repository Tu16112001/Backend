const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./cart.service');
const isAuth = authMiddleWare.isAuth;

let create = async (req, res, next) => {
    service.create(req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function createSchema(req, res, next) {
    const schema = Joi.object({
        userId: Joi.number().required(),
        status: Joi.number().default(0)
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
        status: Joi.number().default(0),
        fullName: Joi.string().default(""),
        mobile: Joi.string().default(""),
        address: Joi.string().default(""),
        note: Joi.string().default(""),
        paymentMethod: Joi.number().default(0)
    });

    validateRequest(req, next, schema);
}

let cleanCart = async (req, res, next) => {
    service.cleanCart(req.params.id)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let getCart = async (req, res, next) => { 
    service.getCart(req.params.id)
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

/*CRUD*/
router.post('/', isAuth, createSchema, create);
router.put('/:id', isAuth, updateSchema, update);
router.delete('/clean/:id', isAuth, cleanCart);
router.get('/:id', isAuth, getCart);

/*QUERIES*/

module.exports = router;