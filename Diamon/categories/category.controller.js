const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const audioService = require('./category.service');

// routes

router.get('/:id', getById);
router.get('/:bookKey', getByBook);
router.post('/create', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// route functions
function getById(req, res, next) {
    audioService.getById(req.params.id)
        .then(book => res.json(book))
        .catch(next);
}

function getByBook(req, res, next) {
    audioService.getByBook(req.params.bookKey)
        .then(audios => res.json(audios))
        .catch(next);
}

function create(req, res, next) {
    console.log(req.body)
    audioService.create(req.body)
        .then(() => res.json({ message: 'Audio created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Audio updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    audioService.delete(req.params.id)
        .then(() => res.json({ message: 'Audio deleted' }))
        .catch(next);
}

// schema functions
function createSchema(req, res, next) {
    const schema = Joi.object({
        order: Joi.number().required(),
        name: Joi.string().required(),
        mp3: Joi.string().required().empty(''),
        length: Joi.number().default(0),
        book_id: Joi.number().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.create({
        order: Joi.number(),
        name: Joi.string().empty(''),
        mp3: Joi.string().empty(''), 
        length: Joi.number().default(0),
        book_id: Joi.number().required()  
    })

    validateRequest(req, next, schema);
}
