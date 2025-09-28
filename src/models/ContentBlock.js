/* const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ContentBlock = sequelize.define("ContentBlock", {
  id:        { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  page:      { type: DataTypes.STRING(50),  allowNull: false, defaultValue: "home" }, // eg. "home", "about"
  slot:      { type: DataTypes.STRING(50),  allowNull: false, defaultValue: "body" }, // "body", "sidebar"...
  type:      { type: DataTypes.ENUM("text","image","video","html"), allowNull: false, defaultValue: "text" },
  title:     { type: DataTypes.STRING(255) },
  body:      { type: DataTypes.TEXT },           // tèks / html
  media_url: { type: DataTypes.STRING(1024) },   // imaj oswa videyo URL
  position:  { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "content_blocks",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = ContentBlock;
 */



// server/src/models/ContentBlock.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ALLOWED_SLOTS = ["header","body","footer","sidebar"];
const ALLOWED_TYPES = ["text","image","video","html"];

const ContentBlock = sequelize.define("ContentBlock", {
  id:        { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

  page: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: "home",
    set(val) {
      this.setDataValue("page", String(val || "home").trim().toLowerCase());
    },
    comment: 'eg. "home", "about", ...',
  },

  // ⬇️ STRING olye de ENUM (pa gen pwoblèm cast ankò)
  slot: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "body",
    set(val) {
      const v = String(val || "body").trim().toLowerCase();
      this.setDataValue("slot", ALLOWED_SLOTS.includes(v) ? v : "body");
    },
    comment: 'header/body/footer/sidebar',
  },

  // ⬇️ STRING olye de ENUM
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "text",
    set(val) {
      const v = String(val || "text").trim().toLowerCase();
      this.setDataValue("type", ALLOWED_TYPES.includes(v) ? v : "text");
    },
    comment: 'text/image/video/html',
  },

  title:     { type: DataTypes.STRING(255), allowNull: true },
  body:      { type: DataTypes.TEXT, allowNull: true },          // tèks / html
  media_url: { type: DataTypes.STRING(1024), allowNull: true },  // URL imaj oswa videyo
  position:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, {
  tableName: "content_blocks",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",

  defaultScope: {
    order: [
      ["position", "ASC"],
      ["id", "ASC"],
    ],
  },

  indexes: [
    { fields: ["page", "slot", "position"] },
    { fields: ["updated_at"] },
  ],

  hooks: {
    beforeValidate(instance) {
      if (instance.page) instance.page = String(instance.page).trim().toLowerCase();

      // normalize + fallback
      const slot = String(instance.slot || "body").trim().toLowerCase();
      instance.slot = ALLOWED_SLOTS.includes(slot) ? slot : "body";

      const type = String(instance.type || "text").trim().toLowerCase();
      instance.type = ALLOWED_TYPES.includes(type) ? type : "text";

      if (instance.media_url === "") instance.media_url = null;
      if (typeof instance.position !== "number" || isNaN(instance.position)) instance.position = 0;
      if (typeof instance.is_active !== "boolean") instance.is_active = true;
    },
  },
});

module.exports = ContentBlock;
