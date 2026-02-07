const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar, getUserVar } = require("../../functions/usercontext");

function msgfunction(userid, data) {
    const honorifictitles = [
        // Oh god its hard to type these without caps
        "miss",
        "master",
        "masters",
        "sir",
        "sirs",
        "ma\'am",
        "maam",
        "lady",
        "ladies",
        "lord",
        "lords",
        "queen",
        "queens",
        "king",
        "kings",
        "mistress",
        "mistresses",
        "goddess",
        "goddesses",
        "maitresse",
        "administrator",
        "administrators",
        "mommy",
        "mommies",
        "daddy",
        "daddies",
        "mxtress",
        "overseer",
        "headmaid",
        "head\ maid",
        "mx",
        "duke",
        "dukes",
        "dame",
        "count",
        "overlord",
        "(\\w|\\d)+-sama",
        "(\\w|\\d)+-sensei",
        "(\\w|\\d)+-san",
        "(\\w|\\d)+-senpai",
    ];

    let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

    if (regexpattern.test(data.msgcontent)) {
		// They were polite, make them horny for 3 minutes.
        // This will be scaled HIGHLY over on the vibe side.
        // If they have a politesubvibe going and its undefined, then send a message
        if (getUserVar(userid, "politeSubVibeTime") == undefined) {
            if (process.recentmessages[userid]) {
                try {
                    messageSendChannel(`<@${userid}>'s Polite Vibe turns on as the honorific is spoken!`, process.recentmessages[userid])
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        setUserVar(userid, "politeSubVibeTime", Date.now() + 180000)
		return;
	}
}

async function functiontick(userID) {
    if (getUserVar(userID, "politeSubVibeTime") < Date.now()) {
        console.log(`Ending polite vibe for ${userID}`)
        setUserVar(userID, "politeSubVibeTime", undefined)
    }
}

exports.functiontick = functiontick;
exports.msgfunction = msgfunction;