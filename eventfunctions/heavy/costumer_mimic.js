const { getChastity } = require("../../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra.js");
const { getChastityBraName } = require("../../functions/getters/chastity/getChastityBraName.js");
const { getChastityName } = require("../../functions/getters/chastity/getChastityName.js");
const { getCollar } = require("../../functions/getters/collar/getCollar.js");
const { getCollarName } = require("../../functions/getters/collar/getCollarName.js");
const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { convertGagText } = require("../../functions/getters/gag/getGagName.js");
const { getHeadwear } = require("../../functions/getters/headwear/getHeadwear.js");
const { getHeadwearName } = require("../../functions/getters/headwear/getHeadwearName.js");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy.js");
const { getMitten } = require("../../functions/getters/mitten/getMitten.js");
const { getMittenName } = require("../../functions/getters/mitten/getMittenName.js");
const { getLockedWearable } = require("../../functions/getters/wearable/getLockedWearable.js");
const { getWearable } = require("../../functions/getters/wearable/getWearable.js");
const { getWearableName } = require("../../functions/getters/wearable/getWearableName.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { addArousal } = require("../../functions/setters/arousal/addArousal.js");
const { assignChastity } = require("../../functions/setters/chastity/assignChastity.js");
const { assignChastityBra } = require("../../functions/setters/chastity/assignChastityBra.js");
const { assignCollar } = require("../../functions/setters/collar/assignCollar.js");
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { assignHeadwear } = require("../../functions/setters/headwear/assignHeadwear.js");
const { assignHeavy } = require("../../functions/setters/heavy/assignHeavy.js");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { assignMitten } = require("../../functions/setters/mitten/assignMitten.js");
const { assignWearable } = require("../../functions/setters/wearable/assignWearable.js");
const { deleteWearable } = require("../../functions/setters/wearable/removeWearable.js");
const { getText } = require("../../functions/textfunctions.js");

// File Containing Costumer Mimic Outfits - Wearables, Headwear, Mittens, Gags, Heavy. For Static Heavies at the end of the outfit the type 'end' can be used to access specific texts.

// Validated 05/05/26
const maid_outfit = [
    { category: "wearable", itemtowear: "garters", color: "White" },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "toy", itemtowear: "vibe_polite", color: null },
    { category: "chastitybelt", itemtowear: "belt_maid", color: null },
    { category: "chastitybra", itemtowear: "bra_maid", color: null },
    { category: "mittens", itemtowear: "mittens_maid", color: null },
    { category: "wearable", itemtowear: "maid_dress", color: "Black" },
    { category: "wearable", itemtowear: "maid_apron", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "collar", itemtowear: "collar_maidtraining", color: null },
    { category: "headwear", itemtowear: "mask_kigu_cutemaid", color: null },
    { category: "wearable", itemtowear: "maid_headdress", color: null },
    { category: "heavy", itemtowear: "straitjacket_maid", color: null },
    { category: "heavy", itemtowear: "legbinder_maid", color: null },
];

