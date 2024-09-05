/**
 * User
 *
 * @description :: 用户账号表
 * @usage       :: sails.models.User
 */

const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
  }
  User.init(
    {
      idx: {
        field: 'idx',
        type: DataTypes.INTEGER.UNSIGNED,
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
      platform: {
        field: 'platform',
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: '三方登录平台类型',
      },
      platformId: {
        field: 'platformId',
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: true,
        comment: '三方平台ID',
      },
      email: {
        field: 'email',
        type: DataTypes.STRING(30),
        allowNull: false,
        comment: '用户邮箱',
      },
      password: {
        field: 'password',
        type: DataTypes.STRING(60),
        allowNull: false,
        comment: 'Bcrypt加密的密码',
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
  );
};
