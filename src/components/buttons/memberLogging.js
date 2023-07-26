const {
  ButtonInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  data: {
    name: "memberLogging",
  },
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    const { guild, member, buttonInfo } = interaction;
    const memberToModerate = (await guild.members.fetch()).get(buttonInfo[1]);
    const errorArray = [];
    const responseEmbed = new EmbedBuilder();

    // validation
    if (!member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      errorArray.push(
        "You do not have the required permission to moderate this member"
      );
    }
    if (!memberToModerate) {
      errorArray.push("The member is no longer in this guild");
    }
    if (memberToModerate && !memberToModerate.moderatable) {
      errorArray.push(`${memberToModerate} is not moderatable by this bot`);
    }
    if (memberToModerate && memberToModerate.id === member.id) {
      errorArray.push("You can't perform this action at yourself");
    }
    if (errorArray.length)
      return interaction.reply({
        embeds: [
          responseEmbed.setColor("Red").setDescription(errorArray.join("\n")),
        ],
        ephemeral: true,
      });

    // Moderate the member
    switch (buttonInfo[0]) {
      case "kick":
        {
          memberToModerate
            .kick(`Kicked by ${member} | Member Logging System`)
            .then(() => {
              interaction.reply({
                embeds: [
                  responseEmbed.setDescription(
                    `${memberToModerate} has been kicked`
                  ),
                ],
              });
            })
            .catch((err) => {
              interaction.reply({
                embeds: [
                  responseEmbed.setDescription(
                    `${memberToModerate} could not be kicked
                    reason: ${err.message}`
                  ),
                ],
              });
            });
        }
        break;
      case "ban":
        {
          memberToModerate
            .ban({ reason: `banned by ${member} | Member Logging System` })
            .then(() => {
              interaction.reply({
                embeds: [
                  responseEmbed.setDescription(
                    `${memberToModerate} has been banned`
                  ),
                ],
              });
            })
            .catch((err) => {
              interaction.reply({
                embeds: [
                  responseEmbed.setDescription(
                    `${memberToModerate} could not be banned 
                    reason: ${err.message}`
                  ),
                ],
              });
            });
        }
        break;
    }
  },
};
