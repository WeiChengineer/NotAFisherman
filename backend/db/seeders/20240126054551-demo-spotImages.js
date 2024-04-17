'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define your schema in the options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // Define the table name in options object
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.imgur.com/gSUfI3K.jpeg',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 2,
        url: 'https://i.imgur.com/vRYuQt6.jpeg', 
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        spotId: 3,
        url: 'https://i.imgur.com/pgwbVju_d.webp?maxwidth=1520&fidelity=grand', 
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], options); 
  },

  async down(queryInterface, Sequelize) {
   
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options, null, {}); 
  }
};
