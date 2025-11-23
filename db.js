// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",         // itilizatè postgres ou
  host: "localhost",
  database: "church_db",    // non baz done ou te kreye a
  password: "Joel2025!", // ranplase ak modpas ou
  port: 5432,               // pò default Postgres
});

module.exports = pool;
