import 'dotenv/config';
import {Client, IntentsBitField} from 'discord.js';

import winston from './config/winston.js';
import {
  createChannelAndRole,
  removeRoleFromUser,
  releaseAStory,
  addUserToRole,
  deleteChannelAndRole,
  onboardUser,
  farewellUser,
} from './commands/index.js';

const logger = winston('app.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

const {token, prefix, allowedUsers} = process.env;

client.once('ready', () => {
  logger.info('Bot is online!');
});

client.on('guildCreate', guild => {
  // This event triggers when the bot joins a guild.
  logger.info(`Joined new guild: ${guild.name}`);
});

const commands = {
  create: createChannelAndRole,
  add: addUserToRole,
  remove: removeRoleFromUser,
  release: releaseAStory,
  delete: deleteChannelAndRole,
  onboard: onboardUser,
  farewell: farewellUser,
};

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const allowedUsersList = allowedUsers.split(','); // List of allowed bot operators
  if (!allowedUsersList.includes(message.author.id.toString())) {
    message.channel.send('You are not allowed to use this bot.');
    return;
  }
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const commandFunction = commands[command];
  if (commandFunction) {
    await commandFunction(message);
  } else {
    message.channel.send('Unknown command.');
  }
});

client.login(token);
