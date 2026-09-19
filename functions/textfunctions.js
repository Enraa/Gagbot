const { getGag } = require("./getters/gag/getGag.js");
const { convertPronounsText } = require("./other/convertPronounsText.js");

/******
 * Get a text key from it's appropriate list, requiring it as necessary. 
 * 
 * - (object) data - The text data. Should contain a text array, user ID and target ID. 
 * ---
 * ##### Returns an array of strings for that text array. 
 ******/
function getTextArrayKey(data) {
    try {
		let textarray = data.textarray;
		let props = [];
		for (k in data) {
			if (k != "textarray" && k != "textdata" && k != "serverID") {
				props.push(k); // Should create the same order.
			}
		}
        let checkingarray = require(`./../texts/${textarray}.js`);
        if (checkingarray) {
            let sentencearr = props.reduce((prev, curr) => {
                return prev[curr];
            }, checkingarray[textarray]); // Yes, for some reason I named it like this. 
            if (Array.isArray(sentencearr)) {
                return sentencearr;
            }
            else {
                console.log(sentencearr);
                return undefined;
            }
        }
        else {
            console.log(`${textarray} is not a valid array!`)
        }
    }
    catch (err) {
        console.log(err);
        return undefined;
    }
}

// Get generic text and spit out a pronoun respecting version YAY
function getTextGeneric(type, data_in) {
	let generics = {
		unbind: ["TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be removed. Please wait as TARGET_THEY confirmTARGET_S (5 minute timeout)."],
		unbind_decline: ["TARGET_TAG has declined your help with USER_THEIR VAR_C1."],
		unbind_accept: ["TARGET_TAG has accepted your offer to help with TARGET_THEIR VAR_C1!"],
		unbind_timeout: ["The request to help TARGET_TAG timed out!"],
		changebind: ["TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be changed. Please wait as TARGET_THEY confirmTARGET_S (5 minute timeout)."],
		changebind_decline: ["TARGET_TAG has declined allowing you to change TARGET_THEIR bindings."],
		changebind_accept: ["TARGET_TAG has allowed you to change TARGET_THEIR bindings."],
		clone_accept: ["TARGET_TAG has allowed you to make a clone of TARGET_THEIR VAR_C1 key, giving it to VAR_C2!"],
		clone_accept_self: ["Cloning your key..."],
		clone_decline: ["TARGET_TAG has forbidden you from making a clone of TARGET_THEIR VAR_C1 key for VAR_C2!"],
		give_accept: ["TARGET_TAG has allowed you to give TARGET_THEIR VAR_C1 key to VAR_C2!"],
		give_accept_self: ["Giving your key..."],
		give_decline: ["TARGET_TAG has forbidden you from giving TARGET_THEIR VAR_C1 key to VAR_C2!"],
		revoke_accept: ["You have destroyed the key VAR_C2 had to TARGET_TAG's VAR_C1."],
        find_key_self: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! Lucky find!`,
            `USER_TAG spots a shiny glint and picks it up. It turns out to be the key to USER_THEIR VAR_C1!`,
            `USER_TAG steps on something weird and picks it up. Fortunately, it's USER_THEIR VAR_C1 key!`
        ],
        find_key_other: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! What will TARGET_THEY have to do to get it back?`,
            `As USER_TAG is chatting, USER_THEY spotUSER_S a shiny key that seems to match TARGET_TAG's VAR_C1!`
        ],
        find_key_self_mitten: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up... and just BARELY grasps it.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Despite having no fingers, USER_THEY still somehow manageUSER_S to pick it up.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in relief as USER_THEY just barely pick it up.`
        ],
        find_key_other_mitten: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had fingers... But! Despite no fingers, USER_THEY still manageUSER_S to pick it up!`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! USER_THEY_CAP batUSERS it around a little bit, but in the end, manageUSER_S to pick it up using both mittens!`
        ],
        find_key_otherimmediately: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! USER_THEY_CAP takeUSER_S some small pity on TARGET_THEM and giveUSER_S TARGET_THEM TARGET_THEIR key back to its rightful owner!`,
            `By a stroke of luck, USER_TAG finds TARGET_TAG's key and gives it back to it's original owner!`
        ],
        find_key_otherimmediately_mitten: [
            `Despite USER_THEIR mittens, USER_TAG spots TARGET_TAG's missing VAR_C1 key and picks it up, delivering it back to its rightful owner!`,
            `USER_TAG finds the key for TARGET_TAG's VAR_C1! Fortunately, USER_THEY USER_ISARE able to pick it up and hand it back to its owner.`
        ],
        find_keyfail_self: [
            `USER_TAG paws around in the dark, but just barely misses the key to USER_THEIR VAR_C1...`
        ],
        find_keyfail_other: [
            `USER_TAG paws around in the dark, but just barely misses the key to TARGET_TAG's VAR_C1...`
        ],
        find_keyfail_self_mitten: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up... and fails.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Unhelpfully, USER_THEY bat it because USER_THEY USER_HAVE no fingers.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in frustration as USER_THEY can't pick it up.`
        ],
        find_keyfail_other_mitten: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had fingers...`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! Not that USER_THEY can pick it up, of course, but it's the thought that counts.`
        ],
        find_keyfail_self_heavy: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up, but obviously fails because USER_THEIR arms are tightly bound.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Unhelpfully, USER_THEY bat it because USER_THEY USER_HAVE no arms.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in frustration as USER_THEY can't pick it up.`
        ],
        find_keyfail_other_heavy: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had arms to pick it up...`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! Not that USER_THEY can pick it up, of course, but it's the thought that counts.`
        ],
        spot_key_self: [
            `USER_TAG thinks USER_THEY can see a little glimmer on the ground that looks a lot like USER_THEIR VAR_C1 key. USER_THEY_CAP motionUSER_S towards TARGET_TAG to pick it up, but TARGET_THEY failTARGET_S to find it.`,
            `While talking, USER_TAG sees a glint on the ground that looks suspiciously like USER_THEIR VAR_C1 key. TARGET_TAG is busy though, so USER_THEY failUSER_S to point it out for TARGET_THEM.`
        ],
        spot_key_other: [
            `USER_TAG thinks USER_THEY see a glimmer on the ground, but the moment USER_THEY blinkUSER_S, it's gone again. Hopefully it wasn't the key to TARGET_TAG's VAR_C1.`,
            `USER_TAG wonders if USER_THEY actually saw TARGET_TAG's VAR_C1 key there, but that would be such a silly place to put it. TARGET_THEY_CAP would never put it there, afterall.`
        ],
        returnkeysfromfumble: [
            `Having had USER_THEIR fun, USER_TAG finally returns the key for TARGET_TAG's VAR_C1 to its rightful owner!`,
            `It was but a brief moment, but USER_TAG hands the key USER_THEY found for TARGET_TAG's VAR_C1 back to its owner.`
        ],
        given_key: [
            `USER_TAG is confused when it is given keys for TARGET_TAG. It makes a note to return them... eventually.`,
            `USER_TAG grins devillishly as it notices it has keys for TARGET_TAG. TARGET_THEY_CAP may have to subject TARGET_THEMSELF to some... *experiments*... to get them back!`,
            `USER_TAG smirks as TARGET_TAG is so subby that TARGET_THEY just can't help but throw keys at it. Such a good TARGET_PRAISEOBJECT!`,
            `It may be the purveyor of restraints, but USER_TAG still enjoys holding keys from silly TARGET_PRAISEOBJECTs that hand them to it.`
        ],
        return_key_collar: [
            `USER_TAG returns the keys for TARGET_TAG's collar after a while.`
        ],
        return_key_chastity: [
            `USER_TAG grants TARGET_TAG TARGET_THEIR chastity once more as it gives TARGET_THEM TARGET_THEIR keys.`
        ],
        return_key_chastitybra: [
            `USER_TAG gives TARGET_TAG TARGET_THEIR keys back for TARGET_THEIR breasts. Best not to lose them again!`
        ],
        return_key_gag: [
            `USER_TAG gives TARGET_TAG TARGET_THEIR keys back for TARGET_THEIR gag. Perhaps now TARGET_THEY could take it out and speak again!`
        ],
        return_key_headwear: [
            `USER_TAG hands TARGET_TAG the keys for TARGET_THEIR headwear. TARGET_THEY_CAP should try not to lose it again...`
        ],
        return_key_corset: [
            `USER_TAG hands TARGET_TAG the keys for TARGET_THEIR corset. TARGET_THEY_CAP might be able to breathe once more if TARGET_THEY avoidTARGET_S misplacing them again!`
        ],
        return_key_heavy: [
            `USER_TAG hands TARGET_TAG the keys for TARGET_THEIR bondage. Hopefully TARGET_THEY can use it and get free before the keys miraculously disappear again...`
        ],
        return_key_toy: [
            `USER_TAG hands TARGET_TAG the keys for TARGET_THEIR toy! TARGET_THEY_CAP might want to take it out before it gets *too* stimulating...`
        ],
        buttonboard: [
            `USER_TAG presses the VAR_C1 button. What doUSER_ES USER_THEY mean?`,
            `USER_TAG presses the VAR_C1 button. What is USER_THEY saying?`,
            `The VAR_C1 is pressed! What is USER_TAG saying?`,
            `USER_TAG is saying VAR_C1... Who knows what it means?`,
            `USER_TAG gently boops the VAR_C1 button!`,
            `In response, USER_TAG presses VAR_C1, of all the buttons!`,
            `USER_TAG stares at the buttons on the floor before pressing the VAR_C1 one!`,
            `USER_TAG looks over the buttons and the VAR_C1 one lights up!`,
            `USER_TAG nods a moment before tapping the VAR_C1 fiercely!`,
            `USER_TAG pretends the VAR_C1 button is a head and headpats it!`,
            `USER_TAG opts against words and presses the VAR_C1 button!`,
            `The VAR_C1 button lights up brilliantly as USER_TAG pushes it!`,
            `Its an important conversation and USER_TAG wants to contribute by pressing... VAR_C1`,
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG boops USER_THEIR head into the VAR_C1 button! A shame USER_THEY couldn't tell what it was.`,
            },
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG taps the VAR_C1 button at random because USER_THEY can't see.`,
            },
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG feels around in the darkness and runs USER_THEIR fingers on the VAR_C1 button.`,
            },
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG awkwardly bumps into a button that lights up with a VAR_C1. It's probably not deliberate.`,
            },
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG taps a button at random and manages to land on VAR_C1 by sheer dumb luck in USER_THEIR darkness.`,
            },
            {
                only: (t) => {
                    return (t.c2 == "blind");
                },
                text: `USER_TAG tries USER_THEIR very best to tap a button despite USER_THEIR blindfolded eyes. Hopefully VAR_C1 is exactly what USER_THEY meant to say.`,
            },
        ],
        remotecontrolshock_self_playful: [
            `USER_TAG presses a button and gasps in delight as USER_THEIR collar gives a telltale sound and an adrenaline inducing shock!`,
            `USER_TAG twists USER_THEIR body at the sensation as USER_THEY pressUSER_ES the button on USER_THEIR shock collar!`,
            {
                required: (t) => {
                    !getGag(t.serverID, t.interactionuser.id)
                },
                text: `USER_TAG bites USER_THEIR lip as the shock sends a thrilling sensation through USER_THEIR body!`
            }
        ],
        remotecontrolshock_self_painful: [
            `Letting out a small gasp, USER_TAG presses the big red button on the remote control to give a nasty shock!`,
            {
                required: (t) => {
                    return (Math.random() < 0.25);
                },
                text: `Obviously a pain slut, USER_TAG feverishly presses the red button on the remote for USER_THEIR shock collar, letting out a choked moan of delight!`,
            },
            {
                required: (t) => {
                    return (Math.random() < 0.25);
                },
                text: `USER_TAG must *really* enjoy the pain as USER_THEY decideUSER_S to press the button on USER_THEIR shock collar remote!`,
            },
        ],
        remotecontrolshock_other_playful: [
            `TARGET_TAG is suddenly interrupted as USER_TAG presses a button, giving TARGET_THEM a tingly sensation!`,
            `USER_TAG pulls out a remote and presses the flashing red button on it, causing TARGET_TAG to "eep!" as it buzzes a small shock to TARGET_THEM!`,
        ],
        remotecontrolshock_other_painful: [
            `USER_TAG grins deviously as USER_THEY pressUSER_ES a shiny red button on a remote. Immediately, TARGET_TAG yelps in pain as TARGET_THEIR collar delivers a nasty shock!`,
            `The remote's red button starts flashing, so USER_TAG decides to click it as one does with such buttons. TARGET_TAG gasps and a tear falls down TARGET_THEIR cheek as TARGET_THEIR collar shocks TARGET_THEM!`,
            {
                required: (t) => {
                    return (Math.random() < 0.25);
                },
                text: `USER_TAG, the sadist USER_THEY USER_ISARE, presses the shiny red button a few times! TARGET_TAG writhes under the torrent of shocks!`,
            },
        ],
        "bellcollar_1": [
            `USER_TAG's bell makes a tiny little jingle as USER_THEY moveUSER_S around the channel!`,
            `It's barely perceptible, but USER_TAG's collar makes a faint jingle!`,
            `USER_TAG's bell makes a very small little jingle! How cute!`,
            `'Jingle!' goes USER_TAG's little bell!`,
            `It can juuuuust barely be heard, but USER_TAG moves a little bit and jingles USER_THEIR collar!`,
            `-# Jingle\nUSER_TAG isn't very stealthy, but USER_THEY tried.`,
            `USER_TAG looks at something and a little movement of USER_THEIR neck jingles USER_THEIR collar!`,
            `-# Jinglejinglejingle!\nUSER_TAG tries to move around the channel sneakily. USER_THEY_CAP USER_ISARE totally invisible!`,
            `It's so small, it's so little, but there was definitely a little bell sound as USER_TAG moved!`,

        ],
        "bellcollar_2": [
            `Doubtless finding something bigger, USER_TAG's bell makes a slightly louder jangle!`,
            `USER_TAG's collar makes a jangle as USER_THEY moveUSER_S suddenly!`,
            `USER_TAG moves USER_THEIR neck to look at something, causing a slightly louder jangle!`,
        ],
        "bellcollar_3": [
            `Darting off around the channel, USER_TAG's bell makes a lot of noise as USER_THEY chaseUSER_S something!`,
            `A cacophony of jingles and jangles follows USER_TAG's tracks as USER_THEY zoomUSER_S around the channel!`,
            `USER_TAG clearly failed stealth class because USER_THEIR collar jingles and jangles *loudly!*`,
            `Jinglejinglejanglejinglejangle! USER_TAG moves around the channel with the grace of... something.`,
        ]
	};
    if (Array.isArray(generics[type])) {
        // Within the array, we want to handle the following cases:
        // - Standard strings
        // - Required strings via "required: (userID) => {}" -- When true, the phrase is included along with standard strings
        // - Only strings via "only: (userID) => {}" -- When any are true, only use these phrases
        //
        // For example, { only: () => { return data_in.c1.includes("Lipstick") }, `USER_TAG wipes off USER_THEIR VAR_C1` }
        // would allow only this phrase to be used when the chosen item is something Lipstick in the c1 slot.
        //
        // If there are *any* onlyphrases, then chosenphrases will not be used.
        let chosenphrases = [];
        let onlyphrases = [];
        let only = false;
        generics[type].forEach((a) => {
            if (typeof a == "string") {
                chosenphrases.push(a);
            } else {
                if (a.only != undefined && a.only(data_in)) {
                    onlyphrases.push(a.text);
                    only = true;
                } else if (a.required != undefined && a.required(data_in)) {
                    chosenphrases.push(a.text);
                }
            }
        });
        let outstring;
        if (only) {
            outstring = onlyphrases[Math.floor(Math.random() * onlyphrases.length)];
        } else {
            outstring = chosenphrases[Math.floor(Math.random() * chosenphrases.length)];
        }
        outstring = convertPronounsText(outstring, data_in);

        return outstring;
    } else {
        return "There was an error generating this text. No error, but the destination was not an array of strings. Please tell Enraa that the tree followed this path: " + props.join(", ");
    }

	//let chosentext = generics[type][Math.floor(generics[type].length * Math.random())];
	//return convertPronounsText(chosentext, data_in);
};

