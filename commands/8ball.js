const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { modifymessage } = require("../functions/gagfunctions");

let ballanswers = [
    `It is certain`,
    `It is decidedly so`,
    `Without a doubt`,
    `Yes definitely`,
    `You may rely on it`,
    `As I see it, yes`,
    `Most likely`,
    `Outlook good`,
    `Yes`,
    `Signs point to yes`,
    `Reply hazy, try again`,
    `Ask again later`,
    `Better not tell you now`,
    `Cannot predict now`,
    `Concentrate and ask again`,
    `Don't count on it`,
    `My reply is no`,
    `My sources say no`,
    `Outlook not so good`,
    `Very doubtful`,
    `Perhaps if you wear these handcuffs`,
    `Too many chains, ask later`,
    `Muffled moans point to yes`,
    `It is locked in!`,
    `Only if you behave`,
    `Maybe if you're good`,
    `Wear a gag for me to find out`,
    `Perhaps if I feel like it`,
    `The future is unclear, wear a blindfold`,
    `Bind your arms for good luck`,
    `Almost certainly`,
    `My reply is mmmph~!`,
    `My sources say mmmph~!`,
    `Maybe if you get permission`,
    `No`,
    `Only if I permit it`,
    `Answer is gagged, ask again`,
    `If you squirm while asking again, maybe`,
    `I think not`,
    `Ask again after a timelock`,
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription(`Ask the magic Gagball a question...`)
        .addStringOption((opt) => opt.setName("question").setDescription("What specific question to ask?")),
	async execute(interaction) {
		try {
			// We really dont need consent for posting images lol
            // Validate that the choice we received is on the premade autocompletes list!
			let questiontext = interaction.options.getString("question");
            if (questiontext && questiontext.length > 0) {
                questiontext = await modifymessage({ content: questiontext, guildId: interaction.guildId, author: interaction.user, member: interaction.member, guild: interaction.guild }, undefined, true)
                questiontext = `${interaction.user} asked the question: ${questiontext}\n\n`
            }
            else {
                questiontext = `${interaction.user} asks the magic Gagball for a response:\n\n`
            }
			questiontext = `${questiontext}***${ballanswers[Math.floor(Math.random() * ballanswers.length)]}***`
			await interaction.reply(questiontext);
		} catch (err) {
			console.log(err);
		}
	},
};
