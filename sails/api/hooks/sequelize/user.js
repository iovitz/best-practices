/**
 * User
 *
 * @description :: 用户账号表
 * @usage       :: sails.models.User
 */

const { DataTypes, Model } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model {
  }
  User.init(
    {
      idx: {
        field: 'idx',
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '自增ID',
      },
      id: {
        field: 'id',
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false,
        comment: '雪花ID',
      },
      state: {
        field: 'state',
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
        comment: '状态',
      },
    },
    {
      sequelize,
      tableName: 'user',
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
      deletedAt: 'deletedAt',
    },
  )
}
