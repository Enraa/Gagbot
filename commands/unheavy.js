const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { calculateTimeout } = require("./../functions/timefunctions.js");
const { getHeavy, removeHeavy, convertheavy, getHeavyList, getBaseHeavy, getHeavyBound } = require("./../functions/heavyfunctions.js");
const { getPronouns } = require("./../functions/pronounfunctions.js");
const { getConsent, handleConsent } = require("./../functions/interactivefunctions.js");
const { getText, getTextGeneric } = require("./../functions/textfunctions.js");
const { checkBondageRemoval, handleBondageRemoval } = require("../functions/interactivefunctions.js");
const { default: didYouMean, ReturnTypeEnums } = require("didyoumean2");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unheavy")
		.setDescription(`Free someone from their heavy bondage`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to free from their predicament..."))
        .addStringOption((opt) =>
			opt
				.setName("type")
				.setDescription("Which heavy restraint to remove?")
				.setAutocomplete(true),
		),
    async autoComplete(interaction) {
        try {
            const focusedValue = interaction.options.getFocused();
            let chosenuserid = interaction.options.get("user")?.value ?? interaction.user.id; // Note we can only retrieve the user ID here!
            let autocompletes = getHeavyList(chosenuserid).map((h) => { return { name: getBaseHeavy(h.type).name, value: h.type }})
            let matches = didYouMean(focusedValue, autocompletes, {
                matchPath: ['name'], 
                returnType: ReturnTypeEnums.ALL_SORTED_MATCHES, // Returns any match meeting 20% of the input
                threshold: 0.2, // Default is 0.4 - this is how much of the word must exist. 
            })
            
            if (matches.length == 0) {
                matches = autocompletes;
            }

            interaction.respond(matches.slice(0,25))
        }
		catch (err) {
            console.log(err);
        }
	},
	async execute(interaction) {
		try {
			let heavyuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
            let heavytype = interaction.options.getString("type") ?? getHeavy(heavyuser.id)?.type;
			// CHECK IF THEY CONSENTED! IF NOT, MAKE THEM CONSENT
			if (!getConsent(interaction.user.id)?.mainconsent) {
				await handleConsent(interaction, interaction.user.id);
				return;
			}
			let data = {
				textarray: "texts_unheavy",
				textdata: {
					interactionuser: interaction.user,
					targetuser: heavyuser,
					c1: getHeavy(interaction.user.id)?.displayname, // heavy bondage type
					c2: getHeavy(heavyuser.id, heavytype)?.displayname ?? getBaseHeavy(heavytype)?.name
				},
			};

			if (!getHeavy(heavyuser.id, heavytype)) {
				// They aren't bound lol.
				data.noheavy = true;
				data.noheavyequipped = true;
				data.other = true;
				interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
				return;
			}

			if (!getHeavyBound(interaction.user.id, heavyuser.id)) {
				// user IS in heavy bondage
				data.heavy = true;
				if (interaction.user == heavyuser) {
					data.self = true;
					interaction.reply(getText(data));
					return;
				} else {
					data.other = true;
					interaction.reply(getText(data));
					return;
				}
			} else {
				// Not in heavy bondage
				data.noheavy = true;
				if (getHeavy(heavyuser.id, heavytype)) {
					data.heavyequipped = true;
					// Now lets make sure the wearer wants that.
					if (checkBondageRemoval(interaction.user.id, heavyuser.id, "heavy") == true) {
						// Allowed immediately, lets go
						interaction.reply(getText(data));
						removeHeavy(heavyuser.id, heavytype);
					} else {
						// We need to ask first.
						let datatogeneric = Object.assign({}, data.textdata);
						datatogeneric.c1 = "heavy bondage";
						interaction.reply({ content: getTextGeneric("unbind", datatogeneric), flags: MessageFlags.Ephemeral });
						let canRemove = await handleBondageRemoval(interaction.user, heavyuser, getHeavy(heavyuser.id, heavytype)?.displayname ?? "heavy bondage").then(
							async (res) => {
								await interaction.editReply(getTextGeneric("unbind_accept", datatogeneric));
								await interaction.followUp(getText(data));
								removeHeavy(heavyuser.id, heavytype);
							},
							async (rej) => {
								await interaction.editReply(getTextGeneric("unbind_decline", datatogeneric));
							},
						);
					}
				} else {
					data.noheavyequipped = true;
					if (heavyuser == interaction.user) {
						data.self = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					} else {
						data.other = true;
						interaction.reply({ content: getText(data), flags: MessageFlags.Ephemeral });
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	},
};
