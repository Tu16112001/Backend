const config = require("config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });

  const common = (options) => ({
    ...options,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  db.sequelize = sequelize;
  // init models and add them to the exported db object
  db.User = require("../users/user.model")(sequelize);
  db.Category = require("../categories/category.model")(sequelize);
  db.Product = require("../products/product.model")(sequelize);  
  db.Cart = require("../carts/cart.model")(sequelize);  
  db.CartItem = require("../cart_items/cart_item.model")(sequelize);  
  db.Order = require("../orders/order.model")(sequelize);
  db.OrderItem = require("../order_items/order_item.model")(sequelize);

  // sync all models with database
  await sequelize.sync({ alter: true });
}
