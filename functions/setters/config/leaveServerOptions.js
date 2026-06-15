/***********
 * Removes all configs for a server
 * 
 * - (server ID) serverID - The server to remove from config
 * ---
 * ##### *No return value*
 ***********/
function leaveServerOptions(serverID) {
	if (process.configs == undefined) {
		process.configs = {};
	}
	if (process.configs.servers == undefined) {
		process.configs.servers = {};
	}
	delete process.configs.servers[serverID];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.configs = true;
}

exports.leaveServerOptions = leaveServerOptions;