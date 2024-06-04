'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.belongsTo(models.user, { foreignKey: 'userId' });
      account.hasMany(models.transaction, { foreignKey: 'id' });
    }
  }
  account.init({
    accountName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    accountBalance: DataTypes.DECIMAL(10,2),
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'account',
  });
  return account;
};