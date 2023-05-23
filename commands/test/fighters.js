const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder, bold, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('../../db/db');

let fighters = [];

const getFighter = async () => {
  const { data } = await axios.get('https://api.sportsdata.io/v3/mma/scores/json/Fighters?key=49bee9ae14e141dba91d3ff475e765ea');
  return data;

};


const createEmbed = async (filteredFighters) => {

  const exampleEmbed = new EmbedBuilder()
    .setColor([136, 8, 8])
    .setThumbnail('https://imgur.com/Q1RG3bv.png')
    .setTitle(`${filteredFighters[0].FirstName} ${bold(filteredFighters[0].Nickname ? filteredFighters[0].Nickname : ' ' )} ${filteredFighters[0].LastName}`)
    .addFields(
      { name: 'First Name', value: `${bold(filteredFighters[0].FirstName)}` },
      { name: 'Last Name', value: `${bold(filteredFighters[0].LastName)}` },
      { name: 'Height', value: `${bold(filteredFighters[0].Height)}`, inline : true },
      { name: 'Weight', value: `${bold(filteredFighters[0].Weight)}`, inline : true },
      { name: 'Reach', value: `${bold(filteredFighters[0].Reach)}`, inline : true },
      { name: 'Wins 🥊', value: `${bold(String(filteredFighters[0].Wins))}`, inline : true },
      { name: 'Losses 💀', value: `${bold(String(filteredFighters[0].Losses))}`, inline : true },
      { name: 'Draws 🤝', value: `${bold(String(filteredFighters[0].Draws))}`, inline : true },
      { name: 'TKO Wins 🥵', value: `${bold(String(filteredFighters[0].TechnicalKnockouts))}`, inline : true },
      { name: 'Submissions Wins 🥶', value: `${bold(String(filteredFighters[0].Submissions))}`, inline : true },
      { name: 'Title Wins 🥇', value: `${bold(String(filteredFighters[0].TitleWins))}`, inline : true },
      { name: 'TKO Losses 🤕', value: `${bold(String(filteredFighters[0].TechnicalKnockoutLosses))}`, inline : true },
      { name: 'Submission Losses 🥴', value: `${bold(String(filteredFighters[0].SubmissionLosses))}`, inline : true },
    );

  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fighters')
    .setDescription('shows data of the requested fighter!')
    .addStringOption(option =>
      option
        .setName('fighter')
        .setDescription('fighter by Last Name, Ex: McGregor')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // await interaction.deferReply();
      const fighterData = await getFighter();
      fighters = [...fighterData];
      const filteredFighters = fighters.filter(fighter => fighter?.LastName?.toLowerCase().startsWith(interaction.options.getString('fighter').toLowerCase()));
      const ufc = new ButtonBuilder()
        .setLabel('ufc')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://www.ufcespanol.com/athlete/${filteredFighters[0].FirstName}-${filteredFighters[0].LastName}`);

      const like = new ButtonBuilder()
        .setCustomId('like')
        .setLabel('Like')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(ufc, like);

      const embed = await createEmbed(filteredFighters);
      await interaction.reply({ embeds : [embed], components: [row], ephemeral: true } );


      const reply = await interaction.fetchReply();
      // Esperamos a que se haga click en el botón
      const filter = (interaction) => {
        return interaction.customId === 'like' && interaction.user.id;
      };
      const collector = reply.createMessageComponentCollector({ filter, time: 5000 }); // El colector escucha eventos durante 15 segundos

      collector.on('collect', async (interaction) => {
        await interaction.update({ content: '¡HAZ DADO LIKE SE GUARDO EN TU HISTORIAL, PARA REVISAR TU HISTORIAL USA EL COMANDO /history ❤!', components: [] });// Eliminamos el botón
        collector.stop(); // Detenemos el colector


        const created_at = new Date().toISOString();
        const fighter_name = filteredFighters[0].FirstName;
        const fighter_lastname = filteredFighters[0].LastName;
        const fighter_id = filteredFighters[0].FighterId;
        // Buscar el peleador en la base de datos
        const statement2 = db.prepare(`
        SELECT * FROM fighters 
        WHERE fighter_id = ?
        `);

        const peleadorExistente = statement2.get(fighter_id);
        console.log(peleadorExistente);
        if (peleadorExistente) {
          const statement = db.prepare(`
          UPDATE fighters
          set contador = ? 
          WHERE fighter_id = ?
        `);

          statement.run(peleadorExistente.contador + 1, fighter_id);

        } else {
          // Insertar valores en la tabla fighters
          const statement = db.prepare(`
          INSERT INTO fighters (created_at, fighter_id, fighter_name, fighter_lastname, contador)
          VALUES (?, ?, ?, ?, ?)
          `);

          statement.run(created_at, fighter_id, fighter_name, fighter_lastname, 1);
        }





      });



    } catch (error) {
      console.log(error);
      await interaction.editReply(`<@${interaction.user.id}> has introducido un nombre erroneo, intenta de nuevo`);

    }
  },
};

