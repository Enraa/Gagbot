const { SlashCommandBuilder, ComponentType, ButtonBuilder, ActionRowBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { generateConfigModal, configoptions, getOption, setOption, config } = require('./../functions/configfunctions.js');
const { getHeadwear, getHeadwearName, getLockedHeadgear, addLockedHeadgear, removeLockedHeadgear } = require('./../functions/headwearfunctions.js');
const { canAccessCollar, promptCloneCollarKey, cloneCollarKey, revokeCollarKey, getClonedCollarKeysOwned, getOtherKeysCollar, getCollar, transferCollarKey, promptTransferCollarKey } = require('./../functions/collarfunctions.js');
const { canAccessChastity, promptCloneChastityKey, cloneChastityKey, revokeChastityKey, getClonedChastityKeysOwned, getOtherKeysChastity, getChastity, transferChastityKey, promptTransferChastityKey } = require('./../functions/vibefunctions.js');
const { getText, getTextGeneric } = require('./../functions/textfunctions.js');
const { getPronouns } = require('../functions/pronounfunctions.js');
const { getChastityBra } = require('../functions/vibefunctions.js');
const { canAccessChastityBra } = require('../functions/vibefunctions.js');
const { getClonedChastityBraKeysOwned } = require('../functions/vibefunctions.js');
const { getOtherKeysChastityBra } = require('../functions/vibefunctions.js');
const { cloneChastityBraKey } = require('../functions/vibefunctions.js');
const { promptCloneChastityBraKey } = require('../functions/vibefunctions.js');
const { revokeChastityBraKey } = require('../functions/vibefunctions.js');
const { transferChastityBraKey } = require('../functions/vibefunctions.js');
const { promptTransferChastityBraKey } = require('../functions/vibefunctions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('key')
        .setDescription(`Prevent a worn item from being removed...`)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("clone")
				.setDescription("Clone a primary key you're holding...")
                .addUserOption((opt) => 
                    opt.setName("wearer")
						.setDescription("Whose restraint to clone key for?")
					)
				.addStringOption((opt) => 
					opt.setName("restraint")
						.setDescription("Which restraint of theirs to clone?")
						.setAutocomplete(true)
					)
                .addUserOption((opt) => 
                    opt.setName("clonedkeyholder")
						.setDescription("Who to give the copied key to?")
					)    
		)
		.addSubcommand((subcommand) =>
      		subcommand
				.setName("revoke")
				.setDescription("Revoke a cloned key")
				.addStringOption((opt) => 
					opt.setName("clones")
						.setDescription("Which key clone to revoke?")
						.setAutocomplete(true)
					)  
		)
        .addSubcommand((subcommand) =>
      		subcommand
				.setName("give")
				.setDescription("Give a primary key you're holding...")
                .addUserOption((opt) => 
                    opt.setName("wearer")
						.setDescription("Whose restraint to give key for?")
					)
				.addStringOption((opt) => 
					opt.setName("restraint")
						.setDescription("Which restraint of theirs to give key for?")
						.setAutocomplete(true)
					)
                .addUserOption((opt) => 
                    opt.setName("newkeyholder")
						.setDescription("Who to give the key to?")
					)  
    ),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(); 
		let subcommand = interaction.options.getSubcommand();
		try {
			if (subcommand == "clone" || subcommand == "give") {
                // We want to return ONLY options that the user COULD clone a key for
                // So if they own a collar key, it only gives "Collar"
                let chosenuserid = interaction.options.get('wearer')?.value ?? interaction.user.id // Note we can only retrieve the user ID here!
				let collarkeyholder = (getCollar(chosenuserid) && canAccessCollar(chosenuserid, interaction.user.id, undefined, true).access);
                let chastitykeyholder = (getChastity(chosenuserid) && canAccessChastity(chosenuserid, interaction.user.id, undefined, true).access);
                let chastitybrakeyholder = (getChastityBra(chosenuserid) && canAccessChastityBra(chosenuserid, interaction.user.id, undefined, true).access);

				let choices = [];
                if (!collarkeyholder && !chastitykeyholder && !chastitybrakeyholder) {
                    choices = [{ name: "No Keys Available", value: "nokeys" }]
                }
                if (collarkeyholder) {
                    choices.push({ name: "Collar", value: "collar" })
                }
                if (chastitykeyholder) {
                    choices.push({ name: "Chastity Belt", value: "chastitybelt" })
                }
                if (chastitybrakeyholder) {
                    choices.push({ name: "Chastity Bra", value: "chastitybra" })
                }

				await interaction.respond(choices)
			}
			else if (subcommand == "revoke") {
				let ownedclonedchastitykeys = getClonedChastityKeysOwned(interaction.user.id)
                let ownedclonedchastitybrakeys = getClonedChastityBraKeysOwned(interaction.user.id)
                let ownedclonedcollarkeys = getClonedCollarKeysOwned(interaction.user.id)

                let clonedchastitykeys = getOtherKeysChastity(interaction.user.id)
                let clonedchastitybrakeys = getOtherKeysChastityBra(interaction.user.id)
                let clonedcollarkeys = getOtherKeysCollar(interaction.user.id)

                // Iterate over every member, ensuring that they are cached using the await command.
                // I hate this code. It feels sloppy. 
                ownedclonedchastitykeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                })
                ownedclonedchastitybrakeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                })
                ownedclonedcollarkeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                })
                clonedchastitykeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                    await interaction.guild.members.fetch(m.split("_")[1]); 
                })
                clonedchastitybrakeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                    await interaction.guild.members.fetch(m.split("_")[1]); 
                })
                clonedcollarkeys.forEach(async (m) => {
                    await interaction.guild.members.fetch(m.split("_")[0]); 
                    await interaction.guild.members.fetch(m.split("_")[1]); 
                })

                // Unfortunately, we will still get undefined for names the FIRST time this is invoked. 
                // Assuming the bot hasn't seen the user say anything that instance. 
                // We need to consider a future solution. 
                // Maybe have the bot do an await fetch on every member in it's process variables during index.js init.

                ownedclonedchastitykeys = ownedclonedchastitykeys.map((k) => {
                    return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity belt`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}`}
                })
                ownedclonedchastitybrakeys = ownedclonedchastitybrakeys.map((k) => {
                    return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity bra`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}`}
                })
                ownedclonedcollarkeys = ownedclonedcollarkeys.map((k) => {
                    return { name: `Your key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s collar`, value: `${k.split("_")[0]}_${interaction.user.id}_${k.split("_")[1]}`}
                })
                clonedchastitykeys = clonedchastitykeys.map((k) => {
                    return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity belt`.slice(0,100), value: `${k}_chastitybelt` }
                })
                clonedchastitybrakeys = clonedchastitybrakeys.map((k) => {
                    return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s chastity bra`.slice(0,100), value: `${k}_chastitybra` }
                })
                clonedcollarkeys = clonedcollarkeys.map((k) => {
                    return { name: `${interaction.guild.members.cache.get(k.split("_")[1])?.displayName}'s key to ${interaction.guild.members.cache.get(k.split("_")[0])?.displayName}'s collar`.slice(0,100), value: `${k}_collar` }
                })
                
                console.log(ownedclonedchastitykeys)
                console.log(ownedclonedcollarkeys)
                console.log(clonedchastitykeys)
                console.log(clonedcollarkeys)

				let sorted = [...clonedchastitykeys, ...clonedchastitybrakeys, ...clonedcollarkeys, ...ownedclonedchastitykeys, ...ownedclonedchastitybrakeys, ...ownedclonedcollarkeys]
				if (sorted.length == 0) {
					sorted = [{ name: "No Eligible Keys To Revoke...", value: "nothing" }]
				}
                else if ((sorted.filter((f) => (f.name.toLowerCase()).includes(focusedValue.toLowerCase())).slice(0,25).length == 0) && focusedValue.length > 0) {
                    sorted = [{ name: "No Eligible Keys To Revoke...", value: "nothing" }]
                }
				await interaction.respond(sorted)
			}
		}
		catch (err) {
			console.log(err);
		}
	},
	async execute(interaction) {
		try {	
            let subcommand = interaction.options.getSubcommand();
            let choiceemoji;

            if (subcommand == "clone") {
                let wearertoclone = interaction.options.getUser("wearer") ?? interaction.user;
                let chosenrestrainttoclone = interaction.options.getString("restraint")
                let clonedkeyholder = interaction.options.getUser("clonedkeyholder")
                
                // We're missing info, back to the start!
                if (!wearertoclone || !chosenrestrainttoclone || !clonedkeyholder) {
                    interaction.reply({ content: `Something went wrong. The command was parsed as:\nClone ${wearertoclone}'s key for ${chosenrestrainttoclone} and give to ${clonedkeyholder}!`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // Check if the interaction user has access to clone the target restraint.
                let canclone = false;
                let chosenrestraintreadable;
                if (chosenrestrainttoclone == "collar" && getCollar(wearertoclone.id) && canAccessCollar(wearertoclone.id, interaction.user.id, undefined, true).access) { 
                    canclone = true 
                    chosenrestraintreadable = "collar";
                    choiceemoji = "<:collar:1449984183261986939>";
                }
                if (chosenrestrainttoclone == "chastitybelt" && getChastity(wearertoclone.id) && canAccessChastity(wearertoclone.id, interaction.user.id, undefined, true).access) { 
                    canclone = true 
                    chosenrestraintreadable = "chastity belt"
                    choiceemoji = "<:Chastity:1073495208861380629>"
                }
                if (chosenrestrainttoclone == "chastitybra" && getChastityBra(wearertoclone.id) && canAccessChastityBra(wearertoclone.id, interaction.user.id, undefined, true).access) { 
                    canclone = true 
                    chosenrestraintreadable = "chastity bra"
                    choiceemoji = "<:chastitybra:1457992137164718152>"
                }
                if (!canclone) {
                    interaction.reply({ content: `You do not have the keys for ${wearertoclone}'s ${chosenrestrainttoclone}.`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // We can't hold a clone of a restraint we have primary keys for.
                if (interaction.user == clonedkeyholder) {
                    interaction.reply({ content: `You can't give yourself a copy of the primary key!`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // At this point, we're sure this is a valid cloning attempt. Prompt the user that this is what they want to do.
                // Prompt and ensure the user intended to run this command for this combination. 
                let components = [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Cancel",
                                customId: `cancel`,
                                style: ButtonStyle.Danger,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Clone the Key",
                                customId: `agreetoclonebutton`,
                                style: ButtonStyle.Success,
                            }
                        ],
                    },
                ]

                let responsetext = `Cloning the keys for ${choiceemoji}${wearertoclone} and giving the copy to 🔑${clonedkeyholder}.\n\nPlease confirm by pressing the button below:`
                if (wearertoclone == interaction.user) {
                    responsetext = `Cloning the keys for your ${choiceemoji}${chosenrestraintreadable} and giving the copy to 🔑${clonedkeyholder}. You will retain full access to your restraints while ${clonedkeyholder} has the cloned key.\n\nPlease confirm by pressing the button below:`
                }

                let response = await interaction.reply({ 
                    content: responsetext, 
                    flags: MessageFlags.Ephemeral, 
                    components: components,
                    withResponse: true 
                })
                let confirmation;

                const collectorFilter = (i) => i.user.id === interaction.user.id;
                try {
                    confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                    if (confirmation.customId === 'agreetoclonebutton') {
                        // Skip the DM if it's the wearer giving a clone of their key.
                        if ((wearertoclone == interaction.user) || (wearertoclone == clonedkeyholder)) {
                            let data = {
                                textarray: "texts_key",
                                textdata: {
                                    interactionuser: interaction.user,
                                    targetuser: wearertoclone,
                                    c1: chosenrestraintreadable,
                                    c2: clonedkeyholder
                                }
                            }
                            data.clone = true;
                            data.self = true;
                            data[chosenrestrainttoclone] = true;
                            if (chosenrestrainttoclone == "collar") {
                                await confirmation.update({ content: getTextGeneric("clone_accept_self", data.textdata) , components: [] })
                                await confirmation.followUp(getText(data))
                                cloneCollarKey(wearertoclone.id, clonedkeyholder.id);
                            }
                            else if (chosenrestrainttoclone == "chastitybelt") {
                                await confirmation.update({ content: getTextGeneric("clone_accept_self", data.textdata), components: [] })
                                await confirmation.followUp(getText(data))
                                cloneChastityKey(wearertoclone.id, clonedkeyholder.id);
                            }
                            else if (chosenrestrainttoclone == "chastitybra") {
                                await confirmation.update({ content: getTextGeneric("clone_accept_self", data.textdata), components: [] })
                                await confirmation.followUp(getText(data))
                                cloneChastityBraKey(wearertoclone.id, clonedkeyholder.id);
                            }
                        }
                        else {
                            await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
                            if (chosenrestrainttoclone == "collar") {
                                let canRemove = await promptCloneCollarKey(interaction.user, wearertoclone, clonedkeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearertoclone,
                                            c1: chosenrestraintreadable,
                                            c2: clonedkeyholder
                                        }
                                    }
                                    data.clone = true;
                                    data.other = true;
                                    data[chosenrestrainttoclone] = true;
                                    await confirmation.editReply(getTextGeneric("clone_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    cloneCollarKey(wearertoclone.id, clonedkeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    await interaction.editReply(getTextGeneric("clone_decline", datatogeneric))
                                })
                            }
                            else if (chosenrestrainttoclone == "chastitybelt") {
                                let canRemove = await promptCloneChastityKey(interaction.user, wearertoclone, clonedkeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearertoclone,
                                            c1: chosenrestraintreadable,
                                            c2: clonedkeyholder
                                        }
                                    }
                                    data.clone = true;
                                    data.other = true;
                                    data[chosenrestrainttoclone] = true;
                                    await confirmation.editReply(getTextGeneric("clone_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    cloneChastityKey(wearertoclone.id, clonedkeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    await interaction.editReply(getTextGeneric("clone_decline", datatogeneric))
                                })
                            }
                            else if (chosenrestrainttoclone == "chastitybra") {
                                let canRemove = await promptCloneChastityBraKey(interaction.user, wearertoclone, clonedkeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearertoclone,
                                            c1: chosenrestraintreadable,
                                            c2: clonedkeyholder
                                        }
                                    }
                                    data.clone = true;
                                    data.other = true;
                                    data[chosenrestrainttoclone] = true;
                                    await confirmation.editReply(getTextGeneric("clone_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    cloneChastityBraKey(wearertoclone.id, clonedkeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    await interaction.editReply(getTextGeneric("clone_decline", datatogeneric))
                                })
                            }
                        }
                    } else if (confirmation.customId === 'cancel') {
                        await confirmation.update({ content: 'Action cancelled', components: [] });
                        return; // Stop with the key cloning immediately. 
                    }
                } 
                catch (err) {
                    console.log(err);
                    await interaction.editReply({ content: 'Confirmation not received within 30 seconds, cancelling transfer.', components: [] });
                    return;
                }
            }
            else if (subcommand == "revoke") {
                let cloneresponse = interaction.options.getString("clones") 

                // We're missing a string, back to the start!
                if (!cloneresponse) {
                    interaction.reply({ content: `Something went wrong. You provided no option.`, flags: MessageFlags.Ephemeral })
                    return;
                }

                let clonedkeyholder = await interaction.guild.members.fetch(cloneresponse.split("_")[1])
                let wearer = await interaction.guild.members.fetch(cloneresponse.split("_")[0])
                let typeofrestraint = cloneresponse.split("_")[2]

                /*console.log(typeofrestraint)
                if (typeofrestraint == "chastitybelt") {
                    console.log(getChastity(wearer.id));
                    console.log(canAccessChastity(wearer.id, interaction.user.id, undefined, true).access)
                }*/

                // Check if the interaction user has access to clone the target restraint.
                let canrevoke = false;
                let isclone = false;
                let typeofrestraintreadable;
                // Has primary keys to the collar!
                if (typeofrestraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id, undefined, true).access) { 
                    canrevoke = true 
                    typeofrestraintreadable = "collar";
                    choiceemoji = "<:collar:1449984183261986939>";
                }
                if (typeofrestraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id, undefined, true).access) { 
                    canrevoke = true 
                    typeofrestraintreadable = "chastity belt"
                    choiceemoji = "<:Chastity:1073495208861380629>"
                }
                if (typeofrestraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id, undefined, true).access) { 
                    canrevoke = true 
                    typeofrestraintreadable = "chastity bra"
                    choiceemoji = "<:chastitybra:1457992137164718152>"
                }
                // Allow cloned key to be revoked if the cloned keyholder is the interaction user. 
                if (typeofrestraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id).access && (clonedkeyholder == interaction.user)) { 
                    canrevoke = true 
                    typeofrestraintreadable = "collar";
                    choiceemoji = "<:collar:1449984183261986939>";
                }
                if (typeofrestraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id).access && (clonedkeyholder == interaction.user)) { 
                    canrevoke = true 
                    typeofrestraintreadable = "chastity belt"
                    choiceemoji = "<:Chastity:1073495208861380629>"
                }
                if (typeofrestraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id).access && (clonedkeyholder == interaction.user)) { 
                    canrevoke = true 
                    typeofrestraintreadable = "chastity bra"
                    choiceemoji = "<:chastitybra:1457992137164718152>"
                }
                if ((clonedkeyholder == interaction.user)) {
                    isclone = true;
                }
                if (!canrevoke) {
                    if (!isclone) {
                        interaction.reply({ content: `You do not have the primary keys for ${wearer}'s ${typeofrestraintreadable}.`, flags: MessageFlags.Ephemeral })
                        return;
                    }
                    else {
                        interaction.reply({ content: `You do not have a cloned key for ${wearer}'s ${typeofrestraintreadable}.`, flags: MessageFlags.Ephemeral })
                        return;
                    }
                }

                // At this point, we're sure this is a valid Revoke attempt. Prompt the user that this is what they want to do.
                // Prompt and ensure the user intended to run this command for this combination. 
                let components = [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Cancel",
                                customId: `cancel`,
                                style: ButtonStyle.Danger,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Revoke the Key",
                                customId: `agreetorevokebutton`,
                                style: ButtonStyle.Success,
                            }
                        ],
                    },
                ]

                let verifyresponse = `Revoking the cloned keys for ${choiceemoji}${wearer} from 🔑${clonedkeyholder}. ${clonedkeyholder} will no longer have access to ${wearer}'s ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`
                if (wearer.id == clonedkeyholder.id) {
                    // they hold their own cloned key. 
                    verifyresponse = `Revoking the cloned keys for ${choiceemoji}${wearer} from 🔑${clonedkeyholder}. ${getPronouns(clonedkeyholder.id, "subject", true)} will no longer have access to ${getPronouns(clonedkeyholder.id, "possessiveDeterminer")} ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`
                }
                if (isclone) {
                    verifyresponse = `Revoking your cloned keys for ${choiceemoji}${wearer}. You will no longer have access to ${wearer}'s ${typeofrestraintreadable}.\n\nPlease confirm by pressing the button below:`
                }

                let response = await interaction.reply({ 
                    content: verifyresponse, 
                    flags: MessageFlags.Ephemeral, 
                    components: components,
                    withResponse: true 
                })
                let confirmation;

                const collectorFilter = (i) => i.user.id === interaction.user.id;
                try {
                    confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                    if (confirmation.customId === 'agreetorevokebutton') {
                        let data = {
                            textarray: "texts_key",
                            textdata: {
                                interactionuser: interaction.user,
                                targetuser: wearer,
                                c1: typeofrestraintreadable,
                                c2: clonedkeyholder
                            }
                        }
                        data.revoke = true
                        if (isclone) {
                            data.isclone = true;
                        }
                        else {
                            data.isprimary = true;
                        }
                        data[typeofrestraint] = true;
                        if (typeofrestraint == "collar") {
                            await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] })
                            await confirmation.followUp(getText(data))
                            revokeCollarKey(wearer.id, clonedkeyholder.id);
                        }
                        else if (typeofrestraint == "chastitybelt") {
                            await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] })
                            await confirmation.followUp(getText(data))
                            revokeChastityKey(wearer.id, clonedkeyholder.id);
                        }
                        else if (typeofrestraint == "chastitybra") {
                            await confirmation.update({ content: getTextGeneric("revoke_accept", data.textdata), components: [] })
                            await confirmation.followUp(getText(data))
                            revokeChastityBraKey(wearer.id, clonedkeyholder.id);
                        }
                    } else if (confirmation.customId === 'cancel') {
                        await confirmation.update({ content: 'Action cancelled', components: [] });
                        return; // Stop with the key revokation immediately. 
                    }
                } 
                catch (err) {
                    console.log(err);
                    await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling transfer.', components: [] });
                    return;
                }
            } else if (subcommand == "give") {
                const wearer = interaction.options.getUser("wearer") ?? interaction.user;
                const restraint = interaction.options.getString("restraint")
                const newKeyholder = interaction.options.getUser("newkeyholder")
                
                // We're missing info, back to the start!
                if (!wearer || !restraint || !newKeyholder) {
                    interaction.reply({ content: `Something went wrong. The command was parsed as:\nGive ${wearer}'s key for ${restraint} and give to ${newKeyholder}!`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // We can't give to ourselves lol
                if (interaction.user == newKeyholder) {
                    interaction.reply({ content: `You can't give yourself the key you're holding!`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // Check if the interaction user has access to give the key for the target restraint.
                let cangive = false;
                let chosenrestraintreadable;
                if (restraint == "collar" && getCollar(wearer.id) && canAccessCollar(wearer.id, interaction.user.id, undefined, true)) { 
                    cangive = true 
                    chosenrestraintreadable = "collar";
                    choiceemoji = "<:collar:1449984183261986939>";
                }
                if (restraint == "chastitybelt" && getChastity(wearer.id) && canAccessChastity(wearer.id, interaction.user.id, undefined, true)) { 
                    cangive = true 
                    chosenrestraintreadable = "chastity belt"
                    choiceemoji = "<:Chastity:1073495208861380629>"
                }
                if (restraint == "chastitybra" && getChastityBra(wearer.id) && canAccessChastityBra(wearer.id, interaction.user.id, undefined, true)) { 
                    cangive = true 
                    chosenrestraintreadable = "chastity bra"
                    choiceemoji = "<:chastitybra:1457992137164718152>"
                }
                if (!cangive) {
                    interaction.reply({ content: `You do not have the keys for ${wearer}'s ${restraint}.`, flags: MessageFlags.Ephemeral })
                    return;
                }

                // At this point, we're sure this is a valid giving attempt. Prompt the user that this is what they want to do.
                // Prompt and ensure the user intended to run this command for this combination. 
                let components = [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "Cancel",
                                customId: `cancel`,
                                style: ButtonStyle.Danger,
                            },
                            {
                                type: ComponentType.Button,
                                label: "Give the Key",
                                customId: `agreetogivebutton`,
                                style: ButtonStyle.Success,
                            }
                        ],
                    },
                ]

                let responsetext = `Giving the keys for ${choiceemoji}${wearer} to 🔑${newKeyholder}. *You will no longer be able to access that restraint.*\n\nPlease confirm by pressing the button below:`
                if (wearer == interaction.user) {
                    responsetext = `Giving the keys for your ${choiceemoji}${chosenrestraintreadable} to 🔑${newKeyholder}. *You will no longer be able to access your restraint.*\n\nPlease confirm by pressing the button below:`
                }

                let response = await interaction.reply({ 
                    content: responsetext, 
                    flags: MessageFlags.Ephemeral, 
                    components: components,
                    withResponse: true 
                })
                let confirmation;

                const collectorFilter = (i) => i.user.id === interaction.user.id;
                try {
                    confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });

                    if (confirmation.customId === 'agreetogivebutton') {
                        // Skip the DM if the wearer is the giver or receiver, or if they have auto accepting enabled
                        if (wearer == interaction.user || wearer == newKeyholder || config.getKeyGivingAuto(wearer.id)) {
                            let data = {
                                textarray: "texts_key",
                                textdata: {
                                    interactionuser: interaction.user,
                                    targetuser: wearer,
                                    c1: chosenrestraintreadable,
                                    c2: newKeyholder
                                }
                            }
                            data.give = true;
                            if (wearer == interaction.user) {
                                data.self = true;
                            }
                            else {
                                data.other = true;
                            }
                            data[restraint] = true;
                            if (restraint == "collar") {
                                await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata) , components: [] })
                                await confirmation.followUp(getText(data))
                                transferCollarKey(wearer.id, newKeyholder.id);
                            }
                            else if (restraint == "chastitybelt") {
                                await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] })
                                await confirmation.followUp(getText(data))
                                transferChastityKey(wearer.id, newKeyholder.id);
                            }
                            else if (restraint == "chastitybra") {
                                await confirmation.update({ content: getTextGeneric("give_accept_self", data.textdata), components: [] })
                                await confirmation.followUp(getText(data))
                                transferChastityBraKey(wearer.id, newKeyholder.id);
                            }
                        }
                        else {
                            await confirmation.update({ content: `Prompting the user for permission.`, components: [] });
                            if (restraint == "collar") {
                                let canRemove = await promptTransferCollarKey(interaction.user, wearer, newKeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    data.give = true;
                                    data.other = true;
                                    data[restraint] = true;
                                    await confirmation.editReply(getTextGeneric("give_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    transferCollarKey(wearer.id, newKeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    await interaction.editReply(getTextGeneric("give_decline", data.textdata))
                                })
                            }
                            else if (restraint == "chastitybelt") {
                                let canRemove = await promptTransferChastityKey(interaction.user, wearer, newKeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    data.give = true;
                                    data.other = true;
                                    data[restraint] = true;
                                    await confirmation.editReply(getTextGeneric("give_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    transferChastityKey(wearer.id, newKeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    await interaction.editReply(getTextGeneric("give_decline", data.textdata))
                                })
                            }
                            else if (restraint == "chastitybra") {
                                let canRemove = await promptTransferChastityBraKey(interaction.user, wearer, newKeyholder).then(async (res) => {
                                    // User said yes
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    data.give = true;
                                    data.other = true;
                                    data[restraint] = true;
                                    await confirmation.editReply(getTextGeneric("give_accept", data.textdata))
                                    await confirmation.followUp(getText(data))
                                    transferChastityBraKey(wearer.id, newKeyholder.id);
                                }, async (rej) => {
                                    // User said no.
                                    let data = {
                                        textarray: "texts_key",
                                        textdata: {
                                            interactionuser: interaction.user,
                                            targetuser: wearer,
                                            c1: chosenrestraintreadable,
                                            c2: newKeyholder
                                        }
                                    }
                                    await interaction.editReply(getTextGeneric("give_decline", data.textdata))
                                })
                            }
                        }
                    } else if (confirmation.customId === 'cancel') {
                        await confirmation.update({ content: 'Action cancelled', components: [] });
                        return; // Stop with the key cloning immediately. 
                    }
                } 
                catch (err) {
                    console.log(err);
                    await interaction.editReply({ content: 'Confirmation not received within 30 seconds, cancelling transfer.', components: [] });
                    return;
                }
            }
		}
		catch (err) {
			console.log(err)
		}
    }
}