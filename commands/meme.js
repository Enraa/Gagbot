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
	},
	async execute(interaction) {
		try {
			// We really dont need consent for posting images lol
			let choice = interaction.options.getString("image");

			const imagepath = path.join(__dirname, "..", "memes", `${choice}.png`);
			let imageblob = new AttachmentBuilder(imagepath);
			await interaction.reply({ files: [imageblob] });
		} catch (err) {
			console.log(err);
		}
	},
    /*async help(userid, page) {
        let overviewtext = `## Meme
### Usage: /meme (type)

Posts a meme!`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }*/
};
