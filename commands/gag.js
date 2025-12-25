const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { assignGag, getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')

// Grab all the command files from the commands directory
const gagtypes = [];
const commandsPath = path.join(__dirname, '..', 'gags');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Push the gag name over to the choice array. 
for (const file of commandFiles) {
    const gag = require(`./../gags/${file}`);
	gagtypes.push(
        { name: gag.choicename, value: file.replace('.js', '') }
    );
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gag')
		.setDescription('Apply a gag to the user')
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('The user to gag')
        )
		.addStringOption(opt =>
			opt.setName('gag')
			.setDescription('Type of gag to use')
			.addChoices(...gagtypes)
		)
		.addNumberOption((opt) => 
			opt.setName('intensity')
			.setDescription("How tightly to gag. Range 1-10")
			.setMinValue(1)
			.setMaxValue(10)
		),
    async execute(interaction) {
		try {
			let gaggeduser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(gaggeduser.id)?.mainconsent) {
				await handleConsent(interaction, gaggeduser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let gagtype = interaction.options.getString('gag') ? interaction.options.getString('gag') : 'ball'
			let gagintensity = interaction.options.getNumber('intensity') ? interaction.options.getNumber('intensity') : 5
			let gagname = gagtypes.find(g => g.value == gagtype).name;
			let intensitytext = " loosely"
			try {
				let gagfile = require(path.join(commandsPath, `${gagtype}.js`))
				if (gagfile.intensity) {
					intensitytext = gagfile.intensity(gagintensity)
				}
			}
			catch (err) { console.log(err) }
			if (intensitytext == " loosely") {
				if (gagintensity > 2) {
				intensitytext = " moderately loosely"
				}
				if (gagintensity > 4) {
					intensitytext = " moderately tightly"
				}
				if (gagintensity > 7) {
					intensitytext = " tightly"
				}
				if (gagintensity > 9) {
					intensitytext = " as tightly as possible"
				}
			}
			if (getHeavy(interaction.user.id)) {
				interaction.reply(`${interaction.user} eyes a ${gagname}, but cannot put it on because of ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type}!`)
			}
			else if (getMitten(interaction.user.id)) {
				// We are wearing mittens, we can't hold onto the straps!
				if (interaction.user.id != gaggeduser.id) {
					interaction.reply(`${interaction.user} attempts to gag someone, but fumbles at holding the gag in ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens!`)
				}
				else {
					interaction.reply(`${interaction.user} attempts to gag ${getPronouns(interaction.user.id, "reflexive")}, but can't get a good grip on the straps with ${getPronouns(interaction.user.id, "possessiveDeterminer")} mittens!`)
				}
			}
			else {
				// We have fingers! 
				if (interaction.user.id == gaggeduser.id) {
					interaction.reply(`${interaction.user} inserts a ${gagname}${intensitytext} in ${getPronouns(interaction.user.id, "possessiveDeterminer")} own mouth!`)
					assignGag(gaggeduser.id, gagtype, gagintensity)
				}
				else {
					interaction.reply(`${interaction.user} gagged ${gaggeduser}${intensitytext} with a ${gagname}!`)
					assignGag(gaggeduser.id, gagtype, gagintensity)
				}
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}