const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { modifymessage } = require("../functions/gagfunctions");
const { getGag8Ball } = require("../lists/8ballresponses");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription(`Ask the magic Gagball a question...`)
        .addStringOption((opt) => opt.setName("question").setDescription("What specific question to ask?")),
	async execute(interaction) {
		try {
			// We really dont need consent for 8ball responses lol
            let data = {
                serverID: interaction.guildId,
                interactionuser: interaction.user,
                targetuser: interaction.user,
            }
			let questiontext = interaction.options.getString("question");
            if (questiontext && questiontext.length > 0) {
                questiontext = await modifymessage({ content: questiontext, guildId: interaction.guildId, author: interaction.user, member: interaction.member, guild: interaction.guild }, undefined, true)
                questiontext = `${interaction.user} asked the question: ${questiontext}\n\n`
            }
            else {
                questiontext = `${interaction.user} asks the magic Gagball for a response:\n\n`
            }
            data.c1 = questiontext;
			await interaction.reply(`${questiontext}***${getGag8Ball(data)}***`);
		} catch (err) {
			console.log(err);
		}
	},
};
