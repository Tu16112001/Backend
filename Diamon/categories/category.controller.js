const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authMiddleWare = require("_middleware/authentication");
const service = require('./category.service');
const cate = require('../variables/category');
const { next } = require('cheerio/lib/api/traversing');
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
        type: Joi.string().default(cate.category)
    });

    validateRequest(req, next, schema);
}

let update = async (req, res, next) => {
    service.update(req.params.id, req.body)
        .then((result) => { return res.status(200).json(result) })
        .catch(next);
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

router.post('/create', isAuth, createSchema, create);
router.put('/:id', isAuth, update);
router.delete('/:id', isAuth, deleteOne);
router.get('/:id', getById);
module.exports = router;