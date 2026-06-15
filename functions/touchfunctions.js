const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js");
const { emitEvent } = require("./eventhandling");
const { getHeavyRestrictions } = require("./getters/heavy/getHeavyRestrictions");
const { getGags } = require("./getters/gag/getGags");
const { getHeadwear } = require("./getters/headwear/getHeadwear");
const { getMitten } = require("./getters/mitten/getMitten");
const { getHeavy } = require("./getters/heavy/getHeavy");
const { getWearable } = require("./getters/wearable/getWearable");
const { getToys } = require("./getters/toy/getToys");
const { getCollar } = require("./getters/collar/getCollar");
const { getOption } = require("./getters/config/getOption");
const { getChastity } = require("./getters/chastity/getChastity");
const { getChastityBra } = require("./getters/chastity/getChastityBra");
const { getClonedChastityKey } = require("./getters/chastity/getClonedChastityKey");
const { getClonedChastityBraKey } = require("./getters/chastity/getClonedChastityBraKey");
const { getClonedCollarKey } = require("./getters/collar/getClonedCollarKey");
const { canAccessCollar } = require("./getters/collar/canAccessCollar");
const { statsAddCounter } = require("./setters/config/statsAddCounter");

/****************
 * Rolls a Pat based on the user's bondage and the target's bondage. If hit is false, then boundmiss will note the reason, if it is due to the user being bound. 
 * - **(user id) user** trying to deliver the pat
 * - **(user id) target** to receive the pat
 * 
 * Returns an object with properties: 
 * - hit: Boolean 
 * - crit: Boolean
 * - boundmiss: string ("arms", "blind", "legs", "container")
*******************/
function rollPatChance(user, target) {
    let returnedobject = {
        hit: false,
        crit: false,
        boundmiss: undefined
    }
    let hitaccuracy = 0.95; // Base accuracy for successfully patting someone. This is 95% chance. 
    let critaccuracy = 0.05;
    critaccuracy = critaccuracy + Math.min(process.headpatcritchancebonus, 0.20);
    if (process.forceheadpatcrit == true) {
        critaccuracy = 1.0;
        process.forceheadpatcrit = false;
    }
    
    // If they are in heavy bondage, we need that list. 
    let userheavyrestrictions = getHeavyRestrictions(user);
    let targetheavyrestrictions = getHeavyRestrictions(target);
    
    // Check if they are in a container. If so, they need to be in the same container to succeed. 
    // If they are not, accuracy is 0, set the boundmiss reason to container.
    if (userheavyrestrictions && userheavyrestrictions.touchlist && userheavyrestrictions.touchlist.length > 0 && !userheavyrestrictions.touchlist.includes(target)) {
        returnedobject.boundmiss = "container"
        hitaccuracy = 0.0;
    }

    // Check if their legs are bound. If so, the accuracy will go down by half. 
    if (userheavyrestrictions && userheavyrestrictions.touchself && !userheavyrestrictions.touchothers) {
        returnedobject.boundmiss = "legs"
        hitaccuracy = hitaccuracy / 2;
    }

    // Check if they are blind. If so, the accuracy will go down to 1/4. 
    if (userheavyrestrictions.canInspect == false) {
        returnedobject.boundmiss = "blind"
        hitaccuracy = hitaccuracy / 4;
    }

    // Check if their arms are bound. If so, the accuracy will go down to 0. 
    if (userheavyrestrictions.touchself == false) {
        returnedobject.boundmiss = "arms"
        hitaccuracy = 0.0;
    }

    // Check if the target is blind. If so, the accuracy will be doubled.
    if (targetheavyrestrictions.canInspect == false) {
        hitaccuracy = hitaccuracy * 2;
    }

    // Check if the target's legs are bound. If so, the accuracy will be doubled again.
    if (targetheavyrestrictions.canInspect == false) {
        hitaccuracy = hitaccuracy * 2;
    }

    // Check if we are headpatting ourselves. If so, then accuracy should be set to 1.0, if our arms aren't bound. 
    if (userheavyrestrictions.touchself && (user == target)) {
        hitaccuracy = 1.0;
    }

    returnedobject.hit = (Math.random() <= hitaccuracy)
    if (returnedobject.hit) {
        let randomroll = Math.random();
        returnedobject.triplecrit = (randomroll <= (critaccuracy * 0.05 * 0.05));
        returnedobject.doublecrit = (randomroll <= (critaccuracy * 0.05));
        returnedobject.crit = (randomroll <= critaccuracy)
        returnedobject.boundmiss = undefined;
        process.headpatcritchancebonus = 0.0;
    }

    // Do all of the functions for the person receiving the headpats.
    // Note, within the function we need to check if headpat was successful! 
    emitEvent("headpatfunction", target, { target: target, returnedobject: returnedobject })

    if (returnedobject.hit) {
        statsAddCounter(user, "headpatsgiven");
        statsAddCounter(target, "headpatsreceived");
        if (user == target) {
            statsAddCounter(target, "headpatsself");
        }
    }
    if (returnedobject.crit) { 
        statsAddCounter(user, "headpatcrits") 
        statsAddCounter(target, "headpatcritsreceived") 
    }
    if (returnedobject.doublecrit) { 
        statsAddCounter(user, "headpatdoublecrits") 
        statsAddCounter(target, "headpatdoublecritsreceived") 
    }
    if (returnedobject.triplecrit) { 
        statsAddCounter(user, "headpattriplecrits") 
        statsAddCounter(target, "headpattriplecritsreceived") 
    }

    return returnedobject;
}

