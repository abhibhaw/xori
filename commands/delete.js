import {ChannelType} from 'discord.js';
import winston from '../config/winston.js';

const logger = winston('command/delete.js');

const deleteChannelAndRole = async message => {
  const {roles} = message.mentions;
  const {guild} = message;

  roles.forEach(async r => {
    try {
      const targetChannel = guild.channels.cache.find(
        channel =>
          channel.type === ChannelType.GuildText && channel.name === r.name,
      );
      await targetChannel.delete();
      await r.delete();
    } catch (error) {
      logger.error('Error deleting role:', error);
      message.channel.send(
        'An error occurred while deleting role and channel.',
      );
    }
  });
  message.channel.send('Deleted successfully');
};

export default deleteChannelAndRole;
