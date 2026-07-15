const { getUserVar } = require("../functions/getters/config/getUserVar");
const { insertIntoAST } = require("../functions/other/insertIntoAST");
const { setUserVar } = require("../functions/setters/config/setUserVar");

const honorifictitles = [
	// Oh god its hard to type these without caps
	"miss",
    "missus",
    "mister",
	"master",
	"masters",
	"sir",
    "ser",
	"sirs",
	"ma\'am",
	"maam",
    "madame",
    "madam",
    "milady",
    "milord",
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

const silenttitles = [`*looks down silently*`, `*tries to speak, but no words come out*`, `*nods without a word*`, `*looks down and to the side*`, `*twiddles thumbs meekly*`, `*pouts as the gag stops impolite speech*`, `*goes mute without an honorific*`, `*meeps but produces no audible words*`, `*casts eyes downward, like a good sub*`, `*blushes and mumbles something*`];

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {

	let garblemode = false;
	let textout = silenttitles[Math.floor(Math.random() * silenttitles.length)];

	let honorificsmap = honorifictitles.join("|");
	let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i");

	if (regexpattern.test(msg.content)) {
		// They were polite, don't touch it.
        setUserVar(msg.guild.id, msg.member.id, "politeSubisPolite", Date.now() + 30000)
		return;
	}
    else if (getUserVar(msg.guild.id, msg.member.id, "politeSubisPolite") > Date.now()) {
        // They were polite within the last 30 seconds
        return;
    }
    else {
		let silenced = {"isSilenced": false}					// Store a bool in an object to pass by reference.
		msgTree.callFunc(impoliteSub,true,["rawText","moan"],[silenced])	// Run a function on the tree.
		if(silenced.isSilenced){
            msgTreeMods.modified = true
            setUserVar(msg.guild.id, msg.member.id, "politeSubSilenceTime", Date.now() + 300000) // 5 mins of no silenced messages to clear
            setUserVar(msg.guild.id, msg.member.id, "politeSubSilences", (getUserVar(msg.guild.id, msg.member.id, "politeSubSilences") ?? 0) + 1)
        }	// If the function caught anything, the message is modified.
		return;
	}
};

// Replace the first rawText field with a silenttitle, then purge all others.
const impoliteSub = (text, parent, locarr, silent) => {
	if(!silent.isSilenced){
		silent.isSilenced = true;
        insertIntoAST(parent, locarr, silenttitles[Math.floor(Math.random() * silenttitles.length)]);
		return "";
	}else{
		return "";
	}
}

//exports.garbleText = garbleText;
exports.messagebegin = messagebegin;
exports.choicename = "Polite Sub Gag";

exports.itemdescription = `**Polite Sub Gag** will force you to use any of the following titles to speak. When using one, you will be permitted speech for 30 seconds. Not using a title will result in your speech discarded for an emote about stammering.\n\n**Permitted Honorific Titles:**\n${honorifictitles.join(", ")}`