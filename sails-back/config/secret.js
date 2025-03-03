const { existsSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');

const secretConfigPath = join(homedir(), 'app-config/ollah_server.json');

// 只在生产环境下启用环境JSON
const config = process.env === 'production' && existsSync(secretConfigPath) ? require(secretConfigPath) : {};

module.exports.secret = {
  ...config,
};
