const { ActionRowBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { TextDisplayBuilder, MessageFlags, ButtonStyle, ActionRow, SectionBuilder, LabelBuilder, TextInputStyle } = require("discord.js");
const { ModalBuilder } = require("@discordjs/builders");
const { TextInputBuilder } = require("@discordjs/builders");
const { UserSelectMenuBuilder } = require("@discordjs/builders");
const { statsGeneratePage } = require("./statsfunctions");
const { getOutfits } = require("./getters/config/getOutfits");
const { getHeavy } = require("./getters/heavy/getHeavy");
const { getMitten } = require("./getters/mitten/getMitten");
const { canAccessCollar } = require("./getters/collar/canAccessCollar");
const { canAccessChastity } = require("./getters/chastity/canAccessChastity");
const { canAccessChastityBra } = require("./getters/chastity/canAccessChastityBra");
const { getGags } = require("./getters/gag/getGags");
const { convertGagText } = require("./getters/gag/getGagName");
const { getGag } = require("./getters/gag/getGag");
const { getHeadwear } = require("./getters/headwear/getHeadwear");
const { getHeadwearName } = require("./getters/headwear/getHeadwearName");
const { getMittenName } = require("./getters/mitten/getMittenName");
const { getWearable } = require("./getters/wearable/getWearable");
const { getWearableName } = require("./getters/wearable/getWearableName");
const { getChastity } = require("./getters/chastity/getChastity");
const { getChastityTimelock } = require("./getters/chastity/getChastityTimelock");
const { getChastityTempTimelock } = require("./getters/chastity/getChastityTempTimelock");
const { getChastityName } = require("./getters/chastity/getChastityName");
const { getChastityBra } = require("./getters/chastity/getChastityBra");
const { getChastityBraTimelock } = require("./getters/chastity/getChastityBraTimelock");
const { getChastityBraTempTimelock } = require("./getters/chastity/getChastityBraTempTimelock");
const { getChastityBraName } = require("./getters/chastity/getChastityBraName");
const { getCorset } = require("./getters/corset/getCorset");
const { getCollar } = require("./getters/collar/getCollar");
const { getCollarTimelock } = require("./getters/collar/getCollarTimelock");
const { getCollarTempTimelock } = require("./getters/collar/getCollarTempTimelock");
const { getCollarName } = require("./getters/collar/getCollarName");
const { getOption } = require("./getters/config/getOption");
const { getPronounsSet } = require("./getters/config/getPronounsSet");
const { getHeadwearRestrictions } = require("./getters/headwear/getHeadwearRestrictions");
const { getLockedHeadgear } = require("./getters/headwear/getLockedHeadgear");
const { getToys } = require("./getters/toy/getToys");
const { getBaseCorset } = require("./getters/corset/getBaseCorset");
const { getBaseToy } = require("./getters/toy/getBaseToy");
const { getHeavyList } = require("./getters/heavy/getHeavyList");
const { getHeavyRestrictions } = require("./getters/heavy/getHeavyRestrictions");
const { getCollarPerm } = require("./getters/collar/getCollarPerm");
const { getLockedWearable } = require("./getters/wearable/getLockedWearable");
const { getDisplayTexts } = require("./getters/config/getDisplayTexts");
const { getBaseWearable } = require("./getters/wearable/getBaseWearable");
const { getChastityKeys } = require("./getters/chastity/getChastityKeys");
const { getChastityBraKeys } = require("./getters/chastity/getChastityBraKeys");
const { getCollarKeys } = require("./getters/collar/getCollarKeys");
const { getClonedChastityKeysOwned } = require("./getters/chastity/getClonedChastityKeysOwned");
const { getClonedChastityBraKeysOwned } = require("./getters/chastity/getClonedChastityBraKeysOwned");
const { getClonedCollarKeysOwned } = require("./getters/collar/getClonedCollarKeysOwned");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam");

async function generateOutfitModal(serverID, userID, menu, page, options) {
    traceFirstParam(arguments[0]);
	let pagecomponents = [new TextDisplayBuilder().setContent(`## Outfitter - ${menu.slice(0, 1).toUpperCase()}${menu.slice(1)}`)];
	let tabbuttons = [
		// Restore
		new ButtonBuilder()
			.setCustomId(`outfitter_restore_1_0_0000000000`)
			.setLabel("Restore")
			.setStyle(menu == "restore" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "restore" ? true : false),
		// Save
		new ButtonBuilder()
			.setCustomId(`outfitter_save_1_0_0000000000`)
			.setLabel("Save")
			.setStyle(menu == "save" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "save" ? true : false),
		// Rename
		new ButtonBuilder()
			.setCustomId(`outfitter_rename_1_0_0000000000`)
			.setLabel("Rename")
			.setStyle(menu == "rename" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "rename" ? true : false),
	];
	pagecomponents.push(new ActionRowBuilder().addComponents(...tabbuttons));

	// Main section:
	if (menu == "restore") {
		let outfits = getOutfits(serverID, userID);
		for (let i = (parseInt(page) - 1) * 5; i < page * 5; i++) {
			let textdisplay = `### Outfit ${i + 1}`;
			let outfitindividual = outfits[i];
			if (outfitindividual) {
				textdisplay = `${textdisplay}${outfitindividual.outfitname ? `: ${outfitindividual.outfitname}` : ``}\n-# `;
				Object.keys(outfitindividual).forEach((k) => {
					// I could use a switch statement here but I feel like using if conditionals.
					if (k == "wearable") {
						let emoji = getHeavy(serverID, userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}👗 Clothing: ${emoji}, `;
					}
					if (k == "gag") {
						let emoji = getHeavy(serverID, userID) || getMitten(serverID, userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.gag} Gag: ${emoji}, `;
					}
					if (k == "mitten") {
						let emoji = getHeavy(serverID, userID) || getMitten(serverID, userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.mitten} Mitten: ${emoji}, `;
					}
					if (k == "headwear") {
						let emoji = getHeavy(serverID, userID) || getMitten(serverID, userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.gasmask} Headwear: ${emoji}, `;
					}
					if (k == "collar") {
						let emoji = getHeavy(serverID, userID) || (!canAccessCollar(serverID, userID, userID, true).access && canAccessCollar(serverID, userID, userID, true).hascollar) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.collar} Collar: ${emoji}, `;
					}
					if (k == "heavy") {
						let emoji = getHeavy(serverID, userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.armbinder} Heavy: ${emoji}, `;
					}
					if (k == "corset") {
						let emoji = getHeavy(serverID, userID) || (!canAccessChastity(serverID, userID, userID, true).access && canAccessChastity(serverID, userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.corset} Corset: ${emoji}, `;
					}
					if (k == "chastity") {
						let emoji = getHeavy(serverID, userID) || (!canAccessChastity(serverID, userID, userID, true).access && canAccessChastity(serverID, userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.chastity} Chastity: ${emoji}, `;
					}
					if (k == "chastitybra") {
						let emoji = getHeavy(serverID, userID) || (!canAccessChastityBra(serverID, userID, userID, true).access && canAccessChastityBra(serverID, userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.chastitybra} Chastity Bra: ${emoji}, `;
					}
					/*if (k == "vibe") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.wand} Toys: ${emoji}, `;
					}*/
				});
			} else {
				textdisplay = `${textdisplay}\n-# No Outfit Saved--`;
			}
			let buttonsection = new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(textdisplay.slice(0, -2)))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_restoreoutfit_${page}_${i}_0000000000`)
						.setLabel(`Equip Outfit ${i + 1}`)
						.setStyle(ButtonStyle.Secondary)
						// Always block if every single element can't be equipped. This should also stop trying to equip null outfits too
						.setDisabled(!textdisplay.includes("✅")),
				);
			pagecomponents.push(buttonsection);
		}
		let pagenavbuttons = [];
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_restore_${parseInt(page) - 1}_0`)
				.setLabel("← Prev Page")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page <= 1),
		);
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_restore_${parseInt(page) + 1}_0`)
				.setLabel("Next Page →")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page >= 4),
		);
		pagecomponents.push(new ActionRowBuilder().addComponents(...pagenavbuttons));
	}
	if (menu == "rename") {
		let outfits = getOutfits(serverID, userID);
		for (let i = (parseInt(page) - 1) * 5; i < page * 5; i++) {
			let textdisplay = `### Outfit ${i + 1}`;
			let outfitindividual = outfits[i];
			if (outfitindividual) {
				textdisplay = `${textdisplay}${outfitindividual.outfitname ? `: ${outfitindividual.outfitname}` : ``}`;
			} else {
				textdisplay = `${textdisplay}\n-# No Outfit Saved`;
			}
			let buttonsection = new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(textdisplay))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_renameoutfit_${page}_${i}_0000000000`)
						.setLabel(`Rename Outfit ${i + 1}`)
						.setStyle(ButtonStyle.Secondary)
						// Always block if every single element can't be equipped. This should also stop trying to equip null outfits too
						.setDisabled(!outfitindividual),
				);
			pagecomponents.push(buttonsection);
		}
		let pagenavbuttons = [];
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_rename_${parseInt(page) - 1}_0`)
				.setLabel("← Prev Page")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page <= 1),
		);
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_rename_${parseInt(page) + 1}_0`)
				.setLabel("Next Page →")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page >= 4),
		);
		pagecomponents.push(new ActionRowBuilder().addComponents(...pagenavbuttons));
	} else if (menu == "save") {
		// Options value will be a default of 0000000000, in order shown in inspect.
		// Frankly I *hate* this method, but we can only carry this via bitwise shenanigans anyway.
		let optionsbit = options ?? "0000000000";
		//pagecomponents.push(new TextDisplayBuilder().setContent(`# Saving to ⟶ Outfit ${page}`))
		let bitselector = 0;

		// Gag section
		let texts = `### Gags:\n`;
		if (!getGag(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getGags(serverID, userID)
				.map((g) => convertGagText(g.gagtype))
				.join(", ")}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getGag(serverID, userID)),
				),
		);
		bitselector++;

		// Headwear section
		texts = `### Headwear:\n`;
		if (!(getHeadwear(serverID, userID).length > 0)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getHeadwear(serverID, userID)
				.map((g) => getHeadwearName(serverID, undefined, g))
				.join(", ")}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!(getHeadwear(serverID, userID).length > 0)),
				),
		);
		bitselector++;

		// Mittens section
		texts = `### Mitten:\n`;
		if (!getMitten(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getMittenName(serverID, userID) ?? "Worn"}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getMitten(serverID, userID)),
				),
		);
		bitselector++;

		// Wearable section
		texts = `### Apparel:\n`;
		if (!(getWearable(serverID, userID).length > 0)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getWearable(serverID, userID)
				.map((w) => getWearableName(undefined, w))
				.join(", ")}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!(getWearable(serverID, userID).length > 0)),
				),
		);
		bitselector++;

		// Vibrator section
		/*texts = `### Toys:\n`;
		if (!getToys(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getToys(userID)
				.map((v) => getBaseToy(v.type).toyname)
				.join(", ")}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getToys(userID)),
				),
		);*/
		bitselector++;

		// Chastity Belt section
		texts = `### Chastity Belt:\n`;
		if (!getChastity(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
            let keyholdertext = ``;
            keyholdertext = `<@${getChastity(serverID, userID).keyholder}>`
            if (getChastityTimelock(serverID, userID)) { keyholdertext = `Timelocked` }
			if (getChastity(serverID, userID).keyholder == userID) { keyholdertext = `Self-bound` }
            if (getChastity(serverID, userID)?.fumbled) { keyholdertext = `Keys are missing!` }
			texts = `${texts}${getChastityName(serverID, userID) ?? "Standard Chastity Belt"}\n`;
			texts = `${texts}Primary Keyholder: ${keyholdertext}`;
			texts = `${texts}${
				getChastity(serverID, userID).clonedKeyholders
					? `, clones held by ${getChastity(serverID, userID)
							.clonedKeyholders.map((k) => `<@${k}>`)
							.join(", ")}`
					: ``
			}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getChastity(serverID, userID)),
				),
		);
		bitselector++;

		// Chastity Bra section
		texts = `### Chastity Bra:\n`;
		if (!getChastityBra(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
            let keyholdertext = ``;
            keyholdertext = `<@${getChastityBra(serverID, userID).keyholder}>`
            if (getChastityBraTimelock(serverID, userID)) { keyholdertext = `Timelocked` }
			if (getChastityBra(serverID, userID).keyholder == userID) { keyholdertext = `Self-bound` }
            if (getChastityBra(serverID, userID)?.fumbled) { keyholdertext = `Keys are missing!` }
			texts = `${texts}${getChastityBraName(serverID, userID) ?? "Standard Chastity Bra"}\n`;
			texts = `${texts}Primary Keyholder: ${keyholdertext}`;
			texts = `${texts}${
				getChastityBra(serverID, userID).clonedKeyholders
					? `, clones held by ${getChastityBra(serverID, userID)
							.clonedKeyholders.map((k) => `<@${k}>`)
							.join(", ")}`
					: ``
			}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getChastityBra(serverID, userID)),
				),
		);
		bitselector++;

		// Corset section
		texts = `### Corset:\n`;
		if (!getCorset(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getBaseCorset(getCorset(serverID, userID).type).name} laced to Length ${getCorset(serverID, userID).tightness}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getCorset(serverID, userID)),
				),
		);
		bitselector++;

		// Heavy Bondage section
		texts = `### Heavy Bondage:\n`;
		if (!getHeavy(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getHeavy(serverID, userID).type}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getHeavy(serverID, userID)),
				),
		);
		bitselector++;

		// Collar section
		texts = `### Collar:\n`;
		if (!getCollar(serverID, userID)) {
			texts = `${texts}Not worn`;
		} else {
            let keyholdertext = ``;
            keyholdertext = `<@${getCollar(serverID, userID).keyholder}>`
            if (getCollarTimelock(serverID, userID)) { keyholdertext = `Timelocked` }
			if (getCollar(serverID, userID).keyholder == userID) { keyholdertext = `Self-bound` }
            if (getCollar(serverID, userID)?.fumbled) { keyholdertext = `Keys are missing!` }
            texts = `${texts}${getCollarName(serverID, userID)}\n`;
			texts = `${texts}Primary Keyholder: ${keyholdertext}`;
			texts = `${texts}${
				getCollar(serverID, userID).clonedKeyholders
					? `, clones held by ${getCollar(serverID, userID)
							.clonedKeyholders.map((k) => `<@${k}>`)
							.join(", ")}`
					: ``
			}`;
		}
		pagecomponents.push(
			new SectionBuilder()
				.addTextDisplayComponents((td) => td.setContent(texts))
				.setButtonAccessory((button) =>
					button
						.setCustomId(`outfitter_outfitopt_${page}_${bitselector}_${optionsbit}`)
						.setLabel(options.slice(bitselector, bitselector + 1) == "1" ? `Save` : `Disabled`)
						.setStyle(options.slice(bitselector, bitselector + 1) == "1" ? ButtonStyle.Success : ButtonStyle.Danger)
						// Block if element doesn't exist
						.setDisabled(!getCollar(serverID, userID)),
				),
		);
		bitselector++;

		let buttonsave = new ButtonBuilder()
			.setCustomId(`outfitter_saveoutfit_${page}_0_${options}`)
			.setLabel(getOutfits(serverID, userID)[parseInt(page) - 1] ? `⚠️ Overwrite Outfit ${page}` : `Save Outfit ${page}`)
			.setStyle(ButtonStyle.Primary)
			.setDisabled(!options.includes("1"));
		pagecomponents.push(new ActionRowBuilder().addComponents(buttonsave));

		let pagenavbuttons = [];
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_save_${parseInt(page) - 1}_0`)
				.setLabel("← Prev Page")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page <= 1),
		);
		pagenavbuttons.push(
			new ButtonBuilder()
				.setCustomId(`outfitter_save_${parseInt(page) + 1}_0`)
				.setLabel("Next Page →")
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(page >= 20),
		);
		pagecomponents.push(new ActionRowBuilder().addComponents(...pagenavbuttons));
	}

	return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] };
}

function outfitEntryModal(interaction, slot) {
	if (process.recentinteraction == undefined) {
		process.recentinteraction = {};
	}
	process.recentinteraction[interaction.user.id] = {
		interaction: interaction,
		timestamp: performance.now(), // If the interaction was at least 15 minutes ago (900000 ms), invalidate it.
	};

	const modal = new ModalBuilder().setCustomId(`outfit_outfitentry_${slot}`).setTitle(`Enter a name for Outfit ${slot}`);

	// Text part to tell the user what it is
	/*let maintextpart = new TextDisplayBuilder()
    let maintext = `${data.desctext}`
    maintext.setContent(maintextpart)*/

	// Text Entry for the choice
	const choicetextentry = new TextInputBuilder().setCustomId("choiceinput").setStyle(TextInputStyle.Short).setPlaceholder("Enter outfit name...").setRequired(true);

	const labeltextentry = new LabelBuilder().setLabel(`Rename Outfit`).setDescription(`Enter a descriptive name for your outfit`).setTextInputComponent(choicetextentry);

	// Put it all together
	//modal.addTextDisplayComponents(maintext)

	modal.addLabelComponents(labeltextentry);

	return modal;
}

async function inspectModal(serverID, userID, inspectuserIDin, menu, page) {
    traceFirstParam(arguments[0]);
    let inspectuserID = inspectuserIDin ?? userID;
    let profilelink = (getOption(serverID, inspectuserID, "profilelink") && getOption(serverID, inspectuserID, "profilelink").length > 0) ? ` • [Profile](${getOption(serverID, inspectuserID, "profilelink")})` : ``
    let kinklistlink = (getOption(serverID, inspectuserID, "kinklistlink") && getOption(serverID, inspectuserID, "kinklistlink").length > 0) ? ` • [Kink List](${getOption(serverID, inspectuserID, "kinklistlink")})` : ``
    let preferredtitles = (getOption(serverID, inspectuserID, "preferredtitle") && getOption(serverID, inspectuserID, "preferredtitle").length > 0) ? `${getOption(serverID, inspectuserID, "preferredtitle")} ` : ``
    let userselector = new UserSelectMenuBuilder()
        .setCustomId(`inspect_overview_newuser_1`)
        .setMaxValues(1)
        .setDefaultUsers(inspectuserID)
        .setPlaceholder("Select a user to display...")
    let pagecomponents = [new ActionRowBuilder().addComponents(userselector), new TextDisplayBuilder().setContent(`## Inspecting - ${preferredtitles}<@${inspectuserID}>\n-# (${getPronounsSet(serverID, inspectuserID)})${profilelink}${kinklistlink}`)];
	let tabbuttons = [
		// Overview
		new ButtonBuilder()
			.setCustomId(`inspect_overview_${inspectuserID}_1`)
			.setLabel("Overview")
            .setEmoji({ name: "📋" })
			.setStyle(menu == "overview" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "overview" ? true : false),
		// Restraints
		new ButtonBuilder()
			.setCustomId(`inspect_restraints_${inspectuserID}_1`)
			.setLabel("Restraints")
            .setEmoji({ name: "armbinder", id: process.emojis["armbinder"].match(/(?:<:[\w:\d]+:)(\d+)(?:>)/)[1] })
			.setStyle(menu == "restraints" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "restraints" ? true : false),
		// Wearables
		new ButtonBuilder()
			.setCustomId(`inspect_wearable_${inspectuserID}_1`)
			.setLabel("Apparel")
            .setEmoji({ name: "👗" })
			.setStyle(menu == "wearable" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "wearable" ? true : false),
        // Keys
		new ButtonBuilder()
			.setCustomId(`inspect_keys_${inspectuserID}_1`)
			.setLabel("Keys")
            .setEmoji({ name: "🔑" })
			.setStyle(menu == "keys" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "keys" ? true : false),
        // Keys
		new ButtonBuilder()
			.setCustomId(`inspect_stats_${inspectuserID}_1`)
			.setLabel("Stats")
            .setEmoji({ name: "📊" })
			.setStyle(menu == "stats" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "stats" ? true : false),
	];
	pagecomponents.push(new ActionRowBuilder().addComponents(...tabbuttons));

    // Now do stuff per page
    if (menu == "overview") {
        let headwearrestrictions = getHeadwearRestrictions(serverID, userID);
        let wearingtext = `## Worn Restraints:`;
        // Gags
        if (getGag(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.gag} Gags: **${getGags(serverID, inspectuserID).map((g) => { return `${convertGagText(g.gagtype)} (${g.intensity})`}).join(", ")}**`
        }
        // Headwear
        if (getHeadwear(serverID, inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n${process.emojis.gasmask} Masks: **${getHeadwear(serverID, inspectuserID).map((h) => (!getLockedHeadgear(serverID, inspectuserID).includes(h) ? getHeadwearName(serverID, undefined, h) : `*${getHeadwearName(serverID, undefined, h)}*`)).join(", ")}**`
            let lockedheadgears = [];
            if (process.headwear[serverID][inspectuserID]) { lockedheadgears = Object.keys(process.headwear[serverID][inspectuserID]) }
            lockedheadgears.forEach((lh) => {
                if (process.headwear[serverID][inspectuserID][lh] && process.headwear[serverID][inspectuserID][lh]?.lockable && process.headwear[serverID][inspectuserID][lh]?.origbinder) {
                    wearingtext = `${wearingtext}\n-# ‎   - **${process.headtypes[lh].name}** key held by <@${process.headwear[serverID][inspectuserID][lh].origbinder}>`
                }
            })
        }
        // Mittens
        if (getMitten(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.mitten} Mittens: **${getMittenName(serverID, inspectuserID) ?? "Standard Mittens"}**`
        }
        // Corset
        if (getCorset(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.corset} Corset: **${getBaseCorset(getCorset(serverID, inspectuserID).type).name} laced with strings at length ${getCorset(serverID, inspectuserID).tightness}**`
        }
        // Vibe
        if (getToys(serverID, inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n${process.emojis.wand} Toys: **${getToys(serverID, inspectuserID).map((vibe) => `${getBaseToy(vibe.type).toyname} (${vibe.intensity})`).join(", ")}**`
        }
        // Heavy Bondage
        if (getHeavy(serverID, inspectuserID, undefined, true)) {
            wearingtext = `${wearingtext}\n${process.emojis.armbinder} Heavy Bondage: **${getHeavyList(serverID, inspectuserID).map((heavy) => heavy.displayname).join(", ")}**`
            let heavyrestrictions = getHeavyRestrictions(serverID, inspectuserID);
            wearingtext = `${wearingtext}\n-# ‎   ⤷ ⛓️ Restrictions - **Touch Self: ${heavyrestrictions.touchself ? "✅" : "⛔"}, Touch Others: ${heavyrestrictions.touchothers ? "✅" : "⛔"}, Container: ${!heavyrestrictions.touchlist ? "✅" : "⛔"}**`
        }

        // Chastity Belt
        if (getChastity(serverID, inspectuserID)) {
            let chastitylockemoji = canAccessChastity(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitylockemoji = "❓" }
            let currentchastitybelt = getChastityName(serverID, inspectuserID) ?? "Standard Chastity Belt"
            let chastitykeyholderinfo = getChastity(serverID, inspectuserID).keyholder
            let chastitykeyaccess = getChastity(serverID, inspectuserID)?.access;
            let chastitytimelockedtext = "Timelocked (Open)";
            if (chastitykeyaccess == 1) {
                chastitytimelockedtext = "Timelocked (Keyed)";
            }
            if (chastitykeyaccess == 2) {
                chastitytimelockedtext = "Timelocked (Sealed)";
            }
            wearingtext = `${wearingtext}\n${process.emojis.chastity} Chastity Belt: **${currentchastitybelt}**`
            if (!headwearrestrictions.canInspect) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getChastity(serverID, inspectuserID)?.fumbled) {
                if (getChastity(serverID, inspectuserID)?.temporarykeyholder) {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Temporarily held by <@${getChastity(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getChastityTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Keys are Missing!**`
                }
            }
            else if (getChastityTimelock(serverID, inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **${chastitytimelockedtext} until ${getChastityTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getChastity(serverID, inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Key held by <@${getChastity(serverID, inspectuserID).keyholder}>**`
            }
        }
        // Chastity Bra
        if (getChastityBra(serverID, inspectuserID)) {
            let chastitybralockemoji = canAccessChastityBra(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitybralockemoji = "❓" }
            let currentbrachastitybelt = getChastityBraName(serverID, inspectuserID) ?? "Standard Chastity Bra"
            let chastitybrakeyholderinfo = getChastityBra(serverID, inspectuserID).keyholder
            let chastitybrakeyaccess = getChastityBra(serverID, inspectuserID)?.access;
            let chastitybratimelockedtext = "Timelocked (Open)";
            if (chastitybrakeyaccess == 1) {
                chastitybratimelockedtext = "Timelocked (Keyed)";
            }
            if (chastitybrakeyaccess == 2) {
                chastitybratimelockedtext = "Timelocked (Sealed)";
            }
            wearingtext = `${wearingtext}\n${process.emojis.chastitybra} Chastity Bra: **${currentbrachastitybelt}**`
            if (!headwearrestrictions.canInspect) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getChastityBra(serverID, inspectuserID)?.fumbled) {
                if (getChastityBra(serverID, inspectuserID)?.temporarykeyholder) {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Temporarily held by <@${getChastityBra(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getChastityBraTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Keys are Missing!**`
                }
            }
            else if (getChastityBraTimelock(serverID, inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **${chastitybratimelockedtext} until ${getChastityBraTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getChastityBra(serverID, inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Key held by <@${getChastityBra(serverID, inspectuserID).keyholder}>**`
            }
        }
        // Collar
        if (getCollar(serverID, inspectuserID)) {
            let collarlockemoji = canAccessCollar(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { collarlockemoji = "❓" }
            let collarname = getCollarName(serverID, inspectuserID) ?? "Standard Collar"
            let collarkeyholderinfo = getCollar(serverID, inspectuserID).keyholder
            let collarkeyaccess = getCollar(serverID, inspectuserID)?.access;
            let collartimelockedtext = "Timelocked (Open)";
            if (collarkeyaccess == 1) {
                collartimelockedtext = "Timelocked (Keyed)";
            }
            if (collarkeyaccess == 2) {
                collartimelockedtext = "Timelocked (Sealed)";
            }
            let addlcollartext = ``;
            if (getCollar(serverID, inspectuserID) && getCollar(serverID, inspectuserID).additionalcollars) {
                addlcollartext = `\n-# ‎   |--- Additional Effects: `
                getCollar(serverID, inspectuserID).additionalcollars.forEach((ac) => {
                    addlcollartext = `${addlcollartext}**${getCollarName(serverID, undefined, ac)}**, `
                })
                addlcollartext = addlcollartext.slice(0,-2);
            }
            wearingtext = `${wearingtext}\n${process.emojis.collar} ${(getCollar(serverID, inspectuserID)?.collartype === "handcuffamulet") ? "Neck Ornament" : "Collar"}: **${collarname}**`
            wearingtext = `${wearingtext}${addlcollartext}`;
            if (!headwearrestrictions.canInspect) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getCollar(serverID, inspectuserID)?.fumbled) {
                if (getCollar(serverID, inspectuserID)?.temporarykeyholder) {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Temporarily held by <@${getCollar(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getCollarTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Keys are Missing!**`
                }
            }
            else if (getCollarTimelock(serverID, inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **${collartimelockedtext} until ${getCollarTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getCollar(serverID, inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Key held by <@${getCollar(serverID, inspectuserID).keyholder}>**`
            }
            if (!getCollar(serverID, inspectuserID).keyholder_only) {
                wearingtext = `${wearingtext}, **Free Use!**`
            }
            if (getCollar(serverID, inspectuserID).headpatvulnerable) {
                wearingtext = `${wearingtext}, **Vulnerable from Headpat!**`
            }
            wearingtext = `${wearingtext}\n-# Mittens: ${getCollarPerm(serverID, inspectuserID, "mitten") ? "✅" : "⛔"}, Chastity: ${getCollarPerm(serverID, inspectuserID, "chastity") ? "✅" : "⛔"}, Heavy: ${getCollarPerm(serverID, inspectuserID, "heavy") ? "✅" : "⛔"}, Masks: ${getCollarPerm(serverID, inspectuserID, "mask") ? "✅" : "⛔"}`
        }

        if (wearingtext === `## Worn Restraints:`) { 
            wearingtext = `${wearingtext}\n\nNothing is worn at the moment.`
        }
        wearingtext = `${wearingtext}\n`

        let clothingtext = `## Worn Apparel:\n`;
        if (getWearable(serverID, inspectuserID).length > 0) {
            clothingtext = `${clothingtext}**${getWearable(serverID, inspectuserID).map((h) => (!getLockedWearable(serverID, inspectuserID).includes(h) ? getWearableName(undefined, h) : `*${getWearableName(undefined, h)}*`)).slice(0,15).join(", ")}**`
            if (getWearable(serverID, inspectuserID).length > 15) {
                clothingtext = `${clothingtext}... *and ${getWearable(serverID, inspectuserID).length - 15} more item${(getWearable(serverID, inspectuserID).length - 15) == 1 ? "" : "s"}.*`
            }
        }
        if (clothingtext === `## Worn Apparel:\n`) { 
            clothingtext = `${clothingtext}\nNothing is worn at the moment`
        }
        clothingtext = `${clothingtext}\n`
        let bartext = await getDisplayTexts(serverID, userID, inspectuserID);

        let collated = `${wearingtext}${clothingtext}${bartext}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what <@${inspectuserID}> is wearing...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }
    else if (menu == "restraints") {
        let headwearrestrictions = getHeadwearRestrictions(serverID, userID);
        let wearingtext = `## Regular Worn Restraints:`;
        // Gags
        if (getGag(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.gag} Gags: **${getGags(serverID, inspectuserID).map((g) => { return `${convertGagText(g.gagtype)} (${g.intensity})`}).join(", ")}**`
        }
        // Headwear
        if (getHeadwear(serverID, inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n${process.emojis.gasmask} Masks: **${getHeadwear(serverID, inspectuserID).map((h) => (!getLockedHeadgear(serverID, inspectuserID).includes(h) ? getHeadwearName(serverID, undefined, h) : `*${getHeadwearName(serverID, undefined, h)}*`)).join(", ")}**`
            let lockedheadgears = [];
            if (process.headwear[serverID][inspectuserID]) { lockedheadgears = Object.keys(process.headwear[serverID][inspectuserID]) }
            lockedheadgears.forEach((lh) => {
                if (process.headwear[serverID][inspectuserID][lh] && process.headwear[serverID][inspectuserID][lh]?.lockable && process.headwear[serverID][inspectuserID][lh]?.origbinder) {
                    wearingtext = `${wearingtext}\n-# ‎   - **${process.headtypes[lh].name}** key held by <@${process.headwear[inspectuserID][lh].origbinder}>`
                }
            })
        }
        // Mittens
        if (getMitten(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.mitten} Mittens: **${getMittenName(serverID, inspectuserID) ?? "Standard Mittens"}**`
        }
        // Corset
        if (getCorset(serverID, inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.corset} Corset: **${getBaseCorset(getCorset(serverID, inspectuserID).type).name} laced with strings at length ${getCorset(serverID, inspectuserID).tightness}**`
        }
        // Vibe
        if (getToys(serverID, inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n${process.emojis.wand} Toys: **${getToys(serverID, inspectuserID).map((vibe) => `${getBaseToy(vibe.type).toyname} (${vibe.intensity})`).join(", ")}**`
        }
        // Heavy Bondage
        if (getHeavy(serverID, inspectuserID, undefined, true)) {
            wearingtext = `${wearingtext}\n${process.emojis.armbinder} Heavy Bondage: **${getHeavyList(serverID, inspectuserID).map((heavy) => heavy.displayname).join(", ")}**`
            let heavyrestrictions = getHeavyRestrictions(serverID, inspectuserID);
            wearingtext = `${wearingtext}\n-# ‎   ⤷ ⛓️ Restrictions - **Touch Self: ${heavyrestrictions.touchself ? "✅" : "⛔"}, Touch Others: ${heavyrestrictions.touchothers ? "✅" : "⛔"}, Container: ${!heavyrestrictions.touchlist ? "✅" : "⛔"}**`
        }

        let keyedrestraints = `## Keyed Restraints:`
        // Chastity Belt
        if (getChastity(serverID, inspectuserID)) {
            let chastitylockemoji = canAccessChastity(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitylockemoji = "❓" }
            let currentchastitybelt = getChastityName(serverID, inspectuserID) ?? "Standard Chastity Belt"
            let chastitykeyholderinfo = getChastity(serverID, inspectuserID).keyholder
            let chastitykeyaccess = getChastity(serverID, inspectuserID)?.access;
            let chastitytimelockedtext = "Timelocked (Open)";
            if (chastitykeyaccess == 1) {
                chastitytimelockedtext = "Timelocked (Keyed)";
            }
            if (chastitykeyaccess == 2) {
                chastitytimelockedtext = "Timelocked (Sealed)";
            }
            keyedrestraints = `${keyedrestraints}\n\n${process.emojis.chastity} Chastity Belt: **${currentchastitybelt}**`
            if (!headwearrestrictions.canInspect) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getChastity(serverID, inspectuserID)?.fumbled) {
                if (getChastity(serverID, inspectuserID)?.temporarykeyholder) {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Temporarily held by <@${getChastity(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getChastityTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Keys are Missing!**`
                }
            }
            else if (getChastityTimelock(serverID, inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **${chastitytimelockedtext} until ${getChastityTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getChastity(serverID, inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Key held by <@${getChastity(serverID, inspectuserID).keyholder}>**`
            }
            if (headwearrestrictions.canInspect && getChastity(serverID, inspectuserID).clonedKeyholders && (getChastity(serverID, inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\n-# Cloned keys for ${process.emojis.chastity} held by ${getChastity(serverID, inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getChastity(serverID, inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getChastity(serverID, inspectuserID).timestamp / 1000)}:f>`
            }
        }
        // Chastity Bra
        if (getChastityBra(serverID, inspectuserID)) {
            let chastitybralockemoji = canAccessChastityBra(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitybralockemoji = "❓" }
            let currentbrachastitybelt = getChastityBraName(serverID, inspectuserID, getChastityBra(serverID, inspectuserID).chastitytype) ?? "Standard Chastity Bra"
            let chastitybrakeyholderinfo = getChastityBra(serverID, inspectuserID).keyholder
            let chastitybrakeyaccess = getChastityBra(serverID, inspectuserID)?.access;
            let chastitybratimelockedtext = "Timelocked (Open)";
            if (chastitybrakeyaccess == 1) {
                chastitybratimelockedtext = "Timelocked (Keyed)";
            }
            if (chastitybrakeyaccess == 2) {
                chastitybratimelockedtext = "Timelocked (Sealed)";
            }
            keyedrestraints = `${keyedrestraints}\n\n${process.emojis.chastitybra} Chastity Bra: **${currentbrachastitybelt}**`
            if (!headwearrestrictions.canInspect) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getChastityBra(serverID, inspectuserID)?.fumbled) {
                if (getChastityBra(serverID, inspectuserID)?.temporarykeyholder) {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Temporarily held by <@${getChastityBra(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getChastityBraTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Keys are Missing!**`
                }
            }
            else if (getChastityBraTimelock(serverID, inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **${chastitybratimelockedtext} until ${getChastityBraTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getChastityBra(serverID, inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Key held by <@${getChastityBra(serverID, inspectuserID).keyholder}>**`
            }
            if (headwearrestrictions.canInspect && getChastityBra(serverID, inspectuserID).clonedKeyholders && (getChastityBra(serverID, inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\n-# Cloned keys for ${process.emojis.chastitybra} held by ${getChastityBra(serverID, inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getChastityBra(serverID, inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getChastityBra(serverID, inspectuserID).timestamp / 1000)}:f>`
            }
        }
        // Collar
        if (getCollar(serverID, inspectuserID)) {
            let collarlockemoji = canAccessCollar(serverID, inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { collarlockemoji = "❓" }
            let collarname = getCollarName(serverID, inspectuserID) ?? "Standard Collar"
            let collarkeyholderinfo = getCollar(serverID, inspectuserID).keyholder
            let collarkeyaccess = getCollar(serverID, inspectuserID)?.access;
            let collartimelockedtext = "Timelocked (Open)";
            if (collarkeyaccess == 1) {
                collartimelockedtext = "Timelocked (Keyed)";
            }
            if (collarkeyaccess == 2) {
                collartimelockedtext = "Timelocked (Sealed)";
            }
            let addlcollartext = ``;
            if (getCollar(serverID, inspectuserID) && getCollar(serverID, inspectuserID).additionalcollars) {
                addlcollartext = `\n-# ‎   |--- Additional Effects: `
                getCollar(serverID, inspectuserID).additionalcollars.forEach((ac) => {
                    addlcollartext = `${addlcollartext}**${getCollarName(serverID, undefined, ac)}**, `
                })
                addlcollartext = addlcollartext.slice(0,-2);
            }
            keyedrestraints = `${keyedrestraints}\n\n${process.emojis.collar} ${(getCollar(serverID, inspectuserID)?.collartype === "handcuffamulet") ? "Neck Ornament" : "Collar"}: **${collarname}**`
            keyedrestraints = `${keyedrestraints}${addlcollartext}`;
            if (!headwearrestrictions.canInspect) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Blind!**`
            }
            // Lost keys from fumble
            else if (getCollar(serverID, inspectuserID)?.fumbled) {
                if (getCollar(serverID, inspectuserID)?.temporarykeyholder) {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Temporarily held by <@${getCollar(serverID, inspectuserID)?.temporarykeyholder}>, returning ${getCollarTempTimelock(serverID, inspectuserID, true)}**`
                }
                else {
                    keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Keys are Missing!**`
                }
            }
            else if (getCollarTimelock(serverID, inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **${collartimelockedtext} until ${getCollarTimelock(serverID, inspectuserID, true)}**`
            }
            else if (getCollar(serverID, inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Key held by <@${getCollar(serverID, inspectuserID).keyholder}>**`
            }
            if (!getCollar(serverID, inspectuserID).keyholder_only) {
                keyedrestraints = `${keyedrestraints}, **Free Use!**`
            }
            if (getCollar(serverID, inspectuserID).headpatvulnerable) {
                keyedrestraints = `${keyedrestraints}, **Vulnerable from Headpat!**`
            }
            if (headwearrestrictions.canInspect && getCollar(serverID, inspectuserID).clonedKeyholders && (getCollar(serverID, inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\n-# Cloned keys for ${process.emojis.collar} held by ${getCollar(serverID, inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getCollar(serverID, inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getCollar(serverID, inspectuserID).timestamp / 1000)}:f>`
            }
            keyedrestraints = `${keyedrestraints}\n-# Mittens: ${getCollarPerm(serverID, inspectuserID, "mitten") ? "✅" : "⛔"}, Chastity: ${getCollarPerm(serverID, inspectuserID, "chastity") ? "✅" : "⛔"}, Heavy: ${getCollarPerm(serverID, inspectuserID, "heavy") ? "✅" : "⛔"}, Masks: ${getCollarPerm(serverID, inspectuserID, "mask") ? "✅" : "⛔"}`
        }

        if (wearingtext === `## Regular Worn Restraints:`) { 
            wearingtext = `${wearingtext}\n\nNothing is worn at the moment.`
        }
        wearingtext = `${wearingtext}\n`

        if (keyedrestraints === `## Keyed Restraints:`) { 
            keyedrestraints = `${keyedrestraints}\n\nNo keyed restraints worn at the moment.`
        }
        keyedrestraints = `${keyedrestraints}\n`

        let collated = `${wearingtext}${keyedrestraints}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what <@${inspectuserID}> is wearing...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }
    else if (menu == "wearable") {
        let headwearrestrictions = getHeadwearRestrictions(serverID, userID);
        let clothingtext = `## Worn Apparel:`;
        if (getWearable(serverID, inspectuserID).length > 0) {
            let wearablescategories = {
                Hat: [],
                "Head/Hair Accessories": [],
                Glasses: [],
                Cosplay: [],
                Doll: [],
                Bondage: [],
                Dress: [],
                "Upper Body": [],
                "Lower Body": [],
                Undergarments: [],
                Footwear: [],
                Hands: [],
				"Body Modification": [],
                Misc: [],
                "Body Part": [],
                Other: []
            }
            getWearable(serverID, inspectuserID).map((w) => { return { base: getBaseWearable(w), item: w } }).forEach((basewearable) => {
                if (basewearable?.base?.category && Object.keys(wearablescategories).includes(basewearable?.base?.category)) {
                    wearablescategories[basewearable?.base?.category].push(basewearable.item)
                }
                else {
                    wearablescategories.Other.push(basewearable.item)
                }
            })
            for (category in wearablescategories) {
                if (wearablescategories[category].length > 0) {
                    let remaininglength = (1800 - clothingtext.length);
                    let newtexttoadd = `\n### ${category}\n`;
                    wearablescategories[category].sort().forEach((w) => {
                        if (newtexttoadd.length < remaininglength) {
                            newtexttoadd = `${newtexttoadd}${!getLockedWearable(serverID, inspectuserID).includes(w) ? getWearableName(undefined, w) : `*${getWearableName(undefined, w)}*`}, `
                        }
                    })
                    if (newtexttoadd != `\n### ${category}`) {
                        clothingtext = `${clothingtext}${newtexttoadd.slice(0,-2)}`
                    }
                }
            }

        }
        if (clothingtext.length > 1800) {
            clothingtext = `${clothingtext.slice(0,1800)}...` // We'll make a more elegant overflow solution later. 
        }
        if (clothingtext === `### Worn Apparel:\n`) { 
            clothingtext = `${clothingtext}\nNothing is worn at the moment`
        }
        clothingtext = `${clothingtext}\n`

        let collated = `${clothingtext}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what <@${inspectuserID}> is wearing...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }
    else if (menu == "keys") {
        let headwearrestrictions = getHeadwearRestrictions(serverID, userID);
        // Keys Held
        let keysheldtext = "";
        // Held Primary Keys
        let keysheldchastity = getChastityKeys(serverID, inspectuserID);
        if (keysheldchastity.length > 0) {
            keysheldchastity = keysheldchastity.map((k) => `<@${k}>`);
            let keysstring = keysheldchastity.join(", ");
            keysheldtext = `- ${process.emojis.chastity} Chastity belt keys: ${keysstring}\n`;
        }
        let keysheldchastitybra = getChastityBraKeys(serverID, inspectuserID);
        if (keysheldchastitybra.length > 0) {
            keysheldchastitybra = keysheldchastitybra.map((k) => `<@${k}>`);
            let keysstring = keysheldchastitybra.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastitybra} Chastity bra keys: ${keysstring}\n`;
        }
        let keysheldcollar = getCollarKeys(serverID, inspectuserID);
        if (keysheldcollar.length > 0) {
            keysheldcollar = keysheldcollar.map((k) => `<@${k}>`);
            let keysstring = keysheldcollar.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.collar} Collar keys: ${keysstring}\n`;
        }
        // Held Cloned Keys
        let keysheldclonedchastity = getClonedChastityKeysOwned(serverID, inspectuserID);
        if (keysheldclonedchastity.length > 0) {
            keysheldclonedchastity = keysheldclonedchastity.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedchastity.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastityclone} Cloned chastity belt keys: ${keysstring}\n`;
        }
        let keysheldclonedchastitybra = getClonedChastityBraKeysOwned(serverID, inspectuserID);
        if (keysheldclonedchastitybra.length > 0) {
            keysheldclonedchastitybra = keysheldclonedchastitybra.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedchastitybra.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastitybraclone} Cloned chastity bra keys: ${keysstring}\n`;
        }
        let keysheldclonedcollar = getClonedCollarKeysOwned(serverID, inspectuserID);
        if (keysheldclonedcollar.length > 0) {
            keysheldclonedcollar = keysheldclonedcollar.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedcollar.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.collarclone} Cloned collar keys: ${keysstring}`;
        }
        if (keysheldtext.length > 0) {
            keysheldtext = `## Keys Held\n${keysheldtext}`
        }
        else {
            keysheldtext = `## Keys Held\nNo keys held at the moment`
        }

        let collated = `${keysheldtext}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what keys <@${inspectuserID}> has...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }
    else if (menu == "stats") {
        pagecomponents.push(new TextDisplayBuilder().setContent(statsGeneratePage(serverID, inspectuserID)))
    }

    return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] };
}

exports.generateOutfitModal = generateOutfitModal;
exports.outfitEntryModal = outfitEntryModal;
exports.inspectModal = inspectModal;