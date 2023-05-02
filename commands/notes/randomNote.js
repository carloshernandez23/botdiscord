const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nota-random')
    .setDescription('Te muestra una nota al azar!'),
  async execute(interaction) {
    try {
      const statement = db.prepare(`
    SELECT notes.content, users.first_name
    FROM notes
    JOIN users 
    `);

      const notes = statement.all();
      const randomNumber = (Math.random() * notes.length).toFixed();
      const note = notes[Number(randomNumber)];

      await interaction.reply(`${note.content}. creada por: ${note.first_name}`);

    } catch (error) {
      if (error.message === 'UNIQUE constraint failed: users.user_id') {
        await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
      }

    }
  } };