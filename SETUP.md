# Setup 
### Requirements
- [Node.js](https://nodejs.org/en/download) Version 20.15.1 or greater

### Initial Setup (Local)
#### Step 1 - Get the Repo
- Clone the git repo - **git clone <span>https:</span>//github.com/Enraa/Gagbot**
- or [download the repo as a zip file](https://github.com/Enraa/Gagbot/archive/refs/heads/main.zip)

#### Step 2 - Get a Discord Developer Token
- Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and sign in with your Discord account.
- Create a New Application
- Under Bot, scroll down to **Privileged Gateway Intents** and enable **Server Members Intent** and **Message Content Intent**.
- Scroll back up to **Token** and click the **Reset Token** button. **Write down the token it provides.**
- Under **Installation**, uncheck **User Install** and scroll to **Guild Install** scopes and add **bot**. It should already have **applications.commands**.
- Navigate to the link provided under **Install Link**. This will join the bot to your server.

#### Step 3 - Set up the .env File
- Modify the **.env.md** file provided in the project's directory.
  - Place the token noted above in the line under **DISCORDBOTTOKEN**.
  - Rename the file to **.env**
 
#### Step 4 - Run the Bot
- Navigate to the root of the directory you placed the bot in
- Before running for the first time, install all of the node modules - **npm install**
- Run the bot - **node index**

### Initial Setup (Docker)
- Obtain a Discord Developer token and join the bot using the instructions under Step 2 above.
- The following Docker Compose script can be used to spin the bot up on a Docker instance: 
```
version: "3.9"

services:
  gagbot:
    build: https://github.com/Enraa/Gagbot.git
    image: gagbot
    volumes:
      - gagbotfilelocation:/mnt/GagbotFiles
    container_name: gagbot
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DISCORDBOTTOKEN: "MTQ----------------a"
      GAGBOTFILEDIRECTORY: "/mnt/GagbotFiles"
      BACKUPDELAY: "3300000"
      SAVEDELAY: "120000"
```
This can be pasted into a new stack in Portainer or any other Docker container management. Note, you will want to ensure you set up a GAGBOTFILEDIRECTORY and point it appropriately to a storage the container has read/write access to. This will ensure the data persists across container restarts. 

### Using the Bot
#### Step 1 - Setup a Channel
- In the server that the bot has been joined to, ensure that it either has role or channel specific permissions:
  - **View Channel**
  - **Manage Messages**
  - **Manage Webhooks**
  - **Manage Threads** (optional)
  - **Send Messages in Threads** (optional)
#### Step 1a - Setup a Webhook (optional, but highly recommended!)
- While the bot can setup webhooks for you, the webhook will not be able to use external emoji. To get around this issue, you *must* create a Webhook inside the channel the bot will be running in and call it **Gagbot**. Once created, the bot should be able to pick it up and use it in the next step.
#### Step 2 - Configure the Bot for the Server
- Type **/config** to bring up the Bot's configuration menu. Server moderators (those with a role that has **Manage Messages**) can see the Server Settings menu. In there, click the button to setup an initial configuration. This will also deploy all of the other commands.
