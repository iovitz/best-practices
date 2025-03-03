const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class MoneyFlow extends Model {
    associate() {
    }
  }
  MoneyFlow.init({
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增ID',
    },
    type: {
      field: 'type',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: 'true: 收入， false：支出',
    },
    money: {
      field: 'money',
      type: DataTypes.INTEGER.UNSIGNED,
      unique: false,
      allowNull: false,
      comment: '金额',
    },
    state: {
      field: 'state',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: '状态',
    },
  }, {
    sequelize,
    tableName: 'moneyFlow',
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
  });
};
