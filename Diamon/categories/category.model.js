const { DataTypes } = require('sequelize');
const cate = require('../variables/category');

module.exports = model;

function model(sequelize) {
    const attributes = {         
        name: { type: DataTypes.STRING, allowNull: false },
        key: { type: DataTypes.STRING, allowNull: false },
        type: {
            type: DataTypes.ENUM("category", "collection"),
        },        
        isAvailable: { type: DataTypes.BOOLEAN, allowNull: false },        
    };

    const options = {
    };

    return sequelize.define('Category', attributes, options);
}