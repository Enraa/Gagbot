const { SlashCommandBuilder, TextDisplayBuilder } = require("discord.js")
const { inspectModal } = require("../functions/outfitfunctions");
const { getHeadwearRestrictions } = require("../functions/headwearfunctions");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("inspect")
		.setDescription(`Inspect someone's restraints if they are wearing any`)
		.addUserOption((opt) => opt.setName("user").setDescription("Who to inspect (blank to inspect yourself)")),
    async execute(interaction) {
        try {
            let inspectuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
            interaction.reply(await inspectModal(interaction.user.id, inspectuser.id, "overview", 1))
        }
        catch (err) {
            console.log(err)
        }
    },
    async interactionresponse(interaction) {
        console.log(interaction)
        let options = interaction.customId.split("_")
        let menu = options[1]
        let choiceinput = options[2]
        let page = options[3]
        if ((interaction.customId == `inspect_overview_newuser_1`) && interaction.values) {
            choiceinput = interaction.values[0]
        }
        interaction.update(await inspectModal(interaction.user.id, choiceinput, menu, page))
    },
    async help(userid, page) {
        let restrictedtext = (!getHeadwearRestrictions(userid).canInspect) ? `***You cannot see others currently***\n` : ""
        let overviewtext = `## Inspect
### Usage: /inspect (user)
### Additionally, right click a message or user, Apps -> Inspect User
-# Restricted if blindfolded
${restrictedtext}
Provides detailed information on what an individual is wearing, who is holding the **Keys** to their **Restraints**, and any **Keys** they are holding. When blindfolded, limited information can be displayed on self, while no information can be seen on others.`
        overviewtextdisplay = new TextDisplayBuilder().setContent(overviewtext)
        return overviewtextdisplay;
    }
}