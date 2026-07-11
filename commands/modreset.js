const { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } = require("discord.js");
const { setArousalCooldown } = require("../functions/vibefunctions.js");
const { deleteGag } = require("../functions/setters/gag/removeGag.js");
const { deleteMitten } = require("../functions/setters/mitten/removeMitten.js");
const { removeChastity } = require("../functions/setters/chastity/removeChastity.js");
const { removeChastityBra } = require("../functions/setters/chastity/removeChastityBra.js");
const { removeCollar } = require("../functions/setters/collar/removeCollar.js");
const { removeHeavy } = require("../functions/setters/heavy/removeHeavy.js");
const { removeCorset } = require("../functions/setters/corset/removeCorset.js");
const { deleteWearable } = require("../functions/setters/wearable/removeWearable.js");
const { deleteHeadwear } = require("../functions/setters/headwear/removeHeadwear.js");
const { getServerOption } = require("../functions/getters/config/getServerOption.js");
const { removeToy } = require("../functions/setters/toy/removeToy.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("modreset")
		.setDescription(`Moderator Only: Reset all restrictions on a user`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to reset").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
        try {
            let resetuser = interaction.options.getUser("user");
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) && resetuser) {
                // User has the permission, proceed with the action (e.g., a purge command)
                await interaction.reply({ content: `Resetting ${resetuser}`, flags: MessageFlags.Ephemeral });
                deleteGag(interaction.guildId, resetuser.id, undefined, true);
                deleteMitten(interaction.guildId, resetuser.id);
                removeChastity(interaction.guildId, resetuser.id, undefined, true);
                removeChastityBra(interaction.guildId, resetuser.id, undefined, true);
                removeToy(interaction.guildId, resetuser.id, undefined, undefined, true)
                removeCollar(interaction.guildId, resetuser.id);
                removeHeavy(interaction.guildId, resetuser.id, undefined, true);
                removeCorset(interaction.guildId, resetuser.id);
                deleteWearable(interaction.guildId, resetuser.id);
                deleteHeadwear(interaction.guildId, resetuser.id, undefined, true);
                setArousalCooldown(interaction.guildId, resetuser.id);
            } else {
                await interaction.reply({ content: "Gagbot looks at you quizzically, as it does not recognize who you're trying to reset or if you have the power to.", flags: MessageFlags.Ephemeral });
            }
        }
		catch (err) {
            console.log(err);
        }
	},
};
