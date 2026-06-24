// Strictly speaking, this is unnecessary for most of these. 
// But some are going to use extra properties! 
exports.name = "Gasmask (Linked)";

exports.tags = ["latex"];

// Remove the shared hose if it is present
exports.onUnlock = (data) => {
    if (process.headwear && process.headwear[data.serverID] && process.headwear[data.serverID][data.userID] && process.headwear[data.serverID][data.userID].sharedbreathhose) {
        delete process.headwear[data.serverID][data.userID].sharedbreathhose;
    }
}

exports.hidden = false; // Disable it from showing in the list!