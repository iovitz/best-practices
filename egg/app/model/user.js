"use strict";

module.exports = (app) => {
  const { STRING, INTEGER } = app.Sequelize;

  const Test = app.model.define("test", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
  });

  return Test;
};
