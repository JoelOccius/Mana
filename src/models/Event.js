/*const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  start_at: { type: DataTypes.DATE, allowNull: false },
  end_at: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING },
  description_md: { type: DataTypes.TEXT },
  banner_img: { type: DataTypes.STRING },
  is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'events', timestamps: true });

module.exports = Event;*/

/*const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Event;*/

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    title:       { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    location:    { type: DataTypes.STRING(200), allowNull: true },
    starts_at:   { type: DataTypes.DATE, allowNull: false },
    ends_at:     { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: "events",
    timestamps: false
  }
);

module.exports = Event;

