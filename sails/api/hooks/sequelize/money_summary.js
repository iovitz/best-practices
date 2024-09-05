const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class MoneySummary extends Model {
    associate() {
    }
  }
  MoneySummary.init({
    id: {
      field: 'id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增ID',
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
      comment: '状态',
    },
  }, {
    sequelize,
    tableName: 'moneySummary',
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt',
  });
};
