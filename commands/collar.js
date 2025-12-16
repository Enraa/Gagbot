const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getCollar, assignCollar } = require('./../functions/collarfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, collarPermModal } = require('./../functions/interactivefunctions.js')


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
            if (getHeavy(interaction.user.id)) {
                if (getCollar(interaction.user.id)) {
                    await interaction.reply(`${interaction.user} crinks ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, trying to adjust ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it impossible to adjust!`)
                    return
                }
                else {
                    await interaction.reply(`${interaction.user} shifts ${getPronouns(interaction.user.id, "possessiveDeterminer")} cheek on a collar, yearning to put it on, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it incredibly difficult to put on!`)
                    return
                }
            }
            if (getCollar(interaction.user.id)) {
                await interaction.reply({ content: `You already have a collar on!`, flags: MessageFlags.Ephemeral })
                return;
            }
            let collarkeyholder = interaction.options.getUser('keyholder')
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
            if (getHeavy(interaction.user.id)) {
                if (getCollar(interaction.user.id)) {
                    interaction.reply(`${interaction.user} crinks ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, trying to adjust ${getPronouns(interaction.user.id, "possessiveDeterminer")} collar, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it impossible to adjust!`)
                }
                else {
                    interaction.reply(`${interaction.user} shifts ${getPronouns(interaction.user.id, "possessiveDeterminer")} cheek on a collar, yearning to put it on, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} makes it incredibly difficult to put on!`)
                }
            }
            else if (getCollar(interaction.user.id)) {
                // This should never happen, because we find out they have a collar on before the modal. 
                interaction.reply({ content: `You already have a collar on!`, flags: MessageFlags.Ephemeral })
            }
            else {
                if (collarkeyholder && (collarkeyholderonly == "t")) {
                    if (collarkeyholder != interaction.user.id) {
                        try {
                            interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, clicking a little lock in the lockable buckle and then hands <@${collarkeyholder}> the key!`)
                        }
                        catch (err) { console.log(err) }
                        assignCollar(interaction.user.id, collarkeyholder, { 
                            mitten: choice_mitten, 
                            chastity: choice_chastity, 
                            heavy: choice_heavy 
                        }, true);
                    }
                    else {
                        try {
                            interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, clicking a little lock in the lockable buckle and then hiding the key!`)
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
                        interaction.reply(`${interaction.user} puts a collar on ${getPronouns(interaction.user.id, "possessiveDeterminer")} neck, but neglects to lock it!`)
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