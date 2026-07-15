const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags } = require("discord.js");
const { generateHelpModal } = require("../functions/interactivefunctions.js");
const { getBaseItem } = require("../functions/getters/config/getBaseItem.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");

const PAGE_SIZE = 5;

module.exports = {
	data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help...")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("itemdescription")
                .setDescription("Get a description for an item, if it exists")
                .addStringOption((opt) => 
                    opt
                        .setName("name")
                        .setDescription("The name of the item")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((subcommand) => 
            subcommand
                .setName("commands")
                .setDescription("Review what commands do!")
        ),
    async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let autocompletes = (Object.values(process.autocompletes).flat()).filter((a) => getBaseItem(a.value)?.itemdescription)
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }
            interaction.respond(matches.slice(0,25))
        }
        catch (err) {
            console.log(err);
        }
    },
	async execute(interaction) {
		try {
            let subcommand = interaction.options.getSubcommand();
            if (subcommand == "itemdescription") {
                let chosenoption = interaction.options.getString("name");
                interaction.reply({ content: getBaseItem(chosenoption)?.itemdescription, flags: MessageFlags.Ephemeral })
            }
            else if (subcommand == "commands") {
                interaction.reply(await generateHelpModal(interaction.user.id, "Overview", 0));
            }
		} catch (err) {
			console.log(err);
		}
	},
	async interactionresponse(interaction) {
		try {
			let optionparts = interaction.customId.split("_");
            // We changed page, new page!
            if (optionparts[1] == "SELECTMENU") {
                interaction.update(await generateHelpModal(interaction.user.id, interaction.values[0].split("_")[2], 0));
            }
            else {
                interaction.update(await generateHelpModal(interaction.user.id, optionparts[1], optionparts[2]))
            }
		} catch (err) {
			console.log(err);
		}
	},
};
