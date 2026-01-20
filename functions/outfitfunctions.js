const { ActionRowBuilder } = require("@discordjs/builders");
const { StringSelectMenuOptionBuilder } = require("@discordjs/builders");
const { StringSelectMenuBuilder } = require("@discordjs/builders");
const { ButtonBuilder } = require("@discordjs/builders");
const { TextDisplayBuilder, MessageFlags, ButtonStyle, ActionRow, SectionBuilder, LabelBuilder, TextInputStyle } = require("discord.js");
const { getWearable, getLockedWearable, getWearableName } = require("./wearablefunctions");
const { getGags, getMitten, getGag, convertGagText, getMittenName } = require("./gagfunctions");
const { getCollar, canAccessCollar, getCollarName, getCollarTimelock } = require("./collarfunctions");
const { getCorset } = require("./corsetfunctions");
const { getChastity, getVibe, getChastityTimelock } = require("./vibefunctions");
const { getChastityBra } = require("./vibefunctions");
const { getHeadwear, getHeadwearName } = require("./headwearfunctions");
const { getHeavy, convertheavy } = require("./heavyfunctions");
const { canAccessChastity } = require("./vibefunctions");
const { canAccessChastityBra } = require("./vibefunctions");
const { getChastityName } = require("./vibefunctions");
const { getChastityBraTimelock } = require("./vibefunctions");
const { getChastityBraName } = require("./vibefunctions");
const { ModalBuilder } = require("@discordjs/builders");
const { TextInputBuilder } = require("@discordjs/builders");

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
						textdisplay = `${textdisplay}<:Gag:1073495437635506216> Gag: ${emoji}, `;
					}
					if (k == "mitten") {
						let emoji = getHeavy(userID) || getMitten(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:mittens:1452425463757803783> Mitten: ${emoji}, `;
					}
					if (k == "headwear") {
						let emoji = getHeavy(userID) || getMitten(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}👤 Headwear: ${emoji}, `;
					}
					if (k == "collar") {
						let emoji = getHeavy(userID) || (!canAccessCollar(userID, userID, true).access && canAccessCollar(userID, userID, true).hascollar) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:collar:1449984183261986939> Collar: ${emoji}, `;
					}
					if (k == "heavy") {
						let emoji = getHeavy(userID) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:Armbinder:1073495590656286760> Heavy: ${emoji}, `;
					}
					if (k == "corset") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:corset:1451126998192881684> Corset: ${emoji}, `;
					}
					if (k == "chastity") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:Chastity:1073495208861380629> Chastity: ${emoji}, `;
					}
					if (k == "chastitybra") {
						let emoji = getHeavy(userID) || (!canAccessChastityBra(userID, userID, true).access && canAccessChastityBra(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:chastitybra:1457992137164718152> Chastity Bra: ${emoji}, `;
					}
					if (k == "vibe") {
						let emoji = getHeavy(userID) || (!canAccessChastity(userID, userID, true).access && canAccessChastity(userID, userID, true).hasbelt) ? "⚠️" : "✅";
						textdisplay = `${textdisplay}<:MagicWand:1073504682540011520> Vibrator: ${emoji}, `;
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

exports.generateOutfitModal = generateOutfitModal;
exports.outfitEntryModal = outfitEntryModal;
exports.assignOutfit = assignOutfit;
exports.getOutfits = getOutfits;
exports.restoreOutfit = restoreOutfit;
exports.renameOutfit = renameOutfit;
