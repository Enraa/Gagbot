const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { generateConfigModal, configoptions, getOption, setOption, config } = require("./../functions/configfunctions.js");
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require("./../functions/headwearfunctions.js");
const { canAccessCollar, promptCloneCollarKey, cloneCollarKey, revokeCollarKey, getClonedCollarKeysOwned, getOtherKeysCollar, getCollar, transferCollarKey, promptTransferCollarKey, collartypes, getCollarName, getBaseCollar } = require("./../functions/collarfunctions.js");
const { canAccessChastity, promptCloneChastityKey, cloneChastityKey, revokeChastityKey, getClonedChastityKeysOwned, getOtherKeysChastity, getChastity, transferChastityKey, promptTransferChastityKey } = require("./../functions/vibefunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { getPronouns } = require("../functions/pronounfunctions.js");
const { getChastityBra } = require("../functions/vibefunctions.js");
const { canAccessChastityBra } = require("../functions/vibefunctions.js");
const { getClonedChastityBraKeysOwned } = require("../functions/vibefunctions.js");
const { getOtherKeysChastityBra } = require("../functions/vibefunctions.js");
const { cloneChastityBraKey } = require("../functions/vibefunctions.js");
const { promptCloneChastityBraKey } = require("../functions/vibefunctions.js");
const { revokeChastityBraKey } = require("../functions/vibefunctions.js");
const { transferChastityBraKey } = require("../functions/vibefunctions.js");
const { promptTransferChastityBraKey } = require("../functions/vibefunctions.js");
const { getChastityName } = require("../functions/vibefunctions.js");
const { getChastityBraName } = require("../functions/vibefunctions.js");
const { swapChastity, swapChastityBra } = require("../functions/vibefunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getUserTags } = require("../functions/configfunctions.js");
const { getBaseChastity } = require("../functions/chastityfunctions.js");
const { discardKey } = require("../functions/keyfindingfunctions.js");
const { modalexecute } = require("./config.js");
const { generateKeyGivingModal } = require("../functions/interactivefunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("key")
		.setDescription(`Prevent a worn item from being removed...`)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("clone")
				.setDescription("Clone a primary key you're holding...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to clone key for?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to clone?").setAutocomplete(true))
				.addUserOption((opt) => opt.setName("clonedkeyholder").setDescription("Who to give the copied key to?")),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("revoke")
				.setDescription("Revoke a cloned key")
				.addStringOption((opt) => opt.setName("clones").setDescription("Which key clone to revoke?").setAutocomplete(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("give")
				.setDescription("Give a primary key you're holding...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to give key for?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to give key for?").setAutocomplete(true))
				.addUserOption((opt) => opt.setName("newkeyholder").setDescription("Who to give the key to?")),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("swapitem")
				.setDescription("Swap a worn restraint for another you have the key for...")
				.addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to give key for?"))
				.addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to give key for?").setAutocomplete(true))
				.addStringOption((opt) => opt.setName("restrainttype").setDescription("What new restraint to put on them?").setAutocomplete(true)),
		)
        .addSubcommand((subcommand) =>
			subcommand
				.setName("menu")
				.setDescription("Open key giving and cloning menu")
		)
        /*.addSubcommand((subcommand) =>
            subcommand
                .setName("discardkey")
                .setDescription("Discard a key you're holding...")
                .addUserOption((opt) => opt.setName("wearer").setDescription("Whose restraint to discard the key?"))
                .addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint of theirs to discard?").setAutocomplete(true)),
        )*/,
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		let subcommand = interaction.options.getSubcommand();
		try {
			if (subcommand == "clone" || subcommand == "give") {
				// We want to return ONLY options that the user COULD clone a key for
				// So if they own a collar key, it only gives "Collar"
				let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
				let collarkeyholder = getCollar(chosenuserid) && canAccessCollar(chosenuserid, interaction.user.id, undefined, true).access;
				let chastitykeyholder = getChastity(chosenuserid) && canAccessChastity(chosenuserid, interaction.user.id, undefined, true).access;
				let chastitybrakeyholder = getChastityBra(chosenuserid) && canAccessChastityBra(chosenuserid, interaction.user.id, undefined, true).access;

				let choices = [];
				if (!collarkeyholder && !chastitykeyholder && !chastitybrakeyholder) {
					choices = [{ name: "No Keys Available", value: "nokeys" }];
				}
				if (collarkeyholder) {
					choices.push({ name: "Collar", value: "collar" });
				}
				if (chastitykeyholder) {
					choices.push({ name: "Chastity Belt", value: "chastitybelt" });
				}
				if (chastitybrakeyholder) {
					choices.push({ name: "Chastity Bra", value: "chastitybra" });
				}

				await interaction.respond(choices);
			} else if (subcommand == "revoke") {
				let ownedclonedchastitykeys = getClonedChastityKeysOwned(interaction.user.id);
				let ownedclonedchastitybrakeys = getClonedChastityBraKeysOwned(interaction.user.id);
				let ownedclonedcollarkeys = getClonedCollarKeysOwned(interaction.user.id);

				let clonedchastitykeys = getOtherKeysChastity(interaction.user.id);
				let clonedchastitybrakeys = getOtherKeysChastityBra(interaction.user.id);
				let clonedcollarkeys = getOtherKeysCollar(interaction.user.id);

				// Iterate over every member, ensuring that they are cached using the await command.
				// I hate this code. It feels sloppy.
				ownedclonedchastitykeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
				});
				ownedclonedchastitybrakeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
				});
				ownedclonedcollarkeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
				});
				clonedchastitykeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
					await interaction.guild.members.fetch(m.split("_")[1]);
				});
				clonedchastitybrakeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
					await interaction.guild.members.fetch(m.split("_")[1]);
				});
				clonedcollarkeys.forEach(async (m) => {
					await interaction.guild.members.fetch(m.split("_")[0]);
					await interaction.guild.members.fetch(m.split("_")[1]);
				});

				// Unfortunately, we will still get undefined for names the FIRST time this is invoked.
				// Assuming the bot hasn't seen the user say anything that instance.
				// We need to consider a future solution.
				// Maybe have the bot do an await fetch on every member in it's process variables during index.js init.

				ownedclonedchastitykeys = ownedclonedchastitykeys.map((k) => {
					return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity belt`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}` };
				});
				ownedclonedchastitybrakeys = ownedclonedchastitybrakeys.map((k) => {
					return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity bra`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}` };
				});
				ownedclonedcollarkeys = ownedclonedcollarkeys.map((k) => {
					return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s collar`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}` };
				});
				clonedchastitykeys = clonedchastitykeys.map((k) => {
					return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity belt`.slice(0, 100), value: `${k}_chastitybelt` };
				});
				clonedchastitybrakeys = clonedchastitybrakeys.map((k) => {
					return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity bra`.slice(0, 100), value: `${k}_chastitybra` };
				});
				clonedcollarkeys = clonedcollarkeys.map((k) => {
					return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s collar`.slice(0, 100), value: `${k}_collar` };
				});

				let sorted = [...clonedchastitykeys, ...clonedchastitybrakeys, ...clonedcollarkeys, ...ownedclonedchastitykeys, ...ownedclonedchastitybrakeys, ...ownedclonedcollarkeys];
				if (sorted.length == 0) {
					sorted = [{ name: "No Eligible Keys To Revoke...", value: "nothing" }];
				}

                let matches = didYouMean(focusedValue, sorted, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.1, // Default is 0.4 - this is how much of the entry must exist
                })
                console.log(matches)
                if (matches.length == 0) {
                    matches = sorted;
                }
				await interaction.respond(matches.slice(0, 25));
			} else if (subcommand == "swapitem") {
				// Note, we only need to know if we can ***unlock*** a restraint to swap it.
				if (interaction.options.get("restraint")?.focused) {
					let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
					let collarkeyholder = getCollar(chosenuserid) && canAccessCollar(chosenuserid, interaction.user.id, true).access;
					let chastitykeyholder = getChastity(chosenuserid) && canAccessChastity(chosenuserid, interaction.user.id, true).access;
					let chastitybrakeyholder = getChastityBra(chosenuserid) && canAccessChastityBra(chosenuserid, interaction.user.id, true).access;

					let choices = [];
					if (!collarkeyholder && !chastitykeyholder && !chastitybrakeyholder) {
						choices = [{ name: "No Keys Available", value: "nokeys" }];
					}
					if (collarkeyholder) {
						choices.push({ name: "Collar", value: "collar" });
					}
					if (chastitykeyholder) {
						choices.push({ name: "Chastity Belt", value: "chastitybelt" });
					}
					if (chastitybrakeyholder) {
						choices.push({ name: "Chastity Bra", value: "chastitybra" });
					}

					console.log(interaction.options.get("restraint"));

					await interaction.respond(choices);
				} else {
					let chosenrestrainttype = interaction.options.get("restraint")?.value;
					let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                    let choices = [];
                    let choicefunc;
					if (chosenrestrainttype) {
						if (chosenrestrainttype == "collar") {
							choices = process.autocompletes.collar;
                            choicefunc = getBaseCollar;
						} else if (chosenrestrainttype == "chastitybelt") {
							choices = process.autocompletes.chastitybelt;
                            choicefunc = getBaseChastity;
						} else if (chosenrestrainttype == "chastitybra") {
							choices = process.autocompletes.chastitybra;
                            choicefunc = getBaseChastity;
						} else {
							choices = [{ name: "Nothing", value: "nothing" }];
						}
					}
                    
                    let matches = didYouMean(focusedValue, choices, {
                        matchPath: ['name'], 
                        returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                        threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                    })
                    if (matches.length == 0) {
                        matches = choices.slice(0,25);
                    }
                    let tags = getUserTags(chosenuserid);
                    let newsorted = [];
                    matches.forEach((f) => {
                        let tagged = false;
                        let i = choicefunc(f.value)
                        tags.forEach((t) => {
                            if (i && i.tags && (Array.isArray(i.tags)) && i.tags.includes(t)) { tagged = true }
                            else if (i.tags && (i.tags[t])) { tagged = true }
                        })
                        if (!tagged) {
                            newsorted.push(f);
                        }
                    })
                    interaction.respond(newsorted.slice(0,25))
				}
			} else if (subcommand == "discardkey") {
                // We need to know if we're holding the primary keys to throw them away. 
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let collarkeyholder = getCollar(chosenuserid) && (getCollar(chosenuserid).keyholder == interaction.user.id) && !getCollar(chosenuserid)?.fumbled && !canAccessCollar(chosenuserid, interaction.user.id, true).public
                let chastitykeyholder = getChastity(chosenuserid) && (getChastity(chosenuserid).keyholder == interaction.user.id) && !getChastity(chosenuserid)?.fumbled && !canAccessChastity(chosenuserid, interaction.user.id, true).public
                let chastitybrakeyholder = getChastityBra(chosenuserid) && (getChastityBra(chosenuserid).keyholder == interaction.user.id) && !getChastityBra(chosenuserid)?.fumbled && !canAccessChastityBra(chosenuserid, interaction.user.id, true).public

                let choices = [];
                if (!collarkeyholder && !chastitykeyholder && !chastitybrakeyholder) {
                    choices = [{ name: "No Keys Available", value: "nokeys" }];
                }
                if (collarkeyholder) {
                    choices.push({ name: "Collar", value: "collar" });
                }
                if (chastitykeyholder) {
                    choices.push({ name: "Chastity Belt", value: "chastitybelt" });
                }
                if (chastitybrakeyholder) {
                    choices.push({ name: "Chastity Bra", value: "chastitybra" });
                }

                await interaction.respond(choices);
            }
		} catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {
			let subcommand = interaction.options.getSubcommand();
			let choiceemoji;

			if (subcommand == "clone") {
				let wearertoclone = interaction.options.getUser("wearer") ?? interaction.user;
				let chosenrestrainttoclone = interaction.options.getString("restraint");
				let clonedkeyholder = interaction.options.getUser("clonedkeyholder");

				// We're missing info, back to the start!
				if (!wearertoclone || !chosenrestrainttoclone || !clonedkeyholder) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nClone ${wearertoclone}'s key for ${chosenrestrainttoclone} and give to ${clonedkeyholder}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Check if the interaction user has access to clone the target restraint.
				let canclone = false;
				let chosenrestraintreadable;
				if (chosenrestrainttoclone == "collar" && getCollar(wearertoclone.id) && canAccessCollar(wearertoclone.id, interaction.user.id, undefined, true).access) {
					canclone = true;
					chosenrestraintreadable = "collar";
					choiceemoji = `${process.emojis.collar}`;
				}
				if (chosenrestrainttoclone == "chastitybelt" && getChastity(wearertoclone.id) && canAccessChastity(wearertoclone.id, interaction.user.id, undefined, true).access) {
					canclone = true;
					chosenrestraintreadable = "chastity belt";
					choiceemoji = `${process.emojis.chastity}`;
				}
				if (chosenrestrainttoclone == "chastitybra" && getChastityBra(wearertoclone.id) && canAccessChastityBra(wearertoclone.id, interaction.user.id, undefined, true).access) {
					canclone = true;
					chosenrestraintreadable = "chastity bra";
					choiceemoji = `${process.emojis.chastitybra}`;
				}
				if (!canclone) {
					interaction.reply({ content: `You do not have the keys for ${wearertoclone}'s ${chosenrestrainttoclone}.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// We can't hold a clone of a restraint we have primary keys for.
				if (interaction.user == clonedkeyholder) {
					interaction.reply({ content: `You can't give yourself a copy of the primary key!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// If the wearer has disabled key cloning, tell them to leave.
				if (getOption(wearertoclone.id, "keycloning") == "disabled") {
					interaction.reply({ content: `${wearertoclone} has disabled key cloning.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// At this point, we're sure this is a valid cloning attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Clone the Key", customId: `agreetoclonebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let responsetext = `Cloning the keys for ${choiceemoji}${wearertoclone} and giving the copy to 🔑${clonedkeyholder}.\n\nPlease confirm by pressing the button below:`;
				if (wearertoclone == interaction.user) {
					responsetext = `Cloning the keys for your ${choiceemoji}${chosenrestraintreadable} and giving the copy to 🔑${clonedkeyholder}. You will retain full access to your restraints while ${clonedkeyholder} has the cloned key.\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: responsetext, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetoclonebutton") {
						// Skip the DM if it's the wearer giving a clone of their key.
						if (wearertoclone == interaction.user || wearertoclone == clonedkeyholder || getOption(wearertoclone.id, "keycloning") == "auto") {
							let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearertoclone, c1: chosenrestraintreadable, c2: clonedkeyholder } };
							let cloneaccept;
							console.log(cloneaccept);
							data.clone = true;
							if (wearertoclone == interaction.user) {
								cloneaccept = "clone_accept_self";
								data.self = true;
							} else {
								cloneaccept = "clone_accept";
								data.other = true;
							}
							data[chosenrestrainttoclone] = true;
							if (chosenrestrainttoclone == "collar") {
								await confirmation.update({ content: getTextGeneric(cloneaccept, data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								cloneCollarKey(wearertoclone.id, clonedkeyholder.id);
							} else if (chosenrestrainttoclone == "chastitybelt") {
								await confirmation.update({ content: getTextGeneric(cloneaccept, data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								cloneChastityKey(wearertoclone.id, clonedkeyholder.id);
							} else if (chosenrestrainttoclone == "chastitybra") {
								await confirmation.update({ content: getTextGeneric(cloneaccept, data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								cloneChastityBraKey(wearertoclone.id, clonedkeyholder.id);
							}
						} else {
							await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
							if (chosenrestrainttoclone == "collar") {
								let canRemove = await promptCloneCollarKey(interaction.user, wearertoclone, clonedkeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearertoclone, c1: chosenrestraintreadable, c2: clonedkeyholder } };
										data.clone = true;
										data.other = true;
										data[chosenrestrainttoclone] = true;
										await confirmation.editReply(getTextGeneric("clone_accept", data.textdata));
										await confirmation.followUp(getText(data));
										cloneCollarKey(wearertoclone.id, clonedkeyholder.id);
									},
									async (rej) => {
										// User said no.
										await interaction.editReply(getTextGeneric("clone_decline", datatogeneric));
									},
								);
							} else if (chosenrestrainttoclone == "chastitybelt") {
								let canRemove = await promptCloneChastityKey(interaction.user, wearertoclone, clonedkeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearertoclone, c1: chosenrestraintreadable, c2: clonedkeyholder } };
										data.clone = true;
										data.other = true;
										data[chosenrestrainttoclone] = true;
										await confirmation.editReply(getTextGeneric("clone_accept", data.textdata));
										await confirmation.followUp(getText(data));
										cloneChastityKey(wearertoclone.id, clonedkeyholder.id);
									},
									async (rej) => {
										// User said no.
										await interaction.editReply(getTextGeneric("clone_decline", datatogeneric));
									},
								);
							} else if (chosenrestrainttoclone == "chastitybra") {
								let canRemove = await promptCloneChastityBraKey(interaction.user, wearertoclone, clonedkeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearertoclone, c1: chosenrestraintreadable, c2: clonedkeyholder } };
										data.clone = true;
										data.other = true;
										data[chosenrestrainttoclone] = true;
										await confirmation.editReply(getTextGeneric("clone_accept", data.textdata));
										await confirmation.followUp(getText(data));
										cloneChastityBraKey(wearertoclone.id, clonedkeyholder.id);
									},
									async (rej) => {
										// User said no.
										await interaction.editReply(getTextGeneric("clone_decline", datatogeneric));
									},
								);
							}
						}
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key cloning immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			} else if (subcommand == "revoke") {
				let cloneresponse = interaction.options.getString("clones");

				// We're missing a string, back to the start!
				if (!cloneresponse) {
					interaction.reply({ content: `Something went wrong. You provided no option.`, flags: MessageFlags.Ephemeral });
					return;
				}

				let clonedkeyholder = await interaction.guild.members.fetch(cloneresponse.split("_")[1]);
				let wearer = await interaction.guild.members.fetch(cloneresponse.split("_")[0]);
				let typeofrestraint = cloneresponse.split("_")[2];

				/*console.log(typeofrestraint)
                if (typeofrestraint == "chastitybelt") {
                    console.log(getChastity(wearer.id));
                    console.log(canAccessChastity(wearer.id, interaction.user.id, undefined, true).access)
                }*/

				// Check if the interaction user has access to clone the target restraint.
				let canrevoke = false;
				let isclone = false;
				let typeofrestraintreadable;
				// Has primary keys to the collar!
				if (typeofrestraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id, undefined, true).access) {
					canrevoke = true;
					typeofrestraintreadable = "collar";
					choiceemoji = `${process.emojis.collar}`;
				}
				if (typeofrestraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id, undefined, true).access) {
					canrevoke = true;
					typeofrestraintreadable = "chastity belt";
					choiceemoji = `${process.emojis.chastity}`;
				}
				if (typeofrestraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id, undefined, true).access) {
					canrevoke = true;
					typeofrestraintreadable = "chastity bra";
					choiceemoji = `${process.emojis.chastitybra}`;
				}
				// Allow cloned key to be revoked if the cloned keyholder is the interaction user.
				if (typeofrestraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id).access && clonedkeyholder == interaction.user) {
					canrevoke = true;
					typeofrestraintreadable = "collar";
					choiceemoji = `${process.emojis.collar}`;
				}
				if (typeofrestraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id).access && clonedkeyholder == interaction.user) {
					canrevoke = true;
					typeofrestraintreadable = "chastity belt";
					choiceemoji = `${process.emojis.chastity}`;
				}
				if (typeofrestraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id).access && clonedkeyholder == interaction.user) {
					canrevoke = true;
					typeofrestraintreadable = "chastity bra";
					choiceemoji = `${process.emojis.chastitybra}`;
				}
				if (clonedkeyholder == interaction.user) {
					isclone = true;
				}
				if (!canrevoke) {
					if (!isclone) {
						interaction.reply({ content: `You do not have the primary keys for ${wearer}'s ${typeofrestraintreadable}.`, flags: MessageFlags.Ephemeral });
						return;
					} else {
						interaction.reply({ content: `You do not have a cloned key for ${wearer}'s ${typeofrestraintreadable}.`, flags: MessageFlags.Ephemeral });
						return;
					}
				}

				// At this point, we're sure this is a valid Revoke attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Revoke the Key", customId: `agreetorevokebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let verifyresponse = `Revoking the cloned keys for ${choiceemoji}${wearer} from 🔑${clonedkeyholder}. ${clonedkeyholder} will no longer have access to ${wearer}'s ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`;
				if (wearer.id == clonedkeyholder.id) {
					// they hold their own cloned key.
					verifyresponse = `Revoking the cloned keys for ${choiceemoji}${wearer} from 🔑${clonedkeyholder}. ${getPronouns(clonedkeyholder.id, "subject", true)} will no longer have access to ${getPronouns(clonedkeyholder.id, "possessiveDeterminer")} ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`;
				}
				if (isclone) {
					verifyresponse = `Revoking your cloned keys for ${choiceemoji}${wearer}. You will no longer have access to ${wearer}'s ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: verifyresponse, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetorevokebutton") {
						let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: typeofrestraintreadable, c2: clonedkeyholder } };
						data.revoke = true;
						if (isclone) {
							data.isclone = true;
						} else {
							data.isprimary = true;
						}
						data[typeofrestraint] = true;
						if (typeofrestraint == "collar") {
							await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] });
							await confirmation.followUp(getText(data));
							revokeCollarKey(wearer.id, clonedkeyholder.id);
						} else if (typeofrestraint == "chastitybelt") {
							await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] });
							await confirmation.followUp(getText(data));
							revokeChastityKey(wearer.id, clonedkeyholder.id);
						} else if (typeofrestraint == "chastitybra") {
							await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] });
							await confirmation.followUp(getText(data));
							revokeChastityBraKey(wearer.id, clonedkeyholder.id);
						}
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key revokation immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			} else if (subcommand == "give") {
				const wearer = interaction.options.getUser("wearer") ?? interaction.user;
				const restraint = interaction.options.getString("restraint");
				const newKeyholder = interaction.options.getUser("newkeyholder");

				// We're missing info, back to the start!
				if (!wearer || !restraint || !newKeyholder) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nGive ${wearer}'s key for ${restraint} and give to ${newKeyholder}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// We can't give to ourselves lol
				if (interaction.user == newKeyholder) {
					interaction.reply({ content: `You can't give yourself the key you're holding!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Check if the interaction user has access to give the key for the target restraint.
				let cangive = false;
				let chosenrestraintreadable;
				if (restraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id, undefined, true).access) {
					cangive = true;
					chosenrestraintreadable = "collar";
					choiceemoji = `${process.emojis.collar}`;
				}
				if (restraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id, undefined, true).access) {
					cangive = true;
					chosenrestraintreadable = "chastity belt";
					choiceemoji = `${process.emojis.chastity}`;
				}
				if (restraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id, undefined, true).access) {
					cangive = true;
					chosenrestraintreadable = "chastity bra";
					choiceemoji = `${process.emojis.chastitybra}`;
				}
				if (!cangive) {
					interaction.reply({ content: `You do not have the keys for ${wearer}'s ${restraint}.`, flags: MessageFlags.Ephemeral });
					return;
				}

				// At this point, we're sure this is a valid giving attempt. Prompt the user that this is what they want to do.
				// Prompt and ensure the user intended to run this command for this combination.
				let components = [
					{
						type: ComponentType.ActionRow,
						components: [
							{ type: ComponentType.Button, label: "Cancel", customId: `cancel`, style: ButtonStyle.Danger },
							{ type: ComponentType.Button, label: "Give the Key", customId: `agreetogivebutton`, style: ButtonStyle.Success },
						],
					},
				];

				let responsetext = `Giving the keys for ${choiceemoji}${wearer} to 🔑${newKeyholder}. *You will no longer be able to access that restraint.*\n\nPlease confirm by pressing the button below:`;
				if (wearer == interaction.user) {
					responsetext = `Giving the keys for your ${choiceemoji}${chosenrestraintreadable} to 🔑${newKeyholder}. *You will no longer be able to access your restraint.*\n\nPlease confirm by pressing the button below:`;
				}

				let response = await interaction.reply({ content: responsetext, flags: MessageFlags.Ephemeral, components: components, withResponse: true });
				let confirmation;

				const collectorFilter = (i) => i.user.id === interaction.user.id;
				try {
					confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });

					if (confirmation.customId === "agreetogivebutton") {
						// Skip the DM if the wearer is the giver or receiver, or if they have auto accepting enabled
						if (wearer == interaction.user || wearer == newKeyholder || config.getKeyGivingAuto(wearer.id)) {
							let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
							data.give = true;
							if (wearer == interaction.user) {
								data.self = true;
							} else {
								data.other = true;
							}
							data[restraint] = true;
							if (restraint == "collar") {
								await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								transferCollarKey(wearer.id, newKeyholder.id);
							} else if (restraint == "chastitybelt") {
								await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								transferChastityKey(wearer.id, newKeyholder.id);
							} else if (restraint == "chastitybra") {
								await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] });
								await confirmation.followUp(getText(data));
								transferChastityBraKey(wearer.id, newKeyholder.id);
							}
						} else {
							await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
							if (restraint == "collar") {
								let canRemove = await promptTransferCollarKey(interaction.user, wearer, newKeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										data.give = true;
										data.other = true;
										data[restraint] = true;
										await confirmation.editReply(getTextGeneric("give_accept", data.textdata));
										await confirmation.followUp(getText(data));
										transferCollarKey(wearer.id, newKeyholder.id);
									},
									async (rej) => {
										// User said no.
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										await interaction.editReply(getTextGeneric("give_decline", data.textdata));
									},
								);
							} else if (restraint == "chastitybelt") {
								let canRemove = await promptTransferChastityKey(interaction.user, wearer, newKeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										data.give = true;
										data.other = true;
										data[restraint] = true;
										await confirmation.editReply(getTextGeneric("give_accept", data.textdata));
										await confirmation.followUp(getText(data));
										transferChastityKey(wearer.id, newKeyholder.id);
									},
									async (rej) => {
										// User said no.
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										await interaction.editReply(getTextGeneric("give_decline", data.textdata));
									},
								);
							} else if (restraint == "chastitybra") {
								let canRemove = await promptTransferChastityBraKey(interaction.user, wearer, newKeyholder).then(
									async (res) => {
										// User said yes
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										data.give = true;
										data.other = true;
										data[restraint] = true;
										await confirmation.editReply(getTextGeneric("give_accept", data.textdata));
										await confirmation.followUp(getText(data));
										transferChastityBraKey(wearer.id, newKeyholder.id);
									},
									async (rej) => {
										// User said no.
										let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer, c1: chosenrestraintreadable, c2: newKeyholder } };
										await interaction.editReply(getTextGeneric("give_decline", data.textdata));
									},
								);
							}
						}
					} else if (confirmation.customId === "cancel") {
						await confirmation.update({ content: "Action cancelled", components: [] });
						return; // Stop with the key cloning immediately.
					}
				} catch (err) {
					console.log(err);
					await interaction.editReply({ content: "Confirmation not received within 5 minutes, cancelling transfer.", components: [] });
					return;
				}
			} else if (subcommand == "swapitem") {
				let wearer = interaction.options.getUser("wearer") ?? interaction.user;
				let restrainttype = interaction.options.getString("restraint");
				let newrestraint = interaction.options.getString("restrainttype");

				if (!wearer || !restrainttype || !newrestraint) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nSwap ${wearer}'s ${restrainttype} to a ${newrestraint}!`, flags: MessageFlags.Ephemeral });
					return;
				}

				let newrestraintname;
				let permitted = false;
				if (restrainttype == "collar") {
					newrestraintname = getCollarName(undefined, newrestraint);
					if (getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id, true).access) {
						permitted = true;
					}
				} else if (restrainttype == "chastitybelt") {
					newrestraintname = getChastityName(undefined, newrestraint);
					if (getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id, true).access) {
						permitted = true;
					}
				} else if (restrainttype == "chastitybra") {
					newrestraintname = getChastityBraName(undefined, newrestraint);
					if (getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id, true).access) {
						permitted = true;
					}
				}

				// Catch if they ARE NOT ALLOWED
				if (!permitted) {
					interaction.reply({ content: `You don't have access to unlock ${wearer}'s ${restrainttype}!`, flags: MessageFlags.Ephemeral });
					return;
				} else if (!newrestraintname) {
					interaction.reply({ content: `Something went wrong with your new restraint selection!`, flags: MessageFlags.Ephemeral });
					return;
				}

				// Okay they're probably allowed lol
				let data = { textarray: "texts_key", textdata: { interactionuser: interaction.user, targetuser: wearer } };
				data.swapitem = true;
				if (interaction.user.id == wearer.id) {
					// swapping own keyed item
					data.self = true;
					data[restrainttype] = true;
					if (restrainttype == "collar") {
						data.textdata.c1 = getCollarName(wearer.id, getCollar(wearer.id).collartype) ?? "collar"; // Old collar
						data.textdata.c2 = newrestraintname;
						getCollar(wearer.id).collartype = newrestraint;
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybelt") {
						data.textdata.c1 = getChastityName(wearer.id, getChastity(wearer.id).chastitytype) ?? "chastity belt"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastity(wearer.id, newrestraint)){ interaction.reply({ content: `The chastity belt couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybra") {
						data.textdata.c1 = getChastityBraName(wearer.id, getChastityBra(wearer.id).chastitytype) ?? "chastity bra"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastityBra(wearer.id, newrestraint)){ interaction.reply({ content: `The chastity bra couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						interaction.reply(getText(data));
					}
				} else {
					// swapping other's keyed item
					data.other = true;
					data[restrainttype] = true;
					if (restrainttype == "collar") {
						data.textdata.c1 = getCollarName(wearer.id, getCollar(wearer.id).collartype) ?? "collar"; // Old collar
						data.textdata.c2 = newrestraintname;
						getCollar(wearer.id).collartype = newrestraint;
						if (process.readytosave == undefined) {
							process.readytosave = {};
						}
						process.readytosave.collar = true;
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybelt") {
						data.textdata.c1 = getChastityName(wearer.id, getChastity(wearer.id).chastitytype) ?? "chastity belt"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastity(wearer.id, newrestraint)){ interaction.reply({ content: `The chastity belt couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; } // I'm gonna leave this like this for now. Maybe once we have belts that can fail to unlock we can improve this.
						if (process.readytosave == undefined) {
							process.readytosave = {};
						}
						process.readytosave.chastity = true;
						interaction.reply(getText(data));
					} else if (restrainttype == "chastitybra") {
						data.textdata.c1 = getChastityBraName(wearer.id, getChastityBra(wearer.id).chastitytype) ?? "chastity bra"; // Old collar
						data.textdata.c2 = newrestraintname;
						if(!swapChastityBra(wearer.id, newrestraint)){ interaction.reply({ content: `The chastity bra couldn't be unlocked.`, flags: MessageFlags.Ephemeral }); return; }
						if (process.readytosave == undefined) {
							process.readytosave = {};
						}
						process.readytosave.chastitybra = true;
						interaction.reply(getText(data));
					}
				}
			} else if (subcommand == "discardkey") {
                let wearer = interaction.options.getUser("wearer") ?? interaction.user;
				let restrainttype = interaction.options.getString("restraint");

				if (!wearer || !restrainttype) {
					interaction.reply({ content: `Something went wrong. The command was parsed as:\nDiscard ${wearer}'s ${restrainttype} key!`, flags: MessageFlags.Ephemeral });
					return;
				}

                let discardedhelp = "collar";
                let permitted = false;
				if (restrainttype == "collar") {
					if (getCollar(wearer.id) && getCollar(wearer.id).keyholder == interaction.user.id && !getCollar(wearer.id)?.fumbled) {
						permitted = true;
					}
				} else if (restrainttype == "chastitybelt") {
					if (getChastity(wearer.id) && getChastity(wearer.id).keyholder == interaction.user.id && !getChastity(wearer.id)?.fumbled) {
                        discardedhelp = "chastity belt"
						permitted = true;
					}
				} else if (restrainttype == "chastitybra") {
					if (getChastityBra(wearer.id) && getChastityBra(wearer.id).keyholder == interaction.user.id && !getChastityBra(wearer.id)?.fumbled) {
                        discardedhelp = "chastity bra"
						permitted = true;
					}
				}

				// Catch if they ARE NOT ALLOWED
				if (!permitted) {
					interaction.reply({ content: `You don't have the primary keys to ${wearer}'s ${restrainttype}!`, flags: MessageFlags.Ephemeral });
					return;
				}

                // Okay they're probably allowed lol
				let data = { 
                    textarray: "texts_key", textdata: { 
                        interactionuser: interaction.user, 
                        targetuser: wearer,
                        c1: discardedhelp
                    },
                };
                data.discardkey = true;
                let discardedkey = discardKey(wearer.id, interaction.user.id, discardedhelp);
                if (wearer.id == interaction.user.id) {
                    data.self = true
                }
                else {
                    data.other = true
                }
                data[discardedkey] = true;
                interaction.reply(getText(data));
            }
            else if (subcommand == "menu") {
                interaction.reply(await generateKeyGivingModal(interaction.user.id, undefined, undefined, "0000"))
            }
		} catch (err) {
			console.log(err);
		}
	},
    async interactionresponse(interaction) {
        console.log(interaction)
        try {
            let optionparts = interaction.customId.split("_");
            if (optionparts[1] == "mode") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "clone") { 
                    newkeybit = `1${newkeybit.slice(1)}` 
                }
                else { 
                    newkeybit = `0${newkeybit.slice(1)}` 
                }
                await interaction.update(await generateKeyGivingModal(interaction.user.id, optionparts[3], optionparts[4], newkeybit));
			}
            else if (optionparts[1] == "key") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "chastity") {
                    if (newkeybit.charAt(1) == "0") { 
                        newkeybit = `${newkeybit.slice(0,1)}1${newkeybit.slice(2)}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,1)}0${newkeybit.slice(2)}` 
                    }
                }
                if (optionparts[2] == "chastitybra") {
                    if (newkeybit.charAt(2) == "0") { 
                        newkeybit = `${newkeybit.slice(0,2)}1${newkeybit.slice(3)}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,2)}0${newkeybit.slice(3)}` 
                    }
                }
                if (optionparts[2] == "collar") {
                    if (newkeybit.charAt(3) == "0") { 
                        newkeybit = `${newkeybit.slice(0,3)}1}` 
                    }
                    else { 
                        newkeybit = `${newkeybit.slice(0,3)}0}` 
                    }
                }
                await interaction.update(await generateKeyGivingModal(interaction.user.id, optionparts[3], optionparts[4], newkeybit));
            }
            else if (optionparts[1] == "select") {
                let newkeybit = optionparts[5]
                if (optionparts[2] == "wearerid") {
                    let newwearer = optionparts[3]
                    if (interaction.values) {
                        newwearer = interaction.values[0]
                    }
                    await interaction.update(await generateKeyGivingModal(interaction.user.id, newwearer, optionparts[4], optionparts[5]));
                }
                if (optionparts[2] == "targetid") {
                    let newtarget = optionparts[4]
                    if (interaction.values) {
                        newtarget = interaction.values[0]
                    }
                    await interaction.update(await generateKeyGivingModal(interaction.user.id, optionparts[3], newtarget, optionparts[5]));
                }
            }
            else if (optionparts[1] == "confirm") {
                let wearerid = optionparts[3];
                let targetid = optionparts[4];
                let keybit = optionparts[5];

                // Now we validate the request was GOOD and GENUINE
                let validrestraints = [];

                // Check each restraint individually. We need to verify we have primary key on it, and if a cloning, we need to ensure the target does not already have a clone
                // Chastity
                if ((keybit.charAt(1) == "1") && (getChastity(wearerid)?.keyholder == interaction.user.id) && (!getChastity(wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getChastity(wearerid)?.clonedKeyholders && getChastity(wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("chastity");
                        }
                    }
                    else {
                        validrestraints.push("chastity");
                    }
                }
                // Chastity Bra
                if ((keybit.charAt(2) == "1") && (getChastityBra(wearerid)?.keyholder == interaction.user.id) && (!getChastityBra(wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getChastityBra(wearerid)?.clonedKeyholders && getChastityBra(wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("chastitybra");
                        }
                    }
                    else {
                        validrestraints.push("chastitybra");
                    }
                }
                // Collar
                if ((keybit.charAt(3) == "1") && (getCollar(wearerid)?.keyholder == interaction.user.id) && (!getCollar(wearerid)?.fumbled)) {
                    if (keybit.charAt(0) == "1") {
                        if (!(getCollar(wearerid)?.clonedKeyholders && getCollar(wearerid)?.clonedKeyholders.includes(targetid))) {
                            validrestraints.push("collar");
                        }
                    }
                    else {
                        validrestraints.push("collar");
                    }
                }

                if (validrestraints.length <= 0) {
                    // They somehow selected stuff but cannot actually DO any of these requests. Tell them.
                    await interaction.reply({ content: `You have chosen options which cannot be executed. Please try again.`})
                    return;
                }

                // Determine if we can shortcut the requesting process. 
                let giveauto = false;
                if (((getOption(wearerid, "keygiving") == "auto") && (keybit.charAt(0) == "0")) ||
                    ((getOption(wearerid, "keycloning") == "auto") && (keybit.charAt(0) == "1"))) {
                    giveauto = true;
                }
                if ((interaction.user.id == wearerid) || (wearerid == targetid)) {
                    // This is us, we are probably okay with what we're about to do. 
                    // Or the wearer is the target, they're probably okay with having
                    // their keys again. Maybe. They might be bondage sluts, who knows.
                    // Regardless, no consent issues here. 
                    giveauto = true;
                }

                // Make restraints text
                let restraintstext = ``;
                if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                    restraintstext = `${restraintstext}${process.emojis.chastity}**chastity belt**, `
                }
                if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                    restraintstext = `${restraintstext}${process.emojis.chastitybra}**chastity bra**, `
                }
                if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                    restraintstext = `${restraintstext}${process.emojis.collar}**collar**, `
                }
                restraintstext = restraintstext.slice(0,-2)

                await interaction.reply({ content: `${(keybit.charAt(0) == "0") ? "Giving" : "Cloning"} keys...`, flags: MessageFlags.Ephemeral })

                // Set up a collector for the response by sending a DM to the wearer. 
                if (!giveauto) {
                    let outtext = ``;
                    let outend = ``;
                    if (keybit.charAt(0) == "0") {
                        // Give
                        outtext = `<@${interaction.user.id}> would like to give the keys for your `
                        outend = ` to <@${targetid}>. \n*${getPronouns(interaction.user.id, "subject", true)} will no longer have access to your restraint*\n\n**Accept** or **Deny** this request below:`
                    }
                    else {
                        // Clone
                        outtext = `<@${interaction.user.id}> would like to clone the keys for your `
                        outend = ` and give the clones to <@${targetid}>.\n\n**Accept** or **Deny** this request below:`
                    }
                    outtext = `${outtext}${restraintstext}${outend}`

                    let confirmdenybuttons = [
                        new ButtonBuilder()
                            .setCustomId(`deny`)
                            .setLabel("Deny")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`confirm`)
                            .setLabel("Accept")
                            .setStyle(ButtonStyle.Success)
                    ];
                    let targetuser = await interaction.guild.members.fetch(targetid)
                    let pagecomponents = [new TextDisplayBuilder().setContent(outtext), new ActionRowBuilder().addComponents(...confirmdenybuttons)]
                    let dmchannel = await targetuser.createDM();
                    try {
                        await dmchannel.send({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] }).then((mess) => {
                            const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });
                            collector.on("collect", async (i) => {
                                if (i.customId == "confirm") {
                                    await mess.delete().then(() => {
                                        i.reply(`Confirmed - <@${targetid}> will receive keys to your restraints!`);
                                    });
                                    let wearertext = (wearerid == interaction.user.id) ? `your` : `<@${wearerid}>'s`
                                    let desttext = (targetid == wearerid) ? `${getPronouns(wearerid, "object")}` : `<@${targetid}>`
                                    // Do stuff!
                                    // Chastity
                                    if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferChastityKey(wearerid, targetid);
                                        }
                                        else {
                                            cloneChastityKey(wearerid, targetid);
                                        }
                                    }
                                    if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferChastityBraKey(wearerid, targetid);
                                        }
                                        else {
                                            cloneChastityBraKey(wearerid, targetid);
                                        }
                                    }
                                    if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                                        if (keybit.charAt(0) == "0") { // Give
                                            transferCollarKey(wearerid, targetid);
                                        }
                                        else {
                                            cloneCollarKey(wearerid, targetid);
                                        }
                                    }
                                    interaction.editReply(`${(keybit.charAt(0) == "0") ? `Transferred ` : `Cloned `}keys for ${wearertext} ${restraintstext} to ${desttext}.`)
                                    return;
                                } else {
                                    await mess.delete().then(() => {
                                        i.reply(`Rejected - <@${targetid}> will NOT receive keys to your restraints!`);
                                        return;
                                    });
                                }
                            });

                            collector.on("end", async (collected) => {
                                // timed out
                                if (collected.length == 0) {
                                    await mess.delete().then(() => {
                                        i.reply(`Timed Out - <@${targetid}> will NOT receive keys to your restraints!`);
                                        return;
                                    });
                                }
                            });
                        })
                    }
                    catch (err) {
                        interaction.editReply(`Failed to send a DM to the wearer either because they've blocked the bot or are not accepting DMs from this server. Keys were not transferred or cloned.`)
                        return;
                    }
                }
                else {
                    let wearertext = (wearerid == interaction.user.id) ? `your` : `<@${wearerid}>'s`
                    let desttext = (targetid == wearerid) ? `${getPronouns(wearerid, "object")}` : `<@${targetid}>`
                    // Do stuff!
                    // Chastity
                    if ((keybit.charAt(1) == "1") && validrestraints.includes("chastity")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferChastityKey(wearerid, targetid);
                        }
                        else {
                            cloneChastityKey(wearerid, targetid);
                        }
                    }
                    if ((keybit.charAt(2) == "1") && validrestraints.includes("chastitybra")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferChastityBraKey(wearerid, targetid);
                        }
                        else {
                            cloneChastityBraKey(wearerid, targetid);
                        }
                    }
                    if ((keybit.charAt(3) == "1") && validrestraints.includes("collar")) {
                        if (keybit.charAt(0) == "0") { // Give
                            transferCollarKey(wearerid, targetid);
                        }
                        else {
                            cloneCollarKey(wearerid, targetid);
                        }
                    }
                    interaction.editReply(`${(keybit.charAt(0) == "0") ? `Transferred ` : `Cloned `}keys for ${wearertext} ${restraintstext} to ${desttext}.`)
                    return;
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};
