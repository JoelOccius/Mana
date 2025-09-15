const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name:  { type: DataTypes.STRING(100), allowNull: false },
    email:      { type: DataTypes.STRING(255), allowNull: true, unique: true },
    phone:      { type: DataTypes.STRING(30), allowNull: true },
    address:    { type: DataTypes.TEXT, allowNull: true },
    joined_at:  { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW }
  },
  {
    tableName: "members",
    timestamps: false
  }
);

module.exports = Member;

