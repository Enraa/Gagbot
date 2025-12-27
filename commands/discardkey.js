const {
  SlashCommandBuilder,
  MessageFlags,
  ComponentType,
  ButtonStyle,
} = require("discord.js");
const { getHeavy } = require("../functions/heavyfunctions.js");
const { discardCollarKey, getCollarKeyholder } = require("../functions/collarfunctions.js");
const { discardChastityKey, getChastityKeyholder } = require("../functions/vibefunctions.js");
const { their, they } = require("../functions/pronounfunctions.js");
const { optins } = require("../functions/optinfunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("discardkey")
    .setDescription(`Discard keys you're holding`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chastity")
        .setDescription("Discard chastity key...")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys to who?").setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("collar")
        .setDescription("Discard collar key...")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys to who?").setRequired(false)
        )
    ),
  async execute(interaction) {
    const keyType = interaction.options.getSubcommand();
    const lockedUser = interaction.options.getUser("user") ?? interaction.user;

    if (!optins.getKeyDiscarding(lockedUser.id)) {
      interaction.reply({
        content: `${lockedUser} has not opted in to key discarding. ${they(
          lockedUser.id,
          true
        )} can do so using the \`/optins\` command.`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const restraint = getRestraintName(keyType, lockedUser.id);

    if (!restraint) {
      interaction.reply({
        content: "Unknown restraint, blame <@458684324653301770>",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    let getKeyholderFunction;
    let discardFunction;
    switch (keyType) {
      case "chastity":
        getKeyholderFunction = getChastityKeyholder;
        discardFunction = discardChastityKey;
        break;
      case "collar":
        getKeyholderFunction = getCollarKeyholder;
        discardFunction = discardCollarKey;
        break;
      default:
        interaction.reply({
          content: "Unknown restraint, blame <@458684324653301770>",
          flags: MessageFlags.Ephemeral,
        });
        return;
    }

    if (!getKeyholderFunction(lockedUser.id)) {
      if (lockedUser.id == interaction.user.id) {
        interaction.reply({
          content: "You are not locked in that type of restraint",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        interaction.reply({
          content: `${lockedUser} is not locked in that type of restraint`,
          flags: MessageFlags.Ephemeral,
        });
      }

      return;
    }

    if (getHeavy(interaction.user.id)) {
      interaction.reply(
        `${interaction.user} tugs against ${their(interaction.user.id)} ${
          getHeavy(interaction.user.id).type
        }, trying to give ${their(
          interaction.user.id
        )} keys to ${lockedUser}'s ${restraint} to someone else, but it is futile!`
      );
      return;
    }

    if (getKeyholderFunction(lockedUser.id) != interaction.user.id) {
      interaction.reply({
        content: `You do not have the key to ${lockedUser}'s ${restraint}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (lockedUser.id == interaction.user.id) {
      interaction.reply(
        `${interaction.user} discards the keys to ${their(
          lockedUser.id
        )} ${restraint}! Who knows when they'll be found.`
      );
      discardFunction(lockedUser.id);
    } else {
      interaction.reply(
        `${interaction.user} discards the keys to ${lockedUser}'s ${restraint}! Who knows when they'll be found.`
      );
      discardFunction(lockedUser.id);
    }
  },
};

// user is passed as an argument for future multiple types of belts or such
function getRestraintName(keyType, user) {
  switch (keyType) {
    case "chastity":
      return "chastity belt";
    case "collar":
      return "collar";
  }
}
