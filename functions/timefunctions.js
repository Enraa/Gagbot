// We were originally going to install Moment, but frankly, since I just need to try to do a basic time parse, we're going to write our own.
let fs = require("fs");
let path = require("path");
let admZip = require("adm-zip");
const { unlockTimelockChastity, unlockTimelockChastityBra, unlockTimelockCollar, gagbotHeldKeyTime, checkGagbotKeys } = require(`./timelockfunctions.js`);
const { updateArousalValues } = require("./vibefunctions.js");
const { updateSharedBreath } = require("./vibefunctions.js");
const { messageSendChannel } = require("./messagefunctions.js");
const { getTextGeneric } = require("./textfunctions.js");
const { getBaseCollar } = require("./getters/collar/getBaseCollar.js");
const { getBaseChastity } = require("./getters/chastity/getBaseChastity.js");
const { getCollar } = require("./getters/collar/getCollar.js");
const { getToys } = require("./getters/toy/getToys.js");
const { getWearable } = require("./getters/wearable/getWearable.js");
const { getChastityBra } = require("./getters/chastity/getChastityBra.js");
const { getChastity } = require("./getters/chastity/getChastity.js");
const { getHeavyList } = require("./getters/heavy/getHeavyList.js");
const { getMitten } = require("./getters/mitten/getMitten.js");
const { getHeadwear } = require("./getters/headwear/getHeadwear.js");
const { getGags } = require("./getters/gag/getGags.js");
const { markForSave } = require("./other/markForSave.js");
const { isWearingCollar } = require("./getters/collar/isWearingCollar.js");
const { setUserVar } = require("./setters/config/setUserVar.js");
const { getRecentChannel } = require("./getters/config/getRecentChannel.js");

// Takes input string, outputs a date object.
const parseTime = (text) => {
	try {
		let t = text.toLowerCase();

		let num = (regex) => {
			const m = t.match(regex);
			return m ? parseInt(m[1], 10) : 0;
		};

		let days = num(/(\d+)\s*d(?:ay|ays)?/);
		let hours = num(/(\d+)\s*h(?:our|rs?)?/);
		let minutes = num(/(\d+)\s*m(?:in|ins?)?/);

		// Create date output
		let dateout = new Date();
		// add days
		dateout.setTime(dateout.getTime() + days * 24 * 60 * 60 * 1000);
		// add hours
		dateout.setTime(dateout.getTime() + hours * 60 * 60 * 1000);
		// add minutes
		dateout.setTime(dateout.getTime() + minutes * 60 * 1000);

		return dateout;
	} catch (err) {
		return new Date();
	}
};

// Takes an input value in ms, outputs a human readable text string
// I had Gemini write this, but code looks sound. 
function parseDuration(ms) {
  if (ms < 0) ms = -ms;
  const time = {
    month: Math.floor(ms / 2592000000),
    week: Math.floor((ms % 2592000000) / 604800000),
    day: Math.floor((ms % 604800000) / 86400000),
    hour: Math.floor((ms % 86400000) / 3600000),
    minute: Math.floor((ms % 3600000) / 60000),
  };

  const parts = [];
  for (const [unit, value] of Object.entries(time)) {
    if (value > 0) {
      parts.push(`${value} ${unit}${value === 1 ? '' : 's'}`);
    }
  }

  return parts.length > 0 ? parts.join(', ') : '0 minutes';
}

// Takes string input, returns an integer with number of ms for the setTimeout function
const calculateTimeout = (text) => {
	try {
		return parseTime(text) - new Date();
	} catch (err) {
		return 0;
	}
};

// I refuse to use proper databases. This is to generate backups.
// This is vibecoded, admittedly, and then adjusted, but the result looks solid.
const getTimestringForZip = () => {
	const d = new Date();

	// Date Components
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const dd = String(d.getDate()).padStart(2, "0");
	const yyyy = d.getFullYear();

	// Time Components
	const hh = String(d.getHours()).padStart(2, "0"); // 24-hour format
	const min = String(d.getMinutes()).padStart(2, "0");

	// Combine
	const formatted = `${mm}-${dd}-${yyyy}-${hh}-${min}`;
	//console.log(formatted); // Example: "01/01/2026-21:05"

	return formatted;
};

