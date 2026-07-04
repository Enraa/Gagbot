const { SlashCommandBuilder, MessageFlags, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("meme")
		.setDescription(`Post a meme`)
        .addStringOption((opt) => opt.setName("image").setDescription("What to post").setRequired(true).setAutocomplete(true)),
	async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            if (focusedValue == "") {
                // User hasn't entered anything, lets give them a suggested set of 10
                let memes = process.autocompletes.memes.slice(0, 10);
                await interaction.respond(memes);
            } else {
                let memes = process.autocompletes.memes.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10);
                await interaction.respond(memes);
            }
        }
		catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			// We really dont need consent for posting images lol
            // Validate that the choice we received is on the premade autocompletes list!
			let choice;
            if (interaction.options.getString("image")) {
                choice = process.autocompletes.memes.filter((f) => f.value == interaction.options.getString("image"))
            }
            if (!choice || (choice.length == 0) || ((choice.length > 0) && (choice[0].value != interaction.options.getString("image")))) {
                await interaction.reply({ content: `That is not a valid meme choice. Please select one of the options in the list!`, flags: MessageFlags.Ephemeral });
                return;
            }
			const imagepath = path.join(__dirname, "..", "memes", `${choice[0].value}.png`);
			let imageblob = new AttachmentBuilder(imagepath);
			await interaction.reply({ files: [imageblob] });
		} catch (err) {
			console.log(err);
		}
	},
};
