const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder, bold } = require('discord.js');


let fighters = [];

const getFighter = async () => {
  const { data } = await axios.get('https://api.sportsdata.io/v3/mma/scores/json/Fighters?key=49bee9ae14e141dba91d3ff475e765ea');
  return data;

};



const createEmbed = async (filteredFighters) => {

  const exampleEmbed = new EmbedBuilder()
    .setColor([136, 8, 8])
    .setTitle(`${filteredFighters[0].FirstName} "${bold(filteredFighters[0].Nickname)}" ${filteredFighters[0].LastName}`)
    .addFields(
      { name: 'First Name', value: `${filteredFighters[0].FirstName}`, inline : true },
      { name: 'Last Name', value: `${filteredFighters[0].LastName}`, inline : true },
      { name: 'Wins', value: `${bold(String(filteredFighters[0].Wins))}`, inline : true },
      { name: 'Losses', value: `${bold(String(filteredFighters[0].Losses))}`, inline : true },
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
        .setDescription('fighter name, Ex: Conor Mcgregor')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const fighterData = await getFighter();
      fighters = [...fighterData];
      const filteredFighters = fighters.filter(fighters => fighters.FirstName.startsWith(interaction.options.getString('fighter')));
      console.log(filteredFighters);
      const embed = await createEmbed(filteredFighters);
      await interaction.editReply({ embeds : [embed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply(`<@${interaction.user.id}> ESPERE UN MOMENTO POR FAVOR`);
    }

  },
};