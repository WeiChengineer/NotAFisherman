'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Spots', [
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
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Spots', null, {});
  }
};
