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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Street address is required" }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "City is required" }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "State is required" }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Country is required" }
      }
    },
    lat: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Latitude is not valid" },
        min: { args: -90, msg: "Latitude is not valid" },
        max: { args: 90, msg: "Latitude is not valid"}
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Longitude is not valid" },
        min: { args: -180, msg:"Longitude is not valid" },
        max: { args: 180, msg: "Longitude is not valid" }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [1, 50], msg: "Name must be less than 50 characters" }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description is required" }
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: { msg: "Price must be a decimal" },
        min: { args: [0], msg: "Price must be greater than or equal to 0" }
      }
    }
  }, {
    sequelize,
    modelName: 'Spot'
  });

  return Spot;
};
