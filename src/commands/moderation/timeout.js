const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const database = require("../../schemas/infractions.schema");
const ms = require("ms");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription(
      "restrict a user from sending messages for a certain amount of time."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to timeout.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The duration of the timeout. (2m, 4h, 3d)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason for the timeout.")
        .setRequired(false)
        .setMaxLength(512)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { options, member, guild } = interaction;

    const target = options.getMember("target");
    const duration = options.getString("duration");
    const reason = options.getString("reason") || "Not specified";

    const errorArray = [];
    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not timeout member due to " })
      .setColor("Red");

    // check if the target is in the guild or left
    if (!target)
      return interaction.reply({
        embeds: [
          errorsEmbed.setDescription("Member has most likely left the server."),
        ],
        ephemeral: true,
      });

    // check if the duration is valid or less than 28 days
    if (!ms(duration) || ms(duration) > ms("28d")) {
      errorArray.push("time provided is invalid or over than 28 days limit.");
    }
    // check if the bot can actually timeout the user
    if (!target.manageable || !target.moderatable) {
      errorArray.push("Selected user is not moderatable by the bot.");
    }

    // check if the target has higher role than the bot
    if (member.roles.highest.position <= target.roles.highest.position) {
      errorArray.push("Selected user has higher or equal role than you.");
    }
    // if any error happens respond back with the errors
    if (errorArray.length) {
      return interaction.reply({
        embeds: [errorsEmbed.setDescription(errorArray.join("\n"))],
        ephemeral: true,
      });
    }

    target.timeout(ms(duration), reason).catch((err) => {
      interaction.reply({
        embeds: [errorsEmbed.setDescription("uncommon error occurred")],
      });
      console.log("Error occurred while timing out user: (timeout.js)", err);
      return;
    });

    // save the infraction to the database
    const newInfraction = {
      issuerID: member.id,
      issuerTag: `${member.user.username}#${member.user.discriminator}`,
      reason: reason,
      date: Date.now(),
    };

    let infractionData = await database.findOne({
      guildID: guild.id,
      userID: target.id,
    });

    if (!infractionData) {
      infractionData = await database.create({
        guildID: guild.id,
        userID: target.id,
        guildName: guild.name,
        userTag: `${target.user.username}#${target.user.discriminator}`,
        infractions: [newInfraction],
      });
    } else {
      infractionData.infractions.push(newInfraction);
      await infractionData.save();
    }

    // response with successfully embed
    const successfulEmbed = new EmbedBuilder()
      .setAuthor({ name: "Timeout Issues", iconURL: guild.iconURL() })
      .setColor("Gold")
      .setDescription(
        [
          `${target} has been timed out for **${ms(ms(duration), {
            long: true,
          })}** by ${member}`,
          `Reason: \`${reason}\``,
          `Total Infractions: \`${infractionData.infractions.length}\``,
        ].join("\n")
      );

    return interaction.reply({ embeds: [successfulEmbed] });
  },
};
