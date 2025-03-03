/**
 * User
 *
 * @description :: 用户账号表
 * @usage       :: sails.models.User
 */

const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class MoneyTags extends Model {
  }
  MoneyTags.init(
    {
      id: {
        field: 'id',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        comment: '自增ID',
      },
      parentId: {
        field: 'parentId',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Tags',
          key: 'id',
        },
        comment: '二级Tag对应的一级Tag的ID',
      },
      icon: {
        field: 'icon',
        type: DataTypes.STRING,
        allowNull: true,
        comment: '一级Tag对应的Icon',
      },
      rank: {
        field: 'parentId',
        type: DataTypes.FLOAT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Tags',
          key: 'id',
        },
        comment: '二级Tag对应的一级Tag的ID',
      },
      userId: {
        field: 'userId',
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        comment: '作者ID',
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
      tableName: 'tags',
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci',
      updatedAt: 'updatedAt',
      createdAt: 'createdAt',
      deletedAt: 'deletedAt',
    },
  );
};
