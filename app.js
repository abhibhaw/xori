import 'dotenv/config';

import {Client, IntentsBitField} from 'discord.js';
import createChannelAndRole from './commands/create.js';
import winston from './config/winston.js';

const logger = winston('app.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
  ],
});

const {token, prefix, category} = process.env;

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
  } else if (command === 'add_role') {
    const roleName = args.join(' ');
    const role = message.guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
      message.channel.send('Role not found.');
      return;
    }

    const member = message.mentions.members.first();

    if (!member) {
      message.channel.send('Member not found.');
      return;
    }

    try {
      await member.roles.add(role);
      message.channel.send(
        `Role '${role.name}' added to ${member.displayName} successfully.`,
      );
    } catch (error) {
      logger.error('Error adding role to member:', error);
      message.channel.send('An error occurred while adding role to member.');
    }
  }
});

client.login(token);
