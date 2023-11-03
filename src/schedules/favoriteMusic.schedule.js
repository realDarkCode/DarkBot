const { Client, EmbedBuilder } = require("discord.js");
const { isFirstWeekInMonth } = require("../helpers/date");
const {
  getAllUserFavoriteMusic,
} = require("../services/music/musicCount.service");
module.exports = {
  name: "favoriteMusic-schedule",
  frequency: "15 18  *  *  4",

  /**
   * Send the favorite songs of previous month to user [First Thursday 16:15 of every month]
   * @param {Client} client
   */
  async task(client) {
    try {
      const isFirstWeekOfMonth = isFirstWeekInMonth(new Date());
      if (!isFirstWeekOfMonth) return;

      const users = await getAllUserFavoriteMusic(15);

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
              text: "You previous month music record will bee deleted within 2 days. Enjoy you favorites now.",
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
    } catch (error) {
      console.log("Error occurred while executing schedule job:", error);
      return;
    }
  },
};
