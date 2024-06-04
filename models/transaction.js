'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transaction.belongsTo(models.account, { foreignKey: 'accountId' });
    }
  }
  transaction.init({
    transactionAmount: DataTypes.DECIMAL(10,2),
    transactionType: DataTypes.ENUM("credit","debit"),
    accountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};