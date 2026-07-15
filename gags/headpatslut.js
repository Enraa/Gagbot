const { getUserVar } = require("../functions/getters/config/getUserVar");
const { convertPronounsText } = require("../functions/other/convertPronounsText");
const { insertIntoAST } = require("../functions/other/insertIntoAST");

const headpatlines = [
    `USER_TAG needs a headpat...`,
    `Tilting USER_THEIR head towards the audience, USER_TAG silently begs for a headpat!`,
    `USER_TAG pleads with everyone to pat USER_THEIR head!`,
    `USER_TAG behaves like a good USER_PRAISEOBJECT and waits to get a headpat!`,
    `USER_TAG flushes when USER_THEY goUSER_ES to speak. So cute!`,
    `USER_TAG pretends to boop someone to try to get a headpat...`
]

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
    if (!getUserVar(msg.guild.id, msg.author.id, "headpatslutgag")) {
        let silenced = {"isSilenced": false, id: msg.author.id, guildid: msg.guild.id }
        msgTree.callFunc(garble,true,["rawText","moan"],[silenced])	// Run a function on the tree.
        msgTreeMods.modified = true;
    }
}

const garble = (text, parent, locarr, silent) => {
    if (!silent.isSilenced){
        silent.isSilenced = true
        insertIntoAST(parent, locarr, convertPronounsText(headpatlines[Math.floor(Math.random() * headpatlines.length)], { interactionuser: { id: silent.id }, serverID: silent.guildid }));
        return ``
    }
    else {
        return ``;
    }
};

exports.messagebegin = messagebegin;
exports.choicename = "Headpat Slut Gag";

exports.itemdescription = `The **Headpat Slut Gag** will make you beg for headpats when speaking. When receiving a headpat, you will be able to speak freely for 5 minutes. This duration is configurable in **/config** under **General**.`