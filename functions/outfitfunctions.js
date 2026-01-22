const { ActionRowBuilder } = require("@discordjs/builders");
const { StringSelectMenuOptionBuilder } = require("@discordjs/builders");
const { StringSelectMenuBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { TextDisplayBuilder, MessageFlags, ButtonStyle, ActionRow, SectionBuilder, LabelBuilder, TextInputStyle } = require("discord.js");
const { getWearable, getLockedWearable, getWearableName } = require("./wearablefunctions");
const { getGags, getMitten, getGag, convertGagText, getMittenName } = require("./gagfunctions");
const { getCollar, canAccessCollar, getCollarName, getCollarTimelock, getCollarPerm, getCollarKeys, getClonedCollarKeysOwned } = require("./collarfunctions");
const { getCorset } = require("./corsetfunctions");
const { getChastity, getVibe, getChastityTimelock, getArousal, getChastityKeys } = require("./vibefunctions");
const { getChastityBra } = require("./vibefunctions");
const { getHeadwear, getHeadwearName, getHeadwearRestrictions, getLockedHeadgear } = require("./headwearfunctions");
const { getHeavy, convertheavy } = require("./heavyfunctions");
const { canAccessChastity } = require("./vibefunctions");
const { canAccessChastityBra } = require("./vibefunctions");
const { getChastityName } = require("./vibefunctions");
const { getChastityBraTimelock } = require("./vibefunctions");
const { getChastityBraName } = require("./vibefunctions");
const { ModalBuilder } = require("@discordjs/builders");
const { TextInputBuilder } = require("@discordjs/builders");
const { UserSelectMenuBuilder } = require("@discordjs/builders");
const { arousedtexts } = require("../vibes/aroused/aroused_texts");
const { getArousalBar } = require("./vibefunctions");
const { getPronounsSet } = require("./pronounfunctions");
const { getChastityBraKeys } = require("./vibefunctions");
const { getClonedChastityKeysOwned } = require("./vibefunctions");
const { getClonedChastityBraKeysOwned } = require("./vibefunctions");
const { calcDenialCoefficient } = require("./vibefunctions");

function getOutfits(userID) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	return process.outfits[userID];
}

