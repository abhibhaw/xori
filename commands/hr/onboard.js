import {ChannelType} from 'discord.js';
import winston from '../../config/winston.js';

const logger = winston('command/hr/onboard.js');

const {prefix, welcomeChannelName, welcomeMessage} = process.env;

const onboardUser = message => {
  const {roles} = message.mentions;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  args.shift().toLowerCase();
  const userName = args[0];
  const foundUser = message.guild.members.cache.find(
    member => member.user.username === userName,
  );
  if (!foundUser) {
    message.channel.send('User not found');
    return;
  }
  roles.forEach(async r => {
    try {
      await foundUser.roles.add(r);
    } catch (error) {
      logger.error('Error adding role to member:', error);
      message.channel.send('An error occurred while adding role to member.');
    }
  });

  message.channel.send('Added successfully');
  const welcomeChannel = message.guild.channels.cache.find(
    channel =>
      channel.name === welcomeChannelName &&
      channel.type === ChannelType.GuildText,
  );

  welcomeChannel.send(`${welcomeMessage}, <@${foundUser.id}> 🎉🎉`);
};

export default onboardUser;
