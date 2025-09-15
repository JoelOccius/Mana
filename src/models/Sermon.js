/*const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Sermon = sequelize.define('Sermon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  speaker: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  video_url: { type: DataTypes.STRING },
  audio_url: { type: DataTypes.STRING },
  notes_md: { type: DataTypes.TEXT },
  cover_img: { type: DataTypes.STRING },
}, { tableName: 'sermons', timestamps: true });

module.exports = Sermon;*/

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Sermon = sequelize.define("Sermon", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT },
  preacher: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Sermon;

