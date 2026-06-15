/************
 * Gets the current cooldown time for deploying commands
 * 
 * - (server ID) serverID - The ID of the server to check for
 * ---
 * ##### Returns the integer number of seconds remaining on the cooldown, or 0.
 ************/
function getServerCmdRefresh(serverID) {
	if (process.servercmdcooldown == undefined) {
		process.servercmdcooldown = {};
	}
	if (process.servercmdcooldown[serverID]) {
		console.log(process.servercmdcooldown[serverID].date - Math.floor(performance.now()));
		return Math.floor(Math.max(Math.min(Math.floor(process.servercmdcooldown[serverID].date - Math.floor(performance.now())) / 1000, 300), 0));
	}
	return 0;
}

exports.getServerCmdRefresh = getServerCmdRefresh;