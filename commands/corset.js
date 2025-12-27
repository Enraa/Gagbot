const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, assignVibe, discardChastityKey } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getCorset, assignCorset } = require('./../functions/corsetfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { optins } = require('../functions/optinfunctions.js');
const { getText } = require("./../functions/textfunctions.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('corset')
		.setDescription('Put a corset on someone, shortening their messages')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to corset?')
        )
		.addNumberOption(opt => 
            opt.setName('intensity')
            .setDescription("How tightly to lace their corset!")
            .setMinValue(1)
            .setMaxValue(10)
        ),
    async execute(interaction) {
        try {
            let corsetuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(corsetuser.id)?.mainconsent) {
                await handleConsent(interaction, corsetuser.id);
                return;
            }
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let tightness = interaction.options.getNumber('intensity') ? interaction.options.getNumber('intensity') : 5
            // Build data tree:
            let data = {
                textarray: "texts_corset",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: corsetuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: tightness // corset tightness 
                }
            }
            if (getHeavy(interaction.user.id)) {
                // In heavy bondage, fail
                data.heavy = true
                if (corsetuser == interaction.user) {
                    // Doing this to self
                    data.self = true
                    if (getChastity(corsetuser.id)) {
                        data.chastity = true
                        interaction.reply(getText(data))
                    }
                    else {
                        data.nochastity = true
                        interaction.reply(getText(data))
                    }
                }
                else {
                    // To others
                    data.other = true
                    if (getChastity(corsetuser.id)) {
                        data.chastity = true
                        interaction.reply(getText(data))
                    }
                    else {
                        data.nochastity = true
                        interaction.reply(getText(data))
                    }
                }
            }
            else if (getChastity(corsetuser.id)) {
                data.noheavy = true
                data.chastity = true
                // The target is in a chastity belt
                if ((getChastity(corsetuser.id)?.keyholder == interaction.user.id || (getChastity(corsetuser.id)?.access === 0 && corsetuser.id != interaction.user.id))) {
                    // User tries to modify the corset settings for someone in chastity that they do have the key for
                    data.key = true
                    const fumbleResults = rollKeyFumbleN(interaction.user.id, corsetuser.id, 2);
                    if (fumbleResults[0]) {
                        // User fumbles with the key due to their arousal and frustration
                        data.fumble = true
                        if (optins.getKeyDiscarding(corsetuser.id) && fumbleResults[1]) {
                            data.discard = true
                            // if they fumble again they can lose the key
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                data.self = true
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    data.corset = true
                                    interaction.reply(getText(data));
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    // Putting ON a corset!
                                    data.nocorset = true;
                                    interaction.reply(getText(data));
                                    discardChastityKey(corsetuser.id);
                                }
                            } else {
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    data.corset = true
                                    interaction.reply(getText(data));
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    // Putting ON a corset!
                                    data.nocorset = true
                                    interaction.reply(getText(data));
                                    discardChastityKey(corsetuser.id);
                                }
                            }
                        } else {
                            data.nodiscard = true
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                data.self = true;
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    data.corset = true;
                                    interaction.reply(getText(data));
                                }
                                else {
                                    // Putting ON a corset!
                                    data.nocorset = true;
                                    interaction.reply(getText(data));
                                }
                            }
                            else {
                                // User tries to modify another user's vibe settings
                                data.other = true
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    data.corset = true
                                    interaction.reply(getText(data));
                                }
                                else {
                                    // Putting ON a corset!
                                    data.nocorset = true
                                    interaction.reply(getText(data));
                                }
                            }
                        }
                    } else {
                        data.nofumble = true
                        if (corsetuser == interaction.user) {
                            data.self = true
                            // User tries to modify their own corset settings while in chastity
                            if (getCorset(corsetuser.id)) {
                                data.corset = true
                                // User already has a corset on
                                if (getCorset(corsetuser.id).tightness < tightness) {
                                    // Tightening the corset!
                                    data.tighter = true
                                    interaction.reply(getText(data))
                                    assignCorset(corsetuser.id, tightness)
                                }
                                else {
                                    // Loosening the corset!
                                    data.looser = true
                                    interaction.reply(getText(data))
                                    assignCorset(corsetuser.id, tightness)
                                }
                            }
                            else {
                                // Putting ON a corset!
                                data.nocorset = true
                                interaction.reply(getText(data))
                                assignCorset(corsetuser.id, tightness)
                            }
                        }
                        else {
                            // User tries to modify another user's vibe settings
                            data.other = true
                            if (getCorset(corsetuser.id)) {
                                data.corset = true;
                                // User already has a corset on
                                if (getCorset(corsetuser.id).tightness < tightness) {
                                    // Tightening the corset!
                                    data.tighter = true
                                    interaction.reply(getText(data))
                                    assignCorset(corsetuser.id, tightness)
                                }
                                else {
                                    // Loosening the corset!
                                    data.looser = true
                                    interaction.reply(getText(data))
                                    assignCorset(corsetuser.id, tightness)
                                }
                            }
                            else {
                                // Putting ON a corset!
                                data.nocorset = true
                                interaction.reply(getText(data))
                                assignCorset(corsetuser.id, tightness)
                            }
                        }
                    }
                }
                else {
                    data.noheavy = true
                    data.chastity = true
                    data.nokey = true
                    // User tries to modify corset settings but does not have the key for the belt
                    if (corsetuser == interaction.user) {
                        // User tries to modify their own corset settings while in chastity
                        data.self = true
                        if (getCorset(corsetuser.id)) {
                            // User already has a corset on
                            data.corset = true
                            interaction.reply(getText(data))
                        }
                        else {
                            data.nocorset = true
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // User does not have others' belt key
                        data.other = true
                        interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // Target is NOT in a chastity belt!
                data.nochastity = true
                if (corsetuser == interaction.user) {
                    // User tries to add a corset to themselves
                    data.self = true;
                    if (getCorset(corsetuser.id)) {
                        // User tries to modify their own corset settings while not in chastity.
                        data.corset = true
                        if (getCorset(corsetuser.id).tightness < tightness) {
                            // User is tightening the corset
                            data.tighten = true
                            interaction.reply(getText(data))
                            assignCorset(corsetuser.id, tightness)
                        }
                        else {
                            // Loosening the corset
                            data.loosen = true
                            interaction.reply(getText(data))
                            assignCorset(corsetuser.id, tightness)
                        }
                    }
                    else {
                        data.nocorset = true
                        interaction.reply(getText(data))
                        assignCorset(corsetuser.id, tightness)
                    }
                }
                else {
                    data.other = true
                    // User tries to modify another user's vibe settings
                    if (getCorset(corsetuser.id)) {
                        // User tries to modify their someone else's corset while they're not in chastity
                        data.corset = true
                        if (getCorset(corsetuser.id).tightness < tightness) {
                            // Tightening
                            data.tighten = true
                            interaction.reply(getText(data))
                            assignCorset(corsetuser.id, tightness)
                        }
                        else {
                            // Loosening
                            data.loosen = true
                            interaction.reply(getText(data))
                            assignCorset(corsetuser.id, tightness)
                        }
                    }
                    else {
                        data.nocorset = true
                        interaction.reply(getText(data))
                        assignCorset(corsetuser.id, tightness)
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}