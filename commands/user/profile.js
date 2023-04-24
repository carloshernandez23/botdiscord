const { SlashCommandBuilder, bold } = require('discord.js');
const db = require('../../db/db');
const { stripIndents } = require('common-tags');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Muestra tu perfil!'),
  async execute(interaction) {
    try {
      const id = interaction.user.id;

      const statement = db.prepare(`
    SELECT * FROM users
    WHERE user_id = ?
    `);

      const user = statement.get(id);

      await interaction.reply(
        stripIndents`
        ${bold('Usuario:')}<@${id}>
        ${bold('Nombre:')} ${user.first_name} ${user.last_name}
        ${bold('Email:')} ${user.email}
    `);

    } catch (error) {
      if (error.message === 'UNIQUE constraint failed: users.user_id') {
        await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
      }
    }
  } };
