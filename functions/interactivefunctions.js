const fs = require('fs');
const path = require('path');
const https = require('https');
const { SlashCommandBuilder, MessageFlags, TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder } = require('discord.js');
const { getPronouns } = require('./../functions/pronounfunctions.js')

// Generates a consent button which the user will have to agree to. 
const consentMessage = (interaction, user) => {
    let outtext = `# Consent to being Bound
<@${process.env.CLIENTID}> is a bot which facilitates restraints in this channel, which have certain effects on you as you wear them, primarily centered around some form of speech impairment. Effects will only apply within this channel. 
Restraints and toys used include the following:
- Gags, Corsets and Vibrators: Impair and modify speech in various ways
- Mittens and Chastity: Restrict modifying these settings
- Heavy Bondage: Restrict modifying any setting
- Collars: Allow others to perform more significant actions on you.
You can access these commands by typing / to bring up a list of what can be done.
*Where possible, the bot's design philosophy is **"Consent First,"** meaning that you will have to make an active choice to give up control. Examples of this include mittens, chastity and heavy bondage. Collars can override this, if you wear them. Please use these at your own risk and leverage the **keyholder** and **other controls** presented as necessary.*

<@${user}>, by clicking the button below, you acknowledge the above risks and considerations and users will be able to play with you using the bot.
-# Button only works for <@${user.displayName}`
    const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('I Accept').setStyle(ButtonStyle.Success);
    const row = new ActionRowBuilder().addComponents(confirm);

    return {
        content: outtext,
        components: [row],
        withResponse: true
    }
}

const assignConsent = (user) => {
    if (process.consented == undefined) { process.consented = {} }
    process.consented[user] = {
        mainconsent: true
    }
    console.log(process.consented)
    console.log(fs.readFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`))
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`, JSON.stringify(process.consented));
    console.log(fs.readFileSync(`${process.GagbotSavedFileDirectory}/consentusers.txt`))
    console.log("I SWEAR TO GOD IF YOU DIDNT SAVE")
}

const getConsent = (user) => {
    if (process.consented == undefined) { process.consented = {} }
    return process.consented[user]
}

// check with getConsent, then pipe to await handleConsent and return. 
const handleConsent = async (interaction, user) => {
    let testusertarget = user;
    let consentform = consentMessage(interaction, testusertarget);
    const collectorFilter = (i) => i.user.id === testusertarget;
    const response = await interaction.reply(consentform)
    console.log(response)
    try {
        const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 180_000 });
        console.log(confirmation);
        assignConsent(testusertarget)
        await interaction.editReply({ content: `Consent form agreed to by <@${testusertarget}>! Please re-run the command to tie!`, components: [] });
    } catch (err) {
        console.log(err);
        await interaction.editReply({ content: `Consent form was not agreed to for <@${testusertarget}>! Please try to bind again to bring this form back up.`, components: [] });
    }
}

const collarPermModal = (interaction, keyholder, freeuse) => {
    const modal = new ModalBuilder().setCustomId(`collar_${keyholder.id}_${freeuse ? "f" : "t"}`).setTitle('Collar Permissions');

    let restrictionWarningText = new TextDisplayBuilder()
    let othertext = "others"
    let warningText = `# WARNING 
This restraint is intended to allow **others** to use /chastity, /mittens and /heavy on you!`
    if (freeuse) { 
        warningText = `${warningText}\nYou have designated yourself as free use and will allow *everyone* to play with you.` 
    }
    else {
        warningText = `${warningText}\nYou have chosen ${keyholder} to be your keyholder, and will allow ${getPronouns(keyholder.id, "object")} to play with you.` 
        othertext = getPronouns(keyholder.id, "object")
    }
    warningText = `${warningText}\nCollars may result in unintended situations such as someone holding your chastity key other than you, or you becoming unable to remove restraints because of heavy bondage. Use with caution!`

    restrictionWarningText.setContent(warningText)

    const restrictionsInputmitten = new StringSelectMenuBuilder()
        .setCustomId('mitten')
        .setPlaceholder('Select Permission')
        .setRequired(true)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Yes')
                // Description of option
                .setDescription('Allows the use of /mitten on you')
                // Value returned to you in modal submission
                .setValue('mitten_yes'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('No')
                // Description of option
                .setDescription('Disallows the use of /mitten on you')
                // Value returned to you in modal submission
                .setValue('mitten_no'),
        )

    const restrictionsInputchastity = new StringSelectMenuBuilder()
        .setCustomId('chastity')
        .setPlaceholder('Select Permission')
        .setRequired(true)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Yes')
                // Description of option
                .setDescription('Allows the use of /chastity on you')
                // Value returned to you in modal submission
                .setValue('chastity_yes'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('No')
                // Description of option
                .setDescription('Disallows the use of /chastity on you')
                // Value returned to you in modal submission
                .setValue('chastity_no'),
        )

    const restrictionsInputheavy = new StringSelectMenuBuilder()
        .setCustomId('heavy')
        .setPlaceholder('Select Permission')
        .setRequired(true)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Yes')
                // Description of option
                .setDescription('Allows the use of /heavy on you')
                // Value returned to you in modal submission
                .setValue('heavy_yes'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('No')
                // Description of option
                .setDescription('Disallows the use of /heavy on you')
                // Value returned to you in modal submission
                .setValue('heavy_no'),
        )

    const restrictionsLabelmitten = new LabelBuilder()
        .setLabel(`Allow ${othertext} to mitten you?`)
        .setStringSelectMenuComponent(restrictionsInputmitten)

    const restrictionsLabelchastity = new LabelBuilder()
        .setLabel(`Allow ${othertext} to put you in chastity?`)
        .setStringSelectMenuComponent(restrictionsInputchastity)

    const restrictionsLabelheavy = new LabelBuilder()
        .setLabel(`Allow ${othertext} to put you in heavy bondage?`)
        .setStringSelectMenuComponent(restrictionsInputheavy)

    // Add labels to modal
    modal.addTextDisplayComponents(restrictionWarningText)
        .addLabelComponents(restrictionsLabelmitten, restrictionsLabelchastity, restrictionsLabelheavy); 

    return modal;
}