// This should definitely be refactored. 
function doHeadpatFunctions(headpatter, recipient, returnedobject) {
	// Gags
	if (process.gags) {
        getGags(recipient).forEach((g) => {
            if (process.headpatfunctions.gags && process.headpatfunctions.gags[g.gagtype]) {
                process.headpatfunctions.gags[g.gagtype](recipient, headpatter, returnedobject);
            }
        });
	}
	// Headwear
	if (process.headwear) {
        getHeadwear(recipient).forEach((h) => {
            if (process.headpatfunctions.headwear && process.headpatfunctions.headwear[h]) {
                process.headpatfunctions.headwear[h](recipient, headpatter, returnedobject);
            }
        });
	}
	// Mittens
	if (process.mitten) {
        if (getMitten(recipient)) {
            if (process.headpatfunctions.mitten && process.headpatfunctions.mitten[getMitten(recipient).mittenname]) {
                process.headpatfunctions.mitten[getMitten(recipient).mittenname](recipient, headpatter, returnedobject);
            }
        }
	}
	// Heavy Bondage
	if (process.heavy) {
        if (getHeavy(recipient)) {
            process.heavy[recipient].forEach((heavy) => {
                if (process.headpatfunctions.heavy && process.headpatfunctions.heavy[heavy.type]) {
                    process.headpatfunctions.heavy[heavy.type](recipient, headpatter, returnedobject);
                }
            })
        }
	}
	// Wearables
	if (process.wearable) {
        getWearable(recipient).forEach((h) => {
            if (process.headpatfunctions.wearable && process.headpatfunctions.wearable[h]) {
                process.headpatfunctions.wearable[h](recipient, headpatter, returnedobject);
            }
        });
	}
    // Toys
    if (process.toys) {
        getToys(recipient).forEach((h) => {
            if (process.headpatfunctions.toys && process.headpatfunctions.toys[h.type]) {
                process.headpatfunctions.toys[h.type](recipient, headpatter, returnedobject);
            }
        });
	}
    // Collars
    if (process.collar) {
        if (getCollar(recipient)) {
            if (process.headpatfunctions.collar && process.headpatfunctions.collar[getCollar(recipient).collartype]) {
                process.headpatfunctions.collar[getCollar(recipient).collartype](recipient, headpatter, returnedobject);
            }
            if (getCollar(recipient).additionalcollars) {
                getCollar(recipient).additionalcollars.forEach((ac) => {
                    if (process.headpatfunctions.collar && process.headpatfunctions.collar[ac]) {
                        process.headpatfunctions.collar[ac](recipient, headpatter, returnedobject);
                    }
                })
            }
        }
	}
}

/********
 * Attempt to shock the target user ID, if they have configurations set.
 * 
 * - (user id) user - The person to shock!
 ********/
async function shockUser(user) {
    try {
        if (getOption(user, "pishockusername") && (typeof getOption(user, "pishockusername") == "string") &&
            getOption(user, "pishockname") && (typeof getOption(user, "pishockname") == "string") &&
            getOption(user, "pishockcode") && (typeof getOption(user, "pishockcode") == "string") &&
            getOption(user, "pishockapikey") && (typeof getOption(user, "pishockapikey") == "string")) {
                // Set up the https request. 
                const reqdata = JSON.stringify({
                    Username: getOption(user, "pishockusername"),
                    Name: getOption(user, "pishockname"),
                    Code: getOption(user, "pishockcode"),
                    Intensity: 100,
                    Duration: 2,
                    Apikey: getOption(user, "pishockapikey"),
                    Op: (getOption(user, "pishockop") ? getOption(user, "pishockop") : "0"), // 0 for shock, 1 for vibrate, 2 for beep
                });
                const options = {
                    hostname: 'do.pishock.com/api/apioperate', // without https://
                    port: 443, // Default SSL port
                    path: '/path', // Path after the domain
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }

                fetch('https://do.pishock.com/api/apioperate', {
                    method: 'POST', // Specifying the method
                    headers: {
                        'Content-Type': 'application/json', // Specifying content type as JSON
                    },
                    body: reqdata, // Stringifying the JSON body
                })
                .then(response => console.log(response)) // Parsing the JSON response
                .catch((error) => {
                    console.error('Error:', error); // Error handling
                });
        }
        else {
            console.log(`No shocker or invalid shocker information configured for ID ${user}.`)
        }
    }
    catch (err) {
        console.log(err)
    }
}