const backupsAreAnnoying = () => {
	try {
		let filepath = process.GagbotSavedFileDirectory;
		let dest = path.resolve(filepath, "backups");
		let files = fs.readdirSync(filepath).filter((file) => file.endsWith(".txt"));

        // Blacklist filenames to NOT save. If a file starts with any of these, they will NOT be preserved in the backup. 
        // This is explicitly to prevent retaining sensitive user data or a big crash log file. 
        let blacklistnames = ["recordedmessages.txt", "crashlog.txt"]
        files = files.filter((f) => !blacklistnames.includes(f));

		let zip = new admZip();

		let timestring = getTimestringForZip();

		files.forEach((f) => {
			zip.addLocalFile(path.resolve(filepath, f));
		});

		zip.writeZip(path.resolve(dest, `backup-${timestring}.zip`));

		console.log(`Completed zip .\\backup\\backup-${timestring}.zip`);
	} catch (err) {
		console.log(err);
	}
};

// Take each prop of the process.readytosave and save that file.
// Then reset it.
const saveFiles = () => {
	try {
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		Object.keys(process.readytosave).forEach((k) => {
			let filepath;
			let processvar;
			// Honestly, this could probably just be a similar thing like the processdatatoload at the beginning of index.js
			// but meh. This allows for potential configuration later.
			switch (k) {
				case "wearable":
					filepath = `${process.GagbotSavedFileDirectory}/wearables.txt`;
					processvar = "wearable";
					break;
				case "gags":
					filepath = `${process.GagbotSavedFileDirectory}/gaggedusers.txt`;
					processvar = "gags";
					break;
				case "mitten":
					filepath = `${process.GagbotSavedFileDirectory}/mittenedusers.txt`;
					processvar = "mitten";
					break;
				case "chastity":
					filepath = `${process.GagbotSavedFileDirectory}/chastityusers.txt`;
					processvar = "chastity";
					break;
				case "chastitybra":
					filepath = `${process.GagbotSavedFileDirectory}/chastitybrausers.txt`;
					processvar = "chastitybra";
					break;
				case "arousal":
					filepath = `${process.GagbotSavedFileDirectory}/arousal.txt`;
					processvar = "arousal";
					break;
				case "toys":
					filepath = `${process.GagbotSavedFileDirectory}/toyusers.txt`;
					processvar = "toys";
					break;
				case "collar":
					filepath = `${process.GagbotSavedFileDirectory}/collarusers.txt`;
					processvar = "collar";
					break;
				case "heavy":
					filepath = `${process.GagbotSavedFileDirectory}/heavyusers.txt`;
					processvar = "heavy";
					break;
				case "pronouns":
					filepath = `${process.GagbotSavedFileDirectory}/pronounsusers.txt`;
					processvar = "pronouns";
					break;
				case "usercontext":
					filepath = `${process.GagbotSavedFileDirectory}/usersdata.txt`;
					processvar = "usercontext";
					break;
				case "consented":
					filepath = `${process.GagbotSavedFileDirectory}/consentusers.txt`;
					processvar = "consented";
					break;
				case "corset":
					filepath = `${process.GagbotSavedFileDirectory}/corsetusers.txt`;
					processvar = "corset";
					break;
				case "headwear":
					filepath = `${process.GagbotSavedFileDirectory}/headwearusers.txt`;
					processvar = "headwear";
					break;
				case "discardedKeys":
					filepath = `${process.GagbotSavedFileDirectory}/discardedkeys.txt`;
					processvar = "discardedKeys";
					break;
				case "configs":
					filepath = `${process.GagbotSavedFileDirectory}/configs.txt`;
					processvar = "configs";
					break;
				case "outfits":
					filepath = `${process.GagbotSavedFileDirectory}/outfits.txt`;
					processvar = "outfits";
					break;
				case "dolls":
					filepath = `${process.GagbotSavedFileDirectory}/dollusers.txt`;
					processvar = "dolls";
					break;
				case "webhooks":
					filepath = `${process.GagbotSavedFileDirectory}/webhooks.txt`;
					processvar = "webhookstoload";
					break;
                case "recordedmessages":
					filepath = `${process.GagbotSavedFileDirectory}/recordedmessages.txt`;
					processvar = "recordedmessages";
					break;
                case "delveuserdata":
					filepath = `${process.GagbotSavedFileDirectory}/delveuserdata.txt`;
					processvar = "delveuserdata";
					break;
                case "userstats":
					filepath = `${process.GagbotSavedFileDirectory}/userstats.txt`;
					processvar = "userstats";
					break;
                case "memberavatars":
					filepath = `${process.GagbotSavedFileDirectory}/memberavatars.txt`;
					processvar = "memberavatars";
					break;
                case "heldkeytimers":
					filepath = `${process.GagbotSavedFileDirectory}/heldkeytimers.txt`;
					processvar = "heldkeytimers";
					break;
				default:
					console.log(`Unknown save variable: ${k}`);
			}
			if (filepath && processvar) {
				fs.writeFileSync(filepath, JSON.stringify(process[processvar]));
				console.log(`${(new Date()).toLocaleTimeString()}: Successfully Saved file ${filepath}`);
			}
		});
		process.readytosave = {};
	} catch (err) {
		console.log(err);
	}
};

