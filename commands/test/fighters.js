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
    .setTitle(`${filteredFighters[0].FirstName} ${bold(filteredFighters[0].Nickname ? filteredFighters[0].Nickname : ' ' )} ${filteredFighters[0].LastName}`)
    .addFields(
      { name: 'First Name', value: `${bold(filteredFighters[0].FirstName)}`, inline : true },
      { name: 'Last Name', value: `${bold(filteredFighters[0].LastName)}`, inline : true },
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
      await interaction.deferReply();
      const fighterData = await getFighter();
      fighters = [...fighterData];
      const filteredFighters = fighters.filter(fighter => fighter?.LastName?.toLowerCase().startsWith(interaction.options.getString('fighter').toLowerCase()));
      const embed = await createEmbed(filteredFighters);
      const message = await interaction.editReply({ embeds : [embed] });
      message.react('❤');
      message.react('💀');
      message.react('👍');
      message.react('👎');
    } catch (error) {
      console.log(error);
      await interaction.editReply(`<@${interaction.user.id}> has introducido un nombre erroneo, intenta de nuevo`);
    }

  },
};

