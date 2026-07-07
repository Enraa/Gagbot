const { MessageFlags, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");
const { getOption } = require("../getters/config/getOption");
const { convertPronounsText } = require("../other/convertPronounsText");

/******
 * Handles prompting the user to confirm if they want to break their NNN challenge during November.
 * 
 * - (interaction) interaction - The interaction this is for
 * ---
 * Returns a promise which resolves if they click yes, or rejects if they click no.
 ******/
async function holidayNNNLetGoPrompt(interaction) {
	return new Promise(async (res, rej) => {
		let hasOption = getOption(interaction.guildId, interaction.user.id, `holidayevents`);
        let nutted = false; // Check if they have /letgo here, eventually. 

        if (!(hasOption == "participate") || nutted) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral }) // defer reply to ensure no crashes
            res(true); 
            return;
        }

		// We need to ASK
		let prompttext = `You are attempting to let go. Please note that during **No Nut November**, any attempt to **/letgo** will fail the challenge. Are you sure you wish to proceed?`;
		let buttons = [
            new ButtonBuilder()
                .setCustomId("denyButton")
                .setLabel("No")
                .setStyle(ButtonStyle.Danger), 
            new ButtonBuilder()
                .setCustomId("acceptButton")
                .setLabel("Yes")
                .setStyle(ButtonStyle.Success),
        ]
        let data = {
            serverID: interaction.guildId,
            interactionuser: interaction.user,
            targetuser: interaction.user
        }

        try {
            await interaction.reply({ content: `${prompttext}`, components: [new ActionRowBuilder().addComponents(...buttons)], flags: MessageFlags.Ephemeral })
                .then(async (mess) => {
                    // Create a collector for up to 5 minutes
                    const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                    collector.on("collect", async (i) => {
                        if (i.customId == "acceptButton") {
                            await mess.edit({ content: `You have chosen to nut and failed your NNN challenge!`, components: [] })
                            res(true);
                        } else {
                            await mess.edit({ content: convertPronounsText(`You've stayed chaste and avoided nutting. Good USER_PRAISEOBJECT!`, data), components: [] })
                            rej(true);
                        }
                    });

                    collector.on("end", async (collected) => {
                        // timed out
                        if (collected.length == 0) {
                            await mess.edit({ content: convertPronounsText(`You've stayed chaste and avoided nutting. Good USER_PRAISEOBJECT!`, data), components: [] })
                            rej(true);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    rej(true);
                });
        }
        catch (err) {
            console.log(err);
            rej(true)
        }
	});
}

exports.holidayNNNLetGoPrompt = holidayNNNLetGoPrompt;