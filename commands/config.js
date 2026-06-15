const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, PermissionsBitField, ApplicationCommandOptionChannelTypesMixin } = require("discord.js");
const { generateConfigModal, } = require("./../functions/configfunctions.js");
const { removeAllCommands } = require("../functions/configfunctions.js");
const { setCommands, generateTextEntryModal } = require("../functions/configfunctions.js");
const { processTimedEvents } = require("../functions/timefunctions.js");
const { generateUserEntryModal } = require("../functions/configfunctions.js");
const { getOption } = require("../functions/getters/config/getOption.js");
const { getServerOption } = require("../functions/getters/config/getServerOption.js");
const { getBotOption } = require("../functions/getters/config/getBotOption.js");
const { setServerOption } = require("../functions/setters/config/setServerOption.js");
const { createWebhook } = require("../functions/setters/config/createWebhook.js");
const { deleteWebhook } = require("../functions/setters/config/deleteWebhook.js");
const { leaveServerOptions } = require("../functions/setters/config/leaveServerOptions.js");
const { setOption } = require("../functions/setters/config/setOption.js");
const { configoptions } = require("../lists/configoptions.js");
const { initializeServerOptions } = require("../functions/other/initializeServerOptions.js");
const { markForSave } = require("../functions/other/markForSave.js");

