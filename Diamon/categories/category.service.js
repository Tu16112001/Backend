const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getByBook,
    getById,
    create,
    update,
    delete: _delete
};


async function getByBook(bookKey) {
    return await getByBookKey(bookKey)
}

async function getById(key) {
    return await getBook(key);
}

async function create(params) {
    // validate
    if (await db.Audio.findOne({ where: { name: params.name } })) {
        throw 'Audi "' + params.name + '" is already registered';
    }

    const audio = new db.Audio(params);

    // save user
    await audio.save();
}

async function update(id, params) {
    const book = await getBook(id);

    // validate
    const keyChanged = params.key && book.key !== params.key;
    if (keyChanged && await db.Book.findOne({ where: { key: params.key } })) {
        throw 'Book Id "' + params.key + '" is already registered';
    }

    // copy params to user and save
    Object.assign(book, params);
    await book.save();
}

async function _delete(id) {
    const book = await getBook(id);
    await book.destroy();
}

// helper functions
async function getByBookKey(bookKey) {
    const books = await db.Book.findAll({ 
        order: [
            ['order', 'ASC']
        ],
        where: { 
            bookKey: bookKey 
        }         
    })

    if (!books) throw [];
    return books;
}

async function getBook(id) {
    const book = await db.Book.findByPk(id);
    if (!book) throw 'Book not found';
    return book;
}