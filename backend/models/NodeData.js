// models/NodeData.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const NodeData = sequelize.define(
  "NodeData",
  {
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.FLOAT,
    },
    humidity: {
      type: DataTypes.FLOAT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "node_data",
  }
);

module.exports = NodeData;
