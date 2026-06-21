/*********
 * Does a full fetch on all guilds the bot currently belongs to. As the information is unnecessary, this does NOT include members or presences. 
 * 
 * ---
 * ##### *No return value*
 *********/
async function preloadGuilds() {
    if (process.client) {
        await process.client.guilds.fetch();
    }
}