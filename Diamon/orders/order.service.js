const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
};

async function getAll() {
    return await db.Order.findAll();
}
