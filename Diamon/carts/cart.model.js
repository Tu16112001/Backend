const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: {type: DataTypes.INTEGER, allowNull: false},
        status: { type: DataTypes.INTEGER, allowNull: false },        
        fullName: { type: DataTypes.STRING, allowNull: true },
        mobile: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true },
        address: {type: DataTypes.STRING, allowNull: true},
        note: { type: DataTypes.TEXT, allowNull: true },        
    };

    const options = {
    };

    return sequelize.define('Cart', attributes, options);
}