/********
 * Returns a Promise where Resolve allowed the action and Reject disallowed the action. Checks the relevant config variable under "type" and DMs the recipient for permission if necessary.
 * 
 * - (user object) user - The person performing the action
 * - (user object) target - The person receiving the action
 * - (string) type - The type of action being performed ("headpat", "shock", etc)
 * - (boolean) noprompt? - If true, skips DMing and immediately rejects if no suitable user
 ********/
async function handleTouchEvent(user, target, type, noprompt = false) {
	return new Promise(async (res, rej) => {
        if (!user || !target) {
            rej("User or Target does NOT exist")
            return;
        }
        if (!user.id || !target.id) {
            console.log("User.id or Target.id does NOT exist!")
            rej("Blocked")
            return;
        }
		let hasOption = getOption(target.id, `receive${type}`);
        if (user.id === target.id) { 
            res(true) 
            return;
        } // We're okay with touching ourselves.
        if (getOption(target.id, `allowed${type}`) && getOption(target.id, `allowed${type}`).includes(user.id)) {
            // This is on the target's approved headpat list. 
            res(true)
            return;
        }
        
        let iskeyholder = false;
        
        if (getCollar(target.id)?.keyholder == user.id) { iskeyholder = true }
        if (getChastity(target.id)?.keyholder == user.id) { iskeyholder = true }
        if (getChastityBra(target.id)?.keyholder == user.id) { iskeyholder = true }
        if (getClonedChastityKey(target.id).includes(user.id)) { iskeyholder = true }
        if (getClonedChastityBraKey(target.id).includes(user.id)) { iskeyholder = true }
        if (getClonedCollarKey(target.id).includes(user.id)) { iskeyholder = true }

        if (hasOption === "everyonenoprompt") {
            // Nothing needs to be done here.
            res(true)
            return;
        } 
        if (hasOption === "everyone" && iskeyholder) {
            // Keyholders get to skip the line
            res(true)
            return;
        }
        if (hasOption === "keyholdernoprompt") {
            if (iskeyholder) {
                // Keyholders allowed to touch
                res(true)
                return;
            }
            else {
                // Everyone else not allowed
                rej("Blocked")
                return;
            }
        }
        if (hasOption === "keyholder") {
            if (!iskeyholder) {
                // Everyone else not allowed, keyholders prompt
                rej("Blocked")
                return;
            }
        }
        if (hasOption === "collaraccess") {
            if (canAccessCollar(target.id, user.id).access) {
                res(true)
                return;
            }
            else {
                rej("Blocked")
                return;
            }
        }
		if (hasOption === "nobody") {
            // NOPE
			rej("Blocked");
			return;
		} 

        // If this is a touch event which does NOT handle prompts, go away. 
        if (noprompt) {
            rej("Blocked")
            return;
        }

        /*if (process.recentlypromptedmajor && process.recentlypromptedmajor[target.id] && process.recentlypromptedmajor[target.id] > Date.now()) {
            rej("Cooldown")
            return;
        }*/

		let restraintfullname = ``;
        let touchtext = ``;
		switch (type) {
			case "headpat":
                touchtext = `${user} would like to headpat you.`
				break;
			default:
				console.log(`Could not find a touch by that type.`);
				rej("Error");
				break;
		}

		// We need to ASK
		let prompttext = `${touchtext}\n\nDo you wish to allow this action?`;
		let buttons = [
            new ButtonBuilder()
                .setCustomId("denyButton")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger), 
            new ButtonBuilder()
                .setCustomId("acceptButton")
                .setLabel("Allow")
                .setStyle(ButtonStyle.Success),
            /*
            new ButtonBuilder()
                .setCustomId("cooldown15")
                .setLabel("Block Requests for 15m")
                .setStyle(ButtonStyle.Danger),*/
        ]

        try {
            let dmchannel = await target.createDM();
            await dmchannel
                .send({ content: `${prompttext}`, components: [new ActionRowBuilder().addComponents(...buttons)] })
                .then(async (mess) => {
                    // Create a collector for up to 5 minutes
                    const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                    collector.on("collect", async (i) => {
                        console.log(i);
                        if (i.customId == "cooldown15") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 900000
                        }
                        if (i.customId == "cooldown60") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 3600000
                        }
                        if (i.customId == "cooldown1440") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 86400000
                        }
                        if (i.customId == "acceptButton") {
                            mess.edit({ content: `Accepted - ${user} is allowed to ${type} you.`, components: [] })
                            res(true);
                        } else {
                            mess.edit({ content: `Rejected - ${user} is NOT allowed to ${type} you.`, components: [] })
                            rej(true);
                        }
                    });

                    collector.on("end", async (collected) => {
                        // timed out
                        if (collected.length == 0) {
                            mess.edit({ content: `Timed out - ${user} will not be permitted to touch you.`, components: [] })
                            rej(true);
                        }
                    });
                })
                .catch((err) => {
                    console.log(`Error sending message to touch ${target}.`);
                    rej("NoDM");
                });
        }
        catch (err) {
            console.log(err);
            rej("NoDM")
        }
	});
}

exports.rollPatChance = rollPatChance;
exports.handleTouchEvent = handleTouchEvent;
exports.shockUser = shockUser;