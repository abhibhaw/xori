import {ChannelType} from 'discord.js';
import winston from '../config/winston.js';

const logger = winston('command/release.js');

const releaseAStory = async message => {
  const {releasedCategory} = process.env;
  const {roles} = message.mentions;
  const {guild} = message;
  let categoryChannel = message.guild.channels.cache.find(
    channel =>
      channel.type === ChannelType.GuildCategory &&
      channel.name === releasedCategory,
  );
  if (!categoryChannel) {
    categoryChannel = await guild.channels.create({
      name: releasedCategory,
      type: ChannelType.GuildCategory,
    });
  }

  roles.forEach(async r => {
    try {
      const targetChannel = guild.channels.cache.find(
        channel =>
          channel.type === ChannelType.GuildText && channel.name === r.name,
      );
      targetChannel.setParent(categoryChannel);
      await r.delete();
    } catch (error) {
      logger.error('Error deleting role:', error);
      message.channel.send('An error occurred while deleting role.');
    }
  });
  message.channel.send('Released successfully');
};

export default releaseAStory;
