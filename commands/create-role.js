import {PermissionsBitField} from 'discord.js';
import winston from '../config/winston.js';

const logger = winston('create-role.js');
const {prefix} = process.env;

const createRole = async message => {
  try {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    args.shift().toLowerCase();
    const roleName = args[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    const {guild} = message;
    const roleColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color

    const createdRole = await guild.roles.create({
      data: {
        name: roleName,
        color: roleColor,
        permissions: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.ReadMessageHistory,
          PermissionsBitField.Flags.EmbedLinks,
          PermissionsBitField.Flags.AttachFiles,
          PermissionsBitField.Flags.AddReactions,
          PermissionsBitField.Flags.UseExternalEmojis,
          PermissionsBitField.Flags.MentionEveryone,
        ],
      },
      reason: 'Creating a new role',
    });

    message.channel.send(`Role ${createdRole.name} created successfully!`);
  } catch (error) {
    logger.error(`Error creating role: ${error}`);
    message.channel.send('An error occurred while creating the role.');
  }
};

export default createRole;
