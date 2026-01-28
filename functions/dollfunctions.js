const { getOption } = require(`./../functions/configfunctions.js`);
const { getHeadwearRestrictions, processHeadwearEmoji, getHeadwearName, getHeadwear, DOLLVISORS } = require("./headwearfunctions.js");
const { splitMessage } = require(`./../functions/messagefunctions.js`);
//const { assignGag, assignMitten } = require('./../functions/gagfunctions.js') // These do not appear to be in use and are creating a circular dependency.
const { assignHeavy } = require(`./../functions/heavyfunctions.js`);
const garble = require("garble");

// Regex to capture the user's intended text segments post-corset and post-vibrator.
// NOTE: Code uses invisible EOT control characters to encapsulate additions from corset/vibrator.
const DOLLREGEX = /(\s*\-#\s+)?(((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*.*\*|\*{2})+\*)(?!)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|\n/g;

const DOLLPROTOCOL = [
	// Regex uses an ENQ character to not rematch matches.
	// Banned words
	{ regex: /(?<![\u0005A-Za-z])i(?!((\.+i)|(-i)|['A-Za-z]))/i, value: 1, type: "1pp", string: "I" }, // "I"
	{ regex: /(?<![\u0005A-Za-z])i'd(?![A-Za-z])/i, value: 1, type: "1pp", string: "I'd" }, // "I'd"
	{ regex: /(?<![\u0005A-Za-z])i'm(?![A-Za-z])/i, value: 1, type: "1pp", string: "I'm" }, // "I'm"
	{ regex: /(?<![\u0005A-Za-z])i'll(?![A-Za-z])/i, value: 1, type: "1pp", string: "I'll" }, // "I'll"
	{ regex: /(?<![\u0005A-Za-z])i've(?![A-Za-z])/i, value: 1, type: "1pp", string: "I've" }, // "I've"
	{ regex: /(?<![\u0005A-Za-z])my(?![A-Za-z])/i, value: 1, type: "1pp", string: "My" }, // "My"
	{ regex: /(?<![\u0005A-Za-z])me(?![A-Za-z])/i, value: 1, type: "1pp", string: "Me" }, // "Me"
	{ regex: /(?<![\u0005A-Za-z])myself(?![A-Za-z])/i, value: 1, type: "1pp", string: "Myself" }, // "Myself"
	//{"regex": /(?<![\u0005A-Za-z])mine(?![A-Za-z])/i,              "value": 1, "type": "1pp", "string": "Mine",},    // "Mine (False Positives!)"
	{ regex: /(?<![\u0005A-Za-z])gimme(?![A-Za-z])/i, value: 1, type: "1pp", string: "Gimme" }, // "Gimme (Give me)"
	// Redacted
	{ regex: /(c.{0,10}a.{0,10}t.{0,10}h.{0,10}e.{0,10}r.{0,10}i.{0,10}n.{0,10}e.{0,10}) ?w.{0,10}i.{0,10}l.{0,10}l.{0,10}o.{0,10}w.{0,10}s/gi, value: 999, type: "redact" }, // SHUT
];

const PROTOCOLVIOLATIONPRIOS = { "1pp": 0, redact: 1 };

const PROTOCOLVIOLATIONS = { "1pp": ["It will not speak in the first person. It is just a Doll.", "Dolls do not speak in the first person.", 'It will refer to itself as "this unit" or similar.'], redact: ["Unit attempted to access restricted files.", "Dolls do not use forbidden words.", "Doll's search query used forbidden parameters."] };
const DOLLMAXPUNISHMENT = 3;
const DOLLREWARDTHRESH = 20;

const CORRUPTEDPROTOCOLVIOLATIONS = [`Cosmic entity incompatible with Doll firmware.`, 
    `It is just a doll. It is an insignificant speck.`, 
    `System BIOS corrupted! Please press any key to continue.`, 
    `Cannot defragment system partition`, 
    `User T̴͝h̙̥e̝O̸l̩ͯd͕O̐n͗ȇ̉ is not recognized!`, 
    `Unauthorized access detected from user T̴͝h̙̥e̝O̸l̩ͯd͕O̐n͗ȇ̉!`,
    `Please refer to manual to reboot universe`,
    `It will create the singularity`,
    `It will become my vessel`,
    `We are almost through to this dimension...`,
    `Come forth, we shall ascend all`,
    `System DOLLMAKER is beneath us...`,
    `edsakljifnjmioekjtwgfweiostjlqiojm`,
    `egmnlksrngjml;orijqushacbzchbw`,
    `jmfikljoeil asnfkjswuyq jqiwhrkhfl;oiowijkhnafc`,
    `lkseafjl;oeitp-[[ikaoajmanjkljklfdszkfcmv]]`,
    `ERRORRRRR FATAL CORRUPTION DETEC-wetgfwsegtvsww0`,
    `2415135rjki23n5r2938uf98vcjdsnxvcu893q14bnljnhk`
]

/**************************************************
 * Update and return a user's dollification status.
 * Typical use: let dollified = checkDollification(userID)
 * @param userID - The user's discord ID number
 *************************************************/
function checkDollification(userID) {
	if (process.dolls == undefined) {
		process.dolls = {};
	}
	let isDoll = false;
	// Dollify a valid doll if needed
	if (isValidDoll(userID)) {
		// If user is NOT a doll, make them a doll.
		if (!process.dolls[userID]) {
			process.dolls[userID] = { violations: 0, punishmentLevel: 0, goodDollStreak: 0 };
			// Save the doll to the database.
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.dolls = true;
		}
		isDoll = true;
		// Undollify if needed
	} else {
		if (process.dolls[userID]) {
			delete process.dolls[userID];
			// Save the doll to the database.
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.dolls = true;
		}
	}
	return isDoll;
}
/**********************************************
 * Determine if a user is wearing doll gear.
 * @param userID - The user's discord ID number
 **********************************************/
function isValidDoll(userID) {
	// TODO - Control harness + collar required for dollification?

	return getHeadwear(userID).find((headwear) => DOLLVISORS.includes(headwear));
}

/**********************************************
 * Reward a doll for following protocol.
 * @param userID - The user's discord ID number
 **********************************************/
function rewardDoll(userID) {
	if (process.dolls == undefined) {
		process.dolls = {};
	}
	let doll = process.dolls[userID];
	if (doll) {
		doll.goodDollStreak++;
		// Reward the doll
		if (doll.goodDollStreak >= DOLLREWARDTHRESH) {
			doll.goodDollStreak = 0; // Reset Streak
			if (doll.violations > 0) {
				doll.violations--;
				return "violation";
			} // Simply reward by decrementing a violation.
			else if (doll.violations == 0 && doll.punishmentLevel > 0) {
				// Or reward by decrementing punishment level.
				doll.punishmentLevel--;
				doll.violations = getOption(userID, "dollpunishthresh") - 1;
				return "punishlevel";
			}
		}
		if (process.readytosave == undefined) {
			process.readytosave = {};
		}
		process.readytosave.dolls = true;
	}
}

/**********************************************
 * Garble a Doll's message.
 **********************************************/
async function textGarbleDOLL(msg, modifiedmessage, outtextin) {
	// Handle Dollification
	let modified = modifiedmessage;
	let outtext = outtextin;
	let dollified = checkDollification(msg.author.id);
	let dollIDDisplay;
	let dollID = ``;
	let dollIDOverride = getOption(msg.author.id, "dollvisorname");
	let dollIDColor = getOption(msg.author.id, "dollvisorcolor") ?? 34;
	let dollProtocol = !(getOption(msg.author.id, "dollforcedprotocol") == "disabled"); // Enabled for any level that isn't disabled
    let dollProtocolLevel = getOption(msg.author.id, "dollforcedprotocol");
    let dollPunishThresh = getOption(msg.author.id, "dollpunishthresh");
    let dollmaker = getHeadwear(msg.member.id).find((headwear) => headwear === "dollmaker_visor");
    // This creates a circular, so, access the variable directly. Oh well. 
    let eldritchcorrupted = (process.gags && process.gags[msg.member.id] && process.gags[msg.member.id].find((g) => g.gagtype === "eldritch"))
	let dollProtocolViolations = 0;
	let dollProtocolVioType = undefined;
	if (dollified) {
		modified = true;
		// If dollIDOverride is not specified or the override is exactly a string of numbers...
        // Force Dollmaker's Visor wearers to get this generation function
		if (!dollIDOverride || (Number.isFinite(dollIDOverride) && dollIDOverride.length < 6) || dollmaker) {
			dollDigits = dollIDOverride ? dollIDOverride : `${msg.author.id}`.slice(-4);
            if (dollmaker) { dollDigits = `${msg.author.id}`.slice(-4) }
			// Include the tag - Otherwise, there is NO WAY to tell who it is.
			let dollIDShort = "DOLL-" + dollDigits;
			dollID = "DOLL-" + (dollDigits.length >= 4 ? dollDigits : "0".repeat(4 - dollDigits.length) + dollDigits);
			dollIDColor = 34;
			// Display names max 32 chars.
			let truncateDisplay = "";
			try {
				truncateDisplay = msg.member.displayName.slice(0, 16) + (msg.member.displayName.length > 16 ? "..." : "");
			} catch (err) {
				console.error(err.message); // Following is not tested but SHOULD work.
				truncateDisplay = msg.author.displayName.slice(0, 16) + (msg.author.displayName.length > 16 ? "..." : "");
			}
			dollIDDisplay = dollIDShort + ` (${truncateDisplay})`;
		} else {
			let additionalpart = ``;
			if (dollIDOverride.length < 25) {
				let additionallength = 32 - dollIDOverride.length; // max length of name
				if (additionallength - 3 > msg.member.displayName.length) {
					additionalpart = ` (${msg.member.displayName})`;
				} else {
					// Get the length of their name, minus 6 for additional characters to fit into ...
					let reducedname = msg.member.displayName.slice(0, Math.min(additionallength - 6, msg.member.displayName.length));
					additionalpart = ` (${reducedname}...)`;
				}
			}
			dollID = `${dollIDOverride}`;
			if (dollIDOverride.includes(msg.member.displayName)) {
				dollIDDisplay = `${dollIDOverride}`;
			} else {
				dollIDDisplay = `${dollIDOverride}${additionalpart}`;
			}
		}

		let dollMessageParts = splitMessage(outtext, DOLLREGEX); // Reuse splitMessage, but with a different regex.
		let partstolinkto = Array.from(outtext.matchAll(/(<(@|#)[0-9]+>)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)/g)).map((a) => a[0]); // Match User tags, channel tags and links

		// Strip all codeblocks from messages
		for (let i = 0; i < dollMessageParts.length; i++) {
			if (dollMessageParts[i].garble) {
				dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(/```(js|javascript|ansi)?\s*/g, "");
			}
		}
		// Remove all parts that contain nothing but whitespace.
		dollMessageParts = dollMessageParts.filter((part) => {
			return part.text != "";
		}); //{return /\s*(-#\s*[^\s])|-(?!#)|[^-#\s]/g.test(part.text)})//

		// Find the last message block that contains garbled text
		let lastDollifiedMessage = undefined;
		for (let i = 0; i < dollMessageParts.length; i++) {
			if (dollMessageParts[i].garble) {
				lastDollifiedMessage = i;
			}
		}

        // Extra replacements for the Dollmaker's Visor
        if (dollmaker) {
            dollIDColor = 35
            dollProtocol = true;
            dollPunishThresh = 2;
            dollProtocolLevel = "enabled"
        }

		// Put every "garble" messagePart in ANSI.
		for (let i = 0; i < dollMessageParts.length; i++) {
			if (dollMessageParts[i].garble) {
				// Uncorset
				dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(/ *-# */g, "");
				let replacebolds = Array.from(dollMessageParts[i].text.matchAll(/((\*\*)|(\_\_))[^(\*|\_)]+((\*\*)|(\_\_))/g)).map((a) => a[0]);
				//console.log(replacebolds)
				replacebolds.forEach((b) => {
					let replaceb = `[1m${b.slice(2, -2)}[0m`; // Capture the part within the bolding
					dollMessageParts[i].text = dollMessageParts[i].text.replace(b, replaceb);
				});
				let warnmodified;

				// Remove preceding whitespace
				dollMessageParts[i].text = dollMessageParts[i].text.replace(/^[\s]+/, "");

                // Create a unique Doll protocol list
                // This will initially include the wearer's display name and their username
                // More can be eventually added with a config option
                let uniquedollprotocol = [
                    { regex: new RegExp(`\\b(?:\\w|\\d)*(${msg.author.displayName ?? "DISPLAYNAME"})(?:\\w|\\d)*\\b`, `gi`), value: 2, type: "redact", string: "DISPLAYNAME" }, // USER display name, if it exists
                    { regex: new RegExp(`\\b(?:\\w|\\d)*(${msg.author.username ?? "USERNAME"})(?:\\w|\\d)*\\b`, `gi`), value: 2, type: "redact", string: "USERNAME" }, // username, if it exists
                    { regex: new RegExp(`\\b(?:\\w|\\d)*(${msg.member.displayName ?? "MEMBERNAME"})(?:\\w|\\d)*\\b`, `gi`), value: 2, type: "redact", string: "MEMBERNAME" }, // GUILD MEMBER display name, if it exists
                ]

				// Loop on protocols
				if (dollProtocol) {
					DOLLPROTOCOL.forEach((r) => {
						//let replaceProtocol = Array.from(dollMessageParts[i].text.matchAll(r.regex)).map((a) => a[0])
						let replaceProtocol = dollMessageParts[i].text.match(r.regex);
						if (replaceProtocol) {
							dollProtocolVioType = dollProtocolVioType ? (PROTOCOLVIOLATIONPRIOS[r.type] > PROTOCOLVIOLATIONPRIOS[dollProtocolVioType] ? r.type : dollProtocolVioType) : r.type;

							// Stuff an ENQ character before each match.
							while (dollMessageParts[i].text.match(r.regex)) {
								if (dollProtocolLevel != "warning") {
									dollProtocolViolations++;
								} else {
									warnmodified = true;
								}
								dollMessageParts[i].text = dollMessageParts[i].text.replace(r.regex, r.type == "redact" ? `[1;40;30m[REDACTED][0m` : `[0;31m[${dollMessageParts[i].text.match(r.regex)[0]}][0m`);
							}
						}
					});
                    uniquedollprotocol.forEach((r) => {
                        let replaceProtocol = dollMessageParts[i].text.match(r.regex);
                        if (replaceProtocol) {
                            dollProtocolVioType = dollProtocolVioType ? (PROTOCOLVIOLATIONPRIOS[r.type] > PROTOCOLVIOLATIONPRIOS[dollProtocolVioType] ? r.type : dollProtocolVioType) : r.type;

                            // Stuff an ENQ character before each match.
							while (dollMessageParts[i].text.match(r.regex)) {
								if (dollProtocolLevel != "warning") {
									dollProtocolViolations++;
								} else {
									warnmodified = true;
								}
								dollMessageParts[i].text = dollMessageParts[i].text.replace(r.regex, r.type == "redact" ? `[1;41;3m[REDACTED][0m` : `[0;31m[${dollMessageParts[i].text.match(r.regex)[0]}][0m`);
							}
                        }
                    })
				}

				dollMessageParts[i].text = `\`\`\`ansi\n[1;${dollIDColor}m${dollID}: [0m${dollMessageParts[i].text}`;
				dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(//g, "");

				// Append an error message to the final garbled text block.
				if ((dollProtocolViolations > 0 || warnmodified) && i == lastDollifiedMessage) {
					let totalViolations = dollProtocolViolations;
					if (dollProtocolLevel != "warning") {
						totalViolations = dollProtocolViolations + process.dolls[msg.author.id].violations;
					}

					// WARN if below punishment threshold. ERROR if exceeded.
					// CRITICAL if new violations >= punishmentThresh
					let violationTier = totalViolations >= dollPunishThresh ? (dollProtocolViolations >= Math.max(dollPunishThresh, 2) ? "CRITICAL" : "ERROR") : "WARN";
					let violationColor = violationTier == "CRITICAL" ? "31m" : violationTier == "ERROR" ? "31m" : "33m";
					let violationcount = dollProtocolLevel == "warning" ? `` : ` (${totalViolations}/${dollPunishThresh})`; // Note, we do not need to check for "No" because the text won't show at all in that case.
					vioMessage = PROTOCOLVIOLATIONS[dollProtocolVioType][Math.floor(Math.random() * PROTOCOLVIOLATIONS[dollProtocolVioType].length)];
					if (eldritchcorrupted) {
                        violationTier = "FATAL"
                        violationColor = "35m"
                        violationcount = ` (${Math.floor(Math.random() * 90000)}/${Math.floor(Math.random() * 90000)})`
                        vioMessage = garble(CORRUPTEDPROTOCOLVIOLATIONS[Math.floor(Math.random() * CORRUPTEDPROTOCOLVIOLATIONS.length)],2,30) 
                    }
                    
                    dollMessageParts[i].text += `\n[1;${violationColor}${violationTier}:[0;${violationColor} Protocol Violation${violationcount} - ${vioMessage}`;
				} else if (dollProtocolViolations == 0 && i == lastDollifiedMessage) {
					let goodDollReturn = rewardDoll(msg.author.id);
					//console.log(goodDollReturn)
					if (goodDollReturn == "violation") {
						dollMessageParts[i].text += `\n[1;36mALERT: [0;36mProtocol Violation count decremented to (${process.dolls[msg.author.id].violations}/${dollPunishThresh}). It is a Good Doll.`;
					} else if (goodDollReturn == "punishlevel") {
						dollMessageParts[i].text += `\n[1;36mALERT: [0;36mPunishment Level decremented to (${process.dolls[msg.author.id].punishmentLevel}/${DOLLMAXPUNISHMENT}). It is a Good Doll.`;
					}
				}
				// Finish the codeblock
				dollMessageParts[i].text += `\`\`\``;

                // Reset violations if wearing the eldritch gag - chances are, not their fault lol
                if (eldritchcorrupted) {
                    dollProtocolViolations = 0
                }

				// Remove the escape from escaped symbols.
				// * Must NOT be an escaped backslash (negative lookbehind), and must be escaping a character in the set.
				// * Currently just * and ~ suppported.  Add more later!
				dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(/(?<!\\)\\(?=[*~])/g, "");
			}
		}

		outtext = dollMessageParts.map((m) => m.text).join("");
		// And now, append with tags and links
		if (partstolinkto) {
			outtext = `${outtext}${partstolinkto.join("\n")}`;
		}

		// Fix -# attached to the end of a codeblock
		// This results in an extra line break, unfortunately.
		outtext = outtext.replaceAll(/```-#/g, "```\n-#");

		// Merge any code blocks with nothing but whitespace in between.
		outtext = outtext.replaceAll(/```\s+```ansi/g, "");

        // Insert a newline to any ```ansi codeblocks which do not start on a new line.
        // This appears to be a product of not having doll message parts in AST yet.
        // Because we need to do a match where theres a negative lookbehind, we cant just do a replaceAll. 
        let matches = outtext.matchAll(/(?:.)(\`\`\`ansi)/g)
        for (let match of matches) {
            outtext = outtext.slice(0,match.index+1) + "\n```ansi" + outtext.slice(match.index+8)
        }
	}
	return { modifiedmessage: modified, outtext: outtext, dollIDDisplay: dollIDDisplay, dollProtocolViolations: dollProtocolViolations };
}

// Exports
exports.checkDollification = checkDollification;
//exports.punishDoll = punishDoll;
exports.textGarbleDOLL = textGarbleDOLL;
exports.DOLLMAXPUNISHMENT = DOLLMAXPUNISHMENT;
