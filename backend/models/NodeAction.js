// models/NodeAction.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NodeAction = sequelize.define(
  "NodeAction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    command: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "failed"),
      defaultValue: "pending",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "node_actions",
  }
);

module.exports = NodeAction;
