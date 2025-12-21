const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, assignVibe, discardChastityKey } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const { getCorset, assignCorset } = require('./../functions/corsetfunctions.js');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { optins } = require('../functions/optinfunctions.js');

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
            if (getHeavy(interaction.user.id)) {
                // In heavy bondage, fail
                if (corsetuser == interaction.user) {
                    // Doing this to self
                    if (getChastity(corsetuser.id)) {
                        interaction.reply(`${interaction.user} nudges a corset with ${getPronouns(interaction.user.id, "possessiveDeterminer")} knee, but ${getPronouns(interaction.user.id, "possessiveDeterminer")} ${getHeavy(interaction.user.id).type} prevents ${getPronouns(interaction.user.id, "object")} from even trying to get the corset around ${getPronouns(corsetuser.id, "object")} waist, to say nothing of ${getPronouns(corsetuser.id, "possessiveDeterminer")} chastity belt in the way!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} looks at a corset, but ${getPronouns(interaction.user.id, "subject")} ${getPronouns(interaction.user.id, "subject") != "they" ? "is" : "are"} is still tightly bound in a ${getHeavy(interaction.user.id).type} and can't effectively hold the laces!`)
                    }
                }
                else {
                    // To others
                    if (getChastity(corsetuser.id)) {
                        interaction.reply(`${interaction.user} brushes a corset with ${getPronouns(interaction.user.id, "possessiveDeterminer")} chin towards ${corsetuser} but ${getPronouns(interaction.user.id, "subject")} can't put it on ${getPronouns(corsetuser.id, "object")} because bound arms and unyielding steel chastity belts make it hard to manipulate corsets!`)
                    }
                    else {
                        interaction.reply(`${interaction.user} bumps into a corset with ${getPronouns(interaction.user.id, "possessiveDeterminer")} hip. Sadly, because hips don't have fingers, ${corsetuser} cannot be corseted! If only ${getPronouns(interaction.user.id, "subject")} wasn't in an unyielding ${getHeavy(interaction.user.id).type}, ${getPronouns(interaction.user.id, "subject")} might be able to bind ${getPronouns(corsetuser.id, "object")}`)
                    }
                }
            }
            else if (getChastity(corsetuser.id)) {
                // The target is in a chastity belt
                if ((getChastity(corsetuser.id)?.keyholder == interaction.user.id || (getChastity(corsetuser.id)?.access === 0 && corsetuser.id != interaction.user.id))) {
                    // User tries to modify the corset settings for someone in chastity that they do have the key for
                    const fumbleResults = (chastitywearer.id == interaction.user.id || optins.getOthersKeyFumbling(chastitywearer.id)) ? rollKeyFumbleN(interaction.user.id, 2) : [false, false];
                    if (fumbleResults[0]) {
                        // User fumbles with the key due to their arousal and frustration
                        if (optins.getKeyDiscarding(corsetuser.id) && fumbleResults[1]) {
                            // if they fumble again they can lose the key
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to adjust the corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain just as out of breath as before!`);
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    // Putting ON a corset!
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to put on a corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain without one!`);
                                    discardChastityKey(corsetuser.id);
                                }
                            } else {
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to adjust the corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain just as out of breath as before!`);
                                    discardChastityKey(corsetuser.id);
                                }
                                else {
                                    // Putting ON a corset!
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to put on a corset but fumbles with the key so much with the key that they drop it somewhere so ${corsetuser} will remain without one!`);
                                    discardChastityKey(corsetuser.id);
                                }
                            }
                        } else {
                            if (corsetuser == interaction.user) {
                                // User tries to modify their own corset settings while in chastity
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to adjust the corset but fumbles with the key so ${corsetuser} will remain just as out of breath as before!`);
                                }
                                else {
                                    // Putting ON a corset!
                                    interaction.reply(`${interaction.user} tries to unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt to put on a corset but fumbles with the key so ${corsetuser} will remain without one!`);
                                }
                            }
                            else {
                                // User tries to modify another user's vibe settings
                                if (getCorset(corsetuser.id)) {
                                    // User already has a corset on
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to adjust the corset but fumbles with the key so ${corsetuser} will remain just as out of breath as before!`);
                                }
                                else {
                                    // Putting ON a corset!
                                    interaction.reply(`${interaction.user} tries to unlock ${corsetuser}'s belt to put on a corset but fumbles with the key so ${corsetuser} will remain without one!`);
                                }
                            }
                        }
                    } else {
                        if (corsetuser == interaction.user) {
                            // User tries to modify their own corset settings while in chastity
                            if (getCorset(corsetuser.id)) {
                                // User already has a corset on
                                if (getCorset(corsetuser.id).tightness < tightness) {
                                    // Tightening the corset!
                                    interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, pulling the strings on the corset even tighter! The length of the strings hanging off of the corset is now at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(interaction.user.id, "reflexive")} back up!`)
                                    assignCorset(corsetuser.id, tightness)
                                }
                                else {
                                    // Loosening the corset!
                                    interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt, carefully loosening the strings on the corset, taking a deep breath as ${getPronouns(interaction.user.id, "subject")} can breathe! The length of the strings hanging off of the corset is now at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(interaction.user.id, "reflexive")} back up!`)
                                    assignCorset(corsetuser.id, tightness)
                                }
                            }
                            else {
                                // Putting ON a corset!
                                interaction.reply(`${interaction.user} unlocks ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt and then puts a corset on ${getPronouns(corsetuser.id, "reflexive")}, pulling the strings tightly, leaving the length of the strings at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} then ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(interaction.user.id, "reflexive")} back up!`)
                                assignCorset(corsetuser.id, tightness)
                            }
                        }
                        else {
                            // User tries to modify another user's vibe settings
                            if (getCorset(corsetuser.id)) {
                                // User already has a corset on
                                if (getCorset(corsetuser.id).tightness < tightness) {
                                    // Tightening the corset!
                                    interaction.reply(`${interaction.user} unlocks ${corsetuser}'s belt, pulling the strings on the corset even tighter! The length of the strings hanging off of the corset is now at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(corsetuser.id, "object")} back up!`)
                                    assignCorset(corsetuser.id, tightness)
                                }
                                else {
                                    // Loosening the corset!
                                    interaction.reply(`${interaction.user} unlocks ${corsetuser}'s belt, carefully loosening the strings on the corset! The length of the strings hanging off of the corset is now at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(corsetuser.id, "object")} back up!`)
                                    assignCorset(corsetuser.id, tightness)
                                }
                            }
                            else {
                                // Putting ON a corset!
                                interaction.reply(`${interaction.user} unlocks ${corsetuser}'s belt and then puts a corset on ${getPronouns(corsetuser.id, "object")}, pulling the strings tightly, leaving the length of the strings at ${tightness}! ${getPronouns(interaction.user.id, "subject", true)} then ${getPronouns(interaction.user.id, "subject") != "they" ? "locks" : "lock"} ${getPronouns(corsetuser.id, "object")} back up!`)
                                assignCorset(corsetuser.id, tightness)
                            }
                        }
                    }
                }
                else {
                    // User tries to modify corset settings but does not have the key for the belt
                    if (corsetuser == interaction.user) {
                        // User tries to modify their own corset settings while in chastity
                        if (getCorset(corsetuser.id)) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} tugs at ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset, but since ${getPronouns(interaction.user.id, "subject")} can't unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt, ${getPronouns(interaction.user.id, "subject")} will have to tolerate the lightheadedness!`)
                        }
                        else {
                            interaction.reply(`${interaction.user} dances ${getPronouns(interaction.user.id, "possessiveDeterminer")} fingers on ${getPronouns(interaction.user.id, "possessiveDeterminer")} belt while eying a corset, but ${getPronouns(interaction.user.id, "subject")} won't be able to put it on because ${getPronouns(interaction.user.id, "subject")} can't unlock ${getPronouns(interaction.user.id, "possessiveDeterminer")} chastity belt!`)
                        }
                    }
                    else {
                        // User tries to modify another user's vibe settings
                        interaction.reply({ content: `You do not have the key for ${corsetuser}'s chastity belt!`, flags: MessageFlags.Ephemeral })
                    }
                }
            }
            else {
                // Target is NOT in a chastity belt!
                if (corsetuser == interaction.user) {
                    // User tries to modify their own vibe settings
                    if (getCorset(corsetuser.id)) {
                        // User tries to modify their own corset settings while not in chastity.
                        if (getCorset(corsetuser.id).tightness < tightness) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} grabs the strings on ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset, pulling them even tighter! The length of the strings hanging off of the corset is now at ${tightness}! ${getPronouns(interaction.user.id, "possessiveDeterminer", true)} breaths become shallower.`)
                            assignCorset(corsetuser.id, tightness)
                        }
                        else {
                            interaction.reply(`${interaction.user} grabs the strings on ${getPronouns(interaction.user.id, "possessiveDeterminer")} corset, carefully loosening them with a sigh of relief! The length of the strings hanging off of the corset is now at ${tightness}!`)
                            assignCorset(corsetuser.id, tightness)
                        }
                    }
                    else {
                        interaction.reply(`${interaction.user} wraps a corset around ${getPronouns(interaction.user.id, "possessiveDeterminer")} waist, pulling the strings taut, and then further, leaving the length of the strings at ${tightness}!`)
                        assignCorset(corsetuser.id, tightness)
                    }
                }
                else {
                    // User tries to modify another user's vibe settings
                    if (getCorset(corsetuser.id)) {
                        // User tries to modify their someone else's corset while they're not in chastity
                        if (getCorset(corsetuser.id).tightness < tightness) {
                            // User already has a vibrator on
                            interaction.reply(`${interaction.user} grabs the strings on ${corsetuser}'s corset, bracing with their knee, and pulling them even tighter! The length of the strings hanging off of the corset is now at ${tightness}!`)
                            assignCorset(corsetuser.id, tightness)
                        }
                        else {
                            interaction.reply(`${interaction.user} grabs the strings on ${corsetuser}'s corset, tugging on the laces carefully to loosen them a bit! The length of the strings hanging off of the corset is now at ${tightness}!`)
                            assignCorset(corsetuser.id, tightness)
                        }
                    }
                    else {
                        interaction.reply(`${interaction.user} wraps a corset around ${corsetuser}'s waist, pulling the strings taut, and then further, leaving the length of the strings at ${tightness}!`)
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