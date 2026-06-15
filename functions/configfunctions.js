const { ButtonStyle, ActionRowBuilder, SectionBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField, MessageFlags, RoleSelectMenuBuilder, TextDisplayBuilder, ChannelSelectMenuBuilder, REST, Routes, ButtonBuilder, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getOption } = require("./getters/config/getOption.js");
const { getServerCmdRefresh } = require("./getters/config/getServerCmdRefresh.js");
const { getServerOption } = require("./getters/config/getServerOption.js");
const { getBotOption } = require("./getters/config/getBotOption.js");
const { configoptions } = require("../lists/configoptions.js");

function generateConfigModal(interaction, menuset = "General", page, statustext) {
	console.log("Start of generate config modal");
	return new Promise(async (res, rej) => {
		let pagecomponents = [];

		if (process.configs == undefined) {
			process.configs = {};
		}
		if (process.configs.servers == undefined) {
			process.configs.servers = {};
		}
		let placenum = page ?? 1;
		let keys = Object.keys(configoptions[menuset]);
		if (menuset !== "Server") {
			keys = keys.slice((placenum - 1) * 4, placenum * 4);
		}

		keys.forEach(async (k) => {
			if (configoptions[menuset][k].menutype == "choice") {
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id, k))?.helptext}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_pageopt_${menuset}_${page}_${k}`)
							.setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id, k))?.name ?? "Undefined")
							.setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id, k))?.style ?? ButtonStyle.Danger)
							.setDisabled(configoptions[menuset][k].disabled(interaction.user.id)),
					);
				pagecomponents.push(buttonsection);
			} else if (configoptions[menuset][k].menutype == "choice_textentry") {
				/*else if (configoptions[menuset][k].menutype == "choice_extreme") {
                let buttonsection = new SectionBuilder()
                    .addTextDisplayComponents(
                        (textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.helptext}`)
                    )
                    .setButtonAccessory((button) =>
                        button.setCustomId(`config_pageopt_${menuset}_${k}`)
                            .setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.name ?? "Undefined")
                            .setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id,k))?.style ?? ButtonStyle.Danger)
                            .setDisabled(configoptions[menuset][k].disabled(interaction.user.id))
                    )
                pagecomponents.push(buttonsection)
            }*/
				let helpertext = `${configoptions[menuset][k].choices[0].helptext}${configoptions[menuset][k].textvaluedisplay(getOption(interaction.user.id, k))}`;
				if (getOption(interaction.user.id, k) == undefined) {
					helpertext = `${configoptions[menuset][k].choices[0].helptextnone}`;
				}
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${helpertext}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_tentrypageopt_${menuset}_${k}_${page}`)
							.setLabel(configoptions[menuset][k].choices[0].name ?? "Undefined")
							.setStyle(configoptions[menuset][k].choices[0].style ?? ButtonStyle.Danger)
							.setDisabled(configoptions[menuset][k].disabled(interaction.user.id)),
					);
				pagecomponents.push(buttonsection);
            } else if (configoptions[menuset][k].menutype == "choice_userentry") {
                let userarr = getOption(interaction.user.id, k) ?? [];
				let helpertext = `No Users`
                if (userarr.length > 0) {
                    helpertext = `${userarr.map((u) => `<@${u}>`).join(", ")}`;
                }
				if (getOption(interaction.user.id, k) == undefined) {
					helpertext = `${configoptions[menuset][k].choices[0].helptextnone}`;
				}
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${helpertext}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_uentrypageopt_${menuset}_${k}_${page}`)
							.setLabel(configoptions[menuset][k].choices[0].name ?? "Undefined")
							.setStyle(configoptions[menuset][k].choices[0].style ?? ButtonStyle.Danger)
							.setDisabled(configoptions[menuset][k].disabled(interaction.user.id)),
					);
				pagecomponents.push(buttonsection);
			}
			if (configoptions[menuset][k].menutype == "choice_dollcolor") {
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\`\`\`ansi\n[1;${getOption(interaction.user.id, k)}m${getOption(interaction.user.id, "dollvisorname")}: [0mIt is speaking.\`\`\``))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_pageopt_${menuset}_${page}_${k}`)
							.setLabel(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id, k))?.name ?? "Undefined")
							.setStyle(configoptions[menuset][k].choices.find((f) => f.value == getOption(interaction.user.id, k))?.style ?? ButtonStyle.Danger)
							.setDisabled(configoptions[menuset][k].disabled(interaction.user.id)),
					);
				pagecomponents.push(buttonsection);
			} else if (configoptions[menuset][k].menutype == "choice_server_refreshcmd") {
				if (process.configs.servers[interaction.guildId] != undefined) {
					let button = new ButtonBuilder()
						.setCustomId(`config_refreshcmdButton_${k}`)
						.setLabel(`Refresh Commands${getServerCmdRefresh(interaction.guildId) > 0 ? ` (Wait ${getServerCmdRefresh(interaction.guildId)}s)` : ""}`)
						.setStyle(ButtonStyle.Primary)
						.setDisabled(getServerCmdRefresh(interaction.guildId) > 0);
					pagecomponents.push(new ActionRowBuilder().addComponents(button));
				}
			} else if (configoptions[menuset][k].menutype == "choice_server") {
				if (process.configs.servers[interaction.guildId] != undefined) {
					let buttonsection = new SectionBuilder()
						.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId, k))?.helptext}`))
						.setButtonAccessory((button) =>
							button
								.setCustomId(`config_spageopt_${menuset}_${k}`)
								.setLabel(configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId, k))?.name)
								.setStyle(configoptions[menuset][k].choices.find((f) => f.value == getServerOption(interaction.guildId, k))?.style)
								.setDisabled(configoptions[menuset][k].disabled(interaction.guildId)),
						);
					pagecomponents.push(buttonsection);
				}
			} else if (configoptions[menuset][k].menutype == "choice_server_channels") {
				if (process.configs.servers[interaction.guildId] != undefined) {
					let currentrole = "Select allowed channels...";
					let channelsmentioned = [];
					if (getServerOption(interaction.guildId, "server-channelspermitted") && getServerOption(interaction.guildId, "server-channelspermitted").length > 0) {
						channelsmentioned = getServerOption(interaction.guildId, "server-channelspermitted");
					}

					let roledescription = new TextDisplayBuilder().setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}${statustext ? statustext : ""}`);
					let component = new ChannelSelectMenuBuilder().setCustomId(`config_serveroptchannel_${menuset}_${k}`).setPlaceholder(currentrole).setMinValues(0).setMaxValues(25);

					if (channelsmentioned && channelsmentioned.length > 0) {
						component.setDefaultChannels(...[...new Set(channelsmentioned)]);
					}
					let rolesection = new ActionRowBuilder().addComponents(component);
					pagecomponents.push(roledescription);
					pagecomponents.push(rolesection);
				}
			} else if (configoptions[menuset][k].menutype == "choice_server_role") {
				if (process.configs.servers[interaction.guildId] != undefined) {
					let currentrole = "Select safeword role...";
					let rolefetched;
					if (getServerOption(interaction.guildId, k) && getServerOption(interaction.guildId, k).length > 0) {
						rolefetched = await interaction.guild.roles.fetch(getServerOption(interaction.guildId, k));
					}

					let roledescription = new TextDisplayBuilder().setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}`);

					let rolebit = new RoleSelectMenuBuilder().setCustomId(`config_serveroptrole_${menuset}_${k}`).setPlaceholder(currentrole).setMinValues(0).setMaxValues(1);

					if (rolefetched) {
						rolebit.setDefaultRoles(getServerOption(interaction.guildId, k));
					}

					let rolesection = new ActionRowBuilder().addComponents(rolebit);

					pagecomponents.push(roledescription);
					pagecomponents.push(rolesection);
				} else {
					// Create a text box explaining the server doesn't have a configuration yet
					// And a shiny button to create a default.
					let disabled = getBotOption("bot-allownewsetup") == "Disabled" && interaction.user.id != interaction.client.application.owner.id;
					let noserverdescription = new TextDisplayBuilder().setContent(`### This server does not yet have a configuration. Click the button below to setup default settings.\nSetting up **${interaction.guild.name}**`);
					let button = new ButtonBuilder().setCustomId(`config_createnewconfig_${menuset}_${k}`).setLabel(`Create Default Config`).setStyle(ButtonStyle.Primary).setDisabled(disabled);
					let noserverdescription2 = new TextDisplayBuilder().setContent(disabled ? `-# The bot's owner has forbidden new installations except from them. Please contact them for initial setup.` : `-# You will then be able to use slash commands here.`);
					pagecomponents.push(noserverdescription);
					pagecomponents.push(new ActionRowBuilder().addComponents(button));
					pagecomponents.push(noserverdescription2);
				}
			} else if (configoptions[menuset][k].menutype == "choice_bot") {
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}\n-# ‎   ⤷ ${configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.helptext}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_bpageopt_${menuset}_${page}_${k}`)
							.setLabel(configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.name)
							.setStyle(configoptions[menuset][k].choices.find((f) => f.value == getBotOption(k))?.style)
							.setDisabled(configoptions[menuset][k].disabled(interaction.user.id)),
					);
				pagecomponents.push(buttonsection);
			} else if (configoptions[menuset][k].menutype == "choice_revokeconsent") {
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_pageoptrevoke_${menuset}`)
							.setLabel(`Revoke Consent`)
							.setStyle(ButtonStyle.Danger)
							.setDisabled(process.consented[interaction.user.id] == undefined),
					);
				pagecomponents.push(buttonsection);
			} else if (configoptions[menuset][k].menutype == "choice_") {
				let buttonsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${configoptions[menuset][k].name}\n${configoptions[menuset][k].desc}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_pageoptrevoke_${menuset}`)
							.setLabel(`Revoke Consent`)
							.setStyle(ButtonStyle.Danger)
							.setDisabled(process.consented[interaction.user.id] == undefined),
					);
				pagecomponents.push(buttonsection);
			}
		});
		if (Object.keys(configoptions[menuset]).length > 4 && menuset != "Server") {
			let optionbuttons = [
				// Page Down
				new ButtonBuilder()
					.setCustomId(`config_optionbutton_${menuset}_${placenum}_down`)
					.setLabel("← Prev Page")
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(placenum <= 1),
				// Page Up
				new ButtonBuilder()
					.setCustomId(`config_optionbutton_${menuset}_${placenum}_up`)
					.setLabel("Next Page →")
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(placenum >= Math.ceil(Object.keys(configoptions[menuset]).length / 4)),
			];
			pagecomponents.push(new ActionRowBuilder().addComponents(...optionbuttons));
		}

		// If bot owner, construct a selector for servers here and allow them to create defaults and then to leave after.
		await interaction.client.application.fetch();
		if (menuset == "Bot" && interaction.user.id == interaction.client.application.owner.id) {
			let choicegap = new TextDisplayBuilder().setContent(`‎`);
			pagecomponents.push(choicegap);
			let placenum = page ?? 1;
			let allguilds = process.joinedguilds.slice((placenum - 1) * 4, placenum * 4);
			allguilds.forEach(async (g) => {
				let guildsection = new SectionBuilder()
					.addTextDisplayComponents((textdisplay) => textdisplay.setContent(`### ${Object.keys(process.configs.servers).includes(g.id) ? "Delete Config in " : "Create Default in "}${g.name}\n-# ‎   ⤷ ${Object.keys(process.configs.servers).includes(g.id) ? `Loaded with ${g.commands} commands` : `*Not Active on this Server*`}`))
					.setButtonAccessory((button) =>
						button
							.setCustomId(`config_botguilds_${menuset}_${g.id}_${Object.keys(process.configs.servers).includes(g.id) ? "delete" : "setup"}`)
							.setLabel(Object.keys(process.configs.servers).includes(g.id) ? "Delete Config" : "Setup Default Config")
							.setStyle(Object.keys(process.configs.servers).includes(g.id) ? ButtonStyle.Danger : ButtonStyle.Primary),
					);

				pagecomponents.push(guildsection);
			});
			let buttons = [
				// Page Down
				new ButtonBuilder()
					.setCustomId(`config_botguilds_${menuset}_${placenum}_down`)
					.setLabel("← Prev Page")
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(placenum <= 1),
				// Page Up
				new ButtonBuilder()
					.setCustomId(`config_botguilds_${menuset}_${placenum}_up`)
					.setLabel("Next Page →")
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(placenum >= Math.ceil(process.joinedguilds.length / 4)),
			];
			pagecomponents.push(new ActionRowBuilder().addComponents(...buttons));
		}

		// Create Menu Selector
		let pagemenutext = menuset;
		// Construct the menu selector
		let menupageoptions = new StringSelectMenuBuilder().setCustomId("config_menuselector");

		let menupageoptionsarr = [];
		Object.keys(configoptions).forEach((k) => {
			if ((k != "Server") && (k != "Bot")) {
                if (k == "Pishock Config") {
                    if ((getOption(interaction.user.id, "shockermodel") == "pishock")) {
                        let opt = new StringSelectMenuOptionBuilder().setLabel(k).setValue(`menuopt_${k}`);
				        menupageoptionsarr.push(opt);
                    }
                }
                else {
                    let opt = new StringSelectMenuOptionBuilder().setLabel(k).setValue(`menuopt_${k}`);
				    menupageoptionsarr.push(opt);
                }
			}
		});

		// If the user is a moderator on that server, allow configuration of that server
		// Note, they must have global manage messages permission.
		let inguild = false;
		try {
			await interaction.client.guilds.fetch(interaction.guildId);
			inguild = true;
		} catch (err) {
			// Probably not in a guild, so dont add this bit lol
			// console.log(err)
		}
		if (inguild && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			let opt = new StringSelectMenuOptionBuilder().setLabel("Server Settings").setValue(`menuopt_Server`);
			menupageoptionsarr.push(opt);
			// Set the page text to prettier if this is on their settings
			if (menuset == "Server") {
				pagemenutext = "Server Settings";
			}
		}

		// If the user is the owner of the bot
		// The application should already be retrieved during the index.js initialization.
		if (interaction.user.id == interaction.client.application.owner.id) {
			let opt = new StringSelectMenuOptionBuilder().setLabel("Bot Settings").setValue(`menuopt_Bot`);
			menupageoptionsarr.push(opt);
			// Set the page text to prettier if this is on their settings
			if (menuset == "Bot") {
				pagemenutext = "Bot Settings";
			}
		}

		menupageoptions.setPlaceholder(pagemenutext);

		// Add all of the available options we have for the menu selection
		menupageoptions.addOptions(...menupageoptionsarr);

		pagecomponents.push(new ActionRowBuilder().addComponents(menupageoptions));

		res({ components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] });
	}).then((res) => {
		return res;
	});
}

