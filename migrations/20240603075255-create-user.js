'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(60),
        allowNull:false
      },
      lastName: {
        type: Sequelize.STRING(60),
        allowNull:false
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull:false,
        unique:true
      },
      phoneNo: {
        type: Sequelize.STRING(15),
        allowNull:false
      },
      address: {
        type: Sequelize.STRING(254),
        allowNull:false
      },
      password: {
        type: Sequelize.STRING(15),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};