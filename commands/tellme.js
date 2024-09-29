import axios from 'axios';
import winston from '../config/winston.js';

const logger = winston('command/tellme.js');

const tellme = async message => {
  try {
    const args = message.content.split(' tellme ');
    const query = args[1];
    message.channel.send(`🤔🤔 Thinking about ${query}...`);
    message.channel.send(
      'https://media.tenor.com/xjYMUqvC1SQAAAAM/shaktimaan-tv.gif',
    );
    axios
      .get(`${process.env.ASSISTANT_ENDPOINT}/?question=${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ASSISTANT_TOKEN}`,
        },
      })
      .then(response => {
        if (response.data.length > 1950) {
          logger.info('Response is too long, sending in parts');
          const parts = response.data.match(/[\s\S]{1,1950}/g);
          parts.forEach(part => {
            message.channel.send(part);
          });
        } else {
          message.channel.send(response.data);
        }
      })
      .catch(error => {
        logger.error('Error in tellme command:', error);
        message.channel.send('Error in tellme command');
      });
  } catch (error) {
    logger.error('Error in tellme command:', error);
    message.channel.send('Error in tellme command');
  }
};

export default tellme;
