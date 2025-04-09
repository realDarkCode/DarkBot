const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { isValidSchedule } = require("../../helpers/date.js");

module.exports = {
  subCommand: "alert.add",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, guildId, user, channelId } = interaction;

    const messageInput = options.getString("message");
    const scheduleInput = options.getString("schedule");
    const repeat = options.getString("repeat") === "true" ? true : false;

    let schedule;
    const validScheduleInput = isValidSchedule(scheduleInput);

    if (!validScheduleInput) {
      return await interaction.reply({
        content:
          "Invalid schedule format. Please use format like: `Wednesday 12:00, Friday 4:00`",
        ephemeral: true,
      });
    }

    try {
      schedule = scheduleInput.split(", ").map((entry) => {
        const [day, time] = entry.trim().split(" ");
        return { day, time, repeat };
      });
    } catch (error) {
      return await interaction.reply({
        content:
          "Invalid schedule format. Please use format like: `Wednesday 12:00, Friday 4:00`",
        ephemeral: true,
      });
    }

    const msg = await AlertMessage.create({
      guildId,
      channelId,
      userId: user.id,
      message: messageInput,
      schedule,
    });

    await interaction.reply({
      content: `Scheduled message added successfully. Message id is: \`${msg.shortId}\``,
      ephemeral: true,
    });
  },
};
