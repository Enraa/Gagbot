const { MessageAST } = require(`./../functions/message_ast.js`);

const fs = require("fs");
const path = require("path");

const headweartypes = [
	// Hoods
	{ name: "Latex Hood (no eyes)", value: "hood_latexfull", tags: ["latex"], blockinspect: true, blockemote: true },
	{ name: "Leather Hood (no eyes)", value: "hood_leatherfull", tags: ["leather"], blockinspect: true, blockemote: true },
	{ name: "Maid Hood (no eyes)", value: "hood_maidfull", blockinspect: true, blockemote: true },
	{ name: "Hardlight Hood (no eyes)", value: "hood_hardlightfull", blockinspect: true, blockemote: true },

	// Blindfolds
	{ name: "Leather Blindfold", value: "blindfold_leather", tags: ["leather"], blockinspect: true },
	{ name: "Blackout Lenses", value: "blindfold_blackout", blockinspect: true },
	{ name: "Cloth Blindfold", value: "blindfold_cloth", blockinspect: true },
	{ name: "Floral Blindfold", value: "blindfold_floral", blockinspect: true },
    { name: "High-Security Blindfold", value: "blindfold_highsec", blockinspect: true },
	{ name: "Latex Blindfold", value: "blindfold_latex", tags: ["latex"], blockinspect: true },
	{ name: "Sleep Mask", value: "blindfold_sleep", blockinspect: true },

	//Kigus
	{ name: "Kigu Mask (😀)", value: "mask_kigu_😀", blockinspect: true, blockemote: true, replaceemote: "😀" },
	{ name: "Kigu Mask (🥰)", value: "mask_kigu_🥰", blockinspect: true, blockemote: true, replaceemote: "🥰" },
	// Note, emoji are denoted with EMOJI_xxx. These are replaced during the emoji replacer function
	// This cannot be done ahead of time due to how this is loaded before the bot logs in.
	{ name: "Kigu Mask (Yesh)", value: "mask_kigu_Yesh", blockinspect: true, blockemote: true, replaceemote: "EMOJI_yesh" },
	{ name: "Kigu Mask (Miku)", value: "mask_kigu_miku", blockinspect: true, blockemote: true, replaceemote: "EMOJI_miku" },
	{ name: "Kigu Mask (Teto)", value: "mask_kigu_teto", blockinspect: true, blockemote: true, replaceemote: "EMOJI_tetowoah" },
	{ name: "Kigu Mask (Sadistic Maid)", value: "mask_kigu_sadisticmaid", blockinspect: true, blockemote: true, replaceemote: "EMOJI_sadisticmaid" },
	{ name: "Kigu Mask (Cute Maid)", value: "mask_kigu_cutemaid", blockinspect: true, blockemote: true, replaceemote: "EMOJI_cutemaid" },
	{ name: "Kigu Mask (Happy Maid)", value: "mask_kigu_happymaid", blockinspect: true, blockemote: true, replaceemote: "EMOJI_happymaid" },
	{ name: "Kigu Mask (Shy)", value: "mask_kigu_shy", blockinspect: true, blockemote: true, replaceemote: "EMOJI_shyumm" },
	{ name: "Kigu Mask (Cursed Epicenter)", value: "mask_kigu_epicenter", blockinspect: true, blockemote: true, replaceemote: "EMOJI_epicentercursed" },

	// Masks
	{ name: "Sheep Mask", value: "mask_sheep", blockinspect: true, blockemote: true, replaceemote: "🐑" },
	{ name: "Kitty Mask", value: "mask_kitty", blockinspect: true, blockemote: true, replaceemote: "🐱" },
	{ name: "Bunny Mask", value: "mask_bunny", blockinspect: true, blockemote: true, replaceemote: "🐰" },
	{ name: "Dragon Mask", value: "mask_dragon", blockinspect: true, blockemote: true, replaceemote: "🐉" },
	{ name: "Dog Mask", value: "mask_dog", blockinspect: true, blockemote: true, replaceemote: "🐶" },
	{ name: "Frog Mask", value: "mask_frog", blockinspect: true, blockemote: true, replaceemote: "🐸" },
	{ name: "Turtle Mask", value: "mask_turtle", blockinspect: true, blockemote: true, replaceemote: "🐢" },
	{ name: "Fox Mask", value: "mask_fox", blockinspect: true, blockemote: true, replaceemote: "🦊" },

	// Visors and Headsets
	{ name: "Doll Visor", value: "doll_visor", blockemote: true }, // Doll Visor removes emotes only.
	{ name: "Doll Visor (Opaque)", value: "doll_visor_blind", blockinspect: true, blockemote: true }, // Blindfolding Doll Visor
	{ name: "Doll Visor (Transparent)", value: "doll_visor_trans" }, // Cosmetic Item
    { name: "Dollmaker's Visor", value: "dollmaker_visor", blockemote: true }, // Doll Visor removes emotes only.
	{ name: "VR Headset", value: "vr_visor", blockinspect: true },

    // Gasmasks
    { name: "Gasmask", value: "gasmask", tags: ["latex"] },
    { name: "Gasmask (Rebreather)", value: "gasmask_rebreather", tags: ["latex"] },
    { name: "Gasmask (Aphrodisiacs)", value: "gasmask_hornygas", tags: ["latex"] },
    //{ name: "Gasmask (Truth Gas)", value: "gasmask_truthgas", tags: ["latex"] },
    { name: "Gasmask (Linked)", value: "gasmasklinked", tags: ["latex"] },

	// Misc
	{ name: "Painted Goggles", value: "painted_goggles", blockinspect: true },
];

