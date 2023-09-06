const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { convertToChoices } = require("../../helpers/convert");
const {
  POINTS,
  POINTS_CONST,
  requiredRoleId,
} = require("../../config/NDT.config");
const {
  sectionList,
  classList,
  bloodGroupList,
  houseList,
} = require("../../config/NDT.config");
module.exports = {
  requiredRole: requiredRoleId || null,
  data: new SlashCommandBuilder()
    .setName("monitor")
    .setDescription("Manage monitors")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add a new monitor")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Enter the school id")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Enter the monitor name")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("Enter the class")
            .addChoices(...convertToChoices(classList))
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("list all monitors")
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("Enter the class")
            .addChoices(...convertToChoices(classList))
        )
        .addStringOption((option) =>
          option
            .setName("section")
            .setDescription("Enter the section")
            .addChoices(...convertToChoices(sectionList))
        )
        .addStringOption((option) =>
          option
            .setName("house")
            .setDescription("Enter the house")
            .addChoices(...convertToChoices(houseList))
        )
        .addStringOption((option) =>
          option
            .setName("gender")
            .setDescription("Select the gender")
            .addChoices(...convertToChoices(["male", "female"]))
        )
        .addStringOption((option) =>
          option
            .setName("status")
            .setDescription("Select the status")
            .addChoices(...convertToChoices(["active", "inactive"]))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("profile")
        .setDescription("view a specific monitor profile")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Enter the school id")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription(
              "Mention class if you want to search by id's last 3 digit"
            )
            .addChoices(...convertToChoices(classList))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("attendance")
        .setDescription("add attendance point to monitors")
        .addStringOption((option) =>
          option
            .setName("ids")
            .setDescription("Enter the School ids [comma separated ids]")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("Enter the class [if you want to use 3 digit ids]")
            .addChoices(...convertToChoices(classList))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_points")
        .setDescription("add point to monitors")
        .addStringOption((option) =>
          option
            .setName("ids")
            .setDescription("Enter the School id of monitor")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("point_type")
            .setDescription("Point type")
            .addChoices(...convertToChoices(Object.keys(POINTS_CONST)), {
              name: "SPECIAL",
              value: "SPECIAL",
            })
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("Enter the class [if you want to use 3 digit ids]")
            .addChoices(...convertToChoices(classList))
        )
        .addStringOption((option) =>
          option.setName("reason").setDescription("Reason for adding point")
        )
        .addNumberOption((option) =>
          option
            .setName("point")
            .setDescription("Point to add")
            .setMinValue(-15)
            .setMaxValue(15)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("top_monitors")
        .setDescription(
          "list of most active and inactive monitors from specific class"
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("class of monitor")
            .addChoices(...convertToChoices(classList))
        )
        .addStringOption((option) =>
          option
            .setName("gender")
            .setDescription("gender of monitor")
            .addChoices(...convertToChoices(["male", "female"]))
        )
        .addStringOption((option) =>
          option
            .setName("house")
            .setDescription("house of monitor")
            .addChoices(...convertToChoices(houseList))
        )
        .addStringOption((option) =>
          option
            .setName("status")
            .setDescription("account status of monitor")
            .addChoices(...convertToChoices(["active", "inactive"]))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("weekly_top_monitors")
        .setDescription(
          "list of most weekly active monitors from specific class"
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("class of monitor")
            .addChoices(...convertToChoices(classList))
        )
        .addStringOption((option) =>
          option
            .setName("gender")
            .setDescription("gender of monitor")
            .addChoices(...convertToChoices(["male", "female"]))
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update_profile")
        .setDescription("update a monitor's info")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("monitors full school id [9 digit]")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName("name").setDescription("name of monitor")
        )
        .addStringOption((option) =>
          option
            .setName("class")
            .setDescription("class of monitor")
            .addChoices(...convertToChoices(classList))
        )
        .addStringOption((option) =>
          option
            .setName("section")
            .setDescription("Section of monitor")
            .addChoices(...convertToChoices(sectionList))
        )
        .addStringOption((option) =>
          option
            .setName("gender")
            .setDescription("gender of monitor")
            .addChoices(...convertToChoices(["male", "female"]))
        )
        .addStringOption((option) =>
          option.setName("contact").setDescription("whatsapp number of monitor")
        )
        .addStringOption((option) =>
          option
            .setName("house")
            .setDescription("house of monitor")
            .addChoices(...convertToChoices(houseList))
        )
        .addStringOption((option) =>
          option.setName("date_of_birth").setDescription("format [dd-mm-yyyy]")
        )
        .addStringOption((option) =>
          option
            .setName("blood_group")
            .setDescription("blood group of monitor")
            .addChoices(...convertToChoices(bloodGroupList))
        )
    ),
};
