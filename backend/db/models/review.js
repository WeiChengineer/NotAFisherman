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
    review: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Review text is required"
            }
        }
    },
    stars: {
        type: DataTypes.INTEGER,
        validate: {
            min: {
                args: 1,
                msg: "Stars must be an integer from 1 to 5"
            },
            max: {
                args: 5,
                msg: "Stars must be an integer from 1 to 5"
            },
            isInt: {
                msg: "Stars must be an integer"
            }
        }
    }
}, {
    sequelize,
    modelName: 'Review'
});

  return Review;
};
