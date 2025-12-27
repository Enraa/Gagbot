const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { getChastity, getVibe, removeVibe, discardChastityKey } = require('./../functions/vibefunctions.js')
const { getHeavy } = require('./../functions/heavyfunctions.js')
const { getPronouns } = require('./../functions/pronounfunctions.js')
const { getConsent, handleConsent } = require('./../functions/interactivefunctions.js')
const fs = require('fs');
const path = require('path');
const { rollKeyFumbleN } = require('../functions/keyfindingfunctions.js');
const { optins } = require('../functions/optinfunctions.js');
const { getText } = require("./../functions/textfunctions.js");

const vibetypes = [];
const commandsPath = path.join(__dirname, '..', 'vibes');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const vibe = require(`./../vibes/${file}`);
	vibetypes.push(
        { name: vibe.choicename, value: file.replace('.js', '') }
    );
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unvibe')
		.setDescription('Remove a vibrator/toy from someone')
        .addUserOption(opt =>
            opt.setName('user')
            .setDescription('Who to remove the vibrator from')
        ).addStringOption(opt =>
            opt.setName('type')
            .setDescription('What kind of vibrator to remove. Default removes all vibes')
            .addChoices(...vibetypes)
        ),
    async execute(interaction) {
        try {
            let vibeuser = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            let vibetype = interaction.options.getString('type') ? interaction.options.getString('type') : null
            // CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
            if (!getConsent(interaction.user.id)?.mainconsent) {
                await handleConsent(interaction, interaction.user.id);
                return;
            }
            let data = {
                textarray: "texts_unvibe",
                textdata: {
                    interactionuser: interaction.user,
                    targetuser: vibeuser,
                    c1: getHeavy(interaction.user.id)?.type, // heavy bondage type
                    c2: (vibetype ? vibetype : "vibrator") // the chosen vibe type
                }
            }

            if (getHeavy(interaction.user.id)) {
                // We are in heavy bondage
                data.heavy = true
                if (vibeuser == interaction.user) {
                    // ourselves
                    data.self = true
                    if (getChastity(vibeuser.id)) {
                        // in chastity
                        data.chastity = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // not in chastity
                        data.nochastity = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply(getText(data))
                        }
                    }
                }
                else {
                    // someone else
                    data.other = true
                    if (getChastity(vibeuser.id)) {
                        // in chastity
                        data.chastity = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply(getText(data))
                        }
                    }
                    else {
                        // not in chastity
                        data.nochastity = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply(getText(data))
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply(getText(data))
                        }
                    }
                }
            }
            else {
                // We are in heavy bondage
                data.noheavy = true
                if (vibeuser == interaction.user) {
                    // ourselves
                    data.self = true
                    if ((getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype)))) {
                        data.hasvibe = true
                        if (getChastity(vibeuser.id)) {
                            // in chastity
                            data.chastity = true
                            if ((getChastity(vibeuser.id)?.access == undefined) && getChastity(vibeuser.id).keyholder == interaction.user.id) {
                                // We have the key to the belt and it is NOT timelocked
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, vibeuser.id, 2);
                                if (fumbleResults[0]) {
                                    // User fumbles with the key due to their arousal and frustration
                                    data.fumble = true
                                    if (optins.getKeyDiscarding(vibeuser.id) && fumbleResults[1]) {
                                        // lost the key
                                        data.discard = true;
                                        if (vibetype) {
                                            // specific single vibe
                                            data.single = true
                                            interaction.reply(getText(data))
                                            discardChastityKey(vibeuser.id)
                                        }
                                        else {
                                            // removing all vibes
                                            data.both = true
                                            interaction.reply(getText(data))
                                            discardChastityKey(vibeuser.id)
                                        }
                                    }
                                    else {
                                        // fumbled, but didnt lose key
                                        data.nodiscard = true;
                                        if (vibetype) {
                                            // specific single vibe
                                            data.single = true
                                            interaction.reply(getText(data))
                                        }
                                        else {
                                            // removing all vibes
                                            data.both = true
                                            interaction.reply(getText(data))
                                        }
                                    }
                                }
                                else {
                                    // didnot fumble
                                    data.nofumble = true;
                                    if (vibetype) {
                                        // specific single vibe
                                        data.single = true
                                        interaction.reply(getText(data))
                                        removeVibe(vibeuser.id, vibetype)
                                    }
                                    else {
                                        // removing all vibes
                                        data.both = true
                                        interaction.reply(getText(data))
                                        removeVibe(vibeuser.id, vibetype)
                                    }
                                }
                            }
                            else {
                                // We do not have the key
                                data.nokey = true;
                            }
                        }
                        else {
                            // not in chastity
                            data.nochastity = true
                            if (vibetype) {
                                // specific single vibe
                                data.single = true
                                interaction.reply(getText(data))
                                removeVibe(vibeuser.id, vibetype)
                            }
                            else {
                                // removing all vibes
                                data.both = true
                                interaction.reply(getText(data))
                                removeVibe(vibeuser.id, vibetype)
                            }
                        }
                    }
                    else {
                        // not wearing this kind of vibe
                        data.novibe = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
                else {
                    // them
                    data.other = true
                    if ((getVibe(vibeuser.id) && (getVibe(vibeuser.id).some((vibe) => (vibe.vibetype == vibetype)) || (!vibetype)))) {
                        data.hasvibe = true
                        if (getChastity(vibeuser.id)) {
                            // in chastity
                            data.chastity = true
                            if ((getChastity(vibeuser.id)?.access !== 2) && (getChastity(vibeuser.id).keyholder == interaction.user.id)) {
                                // We have the key to the belt
                                data.key = true
                                const fumbleResults = rollKeyFumbleN(interaction.user.id, vibeuser.id, 2);
                                if (fumbleResults[0]) {
                                    // User fumbles with the key due to their arousal and frustration
                                    data.fumble = true
                                    if (optins.getKeyDiscarding(vibeuser.id) && fumbleResults[1]) {
                                        // lost the key
                                        data.discard = true;
                                        if (vibetype) {
                                            // specific single vibe
                                            data.single = true
                                            interaction.reply(getText(data))
                                            discardChastityKey(vibeuser.id)
                                        }
                                        else {
                                            // removing all vibes
                                            data.both = true
                                            interaction.reply(getText(data))
                                            discardChastityKey(vibeuser.id)
                                        }
                                    }
                                    else {
                                        // fumbled, but didnt lose key
                                        data.nodiscard = true;
                                        if (vibetype) {
                                            // specific single vibe
                                            data.single = true
                                            interaction.reply(getText(data))
                                        }
                                        else {
                                            // removing all vibes
                                            data.both = true
                                            interaction.reply(getText(data))
                                        }
                                    }
                                }
                                else {
                                    // didnot fumble
                                    data.nofumble = true;
                                    if (vibetype) {
                                        // specific single vibe
                                        data.single = true
                                        interaction.reply(getText(data))
                                        removeVibe(vibeuser.id, vibetype)
                                    }
                                    else {
                                        // removing all vibes
                                        data.both = true
                                        interaction.reply(getText(data))
                                        removeVibe(vibeuser.id, vibetype)
                                    }
                                }
                            }
                            else if ((getChastity(corsetuser.id)?.access === 0 && corsetuser.id != interaction.user.id)) {
                                // public access key
                                data.public = true
                                if (vibetype) {
                                    // specific single vibe
                                    data.single = true
                                    interaction.reply(getText(data))
                                    removeVibe(vibeuser.id, vibetype)
                                }
                                else {
                                    // removing all vibes
                                    data.both = true
                                    interaction.reply(getText(data))
                                    removeVibe(vibeuser.id, vibetype)
                                }
                            }
                            else {
                                // We do not have the key
                                data.nokey = true;
                                interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                            }
                        }
                        else {
                            // not in chastity
                            data.nochastity = true
                            if (vibetype) {
                                // specific single vibe
                                data.single = true
                                interaction.reply(getText(data))
                                removeVibe(vibeuser.id, vibetype)
                            }
                            else {
                                // removing all vibes
                                data.both = true
                                interaction.reply(getText(data))
                                removeVibe(vibeuser.id, vibetype)
                            }
                        }
                    }
                    else {
                        // not wearing chosen vibrators or any
                        data.novibe = true
                        if (vibetype) {
                            // specific single vibe
                            data.single = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                        else {
                            // removing all vibes
                            data.both = true
                            interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral })
                        }
                    }
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}