function assignOutfit(userID, slot, options) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	let storedobject = {};
	if (typeof options == "string") {
		// These go in order based on inspect text.
		let optionbit = 0;
		if (options.charAt(optionbit) == 1) {
			storedobject.gag = getGags(userID).length > 0 ? getGags(userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.headwear = getHeadwear(userID).length > 0 ? getHeadwear(userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.mitten = getMitten(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.wearable = getWearable(userID).length > 0 ? getWearable(userID) : undefined;
			storedobject.lockedwearable = getLockedWearable(userID).length > 0 ? getLockedWearable(userID) : undefined;
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.vibe = getVibe(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastity = getChastity(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.chastitybra = getChastityBra(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.corset = getCorset(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.heavy = getHeavy(userID);
		}
		optionbit++;
		if (options.charAt(optionbit) == 1) {
			storedobject.collar = getCollar(userID);
		}
		if (Object.keys(storedobject).length > 0) {
			process.outfits[userID][slot] = JSON.parse(JSON.stringify(storedobject));
			if (process.readytosave == undefined) {
				process.readytosave = {};
			}
			process.readytosave.outfits = true;
		}
	}
}

function restoreOutfit(userID, storedobject) {
	Object.keys(storedobject).forEach((k) => {
		// I could use a switch statement here but I feel like using if conditionals.
		if (k == "wearable") {
			getWearable(userID);
			getLockedWearable(userID);
			if (!getHeavy(userID)) {
				process.wearable[userID] = { wornwearable: storedobject.wearable, locked: storedobject.lockedwearable };
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.wearable = true;
			}
		}
		if (k == "gag") {
			getGags(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.gags[userID] = storedobject.gag;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.gags = true;
			}
		}
		if (k == "mitten") {
			getMitten(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.mitten[userID] = storedobject.mitten;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.mitten = true;
			}
		}
		if (k == "headwear") {
			getHeadwear(userID);
			if (!getHeavy(userID) && !getMitten(userID)) {
				process.headwear[userID] = storedobject.headwear;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.headwear = true;
			}
		}
		if (k == "collar") {
			getCollar(userID);
			if (!getHeavy(userID) && (canAccessCollar(userID, userID, true).access || !canAccessCollar(userID, userID, true).hascollar)) {
				process.collar[userID] = storedobject.collar;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.collar = true;
			}
		}
		if (k == "heavy") {
			getHeavy(userID);
			if (!getHeavy(userID)) {
				process.heavy[userID] = storedobject.heavy;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.heavy = true;
			}
		}
		if (k == "corset") {
			getCorset(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.corset[userID] = storedobject.corset;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.corset = true;
			}
		}
		if (k == "chastity") {
			getChastity(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.chastity[userID] = storedobject.chastity;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.chastity = true;
			}
		}
		if (k == "chastitybra") {
			getChastityBra(userID);
			if (!getHeavy(userID) && (canAccessChastityBra(userID, userID, true).access || !canAccessChastityBra(userID, userID, true).hasbelt)) {
				process.chastitybra[userID] = storedobject.chastitybra;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.chastitybra = true;
			}
		}
		if (k == "vibe") {
			getVibe(userID);
			if (!getHeavy(userID) && (canAccessChastity(userID, userID, true).access || !canAccessChastity(userID, userID, true).hasbelt)) {
				process.vibe[userID] = storedobject.vibe;
				if (process.readytosave == undefined) {
					process.readytosave = {};
				}
				process.readytosave.vibe = true;
			}
		}
	});
}

function renameOutfit(userID, slot, newname) {
	if (process.outfits == undefined) {
		process.outfits = {};
	}
	if (process.outfits[userID] == undefined) {
		process.outfits[userID] = [];
	}
	if (process.outfits[userID][slot]) {
		process.outfits[userID][slot].outfitname = newname;
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.outfits = true;
}

async function generateOutfitModal(userID, menu, page, options) {
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
		let outfits = getOutfits(userID);
		for (let i = (parseInt(page) - 1) * 5; i < page * 5; i++) {
			let textdisplay = `### Outfit ${i + 1}`;
			let outfitindividual = outfits[i];
			if (outfitindividual) {
				textdisplay = `${textdisplay}${outfitindividual.outfitname ? `: ${outfitindividual.outfitname}` : ``}\n-# `;
				Object.keys(outfitindividual).forEach((k) => {
					// I could use a switch statement here but I feel like using if conditionals.
					if (k == "wearable") {
						let emoji = getHeavy(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}👗 Clothing: ${emoji}, `;
					}
					if (k == "gag") {
						let emoji = getHeavy(userID) || getMitten(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.gag} Gag: ${emoji}, `;
					}
					if (k == "mitten") {
						let emoji = getHeavy(userID) || getMitten(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.mitten} Mitten: ${emoji}, `;
					}
					if (k == "headwear") {
						let emoji = getHeavy(userID) || getMitten(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}👤 Headwear: ${emoji}, `;
					}
					if (k == "collar") {
						let emoji = getHeavy(userID) || (!canAccessCollar(userID, userID, true).access && canAccessCollar(userID, userID, true).hascollar) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.collar} Collar: ${emoji}, `;
					}
					if (k == "heavy") {
						let emoji = getHeavy(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.armbinder} Heavy: ${emoji}, `;
					}
					if (k == "corset") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.corset} Corset: ${emoji}, `;
					}
					if (k == "chastity") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.chastity} Chastity: ${emoji}, `;
					}
					if (k == "chastitybra") {
						let emoji = getHeavy(userID) || (!canAccessChastityBra(userID, userID, true).access && canAccessChastityBra(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.chastitybra} Chastity Bra: ${emoji}, `;
					}
					if (k == "vibe") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}${process.emojis.wand} Vibrator: ${emoji}, `;
					}
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
		let outfits = getOutfits(userID);
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
		if (!getGag(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getGags(userID)
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
						.setDisabled(!getGag(userID)),
				),
		);
		bitselector++;

		// Headwear section
		texts = `### Headwear:\n`;
		if (!(getHeadwear(userID).length > 0)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getHeadwear(userID)
				.map((g) => getHeadwearName(undefined, g))
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
						.setDisabled(!(getHeadwear(userID).length > 0)),
				),
		);
		bitselector++;

		// Mittens section
		texts = `### Mitten:\n`;
		if (!getMitten(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getMittenName(userID) ?? "Worn"}`;
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
						.setDisabled(!getMitten(userID)),
				),
		);
		bitselector++;

		// Wearable section
		texts = `### Apparel:\n`;
		if (!(getWearable(userID).length > 0)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getWearable(userID)
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
						.setDisabled(!(getWearable(userID).length > 0)),
				),
		);
		bitselector++;

		// Vibrator section
		texts = `### Vibrators:\n`;
		if (!getVibe(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getVibe(userID)
				.map((v) => v.vibetype)
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
						.setDisabled(!getVibe(userID)),
				),
		);
		bitselector++;

		// Chastity Belt section
		texts = `### Chastity Belt:\n`;
		if (!getChastity(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getChastityName(userID) ?? "Standard Chastity Belt"}\n`;
			texts = `${texts}Primary Keyholder: ${getChastityTimelock(userID) ? `Timelocked` : getChastity(userID).keyholder == userID ? `Self-bound` : `<@${getChastity(userID).keyholder}>`}`;
			texts = `${texts}${
				getChastity(userID).clonedKeyholders
					? `, clones held by ${getChastity(userID)
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
						.setDisabled(!getChastity(userID)),
				),
		);
		bitselector++;

		// Chastity Bra section
		texts = `### Chastity Bra:\n`;
		if (!getChastityBra(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getChastityBraName(userID) ?? "Standard Chastity Bra"}\n`;
			texts = `${texts}Primary Keyholder: ${getChastityBraTimelock(userID) ? `Timelocked` : getChastityBra(userID).keyholder == userID ? `Self-bound` : `<@${getChastityBra(userID).keyholder}>`}`;
			texts = `${texts}${
				getChastityBra(userID).clonedKeyholders
					? `, clones held by ${getChastityBra(userID)
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
						.setDisabled(!getChastityBra(userID)),
				),
		);
		bitselector++;

		// Corset section
		texts = `### Corset:\n`;
		if (!getCorset(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}Laced to Length ${getCorset(userID).tightness}`;
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
						.setDisabled(!getCorset(userID)),
				),
		);
		bitselector++;

		// Heavy Bondage section
		texts = `### Heavy Bondage:\n`;
		if (!getHeavy(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getHeavy(userID).type}`;
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
						.setDisabled(!getHeavy(userID)),
				),
		);
		bitselector++;

		// Collar section
		texts = `### Collar:\n`;
		if (!getCollar(userID)) {
			texts = `${texts}Not worn`;
		} else {
			texts = `${texts}${getCollarName(userID)}\n`;
			texts = `${texts}Primary Keyholder: ${getCollarTimelock(userID) ? `Timelocked` : getCollar(userID).keyholder == userID ? `Self-bound` : `<@${getCollar(userID).keyholder}>`}`;
			texts = `${texts}${
				getCollar(userID).clonedKeyholders
					? `, clones held by ${getCollar(userID)
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
						.setDisabled(!getCollar(userID)),
				),
		);
		bitselector++;

		let buttonsave = new ButtonBuilder()
			.setCustomId(`outfitter_saveoutfit_${page}_0_${options}`)
			.setLabel(getOutfits(userID)[parseInt(page) - 1] ? `⚠️ Overwrite Outfit ${page}` : `Save Outfit ${page}`)
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

async function inspectModal(userID, inspectuserIDin, menu, page) {
    let inspectuserID = inspectuserIDin ?? userID;
    let userselector = new UserSelectMenuBuilder()
        .setCustomId(`inspect_overview_newuser_1`)
        .setMaxValues(1)
        .setDefaultUsers(inspectuserID)
        .setPlaceholder("Select a user to display...")
    let pagecomponents = [new ActionRowBuilder().addComponents(userselector), new TextDisplayBuilder().setContent(`## Inspecting - <@${inspectuserID}>\n-# (${getPronounsSet(inspectuserID)})`)];
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
		// Restraints
		new ButtonBuilder()
			.setCustomId(`inspect_wearable_${inspectuserID}_1`)
			.setLabel("Apparel")
            .setEmoji({ name: "👗" })
			.setStyle(menu == "wearable" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "wearable" ? true : false),
        // Restraints
		new ButtonBuilder()
			.setCustomId(`inspect_keys_${inspectuserID}_1`)
			.setLabel("Keys")
            .setEmoji({ name: "🔑" })
			.setStyle(menu == "keys" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(menu == "keys" ? true : false),
	];
	pagecomponents.push(new ActionRowBuilder().addComponents(...tabbuttons));

    // Now do stuff per page
    if (menu == "overview") {
        let headwearrestrictions = getHeadwearRestrictions(userID);
        let wearingtext = `### Worn Restraints:`;
        // Gags
        if (getGag(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.gag} Gags: **${getGags(inspectuserID).map((g) => { return `${convertGagText(g.gagtype)} (${g.intensity})`}).join(", ")}**`
        }
        // Headwear
        if (getHeadwear(inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n👤 Masks: **${getHeadwear(inspectuserID).map((h) => (!getLockedHeadgear(inspectuserID).includes(h) ? getHeadwearName(undefined, h) : `*${getHeadwearName(undefined, h)}*`)).join(", ")}**`
        }
        // Mittens
        if (getMitten(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.mitten} Mittens: **${getMittenName(inspectuserID) ?? "Standard Mittens"}**`
        }
        // Corset
        if (getCorset(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.corset} Corset: **Laced with strings at length ${getCorset(inspectuserID).tightness}**`
        }
        // Vibe
        if (getVibe(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.wand} Toys: **${getVibe(inspectuserID).map((vibe) => `${vibe.vibetype} (${vibe.intensity})`).join(", ")}**`
        }
        // Heavy Bondage
        if (getHeavy(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.armbinder} Heavy Bondage: **${getHeavy(inspectuserID).type}**`
        }

        // Chastity Belt
        if (getChastity(inspectuserID)) {
            let chastitylockemoji = canAccessChastity(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitylockemoji = "❓" }
            let currentchastitybelt = getChastityName(inspectuserID) ?? "Standard Chastity Belt"
            let chastitykeyholderinfo = getChastity(inspectuserID).keyholder
            let chastitykeyaccess = getChastity(inspectuserID)?.access;
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
            else if (chastitykeyholderinfo == "discarded") {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Keys are Missing!**`
            }
            else if (getChastityTimelock(inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **${chastitytimelockedtext} until ${getChastityTimelock(inspectuserID, true)}**`
            }
            else if (getChastity(inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitylockemoji} **Key held by <@${getChastity(inspectuserID).keyholder}>**`
            }
        }
        // Chastity Bra
        if (getChastityBra(inspectuserID)) {
            let chastitybralockemoji = canAccessChastityBra(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitybralockemoji = "❓" }
            let currentbrachastitybelt = getChastityBraName(inspectuserID) ?? "Standard Chastity Bra"
            let chastitybrakeyholderinfo = getChastityBra(inspectuserID).keyholder
            let chastitybrakeyaccess = getChastityBra(inspectuserID)?.access;
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
            else if (chastitybrakeyholderinfo == "discarded") {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Keys are Missing!**`
            }
            else if (getChastityBraTimelock(inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **${chastitybratimelockedtext} until ${getChastityBraTimelock(inspectuserID, true)}**`
            }
            else if (getChastityBra(inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${chastitybralockemoji} **Key held by <@${getChastityBra(inspectuserID).keyholder}>**`
            }
        }
        // Collar
        if (getCollar(inspectuserID)) {
            let collarlockemoji = canAccessCollar(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { collarlockemoji = "❓" }
            let collarname = getCollarName(inspectuserID) ?? "Standard Collar"
            let collarkeyholderinfo = getCollar(inspectuserID).keyholder
            let collarkeyaccess = getCollar(inspectuserID)?.access;
            let collartimelockedtext = "Timelocked (Open)";
            if (collarkeyaccess == 1) {
                collartimelockedtext = "Timelocked (Keyed)";
            }
            if (collarkeyaccess == 2) {
                collartimelockedtext = "Timelocked (Sealed)";
            }
            wearingtext = `${wearingtext}\n${process.emojis.collar} Collar: **${collarname}**`
            if (!headwearrestrictions.canInspect) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Blind!**`
            }
            // Lost keys from fumble
            if (collarkeyholderinfo == "discarded") {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Keys are Missing!**`
            }
            else if (getCollarTimelock(inspectuserID)) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **${collartimelockedtext} until ${getCollarTimelock(inspectuserID, true)}**`
            }
            else if (getCollar(inspectuserID).keyholder == inspectuserID) {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Self-bound!**`
            }
            else {
                wearingtext = `${wearingtext}\n-# ‎   ⤷ ${collarlockemoji} **Key held by <@${getCollar(inspectuserID).keyholder}>**`
            }
            wearingtext = `${wearingtext}\n-# Mittens: ${getCollarPerm(inspectuserID, "mitten") ? "✅" : "⛔"}, Chastity: ${getCollarPerm(inspectuserID, "chastity") ? "✅" : "⛔"}, Heavy: ${getCollarPerm(inspectuserID, "heavy") ? "✅" : "⛔"}, Masks: ${getCollarPerm(inspectuserID, "mask") ? "✅" : "⛔"}`
        }

        if (wearingtext === `### Worn Restraints:`) { 
            wearingtext = `${wearingtext}\n\nNothing is worn at the moment.`
        }
        wearingtext = `${wearingtext}\n`

        let clothingtext = `### Worn Apparel:\n`;
        if (getWearable(inspectuserID).length > 0) {
            clothingtext = `${clothingtext}**${getWearable(inspectuserID).map((h) => (!getLockedWearable(inspectuserID).includes(h) ? getWearableName(undefined, h) : `*${getWearableName(undefined, h)}*`)).slice(0,15).join(", ")}**`
            if (getWearable(inspectuserID).length > 15) {
                clothingtext = `${clothingtext}... *and ${getWearable(inspectuserID).length - 15} more item${(getWearable(inspectuserID).length - 15) == 1 ? "" : "s"}.*`
            }
        }
        if (clothingtext === `### Worn Apparel:\n`) { 
            clothingtext = `${clothingtext}\nNothing is worn at the moment`
        }
        clothingtext = `${clothingtext}\n`

        let bartext = ``;
        if (getArousal(inspectuserID) > 2.0) {
            bartext = `\n💞 Arousal: ${getArousalBar(inspectuserID).bar} (${getArousalBar(inspectuserID).percentage}%)`
            if (calcDenialCoefficient(inspectuserID) > 1) {
                bartext = `${bartext}\n-# ‎ (Current Denial: **${Math.round(calcDenialCoefficient(inspectuserID) * 100)}%**)`
            }
        }

        let collated = `${wearingtext}${clothingtext}${bartext}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what <@${inspectuserID}> is wearing...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }
    else if (menu == "restraints") {
        let headwearrestrictions = getHeadwearRestrictions(userID);
        let wearingtext = `### Regular Worn Restraints:`;
        // Gags
        if (getGag(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.gag} Gags: **${getGags(inspectuserID).map((g) => { return `${convertGagText(g.gagtype)} (${g.intensity})`}).join(", ")}**`
        }
        // Headwear
        if (getHeadwear(inspectuserID).length > 0) {
            wearingtext = `${wearingtext}\n👤 Masks: **${getHeadwear(inspectuserID).map((h) => (!getLockedHeadgear(inspectuserID).includes(h) ? getHeadwearName(undefined, h) : `*${getHeadwearName(undefined, h)}*`)).join(", ")}**`
        }
        // Mittens
        if (getMitten(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.mitten} Mittens: **${getMittenName(inspectuserID) ?? "Standard Mittens"}**`
        }
        // Corset
        if (getCorset(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.corset} Corset: **Laced with strings at length ${getCorset(inspectuserID).tightness}**`
        }
        // Vibe
        if (getVibe(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.wand} Toys: **${getVibe(inspectuserID).map((vibe) => `${vibe.vibetype} (${vibe.intensity})`).join(", ")}**`
        }
        // Heavy Bondage
        if (getHeavy(inspectuserID)) {
            wearingtext = `${wearingtext}\n${process.emojis.armbinder} Heavy Bondage: **${getHeavy(inspectuserID).type}**`
        }

        let keyedrestraints = `### Keyed Restraints:`
        // Chastity Belt
        if (getChastity(inspectuserID)) {
            let chastitylockemoji = canAccessChastity(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitylockemoji = "❓" }
            let currentchastitybelt = getChastityName(inspectuserID) ?? "Standard Chastity Belt"
            let chastitykeyholderinfo = getChastity(inspectuserID).keyholder
            let chastitykeyaccess = getChastity(inspectuserID)?.access;
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
            else if (chastitykeyholderinfo == "discarded") {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Keys are Missing!**`
            }
            else if (getChastityTimelock(inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **${chastitytimelockedtext} until ${getChastityTimelock(inspectuserID, true)}**`
            }
            else if (getChastity(inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitylockemoji} **Key held by <@${getChastity(inspectuserID).keyholder}>**`
            }
            if (headwearrestrictions.canInspect && getChastity(inspectuserID).clonedKeyholders && (getChastity(inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\n-# Cloned keys for ${process.emojis.chastity} held by ${getChastity(inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getChastity(inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getChastity(inspectuserID).timestamp / 1000)}:f>`
            }
        }
        // Chastity Bra
        if (getChastityBra(inspectuserID)) {
            let chastitybralockemoji = canAccessChastityBra(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { chastitybralockemoji = "❓" }
            let currentbrachastitybelt = getChastityBraName(inspectuserID, getChastityBra(inspectuserID).chastitytype) ?? "Standard Chastity Bra"
            let chastitybrakeyholderinfo = getChastityBra(inspectuserID).keyholder
            let chastitybrakeyaccess = getChastityBra(inspectuserID)?.access;
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
            else if (chastitybrakeyholderinfo == "discarded") {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Keys are Missing!**`
            }
            else if (getChastityBraTimelock(inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **${chastitybratimelockedtext} until ${getChastityBraTimelock(inspectuserID, true)}**`
            }
            else if (getChastityBra(inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${chastitybralockemoji} **Key held by <@${getChastityBra(inspectuserID).keyholder}>**`
            }
            if (headwearrestrictions.canInspect && getChastityBra(inspectuserID).clonedKeyholders && (getChastityBra(inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\nCloned keys for ${process.emojis.chastitybra} held by ${getChastityBra(inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getChastityBra(inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getChastityBra(inspectuserID).timestamp / 1000)}:f>`
            }
        }
        // Collar
        if (getCollar(inspectuserID)) {
            let collarlockemoji = canAccessCollar(inspectuserID, userID).access ? "🔑" : "🔒";
            if (!headwearrestrictions.canInspect) { collarlockemoji = "❓" }
            let collarname = getCollarName(inspectuserID) ?? "Standard Collar"
            let collarkeyholderinfo = getCollar(inspectuserID).keyholder
            let collarkeyaccess = getCollar(inspectuserID)?.access;
            let collartimelockedtext = "Timelocked (Open)";
            if (collarkeyaccess == 1) {
                collartimelockedtext = "Timelocked (Keyed)";
            }
            if (collarkeyaccess == 2) {
                collartimelockedtext = "Timelocked (Sealed)";
            }
            keyedrestraints = `${keyedrestraints}\n\n${process.emojis.collar} Collar: **${collarname}**`
            if (!headwearrestrictions.canInspect) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Blind!**`
            }
            // Lost keys from fumble
            if (collarkeyholderinfo == "discarded") {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Keys are Missing!**`
            }
            else if (getCollarTimelock(inspectuserID)) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **${collartimelockedtext} until ${getCollarTimelock(inspectuserID, true)}**`
            }
            else if (getCollar(inspectuserID).keyholder == inspectuserID) {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Self-bound!**`
            }
            else {
                keyedrestraints = `${keyedrestraints}\n-# ‎   ⤷ ${collarlockemoji} **Key held by <@${getCollar(inspectuserID).keyholder}>**`
            }
            if (!headwearrestrictions.canInspect && getCollar(inspectuserID).clonedKeyholders && (getCollar(inspectuserID).clonedKeyholders.length > 0)) {
                keyedrestraints = `${keyedrestraints}\nCloned keys for ${process.emojis.collar} held by ${getCollar(inspectuserID).clonedKeyholders.map((c) => `<@${c}>`).join(", ")}`
            }
            if (getCollar(inspectuserID).timestamp) {
                keyedrestraints = `${keyedrestraints}\n-# Worn since <t:${Math.floor(getCollar(inspectuserID).timestamp / 1000)}:f>`
            }
            keyedrestraints = `${keyedrestraints}\n-# Mittens: ${getCollarPerm(inspectuserID, "mitten") ? "✅" : "⛔"}, Chastity: ${getCollarPerm(inspectuserID, "chastity") ? "✅" : "⛔"}, Heavy: ${getCollarPerm(inspectuserID, "heavy") ? "✅" : "⛔"}, Masks: ${getCollarPerm(inspectuserID, "mask") ? "✅" : "⛔"}`
        }

        if (wearingtext === `### Regular Worn Restraints:`) { 
            wearingtext = `${wearingtext}\n\nNothing is worn at the moment.`
        }
        wearingtext = `${wearingtext}\n`

        if (keyedrestraints === `### Keyed Restraints:`) { 
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
        let headwearrestrictions = getHeadwearRestrictions(userID);
        let clothingtext = `### Worn Apparel:\n`;
        if (getWearable(inspectuserID).length > 0) {
            clothingtext = `${clothingtext}**${getWearable(inspectuserID).map((h) => (!getLockedWearable(inspectuserID).includes(h) ? getWearableName(undefined, h) : `*${getWearableName(undefined, h)}*`)).join(", ")}**`
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
        let headwearrestrictions = getHeadwearRestrictions(userID);
        // Keys Held
        let keysheldtext = "";
        // Held Primary Keys
        let keysheldchastity = getChastityKeys(inspectuserID);
        if (keysheldchastity.length > 0) {
            keysheldchastity = keysheldchastity.map((k) => `<@${k}>`);
            let keysstring = keysheldchastity.join(", ");
            keysheldtext = `- ${process.emojis.chastity} Chastity belt keys: ${keysstring}\n`;
        }
        let keysheldchastitybra = getChastityBraKeys(inspectuserID);
        if (keysheldchastitybra.length > 0) {
            keysheldchastitybra = keysheldchastitybra.map((k) => `<@${k}>`);
            let keysstring = keysheldchastitybra.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastitybra} Chastity bra keys: ${keysstring}\n`;
        }
        let keysheldcollar = getCollarKeys(inspectuserID);
        if (keysheldcollar.length > 0) {
            keysheldcollar = keysheldcollar.map((k) => `<@${k}>`);
            let keysstring = keysheldcollar.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.collar} Collar keys: ${keysstring}\n`;
        }
        // Held Cloned Keys
        let keysheldclonedchastity = getClonedChastityKeysOwned(inspectuserID);
        if (keysheldclonedchastity.length > 0) {
            keysheldclonedchastity = keysheldclonedchastity.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedchastity.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastityclone} Cloned chastity belt keys: ${keysstring}\n`;
        }
        let keysheldclonedchastitybra = getClonedChastityBraKeysOwned(inspectuserID);
        if (keysheldclonedchastitybra.length > 0) {
            keysheldclonedchastitybra = keysheldclonedchastitybra.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedchastitybra.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.chastitybraclone} Cloned chastity bra keys: ${keysstring}\n`;
        }
        let keysheldclonedcollar = getClonedCollarKeysOwned(inspectuserID);
        if (keysheldclonedcollar.length > 0) {
            keysheldclonedcollar = keysheldclonedcollar.map((k) => `<@${k.split("_")[0]}>`);
            let keysstring = keysheldclonedcollar.join(", ");
            keysheldtext = `${keysheldtext}- ${process.emojis.collarclone} Cloned collar keys: ${keysstring}`;
        }
        if (keysheldtext.length > 0) {
            keysheldtext = `### Keys Held\n${keysheldtext}`
        }
        else {
            keysheldtext = `### Keys Held\nNo keys held at the moment`
        }

        let collated = `${keysheldtext}`;

        if ((userID != inspectuserID) && !headwearrestrictions.canInspect) {
            collated = `*You are blinded and unable to see what keys <@${inspectuserID}> has...*`
        }

        pagecomponents.push(new TextDisplayBuilder().setContent(collated))
    }

    return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] };
}

exports.generateOutfitModal = generateOutfitModal;
exports.outfitEntryModal = outfitEntryModal;
exports.inspectModal = inspectModal;
exports.assignOutfit = assignOutfit;
exports.getOutfits = getOutfits;
exports.restoreOutfit = restoreOutfit;
exports.renameOutfit = renameOutfit;