// Assigns each function to a process variable for reference later.
// We need to refactor this further sometime into a singular "event" space under process, but this will do for now
function importFileNames() {
    let functionspaces = [
        //{ processvar: "eventfunctions", functionvar: "functiontick" },
        { processvar: "msgfunctions", functionvar: "msgfunction" },
        { processvar: "modalfunctions", functionvar: "modal" },
        { processvar: "modalexecutefunctions", functionvar: "modalexecute" },
        { processvar: "onremovefunctions", functionvar: "functiononremove" },
        { processvar: "extraconfigfunctions", functionvar: "extraconfig" },
        { processvar: "extraconfigresponsefunctions", functionvar: "extraconfigresponse" },
        { processvar: "headpatfunctions", functionvar: "headpatfunction" },
    ]
    for (let i = 0; i < functionspaces.length; i++) {
        process[functionspaces[i].processvar] = {};
    }
	let eventfunctionsfolders = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions"));
	eventfunctionsfolders.forEach((f) => {
        for (let i = 0; i < functionspaces.length; i++) {
            process[functionspaces[i].processvar][f] = {};
        }
		let eventfunctionsfiles = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions", f));
		eventfunctionsfiles.forEach((file) => {
			let functionfile = require(path.resolve(__dirname, "..", "eventfunctions", f, file));
            for (let i = 0; i < functionspaces.length; i++) {
                if (typeof functionfile[functionspaces[i].functionvar] === "function") {
                    process[functionspaces[i].processvar][f][file.replace(".js", "")] = functionfile[functionspaces[i].functionvar];
                }
            }
		});
	});
}

function processTimedEvents() {
	updateArousalValues();
    updateSharedBreath();
	processUnlockTimes(process.client);
    runTickEvents();
    checkFumbledTemporaryKeys();
    checkGagbotKeys();
    endComboReacts();
}

function processUnlockTimes(client) {
	let now = Date.now();
	if (process.chastity) {
		Object.keys(process.chastity).forEach((server) => {
			Object.keys(process.chastity[server]).forEach((person) => {
                if (process.chastity[server][person]?.unlockTime < now) {
                    unlockTimelockChastity(server, client, person);
                }
            })
		});
	}
	if (process.chastitybra) {
		Object.keys(process.chastitybra).forEach((server) => {
			Object.keys(process.chastitybra[server]).forEach((person) => {
                if (process.chastitybra[server][person]?.unlockTime < now) {
                    unlockTimelockChastityBra(server, client, person);
                }
            })
		});
	}
	if (process.collar) {
		Object.keys(process.collar).forEach((server) => {
            Object.keys(process.collar[server]).forEach((person) => {
                if (process.collar[server][person]?.unlockTime < now) {
                    unlockTimelockCollar(server, client, person);
                }
            })
		});
	}
}

