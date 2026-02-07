const fs = require("fs");
const path = require("path");
const https = require("https");
const { SlashCommandBuilder, UserSelectMenuBuilder, MessageFlags, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder, ComponentType, SectionBuilder } = require("discord.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { collartypes, getCollarKeyholder, canAccessCollar, getCollar, getCollarTimelock, getCollarName } = require("./collarfunctions.js");
const { getOption } = require("./../functions/configfunctions.js");
const { getChastityKeyholder, getChastity, getChastityTimelock } = require("./../functions/vibefunctions.js");
const { getHeavyBinder, convertheavy, heavytypes } = require("./../functions/heavyfunctions.js");
const { getGagBinder, getMittenBinder, mittentypes, gagtypes } = require("./../functions/gagfunctions.js");
const { getCorsetBinder } = require("./../functions/corsetfunctions.js");
const { getHeadwearBinder, headweartypes } = require("./../functions/headwearfunctions.js");
const { configoptions } = require("./configfunctions.js");
const { canAccessChastity } = require("./vibefunctions.js");
const { wearabletypes } = require("./wearablefunctions.js");
const { getChastityName } = require("./vibefunctions.js");
const { getChastityBra } = require("./vibefunctions.js");
const { getChastityBraTimelock } = require("./vibefunctions.js");
const { getChastityBraName } = require("./vibefunctions.js");

// Generates a consent button which the user will have to agree to.
const consentMessage = (interaction, user) => {
	let outtext = `# Consent to being Bound
<@${process.env.CLIENTID}> is a bot which facilitates restraints in this channel, which have certain effects on you as you wear them, primarily centered around some form of speech impairment. Effects will only apply within this channel. 
Restraints and toys used include the following:
- Gags, Corsets and Toys: Impair and modify speech in various ways
- Mittens and Chastity: Restrict modifying these settings
- Heavy Bondage: Restrict modifying any setting
- Headwear and Apparel: Generally cosmetic, but certain pieces can do inhibiting effects
- Collars: Allow others to perform more significant actions on you.
You can access these commands by typing / to bring up a list of what can be done. 
*Where possible, the bot's design philosophy is **"Consent First,"** meaning that you will have to make an active choice to give up control. Examples of this include mittens, chastity and heavy bondage. Collars can override this, if you wear them. Please use these at your own risk and leverage the **keyholder** and **other controls** presented as necessary.*

**You will *always* be able to speak in ooc (out of context) chat using italics (\\*this would be ungarbled\\*) or underscores.**

Finally, you should review settings found in **/config** concerning effects from vibrators, key giving and effects such as Doll Visors under Misc.

<@${user}>, by clicking the button below, you acknowledge the above risks and considerations and users will be able to play with you using the bot.
-# Button only works for <@${user}>`;
	const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("I Accept").setStyle(ButtonStyle.Success);
	const row = new ActionRowBuilder().addComponents(confirm);

	return { content: outtext, components: [row], withResponse: true };
};

const assignConsent = (user) => {
	if (process.consented == undefined) {
		process.consented = {};
	}
	process.consented[user] = { mainconsent: true };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.consented = true;
};

const getConsent = (user) => {
	if (process.consented == undefined) {
		process.consented = {};
	}
	if (user === process.client.user.id) {
		return { mainconsent: true }; // Lol, trying to gag us.
	}
	return process.consented[user];
};

// check with getConsent, then pipe to await handleConsent and return.
const handleConsent = async (interaction, user) => {
	let testusertarget = user;
	let consentform = consentMessage(interaction, testusertarget);
	const collectorFilter = (i) => i.user.id === testusertarget;
	const response = await interaction.reply(consentform);
	console.log(response);
	try {
		const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 300_000 });
		console.log(confirmation);
		assignConsent(testusertarget);
		await interaction.editReply({ content: `Consent form agreed to by <@${testusertarget}>! Please re-run the command to tie!`, components: [] });
	} catch (err) {
		console.log(err);
		await interaction.editReply({ content: `Consent form was not agreed to for <@${testusertarget}>! Please try to bind again to bring this form back up.`, components: [] });
	}
};

