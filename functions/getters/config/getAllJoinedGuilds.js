/**********
 * Gets a list of servers the bot is currently residing in and prints to console.
 * 
 * - (client) client - The bot's client object
 * ---
 * ##### Returns nothing
 **********/
async function getAllJoinedGuilds(client) {
	let allguilds = await client.guilds.fetch();
	let guilds = [];
	let actives = 0;
	for (const guild of allguilds) {
		let guildfetched = await client.guilds.fetch(guild[0]);
		let guildapps = Array.from(await guildfetched.commands.fetch()).map((g) => g[0]);
		guilds.push({ id: guild[0], name: guildfetched.name, commands: guildapps.length });
		if (process.configs.servers != undefined && process.configs.servers[guild[0]]) {
			// Add to number to toast at the end of this function.
			actives++;
		}
	}
	process.joinedguilds = guilds.slice(0);

	console.log(`Joined to ${process.joinedguilds.length} servers; active in ${actives} servers.`);
}

exports.getAllJoinedGuilds = getAllJoinedGuilds;