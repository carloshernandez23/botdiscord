const { SlashCommandBuilder, bold } = require('discord.js');
const db = require('../../db/db');
const { stripIndents } = require('common-tags');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('history')
    .setDescription('Muestra los nombres de los peleadores a los que has dado like!'),
  async execute(interaction) {
    try {
      const id = interaction.user.id;

      const statement = db.prepare(`
    SELECT * FROM users
    WHERE user_id = ?
  `);

      const user = statement.get(id);

      if(!user) return await interaction.reply('Ups, tu usuario no se encuentra registrado');

      const fighterStatement = db.prepare(`
      SELECT * FROM fighters
      WHERE user_id = ?
    `);

      const fighter = fighterStatement.all(id);

      let fighterNames = '';


      if (fighter.length > 0) {
        fighterNames = fighter.map(fighter => fighter.fighter_name + fighter.fighter_lastname).join(', ');

      } else {
        fighterNames = 'No has dado like a ningun peleador todavía';
      }
      await interaction.reply({ content:
        stripIndents`
        ${bold('Usuario:')}<@${id}>
        ${bold('FAV Fighters:')} ${fighterNames}
    `, ephemeral: true });

    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  } };
