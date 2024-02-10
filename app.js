import 'dotenv/config';

import {Client, IntentsBitField} from 'discord.js';
import createChannelAndRole from './commands/create.js';
import winston from './config/winston.js';
import addUserToRole from './commands/add.js';
import removeRoleFromUser from './commands/remove.js';
import releaseAStory from './commands/release.js';

const logger = winston('app.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

const {token, prefix, category, releasedCategory} = process.env;

client.once('ready', () => {
  logger.info('Bot is online!');
});

client.on('guildCreate', guild => {
  // This event triggers when the bot joins a guild.
  logger.info(`Joined new guild: ${guild.name}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'create') {
    await createChannelAndRole(category, message, args);
  } else if (command === 'add') {
    addUserToRole(message);
  } else if (command === 'remove') {
    removeRoleFromUser(message);
  } else if (command === 'release') {
    releaseAStory(message, releasedCategory);
  }
});

client.login(token);
