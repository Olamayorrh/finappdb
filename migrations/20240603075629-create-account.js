'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountName: {
        type: Sequelize.STRING(254),
        allowNull:false
      },
      accountNumber: {
        type: Sequelize.STRING(10),
        allowNull:false
      },
      accountBalance: {
        type: Sequelize.DECIMAL(10,2),
        allowNull:false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "users",
          key: "id"
        }
      },
      email: {
        type: Sequelize.STRING(60),
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
    await queryInterface.dropTable('accounts');
  }
};