require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const errorHandler = require('_middleware/error-handler');
const authMiddleWare = require("_middleware/authentication");

app.use('/diamon/cover', express.static('public/images'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// api routes
app.use('/users', require('./users/user.controller'));
app.use('/categories', require('./categories/category.controller'));
app.use('/products', require('./products/product.controller'));
app.use('/carts', require('./carts/cart.controller'));
app.use('/cartItems', require('./cart_items/cart_item.controller'));
app.use('/orders', require('./orders/order.controller'));
app.use('/orderItems', require('./order_items/order_item.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3001;
app.listen(port, () => console.log('Server listening on port ' + port));