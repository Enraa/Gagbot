const fs = require("fs");
const path = require("path");
const https = require("https");
const { messageSend, messageSendImg, messageSendChannel } = require(`./../functions/messagefunctions.js`);
const { corsetLimitWords, silenceMessage } = require(`./../functions/corsetfunctions.js`);
const { stutterText } = require(`./../functions/vibefunctions.js`);
const { processHeadwearEmoji, processHeadwearTruthgas } = require("./headwearfunctions.js");
const { getText } = require(`./../functions/textfunctions.js`);
const { DOLLMAXPUNISHMENT, textGarbleDOLL, textGarbleDrone } = require(`./../functions/dollfunctions.js`);
const { splitMessage } = require(`./../functions/messagefunctions.js`);
const { MessageAST } = require(`./../functions/message_ast.js`);
const { emitEvent } = require("./eventhandling.js");
const { getHeadwear } = require("./getters/headwear/getHeadwear.js");
const { getOption } = require("./getters/config/getOption.js");
const { assignGag } = require("./setters/gag/assignGag.js");
const { assignMitten } = require("./setters/mitten/assignMitten.js");
const { assignHeavy } = require("./setters/heavy/assignHeavy.js");
const { getHeadwearRestrictions } = require("./getters/headwear/getHeadwearRestrictions.js");
const { getVibeEquivalent } = require("./getters/chastity/getVibeEquivalent.js");
const { getArousedTexts } = require("./getters/arousal/getArousedTexts.js");
const { getCorset } = require("./getters/corset/getCorset.js");
const { getHeavyRestrictions } = require("./getters/heavy/getHeavyRestrictions.js");
const { getUserVar } = require("./getters/config/getUserVar.js");
const { getPFP } = require("./getters/config/getPFP.js");
const { convertPronounsText } = require("./other/convertPronounsText.js");
const { getAlternateName } = require("./getters/config/getAlternateName.js");
const { markForSave } = require("./other/markForSave.js");

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
	{ name: "Kitty Paws", value: "mittens_kitty", tags: ["pet"] },
	{ name: "Oversized Fluffy Paw Mittens", value: "mittens_oversized_fluff", tags: ["pet"] },
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
        markForSave("dolls");
		return { punish: punishments > 0 ? true : false, punishmentLevel: doll.punishmentLevel, skipped: skipped };
	}
}

const messageReplaceEmojiWithText = async (msg) => {
    if (!getHeadwearRestrictions(msg.author.id).forcedtextemoji) {return msg.content;}

    let text = msg.content;

    const emojiMap = {
        "🙂": { text: ":)", emoji: "🙂", name: "slight_smile" },
        "😄": { text: ":D", emoji: "😄", name: "smile" },
        "😆": { text: "x-)", emoji: "😆", name: "laughing" },
        "😅": { text: ",:)", emoji: "😅", name: "sweat_smile" },
        "😂": { text: ":'D", emoji: "😂", name: "joy" },
        "🥲": { text: ":')", emoji: "🥲", name: "smiling_face_with_tear" },
        "😊": { text: ':" )'.replace(" ", ""), emoji: "😊", name: "blush" },
        "😇": { text: "o:)", emoji: "😇", name: "innocent" },
        "😉": { text: ";)", emoji: "😉", name: "wink" },
        "😘": { text: ":*", emoji: "😘", name: "kissing" },
        "😛": { text: ":P", emoji: "😛", name: "stuck_out_tongue" },
        "😎": { text: "8-)", emoji: "😎", name: "sunglasses" },
        "😒": { text: ":s", emoji: "😒", name: "unamused" },
        "😕": { text: ":-\\", emoji: "😕", name: "confused" },
        "😢": { text: ":'(", emoji: "😢", name: "cry" },
        "😭": { text: ":,'(", emoji: "😭", name: "sob" },
        "😠": { text: ">:(", emoji: "😠", name: "angry" },
        "😡": { text: ":@", emoji: "😡", name: "rage" },
        "😓": { text: ",:(", emoji: "😓", name: "sweat" },
        "😐": { text: ":|", emoji: "😐", name: "neutral_face" },
        "🙁": { text: ":(", emoji: "🙁", name: "frowning" },
        "😮": { text: ":o", emoji: "😮", name: "open_mouth" },
        "😈": { text: "]:)", emoji: "😈", name: "smiling_imp" },
        "👿": { text: "]:(", emoji: "👿", name: "imp" },
        "❤️": { text: "<3", emoji: "❤️", name: "heart" },
        "💜": { text: "<3", emoji: "💜", name: "purpleheart" },
        "💔": { text: "</3", emoji: "💔", name: "broken_heart" }
    };

    Object.keys(emojiMap).forEach((k) => {
        text = text.replaceAll(k, emojiMap[k].text)
    })
    
    return text;
}

