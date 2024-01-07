const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: {type: DataTypes.INTEGER, allowNull: false},
        cartId: { type: DataTypes.INTEGER, allowNull: false },        
        price: { type: DataTypes.DOUBLE, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        note: { type: DataTypes.TEXT, allowNull: false },        
    };

    const options = {
    };

    return sequelize.define('CartItem', attributes, options);
}