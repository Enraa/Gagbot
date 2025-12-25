const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getCollar, assignCollar } = require('./../functions/collarfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, collarPermModal } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('collar')
		.setDescription(`Put a collar on, allowing others to /chastity, /heavy and /mitten you`)
		.addUserOption(opt =>
			opt.setName('keyholder')
			.setDescription('Who can do anything to you (leave blank for anyone)')
		),
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let collarkeyholder = interaction.options.getUser('keyholder')

            // Build data tree:
            let data = {
                textarray: "texts_collar",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: interaction.options.getUser('keyholder'),
                    c1: getHeavy(interaction.user.id)?.type // heavy bondage type 
                }
            }

            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                if (getCollar(interaction.user.id)) {
                    data.collar = true
                    await interaction.reply(getText(data))
                    return
                }
                else {
                    data.nocollar = true
                    await interaction.reply(getText(data))
                    return
                }
            }
            if (getCollar(interaction.user.id)) {
                data.noheavy = true
                data.alreadycollared = true
                await interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                return;
            }
            
            if (collarkeyholder) {
                //interaction.deferReply();
                await interaction.showModal(collarPermModal(interaction, collarkeyholder))
            }
            else {
                //interaction.deferReply();
                await interaction.showModal(collarPermModal(interaction, interaction.user, true))
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    async modalexecute(interaction) {
        try {
            let collarkeyholder = interaction.customId.split("_")[1] // Note this is THE ID, we need to adjust our code
            let collarkeyholderonly = interaction.customId.split("_")[2] // t or f
            let choice_mitten = (interaction.fields.getStringSelectValues('mitten') == "mitten_yes") ? true : false
            let choice_chastity = (interaction.fields.getStringSelectValues('chastity') == "chastity_yes") ? true : false
            let choice_heavy = (interaction.fields.getStringSelectValues('heavy') == "heavy_yes") ? true : false

            console.log(`${choice_mitten}, ${choice_chastity}, ${choice_heavy}`);
            //await interaction.reply("Enraa is testing if a collar was put on successfully! She chose: " + `${choice_mitten}, ${choice_chastity}, ${choice_heavy}`)
            
            // Build data tree:
            let data = {
                textarray: "texts_collar",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: await interaction.client.users.fetch(collarkeyholder), // To fetch the target user object
                    c1: getHeavy(interaction.user.id)?.type // heavy bondage type 
                }
            }
            
            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                if (getCollar(interaction.user.id)) {
                    data.collar = true
                    interaction.reply(getText(data))
                }
                else {
                    data.nocollar = true
                    interaction.reply(getText(data))
                }
            }
            else if (getCollar(interaction.user.id)) {
                // This should never happen, because we find out they have a collar on before the modal. 
                data.noheavy = true
                data.alreadycollared = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
            else {
                data.noheavy = true
                if (collarkeyholder && (collarkeyholderonly == "t")) {
                    if (collarkeyholder != interaction.user.id) {
                        // Locking collar and giving someone else the key
                        try {
                            data.key_other = true
                            interaction.reply(getText(data))
                        }
                        catch (err) { console.log(err) }
                        assignCollar(interaction.user.id, collarkeyholder, { 
                            mitten: choice_mitten, 
                            chastity: choice_chastity, 
                            heavy: choice_heavy 
                        }, true);
                    }
                    else {
                        // Locking collar and keeping the key
                        try {
                            data.key_self = true
                            interaction.reply(getText(data))
                        }
                        catch (err) { console.log(err) }
                        assignCollar(interaction.user.id, collarkeyholder, { 
                            mitten: choice_mitten, 
                            chastity: choice_chastity, 
                            heavy: choice_heavy 
                        }, true);
                    }
                }
                else {
                    try {
                        // Not locking collar. 
                        data.unlocked = true
                        interaction.reply(getText(data))
                    }
                    catch (err) { console.log(err) }
                    assignCollar(interaction.user.id, interaction.user.id, { 
                            mitten: choice_mitten, 
                            chastity: choice_chastity, 
                            heavy: choice_heavy 
                        }, false);
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}