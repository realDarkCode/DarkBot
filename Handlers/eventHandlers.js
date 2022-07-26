const fs = require("node:fs");
const ascii = require("ascii-table");
const loadEvents = (client) => {
  const table = new ascii().setTitle("Events").setAlign(ascii.alignCenter);
  const folders = fs.readdirSync("./Events");
  for (const folder of folders) {
    const files = fs
      .readdirSync(`./events/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of files) {
      const event = require(`../Events/${folder}/${file}`);

      if (event.rest) {
        if (event.once) {
          client.rest.once(event.name, (...args) =>
            event.execute(...args, client)
          );
        } else {
          client.rest.on(event.name, (...args) =>
            event.execute(...args, client)
          );
        }
      } else {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
      table.addRow(file, "🟢");
    }
  }
  console.info(table.render());
};

module.exports = loadEvents;
