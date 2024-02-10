require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});

const { token, prefix, category } = process.env;

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "create") {
    const roleName = args.join(" ");
    const guild = message.guild;
    const categoryChannel = guild.channels.cache.find(
      (channel) =>
        channel.type === "GUILD_CATEGORY" && channel.name === category
    );

    if (!categoryChannel) {
      return message.channel.send("Category not found.");
    }

    try {
      const role = await guild.roles.create({
        name: roleName,
        color: "RANDOM",
      });

      const channel = await guild.channels.create(roleName, {
        type: "GUILD_TEXT",
        parent: categoryChannel,
        permissionOverwrites: [
          {
            id: role.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });

      message.channel.send(
        `Role '${role.name}' and channel '${channel.name}' created successfully.`
      );
    } catch (error) {
      console.error("Error creating role and channel:", error);
      message.channel.send(
        "An error occurred while creating role and channel."
      );
    }
  } else if (command === "add_role") {
    const roleName = args.join(" ");
    const role = message.guild.roles.cache.find(
      (role) => role.name === roleName
    );

    if (!role) {
      return message.channel.send("Role not found.");
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.channel.send("Member not found.");
    }

    try {
      await member.roles.add(role);
      message.channel.send(
        `Role '${role.name}' added to ${member.displayName} successfully.`
      );
    } catch (error) {
      console.error("Error adding role to member:", error);
      message.channel.send("An error occurred while adding role to member.");
    }
  }
});

client.login(token);
