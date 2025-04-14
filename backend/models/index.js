// models/index.js
const sequelize = require("../config/database");
const User = require("./User");
const NodeData = require("./NodeData");
const NodeAction = require("./NodeAction");
const PasswordReset = require("./PasswordReset");

// Định nghĩa quan hệ nếu có (ví dụ: NodeAction liên quan đến NodeData)
// NodeAction.belongsTo(NodeData, { foreignKey: "device_id" });

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối thành công đến MySQL!");
    await sequelize.sync({ force: false }); // force: false để không xóa dữ liệu
    console.log("Đồng bộ models thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối hoặc đồng bộ:", error);
  }
};

module.exports = {
  sequelize,
  User,
  NodeData,
  NodeAction,
  PasswordReset,
  syncDatabase,
};