const collarPermModal = (interaction, keyholder, freeuse, collartype) => {
	const modal = new ModalBuilder().setCustomId(`collar_${keyholder.id}_${freeuse ? "f" : "t"}_${collartype}`).setTitle("Collar Permissions");

	let restrictionWarningText = new TextDisplayBuilder();
	let othertext = "others";
	let warningText = `# WARNING 
This restraint is intended to allow **others** to use /chastity, /mittens and /heavy on you!`;
	let keyholderpermissionstext = ``;
	let freeusetext = ``;
	if (keyholder == interaction.user && !freeuse) {
		// Self keyholder, NOT free use
		keyholderpermissionstext = `You have designated yourself as your own keyholder. These settings will only apply when giving keys using **/keys give** to someone.`;
		othertext = "keyholder";
	} else if (keyholder == interaction.user) {
		// Self keyholder, free use
		keyholderpermissionstext = `**(Public Access)** You have designated yourself as your own keyholder, but with public access (Free Use). These settings will apply to others using your collar.`;
		othertext = "keyholder";
	} else if (keyholder != interaction.user && !freeuse) {
		// Other keyholder, NOT free use
		keyholderpermissionstext = `You have chosen ${keyholder} to be your keyholder, and will allow ${getPronouns(keyholder.id, "object")} to play with you.`;
		othertext = getPronouns(keyholder.id, "object");
	} else {
		// Other keyholder, free use
		keyholderpermissionstext = `**(Public Access)** You have chosen ${keyholder} to be your keyholder, and will allow ${getPronouns(keyholder.id, "object")} to play with you, in addition to everyone else as public access.`;
		othertext = getPronouns(keyholder.id, "object");
	}
	warningText = `${warningText}\n\n${keyholderpermissionstext}\n\nCollars may result in unintended situations such as someone holding your chastity key other than you, or you becoming unable to remove restraints because of heavy bondage. __**Use with caution!**__`;

	restrictionWarningText.setContent(warningText);

	const restrictionsInputmitten = new StringSelectMenuBuilder().setCustomId("mitten").setPlaceholder("Select Permission").setRequired(true).addOptions(
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Yes")
			// Description of option
			.setDescription("Allows the use of /mitten on you")
			// Value returned to you in modal submission
			.setValue("mitten_yes"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("No")
			// Description of option
			.setDescription("Disallows the use of /mitten on you")
			// Value returned to you in modal submission
			.setValue("mitten_no"),
	);

	const restrictionsInputchastity = new StringSelectMenuBuilder().setCustomId("chastity").setPlaceholder("Select Permission").setRequired(true).addOptions(
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Yes")
			// Description of option
			.setDescription("Allows the use of /chastity on you")
			// Value returned to you in modal submission
			.setValue("chastity_yes"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("No")
			// Description of option
			.setDescription("Disallows the use of /chastity on you")
			// Value returned to you in modal submission
			.setValue("chastity_no"),
	);

	const restrictionsInputheavy = new StringSelectMenuBuilder().setCustomId("heavy").setPlaceholder("Select Permission").setRequired(true).addOptions(
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Yes")
			// Description of option
			.setDescription("Allows the use of /heavy on you")
			// Value returned to you in modal submission
			.setValue("heavy_yes"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("No")
			// Description of option
			.setDescription("Disallows the use of /heavy on you")
			// Value returned to you in modal submission
			.setValue("heavy_no"),
	);

	const restrictionsInputmask = new StringSelectMenuBuilder().setCustomId("mask").setPlaceholder("Select Permission").setRequired(true).addOptions(
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Yes")
			// Description of option
			.setDescription("Allows the use of /mask on you")
			// Value returned to you in modal submission
			.setValue("mask_yes"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("No")
			// Description of option
			.setDescription("Disallows the use of /mask on you")
			// Value returned to you in modal submission
			.setValue("mask_no"),
	);

	const restrictionsLabelmitten = new LabelBuilder().setLabel(`Allow ${othertext} to mitten you?`).setStringSelectMenuComponent(restrictionsInputmitten);

	const restrictionsLabelchastity = new LabelBuilder().setLabel(`Allow ${othertext} to put you in chastity?`).setStringSelectMenuComponent(restrictionsInputchastity);

	const restrictionsLabelheavy = new LabelBuilder().setLabel(`Allow ${othertext} to put you in heavy bondage?`).setStringSelectMenuComponent(restrictionsInputheavy);

	const restrictionsLabelmask = new LabelBuilder().setLabel(`Allow ${othertext} to put headgear on you?`).setStringSelectMenuComponent(restrictionsInputmask);

	// Gee Golly Discord I would FUCKING LOVE if I could add just... ONE,
	// just one more label element. But no. That would be too easy. Fuck. You.
	/*const isfreeuselabel = new LabelBuilder()
        .setLabel(`(Optional) Public access to your collar?`)
        .setStringSelectMenuComponent(isfreeuse)*/

	/*const collarchoiceLabel = new LabelBuilder()
        .setLabel(`(Optional) What specific collar to wear?`)
        .setStringSelectMenuComponent(collarchoice)*/

	// Add labels to modal
	modal.addTextDisplayComponents(restrictionWarningText).addLabelComponents(restrictionsLabelmitten, restrictionsLabelchastity, restrictionsLabelheavy, restrictionsLabelmask);

	return modal;
};

const timelockChastityModal = (interaction, wearer) => {
	const modal = new ModalBuilder().setCustomId(`timelock_${wearer.id}_chastitybelt`).setTitle("Chastity Belt Timelock");

	let restrictionWarningText = new TextDisplayBuilder();
	let warningText =
		interaction.user.id == wearer.id
			? `# Timelock (Chastity Belt)
This will lock your chastity belt for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`
			: `# Timelock (Chastity Belt)
This will lock ${wearer}'s chastity belt for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`;

	restrictionWarningText.setContent(warningText);

	const timelockamt = new TextInputBuilder().setCustomId("timelockinput").setStyle(TextInputStyle.Short).setPlaceholder("e.g. 10 days 5h 24 mins").setRequired(true);

	const userselect = new UserSelectMenuBuilder().setCustomId("userselection").setPlaceholder("Keyholder...").setMinValues(0).setMaxValues(1).setRequired(false);

	let accesswhileboundoptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Keyholder Only")
			// Description of option
			.setDescription(`Only the keyholder can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} belt`)
			// Value returned to you in modal submission
			.setValue("access_kh"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Nobody")
			// Description of option
			.setDescription(`Nobody, not even you, can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} belt`)
			// Value returned to you in modal submission
			.setValue("access_no"),
	];

	if (getOption(wearer.id, "publicaccess") != "disabled") {
		accesswhileboundoptions.unshift(
			new StringSelectMenuOptionBuilder()
				// Label displayed to user
				.setLabel("Everyone Else")
				// Description of option
				.setDescription(`Everyone except ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`} can vibe and corset ${interaction.user.id == wearer.id ? "you" : `${getPronouns(wearer.id, "object")}`}`)
				// Value returned to you in modal submission
				.setValue("access_others"),
		);
	}

	/*if (interaction.user.id == wearer.id) {
        accesswhileboundoptions.splice(1,1);
    }*/

	const accesswhilebound = new StringSelectMenuBuilder()
		.setCustomId("accesswhilebound")
		.setPlaceholder("Belt Access")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...accesswhileboundoptions);

	let keyholderafteroptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Unlock")
			// Description of option
			.setDescription(`Unlocks ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} belt, letting it fall off`)
			// Value returned to you in modal submission
			.setValue("keyholder_unlock"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Return")
			// Description of option
			.setDescription(`Returns the keys to ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`}`)
			// Value returned to you in modal submission
			.setValue("keyholder_return"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("To Keyholder")
			// Description of option
			.setDescription("Returns keys to the keyholder")
			// Value returned to you in modal submission
			.setValue("keyholder_keyholder"),
	];

	/*if (interaction.user.id == wearer.id) {
        keyholderafteroptions.splice(2,1);
    }*/

	const keyholderafter = new StringSelectMenuBuilder()
		.setCustomId("keyholderafter")
		.setPlaceholder("Action after lock")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...keyholderafteroptions);

	const userselectlabel = new LabelBuilder().setLabel(`Who should hold keys?`).setDescription(`Select a keyholder here...`).setUserSelectMenuComponent(userselect);

	const labeltimelockamt = new LabelBuilder().setLabel(`How long should the timelock be?`).setDescription("This can be a range like `1 hour - 24 hours`").setTextInputComponent(timelockamt);

	const labelaccesswhilebound = new LabelBuilder().setLabel(`Who can access during the timelock?`).setStringSelectMenuComponent(accesswhilebound);

	const labelkeyholderafter = new LabelBuilder().setLabel(`What happens after?`).setStringSelectMenuComponent(keyholderafter);

	// Add labels to modal
	modal.addTextDisplayComponents(restrictionWarningText);
	if (interaction.user.id == wearer.id) modal.addLabelComponents(userselectlabel);
	modal.addLabelComponents(labeltimelockamt, labelaccesswhilebound, labelkeyholderafter);

	return modal;
};

const timelockChastityBraModal = (interaction, wearer) => {
	const modal = new ModalBuilder().setCustomId(`timelock_${wearer.id}_chastitybra`).setTitle("Chastity Bra Timelock");

	let restrictionWarningText = new TextDisplayBuilder();
	let warningText =
		interaction.user.id == wearer.id
			? `# Timelock (Chastity Bra)
This will lock your chastity bra for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`
			: `# Timelock (Chastity Bra)
This will lock ${wearer}'s chastity bra for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`;

	restrictionWarningText.setContent(warningText);

	const timelockamt = new TextInputBuilder().setCustomId("timelockinput").setStyle(TextInputStyle.Short).setPlaceholder("e.g. 10 days 5h 24 mins").setRequired(true);

	const userselect = new UserSelectMenuBuilder().setCustomId("userselection").setPlaceholder("Keyholder...").setMinValues(0).setMaxValues(1).setRequired(false);

	let accesswhileboundoptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Keyholder Only")
			// Description of option
			.setDescription(`Only the keyholder can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} bra`)
			// Value returned to you in modal submission
			.setValue("access_kh"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Nobody")
			// Description of option
			.setDescription(`Nobody, not even you, can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} bra`)
			// Value returned to you in modal submission
			.setValue("access_no"),
	];

	if (getOption(wearer.id, "publicaccess") != "disabled") {
		accesswhileboundoptions.unshift(
			new StringSelectMenuOptionBuilder()
				// Label displayed to user
				.setLabel("Everyone Else")
				// Description of option
				.setDescription(`Everyone except ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`} can do things to ${interaction.user.id == wearer.id ? "you" : `${getPronouns(wearer.id, "object")}`}`)
				// Value returned to you in modal submission
				.setValue("access_others"),
		);
	}

	/*if (interaction.user.id == wearer.id) {
        accesswhileboundoptions.splice(1,1);
    }*/

	const accesswhilebound = new StringSelectMenuBuilder()
		.setCustomId("accesswhilebound")
		.setPlaceholder("Bra Access")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...accesswhileboundoptions);

	let keyholderafteroptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Unlock")
			// Description of option
			.setDescription(`Unlocks ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} bra, letting it fall off`)
			// Value returned to you in modal submission
			.setValue("keyholder_unlock"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Return")
			// Description of option
			.setDescription(`Returns the keys to ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`}`)
			// Value returned to you in modal submission
			.setValue("keyholder_return"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("To Keyholder")
			// Description of option
			.setDescription("Returns keys to the keyholder")
			// Value returned to you in modal submission
			.setValue("keyholder_keyholder"),
	];

	/*if (interaction.user.id == wearer.id) {
        keyholderafteroptions.splice(2,1);
    }*/

	const keyholderafter = new StringSelectMenuBuilder()
		.setCustomId("keyholderafter")
		.setPlaceholder("Action after lock")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...keyholderafteroptions);

	const userselectlabel = new LabelBuilder().setLabel(`Who should hold keys?`).setDescription(`Select a keyholder here...`).setUserSelectMenuComponent(userselect);

	const labeltimelockamt = new LabelBuilder().setLabel(`How long should the timelock be?`).setDescription("This can be a range like `1 hour - 24 hours`").setTextInputComponent(timelockamt);

	const labelaccesswhilebound = new LabelBuilder().setLabel(`Who can access during the timelock?`).setStringSelectMenuComponent(accesswhilebound);

	const labelkeyholderafter = new LabelBuilder().setLabel(`What happens after?`).setStringSelectMenuComponent(keyholderafter);

	// Add labels to modal
	modal.addTextDisplayComponents(restrictionWarningText);
	if (interaction.user.id == wearer.id) modal.addLabelComponents(userselectlabel);
	modal.addLabelComponents(labeltimelockamt, labelaccesswhilebound, labelkeyholderafter);

	return modal;
};

const timelockCollarModal = (interaction, wearer) => {
	const modal = new ModalBuilder().setCustomId(`timelock_${wearer.id}_collar`).setTitle("Collar Timelock");

	let restrictionWarningText = new TextDisplayBuilder();
	let warningText =
		interaction.user.id == wearer.id
			? `# Timelock (Collar)
This will lock your collar for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`
			: `# Timelock (Collar)
This will lock ${wearer}'s collar for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`;

	restrictionWarningText.setContent(warningText);

	const timelockamt = new TextInputBuilder().setCustomId("timelockinput").setStyle(TextInputStyle.Short).setPlaceholder("e.g. 10 days 5h 24 mins").setRequired(true);

	const userselect = new UserSelectMenuBuilder().setCustomId("userselection").setPlaceholder("Keyholder...").setMinValues(0).setMaxValues(1).setRequired(false);

	let accesswhileboundoptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Keyholder Only")
			// Description of option
			.setDescription(`Only the keyholder can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} collar`)
			// Value returned to you in modal submission
			.setValue("access_kh"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Nobody")
			// Description of option
			.setDescription(`Nobody, not even you, can access ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} collar`)
			// Value returned to you in modal submission
			.setValue("access_no"),
	];

	if (getOption(wearer.id, "publicaccess") != "disabled") {
		accesswhileboundoptions.unshift(
			new StringSelectMenuOptionBuilder()
				// Label displayed to user
				.setLabel("Everyone Else")
				// Description of option
				.setDescription(`Everyone except ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`} can collarequip ${interaction.user.id == wearer.id ? "you" : `${getPronouns(wearer.id, "object")}`}`)
				// Value returned to you in modal submission
				.setValue("access_others"),
		);
	}

	/*if (interaction.user.id == wearer.id) {
        accesswhileboundoptions.splice(1,1);
    }*/

	const accesswhilebound = new StringSelectMenuBuilder()
		.setCustomId("accesswhilebound")
		.setPlaceholder("Collar Access")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...accesswhileboundoptions);

	let keyholderafteroptions = [
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Unlock")
			// Description of option
			.setDescription(`Unlocks ${interaction.user.id == wearer.id ? "your" : `${wearer.displayName}'s`} collar, letting it fall off`)
			// Value returned to you in modal submission
			.setValue("keyholder_unlock"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("Return")
			// Description of option
			.setDescription(`Returns the keys to ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`}`)
			// Value returned to you in modal submission
			.setValue("keyholder_return"),
		new StringSelectMenuOptionBuilder()
			// Label displayed to user
			.setLabel("To Keyholder")
			// Description of option
			.setDescription("Returns keys to the keyholder")
			// Value returned to you in modal submission
			.setValue("keyholder_keyholder"),
	];

	/*if (interaction.user.id == wearer.id) {
        keyholderafteroptions.splice(2,1);
    }*/

	const keyholderafter = new StringSelectMenuBuilder()
		.setCustomId("keyholderafter")
		.setPlaceholder("Action after lock")
		.setRequired(true)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions(...keyholderafteroptions);

	const userselectlabel = new LabelBuilder().setLabel(`Who should hold keys?`).setDescription(`Select a keyholder here...`).setUserSelectMenuComponent(userselect);

	const labeltimelockamt = new LabelBuilder().setLabel(`How long should the timelock be?`).setDescription("This can be a range like `1 hour - 24 hours`").setTextInputComponent(timelockamt);

	const labelaccesswhilebound = new LabelBuilder().setLabel(`Who can access during the timelock?`).setStringSelectMenuComponent(accesswhilebound);

	const labelkeyholderafter = new LabelBuilder().setLabel(`What happens after?`).setStringSelectMenuComponent(keyholderafter);

	// Add labels to modal
	modal.addTextDisplayComponents(restrictionWarningText);
	if (interaction.user.id == wearer.id) modal.addLabelComponents(userselectlabel);
	modal.addLabelComponents(labeltimelockamt, labelaccesswhilebound, labelkeyholderafter);

	return modal;
};

function timelockBuildConfirm(interaction, wearer, keyholder, type, access, keyholderAfter, unlockTime1, unlockTime2) {
	const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("Confirm").setStyle(ButtonStyle.Success).setEmoji("✅");
	const reject = new ButtonBuilder().setCustomId("reject").setLabel(`Reject`).setStyle(ButtonStyle.Danger).setEmoji("🛑");
	const row = new ActionRowBuilder().addComponents(reject, confirm);

	console.log(Date.now());
	console.log(unlockTime1);
	console.log(unlockTime2);
	console.log(isNaN(unlockTime1));
	console.log(isNaN(unlockTime2));
	console.log([isNaN(unlockTime1) ? 0 : unlockTime1, isNaN(unlockTime2) ? 0 : unlockTime2]);
	console.log(
		[isNaN(unlockTime1) ? 0 : unlockTime1, isNaN(unlockTime2) ? 0 : unlockTime2].filter((f) => {
			return f > Date.now();
		}),
	);

	let times = [isNaN(unlockTime1) ? 0 : unlockTime1, isNaN(unlockTime2) ? 0 : unlockTime2]
		.filter((f) => {
			return f > Date.now();
		})
		.sort((a, b) => {
			return a - b;
		});
	if (times.length == 0) {
		// WE DONT HAVE A VALID TIME LOCK VALUE, TELL THE USER THEYRE SILLY LOL
		return { modal: { content: `Something went wrong making your timelock. Either you (somehow) supplied values in the past or none. Try again.`, flags: MessageFlags.Ephemeral } };
	}

	let devicetext = "chastity belt";
	if (type == "chastitybra") {
		devicetext = "chastity bra";
	}
	if (type == "collar") {
		devicetext = "collar";
	}

	let timestring = `<t:${(times[0] / 1000) | 0}:f>`;
	let unlockTime = times[0];
	if (times.length == 2) {
		timestring = `<t:${(times[0] / 1000) | 0}:f> - <t:${(times[1] / 1000) | 0}:f>`;
		unlockTime = times[0] + Math.floor((times[1] - times[0]) * Math.random());
	}

	let accesstodevice = `Others will be able to play with ${interaction.user.id == wearer ? "your" : `<@${wearer}>'s`} ${devicetext}.\n`;
	if (access == 1) {
		accesstodevice = `${interaction.user.id == wearer ? `<@${keyholder}>` : `Only you`} will be able to play with ${interaction.user.id == wearer ? "your" : `<@${wearer}>'s`} ${devicetext}.\n`;
	}
	if (access == 2) {
		accesstodevice = `Nobody will be able to touch ${interaction.user.id == wearer ? "your" : `<@${wearer}>'s`} ${devicetext}.\n`;
	}

	let keyholderafter = `${interaction.user.id == wearer ? "Your" : `<@${wearer}>'s`} ${devicetext} will unlock at the end of the timer.\n`;
	if (keyholderAfter == 1) {
		keyholderafter = `${interaction.user.id == wearer ? "You" : `<@${wearer}>`} will receive the keys afterwards.\n`;
	}
	if (keyholderAfter == 2) {
		keyholderafter = `${interaction.user.id == wearer ? "Your keyholder" : `You`} will retain the keys afterwards.\n`;
	}

	let outtext = `# Timelock\nConfirm locking ${interaction.user.id == wearer ? `your ${devicetext}` : `<@${wearer}>'s ${devicetext}`} until ${timestring}?\n${accesstodevice}${keyholderafter}\n-# Note: Frustration may cause the actual unlock time to be later`;

	return { modal: { content: outtext, components: [row], flags: MessageFlags.Ephemeral, withResponse: true }, unlockTime: unlockTime };
}

// Assigns images to the process variable memes. Called once during index.js startup.
// Is this needed? Heck no. But I want it. For the Absolute Cinema meme.
// The feature creep has really sunk in hasn't it.
// This will get posted in the server because of my comments won't it?
// Well. Hi everyone!
// I hope you're well.
// Enjoy your Absolute Cinemeow.
const assignMemeImages = () => {
	// Grab all the image files from the images directory
	const memeimages = [];
	const imagespath = path.join(__dirname, "..", "memes");
	const imagefiles = fs.readdirSync(imagespath);
	imagefiles.forEach((i) => {
		if (i.endsWith(".png")) {
			memeimages.push({ name: i.slice(0, -4), value: i.slice(0, -4) });
		}
	});
	process.memes = memeimages;
};

// Returns a blocking function which can be awaited
// Will immediately resolve if the user allows everyone to remove bondage
// else, will prompt them. Will resolve false if rejected.
function checkBondageRemoval(userID, targetID, type) {
	let useroption = getOption(targetID, "removebondage");

	console.log(`PERMS`);
	console.log(useroption == "all_binder_and_keyholder");
	console.log(canAccessCollar(userID, targetID, true));
	console.log(useroption == "all_binder_and_keyholder" && (canAccessChastity(targetID, userID, true).access || canAccessCollar(targetID, userID, true).access));

	// Return true immediately if it's accepted without question
	if (useroption == "accept") {
		return true;
	}

	// Return true immediately if the targetID and userID are the same
	// The user probably wants to remove their own stuff!
	if (userID == targetID) {
		return true;
	}

	// If keyholder and keyholders allowed, return true
	if (useroption == "all_binder_and_keyholder" && (canAccessChastity(targetID, userID, true).access || canAccessCollar(targetID, userID, true).access)) {
		return true;
	}

	// if binder or KH, return true if target ID is origbinder
	if (useroption == "all_binder" || useroption == "all_binder_and_keyholder") {
		let restraintobject;
		if (type == "heavy") {
			restraintobject = getHeavyBinder(targetID);
		}
		if (type == "gag") {
			restraintobject = getGagBinder(targetID);
		}
		if (type == "mitten") {
			restraintobject = getMittenBinder(targetID);
		}
		if (type == "corset") {
			restraintobject = getCorsetBinder(targetID);
		}
		if (type == "headwear") {
			restraintobject = getHeadwearBinder(targetID);
		}
		// if (type == "vibe") { restraintobject = getVibe(targetID) }

		if (restraintobject) {
			if (restraintobject == userID) {
				return true;
			}
		}
	}

	return false;
}

async function handleBondageRemoval(user, target, type, change = false) {
	return new Promise(async (res, rej) => {
		try {
			let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
			let dmchannel = await target.createDM();
			await dmchannel.send({ content: `${user} would like to ${change ? "change" : "remove"} your ${type}. Do you want to allow this action?`, components: [new ActionRowBuilder().addComponents(...buttons)] }).then((mess) => {
				// Create a collector for up to 5 minutes
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${user} is permitted to ${change ? `change your ${type}` : `take your ${type} off`}!`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${user} is blocked from ${change ? `changing your ${type}` : `taking your ${type} off`}!`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed out - ${user} is blocked from ${change ? `changing your ${type}` : `taking your ${type} off`}!`);
						});
						rej(true);
					}
				});
			});
		} catch (err) {
			console.log("Error sending message, auto reject it.");
			rej("NoDM");
		}
	}); /*.then(
        (res) => {
            console.log("We got ALLOWED")
            return true
    }, 
        (rej) => {
            console.log("We got REJECTED")
            return false
    })*/
}

async function handleExtremeRestraint(user, target, type, restraint) {
	return new Promise(async (res, rej) => {
		let hasOption = getOption(target.id, `extreme-${type}-${restraint}`);
		if (!hasOption || hasOption == "Enabled" || (hasOption == "PromptOthers" && user.id == target.id)) {
			res(true);
			return;
		} // Either it's Enabled, set to Prompt Others if on self, or it doesn't exist. Go away.

		if (hasOption == "Disabled") {
			rej("Disabled");
			return;
		} // NOPE

		let restraintfullname = ``;
		switch (type) {
			case "heavy":
				restraintfullname = convertheavy(restraint);
				break;
			case "gag":
				restraintfullname = process.gagtypes.find((f) => f.value == restraint)?.name;
				break;
			default:
				console.log(`Could not find a restraint by that type.`);
				rej("Error");
				break;
		}

		// We need to ASK
		let extrahelptext = configoptions["Extreme"][`extreme-${type}-${restraint}`]?.prompttext ?? "Something went wrong retrieving this text.";
		let prompttext = `## ${user} would like to place a ${type} restraint on you: **${restraintfullname}**\n***This is considered an __extreme__ restraint and comes with the following warning label:***\n\n${extrahelptext}\n\nDo you wish to allow this action?`;
		if (user.id == target.id) {
			prompttext = `## You are attempting to wear the following restraint: **${restraintfullname}**\n***This is considered an __extreme__ restraint and comes with the following warning label:***\n\n${extrahelptext}\n\nDo you wish to allow this action?`;
		}
		let buttons = [new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)];
		let dmchannel = await target.createDM();
		await dmchannel
			.send({ content: `${prompttext}`, components: [new ActionRowBuilder().addComponents(...buttons)] })
			.then((mess) => {
				// Create a collector for up to 5 minutes
				const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

				collector.on("collect", async (i) => {
					console.log(i);
					if (i.customId == "acceptButton") {
						await mess.delete().then(() => {
							i.reply(`Confirmed - ${restraintfullname} will be equipped on you.`);
						});
						res(true);
					} else {
						await mess.delete().then(() => {
							i.reply(`Rejected - ${restraintfullname} will NOT be equipped on you.`);
						});
						rej(true);
					}
				});

				collector.on("end", async (collected) => {
					// timed out
					if (collected.length == 0) {
						await mess.delete().then(() => {
							i.reply(`Timed out - ${restraintfullname} will NOT be equipped on you.`);
						});
						rej(true);
					}
				});
			})
			.catch((err) => {
				console.log(`Error sending message for Extreme Restraint ${type} to ${target}.`);
				rej("NoDM");
			});
	});
}

async function generateHelpModal(userid, section, page) {
    let pagecomponents = [];
    // This should only ever exist but lol
    // If we returned an array, spread it. 
    if (process.helpmodals && process.helpmodals[section]) {
        let output = await process.helpmodals[section](userid, page);
        if (Array.isArray(output)) { pagecomponents.push(...output) }
        else { pagecomponents.push(output) }
    }
    // Now we should take every section listed in process.helpmodals and make a LIST!
    // Create Menu Selector
    let pagemenutext = section;
    // Construct the menu selector
    let menupageoptions = new StringSelectMenuBuilder().setCustomId("help_SELECTMENU_0");

    let menupageoptionsarr = [];
    Object.keys(process.helpmodals).forEach((k) => {
        let opt = new StringSelectMenuOptionBuilder().setLabel(k).setValue(`help_SELECTMENU_${k}`);
        menupageoptionsarr.push(opt);
    });

    menupageoptions.setPlaceholder(pagemenutext);

    // Add all of the available options we have for the menu selection
    menupageoptions.addOptions(...menupageoptionsarr);

    pagecomponents.push(new ActionRowBuilder().addComponents(menupageoptions));

    return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] }
}

function generateListTexts() {
    const restraints = {
        Heavy: heavytypes.sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `Denial coefficient: ${heavy.denialCoefficient}` })),
        Mitten: mittentypes.sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "" })),
        Gag: Object.entries(process.gagtypes).filter((f) => !f[1].hidden).map((f) => f[1]).sort((a, b) => a.choicename.localeCompare(b.choicename)).map((heavy) => ({ name: heavy.choicename, value: "" })),
        "Chastity Belt": Object.entries(process.chastitytypes).filter((f) => f[1].category == "Chastity Belt").map((f) => f[1]).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `` })),
        "Chastity Bra": Object.entries(process.chastitytypes).filter((f) => f[1].category == "Chastity Bra").map((f) => f[1]).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `` })),
        Corset: Object.entries(process.corsettypes).map((f) => f[1]).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `` })),
        Mask: headweartypes.sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: heavy.blockinspect || heavy.blockemote ? `Restricts: ${heavy.blockinspect ? `Inspect, ` : ``}${heavy.blockemote ? `Emote, ` : ``}`.slice(0, -2) : `` })),
        Collar: collartypes.sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "" })),
        Toys: Object.entries(process.toytypes).map((f) => f[1]).sort((a, b) => a.toyname.localeCompare(b.toyname)).map((heavy) => ({ name: heavy.toyname, value: heavy.category })),
        Wearable: wearabletypes.filter((f) => (f.name.length > 0)).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: heavy.colorable ? `Colorable` : `` })),
    };
    process.listtexts = restraints;
}

