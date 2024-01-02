const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const resp = require('../variables/response');
const { Op } = require("sequelize");
const { isAuth } = require('../_middleware/authentication');

let create = async (params) => {
    const exist = await _checkExisting({ name: params.name, key: params.key });

    if (exist != null) {
        let result = resp.response(false, 100, "The category is existing", {});
        return result;
    }

    const category = new db.Category(params);
    await category.save();

    return resp.response(true, null, "", { category: category });
}

let _checkExisting = async (params) => {
    const category = await db.Category.findOne({
        where: {
            [Op.or]: [
                { key: params.key },
                { name: params.name }
            ]
        }
    });

    return category;
}

let update = async (id, params) => {
    const category = await getById(id);

    if (category == null) {
        return resp.response(false, 100, "Category not found", {});
    }

    Object.assign(category, params);
    await category.save();

    return resp.response(true, null, "Category updated", {});
}

let deleteOne = async (id) => {
    const category = await db.Category.findByPk(id);
    if (!category) {
        return resp.response(false, 100, "Category not found", {});
    }

    await category.destroy();

    return resp.response(true, null, "Deleted category", {});
}

let getByKey = async (key) => {
    const category = await db.Category.findOne({
        where: {
            key: key
        }
    });

    if (!category) {
        return resp.response(false, 100, "Category not found", {});
    }

    return resp.response(true, null, "", { category: category });
}

let getById = async (id) => {
    const category = await db.Category.findByPk(id);
    if (!category) {
        return resp.response(false, 100, "Category not found", {});
    }

    return resp.response(true, null, "", { category: category });
}

let getAll = async (id) => {
    let result = await db.Category.findAll();
    return resp.response(true, null, "", { categories: result });
}


module.exports = {
    create,
    update,
    getById,
    getByKey,
    deleteOne,
    getAll
};