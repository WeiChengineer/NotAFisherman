'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        userId: 1, 
        spotId: 1, 
        review: 'Great place, had a wonderful time!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Ok place, had a mediocre time!',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Awful place, had a bad time!',
        stars: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], options);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {}); 
  }
};