// Generates a message box with buttons to give keys for a user to a target, and listing all valid keys along with current cloned keyholders.
async function generateKeyGivingModal(userid, weareridin, targetidin, keybitin) {
    let wearerid = weareridin ?? userid;
    let targetid = targetidin ?? userid;
    let keybit = keybitin ?? "0000"; // first character is give/clone, second, third and fourth are chastity, chastity bra and collar.
    let giveclone = keybit.charAt(0) == "0" ? "give" : "clone"
    let giveclonecap = `${giveclone.slice(0,1).toUpperCase()}${giveclone.slice(1)}`

    // Reset any keybits we became ineligible for
    if ((getChastity(wearerid)?.keyholder != userid) || (getChastity(wearerid)?.clonedKeyholders && getChastity(wearerid)?.clonedKeyholders.includes(targetid)) || (getChastity(wearerid)?.fumbled)) {
        keybit = `${keybit.slice(0,1)}0${keybit.slice(2)}`
    }
    if ((getChastityBra(wearerid)?.keyholder != userid) || (getChastityBra(wearerid)?.clonedKeyholders && getChastityBra(wearerid)?.clonedKeyholders.includes(targetid)) || (getChastityBra(wearerid)?.fumbled)) {
        keybit = `${keybit.slice(0,2)}0${keybit.slice(3)}`
    }
    if ((getCollar(wearerid)?.keyholder != userid) || (getCollar(wearerid)?.clonedKeyholders && getCollar(wearerid)?.clonedKeyholders.includes(targetid)) || (getCollar(wearerid)?.fumbled)) {
        keybit = `${keybit.slice(0,3)}0`
    }

    // Generate the wearer selector
    let pagecomponents = [new TextDisplayBuilder().setContent(`**Wearer to ${giveclone} keys for...**`)]
    pagecomponents.push(new ActionRowBuilder().addComponents(new UserSelectMenuBuilder()
        .setCustomId(`key_select_wearerid_${wearerid}_${targetid}_0000`)
        .setMaxValues(1)
        .setDefaultUsers(wearerid)
        .setPlaceholder("Select a wearer...")
    ))

    // Give or Clone selector
    let giveclonebuttons = [
		// Overview
		new ButtonBuilder()
			.setCustomId(`key_mode_give_${wearerid}_${targetid}_${keybit}`)
			.setLabel("Give")
			.setStyle(giveclone == "give" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(giveclone == "give"),
		// Restraints
		new ButtonBuilder()
			.setCustomId(`key_mode_clone_${wearerid}_${targetid}_${keybit}`)
			.setLabel("Clone")
			.setStyle(giveclone == "clone" ? ButtonStyle.Primary : ButtonStyle.Secondary)
			.setDisabled(giveclone == "clone"),
	];
	pagecomponents.push(new ActionRowBuilder().addComponents(...giveclonebuttons));
    
    // Restraint components!
    let restraintcomponents = [];
    if (getChastity(wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getChastity(wearerid).keyholder}>`
        if (getChastityTimelock(wearerid)) { keyholdertext = `Timelocked` }
        if (getChastity(wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getChastity(wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getChastity(wearerid).clonedKeyholders && getChastity(wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getChastity(wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getChastity(wearerid).keyholder == userid) || getChastity(wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getChastity(wearerid).keyholder != userid) || (getChastity(wearerid).clonedKeyholders && getChastity(wearerid).clonedKeyholders.includes(targetid)) || (getChastity(wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.chastity} Chastity - ${getChastityName(wearerid, getChastity(wearerid).chastitytype) ?? "Standard Chastity Belt"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
            .setButtonAccessory((button) =>
                button
                    .setCustomId(`key_key_chastity_${wearerid}_${targetid}_${keybitin}`)
                    .setLabel(`${keybit.charAt(1) == "0" ? "Do not " : ""}${giveclonecap}`)
                    .setStyle(keybit.charAt(1) == "0" ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setDisabled(blocked),
            );
        restraintcomponents.push(buttonsection)
    }
    if (getChastityBra(wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getChastityBra(wearerid).keyholder}>`
        if (getChastityBraTimelock(wearerid)) { keyholdertext = `Timelocked` }
        if (getChastityBra(wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getChastityBra(wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getChastityBra(wearerid).clonedKeyholders && getChastityBra(wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getChastityBra(wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getChastityBra(wearerid).keyholder == userid) || getChastityBra(wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getChastityBra(wearerid).keyholder != userid) || (getChastityBra(wearerid).clonedKeyholders && getChastityBra(wearerid).clonedKeyholders.includes(targetid)) || (getChastityBra(wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.chastitybra} Chastity Bra - ${getChastityBraName(wearerid, getChastityBra(wearerid).chastitytype) ?? "Standard Chastity Bra"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
            .setButtonAccessory((button) =>
                button
                    .setCustomId(`key_key_chastitybra_${wearerid}_${targetid}_${keybitin}`)
                    .setLabel(`${keybit.charAt(2) == "0" ? "Do not " : ""}${giveclonecap}`)
                    .setStyle(keybit.charAt(2) == "0" ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setDisabled(blocked),
            );
        restraintcomponents.push(buttonsection)
    }
    if (getCollar(wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getCollar(wearerid).keyholder}>`
        if (getCollarTimelock(wearerid)) { keyholdertext = `Timelocked` }
        if (getCollar(wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getCollar(wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getCollar(wearerid).clonedKeyholders && getCollar(wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getCollar(wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getCollar(wearerid).keyholder == userid) || getCollar(wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getCollar(wearerid).keyholder != userid) || (getCollar(wearerid).clonedKeyholders && getCollar(wearerid).clonedKeyholders.includes(targetid)) || (getCollar(wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.collar} Collar - ${getCollarName(wearerid, getCollar(wearerid).chastitytype) ?? "Leather Collar"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
            .setButtonAccessory((button) =>
                button
                    .setCustomId(`key_key_collar_${wearerid}_${targetid}_${keybitin}`)
                    .setLabel(`${keybit.charAt(3) == "0" ? "Do not " : ""}${giveclonecap}`)
                    .setStyle(keybit.charAt(3) == "0" ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setDisabled(blocked),
            );
        restraintcomponents.push(buttonsection)
    }

    // If they're unrestrained (for some reason), give the interactor a helpful message saying so.
    if (restraintcomponents.length == 0) {
        restraintcomponents.push(new TextDisplayBuilder().setContent(`‎\n***<@${wearerid}> is not wearing any keyed restraints...***\n‎`))
    }
    pagecomponents.push(...restraintcomponents)

    // Target selector. 
    pagecomponents.push(new TextDisplayBuilder().setContent(`**Target to ${giveclone} keys to...**`))
    pagecomponents.push(new ActionRowBuilder().addComponents(new UserSelectMenuBuilder()
        .setCustomId(`key_select_targetid_${wearerid}_${targetid}_${keybit}`)
        .setMaxValues(1)
        .setDefaultUsers(targetid)
        .setPlaceholder("Select a target...")
    ))

    // Confirmation text
    if (keybit.slice(1).search(1) > -1) {
        let outtext = ``;
        let outend = ``;
        let usertext = (wearerid == userid) ? `your` : `<@${wearerid}>'s`
        if (keybit.charAt(0) == "0") {
            // Give
            outtext = `Giving keys for ${usertext} `
            outend = ` to <@${targetid}>. \n⚠️ *You will lose access to these restraints and cloned keys will be destroyed.*`
        }
        else {
            // Clone
            outtext = `Cloning keys for <@${wearerid}>'s `
            outend = ` and giving them to <@${targetid}>.`
        }
        if (keybit.charAt(1) == "1") {
            outtext = `${outtext}${process.emojis.chastity}**chastity belt**, `
        }
        if (keybit.charAt(2) == "1") {
            outtext = `${outtext}${process.emojis.chastitybra}**chastity bra**, `
        }
        if (keybit.charAt(3) == "1") {
            outtext = `${outtext}${process.emojis.collar}**collar**, `
        }
        outtext = `${outtext.slice(0, -2)}${outend}`
        
        pagecomponents.push(new TextDisplayBuilder().setContent(outtext))
    }

    // Determine if we can give the keys. The rules are, if it's SELF or if they auto accepted, it should say give/clone
    // otherwise, it should say request. 
    let allowedtext = `Request to ${giveclonecap} Keys`
    if (((getOption(wearerid, "keygiving") == "auto") && (keybit.charAt(0) == "0")) ||
        ((getOption(wearerid, "keycloning") == "auto") && (keybit.charAt(0) == "1"))) {
        allowedtext = `${giveclonecap} ${getPronouns(wearerid, "possessiveDeterminer")} Keys`
    }
    if ((userid == wearerid) || (wearerid == targetid)) {
        // This is us, we are probably okay with what we're about to do. 
        allowedtext = `${giveclonecap} Your Keys`
    }

    // Determine if the wearer blocked keygiving. If they did, no.
    let allowedbool = false;
    if (((getOption(wearerid, "keygiving") == "disabled") && (keybit.charAt(0) == "0")) ||
        ((getOption(wearerid, "keycloning") == "disabled") && (keybit.charAt(0) == "1"))) {
        allowedbool = true;
    }
    if ((keybit.slice(1).search(1) == -1)) {
        allowedbool = true;
    }
    
    // Confirm Button
    let confirmbutton = [
		// Overview
		new ButtonBuilder()
			.setCustomId(`key_confirm_forreal_${wearerid}_${targetid}_${keybit}`)
			.setLabel(allowedtext)
			.setStyle(!allowedbool ? ButtonStyle.Success : ButtonStyle.Secondary)
			.setDisabled(allowedbool),
	];
	pagecomponents.push(new ActionRowBuilder().addComponents(...confirmbutton));

    return { components: pagecomponents, flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] };
}

exports.consentMessage = consentMessage;
exports.getConsent = getConsent;
exports.handleConsent = handleConsent;
exports.collarPermModal = collarPermModal;
exports.timelockChastityModal = timelockChastityModal;
exports.timelockChastityBraModal = timelockChastityBraModal;
exports.timelockCollarModal = timelockCollarModal;
exports.timelockBuildConfirm = timelockBuildConfirm;

exports.handleBondageRemoval = handleBondageRemoval;
exports.checkBondageRemoval = checkBondageRemoval;
exports.handleExtremeRestraint = handleExtremeRestraint;

exports.generateHelpModal = generateHelpModal;

exports.generateKeyGivingModal = generateKeyGivingModal;

exports.assignMemeImages = assignMemeImages;

exports.generateListTexts = generateListTexts;