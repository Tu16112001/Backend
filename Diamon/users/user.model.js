const { DataTypes } = require('sequelize');

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        fullName: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        role: {
            type: DataTypes.ENUM("admin", "customer"),
        },
        refreshToken: { type: DataTypes.STRING, allowNull: true },
    };

    return sequelize.define('User', attributes, {});
}

module.exports = model;