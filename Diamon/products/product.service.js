const db = require('_helpers/db');
const resp = require('../variables/response');
const { Op } = require("sequelize");

/*Crud*/
let create = async (params) => {
  const exist = await _checkExisting({ title: params.title, categoryId: params.categoryId });

  if (exist != null) {
    let result = resp.response(false, 100, "The product is existing", {});
    return result;
  }

  const product = new db.Product(params);
  await product.save();

  return resp.response(true, null, "", { product: product });
}

let _checkExisting = async (params) => {
  const product = await db.Product.findOne({
    where: {
      title: params.title,
      categoryId: params.categoryId
    }
  });

  return product;
}

let update = async (id, params) => {
  const product = await db.Product.findByPk(id);

  if (product == null) {
    return resp.response(false, 100, "Product not found", {});
  }

  Object.assign(product, params);
  await product.save();

  return resp.response(true, null, "Product updated", {});
}

let deleteOne = async (id) => {
  const product = await db.Product.findByPk(id);
  if (!product) {
    return resp.response(false, 100, "Product not found", {});
  }

  product.isAvailable = false
  await product.save();

  return resp.response(true, null, "Deleted product", {});
}

/* Queries */

let getById = async (id) => {
  const product = await db.Product.findByPk(id);
  if (!product || product.isAvailable != true) {
    return resp.response(false, 100, "Product not found", {});
  }

  return resp.response(true, null, "", { product: product });
}

let getProduct = async (req) => {
  let orderField = req.query.orderField || "id";
  let pageSize = parseInt(req.query.pageSize) || 15;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let sortby = (req.query.sortby || "desc").toUpperCase();
  let categoryId = parseInt(req.query.categoryId);

  console.log(categoryId);
  var wh = {}
  if (categoryId != null && categoryId != NaN && categoryId >= 0) {
    wh = {
      isAvailable: true,
      categoryId: categoryId,
    }
  } else {
    wh = {
      isAvailable: true,
    }
  }

  const { count, rows } = await db.Product.findAndCountAll({
    order: [[orderField, sortby]],
    where: wh,
    offset: pageNum * pageSize,
    limit: parseInt(pageSize),
  });

  return resp.response(true, null, "", { total: count || 0, products: rows || [] });
}

let searchProduct = async (req) => {
  let pageSize = parseInt(req.query.pageSize) || 15;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let keyword = req.query.keyword || ""

  if (keyword == "") {
    return resp.response(true, null, "", { total: 0, products: [] });
  }

  console.log('START SEARCH');
  const { count, rows } = await db.Product.findAndCountAll({
    where: {
      title: {
        [Op.like]: keyword + '%'
      }
    },
    offset: pageNum * pageSize,
    limit: parseInt(pageSize),
  });

  return resp.response(true, null, "", { total: count || 0, products: rows || [] });
}

module.exports = {
  create,
  update,
  deleteOne,
  getById,
  getProduct,
  searchProduct
};