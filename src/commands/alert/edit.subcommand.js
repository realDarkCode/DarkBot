const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const AlertMessage = require("../../schemas/alert.schema.js");
const { isValidSchedule } = require("../../helpers/date.js");

module.exports = {
  subCommand: "alert.edit",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const id = interaction.options.getString("id");
    const newMessage = interaction.options.getString("message") || "";
    let newSchedule = interaction.options.getString("schedule") || "";

    try {
      schedule = newSchedule.split(", ").map((entry) => {
        const [day, time] = entry.trim().split(" ");
        return { day, time };
      });
    } catch (error) {
      return await interaction.reply({
        content:
          "Invalid schedule format. Please use format like: `Wednesday 12:00, Friday 4:00`",
        ephemeral: true,
      });
    }

    if (!newMessage && !newSchedule)
      return interaction.reply({
        content: "Please provide new message or schedule to update.",
        ephemeral: true,
      });

    const scheduledMessage = await AlertMessage.findOne({ shortId: id });

    if (!scheduledMessage)
      return interaction.reply({
        content: "Scheduled message not found with that id.",
        ephemeral: true,
      });

    if (newSchedule) {
      const isValid = isValidSchedule(newSchedule);

      if (!isValid)
        return interaction.reply({
          content:
            "Invalid schedule format. Please use format like: `Wednesday 12:00, Friday 4:00`",
          ephemeral: true,
        });

      try {
        schedule = newSchedule.split(", ").map((entry) => {
          const [day, time] = entry.trim().split(" ");
          return { day, time };
        });

        scheduledMessage.schedule = schedule;
      } catch (error) {
        return await interaction.reply({
          content:
            "Invalid schedule format. Please use format like: `Wednesday 12:00, Friday 4:00`",
          ephemeral: true,
        });
      }
    }

    if (newMessage) scheduledMessage.message = newMessage;

    const msg = await scheduledMessage.save();

    interaction.reply({
      content: `Scheduled message updated successfully. Message id is : \`${msg.shortId}\``,
      ephemeral: true,
    });
  },
};
