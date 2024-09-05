/**
 * User
 *
 * @description :: 用户信息表
 * @usage       :: sails.models.UserProfile
 */

const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class UserProfile extends Model {
  }
  UserProfile.init(
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
        references: {
          model: 'User',
          key: 'id',
        },
        allowNull: false,
        comment: '雪花ID',
      },
      nickname: {
        field: 'nickname',
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: '用户昵称',
      },
      avatar: {
        field: 'avatar',
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '头像URL',
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
      tableName: 'user_profile',
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
      deletedAt: 'deletedAt',
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      },
    },
  );
};
