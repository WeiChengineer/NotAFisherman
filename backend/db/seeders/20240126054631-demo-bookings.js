'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 2,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 3,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], options); 
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, null, {}); 
  }
};
