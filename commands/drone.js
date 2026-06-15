const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { dronecodes } = require("../functions/dollfunctions");
const { default: didYouMean, ReturnTypeEnums, ThresholdTypeEnums } = require("didyoumean2");
const { handleConsent } = require("../functions/interactivefunctions");
const { messageSend } = require("../functions/messagefunctions");
const { getConsent } = require("../functions/getters/config/getConsent");
const { getOption } = require("../functions/getters/config/getOption");
const { getAlternateName } = require("../functions/getters/config/getAlternateName");
const { getPFP } = require("../functions/getters/config/getPFP");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("drone")
		.setDescription("Drone Commands")
        .addSubcommand((subcommand) => 
            subcommand
                .setName("code")
                .setDescription("Use a status code...")
                .addStringOption((opt) => opt.setName("choice").setDescription("Which status code to emit?").setAutocomplete(true).setRequired(true))
                .addStringOption((opt) => opt.setName("additionaltext").setDescription("What text to add to end of status code?")),
        )
        /*.addSubcommand((subcommand) => 
            subcommand
                .setName("speechprotocol")
                .setDescription("Enforce speech optimizations")
                .addStringOption((opt) => opt.setName("enable").setDescription("Enable Speech Optimizations").setRequired(true).addChoices(
                    { name: 'Enable 🟢', value: 'true' },
                    { name: 'Disable 🔴', value: 'false' }
                ))
        )*/,
    async autoComplete(interaction) {
        try {
            // Remove anything we're already wearing from the list
            const focusedValue = interaction.options.getFocused();
            let codetexts = Object.keys(dronecodes).map((k) => {
                return { name: `Code ${dronecodes[k].code} :: ${dronecodes[k].message}`, value: k };
            })
            let matches;
            let statusestofilterby = ["beep", "signal", "statement", "commentary", "query", "answer", "status", "response", "mantra", "error"]
            if (statusestofilterby.includes(focusedValue.toLowerCase())) {
                // They are searching by a specific status statement. Present only those
                matches = codetexts.filter((f) => f.name.includes(focusedValue.slice(1).toLowerCase()))
            }
            else if (Object.keys(dronecodes).includes(focusedValue)) {
                matches = codetexts.filter((f) => f.value == focusedValue)
            }
            else {
                matches = didYouMean(focusedValue, codetexts, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.1, // Default is 0.4 - this is how much of the word must exist. 
                })
            }
            if (matches.length == 0) {
                matches = codetexts.slice(0,25);
            }
            interaction.respond(matches.slice(0,25))
        }
        catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			// Build data tree:
			let data = {
                interactionuser: { id: interaction.user.id },
                targetuser: { id: interaction.user.id },
            }

            let chosencode = interaction.options.getString("choice");
            let additional = interaction.options.getString("additionaltext");
            if (additional == null) { additional = ``};

            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            let dronetext = `${getOption(interaction.user.id, "dronevisorname")} :: Code ${dronecodes[chosencode].code} :: ${dronecodes[chosencode].message}`
            if (additional.length > 0) {
                if (dronetext.endsWith(".")) {
                    dronetext = `${dronetext} ${additional}`
                }
                else {
                    dronetext = `${dronetext}, ${additional}`
                }
            }
            messageSend({ channel: interaction.channel }, ("`" + dronetext + "`"), await getPFP(interaction.member), await getAlternateName(interaction.member), interaction.channel.parentId ? undefined : interaction.channel.id, true)
            await interaction.editReply({ content: `Status code ${chosencode} sent!`})
		} catch (err) {
			console.log(err);
		}
	},
};
