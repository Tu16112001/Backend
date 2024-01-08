const db = require('_helpers/db');
const resp = require('../variables/response');
const { Op } = require("sequelize");

/*CRUD*/
let create = async (params) => {
  const cart = await _checkExisting({ title: params.userId });

  if (exist != null) {
    let result = resp.response(true, null, "", { cart: cart });
    return result;
  }

  const newCart = new db.Cart(params);
  await newCart.save();

  return resp.response(true, null, "", { cart: newCart });
}

let _checkExisting = async (userId) => {
  const cart = await db.Product.findOne({
    where: {
      userId: userId
    }
  });

  return cart;
}

let update = async (id, params) => {
  const cart = await db.Cart.findByPk(id);

  if (cart == null) {
    return resp.response(false, 100, "Cart not found", {});
  }

  Object.assign(cart, params);
  await cart.save();

  return resp.response(true, null, "Cart updated", { cart: cart });
}

let cleanCart = async (id) => {
  await User.destroy({
    where: {
      cartId: id
    },
  });

  return resp.response(true, null, "Clean cart success", {});
}

let getCart = async (id) => {
  const cart = await db.Cart.findByPk(id);
  const items = await db.CartItem.findAll({
    where: {
      cartId: id,      
    },
    order: [["createdAt", "DESC"]],
  });

  var result = {
    id: cart.id,
    userId: cart.userId,
    status: cart.status,
    fullName: cart.fullName,
    mobile: cart.mobile,
    email: cart.email,
    address: cart.address,
    note: cart.note,
    items: items || []
  }

  return resp.response(true, null, "", {cart: result});
}

module.exports = {
  create,
  update,
  cleanCart,
  getCart
};

/*QUERY*/
