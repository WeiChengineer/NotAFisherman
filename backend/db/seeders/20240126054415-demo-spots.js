'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define your schema in options object
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    options.tableName = 'Spots'; // Define table name in options object
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Fake street',
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 12,
        lng: -12,
        name: 'Lovely Spot',
        description: 'A lovely spot in San Francisco.',
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: '123 Faker street',
        city: 'New York',
        state: 'New York',
        country: 'USA',
        lat: 14,
        lng: -14,
        name: 'Helluva town',
        description: 'A helluva town in New York',
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 3,
        address: '123 Fakest street',
        city: 'Denver',
        state: 'Colorado',
        country: 'USA',
        lat: 15,
        lng: -15,
        name: 'Cold Spot',
        description: 'A cold spot in Colorado',
        price: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Spots'; // Define table name in options object
    return queryInterface.bulkDelete(options, null, {});
  }
};
