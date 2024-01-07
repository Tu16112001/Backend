const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./category.service');
const cate = require('../variables/category');
const isAuth = authMiddleWare.isAuth;

let create = async (req, res, next) => {
    service.create(req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

async function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        key: Joi.string().required(),
        type: Joi.string().default(cate.category),
        isAvailable: Joi.boolean().default(true)
    });

    validateRequest(req, next, schema);
}

let update = async (req, res, next) => {
    service.update(req.params.id, req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let deleteOne = async (req, res, next) => {
    service.updateActive(req.params.id, req.body.isActive)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
}

let getById = async (req, res, next) => {
    service.getById(req.params.id)
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

let getAll = async (req, res, next) => {
    service.getAll()
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

let getByType = async (req, res, next) => {
    service.getByType(req.params.type)
    .then((result) => { return res.status(200).json(result) })
    .catch(next);
}

router.post('/create', isAuth, createSchema, create);
router.put('/:id', isAuth, update);
router.put('/active/:id', isAuth, deleteOne);
router.get('/:id', getById);
router.get('/', getAll);
router.get('/getByType/:type', getByType);

module.exports = router;