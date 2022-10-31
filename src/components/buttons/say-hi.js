const { ButtonBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "say-hi",
  },
  async execute(interaction) {
    interaction.reply({ content: "HI!" });
  },
};
