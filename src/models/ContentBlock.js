// server/src/models/ContentBlock.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // <- SA A TE MANKE

const ContentBlock = sequelize.define(
  "ContentBlock",
  {
    id:        { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    page:      { type: DataTypes.STRING(50),  allowNull: false, defaultValue: "home" },
    slot:      { type: DataTypes.STRING(20),  allowNull: false, defaultValue: "body" },
    type:      { type: DataTypes.STRING(20),  allowNull: false, defaultValue: "text" },
    title:     { type: DataTypes.STRING(255) },
    body:      { type: DataTypes.TEXT },
    media_url: { type: DataTypes.STRING(1024) },
    position:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    lang:      { type: DataTypes.STRING(5), allowNull: false, defaultValue: "en" },
  },
  {
    tableName: "content_blocks",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    paranoid: true,
    deletedAt: "deleted_at",

    defaultScope: {
      where: { is_active: true },
      order: [["position","ASC"], ["updated_at","DESC"], ["id","ASC"]],
    },
    scopes: {
      withDeleted: { paranoid: false }, // <- pou admin wè tout, menm efase yo
      inactive:   { where: { is_active: false } },
      byPage:     (page) => ({ where: { ...(page ? { page } : {}) } }),
    },
    hooks: {
      beforeValidate(instance) {
        if (typeof instance.page === "string") instance.page = instance.page.toLowerCase();
        if (typeof instance.slot === "string") instance.slot = instance.slot.toLowerCase();
        if (typeof instance.type === "string") instance.type = instance.type.toLowerCase();
        if (typeof instance.lang === "string") instance.lang = instance.lang.toLowerCase();
      },
    },
  }
);

module.exports = ContentBlock;
