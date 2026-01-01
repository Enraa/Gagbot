const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { mittentypes } = require('./../functions/gagfunctions.js')
const { heavytypes } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent, timelockChastityModalnew } = require('./../functions/interactivefunctions.js')
const { generateConfigModal, configoptions, getOption, setOption } = require('./../functions/configfunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
        .setDescription(`Configure settings...`),
	async execute(interaction) {
		try {			
			interaction.reply(generateConfigModal(interaction, "General", 0));
		}
		catch (err) {
			console.log(err)
		}
    },
	async interactionresponse(interaction) {
		try {
			console.log(interaction)
			let optionparts = interaction.customId.split("_");
			
			// We changed page, new page!
			if (optionparts[1] == "menuselector") {
				interaction.update(generateConfigModal(interaction, interaction.values[0].split("_")[1]));
			}
			else if (optionparts[1] == "pageopt") {
				// Frankly I hate arrays for this but lets break it down.
				// We retrieve all of the choices for the given configuration option, mapping their values.
				// We then find the current value and then increment it, resetting to 0 when out of range.
				// Then we assign it to setOption. This means that choices are chosen from top to bottom in a circle.
				let optionschoice = configoptions[optionparts[2]][optionparts[3]].choices.map((c) => c.value);
				let newindex = optionschoice.indexOf(getOption(interaction.user.id,optionparts[3])) + 1;
				if (newindex >= optionschoice.length) { newindex = 0 }
				setOption(interaction.user.id, optionparts[3], optionschoice[newindex])

				// After doing so, run the NEW option's select_function. 
				configoptions[optionparts[2]][optionparts[3]].choices[newindex].select_function(interaction.user.id)
				// Finally, reprompt the user, now with the new choice set. 
				interaction.update(generateConfigModal(interaction, optionparts[2]));
			}
		}
		catch (err) {
			console.log(err);
		}
	}
}