const { SlashCommandBuilder, ComponentType, ButtonStyle, MessageFlags } = require("discord.js");
const { gagtypes, mittentypes } = require("./../functions/gagfunctions.js");
const { heavytypes } = require("./../functions/heavyfunctions.js");
const { chastitytypes, chastitybratypes } = require("./../functions/vibefunctions.js");
const { headweartypes } = require("./../functions/headwearfunctions.js");
const { collartypes } = require("./../functions/collarfunctions.js");
const { wearabletypes } = require("./../functions/wearablefunctions.js");

const PAGE_SIZE = 10;

const restraints = [
  ["Heavy", heavytypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `Denial coefficient: ${heavy.denialCoefficient}`, inline: false }))],
  ["Mittens", mittentypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "-# *No description*", inline: false }))],
  ["Gags", gagtypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "-# *No description*", inline: false }))],
  ["Chastity Belts", chastitytypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `Denial coefficient: ${heavy.denialCoefficient}`, inline: false }))],
  ["Chastity Bras", chastitybratypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: `Denial coefficient: ${heavy.denialCoefficient}`, inline: false }))],
  ["Masks", headweartypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: (heavy.blockinspect || heavy.blockemote) ? (`Restricts: ${heavy.blockinspect ? `Inspect, ` : ``}${heavy.blockemote ? `Emote, ` : ``}`).slice(0,-2) : `-# *No description*`, inline: false }))],
  ["Collars", collartypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: "-# *No description*", inline: false }))],
  ["Wearables", wearabletypes.sort((a,b) => a.name.localeCompare(b.name)).map((heavy) => ({ name: heavy.name, value: (heavy.colorable ? `-# (multiple colors)` : `-# *No Colors Available*`), inline: false }))],
];

const restraintOptions = restraints.map(([name, _], idx) => ({ label: name, value: idx }));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list")
    .setDescription(`View available restraints`)
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("What kind of restraints to list")
        .addChoices(restraints.map(([name, _], idx) => ({ name: name, value: String(idx) })))
    ),
  async execute(interaction) {
    try {
      const type = interaction.options.getString("type") ?? 0;

      interaction.reply(buildMessage(Number(type), 0, false));
    }
    catch (err) {
      console.log(err)
    }
  },
  componentHandlers: [
    {
      key: "list",
      async handle(interaction, type, page, details) {
        page = Number(page);
        details = Number(details) > 0;

        if (type == "select") {
          type = interaction.values[0]
          page = 0
        }
        else type = Number(type);

        interaction.update(buildMessage(type, page, details));
      },
    },
  ],
};

function buildMessage(type, page, details) {
  const typeArr = restraints[type];
  const maxPage = Math.ceil(typeArr[1].length / 10) - 1;
  if (page > maxPage) page = maxPage;
  const start = page * PAGE_SIZE;

  return {
    flags: MessageFlags.Ephemeral,
    embeds: [
      details
        ? {
            title: typeArr[0],
            fields: typeArr[1].slice(start, start + PAGE_SIZE),
          }
        : {
            title: typeArr[0],
            description: typeArr[1]
              .slice(start, start + PAGE_SIZE)
              .map((field) => `- ${field.name}`)
              .join("\n"),
          },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.StringSelect,
            custom_id: `list-select-${page}-${+details}`,
            options: restraintOptions,
            placeholder: "Change restraint type...",
          },
        ],
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page - 1}-${+details}`,
            label: "← Prev",
            disabled: page == 0,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page}-${+details}`,
            label: `Page ${page + 1} of ${maxPage + 1}`,
            disabled: true,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page + 1}-${+details}`,
            label: "Next →",
            disabled: page == maxPage,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `list-${type}-${page}-${+!details}`,
            label: details ? "Hide details" : "Show details",
            style: ButtonStyle.Secondary,
          },
        ],
      },
    ],
  };
}
