// We were originally going to install Moment, but frankly, since I just need to try to do a basic time parse, we're going to write our own.
let fs = require("fs");
let path = require("path");
let admZip = require("adm-zip");
const { unlockTimelockChastity, unlockTimelockChastityBra, unlockTimelockCollar } = require(`./timelockfunctions.js`);
const { updateArousalValues } = require("./vibefunctions.js");
const { getGags, getMitten } = require("./gagfunctions.js");
const { getHeadwear } = require("./headwearfunctions.js");
const { getHeavy } = require("./heavyfunctions.js");
const { getWearable } = require("./wearablefunctions.js");
const { getToys } = require("./toyfunctions.js");
const { getCollar } = require("./collarfunctions.js");
const { updateSharedBreath } = require("./vibefunctions.js");

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
		console.log(process.readytosave);
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
				default:
					console.log(`Unknown save variable: ${k}`);
			}
			if (filepath && processvar) {
				fs.writeFileSync(filepath, JSON.stringify(process[processvar]));
				console.log(`----> Successfully Saved file ${filepath}`);
			}
		});
		process.readytosave = {};
	} catch (err) {
		console.log(err);
	}
};

// Assigns each function to a process variable for reference later.
function importFileNames() {
	process.eventfunctions = {};
    process.msgfunctions = {};
    process.modalfunctions = {};
    process.modalexecutefunctions = {};
	let eventfunctionsfolders = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions"));
	eventfunctionsfolders.forEach((f) => {
		process.eventfunctions[f] = {};
        process.msgfunctions[f] = {};
        process.modalfunctions[f] = {};
        process.modalexecutefunctions[f] = {};
		let eventfunctionsfiles = fs.readdirSync(path.resolve(__dirname, "..", "eventfunctions", f));
		eventfunctionsfiles.forEach((file) => {
			let functionfile = require(path.resolve(__dirname, "..", "eventfunctions", f, file));
			if (typeof functionfile.functiontick === "function") {
				process.eventfunctions[f][file.replace(".js", "")] = functionfile.functiontick;
			}
            if (typeof functionfile.msgfunction === "function") {
                process.msgfunctions[f][file.replace(".js", "")] = functionfile.msgfunction;
            }
            if (typeof functionfile.modal === "function") {
                process.modalfunctions[f][file.replace(".js", "")] = functionfile.modal;
            }
            if (typeof functionfile.modalexecute === "function") {
                process.modalexecutefunctions[f][file.replace(".js", "")] = functionfile.modalexecute;
            }
		});
	});
}

function processTimedEvents() {
	updateArousalValues();
    updateSharedBreath();
	processUnlockTimes(process.client);
	runProcessedEvents();
}

function processUnlockTimes(client) {
	let now = Date.now();
	if (process.chastity) {
		Object.keys(process.chastity).forEach((person) => {
			if (process.chastity[person]?.unlockTime < now) {
				unlockTimelockChastity(client, person);
			}
		});
	}
	if (process.chastitybra) {
		Object.keys(process.chastitybra).forEach((person) => {
			if (process.chastitybra[person]?.unlockTime < now) {
				unlockTimelockChastityBra(client, person);
			}
		});
	}
	if (process.collar) {
		Object.keys(process.collar).forEach((person) => {
			if (process.collar[person]?.unlockTime < now) {
				unlockTimelockCollar(client, person);
			}
		});
	}
}

function runProcessedEvents() {
	// Gags
	if (process.gags) {
		Object.keys(process.gags).forEach((userid) => {
			getGags(userid).forEach((g) => {
				if (process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype]) {
					process.eventfunctions.gags[g.gagtype](userid);
				}
			});
		});
	}
	// Headwear
	if (process.headwear) {
		Object.keys(process.headwear).forEach((userid) => {
			getHeadwear(userid).forEach((h) => {
				if (process.eventfunctions.headwear && process.eventfunctions.headwear[h]) {
					process.eventfunctions.headwear[h](userid);
				}
			});
		});
	}
	// Mittens
	if (process.mitten) {
		Object.keys(process.mitten).forEach((userid) => {
			if (getMitten(userid)) {
				if (process.eventfunctions.mitten && process.eventfunctions.mitten[getMitten(userid).mittenname]) {
					process.eventfunctions.mitten[getMitten(userid).mittenname](userid);
				}
			}
		});
	}
	// Heavy Bondage
	if (process.heavy) {
		Object.keys(process.heavy).forEach((userid) => {
			if (getHeavy(userid)) {
				if (process.eventfunctions.heavy && process.eventfunctions.heavy[getHeavy(userid).typeval]) {
					process.eventfunctions.heavy[getHeavy(userid).typeval](userid);
				}
			}
		});
	}
	// Wearables
	if (process.wearable) {
		Object.keys(process.wearable).forEach((userid) => {
			getWearable(userid).forEach((h) => {
				if (process.eventfunctions.wearable && process.eventfunctions.wearable[h]) {
					process.eventfunctions.wearable[h](userid);
				}
			});
		});
	}
    // Toys
    if (process.toys) {
		Object.keys(process.toys).forEach((userid) => {
			getToys(userid).forEach((h) => {
				if (process.eventfunctions.toys && process.eventfunctions.toys[h.type]) {
					process.eventfunctions.toys[h.type](userid);
				}
			});
		});
	}
    // Collars
    if (process.collar) {
		Object.keys(process.collar).forEach((userid) => {
			if (getCollar(userid)) {
                if (process.eventfunctions.collar && process.eventfunctions.collar[getCollar(userid).collartype]) {
					process.eventfunctions.collar[getCollar(userid).collartype](userid);
				}
            }
		});
	}
}

// Checks each user ID in process variables against all of the guild member maps
// If the user does NOT exist in any of them, then remove. 
async function scavengeUsers(client) {
    let processvars = ["wearable", "gags", "mitten", "chastity", "chastitybra", "chastitybra", "arousal", "toys", "collar", "heavy", "pronouns", "usercontext", "consented", "corset", "headwear", "outfits"]
    let allguilds = await client.guilds.fetch();
    let allguildslist = []; // array of guild member maps
    for (const guild of allguilds) {
        let guildfetched = await client.guilds.fetch(guild[0])
        let guildmembers = await guildfetched.members.fetch()
        allguildslist.push(guildmembers);
    }
    processvars.forEach(async (v) => {
        if (process[v]) {
            Object.keys(process[v]).forEach((k) => {
                let found = false;
                allguildslist.forEach((g) => {
                    if (g.get(k)) { found = true }
                })
                if (!found) {
                    // DELETE THIS
                    console.log(`Key ${k} missing from all guilds, run on ${v}.`)
                    if (process[v][k]) {
                        delete process[v][k]
                    }
                }
            })
        }
    })
}

exports.parseTime = parseTime;
exports.calculateTimeout = calculateTimeout;
exports.getTimestringForZip = getTimestringForZip;
exports.backupsAreAnnoying = backupsAreAnnoying;
exports.saveFiles = saveFiles;
exports.importFileNames = importFileNames;
exports.scavengeUsers = scavengeUsers;

exports.processUnlockTimes = processUnlockTimes;
exports.processTimedEvents = processTimedEvents;
