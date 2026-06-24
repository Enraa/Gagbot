let fs = require("fs");
let path = require("path");
const { getHeadwear } = require("./getters/headwear/getHeadwear");
const { getHeavy } = require("./getters/heavy/getHeavy");
const { getWearable } = require("./getters/wearable/getWearable");
const { getToys } = require("./getters/toy/getToys");
const { getCollar } = require("./getters/collar/getCollar");
const { getGags } = require("./getters/gag/getGags");
const { getMitten } = require("./getters/mitten/getMitten");
const { getHeavyList } = require("./getters/heavy/getHeavyList");


/*********
 * Called from any other function, this will pass the data prop to those functions, if the function exists for that item.
 * 
 * - (string) type - The specific eventID being emitted
 * - (user id) userid - The user causing this event
 * - (server id) server - The server this event is occurring in
 * - (object any) data - Additional details, sufficient to reconstruct the event
 * - (integer) delay? - Delay, if any to run this event.
 *********/
async function emitEvent(type, userid, serverid, data, delay = 0) {
    // All of this because I had the lack of foresight to see that events would eventually evolve and need a better approach.
    // Note, this access process vars directly due to potential circular dependencies. In the future, these should be resolved. 
    // Notable circulars include the messaging system which lives heavily in gagfunctions.js. 
    
    // Wait for delay, if specified.
    if (delay) { await new Promise(res => setTimeout(res, delay)) }

    // Gags
	if (getGags(serverid, userid)) {
        getGags(serverid, userid).forEach((g) => {
            if (process.eventfunctions && process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype] && process.eventfunctions.gags[g.gagtype][type]) {
                process.eventfunctions.gags[g.gagtype][type](serverid, userid, data);
            }
        });
	}
	// Headwear
	if (getHeadwear(serverid, userid)) {
        getHeadwear(serverid, userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.headwear && process.eventfunctions.headwear[h] && process.eventfunctions.headwear[h][type]) {
                process.eventfunctions.headwear[h][type](serverid, userid, data);
            }
        });
	}
	// Mittens
	if (getMitten(serverid, userid)) {
        if (getMitten(serverid, userid)) {
            if (process.eventfunctions && process.eventfunctions.mitten && process.eventfunctions.mitten[getMitten(serverid, userid).mittenname] && process.eventfunctions.mitten[process.mitten[userid].mittenname][type]) {
                process.eventfunctions.mitten[getMitten(serverid, userid).mittenname][type](serverid, userid, data);
            }
        }
	}
	// Heavy Bondage
	if (getHeavy(serverid, userid)) {
        if (getHeavy(serverid, userid)) {
            getHeavyList(serverid, userid).forEach((heavy) => {
                if (process.eventfunctions && process.eventfunctions.heavy && process.eventfunctions.heavy[heavy.type] && process.eventfunctions.heavy[heavy.type][type]) {
                    process.eventfunctions.heavy[heavy.type][type](serverid, userid, data);
                }
            })
        }
	}
	// Wearables
	if (getWearable(serverid, userid)) {
        getWearable(serverid, userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h][type]) {
                process.eventfunctions.wearable[h][type](serverid, userid, data);
            }
        });
	}
    // Toys
    if (getToys(serverid, userid)) {
        getToys(serverid, userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.toys && process.eventfunctions.toys[h.type] && process.eventfunctions.toys[h.type][type]) {
                process.eventfunctions.toys[h.type][type](serverid, userid, data);
            }
        });
	}
    // Collars
    if (getCollar(serverid, userid)) {
        if (getCollar(serverid, userid)) {
            if (process.eventfunctions && process.eventfunctions.collar && process.eventfunctions.collar[getCollar(serverid, userid).collartype] && process.eventfunctions.collar[getCollar(serverid, userid).collartype][type]) {
                process.eventfunctions.collar[getCollar(serverid, userid).collartype][type](serverid, userid, data);
            }
            if (getCollar(serverid, userid).additionalcollars) {
                getCollar(serverid, userid).additionalcollars.forEach((ac) => {
                    if (process.eventfunctions && process.eventfunctions.collar && process.eventfunctions.collar[ac] && process.eventfunctions.collar[ac][type]) {
                        process.eventfunctions.collar[ac][type](serverid, userid, data);
                    }
                })
            }
        }
	}
}

/**********
 * Setup the event handlers for all restraint files inside the structure at ./eventfunctions/
 * 
 **********/
async function setUpEventFunctions() {
    // This new method only touches each restraint file once and sets it up in a way
    // that no longer needs to review this code to add a new event. Also way faster to start.
    let eventfunctionsfolders = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions"));
    eventfunctionsfolders.forEach((f) => {
        let eventfunctionsfiles = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions", f));
        eventfunctionsfiles.forEach((file) => {
            // Grab the restraint file and then filter for only exported functions
            let functionfile = require(path.resolve(__dirname, "..", "eventfunctions", f, file));
            let functionstoadd = Object.entries(functionfile).filter(([key, value]) => typeof value == 'function')
            
            // Create the eventfunctions tree
            if (process.eventfunctions == undefined) { process.eventfunctions = {} }
            if (process.eventfunctions[f] == undefined) { process.eventfunctions[f] = {} }
            if (process.eventfunctions[f][file.replace(".js","")] == undefined) { process.eventfunctions[f][file.replace(".js","")] = {} }
            
            // Add the exported functions inside the event file
            functionstoadd.forEach(([key,value]) => {
                process.eventfunctions[f][file.replace(".js","")][key] = value
            })
        });
    });
}

exports.emitEvent = emitEvent;
exports.setUpEventFunctions = setUpEventFunctions;