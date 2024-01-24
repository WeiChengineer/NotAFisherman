'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Spot extends Model {
        static associate(models) {
            Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId' });
            Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
            Spot.hasMany(models.Review, { foreignKey: 'spotId' });
            Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
        }
    };

    Spot.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING,
        lat: DataTypes.DECIMAL(10, 6),
        lng: DataTypes.DECIMAL(10, 6),
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.DECIMAL(10, 2)
    }, {
        sequelize,
        modelName: 'Spot'
    });

    return Spot;
};