/* ----------------------------------
getText() -> Returns a full text depending on data
NOTE: data MUST be constructed in the same property
order as specified on the relevant texts string, which should
be referenced in the beginning of the data function. 
For example, to retrieve the chastity text with no heavy bondage,
chastity, held by self, you should construct the data like this:
	data: {
		textarray: "texts_chastity", // the array to retrieve from
		textdata: { interactionuser, targetuser, ...c1, c2, etc } // see convertPronounsText function

		noheavy: true,
		chastity: true,
		key_self: true
	}
These properties are constructed dynamically with a for... in loop 
and then retrieved from the array using texts_chastity["noheavy"]["chastity"]["key_self"] 
to get the particular array of texts for that condition. 

THE PROPERTY ORDER IS IMPORTANT TO ENSURE THE TEXT RETRIEVAL WORKS AS INTENDED.
-------------------------------------*/
function getText(data) {
	try {
		let textarray = data.textarray;
		let data_in = data.textdata;
        if (data_in.serverID == undefined) {
            data_in.serverID = data.serverID;
        }
		let props = [];
		for (k in data) {
			if (k != "textarray" && k != "textdata" && k != "serverID") {
				props.push(k); // Should create the same order.
			}
		}
		// At first I thought, a reducer might not be good performance.
		// Then I remembered, javascript passes *objects* and *arrays* by reference.
		// This is gonna be so clever.
		let sentencearr = getTextArrayKey(data);
        if (!sentencearr) {
            return `Something went wrong with retrieving the text. Please tell that the text array was ${textarray} and followed this path: ${props.join(", ")}`
        }
		/* so what is this thing doing? 
			It is iterating over each property and then returning the object at the named property.
			This should always end with an array AS LONG AS THE INPUT OBJECT IS CONSTRUCTED
			EXACTLY THE WAY THE TREE IS SET UP */
		if (Array.isArray(sentencearr)) {
			// Within the array, we want to handle the following cases:
			// - Standard strings
			// - Required strings via "required: (userID) => {}" -- When true, the phrase is included along with standard strings
			// - Only strings via "only: (userID) => {}" -- When any are true, only use these phrases
			//
			// For example, { only: () => { return data_in.c1.includes("Lipstick") }, `USER_TAG wipes off USER_THEIR VAR_C1` }
			// would allow only this phrase to be used when the chosen item is something Lipstick in the c1 slot.
			//
			// If there are *any* onlyphrases, then chosenphrases will not be used.
			let chosenphrases = [];
			let onlyphrases = [];
			let only = false;
			sentencearr.forEach((a) => {
				if (typeof a == "string") {
					chosenphrases.push(a);
				} else {
					if (a.only != undefined && a.only(data_in)) {
                        if (Array.isArray(a.text)) {
                            onlyphrases.push(a.text[Math.floor(Math.random() * a.text.length)]);
                        }
                        else {
                            onlyphrases.push(a.text);
                        }
						only = true;
					} else if (a.required != undefined && a.required(data_in)) {
                        if (Array.isArray(a.text)) {
                            chosenphrases.push(a.text[Math.floor(Math.random() * a.text.length)]);
                        }
                        else {
                            chosenphrases.push(a.text);
                        }
					}
				}
			});
			let outstring;
			if (only) {
				outstring = onlyphrases[Math.floor(Math.random() * onlyphrases.length)];
			} else {
				outstring = chosenphrases[Math.floor(Math.random() * chosenphrases.length)];
			}
			outstring = convertPronounsText(outstring, data_in);

			return outstring;
		} else {
			return "There was an error generating this text. No error, but the destination was not an array of strings. Please tell Enraa that the tree followed this path: " + props.join(", ");
		}
	} catch (err) {
		console.log(err);
		return "There was an error generating this text. See console error.";
	}
};

