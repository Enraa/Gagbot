const fs = require("fs");
const path = require("path");
const https = require("https");
const { SlashCommandBuilder, UserSelectMenuBuilder, MessageFlags, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder, ComponentType, SectionBuilder, CheckboxGroupBuilder, User } = require("discord.js");
const { collartypes } = require("./collarfunctions.js");
const { mittentypes } = require("./../functions/gagfunctions.js");
const { wearabletypes } = require("./wearablefunctions.js");
const { assignConsent } = require("./setters/config/assignConsent.js");
const { getPronouns } = require("./getters/config/getPronouns.js");
const { getOption } = require("./getters/config/getOption.js");
const { canAccessChastity } = require("./getters/chastity/canAccessChastity.js");
const { canAccessCollar } = require("./getters/collar/canAccessCollar.js");
const { getHeavyBinder } = require("./getters/heavy/getHeavyBinder.js");
const { getGagBinder } = require("./getters/gag/getGagBinder.js");
const { getMittenBinder } = require("./getters/mitten/getMittenBinder.js");
const { getCorsetBinder } = require("./getters/corset/getCorsetBinder.js");
const { getHeadwearBinder } = require("./getters/headwear/getHeadwearBinder.js");
const { getCollarName } = require("./getters/collar/getCollarName.js");
const { getHeavyName } = require("./getters/heavy/getHeavyName.js");
const { getCollar } = require("./getters/collar/getCollar.js");
const { getHeadwearName } = require("./getters/headwear/getHeadwearName.js");
const { getMittenName } = require("./getters/mitten/getMittenName.js");
const { getBaseChastity } = require("./getters/chastity/getBaseChastity.js");
const { heavytypes } = require("./heavyfunctions.js");
const { getChastity } = require("./getters/chastity/getChastity.js");
const { getChastityBra } = require("./getters/chastity/getChastityBra.js");
const { getChastityTimelock } = require("./getters/chastity/getChastityTimelock.js");
const { getChastityBraTimelock } = require("./getters/chastity/getChastityBraTimelock.js");
const { getCollarTimelock } = require("./getters/collar/getCollarTimelock.js");
const { getHeavyList } = require("./getters/heavy/getHeavyList.js");
const { getMitten } = require("./getters/mitten/getMitten.js");
const { getHeadwear } = require("./getters/headwear/getHeadwear.js");
const { getGags } = require("./getters/gag/getGags.js");
const { getWearable } = require("./getters/wearable/getWearable.js");
const { getToys } = require("./getters/toy/getToys.js");
const { configoptions } = require("../lists/configoptions.js");
const { getChastityName } = require("./getters/chastity/getChastityName.js");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam.js");
const { canAccessChastityBra } = require("./getters/chastity/canAccessChastityBra.js");
const { getChastityBraName } = require("./getters/chastity/getChastityBraName.js");

