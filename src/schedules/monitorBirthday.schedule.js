const { Client, EmbedBuilder } = require("discord.js");
const { capitalizeFirstLetter } = require("../helpers/convert");

const disciplineMonitorService = require("../services/disciplineMonitor.service");
module.exports = {
  name: "monitor-birthday",
  frequency: "* 0 * * Friday",
  /**
   *
   * @param {Client} client
   */
  async task(client) {
    try {
      const birthdays =
        await disciplineMonitorService.getCurrentBirthdayMonitors("week");
      if (!birthdays) return;
      const embed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`Birthday Monitor List this week`)
        .setDescription(
          birthdays
            .map((monitor, index, arr) => {
              return `**${index + 1}**. _${monitor.name}_ - \`${
                monitor.school_id
              }\` - \`${capitalizeFirstLetter(monitor.class)}\` - \`${
                monitor.section ? capitalizeFirstLetter(monitor.section) : "N/A"
              }\` - ${
                monitor.date_of_birth
                  ? `<t:${Math.round(
                      new Date(monitor.date_of_birth).setFullYear(
                        new Date().getFullYear()
                      ) / 1000
                    )}:R>`
                  : "N/A"
              }`;
            })
            .join("\n")
        );
      const mainGuild = process.env.developmentGuild;

      const config = await client.guildConfig.get(mainGuild);

      if (!config) return;
      const guild = await client.guilds.fetch(mainGuild);
      if (!guild) return;
      const channel = guild.channels.cache.get(
        config?.monitor.announceChannelId
      );

      if (!channel) return;
      await channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
