const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        productId: {type: DataTypes.INTEGER, allowNull: false},
        cartId: { type: DataTypes.INTEGER, allowNull: false },        
        price: { type: DataTypes.DOUBLE, allowNull: true },
        discount: { type: DataTypes.INTEGER, allowNull: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: true },
    };

    const options = {
    };

    return sequelize.define('CartItem', attributes, options);
}