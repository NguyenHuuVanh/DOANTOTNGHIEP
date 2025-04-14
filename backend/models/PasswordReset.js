// models/NodeData.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NodeData = sequelize.define(
  "PasswordReset",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(255),
    },
    code: {
      type: DataTypes.INTEGER,
    },
    expires_at: {
      type: DataTypes.DATE,
    },
    create_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "password_resets",
  }
);

module.exports = NodeData;
