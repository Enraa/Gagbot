const { getPronouns } = require("../../functions/getters/config/getPronouns");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { assignGag } = require("../../functions/setters/gag/assignGag");

function msgfunction(serverID, userid, data) {
    const curses = ["fuck", "fucking", "fuckin", "motherfucker", "damn", "dammit", "bitch", "shit", "bitchin'", "ass", "asshole", "arse", "goddammit", "piss", "dick", "dickhead", "damned", "bullshit", "fucked", "fucker", "crap", "hell", "cunt", "bollocks", "slut", "sluts", "idiot"];
    const uncouthreminders = [
        `<@${userid}> has quite the mouth, so unbecoming of a trainee maid! ${getPronouns(serverID, userid, "subject", true)} ${(getPronouns(serverID, userid, "subject") == "they") ? "have" : "has"} been gagged with a bar of soap to teach ${getPronouns(serverID, userid, "object")} how to speak properly!`,
        `Apparently forgetting that ${getPronouns(serverID, userid, "subject")} ${getPronouns(serverID, userid, "subject") == "they" ? "are" : "is"} on a training program, <@${userid}> has spoken foul language! A soap gag will hopefully correct this error.`,
        `A **good** maid does not use such unrefined language! <@${userid}> will wear a bar of soap while ${getPronouns(serverID, userid, "subject")} think${(getPronouns(serverID, userid, "subject") == "they") ? "" : "s"} about what ${getPronouns(serverID, userid, "subject")} said.`
    ]

    let cursesmap = curses.join("|");
	let regexpattern = new RegExp(`\\b(${cursesmap})\\b`, "i");

    if (regexpattern.test(data.outtext) && getRecentChannel(serverID, userid).valid) {
		// They are UNCOUTH! Their speech somehow included foul language
        // Gag them with the soap gag. 
        assignGag(serverID, userid, "soap", 8, userid);
        messageSendChannel(uncouthreminders[Math.floor(Math.random() * uncouthreminders.length)], getRecentChannel(serverID, userid).channelid);

		return;
	}
}

exports.msgfunction = msgfunction;