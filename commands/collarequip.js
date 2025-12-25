const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes } = require('./../functions/heavyfunctions.js')
const { getCollar, getCollarPerm } = require('./../functions/collarfunctions.js')
const { getChastity, assignChastity } = require('./../functions/vibefunctions.js')
const { assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('collarequip')
		.setDescription(`Put chastity, mittens or heavy bondage on someone with a collar`)
        .addSubcommand((subcommand) => 
            subcommand.setName('mittens')
                .setDescription('Apply Mittens...')
                .addUserOption(opt => 
                    opt.setName('user')
                    .setDescription("To who?")
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('heavy')
                .setDescription('Apply Heavy Bondage...')
                .addUserOption(opt => 
                    opt.setName('user')
                       .setDescription("To who?")
                       .setRequired(true)
                )
                .addStringOption(opt =>
                    opt.setName('type')
                    .setDescription("Which Restraint?")
                    //.addChoices(...commandsheavy)
                    //.setRequired(true)
                    .setAutocomplete(true)
                )
                .addBooleanOption(opt => 
                    opt.setName('list_all_restraints')
                    .setDescription("Set to true to list all restraints. Does not bind the collar wearer if TRUE.")
                )
        )
        .addSubcommand((subcommand) => 
            subcommand.setName('chastity')
                .setDescription('Apply Chastity...')
                .addUserOption(opt => 
                    opt.setName('user')
                       .setDescription("To who?")
                       .setRequired(true)
                )
                .addUserOption(opt =>
                    opt.setName('keyholder')
                    .setDescription("Who should be the keyholder?")
                )
        ),
    async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let heaviestoreturn = [
				{ name: "Latex Armbinder", value: "armbinder_latex" },
				{ name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex" },
				{ name: "Wolfbinder", value: "armbinder_wolf" },
				{ name: "Ancient Armbinder", value: "armbinder_ancient" },
				{ name: "High Security Armbinder", value: "armbinder_secure" },
				{ name: "Latex Boxbinder", value: "boxbinder_latex" },
				{ name: "Comfy Straitjacket", value: "straitjacket_comfy" },
				{ name: "Maid Straitjacket", value: "straitjacket_maid" },
				{ name: "Doll Straitjacket", value: "straitjacket_doll" },
				{ name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex" },
			]
			await interaction.respond(heaviestoreturn)
		}
		else {
			let heavies = process.heavytypes.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,10)
			await interaction.respond(heavies)
		}
	},
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            // List all heavy restraints if this is set. 
            if (interaction.options.getBoolean('list_all_restraints')) {
                let restraints = heavytypes.map((h) => { return h.name }).sort()
                let outtext = '## Full list of Heavy Restraints:\n\n';
                for (let i = 0; i < restraints.length; i++) {
                    outtext = `${outtext}${restraints[i]}\n`
                }
                await interaction.reply({ content: `${outtext}`, flags: MessageFlags.Ephemeral })
                return;
            }
            let actiontotake = interaction.options.getSubcommand();
            let collareduser = interaction.options.getUser('user')
            let heavybondagetype = interaction.options.getString('type')
            let keyholderuser = interaction.options.getUser('keyholder') ? interaction.options.getUser('keyholder') : interaction.user
            if (getHeavy(interaction.user.id)) {
                interaction.reply(`${interaction.user} tugs against ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to get ${getPronouns(interaction.user.id, "possessiveDeterminer")} hands on ${collareduser}'s collar, but ${getPronouns(collareduser.id, "subject")} can't reach it!`)
            }
            else if (collareduser == interaction.user) {
                // Don't be cheeky. 
                interaction.reply({ content: `You can't do anything with your own collar!\n-# Don't be cheeky.`, flags: MessageFlags.Ephemeral })
            }
            else if (getCollar(collareduser.id)) {
                if ((getCollar(collareduser.id).keyholder == interaction.user) || (!getCollar(collareduser.id).keyholder_only)) {
                    // Either we're a keyholder or it's a free user collar. 
                    if (actiontotake == "mittens") {
                        if (getCollarPerm(collareduser.id, "mitten")) {
                            if (getMitten(collareduser.id)) {
                                interaction.reply({ content: `${collareduser} is already wearing mittens!`, flags: MessageFlags.Ephemeral })
                            }
                            else {
                                interaction.reply(`${interaction.user} grabs ${collareduser}'s hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away ${getPronouns(collareduser.id, "possessiveDeterminer")} hands!`)
                                assignMitten(collareduser.id);
                            }
                        }
                        else {
                            interaction.reply({ content: `${collareduser}'s collar does not allow you to mitten ${getPronouns(collareduser.id, "object")}!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else if (actiontotake == "heavy") {
                        if (getCollarPerm(collareduser.id, "heavy")) {
                            if (getHeavy(collareduser.id)) {
                                interaction.reply({ content: `${collareduser} is already in bondage, wearing a ${getHeavy(collareduser.id).type}!`, flags: MessageFlags.Ephemeral })
                            }
                            else {
                                interaction.reply(`${interaction.user} pulls a ${convertheavy(heavybondagetype)} out and grabs ${collareduser}, forcing ${getPronouns(collareduser.id, "possessiveDeterminer")} arms and hands into the tight restraint! ${getPronouns(collareduser.id, "subject", true)} squirm${(getPronouns(collareduser.id, "subject") != "they") ? "s" : ""} in protest, but ${getPronouns(collareduser.id, "subject")} can't do anything about it!`)
                                assignHeavy(collareduser.id, heavybondagetype)
                            }
                        }
                        else {
                            interaction.reply({ content: `${collareduser}'s collar does not allow you to put ${getPronouns(collareduser.id, "object")} in heavy bondage!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                    else if (actiontotake == "chastity") {
                        if (getCollarPerm(collareduser.id, "chastity")) {
                            if (getChastity(collareduser.id)) {
                                interaction.reply({ content: `${collareduser} is already in a chastity belt, with keys held by <@${getChastity(collareduser.id).keyholder}>!`, flags: MessageFlags.Ephemeral })
                            }
                            else {
                                if (keyholderuser == interaction.user) {
                                    interaction.reply(`${interaction.user} grabs ${collareduser} and wraps a chastity belt around ${getPronouns(collareduser.id, "possessiveDeterminer")} waist and clicking the lock shut before ${getPronouns(collareduser.id, "subject")} can even react!`)
                                    assignChastity(collareduser.id, keyholderuser.id)
                                }
                                else {
                                    interaction.reply(`${interaction.user} grabs ${collareduser} and wraps a chastity belt around ${getPronouns(collareduser.id, "possessiveDeterminer")} waist before clicking the lock shut and tossing the key over to ${keyholderuser}! ${getPronouns(collareduser.id, "subject", true)} will no doubt have to earn ${getPronouns(collareduser.id, "possessiveDeterminer")} chastity back!`)
                                    assignChastity(collareduser.id, keyholderuser.id)
                                }
                            }
                        }
                        else {
                            interaction.reply({ content: `${collareduser}'s collar does not allow you to put ${getPronouns(collareduser.id, "object")} in chastity!`, flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // We don't have permission to play with that collar.
                    interaction.reply({ content: `You don't have the key to ${collareduser}'s collar!`, flags: MessageFlags.Ephemeral })
                }
            }
            else {
                // They aren't wearing a collar.
                interaction.reply({ content: `${collareduser} is not wearing a collar!`, flags: MessageFlags.Ephemeral })
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}