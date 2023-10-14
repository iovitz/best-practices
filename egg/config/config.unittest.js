module.exports = () => {
  const config = (exports = {});
  config.sequelize = {
    dialect: "#ReplaceMe#",
    host: "#ReplaceMe#",
    port: 5432,
    database: "#ReplaceMe#",
    username: "#ReplaceMe#",
    password: "#ReplaceMe#",
    define: {
      freezeTableName: true,
      timestamps: false,
      logging: false,
    },
  };

  return {
    ...config,
  };
};
