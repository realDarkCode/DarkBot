const { Client, EmbedBuilder } = require("discord.js");
const { isFirstWeekInMonth } = require("../helpers/date");
const {
  getAllUserFavoriteMusic,
} = require("../services/music/musicCount.service");
const { secondsToDuration } = require("../helpers/convert");

module.exports = {
  name: "monthlyFavoriteMusic",
  frequency: "45 17  *  *  4",

  /**
   * Send the favorite songs of previous month to user [First Thursday 16:15 of every month]
   * @param {Client} client
   */
  async task(client) {
    try {
      const today = new Date();

      const isFirstWeekOfMonth = isFirstWeekInMonth(today);
      if (!isFirstWeekOfMonth) return;

      const users = await getAllUserFavoriteMusic();
      today.setMonth(today.getMonth() - 1);
      await Promise.allSettled(
        users.map(async (user) => {
          const u = await client.users.fetch(user._id);
          if (!u) return;

          await u.createDM();

          const responseEmbed = new EmbedBuilder()
            .setTitle("Your music update of last month")
            .setColor("DarkBlue")
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
                          30
                        )}...\`${secondsToDuration(
                          song.duration || 0
                        )}\`-<t:${Math.round(song.updatedAt / 1000)}:R>`
                    )
                    .join("\n")
            )
            .addFields(
              {
                name: "Songs",
                value: `\`${user.totalUniqueSongs}\``,
                inline: true,
              },
              {
                name: "Songs Duration",
                value: `\`${secondsToDuration(
                  user.totalUniqueSongsDuration
                )}\``,
                inline: true,
              },
              {
                name: "Total",
                value: `\`${user.totalSongs}\``,
                inline: true,
              },
              {
                name: "Total Duration",
                value: `\`${secondsToDuration(user.totalSongsDuration || 0)}\``,
                inline: true,
              }
            )
            .setFooter({
              text: "Happy Music!",
            });

          u.send({
            content: `Hello **${
              u.displayName
            }**, here is your \`${today.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}\` music stats.\n\n[\`Note:\` You previous month music record will be deleted within 2 days. Enjoy you favorites now.]`,
            embeds: [responseEmbed],
          }).catch((er) => {
            console.info(
              `couldn't send music update to ${user.songs[0]?.userName}. probably their dm is off or left server`
            );
          });
        })
      );
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
