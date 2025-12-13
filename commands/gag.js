const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { assignGag, getMitten } = require('./../functions/gagfunctions.js')

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
			.setRequired(true)
        )
		.addStringOption(opt =>
			opt.setName('gag')
			.setDescription('Type of gag to use')
			.addChoices(...gagtypes)
		)
		.addNumberOption((opt) => 
			opt.setName('intensity')
			.setDescription("How intense to gag. Range 1-10")
			.setMinValue(1)
			.setMaxValue(10)
		),
    async execute(interaction) {
		let gaggeduser = interaction.options.getUser('user')
		let gagtype = interaction.options.getString('gag') ? interaction.options.getString('gag') : 'ball'
		let gagintensity = interaction.options.getNumber('intensity') ? interaction.options.getNumber('intensity') : 5
		let intensitytext = "loosely"
		if (gagintensity > 2) {
			intensitytext = "moderately loosely"
		}
		if (gagintensity > 4) {
			intensitytext = "moderately tightly"
		}
		if (gagintensity > 7) {
			intensitytext = "tightly"
		}
		if (gagintensity > 9) {
			intensitytext = "as tightly as possible"
		}
		if ((interaction.user.id != gaggeduser.id) && (getMitten(interaction.user))) {
			interaction.reply(`${interaction.user} attempts to gag someone, but fumbles at holding the gag in their mittens!`)
			return;
		}
		else {
			assignGag(gaggeduser, gagtype, gagintensity)
		}
		let gagname = gagtypes.find(g => g.value == gagtype).name;
		// We gagged ourselves!
		if (interaction.user.id == gaggeduser.id) {
			interaction.reply(`${interaction.user} inserts a ${gagname} ${intensitytext} in their own mouth!`)
		}
		else {
			interaction.reply(`${interaction.user} gagged ${gaggeduser} ${intensitytext} with a ${gagname}!`)
		}
    }
}