/******
 * Given a string, outputs a string with an abbreviated form. "Cloud of the Sanctuary" -> "CtS"
 * 
 * - (string) inputtext - The string to abbrviate
 * - (integer) minlength - Minimum length of each word to abbreviate. Defaults to 3.
 * ---
 * ##### Returns an abbreviation of the input string
 ******/
function abbreviate(inputtext, minlength = 3) {
    let outtext = ""
    inputtext.split(" ").forEach((textpart) => {
        if (textpart.length > Math.max(minlength-1, 0)) {
            outtext = `${outtext}${textpart.slice(0,1)}`
        }
    })
    return outtext
}

/******
 * For plans, I want to create a new getText that will access the text string at runtime as it is needed. First accesses might be slow, but js caches requires, so we should be fine to do it this way. 
 * This setup will also ensure any unused text arrays just simply are not loaded, as well as dynamically allowing new text arrays to be added.
 * 
 * Next, I want to add an emitEvent function structure for any getText where-in restraints and locks can receive all of the data supplied to getText, and have their output modified accordingly. 
 * An example might be to have a gag that appends to any struggle message with "*drools*". Obviously, any function that will do this needs to be synchronous. 
 * 
 * I also want to explore the possibility of identifying "a" and "an" before an inserted VAR_C and see if I can adjust to respect the proper form. Similarly, pluralized items such as "Wrist Cuffs"
 * may be handled differently in texts. I do not know if this can be accurately checked or handled. We'll have to see. 
 ******/

exports.getText = getText;
exports.getTextGeneric = getTextGeneric;
exports.abbreviate = abbreviate;
