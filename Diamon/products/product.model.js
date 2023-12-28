const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },        
        price: { type: DataTypes.DOUBLE, allowNull: false },
        discount: { type: DataTypes.DOUBLE, allowNull: true },
        desc: { type: DataTypes.TEXT, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: true }
    };

    const options = {
    };

    return sequelize.define('Product', attributes, options);
}