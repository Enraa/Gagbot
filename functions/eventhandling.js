let fs = require("fs");
let path = require("path");
const { getHeadwear } = require("./getters/headwear/getHeadwear");
const { getHeavy } = require("./getters/heavy/getHeavy");
const { getWearable } = require("./getters/wearable/getWearable");
const { getToys } = require("./getters/toy/getToys");
const { getCollar } = require("./getters/collar/getCollar");


/*********
 * Called from any other function, this will pass the data prop to those functions, if the function exists for that item.
 * 
 * - (string) type - The specific eventID being emitted
 * - (user id) userid - The user causing this event
 * - (object any) data - Additional details, sufficient to reconstruct the event
 * - (integer) delay? - Delay, if any to run this event.
 *********/
async function emitEvent(type, userid, data, delay = 0) {
    // All of this because I had the lack of foresight to see that events would eventually evolve and need a better approach.
    // Note, this access process vars directly due to potential circular dependencies. In the future, these should be resolved. 
    // Notable circulars include the messaging system which lives heavily in gagfunctions.js. 
    
    // Wait for delay, if specified.
    if (delay) { await new Promise(res => setTimeout(res, delay)) }

    // Gags
	if (process.gags && process.gags[userid]) {
        process.gags[userid].forEach((g) => {
            if (process.eventfunctions && process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype] && process.eventfunctions.gags[g.gagtype][type]) {
                process.eventfunctions.gags[g.gagtype][type](userid, data);
            }
        });
	}
	// Headwear
	if (process.headwear) {
        getHeadwear(userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.headwear && process.eventfunctions.headwear[h] && process.eventfunctions.headwear[h][type]) {
                process.eventfunctions.headwear[h][type](userid, data);
            }
        });
	}
	// Mittens
	if (process.mitten) {
        if (process.mitten[userid]) {
            if (process.eventfunctions && process.eventfunctions.mitten && process.eventfunctions.mitten[process.mitten[userid].mittenname] && process.eventfunctions.mitten[process.mitten[userid].mittenname][type]) {
                process.eventfunctions.mitten[process.mitten[userid].mittenname][type](userid, data);
            }
        }
	}
	// Heavy Bondage
	if (process.heavy) {
        if (getHeavy(userid)) {
            process.heavy[userid].forEach((heavy) => {
                if (process.eventfunctions && process.eventfunctions.heavy && process.eventfunctions.heavy[heavy.type] && process.eventfunctions.heavy[heavy.type][type]) {
                    process.eventfunctions.heavy[heavy.type][type](userid, data);
                }
            })
        }
	}
	// Wearables
	if (process.wearable) {
        getWearable(userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h][type]) {
                process.eventfunctions.wearable[h][type](userid, data);
            }
        });
	}
    // Toys
    if (process.toys) {
        getToys(userid).forEach((h) => {
            if (process.eventfunctions && process.eventfunctions.toys && process.eventfunctions.toys[h.type] && process.eventfunctions.toys[h.type][type]) {
                process.eventfunctions.toys[h.type][type](userid, data);
            }
        });
	}
    // Collars
    if (process.collar) {
        if (getCollar(userid)) {
            if (process.eventfunctions && process.eventfunctions.collar && process.eventfunctions.collar[getCollar(userid).collartype] && process.eventfunctions.collar[getCollar(userid).collartype][type]) {
                process.eventfunctions.collar[getCollar(userid).collartype][type](userid, data);
            }
            if (getCollar(userid).additionalcollars) {
                getCollar(userid).additionalcollars.forEach((ac) => {
                    if (process.eventfunctions && process.eventfunctions.collar && process.eventfunctions.collar[ac] && process.eventfunctions.collar[ac][type]) {
                        process.eventfunctions.collar[ac][type](userid, data);
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