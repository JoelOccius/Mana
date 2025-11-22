// server/src/models/index.js
const sequelize = require("../config/db");
const ContentBlock = require("./ContentBlock");
const ContentTranslation = require("./ContentTranslation");

// ⚠️ Asire foreignKey yo matche ak DB a: content_translations.block_id → content_blocks.id
ContentBlock.hasMany(ContentTranslation, {
  as: "translations",
  foreignKey: "block_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ContentTranslation.belongsTo(ContentBlock, {
  as: "block",
  foreignKey: "block_id",
});

module.exports = {
  sequelize,
  ContentBlock,
  ContentTranslation,
};



