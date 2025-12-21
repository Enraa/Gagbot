const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy, assignHeavy, commandsheavy, convertheavy, heavytypes } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('heavy')
        .setDescription(`Put heavy bondage on, preventing the use of any command`)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What flavor of helpless restraint to wear...')
			//.addChoices(...commandsheavy)
            .setAutocomplete(true)
		)
        .addBooleanOption(opt => 
            opt.setName('list_all_restraints')
            .setDescription("Set to true to list all restraints. Does not bind you if TRUE.")
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
            // List all heavy restraints if set. 
            if (interaction.options.getBoolean('list_all_restraints')) {
                let restraints = heavytypes.map((h) => { return h.name }).sort()
                let outtext = '## Full list of Heavy Restraints:\n\n';
                for (let i = 0; i < restraints.length; i++) {
                    outtext = `${outtext}${restraints[i]}\n`
                }
                await interaction.reply({ content: `${outtext}`, flags: MessageFlags.Ephemeral })
                return;
            }
            let heavychoice = interaction.options.getString('type') ? interaction.options.getString('type') : "armbinder_latex"
            if (getHeavy(interaction.user.id)) {
                interaction.reply(`${interaction.user} writhes in ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}, trying to change ${getPronouns(interaction.user.id, "possessiveDeterminer")} bondage, but may need some help!`)
            }
            else {
                interaction.reply(`${interaction.user} slips into a ${convertheavy(heavychoice)}, rendering ${getPronouns(interaction.user.id, "possessiveDeterminer")} arms and hands completely useless!`)
                assignHeavy(interaction.user.id, heavychoice)
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}