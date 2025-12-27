const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { mittentypes, getMittenName, getGag, assignMitten, getMitten } = require('./../functions/gagfunctions.js')
const { calculateTimeout } = require("./../functions/timefunctions.js")
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mitten')
		.setDescription('Put mittens on yourself, preventing /ungag on yourself and /gag on others')
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What flavor of helpless mittens to wear...')
            .setAutocomplete(true)
		)
        .addBooleanOption(opt => 
            opt.setName('list_all_restraints')
            .setDescription("Set to true to list all mittens. Does not bind you if TRUE.")
        ),
    async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let mittenstoreturn = mittentypes.slice(0,10)
			await interaction.respond(mittenstoreturn)
		}
		else {
            try {
                let mittens = process.mittentypes.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,10)
			    await interaction.respond(mittens)
            }
			catch (err) {
                console.log(err);
            }
		}
	},
    async execute(interaction) {
        try {
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            // List all mittens if set. 
            if (interaction.options.getBoolean('list_all_restraints')) {
                let restraints = mittentypes.map((h) => { return h.name }).sort()
                let outtext = '## Full list of Mittens:\n\n';
                for (let i = 0; i < restraints.length; i++) {
                    outtext = `${outtext}${restraints[i]}\n`
                }
                await interaction.reply({ content: `${outtext}`, flags: MessageFlags.Ephemeral })
                return;
            }
            let chosenmittens = interaction.options.getString('type')
            // Build data tree:
            let data = {
                textarray: "texts_mitten",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: interaction.user,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: getMittenName(interaction.user.id, chosenmittens)
                }
            }

            if (getHeavy(interaction.user.id)) {
                data.heavy = true
                interaction.reply(getText(data))
            }
            else if (getMitten(interaction.user.id)) {
                data.mitten = true
                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
            }
            else {
                // Not mittened
                data.nomitten = true
                if (chosenmittens) {
                    // Chose to wear named mittens
                    data.namedmitten = true
                    if (getGag(interaction.user.id)) {
                        // Wearing a gag already. 
                        data.gag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                    else {
                        // Not wearing a gag
                        data.nogag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                }
                else {
                    // Chose to wear regular mittens
                    data.nonamedmitten = true
                    if (getGag(interaction.user.id)) {
                        // Wearing a gag already. 
                        data.gag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                    else {
                        // Not wearing a gag
                        data.nogag = true
                        interaction.reply(getText(data))
                        assignMitten(interaction.user.id, chosenmittens);
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}