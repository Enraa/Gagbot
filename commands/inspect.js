const { SlashCommandBuilder, MessageFlags, ButtonStyle, ComponentType } = require("discord.js");
const { getMittenName, getMitten, getGag, convertGagText, getGagIntensity } = require("./../functions/gagfunctions.js");
const { getChastity, getVibe, getChastityKeys, getChastityTimelock, getArousalDescription, getArousalChangeDescription, getChastityName } = require("./../functions/vibefunctions.js");
const { getCollar, getCollarPerm, getCollarKeys, getCollarName } = require("./../functions/collarfunctions.js");
const { getHeavy } = require("./../functions/heavyfunctions.js");
const { getCorset } = require("./../functions/corsetfunctions.js");
const { getHeadwear, getHeadwearName } = require("./../functions/headwearfunctions.js");
const { getPronounsSet } = require("./../functions/pronounfunctions.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inspect")
    .setDescription(`Inspect someone's restraints if they are wearing any`)
    .addUserOption((opt) => opt.setName("user").setDescription("Who to inspect (blank to inspect yourself)")),
  async execute(interaction) {
    try {
      let inspectuser = interaction.options.getUser("user") ? interaction.options.getUser("user") : interaction.user;
      let titletext;
      if (inspectuser == interaction.user) {
        titletext = `## Your current restraints:\n-# (${getPronounsSet(interaction.user.id)})\n\n`;
      } else {
        titletext = `## ${inspectuser}'s current restraints:\n-# (${getPronounsSet(inspectuser.id)})\n\n`;
      }
      const inspectparts = getInspectParts(interaction.user.id, inspectuser.id);

      const pages = getPages(inspectparts);
      interaction.reply(buildMessage(inspectuser.id, pages[0], 0, pages.length - 1));
    } catch (err) {
      console.log(err);
    }
  },
  componentHandlers: [
    {
      key: "inspect",
      async handle(interaction, target, page) {
        page = Number(page);
        const inspectparts = getInspectParts(interaction.user.id, target);
        const pages = getPages(inspectparts);
        interaction.update(buildMessage(target, pages[page], page, pages.length - 1));
      },
    },
  ],
};

function buildMessage(target, text, page, maxPage) {
  if (page > maxPage) page = maxPage;

  const msg = {
    flags: MessageFlags.Ephemeral,
    content: text,
  };

  if (maxPage > 0) {
    msg.components = [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            custom_id: `inspect-${target}-${page - 1}`,
            label: "← Prev",
            disabled: page == 0,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `inspect-${target}-${page}`,
            label: `Page ${page + 1} of ${maxPage + 1}`,
            disabled: true,
            style: ButtonStyle.Secondary,
          },
          {
            type: ComponentType.Button,
            custom_id: `inspect-${target}-${page + 1}`,
            label: "Next →",
            disabled: page == maxPage,
            style: ButtonStyle.Secondary,
          },
        ],
      },
    ];
  }

  return msg;
}

function getPages(inspectparts) {
  const pages = [];
  let outtext = "";
  let maybeouttext = "";

  for (const part of inspectparts) {
    maybeouttext = `${outtext}${part}\n`;
    if (maybeouttext.length > 1000) {
      pages.push(outtext);
      outtext = "";
    } else {
      outtext = maybeouttext;
    }
  }

  if (outtext.length > 0) pages.push(outtext);
  return pages;
}

