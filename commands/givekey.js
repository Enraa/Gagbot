const {
  SlashCommandBuilder,
  MessageFlags,
  ComponentType,
  ButtonStyle,
} = require("discord.js");
const { getHeavy } = require("../functions/heavyfunctions.js");
const {
  transferCollarKey,
  getCollarKeyholder,
} = require("../functions/collarfunctions.js");
const {
  transferChastityKey,
  getChastityKeyholder,
} = require("../functions/vibefunctions.js");
const { their, them, getPronouns } = require("../functions/pronounfunctions.js");
const { optins } = require("../functions/optinfunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givekey")
    .setDescription(`Give keys to another keyholder`)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("chastity")
        .setDescription("Give chastity key...")
        .addUserOption((opt) =>
          opt
            .setName("keyholder")
            .setDescription("Who should own them instead?")
            .setRequired(true)
        )
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys for who?")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("collar")
        .setDescription("Give collar key...")
        .addUserOption((opt) =>
          opt
            .setName("keyholder")
            .setDescription("Who should own them instead?")
            .setRequired(true)
        )
        .addUserOption((opt) =>
          opt.setName("user").setDescription("Keys for who?")
        )
    ),
  async execute(interaction) {
    try {
      const keyType = interaction.options.getSubcommand();

      const lockedUser = interaction.options.getUser("user") ?? interaction.user;
      const restraint = getRestraintName(keyType, lockedUser.id);

      if (!restraint) {
        interaction.reply({
          content: "Unknown restraint, blame <@458684324653301770>",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const newKeyholder =
        interaction.options.getUser("keyholder") ?? interaction.user;

      if (interaction.user.id == newKeyholder.id) {
        interaction.reply({
          content: "You cannot give keys to yourself",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      let getKeyholderFunction;
      let transferFunction;
      switch (keyType) {
        case "chastity":
          getKeyholderFunction = getChastityKeyholder;
          transferFunction = transferChastityKey;
          break;
        case "collar":
          getKeyholderFunction = getCollarKeyholder;
          transferFunction = transferCollarKey;
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

      if (lockedUser.id == newKeyholder.id) {
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          interaction.reply(
            `${
              interaction.user
            } gives the keys to ${lockedUser}'s ${restraint} to ${them(
              lockedUser.id
            )}`
          );
        } else {
          interaction.reply({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
      } else if (lockedUser.id == interaction.user.id) {
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          interaction.reply(
            `${interaction.user} gives the keys to ${their(
              interaction.user.id
            )} ${restraint} to ${newKeyholder}`
          );
        } else {
          interaction.reply({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
      } else if (optins.getKeyGiving(lockedUser)) {
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          interaction.reply(
            `${interaction.user} gives the keys to ${lockedUser}'s ${restraint} to ${newKeyholder}`
          );
        } else {
          interaction.reply({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
      } else {
        if (lockedUser.dmChannel) {
          sendKeyTransferRequest(
            lockedUser.dmChannel,
            keyType,
            restraint,
            interaction.user,
            newKeyholder
          );
        } else {
          let dmChannel = await lockedUser.createDM();
          sendKeyTransferRequest(
            dmChannel,
            keyType,
            restraint,
            interaction.user,
            newKeyholder
          );
        }

        interaction.reply({
          content: "Key transfer request was sent",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    catch (err) {
      console.log("I don't know why this crashes.")
    }
  },
  componentHandlers: [
    {
      key: "transferkey",
      async handle(interaction, type, oldKeyholder, newKeyholder) {
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
            `<@${oldKeyholder}> gives the keys to ${interaction.user}'s ${restraint} to <@${newKeyholder}>`
          );
          interaction.reply({
            content: "Transfer successful",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.reply({
            content: "Failed to transfer key, are you still locked?",
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

async function sendKeyTransferRequest(
  channel,
  keyType,
  restraint,
  oldKeyholder,
  newKeyholder
) {
  channel.send({
    content: `${oldKeyholder} is attempting to transfer ${their(
      oldKeyholder.id
    )} key to your ${restraint} to ${newKeyholder}.\n(If you do not want this, just ignore this message)`,
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            label: "Allow transfer",
            customId: `transferkey-${keyType}-${oldKeyholder.id}-${newKeyholder.id}`,
            style: ButtonStyle.Success,
          },
        ],
      },
    ],
  });
}
