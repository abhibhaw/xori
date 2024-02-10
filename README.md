# Product Discord Bot

This is a Discord bot designed to provide utility functions for product management. It's built with Node.js and uses the Discord.js library to interact with the Discord API.

## Features

- Create a new role and associated channel
- Add a user to a role
- Remove a role from a user
- Release a story

## Setup

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Copy `.env.example` to `.env` and fill in your bot token, command prefix, and other configuration variables
4. Start the bot with `npm start` or `yarn start`

## Commands

- `create`: Creates a new role and associated channel. Usage: `create <role-name>`
- `add`: Adds a user to a role. Usage: `add <user-mention> <role-name>`
- `remove`: Removes a role from a user. Usage: `remove <user-mention> <role-name>`
- `release`: Releases a story. Usage: `release <story-name>`

## Development

This project uses ESLint and Prettier for linting and code formatting, and Winston for logging. You can start the bot in development mode with `npm run dev` or `yarn dev`, which will automatically restart the bot whenever a file is changed.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC license.