// Generates a consent button which the user will have to agree to.
const consentMessage = (interaction, user) => {
	let outtext = `# Consent to being Bound
<@${process.client.user.id}> is a bot which facilitates restraints in this channel, which have certain effects on you as you wear them, primarily centered around some form of speech impairment. Effects will only apply within this channel. 
Restraints and toys used include the following:
- Gags, Corsets and Toys: Impair and modify speech in various ways
- Mittens and Chastity: Restrict modifying these settings
- Heavy Bondage: Restrict modifying any setting
- Headwear and Apparel: Generally cosmetic, but certain pieces can do inhibiting effects
- Collars: Allow others to perform more significant actions on you.
You can access these commands by typing / to bring up a list of what can be done. 
*Where possible, the bot's design philosophy is **"Consent First,"** meaning that you will have to make an active choice to give up control. Examples of this include mittens, chastity and heavy bondage. Collars can override this, if you wear them. Please use these at your own risk and leverage the **keyholder** and **other controls** presented as necessary.*

**You will *always* be able to speak in ooc (out of context) chat using italics (\\*this would be ungarbled\\*) or underscores.** Messages are recorded whenever the bot modifies them for editing via Apps -> Gagbot -> Edit Messages. This can be modified in **/config** under General.

Finally, you should review settings found in **/config** concerning effects from vibrators, key giving and effects such as Doll Visors under Misc.

<@${user}>, by clicking the button below, you acknowledge the above risks and considerations and users will be able to play with you using the bot.
-# Button only works for <@${user}>`;
	const confirm = new ButtonBuilder().setCustomId("confirm").setLabel("I Accept").setStyle(ButtonStyle.Success);
	const row = new ActionRowBuilder().addComponents(confirm);

	return { content: outtext, components: [row], withResponse: true };
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
		assignConsent(interaction.guildId, testusertarget);
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
This restraint is intended to allow **others** to use **/mitten**, **/chastity**, **/heavy** and **/mask** on you without prompting for consent!`;
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
		keyholderpermissionstext = `You have chosen ${keyholder} to be your keyholder, and will allow ${getPronouns(interaction.guildId, keyholder.id, "object")} to play with you.`;
		othertext = getPronouns(interaction.guildId, keyholder.id, "object");
	} else {
		// Other keyholder, free use
		keyholderpermissionstext = `**(Public Access)** You have chosen ${keyholder} to be your keyholder, and will allow ${getPronouns(interaction.guildId, keyholder.id, "object")} to play with you, in addition to everyone else as public access.`;
		othertext = getPronouns(interaction.guildId, keyholder.id, "object");
	}
	warningText = `${warningText}\n\nCollars may result in unintended situations such as someone holding your chastity key other than you, or you becoming unable to remove restraints because of heavy bondage.\n\n-# **NOTE:** Extreme Restraints will still prompt as selected in **/config**`;

	restrictionWarningText.setContent(warningText);

    let keyholderselector = new UserSelectMenuBuilder()
        .setCustomId(`keyholderselection`)
        .setPlaceholder(`Designate a keyholder...`)
        .setMinValues(1)
        .setMaxValues(1)

    if (keyholder != undefined) {
        keyholderselector.setDefaultUsers(keyholder.id);
    }

    const keyholderuserlabel = new LabelBuilder().setLabel(`Select a keyholder`).setDescription(`Only this user can unlock your collar.`).setUserSelectMenuComponent(keyholderselector)

    let checkboxGroup = new CheckboxGroupBuilder()
        .setCustomId('permissionscheckboxgroup')
        .setOptions([
            { label: `Mittens`, value: 'mitten', description: "Allows the use of /mitten on you" },
            { label: `Chastity`, value: 'chastity', description: "Allows the use of /chastity on you" },
            { label: `Heavy`, value: 'heavy', description: "Allows the use of /heavy on you" },
            { label: `Mask`, value: 'mask', description: "Allows the use of /mask on you" },
        ])
        .setRequired(false)
        .setMinValues(0)

    const restrictionscheckboxlabel = new LabelBuilder().setLabel(`Select Actions`).setDescription(`The keyholder will be able to do these without prompting.`).setCheckboxGroupComponent(checkboxGroup)

    // If they have the option for public access enabled
    let freeuseselector = new StringSelectMenuBuilder()
        .setCustomId(`freeuseselection`)
        .setPlaceholder(`Select...`)
        .addOptions(
            new StringSelectMenuOptionBuilder().setLabel('Yes').setValue('freeuse_yes'),
            new StringSelectMenuOptionBuilder().setLabel('No').setValue('freeuse_no')
        )
        .setRequired(false);

    const freeuselabel = new LabelBuilder().setLabel(`Select Public Access`).setDescription(`Allow anyone to perform these actions (Free Use):`).setStringSelectMenuComponent(freeuseselector)

    // If they don't, create a text label for that.
    let freeusenotenabled = new TextDisplayBuilder().setContent(`*You do not have **Public Access** enabled in **/config** and cannot set your collar to Free Use.*`)

	// Add labels to modal
	modal.addTextDisplayComponents(restrictionWarningText).addLabelComponents(keyholderuserlabel, restrictionscheckboxlabel)

    if (getOption(interaction.guildId, interaction.user.id, "publicaccess") != "enabled") {
        // They have NOT enabled free use. 
        modal.addTextDisplayComponents(freeusenotenabled)
    }
    else {
        modal.addLabelComponents(freeuselabel);
    }

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

	if (getOption(interaction.guildId, wearer.id, "publicaccess") != "disabled") {
		accesswhileboundoptions.unshift(
			new StringSelectMenuOptionBuilder()
				// Label displayed to user
				.setLabel("Everyone Else")
				// Description of option
				.setDescription(`Everyone except ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`} can vibe and corset ${interaction.user.id == wearer.id ? "you" : `${getPronouns(interaction.guildId, wearer.id, "object")}`}`)
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

	if (getOption(interaction.guildId, wearer.id, "publicaccess") != "disabled") {
		accesswhileboundoptions.unshift(
			new StringSelectMenuOptionBuilder()
				// Label displayed to user
				.setLabel("Everyone Else")
				// Description of option
				.setDescription(`Everyone except ${interaction.user.id == wearer.id ? "you" : `${wearer.displayName}`} can do things to ${interaction.user.id == wearer.id ? "you" : `${getPronouns(interaction.guildId, wearer.id, "object")}`}`)
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

	if (getOption(interaction.guildId, wearer.id, "publicaccess") != "disabled") {
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
function checkBondageRemoval(serverID, userID, targetID, type, item) {
	let useroption = getOption(serverID, targetID, "removebondage");

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
	if (useroption == "all_binder_and_keyholder" && (canAccessChastity(serverID, targetID, userID, true).access || canAccessChastityBra(serverID, targetID, userID, true).access || canAccessCollar(serverID, targetID, userID, true).access)) {
		return true;
	}

	// if binder or KH, return true if target ID is origbinder
	if (useroption == "all_binder" || useroption == "all_binder_and_keyholder") {
		let restraintobject;
		if (type == "heavy") {
			restraintobject = getHeavyBinder(serverID, targetID, type);
		}
		if (type == "gag") {
			restraintobject = getGagBinder(serverID, targetID, item);
		}
		if (type == "mitten") {
			restraintobject = getMittenBinder(serverID, targetID);
		}
		if (type == "corset") {
			restraintobject = getCorsetBinder(serverID, targetID);
		}
		if (type == "headwear") {
			restraintobject = getHeadwearBinder(serverID, targetID, item);
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

async function handleBondageRemoval(serverID, user, target, type, change = false) {
    traceFirstParam(arguments[0]);
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

async function handleExtremeRestraint(serverID, user, target, type, restraint) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
        // cull out multiple styles of the same kind, this is used for things like Gag Harness to group multiple headpieces.
        let origrestraint = restraint
        let extrahelptextoverride;
        // Gag Harness
        if (restraint && restraint.startsWith("gagharness")) { 
            extrahelptextoverride = configoptions["Extreme"][`extreme-mask-gagharness`]?.prompttext
            restraint = "gagharness"
        }
		let hasOption = getOption(serverID, target.id, `extreme-${type}-${restraint}`);
		if (!hasOption || hasOption == "Enabled" || (hasOption == "PromptOthers" && user.id == target.id)) {
			res(true);
			return;
		} // Either it's Enabled, set to Prompt Others if on self, or it doesn't exist. Go away.

		if (hasOption == "Disabled") {
			rej("Disabled");
			return;
		} // NOPE

        // Code Compatibility. 
        restraint = origrestraint;

		let restraintfullname = ``;
		switch (type) {
            case "collar":
                restraintfullname = getCollarName(serverID, user, restraint);
                break;
			case "heavy":
				restraintfullname = getHeavyName(restraint);
				break;
			case "gag":
				restraintfullname = process.autocompletes.gag.find((f) => f.value == restraint)?.name;
				break;
            case "mask":
				restraintfullname = process.autocompletes.headtypes.find((f) => f.value == restraint)?.name;
				break;
			default:
				console.log(`Could not find a restraint by that type.`);
				rej("Error");
				break;
		}

		// We need to ASK
		let extrahelptext = extrahelptextoverride ?? configoptions["Extreme"][`extreme-${type}-${restraint}`]?.prompttext ?? "Something went wrong retrieving this text.";
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

// Prompts the target to put on a restraint such as a chastity belt or armbinder. 
// Will never be available for collars.
// Will ALWAYS nag the user unless they're collared for that respective restraint.
async function handleMajorRestraint(serverID, user, target, type, restraint) {
    traceFirstParam(arguments[0]);
	return new Promise(async (res, rej) => {
		let hasOption = getOption(serverID, target.id, `majorrestraint`);
		if (canAccessCollar(serverID, target.id, user.id).access) {
            let bondagetype = type;
            if (type == "chastitybra") { bondagetype = "chastity" }
            if (getCollar(serverID, target.id) && getCollar(serverID, target.id)[bondagetype]) {
                // User is able to access the collar of the user *and* it has the permission. 
                res(true);
			    return;
            }
		} 

        // Always approve ourselves. 
        if (user.id === target.id) {
            res(true);
            return
        }

		if (hasOption == "disabled") {
			rej("Disabled");
			return;
		} // NOPE

        if (process.recentlypromptedmajor && process.recentlypromptedmajor[target.id] && process.recentlypromptedmajor[target.id] > Date.now()) {
            rej("Cooldown")
            return;
        }

		let restraintfullname = ``;
        let prettytype = ``;
        let emoji = ``;
        let limitationstext = ``;
		switch (type) {
			case "heavy":
				restraintfullname = getHeavyName(restraint);
                prettytype = "Heavy Bondage"
                emoji = `${process.emojis.armbinder}`;
                limitationstext = `This will prevent you from using most commands in the bot, including **/unheavy** to free yourself!`
				break;
			case "chastity":
				restraintfullname = getBaseChastity(restraint)?.name;
                prettytype = "Chastity Belt"
                emoji = `${process.emojis.chastity}`;
                limitationstext = `This will prevent you from using commands to modify relevant toys with **/toy**! Additionally, the restraint will be keyed to ${user} until it is unlocked by ${getPronouns(serverID, user.id, "object")}!`
				break;
            case "chastitybra":
				restraintfullname = getBaseChastity(restraint)?.name;
                prettytype = "Chastity Bra"
                emoji = `${process.emojis.chastitybra}`;
                limitationstext = `This will prevent you from using commands to modify relevant toy on your breasts with **/toy**! Additionally, the restraint will be keyed to ${user} until it is unlocked by ${getPronouns(serverID, user.id, "object")}!`
				break;
            case "mitten":
                restraintfullname = getMittenName(serverID, undefined, restraint) ?? "Standard Mittens";
                prettytype = "Mittens"
                emoji = `${process.emojis.mitten}`;
                limitationstext = `This will prevent you from adding or removing gags with **/gag** or masks with **/mask** until someone else unmittens you!`
                break;
            case "mask":
                restraintfullname = getHeadwearName(serverID, undefined, restraint);
                prettytype = "Mask"
                emoji = `${process.emojis.gasmask}`;
                limitationstext = `This may have a major effect on your speech or emoji, as well as blinding you in **/inspect**!`
                break;
			default:
				console.log(`Could not find a restraint by that type.`);
				rej("Error");
				break;
		}

		// We need to ASK
		let prompttext = `## ${user} would like to place a ${emoji}**${prettytype}** restraint on you: **${restraintfullname}**\n\n${limitationstext}\n\nDo you wish to allow this action?`;
		let buttons = [
            new ButtonBuilder()
                .setCustomId("denyButton")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger), 
            new ButtonBuilder()
                .setCustomId("acceptButton")
                .setLabel("Allow (Wait...)")
                .setStyle(ButtonStyle.Success)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId("cooldown15")
                .setLabel("Block Requests for 15m")
                .setStyle(ButtonStyle.Danger),
            /*new ButtonBuilder()
                .setCustomId("cooldown60")
                .setLabel("Block Requests for 1h")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("cooldown1440")
                .setLabel("Block Requests for 24h")
                .setStyle(ButtonStyle.Danger)*/
        ]

        try {
            let dmchannel = await target.createDM();
            await dmchannel
                .send({ content: `${prompttext}\n-# You must wait 15 seconds for this button to activate...`, components: [new ActionRowBuilder().addComponents(...buttons)] })
                .then(async (mess) => {
                    // Create a collector for up to 5 minutes
                    const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300_000, max: 1 });

                    collector.on("collect", async (i) => {
                        console.log(i);
                        if (i.customId == "cooldown15") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 900000
                        }
                        if (i.customId == "cooldown60") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 3600000
                        }
                        if (i.customId == "cooldown1440") {
                            if (process.recentlypromptedmajor == undefined) {
                                process.recentlypromptedmajor = {}
                            }
                            process.recentlypromptedmajor[target.id] = Date.now() + 86400000
                        }
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

                    // Wait 15 seconds before editing the message with the new components
                    await new Promise(resolve => setTimeout(resolve, 15000));

                    let editedbuttons = [
                        new ButtonBuilder()
                            .setCustomId("denyButton")
                            .setLabel("Deny")
                            .setStyle(ButtonStyle.Danger), 
                        new ButtonBuilder()
                            .setCustomId("acceptButton")
                            .setLabel("Allow")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId("cooldown15")
                            .setLabel("Block Requests for 15m")
                            .setStyle(ButtonStyle.Danger),
                        /*new ButtonBuilder()
                            .setCustomId("cooldown60")
                            .setLabel("Block Requests for 1h")
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId("cooldown1440")
                            .setLabel("Block Requests for 24h")
                            .setStyle(ButtonStyle.Danger)*/
                    ]

                    mess.edit({ content: prompttext, components: [new ActionRowBuilder().addComponents(...editedbuttons)] })
                })
                .catch((err) => {
                    console.log(`Error sending message to major bind ${user}.`);
                    rej("NoDM");
                });
        }
        catch (err) {
            console.log(err);
            rej("NoDM")
        }
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
        Mask: Object.entries(process.headtypes).filter((f) => !f[1].hidden).map((f) => f[1]).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: heavy.blockinspect || heavy.blockemote ? `Restricts: ${heavy.blockinspect ? `Inspect, ` : ``}${heavy.blockemote ? `Emote, ` : ``}`.slice(0, -2) : `` })),
        Collar: collartypes.sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "" })),
        Toys: Object.entries(process.toytypes).map((f) => f[1]).sort((a, b) => a.toyname.localeCompare(b.toyname)).map((heavy) => ({ name: heavy.toyname, value: heavy.category })),
        Wearable: wearabletypes.filter((f) => (f.name.length > 0)).sort((a, b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: heavy.colorable ? `Colorable` : `` })),
    };
    process.listtexts = restraints;
}