function runTickEvents() {
    if (process.eventfunctions == undefined) { return }
	// Gags
	if (process.gags) {
		Object.keys(process.gags).forEach((serverid) => {
			Object.keys(process.gags[serverid]).forEach((userid) => {
                try {
                    getGags(serverid, userid).forEach((g) => {
                        if (process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype] && process.eventfunctions.gags[g.gagtype].tick) {
                            process.eventfunctions.gags[g.gagtype].tick(serverid, userid);
                        }
                    });
                }
                catch (err) {
                    console.log(err);
                }
		    });
        });
	}
	// Headwear
	if (process.headwear) {
		Object.keys(process.headwear).forEach((serverid) => {
            Object.keys(process.headwear[serverid]).forEach((userid) => {
                getHeadwear(serverid, userid).forEach((h) => {
                    if (process.eventfunctions.headwear && process.eventfunctions.headwear[h] && process.eventfunctions.headwear[h].tick) {
                        process.eventfunctions.headwear[h].tick(serverid, userid);
                    }
                });
            });
		});
	}
	// Mittens
	if (process.mitten) {
		Object.keys(process.mitten).forEach((serverid) => {
            Object.keys(process.mitten[serverid]).forEach((userid) => {
                if (getMitten(serverid, userid)) {
                    if (process.eventfunctions.mitten && process.eventfunctions.mitten[getMitten(serverid, userid).mittenname] && process.eventfunctions.mitten[getMitten(serverid, userid).mittenname].tick) {
                        process.eventfunctions.mitten[getMitten(serverid, userid).mittenname].tick(serverid, userid);
                    }
                }
            });
		});
	}
	// Heavy Bondage
	if (process.heavy) {
		Object.keys(process.heavy).forEach((serverid) => {
            Object.keys(process.heavy[serverid]).forEach((userid) => {
                if (getHeavyList(serverid, userid).length > 0) {
                    getHeavyList(serverid, userid).forEach((h) => {
                        if (process.eventfunctions.heavy && process.eventfunctions.heavy[h.type] && process.eventfunctions.heavy[h.type].tick) {
                            process.eventfunctions.heavy[h.type].tick(serverid, userid);
                        }
                    })
                }
            });
        });
	}
    // Chastity Belts
	if (process.chastity) {
		Object.keys(process.chastity).forEach((serverid) => {
            Object.keys(process.chastity[serverid]).forEach((userid) => {
                if (getChastity(serverid, userid)) {
                    if (process.eventfunctions.chastity && process.eventfunctions.chastity[getChastity(serverid, userid).chastitytype] && process.eventfunctions.chastity[getChastity(serverid, userid).chastitytype].tick) {
                        process.eventfunctions.chastity[getChastity(serverid, userid).chastitytype].tick(serverid, userid);
                    }
                }
            });
        });
	}
    // Chastity Bras
	if (process.chastitybra) {
		Object.keys(process.chastitybra).forEach((serverid) => {
            Object.keys(process.chastitybra[serverid]).forEach((userid) => {
                if (getChastityBra(serverid, userid)) {
                    if (process.eventfunctions.chastitybra && process.eventfunctions.chastitybra[getChastityBra(serverid, userid).chastitytype] && process.eventfunctions.chastitybra[getChastityBra(serverid, userid).chastitytype].tick) {
                        process.eventfunctions.chastitybra[getChastityBra(serverid, userid).chastitytype].tick(serverid, userid);
                    }
                }
            });
        });
	}
	// Wearables
	if (process.wearable) {
		Object.keys(process.wearable).forEach((serverid) => {
            Object.keys(process.wearable[serverid]).forEach((userid) => {
                getWearable(serverid, userid).forEach((h) => {
                    if (process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h].tick) {
                        process.eventfunctions.wearable[h].tick(serverid, userid);
                    }
                });
            });
        });
	}
    // Toys
    if (process.toys) {
		Object.keys(process.toys).forEach((serverid) => {
            Object.keys(process.toys[serverid]).forEach((userid) => {
                getToys(serverid, userid).forEach((h) => {
                    if (process.eventfunctions.toys && process.eventfunctions.toys[h.type] && process.eventfunctions.toys[h.type].tick) {
                        process.eventfunctions.toys[h.type].tick(serverid, userid);
                    }
                });
            });
        });
	}
    // Collars
    if (process.collar) {
		Object.keys(process.collar).forEach((serverid) => {
            Object.keys(process.collar[serverid]).forEach((userid) => {
                if (getCollar(serverid, userid)) {
                    if (process.eventfunctions.collar && process.eventfunctions.collar[getCollar(serverid, userid).collartype] && process.eventfunctions.collar[getCollar(serverid, userid).collartype].tick) {
                        process.eventfunctions.collar[getCollar(serverid, userid).collartype].tick(serverid, userid);
                    }
                    if (getCollar(serverid, userid).additionalcollars) {
                        getCollar(serverid, userid).additionalcollars.forEach((ac) => {
                            if (process.eventfunctions.collar && process.eventfunctions.collar[ac] && process.eventfunctions.collar[ac].tick) {
                                process.eventfunctions.collar[ac].tick(serverid, userid);
                            }
                        })
                    }
                }
            });
        });
	}
}

