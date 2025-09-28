// server/src/models/Announcement.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Announcement = sequelize.define("Announcement", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: "announcements",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = Announcement;
