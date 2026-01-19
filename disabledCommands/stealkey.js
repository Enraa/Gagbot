const {
  SlashCommandBuilder,
  MessageFlags,
  ComponentType,
  ButtonStyle,
} = require("discord.js");
const { getHeavy } = require("../functions/heavyfunctions.js");
const {
  transferCollarKey,
  getCollar,
} = require("../functions/collarfunctions.js");
const {
  transferChastityKey,
  getChastity,
} = require("../functions/vibefunctions.js");
const { their } = require("../functions/pronounfunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stealkey")
    .setDescription(`Attempt to steal keys belonging to another keyholder`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chastity")
        .setDescription("Steal chastity key...")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys to who?").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("collar")
        .setDescription("Steal collar key...")
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys to who?").setRequired(true)
        )
    ),
  async execute(interaction) {
    // temporarily disabled since im not entirely sure what you want as checks to make a steal "valid", so currently it could be used to get around keyholders through an intermediary
    interaction.reply({
      content: "This command is disabled",
      flags: MessageFlags.Ephemeral,
    });
    return;

    const keyType = interaction.options.getSubcommand();

    const lockedUser = interaction.options.getUser("user");
    const restraint = getRestraintName(keyType, lockedUser.id);

    if (lockedUser.id == interaction.user.id) {
      interaction.reply({
        content: "You cannot steal keys to your own restraints",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (!restraint) {
      interaction.reply({
        content: "Unknown restraint, blame <@458684324653301770>",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    let getFunction;
    let transferFunction;
    switch (keyType) {
      case "chastity":
        getFunction = getChastity;
        transferFunction = transferChastityKey;
        break;
      case "collar":
        getFunction = getCollar;
        transferFunction = transferCollarKey;
        break;
      default:
        interaction.reply({
          content: "Unknown restraint, blame <@458684324653301770>",
          flags: MessageFlags.Ephemeral,
        });
        return;
    }

    if (!getFunction(lockedUser.id)) {
      interaction.reply({
        content: `${lockedUser} is not locked in that type of restraint`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (getHeavy(interaction.user.id)) {
      interaction.reply(
        `${interaction.user} tugs against ${their(interaction.user.id)} ${
          getHeavy(interaction.user.id).type
        }, trying to steal the keys to ${lockedUser}'s ${restraint} from someone else, but it is futile!`
      );
      return;
    }

    if (lockedUser.dmChannel) {
      sendKeyStealRequest(
        lockedUser.dmChannel,
        keyType,
        restraint,
        interaction.user
      );
    } else {
      let dmChannel = await lockedUser.createDM();
      sendKeyStealRequest(dmChannel, keyType, restraint, interaction.user);
    }

    interaction.reply({
      content: "Key steal request was sent",
      flags: MessageFlags.Ephemeral,
    });
  },
  componentHandlers: [
    {
      key: "stealkey",
      async handle(interaction, type, thief) {
        const restraint = getRestraintName(type, interaction.user.id);

        if (!restraint) {
          interaction.reply({
            content: "Unknown restraint, blame <@458684324653301770>",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        let transferFunction;
        switch (type) {
          case "chastity":
            transferFunction = transferChastityKey;
            break;
          case "collar":
            transferFunction = transferCollarKey;
            break;
          default:
            interaction.reply({
              content: "Unknown restraint, blame <@458684324653301770>",
              flags: MessageFlags.Ephemeral,
            });
            return;
        }

        if (transferFunction(interaction.user.id, newKeyholder)) {
          const channel = await interaction.client.channels.fetch(
            process.env.CHANNELID
          );
          channel.send(
            `<@${thief}> successfully stole the key to ${interaction.user}'s ${restraint}!`
          );
        } else {
          interaction.reply({
            content: "Failed to steal key, are you still locked?",
            flags: MessageFlags.Ephemeral,
          });
        }
      },
    },
  ],
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

async function sendKeyStealRequest(channel, keyType, restraint, thief) {
  channel.send({
    content: `${thief} is attempting to steal the key to your ${restraint}!\n(If you do not want this, just ignore this message)`,
    components: {
      type: ComponentType.ActionRow,
      components: {
        type: ComponentType.Button,
        label: "Allow theft",
        customId: `stealkey-${keyType}-${thief}`,
        style: ButtonStyle.Success,
      },
    },
  });
}
