const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { generateConfigModal, configoptions, getOption, setOption } = require('./../functions/configfunctions.js');
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require('./../functions/headwearfunctions.js');
const { canAccessCollar, promptCloneCollarKey, cloneCollarKey } = require('./../functions/collarfunctions.js');
const { canAccessChastity, promptCloneChastityKey, cloneChastityKey } = require('./../functions/vibefunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('key')
        .setDescription(`Prevent a worn item from being removed...`)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("clone")
				.setDescription("Clone a primary key you're holding...")
                .addUserOption((opt) => 
                    opt.setName("wearer")
						.setDescription("Whose restraint to clone key for?")
					)
				.addStringOption((opt) => 
					opt.setName("restraint")
						.setDescription("Which restraint of theirs to clone?")
						.setAutocomplete(true)
					)
                .addUserOption((opt) => 
                    opt.setName("clonedkeyholder")
						.setDescription("Who to give the copied key to?")
					)

		)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("revoke")
				.setDescription("Revoke a cloned key")
				.addUserOption((opt) => 
                    opt.setName("wearer")
						.setDescription("Whose restraint to revoke a key for?")
					)
				.addStringOption((opt) => 
					opt.setName("restraint")
						.setDescription("Which restraint of theirs to clone?")
						.setAutocomplete(true)
					)
                .addUserOption((opt) => 
                    opt.setName("clonedkeyholder")
						.setDescription("Who to give the copied key to?")
					)
    ),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		let subcommand = interaction.options.getSubcommand();
		try {
			if (subcommand == "clone") {
                // We want to return ONLY options that the user COULD clone a key for
                // So if they own a collar key, it only gives "Collar"
                let chosenuserid = interaction.options.get('user')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
				let collarkeyholder = canAccessCollar(chosenuserid, interaction.user.id, undefined, true);
                let chastitykeyholder = canAccessChastity(chosenuserid, interaction.user.id, undefined, true);

				let choices = [];
                if (!collarkeyholder && !chastitykeyholder) {
                    choices = [{ name: "No Keys Available", value: "nokeys" }]
                }
                if (collarkeyholder) {
                    choices.push({ name: "Collar", value: "collar" })
                }
                if (chastitykeyholder) {
                    choices.push({ name: "Chastity", value: "chastitybelt" })
                }

				await interaction.respond(choices)
			}
			else {
				let itemslocked = getLockedHeadgear(interaction.user.id)

				let sorted = itemslocked.map((f) => { return { name: getHeadwearName(undefined, f), value: f }})
				if (sorted.length == 0) {
					sorted = [{ name: "Nothing", value: "nothing" }]
				}
				await interaction.respond(sorted)
			}
		}
		catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {
            if (interaction.user.id !== interaction.client?.application?.owner?.id) {
                await interaction.reply(`You're not ${interaction.client?.application?.owner?.displayName}. Go away.`)
                return
            }
			let subcommand = interaction.options.getSubcommand();
            let wearertoclone = interaction.options.getUser("wearer") ?? interaction.user;
			let chosenrestrainttoclone = interaction.options.getString("restraint")
            let clonedkeyholder = interaction.options.getUser("clonedKeyholder")

            // We're missing info, back to the start!
            if (!wearertoclone || !chosenrestrainttoclone || clonedkeyholder) {
                interaction.reply({ content: `Something went wrong. The command was parsed as:\nClone ${wearertoclone}'s key for ${chosenrestrainttoclone} and give to ${clonedkeyholder}!`, flags: MessageFlags.Ephemeral })
                return;
            }

            // Check if the interaction user has access to clone the target restraint.
            let canclone = false;
            let chosenrestraintreadable;
            if (chosenrestrainttoclone == "collar" && canAccessCollar(chosenuserid, interaction.user.id, undefined, true)) { 
                canclone = true 
                chosenrestraintreadable = "collar";
            }
            if (chosenrestrainttoclone == "chastitybelt" && canAccessChastity(chosenuserid, interaction.user.id, undefined, true)) { 
                canclone = true 
                chosenrestraintreadable = "chastity belt"
            }
            if (!canclone) {
                interaction.reply({ content: `You do not have the keys for the wearer's ${chosenrestrainttoclone}.`, flags: MessageFlags.Ephemeral })
                return;
            }

            // At this point, we're sure this is a valid cloning attempt. Prompt the user that this is what they want to do.
            // Prompt and ensure the user intended to run this command for this combination. 
            let components = [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: "Cancel",
							customId: `cancel`,
							style: ButtonStyle.Danger,
					  	},
					  	{
							type: ComponentType.Button,
							label: "Clone the Key",
							customId: `agreetoclonebutton`,
							style: ButtonStyle.Success,
					  	}
					],
				},
			]

            let response = await interaction.reply({ 
                content: `Cloning the keys for ${choiceemoji}${lockedUser} and giving the copy to 🔑${clonedkeyholder}.\n\nPlease confirm by pressing the button below:`, 
                flags: MessageFlags.Ephemeral, 
                components: components,
                withResponse: true 
            })
            let confirmation;

            const collectorFilter = (i) => i.user.id === interaction.user.id;
            try {
                confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                if (confirmation.customId === 'agreetoclonebutton') {
                    await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
                    if (chosenrestrainttoclone == "collar") {
                        let canRemove = await promptCloneCollarKey(interaction.user, wearertoclone, clonedkeyholder).then(async (res) => {
                            // User said yes
                            let data = {
                                textarray: "texts_key",
                                textdata: {
                                    interactionuser: interaction.user,
                                    targetuser: wearertoclone,
                                    c1: chosenrestraintreadable,
                                    c2: clonedkeyholder
                                }
                            }
                            data.clone = true;
                            data[chosenrestrainttoclone] = true;
                            await confirmation.update(getTextGeneric("clone_accept", data.textdata))
                            await confirmation.followUp(getText(data))
                            cloneCollarKey(wearertoclone.id, clonedkeyholder.id);
                        }, async (rej) => {
                            // User said no.
                            await interaction.editReply(getTextGeneric("clone_decline", datatogeneric))
                        })
                    }
                    else if (chosenrestrainttoclone == "chastitybelt") {
                        let canRemove = await promptCloneChastityKey(interaction.user, wearertoclone, clonedkeyholder).then(async (res) => {
                            // User said yes
                            let data = {
                                textarray: "texts_key",
                                textdata: {
                                    interactionuser: interaction.user,
                                    targetuser: wearertoclone,
                                    c1: chosenrestraintreadable,
                                    c2: clonedkeyholder
                                }
                            }
                            data.clone = true;
                            data[chosenrestrainttoclone] = true;
                            await confirmation.update(getTextGeneric("clone_accept", data.textdata))
                            await confirmation.followUp(getText(data))
                            cloneChastityKey(wearertoclone.id, clonedkeyholder.id);
                        }, async (rej) => {
                            // User said no.
                            await interaction.editReply(getTextGeneric("clone_decline", datatogeneric))
                        })
                    }
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Action cancelled', components: [] });
                    return; // Stop with the key cloning immediately. 
                }
            } 
            catch (err) {
                console.log(err);
                await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling transfer.', components: [] });
                return;
            }
		}
		catch (err) {
			console.log(err)
		}
    }
}