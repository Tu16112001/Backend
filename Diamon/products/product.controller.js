const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const bookService = require('./product.service');
const { getHomePage } = require('./product.service');
const { func } = require('joi');

// routes
router.get('/homeand', getAndroidHome)
router.get('/home', getHome);
router.get('/', getAll);
router.get('/findById/:id', getById);
router.get('/findByGenre', getByGenre);
router.get('/findByGenreand', getByGenreand);
router.get('/increaseReadCount', increaseReadCount);
router.post('/create', createSchema, create);
router.post('/createMultiple', createSchema, createMultiple);
router.get('/updateLoved', updateLovedBook)
router.put('/update/:id', updateSchema, update);
router.delete('/delete/:id', _delete);
router.get('/updateReadCount', updateReadCount);
router.get('/updateTags', updateTags);

module.exports = router;

function getAndroidHome(req, res, next) {
    bookService.getHomePageAndroid(req)
    .then(books => res.json(books))
    .catch(next);
}

function getHome(req, res, next) {
    bookService.getHomePage()
    .then(books => res.json(books))
    .catch(next);
}

function getAll(req, res, next) {
    bookService.getAll()
        .then(books => res.json(books))
        .catch(next);
}

function getById(req, res, next) {
    bookService.getById(req.params.id)
        .then(book => res.json(book))
        .catch(next);
}

function getByGenre(req, res, next) {
    console.log(req.query)
    bookService.getByGenre(req)
        .then(books => res.json(books))
        .catch(next);
}

function getByGenreand(req, res, next) {
    console.log(req.query)
    bookService.getByGenreIdand(req)
        .then(books => res.json(books))
        .catch(next);
}

function increaseReadCount(req, res, next) {
    bookService.increaseReadCount(req.query.id)
        .then(() => res.json({ message: 'Book Updated' }))
        .catch(next);
}

function updateReadCount(req, res, next) {
    bookService.updateReadCount(req.query.id, req.query.count)
        .then(() => res.json({ message: 'Book Updated' }))
        .catch(next);
}

function updateLovedBook(req, res, next) {
    console.log(req.query)
    bookService.updateLovedBook(req.query.id, req.query.isLoved)
        .then(() => res.json({ message: 'Book Updated' }))
        .catch(next);
}

function updateTags(req, res, next) {
    bookService.updateTags(req.query.id, req.query.tags)
        .then(() => res.json({ message: 'Book Updated' }))
        .catch(next);
}

function create(req, res, next) {
    bookService.create(req.body)
        .then(() => res.json({ message: 'Book created' }))
        .catch(next);
}

function createMultiple(req, res, next) {
    bookService.createMultiple(req.body)
        .then(() => res.json({ message: 'Books created' }))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Book updated' }))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted' }))
        .catch(next);
}

// schema functions
function createSchema(req, res, next) {
    const schema = Joi.object({
        key: Joi.number().required(),
        name: Joi.string().required(),
        author: Joi.string().required(),
        desc: Joi.string().required(),        
        readCount: Joi.number().default(0),
        loveCount: Joi.number().default(0),
        hasEpub: Joi.boolean().default(true),
        pageCount: Joi.number().default(0),
        genre_id: Joi.number().required(), 
    });

    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.create({
        key: Joi.number(),
        name: Joi.string().empty(''),
        author: Joi.string().empty(''),
        desc: Joi.string().empty(''),        
        readCount: Joi.number(),
        loveCount: Joi.number(),
        hasEpub: Joi.boolean(),
        pageCount: Joi.number(),
        genre_id: Joi.number()
    })

    validateRequest(req, next, schema);
}
