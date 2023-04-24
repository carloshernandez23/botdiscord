const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Listo! Logeado como ${client.user.tag}`);
  },
};
