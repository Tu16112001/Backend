const db = require('_helpers/db');
const response = require('../variables/response');

/*CRUD*/
let create = async (params) => {
  const item = await _checkExisting({ productId: productId, cartId: params.cartId });

  if (exist != null) {
    item.quantity = Number(item.quantity) + Number(params.quantity)
    await item.save();
    return response.create(true, null, "", { item: item });
  } else {
    const newItem = new db.CartItem(params);
    await newItem.save();
    return response.create(true, null, "", { item: newItem });
  }
}

let _checkExisting = async (productId, cartId) => {
  const item = await db.CartItem.findOne({
    where: {
      productId: productId,
      cartId: cartId
    }
  });

  return item;
}

let update = async (id, params) => {
  const item = await db.CartItem.findByPk(id);

  if (item == null) {
    return response.create(false, 100, "Item not found", {});
  }

  Object.assign(item, params);
  await item.save();

  return response.create(true, null, "Item updated", {});
}

let deleteOne = async (id) => {
  const item = await db.CartItem.findByPk(id);
  if (!item) {
    return response.create(false, 100, "CartItem not found", {});
  }

  await item.destroy();

  return response.create(true, null, "Deleted cart item", {});
}

module.exports = {
  create,
  update,
  deleteOne
};
