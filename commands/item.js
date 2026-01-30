const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags, TextDisplayBuilder } = require("discord.js");
const { generateConfigModal, configoptions, getOption, setOption } = require("./../functions/configfunctions.js");
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require("./../functions/headwearfunctions.js");
const { getWearable, getLockedWearable, addLockedWearable, getWearableName, removeLockedWearable } = require("../functions/wearablefunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("item")
		.setDescription(`Prevent a worn item from being removed...`)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("protect")
				.setDescription("Protect an item...")
				.addStringOption((opt) => opt.setName("wornitem").setDescription("Which worn item to protect?").setAutocomplete(true).setRequired(true)),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("unprotect")
				.setDescription("Unprotect an item...")
				.addStringOption((opt) => opt.setName("wornitem").setDescription("Which locked item to unprotect?").setAutocomplete(true).setRequired(true)),
		),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		let subcommand = interaction.options.getSubcommand();
		try {
			if (subcommand == "protect") {
				// Headwear
				let itemswornhead = getHeadwear(interaction.user.id);
				let itemslockedhead = getLockedHeadgear(interaction.user.id);

				let sorted = itemswornhead.filter((f) => !itemslockedhead.includes(f));

				// Clothing
				let itemswornwearable = getWearable(interaction.user.id);
				let itemslockedwearable = getLockedWearable(interaction.user.id);

				let sortedwearable = itemswornwearable.filter((f) => !itemslockedwearable.includes(f));

				sorted = sorted.map((f) => {
					return { name: getHeadwearName(undefined, f), value: `${f}+head` };
				});
				sortedwearable = sortedwearable.map((f) => {
					return { name: getWearableName(undefined, f), value: `${f}+wearable` };
				});

				// Merge the lists.
				sorted = sorted.concat(...sortedwearable);

				if (sorted.length == 0) {
					sorted = [{ name: "Nothing", value: "nothing" }];
				}

				console.log(sorted);

				if (focusedValue.length == 0) {
					await interaction.respond(sorted.slice(0, 10));
				} else {
					await interaction.respond(sorted.filter((f) => f.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 10));
				}
			} else {
				let itemslockedhead = getLockedHeadgear(interaction.user.id);
				let itemslockedwearable = getLockedWearable(interaction.user.id);

				let sorted = itemslockedhead.map((f) => {
					return { name: getHeadwearName(undefined, f), value: `${f}+head` };
				});
				let sortedwearable = itemslockedwearable.map((f) => {
					return { name: getWearableName(undefined, f), value: `${f}+wearable` };
				});

				// Merge the lists.
				sorted = sorted.concat(...sortedwearable);

				if (sorted.length == 0) {
					sorted = [{ name: "Nothing", value: "nothing" }];
				}
				await interaction.respond(sorted);
			}
		} catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {
			let subcommand = interaction.options.getSubcommand();
			let chosenitem = interaction.options.getString("wornitem");

			if (subcommand == "protect") {
				if (chosenitem && chosenitem != "nothing") {
					let chosenitemparts = chosenitem.split("+");
					let replytextname;
					if (chosenitemparts[1] == "head") {
						if (getHeadwearName(undefined, chosenitemparts[0])) {
							addLockedHeadgear(interaction.user.id, chosenitemparts[0]);
							replytextname = getHeadwearName(undefined, chosenitemparts[0]);
						} else {
							interaction.reply({ content: `Item ${replytextname} is an invalid item! Try again.`, flags: MessageFlags.Ephemeral });
							return;
						}
					} else {
						if (getWearableName(undefined, chosenitemparts[0])) {
							addLockedWearable(interaction.user.id, chosenitemparts[0]);
							replytextname = getWearableName(undefined, chosenitemparts[0]);
						} else {
							interaction.reply({ content: `Item ${replytextname} is an invalid item! Try again.`, flags: MessageFlags.Ephemeral });
							return;
						}
					}
					interaction.reply({ content: `Item ${replytextname} successfully protected!`, flags: MessageFlags.Ephemeral });
				} else if (chosenitem == "nothing") {
					interaction.reply({ content: `You chose nothing to protect.`, flags: MessageFlags.Ephemeral });
				} else {
					interaction.reply({ content: `Something went wrong choosing an item.`, flags: MessageFlags.Ephemeral });
				}
			} else {
				if (chosenitem && chosenitem != "nothing") {
					let chosenitemparts = chosenitem.split("+");
					let replytextname;
					if (chosenitemparts[1] == "head") {
						removeLockedHeadgear(interaction.user.id, chosenitemparts[0]);
						replytextname = getHeadwearName(undefined, chosenitemparts[0]);
					} else {
						removeLockedWearable(interaction.user.id, chosenitemparts[0]);
						replytextname = getWearableName(undefined, chosenitemparts[0]);
					}
					interaction.reply({ content: `Item ${replytextname} removed from protection!`, flags: MessageFlags.Ephemeral });
				} else if (chosenitem == "nothing") {
					interaction.reply({ content: `You chose nothing to unprotect.`, flags: MessageFlags.Ephemeral });
				} else {
					interaction.reply({ content: `Something went wrong choosing an item.`, flags: MessageFlags.Ephemeral });
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
    async help(userid, page) {
        //let restrictedtext = (getHeavy(userid)) ? `***You are in heavy bondage***\n` : ""
        let overviewtext = `## Item
### Usage: /item protect (type)
### Remove:  /item unprotect (type)

Binds an item to you, which will prevent it's removal via the **/unwear** command from you or anyone, as well as preventing removal by certain **Restraint** effects.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
};
