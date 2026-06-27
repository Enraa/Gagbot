const { SlashCommandBuilder, MessageFlags, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { getOption } = require("../functions/getters/config/getOption");
const { handleTouchEvent } = require("../functions/touchfunctions.js");
const { messageSendChannel } = require("../functions/messagefunctions");
const { tryOrgasm } = require("../functions/vibefunctions");
const { isWearingCollar } = require("../functions/getters/collar/isWearingCollar");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("control")
		.setDescription(`Perform unique controller actions`)
        .addSubcommand((subcommand) => 
            subcommand
                .setName("letgo")
                .setDescription("Force someone to /letgo")
                .addUserOption((opt) => 
                    opt.setName("user").setDescription("Who to trigger an orgasm on?")
                )
        ),
	/*async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            if (focusedValue == "") {
                // User hasn't entered anything, lets give them a suggested set of 10
                let memes = process.memes.slice(0, 10);
                await interaction.respond(memes);
            } else {
                let memes = process.memes.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);
                await interaction.respond(memes);
            }
        }
		catch (err) {
            console.log(err);
        }
	},*/
	async execute(interaction) {
		try {
			let subcommand = interaction.options.getSubcommand();

            if (subcommand == "letgo") {
                let targetuser = interaction.options.getUser("user") ?? interaction.user;
                if (targetuser.id == interaction.user.id) {
                    interaction.reply({ content: "You can't trigger an orgasm on yourself!", flags: MessageFlags.Ephemeral });
                    return;
                }
                if (!isWearingCollar(interaction.guildId, targetuser.id, "collar_orgasmcontrol")) {
                    interaction.reply({ content: `${targetuser} is not wearing an Orgasm Control Module!`, flags: MessageFlags.Ephemeral });
                    return;
                }
                await handleTouchEvent(interaction.guildId, interaction.user, targetuser, "orgasmcontrol", true).then(
                    async (success) => {
                        interaction.deferUpdate();
                        messageSendChannel(`${interaction.user} pushes a button on a remote...`, interaction.channelId)
                        await new Promise((res) => setTimeout(res, 1000)) // Wait 3 seconds before proceeding!
                        let orgasmresult = tryOrgasm(interaction.guildId, targetuser.id, true);
                        let data = {
                            textarray: "texts_letgo",
                            textdata: {
                                serverID: interaction.guildId, 
                                interactionuser: targetuser,
                                targetuser: targetuser, // Not needed, but required for function parsing anyway.
                                c1: getHeavy(interaction.guildId, targetuser.id)?.displayname, // heavy bondage type
                            },
                        };
                        if (orgasmresult) {
                            // User was able to orgasm!
				            data.orgasm = true;
				            interaction.reply(getText(data));
                            console.log("SUCCESSFULLY ORGASMS")
                        }
                        else {
                            if (getChastity(interaction.guildId, targetuser.id)) {
                                data.chastity = true;
                                interaction.reply(getText(data));
                                return;
                            }

                            const heavy = !getHeavyBound(interaction.guildId, targetuser.id, targetuser.id);
                            if (heavy) {
                                data.heavy = true;
                                interaction.reply(getText(data));
                                return;
                            }

                            // cool off response, replace with something good
                            data.free = true;
                            interaction.reply(getText(data));
                            setArousalCooldown(interaction.guildId, targetuser.id);
                            console.log("FREEBIE CLICK")
                        }
                    },
                    async (failure) => {
                        interaction.reply({ content: `You don't have access to trigger an orgasm on ${targetuser}!`, flags: MessageFlags.Ephemeral });
                    }
                )
            }
		} catch (err) {
			console.log(err);
		}
	},
};
