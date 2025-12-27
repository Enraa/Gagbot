const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getGag, assignGag, getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getText } = require("./../functions/textfunctions.js");

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
			let currentgag = getGag(gaggeduser.id)
			console.log(currentgag)
			let gagname = gagtypes.find(g => g.value == gagtype)?.name;
			let oldgagname = gagtypes.find(g => g.value == currentgag)?.name;
			let intensitytext = "loosely"
			try {
				let gagfile = require(path.join(commandsPath, `${gagtype}.js`))
				if (gagfile.intensity) {
					intensitytext = gagfile.intensity(gagintensity)
				}
				/* ------------ This idea needs some investigation to ensure gag texts retrieve this properly.
				if (gagfile.gagnamecustom) {
					gagname = gagfile.gagnamecustom(gagintensity)
				} */
			}
			catch (err) { console.log(err) }
			if (intensitytext == "loosely") {
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
			}

			// Build data tree:
            let data = {
                textarray: "texts_gag",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: gaggeduser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: intensitytext, // gag tightness 
					c3: gagname, // New gag being put on the wearer
					c4: oldgagname // Old gag the wearer has on
                }
            }

			if (getHeavy(interaction.user.id)) {
				// in heavy bondage, cant equip
				data.heavy = true
				if (interaction.user == gaggeduser) {
					// gagging self
					data.self = true
					if (getGag(interaction.user.id)) {
						// has a gag already
						data.gag = true
						interaction.reply(getText(data))
					}
					else {
						// No gag already
						data.nogag = true
						interaction.reply(getText(data))
					}
				}
				else {
					// gagging another
					data.other = true
					if (getGag(gaggeduser.id)) {
						// has a gag already
						data.gag = true
						interaction.reply(getText(data))
					}
					else {
						// No gag already
						data.nogag = true
						interaction.reply(getText(data))
					}
				}
			}
			else if (getMitten(interaction.user.id)) {
				// We are wearing mittens, we can't hold onto the straps!
				data.noheavy = true
				data.mitten = true
				if (interaction.user.id != gaggeduser.id) {
					data.other = true // yes, this is backwards, sorry.
					if (getGag(gaggeduser.id)) {
						data.gag = true
						interaction.reply(getText(data))
					}
					else {
						data.nogag = true
						interaction.reply(getText(data))
					}
				}
				else {
					data.self = true
					interaction.reply(getText(data))
				}
			}
			else {
				// We have fingers! 
				data.noheavy = true
				data.nomitten = true
				if (interaction.user.id == gaggeduser.id) {
					// Gagging ourself
					data.self = true
					if (getGag(gaggeduser.id)) {
						// We are already gagged, so we want to change gags
						data.gag = true
						interaction.reply(getText(data))
						assignGag(gaggeduser.id, gagtype, gagintensity)
					}
					else {
						// Not already gagged, lets put one on
						data.nogag = true
						interaction.reply(getText(data))
						assignGag(gaggeduser.id, gagtype, gagintensity)
					}
				}
				else {
					// Gagging others
					data.other = true
					if (getGag(gaggeduser.id)) {
						// They are already gagged, so we want to change gags
						data.gag = true
						interaction.reply(getText(data))
						assignGag(gaggeduser.id, gagtype, gagintensity)
					}
					else {
						// Not already gagged, lets put one on
						data.nogag = true
						interaction.reply(getText(data))
						assignGag(gaggeduser.id, gagtype, gagintensity)
					}
				}
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}