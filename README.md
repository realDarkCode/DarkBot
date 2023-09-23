# DarkBot

DarkBot is a Discord bot made with discord.js that serves the DarkCode Community Discord Server.

## Project Idea

As a programmer, I've always wanted to build things that directly improve my workflow. I listen to music a lot while studying and coding, so I needed a music player that would run on my server, allowing my friends and me to enjoy music together. I also needed to ensure that they could interact with it easily, which is why I opted for a Discord bot.

Additionally, when I was in 9th grade, I joined a team at my school whose purpose was to maintain school discipline. We had members from various classes, so we needed a point system to identify the most active monitors. I implemented this feature in this bot, allowing monitor representatives from different classes to easily grade their lap monitors.

## Features

- Modern Music System with an interactive UI
- Pointing System for the team
- Logging Member join and leave events
- Bulk message deletion from a channel

## Installation

To install DarkBot, you will need to have Node.js and npm installed on your machine. Once you have those installed, follow these steps:

1. Clone the repository: `git clone https://github.com/realDarkCode/DarkBot.git`
2. Navigate to the project directory: `cd DarkBot`
3. Install the dependencies: `npm install`
4. Rename the `.env.example` file to `.env` and add your variables
5. Start the bot: `npm start`

## Usage

Once the bot is running, you can use the following commands:

#### Bot

- `/ping`: Show the latency of the bot

#### Music

All functionalities, such as pause/resume, skip/previous, seek, repeat, auto-play, volume, etc., can be controlled directly using buttons embedded in the player message. Player messages display information like the currently playing song, song duration, and the queue in real-time.

- `/music play [query]`: Play music
- `/music volume`: Set a specific volume

#### Monitor

This bot comes with a team point management system. You can refer to each team member as a monitor, add negative and positive points to them, and view weekly and all-time statistics. You'll also find a config file where you can easily customize your monitor's group.

- `/monitor add`: Add a new monitor
- `/monitor update_profile`: Update a monitor's profile
- `/monitor attendance`: Add attendance points to monitors
- `/monitor add_points`: Add points to monitors
- `/monitor list`: View a list of monitors from a specific class and section
- `/monitor top_monitors`: View all-time top scorers
- `/monitor weekly_top_monitors`: View weekly top scorers

## Contributing

If you would like to contribute to DarkBot, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-branch`
3. Make your changes and commit them: `git commit -m "my changes"`
4. Push to the branch: `git push origin my-branch`
5. Create a pull request.
