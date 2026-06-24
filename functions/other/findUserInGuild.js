const { logConsole } = require("../logfunctions");

/**********
 * Finds a user in any guilds the bot is a part of and returns that list. Must be run after preloadGuilds!
 * 
 * - (user id) userID - The user we're checking
 * ---
 * ##### Returns an array of guild IDs that the user was found in
 **********/
async function findUserInGuild(userID) {
    let useringuilds = [];
    if (process.client) {
        let guilds = process.client.guilds.cache.map(guild => guild.id)
        for (const guildID of guilds) {
            let guild = process.client.guilds.cache.get(guildID);
            try {
                await guild.members.fetch(userID)
                useringuilds.push(guildID)
            }
            catch (err) {
                // Not in the guild
                logConsole(`User ${userID} is not in ${guildID}`, 4)
            }
        }
    }
}