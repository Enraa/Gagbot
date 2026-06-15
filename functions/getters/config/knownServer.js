/************
 * Check if a server exists in the bot's config
 * 
 * - (server ID) serverID - The server to check
 * ---
 * ##### Returns true if configured, false if not
 ************/
function knownServer(serverID) {
	if (process.configs == undefined) {
		process.configs = {};
	}
	if (process.configs.servers == undefined) {
		process.configs.servers = {};
	}
	return process.configs.servers[serverID] != undefined;
}

exports.knownServer = knownServer;