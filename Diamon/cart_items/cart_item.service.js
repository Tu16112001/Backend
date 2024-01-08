const db = require('_helpers/db');
const response = require('../variables/response');

/*CRUD*/
let create = async (body) => {
  const product = await db.Product.findByPk(body.productId);
  const item = await _checkExisting(body.productId, body.cartId );

  if (item != null) {
    item.quantity = Number(item.quantity) + Number(body.quantity)
    item.price = product.price;
    item.discount = product.discount;
    item.image = product.image;

    await item.save();
    return response.create(true, null, "", { item: item });
  } else {
    const newItem = new db.CartItem(body);
    newItem.price = product.price;
    newItem.discount = product.discount;
    newItem.image = product.image;

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
