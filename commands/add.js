import winston from '../config/winston.js';

const logger = winston('command/add.js');
const addUserToRole = message => {
  const {members, roles} = message.mentions;
  members.forEach(async member => {
    roles.forEach(async r => {
      try {
        await member.roles.add(r);
      } catch (error) {
        logger.error('Error adding role to member:', error);
        message.channel.send('An error occurred while adding role to member.');
      }
    });
  });

  message.channel.send('Added successfully');
};

export default addUserToRole;
