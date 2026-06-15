const { markForSave } = require("../../other/markForSave");

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
	markForSave("configs");
}

exports.leaveServerOptions = leaveServerOptions;