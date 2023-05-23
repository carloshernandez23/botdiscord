const { SlashCommandBuilder, bold } = require('discord.js');
const db = require('../../db/db');
const { stripIndents } = require('common-tags');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Muestra los nombres de los peleadores que tienen mas likes!'),
  async execute(interaction) {
    try {


      const fighterStatement = db.prepare(`
      SELECT * FROM fighters
      ORDER BY contador DESC
	    ;
      
    `);

      const fighter = fighterStatement.all();

      const id = interaction.user.id;
      await interaction.reply({ content:
        stripIndents`
        ${bold('Usuario:')}<@${id}>
        ${bold('PELEADOR MAS LIKEADO #1:')} ${fighter[0].fighter_name +' '+ fighter[0].fighter_lastname}
        ${bold('PELEADOR MAS LIKEADO #2:')} ${fighter[1].fighter_name +' '+ fighter[1].fighter_lastname}
        ${bold('PELEADOR MAS LIKEADO #3:')} ${fighter[2].fighter_name +' '+ fighter[2].fighter_lastname}
    `, ephemeral: true });

    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  } };
