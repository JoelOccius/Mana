const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Prayer = sequelize.define('Prayer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: false },
  answered: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'prayer_requests', timestamps: true });

module.exports = Prayer;