// Wholesale remove all commands from a guild.
async function removeAllCommands(interaction, serverID) {
	try {
		let guild = await interaction.client.guilds.fetch(serverID);
		await guild.commands.set([]);
		console.log(`Successfully discarded application (/) commands for server ID ${serverID}.`);
	} catch (err) {
		console.log(err);
	}
}

// Syncs commands for server, with disabled options removing their
// appropriate functions.
async function setCommands(interaction, serverID) {
    // Determine the nsfw level of the command. If it is level 3 (explict, in the API), individual channels
    // cannot be marked as NSFW, as the entire server is considered NSFW. So we'll disable the flag. 
    let server = await process.client.guilds.fetch(serverID);

	// Grab all the command files from the commands directory
	const commands = {};
	const commandsPath = path.join(__dirname, "..", "commands");
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const command = require(`./../commands/${file}`);
		if (command.execute && command.data) {
			commands[file] = command;
		} else {
			console.log(`Ignoring file at ./../commands/${file} because it does not have either a data or an execute export.`);
		}
	}

	// We have config globally deployed, dont have it in the guild's list lol
	delete commands["config.js"];

	// Now go through each server option (if available) and remove entries if disabled.
	if (getServerOption(serverID, "server-allowgags") == "Disabled") {
		delete commands["gag.js"];
		delete commands["ungag.js"];
	}
	if (getServerOption(serverID, "server-allowmitten") == "Disabled") {
		delete commands["mitten.js"];
		delete commands["unmitten.js"];
	}
	if (getServerOption(serverID, "server-allowvibe") == "Disabled") {
		delete commands["vibe.js"];
		delete commands["unvibe.js"];
		delete commands["letgo.js"];
	}
	if (getServerOption(serverID, "server-allowchastity") == "Disabled") {
		delete commands["chastity.js"];
		delete commands["unchastity.js"];
	}
	if (getServerOption(serverID, "server-allowcorset") == "Disabled") {
		delete commands["corset.js"];
		delete commands["uncorset.js"];
	}
	if (getServerOption(serverID, "server-allowhead") == "Disabled") {
		delete commands["mask.js"];
		delete commands["unmask.js"];
	}
	if (getServerOption(serverID, "server-allowapparel") == "Disabled") {
		delete commands["wear.js"];
		delete commands["unwear.js"];
	}
	if (getServerOption(serverID, "server-allowapparel") == "Disabled" && getServerOption(serverID, "server-allowhead") == "Disabled") {
		delete commands["item.js"];
	}

    // Mark all of the commands as NSFW, except for designated exemptions, but only if server is not NSFW
    // Discord's API really needs to get more intelligent and let us detect that directly.
    // And also allow NSFW commands on non-NSFW channels on NSFW servers.
    // Really Discord, just... let us actually change the NSFW level of a channel
    // You know you can.
    // You just have a stupid client. 
    // Anyway, this thing auto detects it now, no need to play with process flags anymore. 
    if (server.nsfwLevel < 3) {
        console.log("Server is not NSFW, setting commands to be NSFW")
        Object.keys(commands).forEach((c) => {
            if (commands[c] && commands[c].data && !["debug.js", "help.js", "pronouns.js", "reset.js"].includes(c)) {
                commands[c].data.setNSFW(true);
            }
        })
    }

	let commandsforrest = [];
	Object.keys(commands).forEach((k) => {
		commandsforrest.push(commands[k].data.toJSON());
	});

    // Context Menu Commands
    // Grab all the command files from the commands directory
	const usercontextcommands = {};
	const usercontextcommandsPath = path.join(__dirname, "..", "contextcommands", "user");
	const usercontextcommandFiles = fs.readdirSync(usercontextcommandsPath).filter((file) => file.endsWith(".js"));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of usercontextcommandFiles) {
		const command = require(`./../contextcommands/user/${file}`);
		if (command.execute && command.data) {
			usercontextcommands[file] = command;
		} else {
			console.log(`Ignoring file at ./../contextcommands/user/${file} because it does not have either a data or an execute export.`);
		}
	}
    Object.keys(usercontextcommands).forEach((k) => {
		commandsforrest.push(usercontextcommands[k].data.toJSON());
	});

    const messagecontextcommands = {};
	const messagecontextcommandsPath = path.join(__dirname, "..", "contextcommands", "message");
	const messagecontextcommandFiles = fs.readdirSync(messagecontextcommandsPath).filter((file) => file.endsWith(".js"));

	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of messagecontextcommandFiles) {
		const command = require(`./../contextcommands/message/${file}`);
		if (command.execute && command.data) {
			messagecontextcommands[file] = command;
		} else {
			console.log(`Ignoring file at ./../contextcommands/message/${file} because it does not have either a data or an execute export.`);
		}
	}
    Object.keys(messagecontextcommands).forEach((k) => {
		commandsforrest.push(messagecontextcommands[k].data.toJSON());
	});

    console.log(Object.values(commandsforrest.map((c) => c.name)));

	// Set up the REST route to overwrite the commands list for that server with our new one.
	try {
		// Run this bit asynchronously while we set up cooldown and hand back to user.
		(async () => {
			console.log(`Trying to put ${commandsforrest.length} commands into ${serverID}`);
			console.log(interaction.client.user.id);
			const rest = new REST({ version: "10" }).setToken(process.env.DISCORDBOTTOKEN);
			const data = await rest.put(Routes.applicationGuildCommands(interaction.client.user.id, serverID), { body: commandsforrest }).catch((err) => {
				console.log(err);
			});
			console.log(`Successfully reloaded ${data.length} application commands into server ID ${serverID}.`);
		})();

		console.log(Math.floor(performance.now() + 60000));

		if (process.servercmdcooldown == undefined) {
			process.servercmdcooldown = {};
		}
		process.servercmdcooldown[serverID] = { date: Math.floor(performance.now() + 60000) /* 1 Min cooldown */ };
		setTimeout(() => {
			delete process.servercmdcooldown[serverID];
		}, 60000);
	} catch (err) {
		console.log(err);
	}
}

