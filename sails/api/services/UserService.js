/**
 * UserService
 *
 * @description :: 处理User表的CRUD
 * @usage       :: UserService.[methodName]()
 */

const { Op } = require('sequelize');

const Service = {
  get UserProfile() {
    return sails.mysql.models.UserProfile;
  },

  async searchUser(page, perPage, content) {
    return this.User.findAll({
      where: {
        [Op.or]: [
          {
            nickname: {
              [Op.like]: `%${content}%`,
            },
          },
          {
            userId: content,
          },
        ],
      },
      raw: true,
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: ['user_id', 'nickname', 'avatar', 'fans_number', 'voice_number', 'state'],
    });
  },

  findUserProfileById(id) {
    return this.UserProfile.findOne({
      where: {
        id,
      },
    });
  },

  getUserProfileInfo(userProfileModel) {
    return {
      ..._.pick(userProfileModel, ['id', 'avatar', 'nickname', 'fansNumber', 'voiceNumber']),
    };
  },
};

module.exports = Service;