const DOLLVISORS = ["doll_visor", "doll_visor_blind", "dollmaker_visor"];

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeadwearTypes = () => {
	process.headtypes = headweartypes.map((item) => {
		return { name: item.name, value: item.value };
	});
};

const assignHeadwear = (userID, headwear, origbinder) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	let originalbinder = process.headwear[userID]?.origbinder;
	if (process.headwear[userID]) {
		process.headwear[userID].wornheadwear.push(headwear);
	} else {
		process.headwear[userID] = { wornheadwear: [headwear], origbinder: originalbinder ?? origbinder };
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

const getHeadwear = (userID) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	return process.headwear[userID]?.wornheadwear ? process.headwear[userID]?.wornheadwear : [];
};

const getHeadwearBinder = (userID) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	return process.headwear[userID]?.origbinder;
};

const getLockedHeadgear = (userID) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	return process.headwear[userID]?.locked ? process.headwear[userID]?.locked : [];
};

const addLockedHeadgear = (userID, headwear) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	if (process.headwear[userID]) {
		if (process.headwear[userID].locked == undefined) {
			process.headwear[userID].locked = [headwear];
		} else {
			process.headwear[userID].locked.push(headwear);
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

const removeLockedHeadgear = (userID, headwear) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	if (process.headwear[userID]) {
		if (process.headwear[userID].locked == undefined) {
			return;
		} else {
			if (process.headwear[userID].locked.includes(headwear)) {
				process.headwear[userID].locked.splice(process.headwear[userID].locked.indexOf(headwear), 1);
			}
			if (process.headwear[userID].locked.length == 0) {
				delete process.headwear[userID].locked;
			}
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

const deleteHeadwear = (userID, headwear) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	if (!process.headwear[userID]) {
		return false;
	}
	if (headwear && process.headwear[userID].wornheadwear.includes(headwear) && !getLockedHeadgear(userID).includes(headwear)) {
		process.headwear[userID].wornheadwear.splice(process.headwear[userID].wornheadwear.indexOf(headwear), 1);
		if (process.headwear[userID].wornheadwear.length == 0) {
			delete process.headwear[userID];
		}
	} else if (process.headwear[userID]) {
		let locks = getLockedHeadgear(userID);
		let savedheadgear = [];
		process.headwear[userID].wornheadwear.forEach((g) => {
			if (locks.includes(g)) {
				savedheadgear.push(g);
			}
		});
		process.headwear[userID].wornheadwear = savedheadgear;
		if (process.headwear[userID].wornheadwear.length == 0) {
			delete process.headwear[userID];
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.headwear = true;
};

const getHeadwearName = (userID, headnname) => {
	if (process.headwear == undefined) {
		process.headwear = {};
	}
	let convertmittenarr = {};
	for (let i = 0; i < headweartypes.length; i++) {
		convertmittenarr[headweartypes[i].value] = headweartypes[i].name;
	}
	if (headnname) {
		return convertmittenarr[headnname];
	}
	/*
    else if (process.headwear[userID]?.wornheadwear) {
        return convertmittenarr[process.mitten[userID]?.mittenname]
    }*/ // I honestly dont have a clean way to represent this.
	else {
		return undefined;
	}
};

// Gets the full headwear entry
// There's a better way to do this.
// I didnt feel like doing some kind of .some condition checking.
// Plz simplify.
const getHeadwearBlocks = (headnname) => {
	let convertmittenarr = {};
	for (let i = 0; i < headweartypes.length; i++) {
		convertmittenarr[headweartypes[i].value] = headweartypes[i];
	}
	if (headnname) {
		return convertmittenarr[headnname];
	} else {
		return undefined;
	}
};

// Returns an object with true/false if *ANY* headwear they're wearing
// blocks a given function.
// { canEmote: true, canInspect: true }
const getHeadwearRestrictions = (userID) => {
	let allowedperms = { canEmote: true, canInspect: true };
	let wornheadwear = getHeadwear(userID);
	for (let i = 0; i < wornheadwear.length; i++) {
		if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).blockemote) {
			allowedperms.canEmote = false;
		}
		if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).blockinspect) {
			allowedperms.canInspect = false;
		}
	}

	return allowedperms;
};

// Returns the base headwear object
function getBaseHeadwear(type) {
    return headweartypes.find((h) => h.value == type)
}


const replaceEmoji = (text, parent, replaceEmoji, msgModified, matchFound) => {
	if(text !== replaceEmoji){
		msgModified.modified = true;
		msgModified.emojiModified = true;
		return replaceEmoji;
	}else{
		matchFound.found = true;
	}
}
// Removes all emoji, optionally using an assigned emoji if they are wearing a mask with it!
const processHeadwearEmoji = (userID, msgTree, msgModified, dollvisoroverride) => {
	// Do nothing if no headwear blocks.
	if (getHeadwearRestrictions(userID).canEmote) {return;}

	let replaceemote = "";
	let wornheadwear = getHeadwear(userID);
	let isDoll = getHeadwear(userID).find((headwear) => DOLLVISORS.includes(headwear))
	if(!isDoll){		// Doll Visors overwrite all other emoji replacements due to codeblock formatting.
		for (let i = 0; i < wornheadwear.length; i++) {
			if (getHeadwearBlocks(wornheadwear[i]) && getHeadwearBlocks(wornheadwear[i]).replaceemote != undefined) {
				if (getHeadwearBlocks(wornheadwear[i]).replaceemote.startsWith("EMOJI_")) {
					replaceemote = process.emojis[getHeadwearBlocks(wornheadwear[i]).replaceemote.replace("EMOJI_", "")];
				} else {
					replaceemote = getHeadwearBlocks(wornheadwear[i]).replaceemote;
				}
			}
		}
	}
	// Replace all instances of the emoji
	let matchFound = { "found": false}
	msgTree.callFunc(replaceEmoji,true,["emoji","unicodeEmoji"],[replaceemote,msgModified,matchFound])

	// If there is a forced emote, and it wasn't found in the message, and there were no emotes AT ALL, add one.
	if (replaceemote && !msgModified.modified && !matchFound.found) {
		msgTree.rebuild(`${msgTree.toString()} ${replaceemote}`)
		msgModified.modified = true;
		msgModified.emojiModified = true;
	}

	if (msgTree.toString().length == 0) {
		let dollIDOverride = dollvisoroverride ?? "Unknown";

		// Handle Doll Visors
		if (isDoll) {
			// Below is a stylistic choice it's uncertain about.
			//let dollID = dollDigits//"0".repeat(4 - dollDigits.length) + dollDigits
			msgTree.rebuild(`*(${dollIDOverride}'s face shows no emotion...)*`)
		} else {
			msgTree.rebuild(`*(<@${userID}>'s face shows no emotion...)*`)
		}
	}
};

const truthgasopposites = (text, parent, msgModified) => {
    // Vibe coded this array, but it looks right! 
    let opposites = [
        ["yeah", "nope"],
        ["yep", "nah"],
        ["absolutely", "absolutely not"],
        ["definitely", "definitely not"],
        ["certainly", "certainly not"],
        ["of course", "of course not"],
        ["sure", "not sure"],
        ["agreed", "disagreed"],
        ["agree", "disagree"],
        ["incorrect", "correct"],
        ["right", "wrong"],
        ["true", "false"],
        ["ok", "not ok"],
        ["okay", "not okay"],
        ["fine", "not fine"],
        ["acceptable", "unacceptable"],
        ["approved", "not approved"],
        ["allowed", "not allowed"],

        ["can't", "can"],
        ["can not", "can"],

        ["won't", "will"],
        ["will not", "will"],

        ["wouldn't", "would"],
        ["would not", "would"],

        ["shouldn't", "should"],
        ["should not", "should"],

        ["couldn't", "could"],
        ["could not", "could"],

        ["don't", "do"],
        ["do not", "do"],

        ["doesn't", "does"],
        ["does not", "does"],

        ["didn't", "did"],
        ["did not", "did"],

        ["isn't", "is"],
        ["is not", "is"],

        ["aren't", "are"],
        ["are not", "are"],

        ["wasn't", "was"],
        ["was not", "was"],

        ["weren't", "were"],
        ["were not", "were"],

        ["haven't", "have"],
        ["have not", "have"],

        ["hasn't", "has"],
        ["has not", "has"],

        ["hadn't", "had"],
        ["had not", "had"],

        ["am not", "am"],
        ["ain't", "am"],

        ["impossible", "possible"],
        ["improbable", "probable"],
        ["invalid", "valid"],
        ["unconfirmed", "confirmed"],
        ["accepted", "rejected"],
        ["support", "oppose"],
        ["not", ""],
        ["yes", "no"],
    ];


    let outtext = ``

    let wordpartscombined = [];
    let wordparts = text.split(" ");
    // combine any "not" with their preceding word
    for (let i = 0; i < wordparts.length; i++) {
        // Final word, just add it if so 
        if ((i + 1) != wordparts.length) {
            /*if (wordparts[i+1] == "not") {
                wordpartscombined.push(`${wordparts[i]} ${wordparts[i+1]}`)
                i++;
            }
            else {*/
                wordpartscombined.push(wordparts[i]);
            /*}*/
        }
        else {
            wordpartscombined.push(wordparts[i])
        }
    }
    let nextspace = " ";

    wordpartscombined.forEach((w) => {
        if (Math.random() > 0.4) {
            let matched = false;
            opposites.forEach((test) => {
                if (!matched) {
                    if (w.search(new RegExp(test[0], "i")) > -1) {
                        outtext = `${outtext}${nextspace}${w.replace(test[0], test[1])}`
                        nextspace = " "
                        matched = true;
                        msgModified.modified = true;
                    }
                    else if ((test[1].length > 0) && (w.search(new RegExp(test[1], "i")) > -1)) {
                        if ((test[1].length == 0)) {
                            outtext = `${outtext.slice(0,-1)}`
                            nextspace = "";
                        }
                        else {
                            outtext = `${outtext}${nextspace}${w.replace(test[1], test[0])}`
                            nextspace = " "
                        }
                        matched = true;
                        msgModified.modified = true;
                    }
                }
            })
            if (!matched) {
                outtext = `${outtext}${nextspace}${w}`
                nextspace = " "
            }
        }
        else {
            outtext = `${outtext}${nextspace}${w}`
            nextspace = " "
        }
    })

    return outtext.slice(1) // Cut the leading space
}
// Changes words and negates them
const processHeadwearTruthgas = (userID, msgTree, msgModified) => {
	// Do nothing if no headwear blocks.
	if (!getHeadwear(userID).includes("gasmask_truthgas")) { return }

    msgTree.callFunc(truthgasopposites, true, undefined, [msgModified])
};

exports.headweartypes = headweartypes;
exports.loadHeadwearTypes = loadHeadwearTypes;
exports.assignHeadwear = assignHeadwear;
exports.getHeadwear = getHeadwear;
exports.getHeadwearBinder = getHeadwearBinder;
exports.deleteHeadwear = deleteHeadwear;
exports.getHeadwearName = getHeadwearName;
exports.getHeadwearRestrictions = getHeadwearRestrictions;
exports.getBaseHeadwear = getBaseHeadwear;

exports.processHeadwearEmoji = processHeadwearEmoji;

exports.addLockedHeadgear = addLockedHeadgear;
exports.getLockedHeadgear = getLockedHeadgear;
exports.removeLockedHeadgear = removeLockedHeadgear;
exports.DOLLVISORS = DOLLVISORS;

exports.processHeadwearTruthgas = processHeadwearTruthgas;