const modifymessage = async (msg, threadId, messageonly) => {
	try {
        if (!messageonly) {
            console.log(`${msg.channel.guild.name} - ${msg.member.displayName}: ${msg.content}`);
        }
        let text = await messageReplaceEmojiWithText(msg);
        msg.content = text;
		
		// TODO - remove this var
		let outtext = ``											// Message to send.
		let msgTree = new MessageAST(msg.content);					// Build AST from message
		let msgTreeMods = {"modified":false, "emojiModified":false, "corseted":false}	// Store a boolean in an object to allow pass by reference.

		processHeadwearEmoji(msg.author.id, msgTree, msgTreeMods, getOption(msg.author.id, "dollvisorname"))
        processHeadwearTruthgas(msg.author.id, msgTree, msgTreeMods)
        await processPregarbleGags(msg, msgTree, msgTreeMods)       // Perform early garbles before arousal and corset effects. 

		// See if this message can be skipped. Messages containing only emoji do NOT need to be processed,
		// But only if NOT wearing a headwear that replaces it in previous step.
		if (!msgTreeMods.modified && msg.content.match(SKIPREGEX)) return;

		textGarbleVibrator(msg, msgTree, msgTreeMods);				// Handle arousal effects (Stutter, gasps.)
		textGarbleCorset(msg, msgTree, msgTreeMods, threadId);		// Handle corset.
		if (msgTreeMods.corseted) {return;}							// Abort if the message got corseted - message handled elsewhere.
		msgTree.rebuild(msgTree.toString())							// Update AST to account for control char-wrapped moans.
		textGarbleGag(msg, msgTree, msgTreeMods);					// Text garbling due to Gag

        msgTree.callFunc(textGarbleDrone,true,"rawText",[msg, msgTreeMods])

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

        // Get Drone Visor if worn
        /*let dronetext = await textGarbleDrone(msg, outtext);
        if (dronetext.modifiedmessage) { outtext = dronetext.modifiedmessage }
        if (dronetext.dollIDDisplay) { dollIDDisplay = dronetext.dollIDDisplay }
        if (dronetext.modified) { msgTreeMods.modified = true };*/

        // Append any extra messages from collar effects
        let appendcollar = await appendCollarEffects(msg, outtext, msgTreeMods);
        if (appendcollar.outtext) { outtext = appendcollar.outtext }
        if (appendcollar.msgTreeMods) { msgTreeMods = appendcollar.msgTreeMods }

        // Iterate through any speech events in process.msgfunctions
        emitEvent("msgfunction", msg.author.id, { msg: msg, msgcontent: msg.content, outtext: outtext })

        // If we only wanted to edit the message, just return it at this point and do NOT proceed. 
        if (messageonly) { 
            return outtext;
        }

        // Get the user's current display name based on worn restraints
        let userdisplayName = getAlternateName(msg.member);
        if (userdisplayName != msg.member.displayName) {
            msgTreeMods.modified = true;
        }

		// Finally, send it if we modified the message.
		if (msgTreeMods.modified) {
            // If the message content is *exactly* the same as the input, return
            if ((msg.content === outtext) && (userdisplayName == msg.member.displayName)) { return }
			await sendTheMessage(msg, outtext, userdisplayName, threadId, dollProtocol, msgTreeMods.emojiModified );
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
            if (garbledtext.shocked) {
                msgModified.shocked = true;
            }
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

async function textGarbleGag(msg, msgTree, msgTreeMods) {
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
					msgTree.callFunc(process.gagtypes[gag.gagtype].garbleText,true,"rawText",[gag.intensity ?? 5, msg])		// Run garble on all IC segments.
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

async function processPregarbleGags(msg, msgTree, msgTreeMods) {
    // Gags now
	if (process.gags == undefined) {
		process.gags = {};
	}
    if (process.gags[msg.author.id] && process.gags[msg.author.id].length > 0) {
        let origcontent = msg.content;
        // Go over each gag and if there's a gag file loaded for it, run the messagebegin, garbletext and messageend functions if they exist.
		process.gags[msg.author.id].forEach(async (gag) => {
            if (process.gagtypes && process.gagtypes[gag.gagtype]) {
                if (process.gagtypes[gag.gagtype].pregarble) {
                    await msgTree.callFunc(process.gagtypes[gag.gagtype].pregarble,true,"rawText",[gag.intensity ?? 5, msg])		// Run garble on all IC segments.
                    if (msg.content != msgTree.toString()) {
                        msgTreeMods.modified = true;
                    }
                }
            }
        })
        if (msg.content != origcontent) {
            msgTreeMods.modified = true;
        }
    }
}

async function appendCollarEffects(msg, outtext, msgTreeMods) {
    console.log(msgTreeMods);
    // Create an array of messages to add
    let appendmessages = [];

    // If they were shocked, then give a shocked message. 
    if (msgTreeMods.shocked) {
        // Figure out the tone to shock the user with
        let tone = getOption(msg.author.id, "shocktone") ?? "playful";
        if (tone == "both") {
            if (Math.random() > 0.5) { 
                tone = "playful" 
            }
            else { 
                tone = "painful" 
            };
        }
        let shocks = {
            playful: [
                `*USER_TAG's face flushes red as the shock registers how horny USER_THEY USER_ISARE!*`,
                `*USER_TAG tries to speak but stops forming words as the collar gives USER_THEM a warning shock!*`,
                `*USER_TAG eeps when the collar gives USER_THEM a tiny shock!*`,
                {
                    required: (t) => {
                        return getHeavyRestrictions(t.interactionuser.id).touchself;
                    },
                    text: `*USER_TAG tries to slip a finger under USER_THEIR collar as it stings USER_THEM!*`,
                },
                `*USER_TAG meeps as USER_THEIR collar gives a barely audible crackle, derailing USER_THEIR train of thought.*`,
                `*USER_TAG's speech is cut short as a tiny sting chides USER_THEM for being so horny...*`
            ],
            painful: [
                `*USER_TAG yelps in pain as USER_THEIR speech is cut short!*`,
                `*USER_TAG's breath seizes up in USER_THEIR throat as the collar shocks USER_THEM!*`,
                `*USER_TAG grits USER_THEIR teeth as the collar triggers a shock!*`,
                `*Tears run down USER_TAG's face as USER_THEIR speech is interrupted!*`,
                `*USER_TAG's words trail off and USER_THEY squintUSER_S USER_THEIR eyes shut!*`,
                {
                    required: (t) => {
                        return getHeavyRestrictions(t.interactionuser.id).touchself;
                    },
                    text: `*USER_TAG's grabs USER_THEIR collar with tears as it shocks USER_THEM!*`,
                },
            ]
        }
        let texts = [];
        shocks[tone].forEach((t) => {
            if (typeof t != "string") {
                if (t.required({ interactionuser: msg.member, targetuser: msg.member })) {
                    texts.push(t.text)
                }
            }
            else {
                texts.push(t)
            }
        })
        appendmessages.push(convertPronounsText(texts[Math.floor(texts.length * Math.random())], { interactionuser: msg.member, targetuser: msg.member }));
        /*** This code is ugly because I couldn't call the functions due to circulars. 
         * 
         * This should ideally be refactored in the future. 
        */
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[msg.member.id] == undefined) { process.userstats[msg.member.id] = {} }
        let newcount = (process.userstats[msg.member.id]["timesshocked"] ?? 0) + 1;
        process.userstats[msg.member.id]["timesshocked"] = newcount;
        markForSave("userstats");
        try {
            if (getOption(msg.member.id, "pishockusername") && (typeof getOption(msg.member.id, "pishockusername") == "string") &&
                getOption(msg.member.id, "pishockname") && (typeof getOption(msg.member.id, "pishockname") == "string") &&
                getOption(msg.member.id, "pishockcode") && (typeof getOption(msg.member.id, "pishockcode") == "string") &&
                getOption(msg.member.id, "pishockapikey") && (typeof getOption(msg.member.id, "pishockapikey") == "string")) {
                    // Set up the https request. 
                    const reqdata = JSON.stringify({
                        Username: getOption(msg.member.id, "pishockusername"),
                        Name: getOption(msg.member.id, "pishockname"),
                        Code: getOption(msg.member.id, "pishockcode"),
                        Intensity: 100,
                        Duration: 2,
                        Apikey: getOption(msg.member.id, "pishockapikey"),
                        Op: (getOption(msg.member.id, "pishockop") ? getOption(msg.member.id, "pishockop") : "0"), // 0 for shock, 1 for vibrate, 2 for beep
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
                console.log(`No shocker or invalid shocker information configured for ID ${msg.member.id}.`)
            }
        }
        catch (err) {
            console.log(err)
        }
        /***/
    }

    // If they're wearing a sponsorship collar, 30% chance to add a sponsor. 
    if (process.collar && process.collar[msg.author.id] && ((process.collar[msg.author.id].collartype == "sponsorcollar") || (process.collar[msg.author.id].additionalcollars && process.collar[msg.author.id].additionalcollars.includes("sponsorcollar")))) {
        let randomchance = 0.95 - (!isNaN(getUserVar(msg.author.id, "sponsorcollartrigger")) ? (((Date.now() - getUserVar(msg.author.id, "sponsorcollartrigger")) / 60000) * 0.015) : 0.5) // 5% + 1.5% per minute, uncapped. +50% chance if this is their first time ever being sponsored
        if ((Math.random() > randomchance) && (!isNaN(getUserVar(msg.author.id, "sponsorcollartrigger")) ? (((Date.now() - getUserVar(msg.author.id, "sponsorcollartrigger")) / 60000) > 1.0) : true)) { // Higher than proc rate AND at least a minute since last proc.
            let sponsors = [
                `FANG (Fox Asset and National Growth) - Asset Management since 2008!`,
                `FEC (Fox Exchange Commission) - Your Trusted Stock Broker since 1929!`,
                `Chain Corps - Keeping you in chains!`,
                `Dragon Banking Guild - ~~Hoarding~~ Protecting Your Money!`,
                `WeenRawr - Chastity for All!`,
                `Fandumb - Ads and Wikis For Anything`,
                `Soupman - In Cinemas Now!`,
                `FWAT (Fox Weapons And Tactics) - Bondage and Capture services since 1975!`,
                `LenOwO - Bringing Your Porn to Your Display!`,
                `Intranet Ignorer - Returning Chastity Keys on Time... We Promise!`,
                `Pizza House - Get 3 Large Pizzas for the Price of 2! Order now!`,
                `Sub-Way - Eating ~~out~~ Fresh!`,
                `Jenny Jones - Freaky Fast Doms at your door in 15 minutes or less!`,
                `Coca-Collar - The Dungeon's Favorite Soda!`,
                `Dressup Co - Making Pretty Subbies out of Everyone!`,
                `Eldritch Entities - You will Serve Us. Enquire today with the Overseer!`,
                `Latex Mills Inc - Carefully manufacturing Latex since the last Latex Spill of 2026!`,
                `Gagbot Enterprises - Making all subs words "Mmmph!~"`,
                `Helix Handcuffs - Wrapping wrists since 1962!`,
                `Luscious Leather - Manufacturing Leather Clothing for the Distinguished Dominant`,
                `Maidsweeper Company - Sweeping Dishes and hidden bombs since 1983!`,
                `J.G. Whisker - If you have a structured tuna plan and you need food **now,** call J.G. Whisker! 877-FOOD-MEOW!`,
                `Chastity Arbitrage - Facilitating Chastity Sharing for all Good Girls and Boys!`,
                `Puppy Girls United - Where's the Ball? Where's the Ball!?`,
                `Royalty Brats Rights Advocates - Helping Princesses and Princes get what they're owed from the Mean Dommes!`,
                `Crossroad Demons Inc - Do you have a problem in your life? Let us help you for a low cost you won't ever miss!`,
                `Doll Corp - It **will** be a Doll. It will put on a Doll Visor. It will serve.`,
                `The Ropeworks - Tying Everything Together!`,
                `Snoop Suits - Premium Suits for all Pets, in any color you like as long as it's Blue!`,
                `Sapphic Mermaids - Inspiring gay panic in Women since the time of Sapphos!`,
                `Mick Donald Gags - Ba-da Ba Ba Daaaaaaaaa! I'm mmmmphing it!`,
                `Anchorage Armbinders - An essential tool to use on the wayward submissive!`,
                `Happy Headpats - Providing happiness to all with the power of Headpats!`,
                `Wednesday Whips - Inspiring true gothic fashion and tools for the witchy Domme!`,
                `HexCorp Drones - Thought leaders in the dronification sphere. Join the Hivemind today!`,
                `Chaotic Destruction Ducks - QUECK QUACK QUACK! EHEHEHEHEHE!`,
                `Freedom Dreams Casinos - Gamble your future for a chance to win big today! Inquire with one of our lovely attendants!`,
                `Veronica's Secret Bondage - Intimate Chastity-Wear for *you*. <3`,
                `Floe's Dressup Room - Letting your clothing dreams flow!`,
                `Mocha - Please pat me!`,
                `Dancer-chans Worldwide - Providing an exotic dance show at any time, globally!`,
                `Maidcorp - Glass Cleaner so effective, it works as Maid Storage!`,
                `Cassandra's Secret - Witch by Day, Obedient Doll by Night`,
                `Sponsorship Collar - Put me on. Advertise our corporate overlords like a good little subbie drone you are!`,
                `DommeDash - Feeding Subs, One Door at a Time!`,
            ]
            appendmessages.push(`-# Sponsored by ${sponsors[Math.floor(sponsors.length * Math.random())]}`);
            setUserVar(msg.author.id, "sponsorcollartrigger", Date.now());
        }
    }

    if (appendmessages.length > 0) {
        msgTreeMods.modified = true;
        outtext = `${outtext}\n\n`
        appendmessages.forEach((m) => {
            outtext = `${outtext}${m}\n`
        })
    }

    return { outtext: outtext, msgTreeMods: msgTreeMods }
}

async function sendTheMessage(msg, outtext, dollIDDisplay, threadID, dollProtocol, modified) {
	try {
		// If this is a reply, we want to create a reply in-line because webhooks can't reply.
        let isreply = false;
        let replyobject;
		if (msg.type == "19") {
			const replied = await msg.fetchReference();
            let displayname = replied.member ? replied.member.displayName : replied.author.displayName
			const replyauthorobject = await replied.guild.members.search({ query: displayname, limit: 1 });
			const first = replyauthorobject.first();
			if (first) {
				outtext = `<@${first.id}> ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`;
                replyobject = {
                    replyauthor: `<@${first.id}>`,
                    replymessageid: replied.id
                }
			} else {
				outtext = `${displayname} ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`;
                replyobject = {
                    replyauthor: `${displayname}`,
                    replymessageid: replied.id
                }
			}
            isreply = first?.id;
		}

		// Truncate the text if it's too long
		if (outtext.length > 1999) {
			outtext = outtext.slice(0, 1999); // Seriously, STOP POSTING LONG MESSAGES
		}

        // Increment the gagged message counter
        if (process.userstats == undefined) { process.userstats = {} }
        if (process.userstats[msg.author.id] == undefined) { process.userstats[msg.author.id] = {} }
        process.userstats[msg.author.id].gaggedmessages = (process.userstats[msg.author.id].gaggedmessages ?? 0) + 1;
        markForSave("userstats");

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
                let avatar = await getPFP(msg.member);
				// Send it!
				messageSendImg(msg, outtext, avatar ?? msg.member.displayAvatarURL(), dollIDDisplay ? dollIDDisplay : msg.member.displayName, threadID, attachments, modified, isreply, replyobject).then((modifiedmsg) => {
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
            let avatar = await getPFP(msg.member);
			// Finally send it!
			messageSend(msg, outtext, avatar ?? msg.member.displayAvatarURL(), dollIDDisplay ? dollIDDisplay : msg.member.displayName, threadID, modified, isreply, replyobject).then((modifiedmsg) => {
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

exports.modifymessage = modifymessage;
exports.mittentypes = mittentypes;
exports.gagtypes = gagtypesout;
exports.mittentypes = mittentypes;