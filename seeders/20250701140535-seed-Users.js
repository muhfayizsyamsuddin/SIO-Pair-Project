'use strict';
const fs = require('fs').promises
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile('./data/user.json', 'utf-8'))
    // console.log(data);
    data = data.map(el => {
      delete el.id,
      el.password = bcrypt.hashSync(el.password)
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Users', data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