const timelockChastityModal = (interaction, wearer, tempKeyholder) => {
    const modal = new ModalBuilder().setCustomId(`chastitytimelock_${wearer.id}${tempKeyholder ? `_${tempKeyholder.id}` : ""}`).setTitle('Chastity Timelock');

    let restrictionWarningText = new TextDisplayBuilder()
    let warningText = interaction.user.id == wearer.id ? `# Timelock (Chastity Belt)
This will lock your belt for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts` : `# Timelock (Chastity Belt)
This will lock ${wearer}'s belt for a set period of time. Please configure your timelock below.
-# Once confirmed, you will have a final prompt before the timelock starts`

    restrictionWarningText.setContent(warningText)

    const timelockamt = new TextInputBuilder()
        .setCustomId('timelockinput')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. 10 days 5h 24 mins')
        .setRequired(true)


    const accesswhilebound = new StringSelectMenuBuilder()
        .setCustomId('accesswhilebound')
        .setPlaceholder('Belt Access')
        .setRequired(true)
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Everyone Else')
                // Description of option
                .setDescription('Everyone except the wearer can vibe and corset the wearer')
                // Value returned to you in modal submission
                .setValue('access_others'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Keyholder Only')
                // Description of option
                .setDescription('Only the non-wearer keyholder access the wearer\' belt')
                // Value returned to you in modal submission
                .setValue('access_kh'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Nobody')
                // Description of option
                .setDescription('Nobody, not even you, can access the wearer\' belt')
                // Value returned to you in modal submission
                .setValue('access_no'),
        )

    const keyholderafter = new StringSelectMenuBuilder()
        .setCustomId('keyholderafter')
        .setPlaceholder('Action after lock')
        .setRequired(true)
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Unlock')
                // Description of option
                .setDescription('Unlocks the belt, letting it fall off')
                // Value returned to you in modal submission
                .setValue('keyholder_unlock'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('Return')
                // Description of option
                .setDescription('Returns the keys to the wearer')
                // Value returned to you in modal submission
                .setValue('keyholder_return'),
            new StringSelectMenuOptionBuilder()
                // Label displayed to user
                .setLabel('To Keyholder')
                // Description of option
                .setDescription('Returns keys to the keyholder')
                // Value returned to you in modal submission
                .setValue('keyholder_keyholder'),
        )

    const labeltimelockamt = new LabelBuilder()
        .setLabel(`How long should the timelock be?`)
        .setDescription("This can be a range like `1 hour - 24 hours`")
        .setTextInputComponent(timelockamt)

    const labelaccesswhilebound = new LabelBuilder()
        .setLabel(`Who can access during the timelock?`)
        .setStringSelectMenuComponent(accesswhilebound)

    const labelkeyholderafter = new LabelBuilder()
        .setLabel(`What happens after?`)
        .setStringSelectMenuComponent(keyholderafter)

    // Add labels to modal
    modal.addTextDisplayComponents(restrictionWarningText)
        .addLabelComponents(labeltimelockamt, labelaccesswhilebound, labelkeyholderafter); 

    return modal;
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
    const imagespath = path.join(__dirname, '..', 'memes');
    const imagefiles = fs.readdirSync(imagespath);
    imagefiles.forEach((i) => {
        if (i.endsWith(".png")) {
            memeimages.push(
                { name: i.slice(0, -4), value: i.slice(0, -4) }
            );
        }
    })
    process.memes = memeimages
}

exports.consentMessage = consentMessage
exports.getConsent = getConsent
exports.handleConsent = handleConsent
exports.collarPermModal = collarPermModal
exports.timelockChastityModal = timelockChastityModal

exports.assignMemeImages = assignMemeImages