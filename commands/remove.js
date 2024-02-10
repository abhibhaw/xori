import winston from '../config/winston.js';

const logger = winston('command/remove.js');
const removeRoleFromUser = message => {
  const {members, roles} = message.mentions;
  members.forEach(async member => {
    roles.forEach(async r => {
      try {
        await member.roles.remove(r);
      } catch (error) {
        logger.error('Error removing role from member:', error);
        message.channel.send(
          'An error occurred while removing role from member.',
        );
      }
    });
  });

  message.channel.send('Removed successfully');
};

export default removeRoleFromUser;