function checkFumbledTemporaryKeys() {
    let processvars = ["collar", "chastity", "chastitybra"];
    processvars.forEach((pv) => {
        if (process[pv] == undefined) { process[pv] = {} }
        Object.keys(process[pv]).forEach((server) => {
            Object.entries(process[pv][server]).forEach(async (en) => {
                try {
                    if (en[1]?.fumbled && en[1]?.temporarykeyholdertime && (en[1]?.temporarykeyholdertime < Date.now())) {
                        let data = {
                            interactionuser: { id: en[1].temporarykeyholder },
                            targetuser: { id: en[0] }
                        }

                        delete en[1].fumbled;
                        delete en[1].temporarykeyholdertime;
                        delete en[1].temporarykeyholder;

                        if ((pv == "chastity") || (pv == "chastitybra")) {
                            let def = (pv == "chastity") ? "belt" : "bra"
                            data.c1 = getBaseChastity(en[1].chastitytype ?? `${def}_silver`).name
                        }
                        else if (pv == "collar") {
                            data.c1 = getBaseCollar(en[1].collartype ?? `collar_leather`).name
                        }

                        // Now that @___ has had her fun, she returns the keys for @___'s chastity belt. 
                        if (getRecentChannel(server, en[0]).valid) {
                            messageSendChannel(getTextGeneric(`returnkeysfromfumble`, data), getRecentChannel(server, en[0]).channelid)
                        }
                        else if (getRecentChannel(server, data.interactionuser.id).valid) {
                            messageSendChannel(getTextGeneric(`returnkeysfromfumble`, data), getRecentChannel(serverID, data.interactionuser.id).channelid)
                        }
                        else {
                            console.log("No suitable channel found for returning temp key.")
                        }
                        
                        markForSave("collar");
                        markForSave("chastity");
                        markForSave("chastitybra");
                    }
                }
                catch (err) {
                    console.log(err)
                }
            })
        })
    })
}

// Checks each user ID in process variables against all of the guild member maps
// If the user does NOT exist in any of them, then remove. 
async function scavengeUsers(client) {
    let processvars = ["wearable", "gags", "mitten", "chastity", "chastitybra", "chastitybra", "arousal", "toys", "collar", "heavy", "pronouns", "usercontext", "consented", "corset", "headwear", "outfits"]
    await client.guilds.fetch();
    processvars.forEach(async (v) => {
        if (process[v] == undefined) { process[v] = {} }
        Object.keys(process[v]).forEach(async (server) => {
            if (process.client.guilds.cache.has(server)) {
                let guildfetched = await client.guilds.fetch(server)
                Object.keys(process[v][server]).forEach(async (person) => {
                    if (guildfetched) {
                        try {
                            if (!(await guildfetched.members.fetch(person))) {
                                delete process[v][server][person] // This person did NOT fetch successfully, so get rid of them. 
                            }
                        }
                        catch (err) {
                            console.log(`Crashed while fetching ${person} lol`);
                            console.log(err);
                        }
                    } 
                    else {
                        console.log(`Guild doesn't exist!`)
                    }
                })
            }
        })
    })
}

// Clear any expired reaction combos with a message to the user's recent channel. 
// Intended to do a 
async function endComboReacts() {
    if (process.reactions == undefined) { process.reactions = {} };
    Object.keys(process.reactions).forEach((guild) => {
        Object.keys(process.reactions[guild]).forEach((user) => {
            if (process.reactions[guild][user] && (process.reactions[guild][user].comboend < Date.now())) {
                if ((getRecentChannel(guild, user).valid) && isWearingCollar(guild, user, "collarbell")) {
                    let counttojangle = Math.min(process.reactions[guild][user].count, 3) // up to 3 jangles!
                    let data = {
                        serverID: guild,
                        interactionuser: { id: user },
                        targetuser: { id: user }
                    }
                    messageSendChannel(getTextGeneric(`bellcollar_${counttojangle}`, data), getRecentChannel(guild, user).channelid);
                    setUserVar(guild, user, "reactbellcooldown", (Date.now() + 60000))
                }
                delete process.reactions[guild][user];
            }
        })
    })
}

// Cull any message older than a day. 
async function removeOldMessages() {
    Object.keys(process.recordedmessages).forEach((k) => {
        if (process.recordedmessages && process.recordedmessages[k] && ((process.recordedmessages[k].createdTimestamp + 86400000) < Date.now())) {
            delete process.recordedmessages[k];
        } 
    })
}

exports.parseTime = parseTime;
exports.parseDuration = parseDuration;
exports.calculateTimeout = calculateTimeout;
exports.getTimestringForZip = getTimestringForZip;
exports.backupsAreAnnoying = backupsAreAnnoying;
exports.saveFiles = saveFiles;
exports.importFileNames = importFileNames;
exports.scavengeUsers = scavengeUsers;

exports.processUnlockTimes = processUnlockTimes;
exports.processTimedEvents = processTimedEvents;
exports.removeOldMessages = removeOldMessages;