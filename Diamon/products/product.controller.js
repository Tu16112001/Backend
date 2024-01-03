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

/*
categoryId: {type: DataTypes.INTEGER, allowNull: false},
        userId: {type: DataTypes.INTEGER, allowNull: false},
        title: { type: DataTypes.STRING, allowNull: false },        
        sumary: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.DOUBLE, allowNull: false },
        discount: { type: DataTypes.DOUBLE, allowNull: false },
        quantity: {type: DataTypes.INTEGER, allowNull: false},
        content: { type: DataTypes.TEXT, allowNull: false },        
        image: { type: DataTypes.STRING, allowNull: true },
        publishedAt: {type: DataTypes.DATE, allowNull: true},
        startAt: {type: DataTypes.INTEGER, allowNull: true},
        endAt: {type: DataTypes.INTEGER, allowNull: true},
 */
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

/*ROUTERS*/

/*CRUD*/
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', deleteOne);

/*QUERIES*/

module.exports = router;