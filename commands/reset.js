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

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reset")
		.setDescription(`Moderator Only: Reset all restrictions on a user`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to reset")),
	async execute(interaction) {
        try {
            let resetuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
            if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
                // User has the permission, proceed with the action (e.g., a purge command)
                await interaction.reply({ content: `Resetting ${resetuser}`, flags: MessageFlags.Ephemeral });
                deleteGag(resetuser.id, undefined, true);
                deleteMitten(resetuser.id);
                removeChastity(resetuser.id, undefined, true);
                removeChastityBra(resetuser.id, undefined, true);
                if (process.toys) {
                    delete process.toys[resetuser.id];
                }
                removeCollar(resetuser.id);
                removeHeavy(resetuser.id, undefined, true);
                removeCorset(resetuser.id);
                deleteWearable(resetuser.id);
                deleteHeadwear(resetuser.id, undefined, true);
                setArousalCooldown(resetuser.id);
            } else {
                if (getServerOption(interaction.guildId, "server-safewordroleid") === "") {
                    // no safeword role was setup. Make the user talk to a mod.
                    await interaction.reply({ content: "Please DM a mod about this command if someone needs to be reset.", flags: MessageFlags.Ephemeral });
                } else if (getServerOption(interaction.guildId, "server-safewordroleid") && interaction.member.roles.cache.has(getServerOption(interaction.guildId, "server-safewordroleid"))) {
                    // User has the safeword role, we should remove all their restraints because they safeworded
                    await interaction.reply({ content: "Resetting all of your restraints because you are safeworded.", flags: MessageFlags.Ephemeral });
                    deleteGag(interaction.user.id, undefined, true);
                    deleteMitten(interaction.user.id);
                    removeChastity(interaction.user.id, undefined, true);
                    removeChastityBra(interaction.user.id, undefined, true);
                    if (process.toys) {
                        delete process.toys[interaction.user.id];
                    }
                    removeCollar(interaction.user.id);
                    removeHeavy(interaction.user.id, undefined, true);
                    removeCorset(interaction.user.id);
                    deleteWearable(interaction.user.id);
                    deleteHeadwear(interaction.user.id, undefined, true);
                    setArousalCooldown(interaction.user.id);
                } else {
                    // User does not have the permission, send an error message, but only if they don't have the safeworded role. If they do, then
                    await interaction.reply({ content: "Please DM a mod about this command if someone needs to be reset.", flags: MessageFlags.Ephemeral });
                }
            }
        }
		catch (err) {
            console.log(err);
        }
	},
};
