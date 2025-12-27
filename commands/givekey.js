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

      let components = [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							label: "Cancel",
							customId: `cancel`,
							style: ButtonStyle.Danger,
					  	},
					  	{
							type: ComponentType.Button,
							label: "Proceed to transfer",
							customId: `agreetotransferbutton`,
							style: ButtonStyle.Success,
					  	}
					],
				},
			]

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
      let choiceemoji;
      switch (keyType) {
        case "chastity":
          getKeyholderFunction = getChastityKeyholder;
          transferFunction = transferChastityKey;
          choiceemoji = "<:Chastity:1073495208861380629>"
          break;
        case "collar":
          getKeyholderFunction = getCollarKeyholder;
          transferFunction = transferCollarKey;
          choiceemoji = "<:collar:1449984183261986939>";
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

      console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")

      // Prompt and ensure the user intended to run this command for this combination. 
      let response = await interaction.reply({ 
				content: `Giving the keys for ${choiceemoji}${lockedUser} to 🔑${newKeyholder}. . .\n\nPlease confirm by pressing the button below:`, 
				flags: MessageFlags.Ephemeral, 
				components: components,
				withResponse: true 
			})
      let confirmation;

			const collectorFilter = (i) => i.user.id === interaction.user.id;
			try {
				confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

				if (confirmation.customId === 'agreetotransferbutton') {
					await confirmation.update({ content: `Key transfer request in progress...`, components: [] });
				} else if (confirmation.customId === 'cancel') {
					await confirmation.update({ content: 'Action cancelled', components: [] });
          return; // Stop with the key transfer immediately. 
				}
			} 
      catch (err) {
				console.log(err);
				await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling transfer.', components: [] });
        return;
      }

      // Keyholder is returning the keys to the wearer
      if (lockedUser.id == newKeyholder.id) {
        console.log("Returning keys to wearer")
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          await interaction.channel.send(
            `${
              interaction.user
            } gives the keys to ${lockedUser}'s ${restraint} to ${them(
              lockedUser.id
            )}`
          );
        } else {
          await confirmation.update({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
        // Wearer is giving their keys away
      } else if (lockedUser.id == interaction.user.id) {
        console.log("Wearer giving keys away")
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          await interaction.channel.send(
            `${interaction.user} gives the keys to ${their(
              interaction.user.id
            )} ${restraint} to ${newKeyholder}.`
          );
        } else {
          await confirmation.update({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
        // I'm not sure what this does.
      } else if (optins.getKeyGiving(lockedUser)) {
        console.log("Idk what this does")
        if (transferFunction(lockedUser.id, newKeyholder.id)) {
          await interaction.channel.send(
            `${interaction.user} gives the keys to ${lockedUser}'s ${restraint} to ${newKeyholder}.`
          );
        } else {
          await confirmation.update({
            content: "Failed to transfer key",
            flags: MessageFlags.Ephemeral,
          });
        }
        // General transfer of keys. This should be between two different people, not involving the wearer.
      } else {
        console.log("You got here right? Right? ")
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

        /*await confirmation.update({
          content: "Key transfer request was sent",
          flags: MessageFlags.Ephemeral,
        });*/
      }
    }
    catch (err) {
      console.log(err);
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
            `<@${oldKeyholder}> gives the keys to ${interaction.user}'s ${restraint} to <@${newKeyholder}>.`
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
