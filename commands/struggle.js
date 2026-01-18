const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { mittentypes, getMittenName, getGag, convertGagText, assignMitten, getMitten, getGagLast } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");
const { getHeadwear } = require('../functions/headwearfunctions.js');
const { getCorset } = require('../functions/corsetfunctions.js');
const { getChastity, getChastityName } = require('../functions/vibefunctions.js');
const { getCollar, getCollarName } = require('../functions/collarfunctions.js');

module.exports = {
    cooldown: 10,
	data: new SlashCommandBuilder()
		.setName('struggle')
		.setDescription('Struggle with one of your restraints...')
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('Which restraint to struggle with?')
            .setAutocomplete(true)
		),
    async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		try {
            let heavybondage = getHeavy(interaction.user.id);
            let gagbondage = getGagLast(interaction.user.id);
            let mittenbondage = getMitten(interaction.user.id);
            let chastitybondage = getChastity(interaction.user.id);
            let headbondage = getHeadwear(interaction.user.id);
            let corsetbondage = getCorset(interaction.user.id);
            let collarbondage = getCollar(interaction.user.id);

            let outopts = [];
            if (heavybondage) { outopts.push({ name: `Heavy Bondage: ${getHeavy(interaction.user.id).type}`, value: "heavy" }) } 
            if (gagbondage) { outopts.push({ name: `Gag: ${convertGagText(getGagLast(interaction.user.id))}`, value: "gag" }) } 
            if (mittenbondage) { outopts.push({ name: `Mittens${(mittenbondage.mittenname ? `: ${getMittenName(interaction.user.id)}` : "")}`, value: "mitten" }) } 
            if (chastitybondage) { outopts.push({ name: `Chastity${(chastitybondage.chastitytype ? `: ${getChastityName(interaction.user.id)}` : "")}`, value: "chastity" }) } 
            if (headbondage.length > 0) { outopts.push({ name: `Head Restraints`, value: "head" }) } 
            if (corsetbondage) { outopts.push({ name: `Corset`, value: "corset" }) } 
            if (collarbondage) { outopts.push({ name: `Collar${(collarbondage.collartype ? `: ${getCollarName(interaction.user.id)}` : "")}`, value: "collar" }) }
                                                                                                        
            if (outopts.length == 0) { 
                outopts = [{ name: "Nothing", value: "nothing" }]
            }
            else {
                outopts.push({ name: "Struggle with nothing in particular...", value: "nothing" })
            }
            await interaction.respond(outopts)
        }
        catch (err) {
            console.log(err);
        }
	},
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let heavybondage = getHeavy(interaction.user.id)?.type;
            let gagbondage = getGagLast(interaction.user.id);
            let mittenbondage = getMitten(interaction.user.id);
            let chastitybondage = getChastity(interaction.user.id);
            let headbondage = getHeadwear(interaction.user.id);
            let corsetbondage = getCorset(interaction.user.id);
            let collarbondage = getCollar(interaction.user.id);

            // Build data tree:
            let data = {
                textarray: "texts_struggle",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: interaction.user, // Doesn't really matter but we're adding to avoid a crash
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: convertGagText(getGagLast(interaction.user.id)),
                    c3: getMittenName(interaction.user.id) ?? "mittens",
                    c4: getChastityName(interaction.user.id) ?? "chastity belt",
                    c5: getCollarName(interaction.user.id) ?? "collar"
                }
            }

            let chosenopt = interaction.options.getString('type')

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
                interaction.reply(getText(data))
            }
            else if (chosenopt == "gag" && gagbondage) {
                data.gag = true;
                // Gags are influenced by heavy bondage or mittens. 
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (mittenbondage || (Math.random() > 0.5)) {
                        // Either mittened, or not using fingers or similar
                        data.nofingers = true;
                        interaction.reply(getText(data))
                    }
                    else if (mittenbondage && (Math.random() > 0.5)) {
                        // Mittened and random chance! 
                        data.mitten = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No mittens and ABLE TO USE FINGERS!
                        data.nomitten = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "mitten" && mittenbondage) {
                data.mitten = true;
                // Mittens are influenced by heavy bondage, inherently
                // BUT, lets add a 50% chance or guaranteed with gag to get a 
                // text that doesn't involve using teeth!
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (gagbondage || (Math.random() > 0.5)) {
                        // Either gagged, or not using teeth
                        data.nomouth = true;
                        interaction.reply(getText(data))
                    }
                    else if (gagbondage && (Math.random() > 0.5)) {
                        // Gagged and random chance! 
                        data.gag = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No gag and ABLE TO USE TEETH!
                        data.mouth = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "chastity" && chastitybondage) {
                data.chastity = true
                // Chastity is influenced by heavy bondage, inherently.
                // Added chance for dextrous fingers if not in mittens, like above with gags
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    // Because the number of responses vary so much, going to use 33% chance for mitten/finger text
                    data.noheavy = true;
                    if (mittenbondage || (Math.random() > 0.33)) {
                        // Either mittened, or not using fingers or similar
                        data.nofingers = true;
                        interaction.reply(getText(data))
                    }
                    else if (mittenbondage && (Math.random() > 0.66)) {
                        // Mittened and random chance! 
                        data.mitten = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No mittens and ABLE TO USE FINGERS!
                        data.nomitten = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "head" && headbondage.length > 0) {
                data.headwear = true
                // Headwear is influenced by heavy bondage, inherently.
                // Added chance for dextrous fingers if not in mittens, like above with gags
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (mittenbondage || (Math.random() > 0.5)) {
                        // Either mittened, or not using fingers or similar
                        data.nofingers = true;
                        interaction.reply(getText(data))
                    }
                    else if (mittenbondage && (Math.random() > 0.5)) {
                        // Mittened and random chance! 
                        data.mitten = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No mittens and ABLE TO USE FINGERS!
                        data.nomitten = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "corset" && corsetbondage) {
                data.corset = true
                // Corsets are influenced the same way as above. 
                // Added chance for dextrous fingers if not in mittens, like above with gags
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (mittenbondage || (Math.random() > 0.5)) {
                        // Either mittened, or not using fingers or similar
                        data.nofingers = true;
                        interaction.reply(getText(data))
                    }
                    else if (mittenbondage && (Math.random() > 0.5)) {
                        // Mittened and random chance! 
                        data.mitten = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No mittens and ABLE TO USE FINGERS!
                        data.nomitten = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (chosenopt == "collar" && collarbondage) {
                data.collar = true;
                // Finally, collars are similarly influenced!
                // Added chance for dextrous fingers if not in mittens, like above with gags
                if (heavybondage) {
                    // Heavy Bondage is disabling.
                    data.heavy = true;
                    interaction.reply(getText(data))
                }
                else {
                    data.noheavy = true;
                    if (mittenbondage || (Math.random() > 0.5)) {
                        // Either mittened, or not using fingers or similar
                        data.nofingers = true;
                        interaction.reply(getText(data))
                    }
                    else if (mittenbondage && (Math.random() > 0.5)) {
                        // Mittened and random chance! 
                        data.mitten = true
                        interaction.reply(getText(data))
                    }
                    else {
                        // No mittens and ABLE TO USE FINGERS!
                        data.nomitten = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else {
                data.nostruggle = true;
                interaction.reply(getText(data))
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}