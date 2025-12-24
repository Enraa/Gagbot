const { SlashCommandBuilder, MessageFlags, ComponentType, ButtonStyle } = require("discord.js");
const { optinMap, getOptin, setOptin, unsetOptin, optinIsLocked } = require("../functions/optinfunctions.js");

module.exports = {
  data: new SlashCommandBuilder().setName("optins").setDescription("Configure what features you opt in to"),
  async execute(interaction) {
    interaction.reply({
      flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
      components: buildComponents(interaction.user.id),
    });
  },
  componentHandlers: [
    {
      key: "optins",
      async handle(interaction, offset, action) {
        const lockedReason = optinIsLocked(interaction.user.id, offset);
        if (lockedReason) {
          interaction.reply({
            content: lockedReason,
            flags: MessageFlags.Ephemeral,
          });
          return;
        }

        if (action == "e") {
          setOptin(interaction.user.id, Number(offset));
        } else {
          unsetOptin(interaction.user.id, Number(offset));
        }

        interaction.update({
          components: buildComponents(interaction.user.id),
        });
      },
    },
  ],
};

function buildComponents(user) {
  return [...optinMap.values()].map(([rawOffset, name, desc]) => {
    const inverted = rawOffset < 0;
    const offset = Math.abs(rawOffset);

    const isSet = getOptin(user, offset);
    const showCurrent = isSet ? !inverted : inverted;

    return {
      type: ComponentType.Section,
      components: [
        {
          type: ComponentType.TextDisplay,
          content: desc,
        },
      ],
      accessory: {
        type: ComponentType.Button,
        customId: `optins-${offset}-${isSet ? "d" : "e"}`,
        style: showCurrent ? ButtonStyle.Success : ButtonStyle.Danger,
        label: name,
      },
    };
  });
}
