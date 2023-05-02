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
    JOIN notes
    ON users.user_id = notes.user_id
    WHERE users.user_id = ?
  `);

      const user = statement.all(id);
      console.log('prueba');
      const usersito = user.reduce((acc, next) => {
        if (!acc.notes) {
          acc.notes = [];
        }
        const note = { id: next.note_id, content: next.content };
        acc.notes = [...acc.notes, note];
        acc.name = `${next.first_name} ${next.last_name}`;
        acc.email = next.email;
        acc.created = next.created_at;
        return acc;
      }, {});

      if(!user) return await interaction.reply('Ups, tu usuario no se encuentra registrado');

      await interaction.reply({ content:
        stripIndents`
        ${bold('Usuario:')}<@${id}>
        ${bold('Nombre:')} ${usersito.name}
        ${bold('Email:')} ${usersito.email}
        ${bold('Notas creadas:')} ${usersito.notes.length}
        ${bold('Fecha de creacion:')} ${new Date(usersito.created).toLocaleString().split(',')[0]}
    `, ephemeral: true });

    } catch (error) {
      if (error.message === 'UNIQUE constraint failed: users.user_id') {
        await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
      }
    }
  } };
