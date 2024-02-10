import {PermissionsBitField, ChannelType} from 'discord.js';
import winston from '../config/winston.js';

const logger = winston('create.js');

const createChannelAndRole = async (category, message, args) => {
  const roleName = args.join(' ').toLowerCase().replace(' ', '-');
  const {guild} = message;
  const categoryChannel = guild.channels.cache.find(
    channel =>
      channel.type === ChannelType.GuildCategory && channel.name === category,
  );

  if (!categoryChannel) {
    return message.channel.send('Category not found.');
  }

  try {
    const role = await guild.roles.create({
      name: roleName,
      color: 'Blue',
      permissions: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.UseExternalEmojis,
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
