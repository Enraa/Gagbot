const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes } = require('./../functions/heavyfunctions.js')
const { getCollar, getCollarPerm } = require('./../functions/collarfunctions.js')
const { getChastity, assignChastity } = require('./../functions/vibefunctions.js')
const { assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

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
            let collareduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            let heavybondagetype = interaction.options.getString('type') ? interaction.options.getString('type') : "armbinder_latex"
            let keyholderuser = interaction.options.getUser('keyholder') ? interaction.options.getUser('keyholder') : interaction.user

            // Build data tree:
            let data = {
                textarray: "texts_collarequip",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: collareduser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type 
                    c2: getHeavy(collareduser.id)?.type,  // collar wearer's heavy bondage type
                    c3: convertheavy(heavybondagetype), // New heavy bondage
                    c4: `<@${getChastity(collareduser.id)?.keyholder}>`, // collar wearer's chastity keyholder
                    c5: keyholderuser // new chastity belt keyholder, if any
                }
            }

            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                interaction.reply(getText(data));
            }
            else if (collareduser == interaction.user) {
                // Don't be cheeky. 
                data.noheavy = true
                data.tryingself = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
            else if (getCollar(collareduser.id)) {
                data.noheavy = true
                data.collar = true
                if ((getCollar(collareduser.id).keyholder == interaction.user) || (!getCollar(collareduser.id).keyholder_only)) {
                    // Either we're a keyholder or it's a free user collar. 
                    data.key = true
                    if (actiontotake == "mittens") {
                        data.mitten = true
                        if (getCollarPerm(collareduser.id, "mitten")) {
                            if (getMitten(collareduser.id)) {
                                data.alreadyworn = true
                                interaction.reply({ content: `${collareduser} is already wearing mittens!`, flags: MessageFlags.Ephemeral })
                            }
                            else {
                                data.allowed = true
                                interaction.reply(`${interaction.user} grabs ${collareduser}'s hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away ${getPronouns(collareduser.id, "possessiveDeterminer")} hands!`)
                                assignMitten(collareduser.id);
                            }
                        }
                        else {
                            data.notallowed = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else if (actiontotake == "heavy") {
                        data.heavybondage = true
                        if (getCollarPerm(collareduser.id, "heavy")) {
                            if (getHeavy(collareduser.id)) {
                                data.alreadyworn = true
                                interaction.reply({ content: `${collareduser} is already in bondage, wearing a ${getHeavy(collareduser.id).type}!`, flags: MessageFlags.Ephemeral })
                            }
                            else {
                                data.allowed = true
                                interaction.reply(getText(data))
                                assignHeavy(collareduser.id, heavybondagetype)
                            }
                        }
                        else {
                            data.notallowed = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else if (actiontotake == "chastity") {
                        data.chastity = true
                        if (getCollarPerm(collareduser.id, "chastity")) {
                            if (getChastity(collareduser.id)) {
                                // Cant equip it on them 
                                data.alreadyworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                            else {
                                // we can equip this on them
                                data.allowed = true
                                if (keyholderuser == interaction.user) {
                                    data.key_self = true
                                    interaction.reply(getText(data))
                                    assignChastity(collareduser.id, keyholderuser.id)
                                }
                                else {
                                    data.key_other = true
                                    interaction.reply(getText(data))
                                    assignChastity(collareduser.id, keyholderuser.id)
                                }
                            }
                        }
                        else {
                            data.notallowed = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    data.nokey = true
                    // We don't have permission to play with that collar.
                    interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                }
            }
            else {
                // They aren't wearing a collar.
                data.noheavy = true
                data.nocollar = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}