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

      if(!user) return await interaction.reply('Ups, tu usuario no se encuentra registrado');

      await interaction.reply({ content:
        stripIndents`
        ${bold('Usuario:')}<@${id}>
        ${bold('Nombre:')} ${user.first_name}
        ${bold('Email:')} ${user.email}
        ${bold('Fecha de creacion:')} ${new Date(user.created_at).toLocaleString().split(',')[0]}
    `, ephemeral: true });

    } catch (error) {
      if (error.message === 'UNIQUE constraint failed: users.user_id') {
        await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
      }
    }
  } };
