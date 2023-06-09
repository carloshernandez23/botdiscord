const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const getBet = async (eventId) => {
  const { data } = await axios.get(`https://api.sportsdata.io/v3/mma/scores/json/Event/${eventId}?key=49bee9ae14e141dba91d3ff475e765ea`);
  return data;
};


const createEmbed = async (eventData) => {


  const exampleEmbed = new EmbedBuilder()
    .setColor([0, 0, 255])
    .setTitle(eventData.Name)
    .addFields(
      { name: 'PELEA PRINCIPAL', value: `${eventData.Fights[0].Fighters[0].FirstName} ${eventData.Fights[0].Fighters[0].LastName} VS ${eventData.Fights[0].Fighters[1].FirstName} ${eventData.Fights[0].Fighters[1].LastName}` },
      { name: 'PELEA SECUNDARIA', value: `${eventData.Fights[1].Fighters[0].FirstName} ${eventData.Fights[1].Fighters[0].LastName} VS ${eventData.Fights[1].Fighters[1].FirstName} ${eventData.Fights[1].Fighters[1].LastName}` },
      { name: 'SEASON', value: `${String(eventData.Season)}` },
      { name: 'DAY', value: `${String(eventData.DateTime).split('T')[0]}` },

    );
  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('te muestra datos del evento!')
    .addStringOption(option =>
      option
        .setName('event-id')
        .setDescription('numero de evento, EJ:287')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const eventId = interaction.options.getString('event-id');
      const eventData = await getBet(eventId);
      const embed = await createEmbed(eventData);
      const like = new ButtonBuilder()
        .setCustomId('like')
        .setLabel('Like')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(like);

      await interaction.editReply( { embeds : [embed], components: [row] } );
      console.log(eventData);
    } catch (error) {
      console.log(error);
      await interaction.editReply(`<@${interaction.user.id}> ESPERE UN MOMENTO POR FAVOR`);
    }

  },
};

