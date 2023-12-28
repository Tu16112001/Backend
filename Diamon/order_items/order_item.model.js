const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: { type: DataTypes.INTEGER, allowNull: false },
        orderId: { type: DataTypes.INTEGER, allowNull: false },        
        price: {type: DataTypes.DOUBLE, allowNull: false},
        discount: {type: DataTypes.DOUBLE, allowNull: true},
        quantity: {type: DataTypes.INTEGER, allowNull: false},
    };

    return sequelize.define('OrderItem', attributes, options);
}