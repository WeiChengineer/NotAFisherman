'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      ReviewImage.belongsTo(models.Review, { foreignKey: 'reviewId' });
    }
  };

  ReviewImage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reviewId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReviewImage'
  });

  return ReviewImage;
};
