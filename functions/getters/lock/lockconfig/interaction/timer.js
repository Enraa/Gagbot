const { SectionBuilder, ButtonStyle } = require("discord.js");
const { getLockAwaiting } = require("../../getLockAwaiting");

/********
 * Generates lock button elements for handling timer inputs. Provides timer setting and hiding the timer during use
 ********/
exports.timer = function (interaction, data) {
    let pagecomponents = [];
    // Timer Configuration
    let timertexttitle = `### Timer Configuration`
    let timertimeinfo = (getLockAwaiting(data.uuid)?.minTime ? (getLockAwaiting(data.uuid)?.maxTime ? `Will unlock between <t:${Math.floor((getLockAwaiting(data.uuid)?.minTime) / 1000)}:f> and <t:${Math.floor((getLockAwaiting(data.uuid)?.maxTime) / 1000)}:f>` : `Will unlock at <t:${Math.floor((getLockAwaiting(data.uuid)?.minTime) / 1000)}:f>`) : `*Timer not configured*`)
    let timerconfigsection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`${timertexttitle}\n\n${timertimeinfo}`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_timer_settimer`)
                .setLabel("Set Time")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(false)
        );
    pagecomponents.push(timerconfigsection)

    // Hiding the Timer
    let timerhidesection = new SectionBuilder()
        .addTextDisplayComponents((text) => text.setContent(`### Hide Timer While Active\n\nShould the timer be hidden while locked?`))
        .setButtonAccessory((button) =>
            button
                .setCustomId(`lockconfig_${data.uuid}_timer_hidetimer`)
                .setLabel(getLockAwaiting(data.uuid)?.hidetimer ? "Enabled" : "Disabled")
                .setStyle(getLockAwaiting(data.uuid)?.hidetimer ? ButtonStyle.Success : ButtonStyle.Danger)
                .setDisabled(false)
        );
    pagecomponents.push(timerhidesection)

    return pagecomponents;
}