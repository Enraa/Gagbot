const { getChastity } = require("../../functions/getters/chastity/getChastity");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra");
const { getChastityBraName } = require("../../functions/getters/chastity/getChastityBraName");
const { getChastityName } = require("../../functions/getters/chastity/getChastityName");
const { getCollar } = require("../../functions/getters/collar/getCollar");
const { getCollarName } = require("../../functions/getters/collar/getCollarName");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getCorset } = require("../../functions/getters/corset/getCorset");
const { getGagLast } = require("../../functions/getters/gag/getGagLast");
const { convertGagText } = require("../../functions/getters/gag/getGagName");
const { getHeadwear } = require("../../functions/getters/headwear/getHeadwear");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy");
const { getMitten } = require("../../functions/getters/mitten/getMitten");
const { getMittenName } = require("../../functions/getters/mitten/getMittenName");
const { messageSendChannel } = require("../../functions/messagefunctions");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { getText } = require("../../functions/textfunctions");

exports.tick = async (userID, data) => {
    try {
        // Cancel until the user has said AT LEAST three things or has waited long enough. 
        if (getUserVar(userID, "struggleCollarMsgs") < 5) { return }
        if (getUserVar(userID, "struggleCollarDelay") >= Date.now()) { return }

        let heavybondage = getHeavy(userID)?.displayname;
        let gagbondage = getGagLast(userID);
        let mittenbondage = getMitten(userID);
        let chastitybondage = getChastity(userID);
        let chastitybrabondage = getChastityBra(userID)
        let headbondage = getHeadwear(userID);
        let corsetbondage = getCorset(userID);
        let collarbondage = getCollar(userID);

        let chooseopts = [];
        if (heavybondage) { chooseopts.push("heavy") }
        if (gagbondage) { chooseopts.push("gag") }
        if (mittenbondage) { chooseopts.push("mitten") }
        if (chastitybondage) { chooseopts.push("chastity") }
        if (chastitybrabondage) { chooseopts.push("chastitybra") }
        if (headbondage) { chooseopts.push("head") }
        if (corsetbondage) { chooseopts.push("corset") }
        if (collarbondage) { chooseopts.push("collar") }

        // Build data tree:
        let data = {
            textarray: "texts_struggle",
            textdata: {
                interactionuser: { id: userID },
                targetuser: { id: userID }, // Doesn't really matter but we're adding to avoid a crash
                c1: getHeavy(userID)?.displayname, // heavy bondage type
                c2: convertGagText(getGagLast(userID)),
                c3: getMittenName(userID) ?? "mittens",
                c4: getChastityName(userID) ?? "chastity belt",
                c5: getCollarName(userID) ?? "collar",
                c6: getChastityBraName(userID) ?? "chastity bra"
            },
        };

        let chosenopt = chooseopts[Math.floor(Math.random() * chooseopts.length)];

        /*if (!chosenopt) {
            // Something went CRITICALLY wrong. Eject, eject!
            interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral })
            return;
        }*/

        // This way of doing it is gonna be fucky.
        // From the top. Lets do an if/else for what kind we chose
        // heavy, gag, mitten, chastity, head, corset, collar
        if (chosenopt == "heavy" && heavybondage) {
            data.heavy = true;
            // Heavy Bondage is... pretty uniquely only influenced by itself.
            // It will also only ever have named bondage.
            messageSendChannel(getText(data), process.recentmessages[userID])
        } else if (chosenopt == "gag" && gagbondage) {
            data.gag = true;
            // Gags are influenced by heavy bondage or mittens.
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.5) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.5) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "mitten" && mittenbondage) {
            data.mitten = true;
            // Mittens are influenced by heavy bondage, inherently
            // BUT, lets add a 50% chance or guaranteed with gag to get a
            // text that doesn't involve using teeth!
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                data.noheavy = true;
                if (gagbondage || Math.random() > 0.5) {
                    // Either gagged, or not using teeth
                    data.nomouth = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (gagbondage && Math.random() > 0.5) {
                    // Gagged and random chance!
                    data.gag = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No gag and ABLE TO USE TEETH!
                    data.mouth = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "chastity" && chastitybondage) {
            data.chastity = true;
            // Chastity is influenced by heavy bondage, inherently.
            // Added chance for dextrous fingers if not in mittens, like above with gags
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                // Because the number of responses vary so much, going to use 33% chance for mitten/finger text
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.33) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.66) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "chastitybra" && chastitybrabondage) {
            data.chastitybra = true;
            // Chastity is influenced by heavy bondage, inherently.
            // Added chance for dextrous fingers if not in mittens, like above with gags
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                // Because the number of responses vary so much, going to use 33% chance for mitten/finger text
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.5) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.5) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "head" && headbondage.length > 0) {
            data.headwear = true;
            // Headwear is influenced by heavy bondage, inherently.
            // Added chance for dextrous fingers if not in mittens, like above with gags
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.5) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.5) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "corset" && corsetbondage) {
            data.corset = true;
            // Corsets are influenced the same way as above.
            // Added chance for dextrous fingers if not in mittens, like above with gags
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.5) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.5) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        } else if (chosenopt == "collar" && collarbondage) {
            data.collar = true;
            // Finally, collars are similarly influenced!
            // Added chance for dextrous fingers if not in mittens, like above with gags
            if (heavybondage) {
                // Heavy Bondage is disabling.
                data.heavy = true;
                messageSendChannel(getText(data), process.recentmessages[userID]);
            } else {
                data.noheavy = true;
                if (mittenbondage || Math.random() > 0.5) {
                    // Either mittened, or not using fingers or similar
                    data.nofingers = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else if (mittenbondage && Math.random() > 0.5) {
                    // Mittened and random chance!
                    data.mitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                } else {
                    // No mittens and ABLE TO USE FINGERS!
                    data.nomitten = true;
                    messageSendChannel(getText(data), process.recentmessages[userID]);
                }
            }
        }

        // Wait between 4 and 14 minutes for another struggle. 
        setUserVar(userID, "struggleCollarDelay", Date.now() + 240000 + Math.floor(Math.random() * 600000))
        setUserVar(userID, "struggleCollarMsgs", 0); 
    } catch (err) {
        console.log(err);
    }
}

exports.msgfunction = (userid, data) => {
    setUserVar(userid, "struggleCollarMsgs", (getUserVar(userid, "struggleCollarMsgs") ?? 1) + 1); 
}