// Generates a message box with buttons to give keys for a user to a target, and listing all valid keys along with current cloned keyholders.
async function generateKeyGivingModal(serverID, userid, weareridin, targetidin, keybitin) {
    traceFirstParam(arguments[0]);
    let wearerid = weareridin ?? userid;
    let targetid = targetidin ?? userid;
    let keybit = keybitin ?? "0000"; // first character is give/clone, second, third and fourth are chastity, chastity bra and collar.
    let giveclone = keybit.charAt(0) == "0" ? "give" : "clone"
    let giveclonecap = `${giveclone.slice(0,1).toUpperCase()}${giveclone.slice(1)}`

    // Reset any keybits we became ineligible for
    if ((getChastity(serverID, wearerid)?.keyholder != userid) || (getChastity(serverID, wearerid)?.clonedKeyholders && getChastity(serverID, wearerid)?.clonedKeyholders.includes(targetid)) || (getChastity(serverID, wearerid)?.fumbled)) {
        keybit = `${keybit.slice(0,1)}0${keybit.slice(2)}`
    }
    if ((getChastityBra(serverID, wearerid)?.keyholder != userid) || (getChastityBra(serverID, wearerid)?.clonedKeyholders && getChastityBra(serverID, wearerid)?.clonedKeyholders.includes(targetid)) || (getChastityBra(serverID, wearerid)?.fumbled)) {
        keybit = `${keybit.slice(0,2)}0${keybit.slice(3)}`
    }
    if ((getCollar(serverID, wearerid)?.keyholder != userid) || (getCollar(serverID, wearerid)?.clonedKeyholders && getCollar(serverID, wearerid)?.clonedKeyholders.includes(targetid)) || (getCollar(serverID, wearerid)?.fumbled)) {
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
    if (getChastity(serverID, wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getChastity(serverID, wearerid).keyholder}>`
        if (getChastityTimelock(serverID, wearerid)) { keyholdertext = `Timelocked` }
        if (getChastity(serverID, wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getChastity(serverID, wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getChastity(serverID, wearerid).clonedKeyholders && getChastity(serverID, wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getChastity(serverID, wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getChastity(serverID, wearerid).keyholder == userid) || getChastity(serverID, wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getChastity(serverID, wearerid).keyholder != userid) || (getChastity(serverID, wearerid).clonedKeyholders && getChastity(serverID, wearerid).clonedKeyholders.includes(targetid)) || (getChastity(serverID, wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.chastity} Chastity - ${getChastityName(serverID, wearerid, getChastity(serverID, wearerid).chastitytype) ?? "Standard Chastity Belt"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
            .setButtonAccessory((button) =>
                button
                    .setCustomId(`key_key_chastity_${wearerid}_${targetid}_${keybitin}`)
                    .setLabel(`${keybit.charAt(1) == "0" ? "Do not " : ""}${giveclonecap}`)
                    .setStyle(keybit.charAt(1) == "0" ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setDisabled(blocked),
            );
        restraintcomponents.push(buttonsection)
    }
    if (getChastityBra(serverID, wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getChastityBra(serverID, wearerid).keyholder}>`
        if (getChastityBraTimelock(serverID, wearerid)) { keyholdertext = `Timelocked` }
        if (getChastityBra(serverID, wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getChastityBra(serverID, wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getChastityBra(serverID, wearerid).clonedKeyholders && getChastityBra(serverID, wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getChastityBra(serverID, wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getChastityBra(serverID, wearerid).keyholder == userid) || getChastityBra(serverID, wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getChastityBra(serverID, wearerid).keyholder != userid) || (getChastityBra(serverID, wearerid).clonedKeyholders && getChastityBra(serverID, wearerid).clonedKeyholders.includes(targetid)) || (getChastityBra(serverID, wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.chastitybra} Chastity Bra - ${getChastityBraName(serverID, wearerid, getChastityBra(serverID, wearerid).chastitytype) ?? "Standard Chastity Bra"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
            .setButtonAccessory((button) =>
                button
                    .setCustomId(`key_key_chastitybra_${wearerid}_${targetid}_${keybitin}`)
                    .setLabel(`${keybit.charAt(2) == "0" ? "Do not " : ""}${giveclonecap}`)
                    .setStyle(keybit.charAt(2) == "0" ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setDisabled(blocked),
            );
        restraintcomponents.push(buttonsection)
    }
    if (getCollar(serverID, wearerid)) {
        let keyholdertext = ``;
        keyholdertext = `<@${getCollar(serverID, wearerid).keyholder}>`
        if (getCollarTimelock(serverID, wearerid)) { keyholdertext = `Timelocked` }
        if (getCollar(serverID, wearerid).keyholder == wearerid) { keyholdertext = `Self-bound` }
        if (getCollar(serverID, wearerid)?.fumbled) { keyholdertext = `Keys are missing!` }
        let clonetext = (getCollar(serverID, wearerid).clonedKeyholders && getCollar(serverID, wearerid).clonedKeyholders.length > 0) ? `\n**Cloned Keys:** ${getCollar(serverID, wearerid).clonedKeyholders.map((k) => `<@${k}>`).join(", ")}` : ``
        let notholding = (!(getCollar(serverID, wearerid).keyholder == userid) || getCollar(serverID, wearerid).fumbled) ? "\n***🔒 You are not holding the primary keys to this restraint***" : ""
        let blocked = false;
        if ((getCollar(serverID, wearerid).keyholder != userid) || (getCollar(serverID, wearerid).clonedKeyholders && getCollar(serverID, wearerid).clonedKeyholders.includes(targetid)) || (getCollar(serverID, wearerid).fumbled)) {
            blocked = true;
        }
        let buttonsection = new SectionBuilder()
            .addTextDisplayComponents((textdisplay) => textdisplay.setContent(`## ${process.emojis.collar} Collar - ${getCollarName(serverID, wearerid, getCollar(serverID, wearerid).chastitytype) ?? "Leather Collar"}\n**Primary Keyholder:** ${keyholdertext}${clonetext}${notholding}\n‎`))
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
    if (((getOption(serverID, wearerid, "keygiving") == "auto") && (keybit.charAt(0) == "0")) ||
        ((getOption(serverID, wearerid, "keycloning") == "auto") && (keybit.charAt(0) == "1"))) {
        allowedtext = `${giveclonecap} ${getPronouns(serverID, wearerid, "possessiveDeterminer")} Keys`
    }
    if ((userid == wearerid) || (wearerid == targetid)) {
        // This is us, we are probably okay with what we're about to do. 
        allowedtext = `${giveclonecap} Your Keys`
    }

    // Determine if the wearer blocked keygiving. If they did, no.
    let allowedbool = false;
    if (((getOption(serverID, wearerid, "keygiving") == "disabled") && (keybit.charAt(0) == "0")) ||
        ((getOption(serverID, wearerid, "keycloning") == "disabled") && (keybit.charAt(0) == "1"))) {
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

async function generateEditMessageModal(messagecontent, messageid, channelid, human) {
    let modal = new ModalBuilder().setCustomId(`webhookedit_${messageid}_${channelid}_${human ? "h" : "b"}`).setTitle(`Edit Message`)

    let outLabel = `Edit your message below:`
    let textentry = new TextInputBuilder()
        .setCustomId(`textedit`)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(messagecontent)
        //.setPlaceholder(messagecontent)
        .setMaxLength(2000)

    let textentrylabel = new LabelBuilder()
        .setLabel(outLabel)
        .setDescription("The message will be garbled again according to your current restrictions.")
        .setTextInputComponent(textentry)
    
    modal.addLabelComponents(textentrylabel)

    return modal;
}

/*******
 * Generate a config modal for extra things to configure on the item when worn.  
 * - **(interaction) interaction**: Which interaction to respond to
 * - **(string) userid**: Which user to retrieve this for
 * - **(string) type**: (optional) Which item to output, if it exists
 * - **(boolean) force**: (optional) Forcibly retrieve the config for an item, must have itemname
 * 
 * Returns undefined if nothing can be generated 
*********/
async function generateExtraConfig(interaction, userid, itemname, force) {
    let interactionoutput = [];
    if (process.eventfunctions == undefined) { return undefined }
    if (itemname) {
        if (force) {
            if (process.eventfunctions.gags && process.eventfunctions.gags[itemname] && process.eventfunctions.gags[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.gags[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.headwear && process.eventfunctions.headwear[itemname] && process.eventfunctions.headwear[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.headwear[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.mitten && process.eventfunctions.mitten[itemname] && process.eventfunctions.mitten[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.mitten[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.heavy && process.eventfunctions.heavy[itemname] && process.eventfunctions.heavy[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.heavy[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.chastity && process.eventfunctions.chastity[itemname] && process.eventfunctions.chastity[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.chastity[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.chastitybra && process.eventfunctions.chastitybra[itemname] && process.eventfunctions.chastitybra[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.chastitybra[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.wearable && process.eventfunctions.wearable[itemname] && process.eventfunctions.wearable[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.wearable[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.toys && process.eventfunctions.toys[itemname] && process.eventfunctions.toys[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.toys[itemname].extraconfig(interaction, userid, itemname));
            }
            if (process.eventfunctions.collar && process.eventfunctions.collar[itemname] && process.eventfunctions.collar[itemname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.collar[itemname].extraconfig(interaction, userid, itemname));
            }
        }
        else {
            // Gags
            getGags(interaction.guildId, userid).forEach(async (g) => {
                if ((g.gagtype == itemname) && process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype] && process.eventfunctions.gags[g.gagtype].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.gags[g.gagtype].extraconfig(interaction, userid, itemname));
                }
            });
            // Headwear
            getHeadwear(interaction.guildId, userid).forEach(async (h) => {
                console.log(itemname)
                if ((h == itemname) && process.eventfunctions.headwear && process.eventfunctions.headwear[h] && process.eventfunctions.headwear[h].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.headwear[h].extraconfig(interaction, userid, itemname));
                }
            });
            // Mittens
            if (getMitten(interaction.guildId, userid)) {
                if ((getMitten(userid).mittenname == itemname) && process.eventfunctions.mitten && process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname] && process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname].extraconfig(interaction, userid, itemname));
                }
            }
            // Heavy Bondage
            if (getHeavyList(interaction.guildId, userid).length > 0) {
                getHeavyList(interaction.guildId, userid).forEach(async (h) => {
                    if ((h.type == itemname) && process.eventfunctions.heavy && process.eventfunctions.heavy[h.type] && process.eventfunctions.heavy[h.type].extraconfig) {
                        interactionoutput.push(await process.eventfunctions.heavy[h.type].extraconfig(interaction, userid, itemname));
                    }
                })
            }
            // Chastity Belts
            if (getChastity(interaction.guildId, userid)) {
                if ((getChastity(interaction.guildId, userid).chastitytype == itemname) && process.eventfunctions.chastity && process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype] && process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype].extraconfig(interaction, userid, itemname));
                }
            }
            // Chastity Bras
            if (getChastityBra(interaction.guildId, userid)) {
                if ((getChastityBra(interaction.guildId, userid).chastitytype == itemname) && process.eventfunctions.chastitybra && process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype] && process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype].extraconfig(interaction, userid, itemname));
                }
            }
            // Wearables
            getWearable(interaction.guildId, userid).forEach(async (h) => {
                if ((h == itemname) && process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.wearable[h].extraconfig(interaction, userid, itemname));
                }
            });
            // Toys
            getToys(interaction.guildId, userid).forEach(async (h) => {
                if ((h.type == itemname) && process.eventfunctions.toys && process.eventfunctions.toys[h.type] && process.eventfunctions.toys[h.type].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.toys[h.type].extraconfig(interaction, userid, itemname));
                }
            });
            // Collars
            if (getCollar(interaction.guildId, userid)) {
                if ((getCollar(interaction.guildId, userid).collartype == itemname) && process.eventfunctions.collar && process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype] && process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype]) {
                    interactionoutput.push(await process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype].extraconfig(interaction, userid, itemname));
                }
            }
        }
    }
    else {
        // Gags
        getGags(interaction.guildId, userid).forEach(async (g) => {
            if ((g.gagtype == itemname) && process.eventfunctions.gags && process.eventfunctions.gags[g.gagtype] && process.eventfunctions.gags[g.gagtype].extraconfig) {
                interactionoutput.push(await process.eventfunctions.gags[g.gagtype].extraconfig(interaction, userid, itemname));
            }
        });
        // Headwear
        getHeadwear(interaction.guildId, userid).forEach(async (h) => {
            console.log(itemname)
            if ((h == itemname) && process.eventfunctions.headwear && process.eventfunctions.headwear[h] && process.eventfunctions.headwear[h].extraconfig) {
                interactionoutput.push(await process.eventfunctions.headwear[h].extraconfig(interaction, userid, itemname));
            }
        });
        // Mittens
        if (getMitten(interaction.guildId, userid)) {
            if ((getMitten(interaction.guildId, userid).mittenname == itemname) && process.eventfunctions.mitten && process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname] && process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname].extraconfig) {
                interactionoutput.push(await process.eventfunctions.mitten[getMitten(interaction.guildId, userid).mittenname].extraconfig(interaction, userid, itemname));
            }
        }
        // Heavy Bondage
        if (getHeavyList(interaction.guildId, userid).length > 0) {
            getHeavyList(interaction.guildId, userid).forEach(async (h) => {
                if ((h.type == itemname) && process.eventfunctions.heavy && process.eventfunctions.heavy[h.type] && process.eventfunctions.heavy[h.type].extraconfig) {
                    interactionoutput.push(await process.eventfunctions.heavy[h.type].extraconfig(interaction, userid, itemname));
                }
            })
        }
        // Chastity Belts
        if (getChastity(interaction.guildId, userid)) {
            if ((getChastity(interaction.guildId, userid).chastitytype == itemname) && process.eventfunctions.chastity && process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype] && process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype].extraconfig) {
                interactionoutput.push(await process.eventfunctions.chastity[getChastity(interaction.guildId, userid).chastitytype].extraconfig(interaction, userid, itemname));
            }
        }
        // Chastity Bras
        if (getChastityBra(interaction.guildId, userid)) {
            if ((getChastityBra(interaction.guildId, userid).chastitytype == itemname) && process.eventfunctions.chastitybra && process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype] && process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype].extraconfig) {
                interactionoutput.push(await process.eventfunctions.chastitybra[getChastityBra(interaction.guildId, userid).chastitytype].extraconfig(interaction, userid, itemname));
            }
        }
        // Wearables
        getWearable(interaction.guildId, userid).forEach(async (h) => {
            if ((h == itemname) && process.eventfunctions.wearable && process.eventfunctions.wearable[h] && process.eventfunctions.wearable[h].extraconfig) {
                interactionoutput.push(await process.eventfunctions.wearable[h].extraconfig(interaction, userid, itemname));
            }
        });
        // Toys
        getToys(interaction.guildId, userid).forEach(async (h) => {
            if ((h.type == itemname) && process.eventfunctions.toys && process.eventfunctions.toys[h.type] && process.eventfunctions.toys[h.type].extraconfig) {
                interactionoutput.push(await process.eventfunctions.toys[h.type].extraconfig(interaction, userid, itemname));
            }
        });
        // Collars
        if (getCollar(interaction.guildId, userid)) {
            if ((getCollar(interaction.guildId, userid).collartype == itemname) && process.eventfunctions.collar && process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype] && process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype]) {
                interactionoutput.push(await process.eventfunctions.collar[getCollar(interaction.guildId, userid).collartype].extraconfig(interaction, userid, itemname));
            }
        }
    }
    
    if (interactionoutput.length <= 0) {
        return undefined;
    }
    else {
        // Flatten the top level component. This inherently spreads each output component given back
        return { components: interactionoutput.flat(), flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral] }
    }
}

exports.consentMessage = consentMessage;
exports.handleConsent = handleConsent;
exports.collarPermModal = collarPermModal;
exports.timelockChastityModal = timelockChastityModal;
exports.timelockChastityBraModal = timelockChastityBraModal;
exports.timelockCollarModal = timelockCollarModal;
exports.timelockBuildConfirm = timelockBuildConfirm;

exports.handleBondageRemoval = handleBondageRemoval;
exports.checkBondageRemoval = checkBondageRemoval;
exports.handleExtremeRestraint = handleExtremeRestraint;

exports.handleMajorRestraint = handleMajorRestraint;

exports.generateHelpModal = generateHelpModal;

exports.generateKeyGivingModal = generateKeyGivingModal;

exports.generateEditMessageModal = generateEditMessageModal;

exports.assignMemeImages = assignMemeImages;

exports.generateListTexts = generateListTexts;

exports.generateExtraConfig = generateExtraConfig;