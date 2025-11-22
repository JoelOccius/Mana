// server/src/models/contentTranslation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContentTranslation = sequelize.define(
  "ContentTranslation",
  {
    contentId: { type: DataTypes.BIGINT, allowNull: false }, // FK → content_blocks.id
    locale:    { type: DataTypes.STRING(10), allowNull: false }, // "en","fr","es","pt-BR"…
    title_tr:  { type: DataTypes.TEXT },
    body_tr:   { type: DataTypes.TEXT },
  },
  {
    tableName: "content_translations",
    timestamps: true, // si kolòn yo se createdAt/updatedAt
    // Si ou te kreye yo `created_at/updated_at`, dekomante:
    // createdAt: "created_at",
    // updatedAt: "updated_at",
  }
);

module.exports = ContentTranslation;


/*const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContentTranslation = sequelize.define("ContentTranslation", {
  id:          { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  block_id:    { type: DataTypes.BIGINT, allowNull: false },
  lang:        { type: DataTypes.STRING(5), allowNull: false },
  title:       { type: DataTypes.TEXT, allowNull: true },
  body:        { type: DataTypes.TEXT, allowNull: true },
  content_hash:{ type: DataTypes.STRING(64), allowNull: false },
}, {
  tableName: "content_translations",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    { fields: ["block_id", "lang"] },
    { fields: ["content_hash"] },
  ]
});

module.exports = ContentTranslation;*/