// Validated 05/05/26
const ponygirl_outfit = [
    { category: "chastitybelt", itemtowear: "belt_silver", color: null },
    { category: "chastitybra", itemtowear: "bra_silver", color: null },
    { category: "collar", itemtowear: "collar_posture", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "ponytack_leather", color: "Red" },
    { category: "heavy", itemtowear: "armbinder_leather", color: null },
    { category: "wearable", itemtowear: "ponyboots_leather", color: "Red" },
    { category: "heavy", itemtowear: "rope_hobble", color: null },
    { category: "headwear", itemtowear: "blindfold_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "wearable", itemtowear: "headharness_leather", color: "Red" },
    { category: "wearable", itemtowear: "blinkers_leather", color: "Red" },
    { category: "end", itemtowear: "leashing_post", color: null },
];

// Validated 05/05/26
const bunnygirl_outfit = [
    { category: "wearable", itemtowear: "outfit_playbunny_headwear", color: "Blue" },
    { category: "wearable", itemtowear: "bunnytights", color: "White" },
    { category: "wearable", itemtowear: "suit_outfit", color: "Playbunny" },
    { category: "wearable", itemtowear: "highheels", color: "Blue" },
    { category: "wearable", itemtowear: "cuffswrist_bondage", color: "Blue" },
    { category: "wearable", itemtowear: "cuffsankle_bondage", color: "Blue" },
    { category: "wearable", itemtowear: "cuffsthigh_bondage", color: "Blue" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_bunny", color: null },
    { category: "chastitybelt", itemtowear: "belt_seal_fire", color: null },
    { category: "end", itemtowear: "armbinder_leather", color: null },
];

// Validated 05/05/26
const princess_outfit = [
    { category: "wearable", itemtowear: "bra_lacy", color: "Pink" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Pink" },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "wearable", itemtowear: "gartersbelt", color: "White" },
    { category: "wearable", itemtowear: "princess_dress", color: "Pink" },
    { category: "wearable", itemtowear: "gloves_opera", color: "White" },
    { category: "wearable", itemtowear: "highheels", color: "Pink" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_kigu_🥰", color: null },
    { category: "wearable", itemtowear: "tiara", color: "Princess" },
    { category: "collar", itemtowear: "collar_princess", color: null },
    { category: "heavy", itemtowear: "dress_binding", color: null },
];

// Validated 05/05/26
const lewd_princess_outfit = [
    { category: "wearable", itemtowear: "panties_lacy", color: "Black" },
    { category: "wearable", itemtowear: "stockings", color: "Black" },
    { category: "wearable", itemtowear: "gartersbelt", color: "Black" },
    { category: "wearable", itemtowear: "lingerie_royalicing", color: null },
    { category: "wearable", itemtowear: "necklace", color: "Silver" },
    { category: "wearable", itemtowear: "gloves_opera", color: "Black" },
    { category: "wearable", itemtowear: "highheels", color: "White" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "mask_kigu_Yesh", color: null },
    { category: "wearable", itemtowear: "tiara", color: "Princess" },
    { category: "collar", itemtowear: "collar_princess", color: null },
    { category: "heavy", itemtowear: "boxbinder_leather", color: null },
];

// Validated 05/05/26
const kitsune_outfit = [
    { category: "wearable", itemtowear: "lingerie", color: "Indigo" },
    { category: "wearable", itemtowear: "thighhighs", color: "White" },
    { category: "wearable", itemtowear: "kimono", color: "Indigo" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "Indigo" },
    { category: "wearable", itemtowear: "bigcute_ribbon", color: "White" },
    { category: "wearable", itemtowear: "sandals", color: null },
    { category: "wearable", itemtowear: "hairpins", color: "Jade" },
    { category: "wearable", itemtowear: "mask_kitsune", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_inari", color: null },
    { category: "end", itemtowear: "ribbons", color: null },
];

// Validated 05/05/26
const librarian_outfit = [
    { category: "wearable", itemtowear: "rope_karada", color: "Red" },
    { category: "wearable", itemtowear: "thighband_leather", color: "Brown" },
    { category: "wearable", itemtowear: "pencil_skirt", color: "Brown" },
    { category: "wearable", itemtowear: "buttonup_blouse", color: "White" },
    { category: "wearable", itemtowear: "ankleboots", color: "Brown" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "collar", itemtowear: "collar_posture", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "headwear", itemtowear: "mask_kigu_shy", color: null },
    { category: "wearable", itemtowear: "glasses_librarian", color: null },
    { category: "wearable", itemtowear: "tome", color: "Tome of Bondage" },
    { category: "heavy", itemtowear: "straitjacket_comfy", color: null },
];

// Validated 05/05/26
const rogue_outfit = [
    { category: "wearable", itemtowear: "panties_leather", color: "Gray" },
    { category: "wearable", itemtowear: "bra_leather", color: "Gray" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "Gray" },
    { category: "wearable", itemtowear: "bootyshorts_leather", color: "Black" },
    { category: "wearable", itemtowear: "top_crop_leather", color: "Black" },
    { category: "wearable", itemtowear: "thighhighboots", color: "Gray" },
    { category: "wearable", itemtowear: "bandolier_leather", color: null },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "wearable", itemtowear: "roguemask_leather", color: "Gray" },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "wearable", itemtowear: "cloak", color: "Gray" },
    { category: "heavy", itemtowear: "boxbinder_hisec", color: null },
];

// Validated 05/05/26
const dancer_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "toy", itemtowear: "vibe_pulse", color: null },
    { category: "chastitybelt", itemtowear: "belt_seal_earth", color: null },
    { category: "wearable", itemtowear: "armbands", color: "Gold" },
    { category: "wearable", itemtowear: "bracelets", color: "Gold" },
    { category: "wearable", itemtowear: "anklets", color: "Gold" },
    { category: "wearable", itemtowear: "necklace", color: "Gold" },
    { category: "wearable", itemtowear: "hairpins", color: "Gold" },
    { category: "wearable", itemtowear: "headchain", color: "Gold" },
    { category: "wearable", itemtowear: "haremsilks", color: "Cyan" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "Cyan" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "wearable", itemtowear: "veil", color: "Half-Face" },
    { category: "end", itemtowear: "pole_dancer", color: null },
];

// Validated 05/05/26
const paladin_outfit = [
    { category: "wearable", itemtowear: "bodystocking", color: "Black" },
    { category: "wearable", itemtowear: "harness_leather", color: "Leather" },
    { category: "wearable", itemtowear: "greaves", color: "Steel" },
    { category: "wearable", itemtowear: "gauntlet", color: "Steel" },
    { category: "chastitybelt", itemtowear: "belt_tungsten", color: null },
    { category: "chastitybra", itemtowear: "bra_tungsten", color: null },
    { category: "wearable", itemtowear: "armour", color: "Holy Knight" },
    { category: "wearable", itemtowear: "circlet", color: "Platinum" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_steel", color: null },
    { category: "end", itemtowear: "yoke", color: null },
];

// Validated 05/05/26
const ranger_outfit = [
    { category: "wearable", itemtowear: "bra_lacy", color: "Green" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Green" },
    { category: "wearable", itemtowear: "thighhighs", color: "Green" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "Green" },
    { category: "wearable", itemtowear: "bootyshorts_leather", color: "Brown" },
    { category: "wearable", itemtowear: "top_halter", color: "Green" },
    { category: "wearable", itemtowear: "kneehighboots", color: "Brown" },
    { category: "wearable", itemtowear: "armour", color: "Leather" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "collar", itemtowear: "collar_leather", color: null },
    { category: "wearable", itemtowear: "cloak", color: "Green" },
    { category: "heavy", itemtowear: "rope_hogtie", color: null },
];

// Validated 05/05/26
const healer_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "collar", itemtowear: "collar_star", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "wearable", itemtowear: "stockings", color: "White" },
    { category: "toy", itemtowear: "vibe_headpatbattery", color: null },
    { category: "chastitybelt", itemtowear: "belt_ancient", color: null },
    { category: "chastitybra", itemtowear: "bra_ancient", color: null },
    { category: "wearable", itemtowear: "shrine_maiden", color: "White" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "White" },
    { category: "wearable", itemtowear: "bigcute_ribbon", color: "Red" },
    { category: "wearable", itemtowear: "headchain", color: "Starveiled" },
    { category: "wearable", itemtowear: "balletheels", color: "White" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "staff", color: "Gohei" },
    { category: "wearable", itemtowear: "leash", color: "White" },
    { category: "end", itemtowear: "armbinder_ancient", color: null },
];

// Validated 05/05/26
const witch_outfit = [
    { category: "headwear", itemtowear: "blindfold_blackout", color: null },
    { category: "wearable", itemtowear: "bra_lacy", color: "Purple" },
    { category: "wearable", itemtowear: "panties_lacy", color: "Purple" },
    { category: "wearable", itemtowear: "stockings", color: null },
    { category: "wearable", itemtowear: "gloves_opera", color: "Purple" },
    { category: "wearable", itemtowear: "flowy_dress", color: "Purple" },
    { category: "wearable", itemtowear: "witchhat_normal", color: "Purple" },
    { category: "wearable", itemtowear: "kneehighboots", color: "Black" },
    { category: "wearable", itemtowear: "tome", color: "Shadowy Tome" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "collar", itemtowear: "collar_runic", color: null },
    { category: "end", itemtowear: "shadowhands", color: null },
];

// Validated 05/05/26
const angel_outfit = [
    { category: "headwear", itemtowear: "blindfold_cloth", color: null },
    { category: "wearable", itemtowear: "halo", color: "Angelic" },
    { category: "wearable", itemtowear: "wings", color: "Angelic" },
    { category: "wearable", itemtowear: "armbands", color: "Platinum" },
    { category: "wearable", itemtowear: "anklets", color: "Platinum" },
    { category: "wearable", itemtowear: "headchain", color: "Platinum" },
    { category: "chastitybelt", itemtowear: "belt_featherlight", color: null },
    { category: "chastitybra", itemtowear: "bra_featherlight", color: null },
    { category: "wearable", itemtowear: "nightie_sheer", color: "White" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "heavy", itemtowear: "hardlight_fetters", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "collar", itemtowear: "collar_star", color: null },
    { category: "wearable", itemtowear: "tome", color: "Angelic Tome" },
    { category: "wearable", itemtowear: "wingbinders", color: "White" },
    { category: "wearable", itemtowear: "leash", color: "White" },
    { category: "end", itemtowear: "fiddle", color: null },
];

// Validated 05/05/26
const mermaid_outfit = [
    { category: "heavy", itemtowear: "legbinder_latexmermaidtail", color: null },
    { category: "wearable", itemtowear: "armbands", color: "Cobalt" },
    { category: "wearable", itemtowear: "headchain", color: "Crystal" },
    { category: "wearable", itemtowear: "bikini", color: "Skimpy" },
    { category: "wearable", itemtowear: "pareo", color: "Aqua" },
    { category: "mittens", itemtowear: "mittens_hardlight", color: null },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "gag", itemtowear: "silent", color: null },
    { category: "heavy", itemtowear: "armbinder_latex", color: null },
    { category: "end", itemtowear: "mermaid_tank", color: null },
];

