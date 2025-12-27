const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags } = require("discord.js");
const { mittentypes } = require("./../functions/gagfunctions.js");
const { heavytypes } = require("./../functions/heavyfunctions.js");

const PAGE_SIZE = 10;

const restraints = [
  ["Heavy", heavytypes.map((heavy) => ({ name: heavy.name, value: `Denial coefficient: ${heavy.denialCoefficient}`, inline: false }))],
  ["Mittens", mittentypes.map((heavy) => ({ name: heavy.name, value: "-# No description", inline: false }))],
];

const restraintOptions = restraints.map(([name, _], idx) => ({ label: name, value: idx }));

module.exports = {
  data: new SlashCommandBuilder().setName("list").setDescription(`View available restraints`),
  async execute(interaction) {
    interaction.reply(buildMessage(0, 0));
  },
  componentHandlers: [
    {
      key: "list",
      async handle(interaction, type, page) {
        page = Number(page);

        if (type == "select") type = interaction.values[0];
        else type = Number(type);

        interaction.update(buildMessage(type, page));
      },
    },
  ],
};

function buildMessage(type, page) {
  const typeArr = restraints[type];
  const maxPage = Math.ceil(typeArr[1].length / 10) - 1;
  if (page > maxPage) page = maxPage;
  const start = page * PAGE_SIZE;

  return {
    flags: MessageFlags.Ephemeral,
    embeds: [
      {
        title: typeArr[0],
        fields: typeArr[1].slice(start, start + PAGE_SIZE),
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            custom_id: `list-select-${page}`,
            options: restraintOptions,
          },
        ],
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page - 1}`,
            label: "← Prev",
            disabled: page == 0,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page}`,
            label: `Page ${page + 1} of ${maxPage + 1}`,
            disabled: true,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page + 1}`,
            label: "Next →",
            disabled: page == maxPage,
            style: ButtonStyle.Secondary,
          },
        ],
      },
    ],
  };
}
