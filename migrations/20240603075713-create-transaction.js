'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transactionAmount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull:false
      },
      transactionType: {
        type: Sequelize.ENUM("credit","debit"),
        defaultValue:"credit",
        allowNull:false
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: "accounts",
          key: "id"
        }
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
    await queryInterface.dropTable('transactions');
  }
};