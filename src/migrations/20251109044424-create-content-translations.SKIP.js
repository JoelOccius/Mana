"use strict";

module.exports = {
  async up(queryInterface) {
    // netwaye si gen ansyen non
    await queryInterface.sequelize.query(`
      ALTER TABLE "content_translations"
      DROP CONSTRAINT IF EXISTS "content_translations_block_id_fkey";
    `);

    // ajoute FK kòrèk
    await queryInterface.addConstraint("content_translations", {
      fields: ["block_id"],
      type: "foreign key",
      name: "fk_ct_block_id_to_content_blocks",
      references: { table: "content_blocks", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "content_translations",
      "fk_ct_block_id_to_content_blocks"
    ).catch(()=>{});
  },
};
