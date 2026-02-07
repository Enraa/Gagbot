const fs = require("fs");
const path = require("path");
const https = require("https");
const { messageSend, messageSendImg, messageSendChannel, runMessageEvents } = require(`./../functions/messagefunctions.js`);
const { getCorset, corsetLimitWords, silenceMessage } = require(`./../functions/corsetfunctions.js`);
const { stutterText, getArousedTexts } = require(`./../functions/vibefunctions.js`);
const { getVibeEquivalent } = require("./vibefunctions.js");
const { getHeadwearRestrictions, processHeadwearEmoji, getHeadwearName, getHeadwear, DOLLVISORS } = require("./headwearfunctions.js");
const { getOption } = require(`./../functions/configfunctions.js`);
const { getText } = require(`./../functions/textfunctions.js`);
const { DOLLMAXPUNISHMENT, textGarbleDOLL } = require(`./../functions/dollfunctions.js`);
const { splitMessage } = require(`./../functions/messagefunctions.js`);
const { assignHeavy } = require(`./../functions/heavyfunctions.js`);
const { MessageAST } = require(`./../functions/message_ast.js`);

// Grab all the command files from the commands directory
const gagtypes = [];
const commandsPath = path.join(__dirname, "..", "gags");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
const SKIPREGEX = /^((<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\s|\n)+$/

// Push the gag name over to the choice array.
for (const file of commandFiles) {
	const gag = require(`./../gags/${file}`);
	gagtypes.push({ name: gag.choicename, value: file.replace(".js", "") });
}

const setUpGags = () => {
	// Grab all the command files from the commands directory
	const gagautocompletes = [];
    const gagtypes = [];
	const commandsPath = path.join(__dirname, "..", "gags");
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

	// Push the gag name over to the choice array.
	for (const file of commandFiles) {
		const gag = require(`./../gags/${file}`);
        gagtypes[file.replace(".js", "")] = gag;
        if (!gag.hidden) { gagautocompletes.push({ name: gag.choicename, value: file.replace(".js", "") }) };
	}

	process.gagtypes = gagtypes;
    if (process.autocompletes == undefined) { process.autocompletes = {} }
    process.autocompletes.gag = gagautocompletes;
};

// This should probably be better maintained with automation
// Only used for the /list command.
const gagtypesout = [{ name: "Ball Gag" }, { name: "Bast Gag" }, { name: "Bweh Gag" }, { name: "Cat Gag" }, { name: "Code Gag" }, { name: "Enchanted Dog Gag" }, { name: "Donald Gag" }, { name: "Good Sub Gag" }, { name: "Polite Sub Gag" }, { name: "Ring Gag" }, { name: "Silent Panel Gag" }, { name: "Stuff Gag" }, { name: "Tape Gag" }, { name: "UwU Gag" }, { name: "Enchanted Wolf Gag" }, { name: "L337 Gag" }, { name: "Enigma Gag" }];

const mittentypes = [
	{ name: "Kitty Paws", value: "mittens_kitty" },
	{ name: "Oversized Fluffy Paw Mittens", value: "mittens_oversized_fluff" },
	{ name: "Pom Pom Mittens", value: "mittens_pompom" },
	{ name: "Cyber Doll Mittens", value: "mittens_cyberdoll" },
	{ name: "Leather Mittens", value: "mittens_leather", tags: ["leather"] },
	{ name: "Hardlight Spheres", value: "mittens_hardlight" },
	{ name: "Latex Mittens", value: "mittens_latex", tags: ["latex"] },
	{ name: "Taped Fists", value: "mittens_tape" },
	{ name: "Good Maid Mittens", value: "mittens_maid" },
    { name: "Steel Ball Fists", value: "mittens_steelball", tags: ["metal"] }
];

function loadMittenTypes() {
    if (process.autocompletes == undefined) { process.autocompletes = {} }
    process.autocompletes.mitten = mittentypes.map((m) => {
        return { name: m.name, value: m.value }
    })
}

const convertGagText = (type) => {
	let convertgagarr;
	for (let i = 0; i < gagtypes.length; i++) {
		if (convertgagarr == undefined) {
			convertgagarr = {};
		}
		convertgagarr[gagtypes[i].value] = gagtypes[i].name;
	}
	return convertgagarr[type];
};

/*const assignGag = (userID, gagtype = "ball", intensity = 5, origbinder) => {
    if (process.gags == undefined) { process.gags = {} }
    let originalbinder = process.gags[userID]?.origbinder
    process.gags[userID] = {
        gagtype: gagtype,
        intensity: intensity,
        origbinder: originalbinder ?? origbinder // Preserve original binder until it is removed. 
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.gags = true;
}*/

const assignGag = (userID, gagtype = "ball", intensity = 5, origbinder) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		process.gags[userID] = [];
	}
	// Retrieve the index if it is already on the wearer.
	let foundgag = process.gags[userID].findIndex((s) => s.gagtype == gagtype);
	let originalbinder = origbinder;
	if (foundgag > -1) {
		originalbinder = process.gags[userID][foundgag].origbinder;
		process.gags[userID].splice(foundgag, 1);
	}
	process.gags[userID].push({ gagtype: gagtype, intensity: intensity, origbinder: originalbinder });
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.gags = true;
};