// Validated 05/05/26
const mer_maid_outfit = [
    { category: "heavy", itemtowear: "legbinder_shadowlatexmermaidtail", color: null },
    { category: "wearable", itemtowear: "bikini", color: "Frilly" },
    { category: "wearable", itemtowear: "sleeves_detatched", color: "Black" },
    { category: "wearable", itemtowear: "maid_apron", color: null },
    { category: "mittens", itemtowear: "mittens_maid", color: null },
    { category: "gag", itemtowear: "politeSub", color: null },
    { category: "collar", itemtowear: "collar_maid", color: null },
    { category: "headwear", itemtowear: "mask_kigu_sadisticmaid", color: null },
    { category: "wearable", itemtowear: "maid_headdress", color: null },
    { category: "heavy", itemtowear: "straitjacket_maid", color: null },
    { category: "end", itemtowear: "mermaid_tank", color: null },
];

// Validated 05/05/26
const cheerleader_outfit = [
    { category: "wearable", itemtowear: "thighhighs", color: "White" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "White" },
    { category: "wearable", itemtowear: "panties_sidetie", color: "Red" },
    { category: "wearable", itemtowear: "nipple_pasties", color: "Red" },
    { category: "wearable", itemtowear: "mini_skirt", color: "White" },
    { category: "wearable", itemtowear: "top_halter", color: "Red" },
    { category: "wearable", itemtowear: "pumps", color: "White" },
    { category: "mittens", itemtowear: "mittens_pompom", color: null },
    { category: "collar", itemtowear: "collar_moon", color: null },
    { category: "gag", itemtowear: "uwu", color: null },
    { category: "toy", itemtowear: "vibe_reverb", color: null },
    { category: "headwear", itemtowear: "mask_kigu_teto", color: null },
];

