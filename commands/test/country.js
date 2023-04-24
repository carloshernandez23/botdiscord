const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const { read, intToRGBA } = require('jimp');

const getCountry = async (countryName) => {
  const { data } = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
  return data;
};

const getWeather = async (country) => {
  const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=260a5ae06c51f785a886e5596a7e0b0c`);
  return data;
};


const createEmbed = async (country, weather) => {
  const image = await read(country.flags.png);
  const { r, g ,b } = intToRGBA(image.getPixelColor(0, 0));

  const exampleEmbed = new EmbedBuilder()
    .setColor([r, g, b])
    .setTitle(country.translations.spa.common)
    .setURL(`https://es.wikipedia.org/wiki/${country.translations.spa.common}`)
    .setThumbnail(country.flags.png)
    .addFields(
      { name: 'Poblacion', value: String(country.population.toLocaleString()), inline: true },
      { name: 'Capital', value: country.capital[0], inline: true },
      { name: 'Region', value: country.region, inline: true },
      { name: 'Temperatura', value: String(weather.main.temp), inline: true },
    );
  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-pais')
    .setDescription('Muestra la informacion de un pais en especifico')
    .addStringOption(option =>
      option
        .setName('pais')
        .setDescription('Nombre del pais')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      console.log(interaction.user.id);
      const country = interaction.options.getString('pais');
      const countryData = await getCountry(country);
      const weather = await getWeather(countryData[0]);
      console.log(weather);
      const embed = await createEmbed(countryData[0], weather);
      await interaction.editReply({ embeds : [embed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply(`<@${interaction.user.id}> has introducido un pais erroneo, intenta de nuevo`);
    }

  },
};