module.exports = {
	data: new SlashCommandBuilder().setName("config").setDescription(`Configure settings...`),
	async execute(interaction) {
		try {
			interaction.reply(await generateConfigModal(interaction, "General", 1));
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");

            console.log(optionparts);

			// We changed page, new page!
			if (optionparts[1] == "menuselector") {
				interaction.update(await generateConfigModal(interaction, interaction.values[0].split("_")[1], 1));
			} else if (optionparts[1] == "pageopt") {
				if (optionparts[2] == "Extreme") {
					optionparts[4] = optionparts.slice(4).join("_");
					console.log(optionparts);
				}
				// Frankly I hate arrays for this but lets break it down.
				// We retrieve all of the choices for the given configuration option, mapping their values.
				// We then find the current value and then increment it, resetting to 0 when out of range.
				// Then we assign it to setOption. This means that choices are chosen from top to bottom in a circle.
				let optionschoice = configoptions[optionparts[2]][optionparts[4]].choices.map((c) => c.value);
				let newindex = optionschoice.indexOf(getOption(interaction.user.id, optionparts[4])) + 1;
				if (newindex >= optionschoice.length) {
					newindex = 0;
				}
				setOption(interaction.user.id, optionparts[4], optionschoice[newindex]);

				// After doing so, run the NEW option's select_function.
				if (typeof configoptions[optionparts[2]][optionparts[4]].choices[newindex].select_function == "function") {
					await configoptions[optionparts[2]][optionparts[4]].choices[newindex]["select_function"](interaction.user.id);
				}

				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, optionparts[2], optionparts[3]));
			} else if (optionparts[1] == "spageopt") {
				// Frankly I hate arrays for this but lets break it down. For servers this time.
				// We retrieve all of the choices for the given configuration option, mapping their values.
				// We then find the current value and then increment it, resetting to 0 when out of range.
				// Then we assign it to setOption. This means that choices are chosen from top to bottom in a circle.
				let optionschoice = configoptions[optionparts[2]][optionparts[3]].choices.map((c) => c.value);
				let newindex = optionschoice.indexOf(getServerOption(interaction.guildId, optionparts[3])) + 1;
				if (newindex >= optionschoice.length) {
					newindex = 0;
				}
				setServerOption(interaction.guildId, optionparts[3], optionschoice[newindex]);

				// After doing so, run the NEW option's select_function.
				if (typeof configoptions[optionparts[2]][optionparts[3]].choices[newindex].select_function == "function") {
					configoptions[optionparts[2]][optionparts[3]].choices[newindex].select_function(interaction, interaction.guildId);
				}

				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, optionparts[2], 1));
			} else if (optionparts[1] == "bpageopt") {
				// Frankly I hate arrays for this but lets break it down. For servers this time.
				// We retrieve all of the choices for the given configuration option, mapping their values.
				// We then find the current value and then increment it, resetting to 0 when out of range.
				// Then we assign it to setOption. This means that choices are chosen from top to bottom in a circle.
				let optionschoice = configoptions[optionparts[2]][optionparts[4]].choices.map((c) => c.value);
				let newindex = optionschoice.indexOf(getBotOption(optionparts[4])) + 1;
				if (newindex >= optionschoice.length) {
					newindex = 0;
				}
				setBotOption(optionparts[4], optionschoice[newindex]);

				// After doing so, run the NEW option's select_function.
				if (typeof configoptions[optionparts[2]][optionparts[4]].choices[newindex].select_function == "function") {
					configoptions[optionparts[2]][optionparts[4]].choices[newindex].select_function(interaction, interaction.guildId);
				}

				if (optionparts[3] == "bot-timetickrate") {
					clearInterval(process.timetick);
					process.timetick = setInterval(
						() => {
							processTimedEvents();
						},
						getBotOption("bot-timetickrate") ?? 6000,
					);
				}

				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, optionparts[2], optionparts[3]));
			} else if (optionparts[1] == "tentrypageopt") {
				// Frankly I hate arrays for this but lets break it down. All we need is to throw a modal at them
				let buttonpressed = configoptions[optionparts[2]][optionparts[3]];
				let data = { title: buttonpressed.name, desctext: buttonpressed.descmodal, placeholder: buttonpressed.placeholder, page: optionparts[2], pagenum: optionparts[4] };
				if (typeof buttonpressed.customtext == "function") {
					data.desctext = data.desctext.replace("CUSTOMTEXT", buttonpressed.customtext(interaction.user.id));
				}
				if (typeof buttonpressed.placeholder == "function") {
					data.placeholder = buttonpressed.placeholder(interaction.user.id);
				}
                if (!data.pagenum) { data.pagenum = 1 };

				// Generate a new modal to give to the user and pass it along.
				await interaction.showModal(generateTextEntryModal(interaction, data, optionparts[3]));
            } else if (optionparts[1] == "uentrypageopt") {
				// Frankly I hate arrays for this but lets break it down. All we need is to throw a modal at them
                console.log(interaction)
				let buttonpressed = configoptions[optionparts[2]][optionparts[3]];
				let data = { title: buttonpressed.name, desctext: buttonpressed.descmodal, placeholder: buttonpressed.placeholder, page: optionparts[2], pagenum: optionparts[4] };
				if (typeof buttonpressed.customtext == "function") {
					data.desctext = data.desctext.replace("CUSTOMTEXT", buttonpressed.customtext(interaction.user.id));
				}
				if (typeof buttonpressed.placeholder == "function") {
					data.placeholder = buttonpressed.placeholder(interaction.user.id);
				}
                if (!data.pagenum) { data.pagenum = 1 };

				// Generate a new modal to give to the user and pass it along.
				await interaction.showModal(generateUserEntryModal(interaction, data, optionparts[3]));
			} else if (optionparts[1] == "refreshcmdButton") {
				await setCommands(interaction, interaction.guildId);

				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, "Server"));
			} else if (optionparts[1] == "serveroptchannel") {
				let savedchannels = [];
				let failedtext = ``;
				let channelsselected = interaction.channels ? interaction.channels?.keys() : [];
				channelsselected = Array.from(channelsselected);
				let oldchannelsselected = getServerOption(interaction.guildId, "server-channelspermitted");
				// Missing channels in channelsselected versus oldchannelsselected should be removed.
				let filteredlistfordeletes = oldchannelsselected.filter((f) => !channelsselected.includes(f));
				// delete them!
				filteredlistfordeletes.forEach(async (c) => {
					let channel = await interaction.client.channels.fetch(c);
					console.log("DELETING WEBHOOK");
					let webhookdeleted = await deleteWebhook(interaction, channel);
					if (webhookdeleted == "bot") {
						// We have a successful webhook AND Manage Messages.
						failedtext = `${failedtext}\n-# ✅ ***Deleted auto-generated webhook in #${channel.name}***`;
					} else if (webhookdeleted == "notbot") {
						// We have a successful webhook AND Manage Messages.
						failedtext = `${failedtext}\n-# ✅ ***Unregistered webhook in #${channel.name}.***`;
					} else {
						webhookdeleted = `${failedtext}\n-# ❌ ***Failed to delete webhook or missing perms for #${channel.name}***`;
					}
				});
				// Now filter the opposite direction, to detect additions.
				let filteredlistforcreation = channelsselected.filter((f) => !oldchannelsselected.includes(f));
				filteredlistforcreation.forEach(async (c) => {
					let channel = await interaction.client.channels.fetch(c);
					console.log("CREATING WEBHOOK");
					let webhook = await createWebhook(interaction, channel);
					if (webhook && webhook.humanwebhook && channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageMessages)) {
						// We have a successful webhook AND Manage Messages.
						failedtext = `${failedtext}\n-# ✅ ***Registered webhook and can manage messages in #${channel.name}, with external emoji***`;
						savedchannels.push(c);
					} else if (webhook && !webhook.humanwebhook && channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.ManageMessages)) {
						// We have a successful webhook AND Manage Messages.
						failedtext = `${failedtext}\n-# ⚠️ ***Auto-created webhook and can manage messages in #${channel.name}. Note, this will not allow external emoji. You need to create a new webhook yourself for this channel named "Gagbot" and re-set this channel.***`;
						savedchannels.push(c);
					} else {
						failedtext = `${failedtext}\n-# ❌ ***Failed to create webhook or missing perms for #${channel.name}***`;
					}
				});
				function sleep(ms) {
					return new Promise((resolve) => setTimeout(resolve, ms));
				}
				await sleep(500); // Pauses for 200 milliseconds
				// Concat, and then use the Set syntax to filter dupes.
				let uniquesavedchannels = [...new Set(savedchannels.concat(...channelsselected))];
				console.log(failedtext);
				setServerOption(interaction.guildId, "server-channelspermitted", uniquesavedchannels);
				console.log(getServerOption(interaction.guildId, "server-channelspermitted"));
				interaction.update(await generateConfigModal(interaction, optionparts[2], undefined, failedtext.length > 0 ? failedtext : undefined));
			} else if (optionparts[1] == "botguilds") {
				let page;
				if (optionparts[4] == "delete") {
					leaveServerOptions(optionparts[3]);
					await removeAllCommands(interaction, optionparts[3]);
				} else if (optionparts[4] == "setup") {
					initializeServerOptions(optionparts[3]);
					await setCommands(interaction, optionparts[3]);
				} else if (optionparts[4] == "down") {
					page = parseInt(optionparts[3]) - 1;
				} else if (optionparts[4] == "up") {
					page = parseInt(optionparts[3]) + 1;
				}
				interaction.update(await generateConfigModal(interaction, optionparts[2], page ? page : 1));
			} else if (optionparts[1] == "createnewconfig") {
				await interaction.client.application.fetch();
				let canadd = getBotOption("bot-allownewsetup") == "Disabled" && interaction.user.id != interaction.client.application.owner.id;
				console.log(!canadd);
				if (!canadd) {
					console.log(interaction.guildId);
					initializeServerOptions(interaction.guildId);
					await setCommands(interaction, interaction.guildId);
				}
				interaction.update(await generateConfigModal(interaction, optionparts[2], 1));
			} else if (optionparts[1] == "pageoptrevoke") {
				// Revoke that CONSENT
				if (process.consented[interaction.user.id]) {
					delete process.consented[interaction.user.id];
					markForSave("consented");
				}
				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, optionparts[2], 1));
			} else if (optionparts[1] == "serveroptrole") {
				if (interaction.values.length > 0) {
					newrole = interaction.values[0];
					setServerOption(interaction.guildId, "server-safewordroleid", newrole);
				} else {
					setServerOption(interaction.guildId, "server-safewordroleid", "");
				}

				// Finally, reprompt the user, now with the new choice set.
				interaction.update(await generateConfigModal(interaction, optionparts[2], 1));
			} else if (optionparts[1] == "optionbutton") {
				let page;
				if (optionparts[4] == "down") {
					page = parseInt(optionparts[3]) - 1;
				} else if (optionparts[4] == "up") {
					page = parseInt(optionparts[3]) + 1;
				}
				interaction.update(await generateConfigModal(interaction, optionparts[2], page ? page : 1));
			} else {
				console.log(interaction);
			}
		} catch (err) {
			console.log(err);
		}
	},
	async modalexecute(interaction) {
		let choiceinput;
		let optionparts = interaction.customId.split("_");
		if (optionparts[3] == "dollvisorname") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
			setOption(interaction.user.id, optionparts[3], choiceinput.slice(0, 30));
			await interaction.reply({ content: `Updated your Doll Visor designation to ${choiceinput.slice(0, 30)}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "dronevisorname") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
			setOption(interaction.user.id, optionparts[3], choiceinput.slice(0, 30));
			await interaction.reply({ content: `Updated your ⬡-Drone Visor designation to ${choiceinput.slice(0, 30)}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "dollpunishwords") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
            let punishwordsseparated = choiceinput.split(",")
            let punishmentarr = [];
            punishwordsseparated.forEach((w) => {
                punishmentarr.push(w)
            })
            setOption(interaction.user.id, optionparts[3], punishmentarr);
            await interaction.reply({ content: `Updated your punishment words to the following:\n- ${punishwordsseparated.join("\n- ")}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
        }
        if (optionparts[3] == "engravedcollarname") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
			setOption(interaction.user.id, optionparts[3], choiceinput.slice(0, 30));
			await interaction.reply({ content: `Updated your Engraved Collar tag to ${choiceinput.slice(0, 30)}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "deferentialgagsubject") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
			setOption(interaction.user.id, optionparts[3], choiceinput.slice(0, 30));
			await interaction.reply({ content: `Updated your Deferential Gag subject to ${choiceinput.slice(0, 30)}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "forbiddengagpunishwords") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
            let punishwordsseparated = choiceinput.split(",")
            let punishmentarr = [];
            punishwordsseparated.forEach((w) => {
                punishmentarr.push(w)
            })
            setOption(interaction.user.id, optionparts[3], punishmentarr);
            await interaction.reply({ content: `Updated your Forbidden Gag words to the following:\n- ${punishwordsseparated.join("\n- ")}`, flags: MessageFlags.Ephemeral });
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
        }
        if (optionparts[3] == "profilelink") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
            if (choiceinput && choiceinput.length > 0) {
                setOption(interaction.user.id, optionparts[3], choiceinput);
                await interaction.reply({ content: `Updated your profile link to ${choiceinput}`, flags: MessageFlags.Ephemeral });
            }
            else {
                setOption(interaction.user.id, optionparts[3], ``);
                await interaction.reply({ content: `Cleared profile link`, flags: MessageFlags.Ephemeral });
            }
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "kinklistlink") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
            if (choiceinput && choiceinput.length > 0) {
                setOption(interaction.user.id, optionparts[3], choiceinput);
                await interaction.reply({ content: `Updated your kink list link to ${choiceinput}`, flags: MessageFlags.Ephemeral });
            }
            else {
                setOption(interaction.user.id, optionparts[3], ``);
                await interaction.reply({ content: `Cleared profile link`, flags: MessageFlags.Ephemeral });
            }
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "preferredtitle") {
            choiceinput = interaction.fields.getTextInputValue("choiceinput");
            if (choiceinput && choiceinput.length > 0) {
                setOption(interaction.user.id, optionparts[3], choiceinput);
                await interaction.reply({ content: `Updated your preferred title to ${choiceinput}`, flags: MessageFlags.Ephemeral });
            }
            else {
                setOption(interaction.user.id, optionparts[3], ``);
                await interaction.reply({ content: `Cleared Preferred Titles`, flags: MessageFlags.Ephemeral });
            }
			if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
		}
        if (optionparts[3] == "allowedheadpats") {
            choiceinput = interaction.fields.getSelectedUsers("choiceinput");
            let choiceusers = Array.from(choiceinput) ?? [];
            if (choiceusers.length > 0) {
                choiceusers = choiceusers.map((a) => a[0]).sort()
            }
            setOption(interaction.user.id, optionparts[3], choiceusers);
            await interaction.reply({ content: `Updated allowed users to headpat you to ${choiceusers.map((a) => { return `<@${a}>`}).join(", ")}`, flags: MessageFlags.Ephemeral });
            if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
        }
        if (optionparts[3] == "allowedshock") {
            choiceinput = interaction.fields.getSelectedUsers("choiceinput");
            let choiceusers = Array.from(choiceinput) ?? [];
            if (choiceusers.length > 0) {
                choiceusers = choiceusers.map((a) => a[0]).sort()
            }
            setOption(interaction.user.id, optionparts[3], choiceusers);
            await interaction.reply({ content: `Updated allowed users to shock you to ${choiceusers.map((a) => { return `<@${a}>`}).join(", ")}`, flags: MessageFlags.Ephemeral });
            if (process.recentinteraction) {
				if (process.recentinteraction[interaction.user.id]?.timestamp + 895000 > performance.now()) {
					await process.recentinteraction[interaction.user.id].interaction.editReply(await generateConfigModal(process.recentinteraction[interaction.user.id].interaction, optionparts[2], optionparts[4]));
				}
				delete process.recentinteraction[interaction.user.id];
			}
        }
	},
};
