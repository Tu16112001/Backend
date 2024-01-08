const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.INTEGER, allowNull: false },             
        fullName: {type: DataTypes.STRING, allowNull: true},
        address: {type: DataTypes.STRING, allowNull: true},          
        phone: {type: DataTypes.STRING, allowNull: true},                        
        email: {type: DataTypes.STRING, allowNull: true},
        status: { type: DataTypes.INTEGER, allowNull: false },   
        paymentMethod: {type: DataTypes.STRING, allowNull: false},
        subtotal: { type: DataTypes.DOUBLE, allowNull: true },
        total: { type: DataTypes.DOUBLE, allowNull: true },
        discount: { type: DataTypes.DOUBLE, allowNull: true },
        tax: { type: DataTypes.DOUBLE, allowNull: true },
        note: {type: DataTypes.STRING, allowNull: true}
    };

    const options = {
    };


    return sequelize.define('Order', attributes, options);
}