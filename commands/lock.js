const { SlashCommandBuilder, TextDisplayBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { handleConsent } = require("./../functions/interactivefunctions.js");
const { getText } = require("./../functions/textfunctions.js");
const { getHeavy } = require("../functions/getters/heavy/getHeavy.js");
const { getGagLast } = require("../functions/getters/gag/getGagLast.js");
const { getMitten } = require("../functions/getters/mitten/getMitten.js");
const { getChastity } = require("../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra.js");
const { getHeadwear } = require("../functions/getters/headwear/getHeadwear.js");
const { getCorset } = require("../functions/getters/corset/getCorset.js");
const { getCollar } = require("../functions/getters/collar/getCollar.js");
const { convertGagText } = require("../functions/getters/gag/getGagName.js");
const { getMittenName } = require("../functions/getters/mitten/getMittenName.js");
const { getChastityName } = require("../functions/getters/chastity/getChastityName.js");
const { getChastityBraName } = require("../functions/getters/chastity/getChastityBraName.js");
const { getCollarName } = require("../functions/getters/collar/getCollarName.js");
const { getConsent } = require("../functions/getters/config/getConsent.js");
const { statsAddCounter } = require("../functions/setters/config/statsAddCounter.js");
const { getGag } = require("../functions/getters/gag/getGag.js");
const { addLockModal } = require("../functions/lockfunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");
const { getOption } = require("../functions/getters/config/getOption.js");
const { getTaggedList } = require("../functions/getters/config/getTaggedList.js");
const { getBaseLock } = require("../functions/getters/lock/getBaseLock.js");
const { getBaseItem } = require("../functions/getters/config/getBaseItem.js");
const { getGags } = require("../functions/getters/gag/getGags.js");
const { getBaseHeadwear } = require("../functions/getters/headwear/getBaseHeadwear.js");
const { getHeavyList } = require("../functions/getters/heavy/getHeavyList.js");
const { getBaseHeavy } = require("../functions/getters/heavy/getBaseHeavy.js");
const { getBaseGag } = require("../functions/getters/gag/getBaseGag.js");
const { getBaseMitten } = require("../functions/getters/mitten/getBaseMitten.js");
const { getBaseChastity } = require("../functions/getters/chastity/getBaseChastity.js");
const { getBaseCorset } = require("../functions/getters/corset/getBaseCorset.js");
const { getBaseCollar } = require("../functions/getters/collar/getBaseCollar.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lock")
		.setDescription("Put a lock on a restraint...")
        .addUserOption((opt) => opt.setName("wearer").setDescription("The person wearing the restraint to lock"))
        .addStringOption((opt) => opt.setName("restraint").setDescription("Which restraint to lock?").setAutocomplete(true))
        .addStringOption((opt) => opt.setName("locktype").setDescription("Which kind of lock to put on?").setAutocomplete(true)),
	async autoComplete(interaction) {
		const focusedValue = interaction.options.getFocused(true); // Note, we're extracting the entire object this time. 

        // Choosing the restraint we're focused on. 
        if (focusedValue.name == "restraint") {
            try {
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let heavybondage = getHeavyList(interaction.guildId, chosenuserid);
                let gagbondage = getGags(interaction.guildId, chosenuserid);
                let mittenbondage = getMitten(interaction.guildId, chosenuserid);
                let chastitybondage = getChastity(interaction.guildId, chosenuserid);
                let chastitybrabondage = getChastityBra(interaction.guildId, chosenuserid)
                let headbondage = getHeadwear(interaction.guildId, chosenuserid);
                let corsetbondage = getCorset(interaction.guildId, chosenuserid);
                let collarbondage = getCollar(interaction.guildId, chosenuserid);

                let outopts = [];
                if (heavybondage && heavybondage.length > 0) {
                    heavybondage.forEach((h) => {
                        if ((getBaseHeavy(h.type).heavytags?.length > 0) && !getBaseHeavy(h.type).nolock && !h.lock) {
                            outopts.push({ name: `Heavy Bondage: ${h.displayname}`, value: h.type });
                        }
                    })
                }
                if (gagbondage && (gagbondage.length > 0)) {
                    gagbondage.forEach((g) => {
                        if (!getBaseGag(g.gagtype).nolock && !g.lock) {
                            outopts.push({ name: `Gag: ${convertGagText(g.gagtype)}`, value: g.gagtype });
                        }
                    })
                }
                if (mittenbondage && mittenbondage.mittenname && !getBaseMitten(mittenbondage.mittenname).nolock && !mittenbondage.lock) {
                    outopts.push({ name: `Mittens: ${getBaseMitten(mittenbondage.mittenname).name}`, value: mittenbondage.mittenname });
                }
                if (chastitybondage && chastitybondage.chastitytype && !getBaseChastity(chastitybondage.chastitytype).nolock && !chastitybondage.lock) {
                    outopts.push({ name: `Chastity: ${getBaseChastity(chastitybondage.chastitytype).name}`, value: chastitybondage.chastitytype });
                }
                if (chastitybrabondage && chastitybrabondage.chastitytype && !getBaseChastity(chastitybrabondage.chastitytype).nolock && !chastitybrabondage.lock) {
                    outopts.push({ name: `Chastity Bra: ${getBaseChastity(chastitybrabondage.chastitytype).name}`, value: chastitybrabondage.chastitytype });
                }
                if (headbondage && headbondage.length > 0) {
                    headbondage.forEach((h) => {
                        if (!getBaseHeadwear(h.type).nolock && !h.lock) {
                            outopts.push({ name: `Head Restraints: ${getBaseHeadwear(h.type).name}`, value: h.type });
                        }
                    })
                }
                if (corsetbondage && !corsetbondage.lock && corsetbondage.type && !getBaseCorset(corsetbondage.type).nolock) {
                    outopts.push({ name: `Corset: ${getBaseCorset(corsetbondage.type).name}`, value: corsetbondage.type });
                }
                if (collarbondage && !collarbondage.lock && collarbondage.collartype && !getBaseCollar(collarbondage.collartype).nolock) {
                    outopts.push({ name: `Collar: ${getBaseCollar(collarbondage.collartype).name}`, value: collarbondage.collartype });
                }

                if (outopts.length == 0) {
                    outopts = [{ name: "Nothing", value: "nothing" }];
                } 
                await interaction.respond(outopts);
            } 
            catch (err) {
                console.log(err);
            }
        }

        // Choosing the type of lock we want to add
        else if (focusedValue.name == "locktype") {
            try {
                let chosenuserid = interaction.options.get("wearer")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
                let locktarget = interaction.options.get("restraint")?.value;
                let autocompletes = process.autocompletes.lock;
                // If locktarget is specified, filter out all locks to just what is eligible for that restraint target
                autocompletes = autocompletes.filter((f) => locktarget && getBaseItem(locktarget).locktypes.includes(getBaseLock(f.value).locktype))
                // For each lock, filter out any locks that do not pass the canAddLock
                autocompletes = autocompletes.filter((f) => getBaseLock(f.value).canAddLock({ serverID: interaction.guildId, userID: chosenuserid, locktarget: locktarget }))
                if (autocompletes.length == 0) {
                    interaction.respond([])
                    return;
                }

                let matches = didYouMean(focusedValue.value, autocompletes, {
                    matchPath: ['name'], 
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                    threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
                })
                
                if (matches.length == 0) {
                    matches = autocompletes;
                }
                let newsorted = matches;
                interaction.respond(newsorted.slice(0,25))
            }
            catch (err) {
                console.log(err);
                interaction.respond([]);
            }
        }
	},
    async execute(interaction) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral })
            addLockModal(interaction);
        }
        catch (err) {
            console.log(err);
        }
    }
}