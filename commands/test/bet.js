const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const getBet = async (eventId) => {
  const { data } = await axios.get(`https://api.sportsdata.io/v3/mma/scores/json/Event/${eventId}?key=49bee9ae14e141dba91d3ff475e765ea`);
  return data;
};


const createEmbed = async (eventData) => {


  const exampleEmbed = new EmbedBuilder()

    .setTitle(eventData.Name)
    .addFields(
      { name: 'PELEA PRINCIPAL', value: `${eventData.Fights[0].Fighters[0].FirstName} ${eventData.Fights[0].Fighters[0].LastName} VS ${eventData.Fights[0].Fighters[1].FirstName} ${eventData.Fights[0].Fighters[1].LastName}` },
      { name: 'PELEA SECUNDARIA', value: `${eventData.Fights[1].Fighters[0].FirstName} ${eventData.Fights[1].Fighters[0].LastName} VS ${eventData.Fights[1].Fighters[1].FirstName} ${eventData.Fights[1].Fighters[1].LastName}` },

    );
  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ufc')
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
      console.log(eventData.Fights[0].Fighters[0]);
      await interaction.editReply({ embeds : [embed] });
    } catch (error) {
      await interaction.editReply(`<@${interaction.user.id}> ESPERE UN MOMENTO POR FAVOR`);
    }

  },
};
