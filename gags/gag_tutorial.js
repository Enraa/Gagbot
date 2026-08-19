const { getUserVar } = require("../functions/getters/config/getUserVar");
const { convertPronounsText } = require("../functions/other/convertPronounsText");
const nlp = require("compromise");
const nlpSpeech = require("compromise-speech");
const { tutorialgaghinttexts } = require("../lists/tutorialgagmessages");
nlp.extend(nlpSpeech);

const messagebegin = (msg, msgTree, msgTreeMods, intensity) => {
    let silenced = {"isSilenced": false, id: msg.author.id, guildid: msg.guild.id, intensity: intensity, modified: false }
    msgTree.callFunc(garble,true,["rawText","moan"],[silenced])	// Run a function on the tree.
    if (silenced.modified) {
        msgTreeMods.modified = true;
    }
}

const garble = (text, parent, locarr, silent) => {
    let outtext = ``;

    if (!silent.isSilenced) {
        outtext = tutorialgaghinttexts[Math.floor(Math.random() * tutorialgaghinttexts.length)]
        silent.isSilenced = true;
        silent.modified = true;
    }

    return outtext;
};

exports.messagebegin = messagebegin;
exports.choicename = "Tutorial Gag";

exports.itemdescription = `The **Tutorial Gag** will provide helpful hints about using Gagbot! Messages will be something like: "Use **/ungag** to remove your gag!".`