// to ensure compatibility with existing code, this will retrieve the first gag
// in the list, if not called with an extra param for specific gag.
const getGag = (userID, gagbyname) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		process.gags[userID] = [];
	}
	if (gagbyname) {
		let foundgag = process.gags[userID].find((s) => s.gagtype == gagbyname);
		return foundgag?.gagtype;
	} else if (process.gags[userID].length > 0) {
		return process.gags[userID][0].gagtype;
	}
	return undefined;
};

const getGags = (userID) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	return process.gags[userID] ?? [];
};

const getGagLast = (userID) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] == undefined) {
		process.gags[userID] = [];
	}

	if (process.gags[userID].length > 0) {
		return process.gags[userID][process.gags[userID].length - 1].gagtype;
	} else {
		return undefined;
	}
};

const getGagBinder = (userID) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	return process.gags[userID]?.origbinder;
};

const getGagIntensity = (userID) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[userID] && process.gags[userID].length > 0) {
		return process.gags[userID][0].intensity;
	} else {
		return undefined;
	}
};

const deleteGag = (userID, specificgag) => {
	if (process.gags == undefined) {
		process.gags = {};
	}
	// Remove all gags if none is specified.
	if (!specificgag && process.gags[userID]) {
		delete process.gags[userID];
	} else if (process.gags[userID]) {
		let loc = process.gags[userID].findIndex((f) => f.gagtype == specificgag);
		if (loc > -1) {
			process.gags[userID].splice(loc, 1);
		}
		if (process.gags[userID].length == 0) {
			delete process.gags[userID];
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.gags = true;
};

const assignMitten = (userID, mittentype, origbinder) => {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	let originalbinder = process.mitten[userID]?.origbinder;
	process.mitten[userID] = {
		mittenname: mittentype,
		origbinder: originalbinder ?? origbinder, // Preserve original binder until it is removed.
	};
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.mitten = true;
};

const getMitten = (userID) => {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	return process.mitten[userID];
};

const getMittenBinder = (userID) => {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	return process.mitten[userID]?.origbinder;
};

const deleteMitten = (userID) => {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	delete process.mitten[userID];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.mitten = true;
};

const getMittenName = (userID, mittenname) => {
	if (process.mitten == undefined) {
		process.mitten = {};
	}
	let convertmittenarr = {};
	for (let i = 0; i < mittentypes.length; i++) {
		convertmittenarr[mittentypes[i].value] = mittentypes[i].name;
	}
	if (mittenname) {
		return convertmittenarr[mittenname];
	} else if (process.mitten[userID]?.mittenname) {
		return convertmittenarr[process.mitten[userID]?.mittenname];
	} else {
		return undefined;
	}
};

function getBaseMitten(type) {
    return mittentypes.find((m) => m.value == type)
}

/**********************************************
 * Punishes a doll.
 * @param userID - The user's discord ID number
 * @param amount - How many violations?
 **********************************************/
function punishDoll(userID, amount) {
	if (process.dolls == undefined) {
		process.dolls = {};
	}
	let doll = process.dolls[userID];
	if (doll) {
		doll.violations += amount;
		doll.goodDollStreak = 0; // BAD DOLL

		console.log("BAD DOLL:");
		console.log(process.dolls[userID]);
		// Compute punishments by dividing violations by punishThresh.
		let punishThresh = getOption(userID, "dollpunishthresh");
        if (getHeadwear(userID).find((headwear) => headwear === "dollmaker_visor")) {
            punishThresh = 2; // Forced to 2 if dollmakers visor
        }
		let punishments = Math.floor(doll.violations / punishThresh);
		// Remove punishments from violation score.
		doll.violations = doll.violations % punishThresh;

		let origPunishLevel = doll.punishmentLevel;
		if (punishments > 0) {
			doll.punishmentLevel += punishments;
		}

		// TODO: Set a max on punishment level.
		doll.punishmentLevel = Math.min(doll.punishmentLevel, DOLLMAXPUNISHMENT);

		let skipped = doll.punishmentLevel - origPunishLevel > 1 ? true : false;
		// Punish the doll according to punishment level.
		if (punishments > 0) {
			switch (doll.punishmentLevel) {
				case 0:
					// Do nothing.
					break;
				case 1:
					// Gag the Doll
					assignGag(userID, "ball", 4);
					break;
				case 2:
					// Gag and Mitten the Doll
					assignGag(userID, "ball", 6);
					assignMitten(userID, "mittens_cyberdoll");
					break;
				// Drop through to highest punishment.
				default:
				case 3:
					// Gag, Mittens, Heavy
					assignGag(userID, "ball", 8);
					assignMitten(userID, "mittens_cyberdoll");
					assignHeavy(userID, "hardlight_looselink");
					break;
			}
		}

		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.dolls = true;
		return { punish: punishments > 0 ? true : false, punishmentLevel: doll.punishmentLevel, skipped: skipped };
	}
}

const modifymessage = async (msg, threadId) => {
	try {
		console.log(`${msg.channel.guild.name} - ${msg.member.displayName}: ${msg.content}`);

		// TODO - remove this var
		let outtext = ``											// Message to send.
		let msgTree = new MessageAST(msg.content);					// Build AST from message
		let msgTreeMods = {"modified":false, "emojiModified":false, "corseted":false}	// Store a boolean in an object to allow pass by reference.

		processHeadwearEmoji(msg.author.id, msgTree, msgTreeMods, getOption(msg.author.id, "dollvisorname"))

		// See if this message can be skipped. Messages containing only emoji do NOT need to be processed,
		// But only if NOT wearing a headwear that replaces it in previous step.
		if (!msgTreeMods.modified && msg.content.match(SKIPREGEX)) return;

		textGarbleVibrator(msg, msgTree, msgTreeMods);				// Handle arousal effects (Stutter, gasps.)
		textGarbleCorset(msg, msgTree, msgTreeMods, threadId);		// Handle corset.
		if (msgTreeMods.corseted) {return;}							// Abort if the message got corseted - message handled elsewhere.
		msgTree.rebuild(msgTree.toString())							// Update AST to account for control char-wrapped moans.
		textGarbleGag(msg, msgTree, msgTreeMods);					// Text garbling due to Gag

		// Convert the AST back to a string.
		outtext = msgTree.toString()

		// Text garbling due to Doll visors
		// TODO - Migrate to the AST system.
		let dolltreturned = await textGarbleDOLL(msg, msgTreeMods.modified, outtext);
		msgTreeMods.modified = dolltreturned.modifiedmessage;
		outtext = dolltreturned.outtext;
		let dollIDDisplay = dolltreturned.dollIDDisplay;
		let dollProtocol = dolltreturned.dollProtocolViolations;

		// Scrub all control characters used to delineate text.
		outtext = outtext.replaceAll(/[]/g, "");

        // Iterate through any speech events in process.msgfunctions
        runMessageEvents({ msg: msg, msgcontent: msg.content, outtext: outtext })

		// Finally, send it if we modified the message.
		if (msgTreeMods.modified) {
            // If the message content is *exactly* the same as the input, return
            if (msg.content === outtext) { return }
			await sendTheMessage(msg, outtext, dollIDDisplay, threadId, dollProtocol, msgTreeMods.emojiModified );
		}
	} catch (err) {
		console.log(err);
	}
};

function handleLinkExceptions(messagein) {
	//Weird exception for links
	let messageparts = messagein;
	for (let i = 0; i < messageparts.length - 1; i++) {
		let current = messageparts[i];
		let next = messageparts[i + 1];
		if (current.text.startsWith("http://") || current.text.startsWith("https://")) {
			messageparts[i].text += next.text;
			messageparts.splice(i + 1, 1);
			messageparts[i].garble = false;
		}
	}
	return messageparts;
}



const replaceStutter = (text, parent, msg, msgModified, intensity, arousedtexts) => {
	try {
		let garbledtext = stutterText(msg, text, intensity, arousedtexts);
		if (garbledtext.stuttered) {
			msgModified.modified = true;
			return garbledtext.text;
		}
		return
	}
	catch (err) {
		console.log(err);
	}
	
}

function textGarbleVibrator(msg, msgTree, msgModified) {
	const intensity = getVibeEquivalent(msg.author.id);
	if (intensity) {
		const arousedtexts = getArousedTexts(msg.author.id);
		msgTree.callFunc(replaceStutter, true, "rawText",[msg, msgModified, intensity, arousedtexts])
	}
}

function textGarbleCorset(msg, msgTree, msgModified, threadId) {
	// Now corset any words, using an amount to start with.
	let corset = getCorset(msg.author.id)
	if (corset) {

		const hadParts = msgTree.toString() != ""
		msgTree.callFunc(corsetLimitWords, true, "rawText", [msg.author.id, msgModified])

		if (hadParts && msgTree.toString() == "") {
			messageSend(msg, silenceMessage(), msg.member.displayAvatarURL(), msg.member.displayName, threadId, msgModified.modified).then(() => msg.delete());
			msgModified.corseted = true;
			return;
		}
		// Subscript ALL if corset tightness >= 7
		if(corset.tightness >= 7){
			msgModified.modified = true;
			msgTree.subscript()
		}
	}
	return;
}

function textGarbleGag(msg, msgTree, msgTreeMods) {
	// Gags now
	if (process.gags == undefined) {
		process.gags = {};
	}
	if (process.gags[msg.author.id] && process.gags[msg.author.id].length > 0) {
        // Go over each gag and if there's a gag file loaded for it, run the messagebegin, garbletext and messageend functions if they exist.
		process.gags[msg.author.id].forEach((gag) => {
            if (process.gagtypes && process.gagtypes[gag.gagtype]) {
                if (process.gagtypes[gag.gagtype].messagebegin) {
                    let out = process.gagtypes[gag.gagtype].messagebegin(msg, msgTree, msgTreeMods, gag.intensity ?? 5);
					if (typeof out == "string") {
						msgTree.rebuild(`${out}${msgTree.toString()}`)
						msgTreeMods.modified = true;
					} else {
						// Do further changes here I guess if necessary.
						//msgparts = out.msgparts;
					}
                }
                if(process.gagtypes[gag.gagtype].garbleText){
					msgTree.callFunc(process.gagtypes[gag.gagtype].garbleText,true,"rawText",[gag.intensity ?? 5])		// Run garble on all IC segments.
					msgTreeMods.modified = true;
				}
                if (process.gagtypes[gag.gagtype].messageend) {												// Run messageEnd
					msgTree.rebuild(`${msgTree.toString()}${process.gagtypes[gag.gagtype].messageend(msg, gag.intensity ?? 5)}`)
					msgTreeMods.modified = true;
				}
            }
		});
	}
}

async function sendTheMessage(msg, outtext, dollIDDisplay, threadID, dollProtocol, modified) {
	try {
		// If this is a reply, we want to create a reply in-line because webhooks can't reply.
		if (msg.type == "19") {
			const replied = await msg.fetchReference();
			const replyauthorobject = await replied.guild.members.search({ query: replied.author.displayName, limit: 1 });
			const first = replyauthorobject.first();
			if (first) {
				outtext = `<@${first.id}> ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`;
			} else {
				outtext = `${replied.author.displayName} ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`;
			}
		}

		// Truncate the text if it's too long
		if (outtext.length > 1999) {
			outtext = outtext.slice(0, 1999); // Seriously, STOP POSTING LONG MESSAGES
		}

		// Determine if an attachment was posted in the original message.
		if (msg.attachments.size > 0) {
			console.log(`IT HAS IMAGES LOL`);
			let attachments = [];
			let promisearr = [];
			for (let attach of msg.attachments) {
				console.log(attach[1]);
				promisearr.push(
					new Promise((res, rej) => {
						// Download it, as a promise, and then Promise.all to grab all of the files once they've all finished.
						// Doing it this way lets us multithread from the CDN and do it faster.
						if (!fs.existsSync(`./downloaded`)) {
							fs.mkdirSync(`./downloaded`, { recursive: true });
						}
						fs.mkdirSync(`./downloaded`, { recursive: true });
						const file = fs.createWriteStream(`./downloaded/${attach[1].name}`);
						https
							.get(attach[1].url, (response) => {
								response.pipe(file);
								file.on("finish", async () => {
									file.close();
									console.log(`Downloaded file: ./downloaded/${attach[1].name}`);
									//attachments.push({ name: attach[1].name, spoiler: attach[1].spoiler });
									res({ name: attach[1].name, spoiler: attach[1].spoiler });
								});
							})
							.on("error", (err) => {
								console.log(err);
								rej(false);
							});
					}).then((v) => attachments.push(v)),
				);
			}
			Promise.all(promisearr).then(async (v) => {
				// Send it!
				messageSendImg(msg, outtext, msg.member.displayAvatarURL(), dollIDDisplay ? dollIDDisplay : msg.member.displayName, threadID, attachments, modified).then(() => {
					// Cleanup after sending
					msg.delete().then(() => {
						attachments.forEach((attach) => {
							try {
								// Screw it, deleting files is too hard.
								//fs.rmSync(`./downloaded/${attach.name}`);
							} catch (err) {
								console.log(err);
							}
						});
					});
				});
			});
		}
		// No attachments to download
		else {
			// If the message somehow creates a fully empty message, we want to avoid sending it and send the debug text
			if (!/[^\u0000-\u0020]/.test(outtext)) {
				if (msg.content.length > 0) {
					messageSendChannel(msg.content, msg.channel.id);
				}
				outtext = "Miss <@125093095405518850>, I broke the bot! The bot said what I was trying to say, for debugging purposes. Unless it was 0 length somehow.";
			}
			// Check again, if we somehow got a 0 length text, something broke
			if (outtext.length == 0) {
				outtext = "Something went wrong. Ping <@125093095405518850> and let her know!";
			}
			// Finally send it!
			messageSend(msg, outtext, msg.member.displayAvatarURL(), dollIDDisplay ? dollIDDisplay : msg.member.displayName, threadID, modified).then(() => {
				// Cleanup after sending.
				msg.delete().then(() => {
					// If the user violates Doll Protocol, do STUFF
					if (dollProtocol) {
						// Punish the doll for being bad.
						let dollPunishment = punishDoll(msg.author.id, dollProtocol);

						// If the doll was actually punished
						if (dollPunishment.punish) {
							// Build data tree for finding string.
							let data = { textarray: "texts_dollprotocol", textdata: { interactionuser: msg.author, targetuser: msg.author } };
							data[`level${dollPunishment.punishmentLevel}`] = true;
							//data.skipped = dollPunishment.skipped;
							messageSendChannel(getText(data), msg.channel.id);
						}
					}
				});
			});
		}
	} catch (err) {
		console.log(err);
	}
}

exports.setUpGags = setUpGags;
exports.loadMittenTypes = loadMittenTypes;

exports.getBaseMitten = getBaseMitten;

exports.assignGag = assignGag;
exports.getGag = getGag;
exports.getGags = getGags;
exports.getGagLast = getGagLast;
exports.getGagBinder = getGagBinder;
exports.getMittenBinder = getMittenBinder;
exports.getGagIntensity = getGagIntensity;
exports.deleteGag = deleteGag;
exports.assignMitten = assignMitten;
exports.getMitten = getMitten;
exports.deleteMitten = deleteMitten;
exports.modifymessage = modifymessage;
exports.convertGagText = convertGagText;
exports.getMittenName = getMittenName;
exports.mittentypes = mittentypes;
exports.gagtypes = gagtypesout;
