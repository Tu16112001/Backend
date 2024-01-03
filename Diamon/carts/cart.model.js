const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        categoryId: {type: DataTypes.INTEGER, allowNull: false},
        userId: {type: DataTypes.INTEGER, allowNull: false},
        title: { type: DataTypes.STRING, allowNull: false },        
        sumary: { type: DataTypes.TEXT, allowNull: false },
        price: { type: DataTypes.DOUBLE, allowNull: false },
        discount: { type: DataTypes.DOUBLE, allowNull: false },
        quantity: {type: DataTypes.INTEGER, allowNull: false},
        content: { type: DataTypes.TEXT, allowNull: false },        
        image: { type: DataTypes.STRING, allowNull: true },
        publishedAt: {type: DataTypes.DATE, allowNull: true},
        startAt: {type: DataTypes.INTEGER, allowNull: true},
        endAt: {type: DataTypes.INTEGER, allowNull: true},
    };

    const options = {
    };

    return sequelize.define('Cart', attributes, options);
}