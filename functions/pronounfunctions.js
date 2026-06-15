const { ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, ComponentType } = require("discord.js");
const { ActionRowBuilder } = require("@discordjs/builders");
const { setPronouns } = require("./setters/config/setPronouns.js");

// Pronoun types
const pronounsMap = new Map([
	["she/her", { subject: "she", object: "her", possessive: "hers", possessiveDeterminer: "her", reflexive: "herself", subjectIs: "she's", subjectWill: "she'll" }],
	["he/him", { subject: "he", object: "him", possessive: "his", possessiveDeterminer: "his", reflexive: "himself", subjectIs: "he's", subjectWill: "he'll" }],
	["they/them", { subject: "they", object: "them", possessive: "theirs", possessiveDeterminer: "their", reflexive: "themself", subjectIs: "they're", subjectWill: "they'll" }],
	["it/its", { subject: "it", object: "it", possessive: "its", possessiveDeterminer: "its", reflexive: "itself", subjectIs: "it's", subjectWill: "it'll" }],
]);

const remindPronouns = async (user) => {
    if (process.recentlyremindedpronouns == undefined) {
        process.recentlyremindedpronouns = {}
    }
    if (!process.recentlyremindedpronouns[user] && (user != process.client.user.id)) {
        try {
            process.recentlyremindedpronouns[user] = true
            setTimeout(() => {
                process.recentlyremindedpronouns[user] = false;
            }, 900000)
            let userobject = await process.client.users.fetch(user)
            let buttons = [new ButtonBuilder().setCustomId("sheher").setLabel("She/Her").setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId("hehim").setLabel("He/Him").setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId("theythem").setLabel("They/Them").setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId("itits").setLabel("It/Its").setStyle(ButtonStyle.Secondary)];
            let pronounremindertext = `This bot uses gendered language for roleplay texts and output to individuals. Your pronouns currently are not set in the bot. Please click an option below to set them:`
            let dmchannel = await userobject.createDM();
            await dmchannel
                .send({ content: `${pronounremindertext}`, components: [new ActionRowBuilder().addComponents(...buttons)]})
                .then((mess) => {
                    const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 900_000, max: 1 });
                    collector.on("collect", async (i) => {
                        console.log(i);
                        if (i.customId == "sheher") {
                            setPronouns(user, "she/her")
                            await i.update({ content: 'Set your pronouns to She/Hers!', components: [] })
                        }
                        else if (i.customId == "hehim") {
                            setPronouns(user, "he/him")
                            await i.update({ content: 'Set your pronouns to He/Him!', components: [] })
                        }
                        else if (i.customId == "theythem") {
                            setPronouns(user, "they/them")
                            await i.update({ content: 'Set your pronouns to They/Them!', components: [] })
                        }
                        else if (i.customId == "itits") {
                            setPronouns(user, "it/its")
                            await i.update({ content: 'Set your pronouns to It/Its!', components: [] })
                        }
                    });
                    collector.on("end", async (collected) => {
                        // timed out
                        if (collected.length == 0) {
                            await i.update({ content: 'Timed Out. Please set your pronouns in the bot.', components: [] })
                        }
                    });
                })
        }
        catch (err) {
            console.log(err);
        }
    }
}

exports.pronounsMap = pronounsMap;
exports.remindPronouns = remindPronouns;