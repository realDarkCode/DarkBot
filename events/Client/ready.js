module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Client logged in as ${client.user.tag}`);
    client.user.setActivity("with fire along with DarkCode");
  },
};
