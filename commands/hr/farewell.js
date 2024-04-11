import winston from '../../config/winston.js';

const logger = winston('command/hr/farewell.js');

const farewellUser = message => {
  const {members} = message.mentions;
  members.forEach(async member => {
    try {
      await member.roles.set([]);
    } catch (error) {
      logger.error('Error adding role to member:', error);
      message.channel.send(
        'An error occurred while removing role from member.',
      );
    }
  });

  message.channel.send('Bye Bye 👋👋');
};

export default farewellUser;
