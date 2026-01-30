const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { timelockChastityModal, timelockChastityBraModal, timelockCollarModal, timelockBuildConfirm } = require("./../functions/interactivefunctions.js");
const { getChastity, getChastityBra, canAccessChastity, canAccessChastityBra } = require("../functions/vibefunctions.js");
const { getCollar, canAccessCollar } = require("../functions/collarfunctions.js");
const { their } = require("../functions/pronounfunctions.js");
const { getHeavy } = require("../functions/heavyfunctions.js");
const { timelockChastity, timelockChastityBra, timelockCollar } = require("./../functions/timelockfunctions.js");
const { parseTime } = require("./../functions/timefunctions.js");
const { getText } = require("../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("timelock")
		.setDescription(`Lock yourself or your sub with a timer`)
		.addUserOption((opt) => opt.setName("wearer").setDescription("Who's device to unlock?"))
		.addStringOption((opt) => opt.setName("device").setDescription("What device to timelock?").setAutocomplete(true)),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		// Note, we only need to know if we can ***unlock*** a restraint to timelock it.
		let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
		let collarkeyholder = getCollar(chosenuserid) && canAccessCollar(chosenuserid, interaction.user.id, true).access;
		let chastitykeyholder = getChastity(chosenuserid) && canAccessChastity(chosenuserid, interaction.user.id, true).access;
		let chastitybrakeyholder = getChastityBra(chosenuserid) && canAccessChastityBra(chosenuserid, interaction.user.id, true).access;

		let choices = [];
		if (!collarkeyholder && !chastitykeyholder && !chastitybrakeyholder) {
			choices = [{ name: "No Restraints Available", value: "nokeys" }];
		}
		if (collarkeyholder) {
			choices.push({ name: "Collar", value: "collar" });
		}
		if (chastitykeyholder) {
			choices.push({ name: "Chastity Belt", value: "chastitybelt" });
		}
		if (chastitybrakeyholder) {
			choices.push({ name: "Chastity Bra", value: "chastitybra" });
		}

		await interaction.respond(choices);
	},
	async execute(interaction) {
		const actiontotake = interaction.options.getString("device");
		const wearer = interaction.options.getUser("wearer") ?? interaction.user;

		switch (actiontotake) {
			case "chastitybelt":
				let chastity = getChastity(wearer.id);

				if (!chastity) {
					interaction.reply({ content: `${wearer} is not wearing a chastity belt`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (chastity.unlockTime) {
					interaction.reply({ content: `${wearer}'s belt is already timelocked`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (chastity.keyholder != interaction.user.id) {
					interaction.reply({ content: `You do not have the key to ${wearer}'s chastity belt`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (getHeavy(interaction.user.id)) {
					if (wearer == interaction.user) {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${their(wearer.id)} chastity belt, but is completely stuck!`);
						return;
					} else {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${wearer}'s chastity belt, but is completely stuck!`);
						return;
					}
				}

				interaction.showModal(timelockChastityModal(interaction, wearer));
				break;
			case "chastitybra":
				let chastitybra = getChastityBra(wearer.id);

				if (!chastitybra) {
					interaction.reply({ content: `${wearer} is not wearing a chastity bra`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (chastitybra.unlockTime) {
					interaction.reply({ content: `${wearer}'s belt is already timelocked`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (chastitybra.keyholder != interaction.user.id) {
					interaction.reply({ content: `You do not have the key to ${wearer}'s chastity bra`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (getHeavy(interaction.user.id)) {
					if (wearer == interaction.user) {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${their(wearer.id)} chastity bra, but is completely stuck!`);
						return;
					} else {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${wearer}'s chastity bra, but is completely stuck!`);
						return;
					}
				}

				interaction.showModal(timelockChastityBraModal(interaction, wearer));
				break;
			case "collar":
				let collar = getCollar(wearer.id);

				if (!collar) {
					interaction.reply({ content: `${wearer} is not wearing a collar`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (collar.unlockTime) {
					interaction.reply({ content: `${wearer}'s belt is already timelocked`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (collar.keyholder != interaction.user.id) {
					interaction.reply({ content: `You do not have the key to ${wearer}'s collar`, flags: MessageFlags.Ephemeral });
					return;
				}

				if (getHeavy(interaction.user.id)) {
					if (wearer == interaction.user) {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${their(wearer.id)} collar, but is completely stuck!`);
						return;
					} else {
						interaction.reply(`${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${wearer}'s collar, but is completely stuck!`);
						return;
					}
				}

				interaction.showModal(timelockCollarModal(interaction, wearer));
				break;
			default:
				await interaction.reply({ content: "Unsupported restraint. Please try again and select one of the restraint options in the auto-complete.", flags: MessageFlags.Ephemeral });
				return;
		}
	},
	async modalexecute(interaction) {
		//console.log(Array.from(interaction.fields.getSelectedUsers("userselection").keys())[0])
		let keyholder = interaction.user.id;
		const split = interaction.customId.split("_");
		const wearer = split[1];
		let wearerobject = await interaction.client.users.fetch(wearer);
		let tempKeyholder;
		if (wearer == interaction.user.id) {
			// Should only ever be true if they're the same!
			if (interaction.fields.getSelectedUsers("userselection")) {
				keyholder = Array.from(interaction.fields.getSelectedUsers("userselection").keys())[0];
			}
		}
		const timeString = interaction.fields.getTextInputValue("timelockinput");
		const timeStringSplit = timeString.split("-");
		if (timeStringSplit.length > 2) {
			interaction.reply({ content: "A range must be between exactly 2 values", flags: MessageFlags.Ephemeral });
			return;
		}

		let access;
		switch (interaction.fields.getStringSelectValues("accesswhilebound")[0]) {
			case "access_others":
				access = 0;
				break;
			case "access_kh":
				access = 1;
				break;
			case "access_no":
				access = 2;
				break;
			default:
				interaction.reply({ content: "Unknown access option value", flags: MessageFlags.Ephemeral });
				return;
		}

		let keyholderAfter;
		switch (interaction.fields.getStringSelectValues("keyholderafter")[0]) {
			case "keyholder_unlock":
				keyholderAfter = 0;
				break;
			case "keyholder_return":
				keyholderAfter = 1;
				break;
			case "keyholder_keyholder":
				keyholderAfter = 2;
				break;
			default:
				interaction.reply({ content: "Unknown return option value", flags: MessageFlags.Ephemeral });
				return;
		}

		let unlockTime1 = parseTime(timeStringSplit[0]).getTime();
		let unlockTime2;
		if (timeStringSplit.length >= 2) {
			unlockTime2 = parseTime(timeStringSplit[1]).getTime();
		}

		let timelockmodal = timelockBuildConfirm(interaction, wearer, keyholder, split[2], access, keyholderAfter, unlockTime1, unlockTime2);
		if (!timelockmodal.unlockTime) {
			// Invalid time, bye
			await interaction.reply(timelockmodal.modal);
			return;
		}

		let response = await interaction.reply(timelockmodal.modal);
		let confirmation;
		const collectorFilter = (i) => i.user.id === interaction.user.id;
		confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });
		if (confirmation.customId === "confirm") {
			confirmation.update({ content: `Engaging your timelock!`, components: [] });
			let data = { textarray: "texts_timelock", textdata: { interactionuser: interaction.user, targetuser: wearerobject, c1: `<@${keyholder}>` } };
			data.timelockengage = true;
			if (access == 0) {
				data.everyoneaccess = true;
			}
			if (access == 1) {
				data.keyholderaccess = true;
			}
			if (access == 2) {
				data.noaccess = true;
			}
			if (interaction.user.id == wearer) {
				if (keyholder == interaction.user.id) {
					data.self = true;
				} else {
					data.khother = true;
				}
			} else {
				data.other = true;
			}
			data[split[2]] = true;
			if (split[2] == "chastitybelt") {
				timelockChastity(interaction.client, wearer, keyholder, Math.floor(timelockmodal.unlockTime), access, keyholderAfter, interaction.channel.id);
				await interaction.followUp(getText(data));
			} else if (split[2] == "chastitybra") {
				timelockChastityBra(interaction.client, wearer, keyholder, Math.floor(timelockmodal.unlockTime), access, keyholderAfter, interaction.channel.id);
				await interaction.followUp(getText(data));
			} else if (split[2] == "collar") {
				timelockCollar(interaction.client, wearer, keyholder, Math.floor(timelockmodal.unlockTime), access, keyholderAfter, interaction.channel.id);
				await interaction.followUp(getText(data));
			}
		} else if (confirmation.customId === "reject") {
			confirmation.update({ content: `Timelock cancelled!`, components: [] });
		}
	},
    async help(userid, page) {
        let overviewtext = `## Timelock
### Usage: /timelock (wearer) (device)

Opens a window to configure a timelock to apply to your **Chastity Belt**, **Chastity Bra**, or **Collar**. Can be configured to temporarily designate someone else to have keyholder access to your device, as well as temporarily granting public access.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
