// server/src/config/config.js
require("dotenv").config();

const dev = {
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "postgres",
  username: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASS ?? ""),
  logging: false,
};

const prod = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
};

module.exports = {
  development: dev,
  test: dev,
  production: prod,
};
