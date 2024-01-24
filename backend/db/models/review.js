'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'userId' });
            Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
            Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });
        }
    };

    Review.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spotId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        review: DataTypes.TEXT,
        stars: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 5 }
        }
    }, {
        sequelize,
        modelName: 'Review'
    });

    return Review;
};
