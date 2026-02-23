const { ModalBuilder, LabelBuilder, MessageFlags, TextInputStyle } = require("discord.js");
const { setOption, getOption } = require("../../functions/configfunctions");
const { TextInputBuilder } = require("discord.js");

exports.modal = async (interaction, userid) => {
    let modal = new ModalBuilder()
        .setCustomId(`modalevent_collarengraved_${interaction.user.id}_${userid}`)
        .setTitle(`Engraved Name`)

    let outLabel = `Enter what your name should be:`
    const choicetextentry = new TextInputBuilder()
        .setCustomId("choiceinput")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Name")
        .setRequired(true);

    const userselectlabel = new LabelBuilder()
        .setLabel(`Pet Name`)
        .setDescription(outLabel)
        .setTextInputComponent(choicetextentry);

    modal.addLabelComponents(userselectlabel)

    return modal;
}

exports.modalexecute = async (interaction) => {
    interaction.deferUpdate();
    setOption(user.id, "engravedcollarname", interaction.fields.getTextInputValue("choiceinput").slice(0,30));
    await interaction.reply({ content: `Updated your engraved pet tag to ${getOption(user.id, "engravedcollarname")}`, flags: MessageFlags.Ephemeral })
}