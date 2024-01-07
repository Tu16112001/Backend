const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./product.service');
const isAuth = authMiddleWare.isAuth;

let create = async (req, res, next) => {
    service.create(req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function createSchema(req, res, next) {
    const schema = Joi.object({
        categoryId: Joi.number().required(),
        userId: Joi.number().required(),
        title: Joi.string().required(),
        sumary: Joi.string().required(),
        price: Joi.number().required(),
        discount: Joi.number().required().default(0),
        quantity: Joi.number().required().default(0),
        content: Joi.string().required().default(""),
        image: Joi.string(),    
        isAvailable: Joi.boolean().default(true),
        totalSold: Joi.number().default(0)    
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
        categoryId: Joi.number().required(),
        title: Joi.string().required(),
        sumary: Joi.string().required(),
        price: Joi.number().required(),
        discount: Joi.number().required().default(0),
        quantity: Joi.number().required().default(0),
        content: Joi.string().required().default(""),
        image: Joi.string(),
    });

    validateRequest(req, next, schema);
}

let deleteOne = async (req, res, next) => {
    service.deleteOne(req.params.id)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let getById = async (req, res, next) => {
    service.getById(req.params.id)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let getProducts = async (req, res, next) => {
    service.getProduct(req)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let searchProducts = async (req, res, next) => {
    service.searchProduct(req)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

/*CRUD*/
router.post('/', isAuth, createSchema, create);
router.put('/:id', isAuth, updateSchema, update);
router.delete('/:id', isAuth, deleteOne);

/*QUERIES*/
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getById);


module.exports = router;