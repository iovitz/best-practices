"use strict";

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Test = app.model.define("test", {
    id: { type: INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: STRING,
  });

  return Test;
};
