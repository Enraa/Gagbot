const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { handleConsent, timelockChastityModal } = require("./../functions/interactivefunctions.js");

module.exports = {
	data: new SlashCommandBuilder().setName("testdollregex").setDescription(`Testing Doll Regex`),
	async execute(interaction) {
		// Run a single message text. Only send if it passes its regex test.
		console.log("Test 1:  Empty  String");
		try {
			let outtext = "";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Test 2: Line Breaks & Spaces");
		try {
			let outtext = "\n      ";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Test 2: Line Breaks & Spaces");
		try {
			let outtext = "\n      ";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Test 3: Normal Message");
		try {
			let outtext = "Meow!";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Test 4: Emoji Only");
		try {
			let outtext = "❌";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Test 5: Numbers Only");
		try {
			let outtext = "1234";
			if (/[^\u0000-\u0020]/.test(outtext)) {
				await interaction.channel.send(outtext);
			}
		} catch (err) {
			console.log(err);
		}

		console.log("Did NOT crash! All tests passed if no errors logged!");
	},
};