// Validated 05/05/26
const dryad_outfit = [
    { category: "wearable", itemtowear: "anklets", color: "Floral" },
    { category: "wearable", itemtowear: "bracelets", color: "Floral" },
    { category: "wearable", itemtowear: "gloves_fingerlesselbow", color: "Green" },
    { category: "mittens", itemtowear: "mittens_leather", color: null },
    { category: "wearable", itemtowear: "armbands", color: "Livingwood" },
    { category: "chastitybra", itemtowear: "bra_livingwood", color: null },
    { category: "chastitybelt", itemtowear: "belt_livingwood", color: null },
    { category: "collar", itemtowear: "collar_livingwood", color: null },
    { category: "gag", itemtowear: "ball", color: null },
    { category: "headwear", itemtowear: "blindfold_floral", color: null },
    { category: "wearable", itemtowear: "bikini", color: "Leaf" },
    { category: "wearable", itemtowear: "pareo", color: "Leafy" },
    { category: "wearable", itemtowear: "sandals_strappy", color: "Leafy" },
    { category: "end", itemtowear: "entangling_vines", color: null },
];


const mimicCostumes = {
    maid_outfit: maid_outfit,
    ponygirl_outfit: ponygirl_outfit,
    bunnygirl_outfit: bunnygirl_outfit,
    princess_outfit: princess_outfit,
    lewd_princess_outfit: lewd_princess_outfit,
    kitsune_outfit: kitsune_outfit,
    librarian_outfit: librarian_outfit,
    rogue_outfit: rogue_outfit,
    dancer_outfit: dancer_outfit,
    paladin_outfit: paladin_outfit,
    ranger_outfit: ranger_outfit,
    healer_outfit: healer_outfit,
    witch_outfit: witch_outfit,
    angel_outfit: angel_outfit,
    mermaid_outfit: mermaid_outfit,
    mer_maid_outfit: mer_maid_outfit,
    cheerleader_outfit: cheerleader_outfit,
    dryad_outfit: dryad_outfit,
};

