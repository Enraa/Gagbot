const { MessageFlags, ComponentType, ButtonStyle } = require("discord.js");
const { parseTime } = require("../functions/timefunctions.js");
const { timelockChastity } = require("../functions/timelockfunctions.js");
const { getChastityKeyholder } = require("../functions/vibefunctions.js");
const { rollKeyFumbleN, rollKeyFumble } = require("../functions/keyfindingfunctions.js");
const { getPronouns } = require('./../functions/pronounfunctions.js')

module.exports = {
  async modalexecute(interaction) {
    console.log(interaction);

    let keyholder = interaction.user.id;
    const split = interaction.customId.split("_");
    const wearer = split[1];
    let tempKeyholder;
    if (wearer == keyholder) { // Should only ever be true if they're the same!
      tempKeyholder = interaction.fields.getSelectedUsers("userselection")?.keys()[0];
    } 
    if (tempKeyholder) keyholder = tempKeyholder;
    const timeString = interaction.fields.getTextInputValue("timelockinput");
    const timeStringSplit = timeString.split("-");
    if (timeStringSplit.length > 2) {
      interaction.reply({
        content: "A range must be between exactly 2 values",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

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

    if (keyholderAfter == 0 && rollKeyFumble(interaction.user.id, wearer)) {
      interaction.reply({
        content: "you are too frustrated to use the unlock action",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (timeStringSplit.length == 1) {
      const unlockTime = parseTime(timeString);
      interaction.reply(buildConfirmMessage(wearer, keyholder, unlockTime.getTime(), null, access, keyholderAfter));
    } else {
      const unlockTime1 = parseTime(timeStringSplit[0]);
      const unlockTime2 = parseTime(timeStringSplit[1]);

      if (unlockTime1 < unlockTime2) interaction.reply(buildConfirmMessage(wearer, keyholder, unlockTime1.getTime(), unlockTime2.getTime(), access, keyholderAfter));
      else if (unlockTime1 > unlockTime2) interaction.reply(buildConfirmMessage(wearer, keyholder, unlockTime2.getTime(), unlockTime1.getTime(), access, keyholderAfter));
      else interaction.reply(buildConfirmMessage(wearer, keyholder, unlockTime1.getTime(), null, access, keyholderAfter));
    }
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

        // disable frustration impact for now
        // const frustrationMultiplier = rollKeyFumbleN(interaction.user.id, wearer, 20).reduce((a, b) => a + b) / 100;
        // const modifiedUnlockTime = Number(unlockTime) + (Number(unlockTime) - Date.now()) * frustrationMultiplier;
        const modifiedUnlockTime = Number(unlockTime);

        if (timelockChastity(interaction.client, wearer, keyholder, Math.floor(modifiedUnlockTime), Number(access), Number(keyholderAfter), interaction.channel.id)) {
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

function buildConfirmMessage(wearer, keyholder, minUnlockTime, maxUnlockTime, access, keyholderAfter) {
  const timeString = maxUnlockTime ? `<t:${(minUnlockTime / 1000) | 0}:f> - <t:${(maxUnlockTime / 1000) | 0}:f>` : `<t:${(minUnlockTime / 1000) | 0}:f>`;
  const unlockTime = maxUnlockTime ? Math.floor(minUnlockTime + Math.random() * (maxUnlockTime - minUnlockTime)) : minUnlockTime;

  const warning = Math.max(minUnlockTime, maxUnlockTime) - Date.now() > 24 * 60 * 60 * 1000 ? `\n# YOU MAY LOCK ${(wearer == keyholder) ? `YOURSELF` : getPronouns(wearer, "object").toUpperCase()} FOR LONGER THAN 24 HOURS` : "";

  return {
    content: `# Timelock (Chastity Belt)\nConfirm locking ${(wearer == keyholder) ? `your chastity belt` : `<@${wearer}>'s chastity belt`} until ${timeString}?${warning}\nNote: Frustration may cause the actual unlock time to be later`,
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
