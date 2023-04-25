const { SlashCommandBuilder, bold } = require('discord.js');
const db = require('../../db/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('actualizar-usuario')
    .setDescription('actualiza tu usuario!')
    .addStringOption(option =>
      option
        .setName('email')
        .setDescription('Ingresa tu nuevo email')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const email = interaction.options.getString('email');
      const id = interaction.user.id;

      const userOld = db.prepare(`
      SELECT email FROM users
      WHERE user_id = ?
      `).get(id);

      if (!userOld) return await interaction.reply('ups! Tu usuario no se encuentra registrado');

      const statement = db.prepare(`
      UPDATE users
      set email = ?
      WHERE user_id = ?
    `);


      statement.run(email, id);

      await interaction.reply(`<@${id}>  Se actualizo tu correo de ${bold(userOld.email)} A ${bold(email)} `);

    } catch (error) {
      if (error.message === 'UNIQUE constraint failed: users.user_id') {
        await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
      }
    }
  } };