function getInspectParts(interactionuser, inspectuser) {
  let inspectparts = [];
  // Gag status
  if (getGag(inspectuser)) {
    inspectparts.push(`<:Gag:1073495437635506216> Gag: **${convertGagText(getGag(inspectuser))}** set to Intensity **${getGagIntensity(inspectuser)}**`);
  } else {
    inspectparts.push(`<:Gag:1073495437635506216> Gag: Not currently worn.`);
  }

  // Headwear parts!
  if (getHeadwear(inspectuser).length > 0) {
    let headout = `👤 Headwear: **`;
    getHeadwear(inspectuser).forEach((h) => {
      headout = `${headout}${getHeadwearName(inspectuser, h)}, `;
    });
    headout = headout.slice(0, -2);
    headout = `${headout}**`;
    inspectparts.push(headout);
  } else {
    inspectparts.push(`👤 Headwear: Not currently worn.`);
  }
  // Mitten status
  if (getMitten(inspectuser)) {
    if (getMittenName(inspectuser)) {
      inspectparts.push(`<:mittens:1452425463757803783> Mittens: **${getMittenName(inspectuser)}**`);
    } else {
      inspectparts.push(`<:mittens:1452425463757803783> Mittens: **WORN**`);
    }
  } else {
    inspectparts.push(`<:mittens:1452425463757803783> Mittens: Not currently worn.`);
  }
  // Vibe status
  if (getVibe(inspectuser)) {
    inspectparts.push(
      `<:MagicWand:1073504682540011520> Vibrators/toys: **${getVibe(inspectuser)
        .map((vibe) => `${vibe.vibetype} (${vibe.intensity})`)
        .join(", ")}**`
    );
  } else {
    inspectparts.push(`<:MagicWand:1073504682540011520> Vibrator: Not currently worn.`);
  }

  // Arousal status
  let arousalblock = ``;
  const arousal = getArousalDescription(inspectuser);
  if (arousal) arousalblock = `Arousal: **${getArousalDescription(inspectuser)}**`;
  const change = getArousalChangeDescription(inspectuser);
  if (change) arousalblock = `${arousalblock}\n-# ...${change}`;
  if (arousalblock.length > 0) {
    inspectparts.push(arousalblock);
  }
  // Chastity status
  if (getChastity(inspectuser)) {
    let isLocked = getChastity(inspectuser)?.keyholder == interactionuser || (getChastity(inspectuser)?.access === 0 && inspectuser != interactionuser);
    let lockemoji = isLocked ? "🔑" : "🔒";
    let chastitykeyaccess = getChastity(inspectuser)?.access;
    let currentchastitybelt = getChastityName(inspectuser) ? getChastityName(inspectuser) : "Locked Up Nice and Tight!";
    let timelockedtext = "Timelocked (Open)";
    if (chastitykeyaccess == 1) {
      timelockedtext = "Timelocked (Keyed)";
    }
    if (chastitykeyaccess == 2) {
      timelockedtext = "Timelocked (Sealed)";
    }
    if (getChastity(inspectuser).keyholder == "discarded") {
      inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing!**`);
    } else if (getChastityTimelock(inspectuser)) {
      inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **${timelockedtext} until ${getChastityTimelock(inspectuser, true)}**`);
    } else if (getChastity(inspectuser).keyholder == inspectuser) {
      // Self bound!
      inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Self-bound!**`);
    } else {
      inspectparts.push(`<:Chastity:1073495208861380629> Chastity: **${currentchastitybelt}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getChastity(inspectuser).keyholder}>**`);
    }
  } else {
    inspectparts.push(`<:Chastity:1073495208861380629> Chastity: Not currently worn.`);
  }

  // Corset status
  if (getCorset(inspectuser)) {
    if (getCorset(inspectuser).tightness > 10) {
      inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced beyond reason to a string length of ${getCorset(inspectuser).tightness}**`);
    } else if (getCorset(inspectuser).tightness > 7) {
      inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced tightly to a string length of ${getCorset(inspectuser).tightness}**`);
    } else if (getCorset(inspectuser).tightness > 4) {
      inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced moderately to a string length of ${getCorset(inspectuser).tightness}**`);
    } else {
      inspectparts.push(`<:corset:1451126998192881684> Corset: **Laced loosely to a string length of ${getCorset(inspectuser).tightness}**`);
    }
  } else {
    inspectparts.push(`<:corset:1451126998192881684> Corset: Not currently worn.`);
  }
  // Heavy Bondage status
  if (getHeavy(inspectuser)) {
    inspectparts.push(`<:Armbinder:1073495590656286760> Heavy Bondage: **${getHeavy(inspectuser).type}**`);
  } else {
    inspectparts.push(`<:Armbinder:1073495590656286760> Heavy Bondage: Not currently worn.`);
  }
  // Collar status
  let collarparts = [];
  if (getCollar(inspectuser)) {
    let currentcollartext = getCollarName(inspectuser) ? getCollarName(inspectuser) : "Locked Up Nice and Tight!";
    let isLocked = getCollar(inspectuser).keyholder == interactionuser || !getCollar(inspectuser).keyholder_only;
    let lockemoji = isLocked ? "🔑" : "🔒";
    if (getCollar(inspectuser).keyholder == "discarded") {
      // Self bound!
      if (getCollar(inspectuser).keyholder_only) {
        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing!**`);
      } else {
        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Keys are Missing! Free Use!**`);
      }
    } else if (!getCollar(inspectuser).keyholder_only) {
      // Free use!
      if (getCollar(inspectuser).keyholder == inspectuser) {
        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Self-bound and free use!**`);
      } else {
        collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getCollar(inspectuser).keyholder}>, free use!**`);
      }
    } else if (getCollar(inspectuser).keyholder == inspectuser) {
      // Self bound!
      collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Self-bound!**`);
    } else {
      collarparts.push(`<:collar:1449984183261986939> Collar: **${currentcollartext}**\n-# ‎   ⤷ ${lockemoji} **Key held by <@${getCollar(inspectuser).keyholder}>**`);
    }

    // Output Collar Perms
    collarparts.push(
      `-# Mittens: ${getCollarPerm(inspectuser, "mitten") ? "YES" : "NO"}, Chastity: ${getCollarPerm(inspectuser, "chastity") ? "YES" : "NO"}, Heavy: ${
        getCollarPerm(inspectuser, "heavy") ? "YES" : "NO"
      }`
    );
  } else {
    collarparts.push(`<:collar:1449984183261986939> Collar: Not currently worn.`);
  }

  inspectparts.push(collarparts.join("\n"));
  inspectparts.push(" ");
  // Keys Held
  let keysheldtext = "";
  let keysheldchastity = getChastityKeys(inspectuser);
  if (keysheldchastity.length > 0) {
    keysheldchastity = keysheldchastity.map((k) => `<@${k}>`);
    let keysstring = keysheldchastity.join(", ");
    keysheldtext = `Currently holding chastity keys for: ${keysstring}\n`;
  }
  let keysheldcollar = getCollarKeys(inspectuser);
  if (keysheldcollar.length > 0) {
    keysheldcollar = keysheldcollar.map((k) => `<@${k}>`);
    let keysstring = keysheldcollar.join(", ");
    keysheldtext = `${keysheldtext}Currently holding collar keys for: ${keysstring}`;
  }
  if (keysheldtext.length > 0) {
    inspectparts.push(keysheldtext);
  }
  return inspectparts;
}
