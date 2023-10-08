module.exports = () => {
  const config = (exports = {});
  config.sequelize = {
    dialect: "mysql",
    host: "#Replace#",
    port: 3306,
    database: "#Replace#",
    username: "#Replace#",
    password: "#Replace#",
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