//*/ Shuffler Application
function shuffleWearables(inputArray) {
    //Fisher-Yates Shuffle
    for (let i = inputArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
    }

    return inputArray;
}
//*/

// Costumer Mimic Event Function
// Rapidly strips the victim of all unprotected clothing and restraints
// Then it will slowly apply a random outfit and set of restraints!
// Then it will spit them out and apply a new heavy item at the end!

let tick = async (serverID, userID, datain) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (getProcessVariable(serverID, userID, "userevents") == undefined) { setProcessVariable(serverID, userID, "userevents", {}) }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic = { stage: 0 } }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx = 0 }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder = getHeavy(serverID, userID).origbinder }

    // Randomly select an outfit from mimicCostumes.js
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.outfit == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.outfit = Object.keys(mimicCostumes)[Math.floor(Math.random() * Object.keys(mimicCostumes).length)]; }
    let currclothes = getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f))); // Current clothes that can be removed
    let shuffledclothes = shuffleWearables(currclothes); // I admittedly dont think a big shuffler's necessary but its fine
    // Capture length of initial Removable Wearables array
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes = shuffledclothes.length }
    let consumeperpass = Math.round(getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes / 4);

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(serverID, userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[serverID] && process.recentmessages[serverID][userID])) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate ?? 0) < Date.now()) {
        //getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate = Date.now() + 2000; // Test Speed
        getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            serverID: serverID,
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    // The Mimic is teasing the Victim during the entire event~ (Arousal Gain can be increased or decreased as desired)
    addArousal(serverID, userID, 1);

    console.log(getProcessVariable(serverID, userID, "userevents").costumermimic)

    // Select Item from Chosen Outfit based in index
    let nextitem = mimicCostumes[getProcessVariable(serverID, userID, "userevents").costumermimic.outfit][getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx];
    let itemtoequipcolored = null;
    let nom_idx = 0;
    let itemsconsumed = "";

    console.log("Consume: ", consumeperpass, ", Total: ", getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f))).length, ", Stage: ", getProcessVariable(serverID, userID, "userevents").costumermimic.stage);

    // Initial Text Formatting
    data.heavy = true;
    data.costumer_mimic = true;

    // Stripping Clothes
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage < 3) {
        if (shuffledclothes.length > consumeperpass && consumeperpass >= 2) {
            while (nom_idx < consumeperpass && shuffledclothes[nom_idx] != null) {
                // Fetch Wearable name and concatenate onto string
                if (nom_idx != consumeperpass - 1) {
                    itemsconsumed += getWearableName(undefined, shuffledclothes[nom_idx]) + ", ";
                } else {
                    itemsconsumed += "and " + getWearableName(undefined, shuffledclothes[nom_idx]);
                }
                // remove it 
                deleteWearable(serverID, userID, shuffledclothes[nom_idx]);
                nom_idx++;
            }
            data.textdata.c1 = itemsconsumed;
            console.log(itemsconsumed);
            data.removeclothing = true;

            // Send a message saying it stripped things off the wearer <3
            messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage++
            return;

        } else if (shuffledclothes.length <= consumeperpass && shuffledclothes.length > 0) {
            console.log("Not enough Clothes remaining for a full cycle! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage = 3
        } else if (shuffledclothes.length == 0) {
            // Victim Stripped of all unprotected clothing unexpectedly, progress to next stage
            console.log("Unexpectedly Naked! Skipping to Dress Up!")
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage = 4;
            data.textdata.c1 = "Naked";
            data.donestripping = true;
            data.noneremaining = true;
            messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            return;
        } else {
            console.log("Initial Clothes count less than 4! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage = 3
        }
    }

    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage == 3) {
        console.log("Entering Final Consumption!")
        // Handle all remaining Wearables
        data.donestripping = true;
        let remainingwearables = getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f)))
        let concat = []
        remainingwearables.forEach((w) => {
            concat.push(getWearableName(undefined, w));
            deleteWearable(serverID, userID, w);
        })
        if (concat.length > 0) {
            data.textdata.c1 = concat.join(", ")
            data.remainingitems = true;
            if (concat.length > 1) {
                data.multiple = true;
            }
            else {
                data.single = true;
            }
        }
        else {
            data.textdata.c1 = "Nothing Worn!"
            data.noneremaining = true;
        }

        // Send a message saying it has consumed all remaining wearables
        messageSendChannel(getText(data), process.recentmessages[serverID][userID])

        getProcessVariable(serverID, userID, "userevents").costumermimic.stage++
        return;
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage >= 4 && getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx < mimicCostumes[getProcessVariable(serverID, userID, "userevents").costumermimic.outfit].length && nextitem.category != "end") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(serverID, userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(serverID, userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(serverID, userID) || (getHeadwear(serverID, userID) && (getHeadwear(serverID, userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(serverID, undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(serverID, userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "gag":
                if (!getGag(serverID, userID) || (getGag(serverID, userID) && (getGag(serverID, userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                        // Apply the gag    
                        assignGag(serverID, userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(serverID, userID) || (getMitten(serverID, userID) && (getMitten(serverID, userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(serverID, userID)) {
                        data.textdata.c1 = getMittenName(serverID, undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(serverID, undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(serverID, userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(serverID, undefined, nextitem.itemtowear), // mitten name
                            assignMitten(serverID, userID, nextitem.itemtowear, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "chastitybelt":
                if (!getChastity(serverID, userID) || (getChastity(serverID, userID) && (getChastity(serverID, userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(serverID, userID)) {
                        data.textdata.c1 = getChastityName(serverID, undefined, getChastity(serverID, userID).getChastityName) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(serverID, undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            getChastity(serverID, userID).chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(serverID, undefined, nextitem.itemtowear), // chastity name
                            assignChastity(serverID, userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "chastitybra":
                if (!getChastityBra(serverID, userID) || (getChastityBra(serverID, userID) && (getChastityBra(serverID, userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(serverID, userID)) {
                        data.textdata.c1 = getChastityBraName(serverID, undefined, getChastityBra(userID).getChastityBraName) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(serverID, undefined, nextitem.itemtowear), // new chastity bra name

                            // Update Chastity Bra Name with new type
                            getChastityBra(serverID, userID).chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(serverID, undefined, nextitem.itemtowear), // chastity bra name
                            assignChastityBra(serverID, userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "collar":
                if (!getCollar(serverID, userID) || (getCollar(serverID, userID) && (getCollar(serverID, userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(serverID, userID)) {
                        data.textdata.c1 = getCollarName(serverID, undefined, getCollar(serverID, userID).getCollarName) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(serverID, undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            getCollar(serverID, userID).collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(serverID, undefined, nextitem.itemtowear), // collar name
                            assignCollar(serverID, userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, {}, false, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "heavy":
                if (!getHeavy(serverID, userID, nextitem.itemtowear)) {
                    // Apply the Heavy Restraint 
                    assignHeavy(serverID, userID, nextitem.itemtowear, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder);

                    // Configure Message Parameters                    
                    data.heavyrestraint = true;
                    data.textdata.c1 = getHeavy(serverID, userID, nextitem.itemtowear).displayname; // heavy name
                    data.add = true;

                    //Send Message to Channel
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "toy":
                if (!getToys(serverID, userID).find((t) => t.type === nextitem.itemtowear)) {
                    // Assign the Toy at a random power between 1 and 5
                    assignToy(serverID, userID, getHeavy(serverID, userID).origbinder, Math.max(Math.round(Math.random() * 5), 1), nextitem.itemtowear, getHeavy(serverID, userID).origbinder);
                    
                    // Configure Message Parameters                    
                    data.toy = true;
                    data.textdata.c1 = getBaseToy(nextitem.itemtowear)?.toyname;
                    data.add = true;
                    
                    //Send Message to Channel
                    messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;
            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), process.recentmessages[serverID][userID]);

                // Increment Costume Index to bypass unknown item
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;
        }

        if (getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx >= mimicCostumes[getProcessVariable(serverID, userID, "userevents").costumermimic.outfit].length) {
            // Remove Current Heavy (Mimic) if end of Costume Array Reached Without End Marker
            let data = {
                textarray: "texts_eventfunctions",
                textdata: {
                    interactionuser: userobject,
                    targetuser: targetobject,
                }
            }
            data.heavy = true;
            data.costumer_mimic = true;
            removeHeavy(serverID, userID, "costumer_mimic");
            data.spitout = true;
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
        }


    } else if (nextitem.category == "end" || getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx >= mimicCostumes[getProcessVariable(serverID, userID, "userevents").costumermimic.outfit].length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Closing Heavy!
        // End of Outfit Marker Reached!        

        // Remove Current Heavy (Mimic)
        removeHeavy(serverID, userID, "costumer_mimic");
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "end") {
            assignHeavy(serverID, userID, nextitem.itemtowear, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder);
            data.textdata.c1 = getHeavy(serverID, userID, nextitem.itemtowear).displayname; // heavy name
            data.add = true;
            messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
        } else {
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete getProcessVariable(serverID, userID, "userevents").costumermimic;
    }
}

const colourItem = (itemtowear, color) => {
    if (color && getWearableName(undefined, `${itemtowear}_${color.toLowerCase()}`)) {
        return `${itemtowear}_${color.toLowerCase()}`;
    }
    else {
        return `${itemtowear}`
    }
}

exports.tick = tick;
