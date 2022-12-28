const { ButtonBuilder } = require("discord.js");
module.exports = {
  data: {
    name: "say",
  },
  async execute(interaction) {
    interaction.reply({ content: "HI!" });
  },
};
