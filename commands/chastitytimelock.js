const { MessageFlags, ComponentType, ButtonStyle } = require("discord.js");
const { parseTime } = require("../functions/timefunctions.js");
const { timelockChastity } = require("../functions/timelockfunctions.js");
const { getChastityKeyholder } = require("../functions/vibefunctions.js");
const { rollKeyFumbleN } = require("../functions/keyfindingfunctions.js");

module.exports = {
  async modalexecute(interaction) {
    console.log(interaction);

    let keyholder = interaction.user.id;
    const split = interaction.customId.split("_");
    const wearer = split[1];
    if (keyholder == wearer && split[2]) keyholder = split[2];
    const timeString = interaction.fields.getTextInputValue("timelockinput");
    let access;
    switch (interaction.fields.getStringSelectValues("accesswhilebound")[0]) {
      case "access_others":
        access = 0;
        break;
      case "access_kh":
        access = 1;
        break;
      case "access_no":
        access = 2;
        break;
      default:
        interaction.reply({
          content: "Unknown access option value",
          flags: MessageFlags.Ephemeral,
        });
        return;
    }
    let keyholderAfter;
    switch (interaction.fields.getStringSelectValues("keyholderafter")[0]) {
      case "keyholder_unlock":
        keyholderAfter = 0;
        break;
      case "keyholder_return":
        keyholderAfter = 1;
        break;
      case "keyholder_keyholder":
        keyholderAfter = 2;
        break;
      default:
        interaction.reply({
          content: "Unknown return option value",
          flags: MessageFlags.Ephemeral,
        });
        return;
    }

    const unlockTime = parseTime(timeString);

    interaction.reply(buildConfirmMessage(wearer, keyholder, unlockTime.getTime(), access, keyholderAfter));
  },
  componentHandlers: [
    {
      key: "cctl",
      async handle(interaction, wearer, keyholder, unlockTime, access, keyholderAfter) {
        if (getChastityKeyholder(wearer) != wearer && getChastityKeyholder(wearer) != keyholder) {
          interaction.reply({
            content: "Keyholder has changed since start of timelocking",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        const frustrationMultiplier = 1 + rollKeyFumbleN(interaction.user.id, 20).reduce((a, b) => a + b) / 100;

        if (timelockChastity(interaction.client, wearer, keyholder, Number(unlockTime) * frustrationMultiplier, Number(access), Number(keyholderAfter))) {
          interaction.channel.send(`<@${wearer}>'s chastity belt has been locked with a timelock`);
          interaction.reply({
            content: "Timelock confirmed",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.reply({
            content: "Failed to timelock chastity belt",
            flags: MessageFlags.Ephemeral,
          });
        }
      },
    },
  ],
};

function buildConfirmMessage(wearer, keyholder, unlockTime, access, keyholderAfter) {
  return {
    content: `# Timelock (Chastity Belt)\nConfirm locking the belt until <t:${(unlockTime / 1000) | 0}:f>\nNote: Frustration may cause the actual unlock time to be later`,
    flags: MessageFlags.Ephemeral,
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            label: "Confirm",
            // shortened id since it hits 100 char limit
            customId: `cctl-${wearer}-${keyholder}-${unlockTime}-${access}-${keyholderAfter}`,
            style: ButtonStyle.Success,
          },
        ],
      },
    ],
  };
}
