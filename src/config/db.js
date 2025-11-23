/*const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory:';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: DATABASE_URL.startsWith('postgres') ? 'postgres' : undefined,
  logging: false,
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    // Import models to ensure they're registered
    require('../models/User');
    require('../models/Sermon');
    require('../models/Event');
    require('../models/Donation');
    require('../models/Prayer');
    await sequelize.sync();
    console.log('DB connected & synced');
  } catch (e) {
    console.error('DB error:', e);
    throw e;
  }
}

module.exports = { sequelize, connectDB };*/

/*const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false
});

module.exports = sequelize;*/
// server/src/config/db.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProd = process.env.NODE_ENV === "production";

const sequelize = isProd
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    })
  : new Sequelize(
      process.env.DB_NAME || "postgres",
      process.env.DB_USER || "postgres",
      String(process.env.DB_PASS ?? ""),
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        dialect: "postgres",
        logging: false,
      }
    );

module.exports = sequelize;

