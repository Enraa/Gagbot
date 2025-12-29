const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { timelockChastityModal } = require("./../functions/interactivefunctions.js");
const { getChastity } = require("../functions/vibefunctions.js");
const { their } = require("../functions/pronounfunctions.js");
const { getHeavy } = require("../functions/heavyfunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timelock")
    .setDescription(`Lock yourself or your sub with a timer`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chastity")
        .setDescription("Lock a chastity belt...")
        .addUserOption((opt) => opt.setName("wearer").setDescription("Who wears the belt?").setRequired(false))
    ),
  async execute(interaction) {
    const actiontotake = interaction.options.getSubcommand();
    const wearer = interaction.options.getUser("wearer") ?? interaction.user;

    switch (actiontotake) {
      case "chastity":
        const chastity = getChastity(wearer.id);

        if (!chastity) {
          interaction.reply({
            content: `${wearer} is not wearing a belt`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (chastity.unlockTime) {
          interaction.reply({
            content: `${wearer}'s belt is already timelocked`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (chastity.keyholder != interaction.user.id) {
          interaction.reply({
            content: `You do not have the key to ${wearer}'s belt`,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (getHeavy(interaction.user.id)) {
          if (wearer == interaction.user) {
            interaction.reply(
              `${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${their(wearer.id)} chastity belt, but is completely stuck!`
            );
            return;
          } else {
            interaction.reply(
              `${interaction.user} pulls against ${their(wearer.id)} ${getHeavy(interaction.user.id).type} trying to apply a timelock to ${wearer}'s chastity belt, but is completely stuck!`
            );
            return;
          }
        }

        interaction.showModal(timelockChastityModal(interaction, wearer));
        break;
      default:
        interaction.reply({
          content: "Unsupported restraint",
          flags: MessageFlags.Ephemeral,
        });
    }
  }
};
