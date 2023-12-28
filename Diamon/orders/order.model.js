const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.INTEGER, allowNull: false },        
        address: {type: DataTypes.STRING, allowNull: true},          
        phone: {type: DataTypes.STRING, allowNull: true},                        
        paymentMethod: {type: DataTypes.STRING, allowNull: false},
    };

    return sequelize.define('Order', attributes, options);
}