const { Client, EmbedBuilder } = require("discord.js");
const botConfig = require("../config/bot");
const { isFirstWeekInMonth } = require("../helpers/date");
const {
  getAllUserFavoriteMusic,
  dropCollection,
} = require("../services/music/musicCount.service");
module.exports = {
  name: "favoriteMusic-schedule",
  frequency: "0  16  *  *  4",

  /**
   * Send the favorite songs of previous month to user and clear the database.
   * @param {Client} client
   */
  async task(client) {
    try {
      const isFirstThursdayOfMonth = isFirstWeekInMonth(new Date());
      if (!isFirstThursdayOfMonth) return;

      const users = await getAllUserFavoriteMusic();

      await Promise.all(
        users.map(async (user) => {
          const u = await client.users.fetch(user._id);
          if (!u) return;

          await u.createDM();

          const responseEmbed = new EmbedBuilder()
            .setTitle("Monthly Music Update")
            .setColor("Purple")
            .setDescription(
              user.songs.length === 0
                ? "You haven't listened to any song yet."
                : user.songs
                    .map(
                      (song, index) =>
                        `${index + 1}.[\`${
                          song.count
                        } times\`]-${song.name.slice(
                          0,
                          40
                        )}... -<t:${Math.round(song.updatedAt / 1000)}:R>`
                    )
                    .join("\n")
            )
            .setFooter({
              text: "You previous month music record has been deleted.",
            });

          u.send({
            content: `You have listened to \`${user.totalSongsCount}\` songs previous month.`,
            embeds: [responseEmbed],
          }).catch((er) => {
            console.info(
              `couldn't send music update to ${user.songs[0]?.userName}. probably their dm is off or left server`
            );
          });
        })
      );
      await dropCollection();
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
