import {PermissionsBitField, ChannelType} from 'discord.js';
import winston from '../config/winston.js';

const logger = winston('create.js');
const {category, prefix} = process.env;

const createChannelAndRole = async message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  args.shift().toLowerCase();
  const roleName = args[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  args.shift().toLowerCase();
  let categoryName;
  if (args.length === 0) {
    categoryName = category;
  } else {
    args.shift().toLowerCase();
    categoryName = args[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  }
  const {guild} = message;
  let categoryChannel = guild.channels.cache.find(
    channel =>
      channel.type === ChannelType.GuildCategory &&
      channel.name.includes(categoryName),
  );

  if (!categoryChannel) {
    categoryChannel = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    });
  }

  try {
    const role = await guild.roles.create({
      name: roleName,
      color: 'Random',
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
      reason: `Role for ${roleName} story.`,
    });
    logger.info('Role created:', role.name, categoryChannel.id);
    const channel = await guild.channels.create({
      name: roleName,
      type: ChannelType.GuildText,
      parent: categoryChannel.id,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id, // Make the channel private
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: role.id,
          allow: [
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
      ],
    });

    logger.info('Channel created:', channel.name);
    return message.channel.send(
      `Role '${role.name}' and channel '${channel.name}' created successfully.`,
    );
  } catch (error) {
    logger.error('Error creating role and channel:', error);
    return message.channel.send(
      'An error occurred while creating role and channel.',
    );
  }
};

export default createChannelAndRole;
