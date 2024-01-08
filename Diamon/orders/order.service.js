const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const orderStatsus = require('../variables/order');
const resp = require('../variables/response');

let create = async (req) => {
    const user = req.user;
    const cartId = req.body.cartId;
    const cart = await db.Cart.findByPk(cartId);
    const items = await db.CartItem.findAll({
        where: {
            cartId: cartId,
        },
        order: [["createdAt", "DESC"]],
    });

    if (cart == null || cart == undefined || items.length == 0) {
        return resp.response(false, 100, "The cart is empty", {});
    }

    let subtotal = 0;
    let total = 0;
    let tax = 0;
    let discount = 0;

    items.forEach(element => {
        subtotal = subtotal + Number(element.price) * Number(element.quantity);
        discount = discount + (Number(element.price) * Number(element.discount / 100)) * Number(element.quantity);
    });

    let temp = subtotal - discount;
    tax = (temp * 10) / 100;
    total = temp + tax;

    const params = {
        userId: user.userId,
        fullName: cart.fullName,
        address: cart.address,
        phone: cart.mobile,
        email: cart.email,
        status: orderStatsus.new,
        paymentMethod: cart.paymentMethod || 0,
        subtotal: subtotal,
        total: total,
        tax: tax,
        discount: discount,
        note: cart.note
    }

    const order = new db.Order(params);
    await order.save();

    for (var i = 0; i < items.length; i++) {
        let item = items[i];
        const newItem = {
            orderId: order.id,
            productId: item.productId,
            price: item.price,
            discount: item.discount,
            quantity: item.quantity,
            image: item.image
        }

        const orderItem = new db.OrderItem(newItem);
        await orderItem.save();
    }

    for (var i = 0; i < items.length; i++) { 
        await items[i].destroy();
    }
   
    return resp.response(true, null, "Created order", {});
}

let updateStatus = async (orderId, status) => {
    await db.Order.update({ status: status }, {
        where: {
            id: orderId
        }
    });

    return resp.response(true, null, "Updated order status", {});
}

module.exports = {
    create,
    updateStatus
};