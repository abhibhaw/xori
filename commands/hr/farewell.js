import winston from '../../config/winston.js';

const logger = winston('command/hr/farewell.js');

const farewellUser = message => {
  const {members} = message.mentions;
  members.forEach(async member => {
    try {
      const name = member.displayName;
      await member.roles.set([]);
      message.channel.send(
        `A special farewell to our amazing teammate ${name}! 🎉 Thank you for all the contributions and all the best for your future endeavour`,
      );
    } catch (error) {
      logger.error('Error adding role to member:', error);
      message.channel.send(
        'An error occurred while removing role from member.',
      );
    }
  });
};

export default farewellUser;
