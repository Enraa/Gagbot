const { SlashCommandBuilder, MessageFlags } = require("discord.js");

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
    `Very doubtful`
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