async function setGlobalCommands(client) {
	await client.application.fetch();
	let clientcommands = await client.application.commands.fetch();
	clientcommands = clientcommands.map((m) => {
		return { name: m.name, desc: m.description, id: m.id };
	});
	if (clientcommands.length > 1 || !(clientcommands[0]?.name == "config")) {
		const command = require(`./../commands/config.js`);
		if (command.execute && command.data) {
			commandlist = [command.data.toJSON()];
		} else {
			console.log(`Ignoring file at ./../commands/${file} because it does not have either a data or an execute export.`);
		}
		const rest = new REST({ version: "10" }).setToken(process.env.DISCORDBOTTOKEN);
		const data = await rest
			.put(Routes.applicationCommands(client.user.id), { body: commandlist })
			.then(() => {
				`Pushed Config command to global.`;
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

// Load all known webhooks into the list
function loadWebhooks(client) {
	Object.keys(process.webhookstoload).forEach(async (w) => {
		try {
			if (process.webhook == undefined) {
				process.webhook = {};
			}
			if (process.webhookstoload[w].human) {
				if (process.webhook[w] == undefined) {
					process.webhook[w] = {};
				}
				process.webhook[w].human = await client.fetchWebhook(process.webhookstoload[w].human);
				process.webhook[w].bot = await client.fetchWebhook(process.webhookstoload[w].bot);
			} else {
				process.webhook[w] = await client.fetchWebhook(process.webhookstoload[w]);
			}
		} catch (err) {
			// Webhook is invalid. Delete it. We'll catch issues later.
			console.log(err);
		}
	});
}

// Recieves an interaction, with desctext and the optionval referencing
// the option name to pass into setOption. We will want to store this
// interaction along with data. Data must supply at least title, page, and desctext props.
function generateTextEntryModal(interaction, data, optionval) {
	if (process.recentinteraction == undefined) {
		process.recentinteraction = {};
	}
	process.recentinteraction[interaction.user.id] = {
		interaction: interaction,
		timestamp: performance.now(), // If the interaction was at least 15 minutes ago (900000 ms), invalidate it.
	};

	const modal = new ModalBuilder().setCustomId(`config_setoptionmodal_${data.page}_${optionval}_${data.pagenum}`).setTitle(`Enter Option...`);

	// Text part to tell the user what it is
	/*let maintextpart = new TextDisplayBuilder()
    let maintext = `${data.desctext}`
    maintext.setContent(maintextpart)*/

	// Text Entry for the choice
	const choicetextentry = new TextInputBuilder()
		.setCustomId("choiceinput")
		.setStyle(TextInputStyle.Short)
		.setPlaceholder(data.placeholder ?? "Enter option value...")
		.setRequired(true);

	const labeltextentry = new LabelBuilder().setLabel(`${data.title}`).setDescription(`${data.desctext}`).setTextInputComponent(choicetextentry);

	// Put it all together
	//modal.addTextDisplayComponents(maintext)

	modal.addLabelComponents(labeltextentry);

	return modal;
}

// Recieves an interaction, with desctext and the optionval referencing
// the option name to pass into setOption. We will want to store this
// interaction along with data. Data must supply at least title, page, and desctext props.
function generateUserEntryModal(interaction, data, optionval) {
	if (process.recentinteraction == undefined) {
		process.recentinteraction = {};
	}
	process.recentinteraction[interaction.user.id] = {
		interaction: interaction,
		timestamp: performance.now(), // If the interaction was at least 15 minutes ago (900000 ms), invalidate it.
	};

	const modal = new ModalBuilder().setCustomId(`config_setoptionmodal_${data.page}_${optionval}_${data.pagenum}`).setTitle(`Enter Option...`);

	// User Entry for the choice
	const choiceuserentry = new UserSelectMenuBuilder()
		.setCustomId("choiceinput")
        .setMaxValues(25)
		.setRequired(true);

	const labeluserentry = new LabelBuilder().setLabel(`${data.title}`).setDescription(`${data.desctext}`).setUserSelectMenuComponent(choiceuserentry)

	// Put it all together
	//modal.addTextDisplayComponents(maintext)

	modal.addLabelComponents(labeluserentry);

	return modal;
}

// Gets all blocked or preferred tags
function getUserTags(userID, preferred = false) {
    if (!userID) { return [] }
    let tags = [];
    let optionstocheck = Object.keys(configoptions.Content).map((t) => t.replace("wearabletags-", ""))
    optionstocheck.forEach((tag) => {
        if (getOption(userID, `wearabletags-${tag}`) == (preferred ? "preferred" : "none")) {
            tags.push(tag)
        }
    })
    return tags;
}

async function getAllJoinedGuilds(client) {
	let allguilds = await client.guilds.fetch();
	let guilds = [];
	let actives = 0;
	for (const guild of allguilds) {
		let guildfetched = await client.guilds.fetch(guild[0]);
		let guildapps = Array.from(await guildfetched.commands.fetch()).map((g) => g[0]);
		guilds.push({ id: guild[0], name: guildfetched.name, commands: guildapps.length });
		if (process.configs.servers != undefined && process.configs.servers[guild[0]]) {
			// Add to number to toast at the end of this function.
			actives++;
		}
	}
	process.joinedguilds = guilds.slice(0);

	console.log(`Joined to ${process.joinedguilds.length} servers; active in ${actives} servers.`);
}

exports.generateConfigModal = generateConfigModal;
exports.generateTextEntryModal = generateTextEntryModal;
exports.generateUserEntryModal = generateUserEntryModal;

exports.removeAllCommands = removeAllCommands;
exports.setCommands = setCommands;
exports.setGlobalCommands = setGlobalCommands;

exports.loadWebhooks = loadWebhooks;

const functions = {};

Object.entries(configoptions).forEach(([_, page]) => {
	Object.entries(page).forEach(([key, option]) => {
		if (option.choices) {
			option.choices.forEach((choice) => {
				functions[`get${choice.uname}`] = (user) => getOption(user, key) == choice.value;
			});
		}
	});
});

exports.config = functions;