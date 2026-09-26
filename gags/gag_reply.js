const { getUserVar } = require("../functions/getters/config/getUserVar");
const { insertIntoAST } = require("../functions/other/insertIntoAST");
const { setUserVar } = require("../functions/setters/config/setUserVar");
const { honorifictitles } = require("../lists/politetitles");
const { convertPronounsText } = require("../functions/other/convertPronounsText");

/********
 * Forces the wearer to speak only in replies to people. If the wearer is NOT replying, discard the entire gaggble 
 * content similar to polite titles.
 ********/

const silenttitles = [
    `*stumbles while trying to speak USER_THEIR mind...*`,
    `*tries to speak to the room but falls into a tiny mumble*`,
    `*trips over USER_THEIR words while trying to say something...*`,
    `*opens USER_THEIR mouth to speak, but isn't sure who to speak to...*`,
    `*starts mumbling, but doesn't have anything important to say*`,
    `*wants to say something, but doesn't know which statement to respond to*`,
    `*looks around absentmindedly as USER_THEY USER_ISARE uncertain who to reply to*`
];

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
	let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

	if (msg.type == "19") {
		// They were polite, don't touch it.
        //setUserVar(msg.guild.id, msg.member.id, "politeSubisPolite", Date.now() + 30000)
		return;
	}
    /*else if (getUserVar(msg.guild.id, msg.member.id, "politeSubisPolite") > Date.now()) {
        // They were polite within the last 30 seconds
        return;
    }*/
    else {
		let silenced = {"isSilenced": false}					// Store a bool in an object to pass by reference.
		msgTree.callFunc(noreplySub,true,["rawText","moan"],[silenced, msg])	// Run a function on the tree.
		if(silenced.isSilenced){
            msgTreeMods.modified = true
            //setUserVar(msg.guild.id, msg.member.id, "politeSubSilenceTime", Date.now() + 300000) // 5 mins of no silenced messages to clear
            //setUserVar(msg.guild.id, msg.member.id, "politeSubSilences", (getUserVar(msg.guild.id, msg.member.id, "politeSubSilences") ?? 0) + 1)
        }	// If the function caught anything, the message is modified.
		return;
	}
};

// Replace the first rawText field with a silenttitle, then purge all others.
const noreplySub = (text, parent, locarr, silent, msg) => {
	if (!silent.isSilenced){
		silent.isSilenced = true;
        let tex = convertPronounsText(silenttitles[Math.floor(Math.random() * silenttitles.length)], { serverID: msg.guild.id, interactionuser: msg.member, targetuser: msg.member })
        insertIntoAST(parent, locarr, tex);
		return "";
	}else{
		return "";
	}
}

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Reply Gag";

exports.itemdescription = `**Reply Gag** will prevent the wearer from saying anything except if they are replying to another message.`