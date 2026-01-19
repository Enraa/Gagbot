const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getMitten } = require('./../functions/gagfunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getHeadwear, getHeadwearName, deleteHeadwear, getLockedHeadgear } = require('../functions/headwearfunctions.js');
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require('../functions/interactivefunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmask')
		.setDescription(`Remove headwear from someone. . .`)
		.addUserOption(opt =>
			opt.setName('user')
			.setDescription('Who to remove headwear from?')
		)
        .addStringOption(opt =>
			opt.setName('type')
			.setDescription('What headwear to remove...')
			.setAutocomplete(true)
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
        let chosenuserid = interaction.options.get('user')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
		if (focusedValue == "") { // User hasn't entered anything, lets give them a suggested set of 10
			let itemsworn = getHeadwear(chosenuserid)
            let itemslocked = getLockedHeadgear(chosenuserid)
            
			// Remove anything we're already wearing from the list
			let sorted = process.headtypes.filter(f => itemsworn.includes(f.value))
            sorted = sorted.filter(f => !itemslocked.includes(f.value))
			await interaction.respond(sorted.slice(0,10))
		}
		else {
            try {
                let itemsworn = getHeadwear(chosenuserid)
                let itemslocked = getLockedHeadgear(chosenuserid)

			    // Remove anything we're already wearing from the list
			    let sorted = process.headtypes.filter(f => itemsworn.includes(f.value))
                sorted = sorted.filter(f => !itemslocked.includes(f.value))
                let headstoreturn = sorted.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,10)
			    await interaction.respond(headstoreturn)
            }
			catch (err) {
                console.log(err);
            }
		}
	},
    async execute(interaction) {
		try {
			let headwearuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
			let headwearchoice = interaction.options.getString('type')
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(headwearuser.id)?.mainconsent) {
				await handleConsent(interaction, headwearuser.id);
				return;
			}
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
                textarray: "texts_unheadwear",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: headwearuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
					c2: getHeadwearName(headwearuser.id, headwearchoice)
                }
            }

            if (headwearchoice && data.textdata.c2 == undefined) {
                // Something went CRITICALLY wrong. Eject, eject!
                interaction.reply({ content: `Something went wrong with your input. Please let Enraa know with the exact thing you put in the Type field!`, flags: MessageFlags.Ephemeral })
                return;
            }

			if (getHeavy(interaction.user.id)) {
				// target is in heavy bondage
				data.heavy = true;
				if (headwearuser.id == interaction.user.id) {
					// ourselves
					data.self = true;
                    if (headwearchoice) {
                        // We're targetting a specific headwear piece. 
                        data.single = true
                        if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                            // Wearing the headgear already
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We're removing ALL headwear
                        data.multiple = true
                        if (getHeadwear(headwearuser.id).length > 0) {
                            // Wearing something
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
				}
				else {
					// Them
					data.other = true;
					if (headwearchoice) {
                        // We're targetting a specific headwear piece. 
                        data.single = true
                        if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                            // Wearing the headgear already
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                    else {
                        // We're removing ALL headwear
                        data.multiple = true
                        if (getHeadwear(headwearuser.id).length > 0) {
                            // Wearing something
                            data.worn = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // Not wearing it! Ephemeral!
                            data.noworn = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
				}
			}
			else {
				// Not in heavy bondage
				data.noheavy = true;
				if (getMitten(interaction.user.id)) {
					// Wearing mittens!
					data.mitten = true
					if (headwearuser.id == interaction.user.id) {
                        // ourselves
                        data.self = true;
                        if (headwearchoice) {
                            // We're targetting a specific headwear piece. 
                            data.single = true
                            if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                                // Wearing the headgear already
                                data.worn = true
                                interaction.reply(getText(data))
                            }
                            else {
                                // Not wearing it! Ephemeral!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // We're removing ALL headwear
                            data.multiple = true
                            if (getHeadwear(headwearuser.id).length > 0) {
                                // Wearing something
                                data.worn = true
                                interaction.reply(getText(data))
                            }
                            else {
                                // Not wearing it! Ephemeral!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                    }
                    else {
                        // Them
                        data.other = true;
                        if (headwearchoice) {
                            // We're targetting a specific headwear piece. 
                            data.single = true
                            if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                                // Wearing the headgear already
                                data.worn = true
                                interaction.reply(getText(data))
                            }
                            else {
                                // Not wearing it! Ephemeral!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // We're removing ALL headwear
                            data.multiple = true
                            if (getHeadwear(headwearuser.id).length > 0) {
                                // Wearing something
                                data.worn = true
                                interaction.reply(getText(data))
                            }
                            else {
                                // Not wearing it! Ephemeral!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                    }
				}
				else {
					// Not wearing mittens!
					data.nomitten = true
					if (headwearuser.id == interaction.user.id) {
						// ourselves
						data.self = true;
                        if (headwearchoice) {
                            // Targetting one specific headgear
                            data.single = true
                            if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                                // Wearing the headgear already, Ephemeral
                                data.worn = true
                                interaction.reply(getText(data))
                                deleteHeadwear(headwearuser.id, headwearchoice)
                            }
                            else {
                                // Not wearing it!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
						else {
                            // Targetting all headgear
                            data.multiple = true
                            if (getHeadwear(headwearuser.id).length > 0) {
                                // Wearing the headgear already, Ephemeral
                                data.worn = true
                                interaction.reply(getText(data))
                                deleteHeadwear(headwearuser.id, headwearchoice)
                            }
                            else {
                                // Not wearing it!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
					}
					else {
						// Them
						data.other = true;
						if (headwearchoice) {
                            // Targetting one specific headgear
                            data.single = true
                            if (getHeadwear(headwearuser.id).includes(headwearchoice)) {
                                // Wearing the headgear already, Ephemeral
                                data.worn = true
                                // Now lets make sure the wearer wants that.
                                if (checkBondageRemoval(interaction.user.id, headwearuser.id, "headwear") == true) {
                                    // Allowed immediately, lets go
                                    interaction.reply(getText(data))
                                    deleteHeadwear(headwearuser.id, headwearchoice)
                                }
                                else {
                                    // We need to ask first. 
                                    let datatogeneric = Object.assign({}, data.textdata);
                                    datatogeneric.c1 = "head restraints";
                                    interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                                    let canRemove = await handleBondageRemoval(interaction.user, headwearuser, "head restraints").then(async (res) => {
                                        await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                                        await interaction.followUp(getText(data))
                                        deleteHeadwear(headwearuser.id, headwearchoice)
                                    }, async (rej) => {
                                        await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                                    })
                                }
                            }
                            else {
                                // Not wearing it!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
						else {
                            // Targetting all headgear
                            data.multiple = true
                            if (getHeadwear(headwearuser.id).length > 0) {
                                // Wearing the headgear already, Ephemeral
                                data.worn = true
                                // Now lets make sure the wearer wants that.
                                if (checkBondageRemoval(interaction.user.id, headwearuser.id, "headwear") == true) {
                                    // Allowed immediately, lets go
                                    interaction.reply(getText(data))
                                    deleteHeadwear(headwearuser.id, headwearchoice)
                                }
                                else {
                                    // We need to ask first. 
                                    let datatogeneric = Object.assign({}, data.textdata);
                                    datatogeneric.c1 = "head restraints";
                                    interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral })
                                    let canRemove = await handleBondageRemoval(interaction.user, headwearuser, "head restraints").then(async (res) => {
                                        await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric))
                                        await interaction.followUp(getText(data))
                                        deleteHeadwear(headwearuser.id, headwearchoice)
                                    }, async (rej) => {
                                        await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric))
                                    })
                                }
                            }
                            else {
                                // Not wearing it!
                                data.noworn = true
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
					}
				}
			}
		}
		catch (err) {
			console.log(err)
		}
    }
}