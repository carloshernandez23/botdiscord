const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eliminar-usuario')
    .setDescription('elimina tu usuario!'),
  async execute(interaction) {
    try {

      const id = interaction.user.id;
      const statement = db.prepare(`
      DELETE FROM users
      WHERE user_id = ?
      
    `);


      statement.run(id);

      await interaction.reply(`<@${id}> SE HA BORRADO SU USUARIO POR COMPLETO`);

    } catch (error) {

      console.log(error);

    }
  }
};