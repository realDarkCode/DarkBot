# DarkBot

DarkBot is a Discord bot made with discord.js that serves the DarkCode Community Discord Server.

## Project Idea

As a programmer, I've always wanted to build things that directly improve my workflow. I listen to music a lot while studying and coding, so I needed a music player that would run on my server, allowing my friends and me to enjoy music together. I also needed to ensure that they could interact with it easily, which is why I opted for a Discord bot.

Additionally, when I was in 9th grade, I joined a team at my school whose purpose was to maintain school discipline. We had members from various classes, so we needed a point system to identify the most active monitors. I implemented this feature in this bot, allowing monitor representatives from different classes to easily grade their lap monitors.

## Table of Contents

1. [Project Idea](#project-idea)
1. [Features](#features)
1. [Installation](#installation)
1. [Commands](#commands)
   1. [General](#general)
   2. [Moderation](#moderation)
   3. [Music](#music)
   4. [Notifications](#notifications)
   5. [Presence](#presence)
   6. [Subscription](#subscription)
1. [Contributing](#contributing)
1. [Images](#images)

## Features

- Music playback
- Notifications
- User presence tracking
- Moderation tools
- Subscription management

## Installation

To install DarkBot, you will need to have [Node.js](https://nodejs.org/en) installed on your machine. Once you have installed, follow these steps:

1. Clone the repository: `git clone https://github.com/realDarkCode/DarkBot.git`
   or,
   Download latest [release](https://github.com/realDarkCode/DarkBot/releases)
2. Navigate to the project directory: `cd DarkBot`
3. Install the dependencies: `npm install`
4. Rename the `.env.example` file to `.env` and add your variables
5. Start the bot: `npm start`

## Commands

### General

#### `/ping`

Replies with pong! and shows latency and API latency.

#### `/announce`

Posts an announcement as an embed to a configured public announcement channel or specified channel.

- `bot_post` (boolean): Post as a bot or admin (optional)
- `title` (string): Set the embed title (optional)
- `color` (string): Set the embed color (optional)
- `description` (string): Set the embed description (optional)
- `thumbnail` (string): Set the embed thumbnail (optional)
- `image` (url): Set the embed image (optional)
- `footer_text` (string): Set the embed footer text (optional)
- `mention1` (mentionable): Mention roles/user at the beginning of the announcement (optional)
- `mention2` (mentionable): Mention roles/user at the beginning of the announcement (optional)
- `mention3` (mentionable): Mention roles/user at the beginning of the announcement (optional)
- `channel` (channel): Select the channel to post the announcement (optional)

### Moderation

#### `/clear`

Clears messages from a channel.

- `amount` (number): Number of messages to remove (required)
- `reason` (string): Specify the reason for removing these messages (required)
- `target` (user): Specify a member if you want to remove that member's messages (optional)

#### `/presence`

See the recent active times of a user.

- `individual`
  - `target` (user): Target user (required)
- `guild`
  - View the members' presence status of the guild.

### Music

#### `/music play`

Plays a song.

- `query` (string): Enter the song name or link (required)

#### `/music search`

Searches for a video/playlist.

- `query` (string): The search term for the video/playlist (required)
- `type` (string): Select the video type (optional)
  - Playlist
  - Video
- `limit` (number): Number of search results (optional, min: 1, max: 10)

#### `/music volume`

Sets the volume.

- `volume` (number): Set the volume (required, min: 0, max: 100)

#### `/music favorites`

Shows the list of songs that you've played the most.

#### `/music play_favorites`

Plays your favorite songs as a playlist.

#### `/music skip`

Skips music to a specific position in the queue.

- `amount` (number): How many songs you want to skip (required, min: 1)

#### `/music seek`

Sets the playing time to another position.

- `seconds` (number): Enter the duration in seconds (required, min: 5)

#### `/music filter set`

Sets a filter for the music player.

- `filter` (string): Select the filter (required)

#### `/music filter clear`

Removes all the filters from the music player.

#### `/music filter list`

Shows the list of all available filters.

### Notifications

#### `/notify`

Sets a scheduled message with an image.

- `time` (number): Set the delay time for the notify in minutes (required)
- `message` (string): Set the message for the notify [max 4000 characters] (required)
- `recipient` (user): Set the user for the notify [mention the @user] (optional)
- `image` (url): Provide the exact image link which will be attached to the message [max 350 length] (optional)

### Subscription

#### `/subscription subscribe`

Subscribes to a specific service.

- `service` (string): Select the service (required)

#### `/subscription unsubscribe`

Unsubscribes from a specific service.

- `service` (string): Select the service (required)

#### `/subscription list`

Shows the list of available services in the server.

#### `/subscription my_services`

Shows the list of services you have used or are currently using.

## Contributing

If you would like to contribute to DarkBot, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-branch`
3. Make your changes and commit them: `git commit -m "my changes"`
4. Push to the branch: `git push origin my-branch`
5. Create a pull request.

## Images

![](https://i.imgur.com/OL6gyjw.png)
![](https://i.imgur.com/EyxXSbn.png)
![](https://i.imgur.com/LDnP5pt.png)
![](https://i.imgur.com/0bfTXTv.png)
