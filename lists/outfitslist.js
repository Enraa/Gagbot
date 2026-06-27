const { wearablecolors } = require("../functions/wearablefunctions");

/*********
 * This is a list of outfits. They should be arranged by key to be retrieved with Object.keys or Object.entries. 
 * 
 * ---
 * Each outfit should be an object with the following properties: 
 * - name: The human readable name of the outfit, passed as VAR_C4
 * - items: The items to equip in the outfit. Each item should be a string or object with the following props:
 * - --> required?: (serverID, userID) => If true, the item can be added. Defaults to true and can be omitted. (NOT IMPLEMENTED)
 * - --> item: string name of the item
 * - --> colors?: array of eligible colors for the item. One will be chosen at random if specified. 
 * - outfittags?: Additional tags on the outfit to filter by. 
 * - uniformcolor?: If true, then it will use the first color chosen of the outfit for all colorable items, if possible.
 *********/
let outfitslist = {
    "maid": {
        name: "Maid",
        items: [
            { item: "garters", colors: ["white"] },
            { item: "stockings", colors: ["white"] },
            "vibe_polite",
            "belt_maid",
            "bra_maid",
            "mittens_maid",
            { item: "maid_dress", colors: ["black"] },
            "maid_apron",
            "politeSub", // gag
            "collar_maidtraining",
            "mask_kigu_cutemaid",
            "maid_headdress",
            "straitjacket_maid",
            "legbinder_maid"
        ],
        outfittags: ["chastity"],
        outfitsearchtags: ["maid", "monochrome", "extreme", "chastity"]
    },
    "ponygirl": {
        name: "Ponygirl",
        items: [
            "belt_silver",
            "bra_silver",
            "collar_posture",
            "mittens_leather",
            { item: "ponytack_leather", colors: ["Red", "Purple", "Pink", "Aqua", "Black", "White"] },
            "armbinder_leather",
            { item: "ponyboots_leather", colors: ["Red", "Purple", "Pink", "Aqua", "Black", "White"] },
            "rope_hobble",
            "blindfold_leather",
            "ball", // gag
            { item: "headharness_leather", colors: ["Red", "Purple", "Pink", "Aqua", "Black", "White"] },
            { item: "blinkers_leather", colors: ["Red", "Purple", "Pink", "Aqua", "Black", "White"] },
            "leashing_post"
        ],
        outfittags: ["chastity"],
        outfitsearchtags: ["pony", "colorful"],
        uniformcolor: true
    },
    "princess": {
        name: "Princess",
        items: [
            { item: "bra_lacy", colors: [...wearablecolors] }, 
            { item: "panties_lacy", colors: [...wearablecolors] },
            { item: "stockings", colors: ["White"] },
            { item: "gartersbelt", colors: ["White"] },
            { item: "princess_dress", colors: [...wearablecolors] },
            { item: "gloves_opera", colors: ["White"] },
            { item: "highheels", colors: [...wearablecolors] },
            "mittens_leather",
            "ball", // gag
            "mask_kigu_🥰",
            "tiara_princess",
            "collar_princess",
            "dress_binding"
        ],
        outfittags: [],
        outfitsearchtags: ["royal", "princess"],
        uniformcolor: true
    },
    "princess_nobondage": {
        name: "Princess",
        items: [
            { item: "bra_lacy", colors: [...wearablecolors] }, 
            { item: "panties_lacy", colors: [...wearablecolors] },
            { item: "stockings", colors: ["White"] },
            { item: "gartersbelt", colors: ["White"] },
            { item: "princess_dress", colors: [...wearablecolors] },
            { item: "gloves_opera", colors: ["White"] },
            { item: "highheels", colors: [...wearablecolors] },
            "tiara_princess",
        ],
        outfittags: [],
        outfitsearchtags: ["royal", "princess", "nobondage"],
        uniformcolor: true
    },
    "lewdprincess": {
        name: "Lewd Princess",
        items: [
            { item: "panties_lacy", colors: [...wearablecolors] },
            { item: "stockings", colors: [...wearablecolors] },
            { item: "gartersbelt", colors: [...wearablecolors] },
            "lingerie_royalicing",
            { item: "necklace", colors: ["silver"] },
            { item: "gloves_opera", colors: [...wearablecolors] },
            { item: "highheels", colors: ["white"] },
            "mittens_leather",
            "ball", // gag
            "mask_kigu_Yesh",
            "tiara_princess",
            "collar_princess",
            "boxbinder_leather"
        ],
        outfittags: [],
        outfitsearchtags: ["royal", "princess", "lewd"],
        uniformcolor: true
    },
    "lewdprincess_nobondage": {
        name: "Lewd Princess",
        items: [
            { item: "panties_lacy", colors: [...wearablecolors] },
            { item: "stockings", colors: [...wearablecolors] },
            { item: "gartersbelt", colors: [...wearablecolors] },
            "lingerie_royalicing",
            { item: "necklace", colors: ["silver"] },
            { item: "gloves_opera", colors: [...wearablecolors] },
            { item: "highheels", colors: ["white"] },
            "tiara_princess",
        ],
        outfittags: [],
        outfitsearchtags: ["royal", "princess", "nobondage", "lewd"],
        uniformcolor: true
    },
    "bunnygirl": {
        name: "Bunny Girl",
        items: [
            { item: "outfit_playbunny_headwear", colors: ["Blue"] },
            { item: "bunnytights", colors: ["White"] },
            { item: "suit_outfit", colors: ["Playbunny"] },
            { item: "highheels", colors: ["Blue"] },
            { item: "cuffswrist_bondage", colors: ["Blue"] },
            { item: "cuffsankle_bondage", colors: ["Blue"] },
            { item: "cuffsthigh_bondage", colors: ["Blue"] },
            "mittens_leather",
            "ball",
            "mask_bunny",
            "belt_seal_fire",
            "armbinder_leather"
        ],
        outfittags: ["chastity", "lether"],
        outfitsearchtags: ["bunny", "blue", "bondage", "seal"]
    },
    "kitsune": {
        name: "Kitsune",
        items: [
            { item: "lingerie", colors: ["Indigo"] },
            { item: "thighhighs", colors: ["White"] },
            { item: "kimono", colors: ["Indigo"] },
            { item: "sleeves_detatched", colors: ["Indigo"] },
            { item: "bigcute_ribbon", colors: ["White"] },
            "sandals",
            { item: "hairpins", colors: ["Jade"] },
            "mask_kitsune",
            "mittens_leather",
            "ball",
            "collar_inari",
            "ribbons"
        ],
        outfittags: [],
        outfitsearchtags: ["kitsune", "indigo", "white", "japanese", "mythical"]
    },
    "librarien": {
        name: "Librarien",
        items: [
            { item: "rope_karada", colors: ["Red"] },
            { item: "thighband_leather", colors: ["Brown"] },
            { item: "pencil_skirt", colors: ["Brown"] },
            { item: "buttonup_blouse", colors: ["White"] },
            { item: "ankleboots", colors: ["Brown"] },
            "mittens_leather",
            "collar_posture",
            "silent",
            "mask_kigu_shy",
            "glasses_librarian",
            { item: "tome", colors: ["Tome of Bondage"] },
            "straitjacket_comfy"
        ],
        outfittags: [],
        outfitsearchtags: ["librarian", "brown", "white"],
    },
    "rogue": {
        name: "",
        items: [
            { item: "panties_leather", colors: ["Gray"] },
            { item: "bra_leather", colors: ["Gray"] },
            { item: "gloves_fingerlesselbow", colors: ["Gray"] },
            { item: "bootyshorts_leather", colors: ["Black"] },
            { item: "top_crop_leather", colors: ["Black"] },
            { item: "thighhighboots", colors: ["Gray"] },
            "bandolier_leather",
            "mittens_leather",
            "silent",
            { item: "roguemask_leather", colors: ["Gray"] },
            "collar_moon",
            { item: "cloak", colors: ["Gray"] },
            "boxbinder_hisec"
        ],
        outfittags: ["leather"],
        outfitsearchtags: ["rogue", "gray", "black", "leather"],
    },
    "dancer": {
        name: "Dancer",
        items: [
            "blindfold_cloth",
            "collar_moon",
            "vibe_pulse",
            "belt_seal_earth",
            { item: "armbands", colors: ["Gold"] },
            { item: "bracelets", colors: ["Gold"] },
            { item: "anklets", colors: ["Gold"] },
            { item: "necklace", colors: ["Gold"] },
            { item: "hairpins", colors: ["Gold"] },
            { item: "headchain", colors: ["Gold"] },
            { item: "haremsilks", colors: ["Cyan"] },
            { item: "sleeves_detatched", colors: ["Cyan"] },
            "mittens_leather",
            "ball",
            { item: "veil", colors: ["Half-Face"] },
            "pole_dancer"
        ],
        outfittags: [],
        outfitsearchtags: ["dancer", "gold", "cyan"],
    },
    "paladin": {
        name: "Paladin",
        items: [
            { item: "bodystocking", colors: ["Black"] },
            { item: "harness_leather", colors: ["Leather"] },
            { item: "greaves", colors: ["Steel"] },
            { item: "gauntlet", colors: ["Steel"] },
            "belt_tungsten",
            "bra_tungsten",
            { item: "armour", colors: ["Holy Knight"] },
            { item: "circlet", colors: ["Platinum"] },
            "mittens_leather",
            "ball",
            "collar_steel",
            "yoke"
        ],
        outfittags: ["chastity", "metal"],
        outfitsearchtags: ["paladin", "metal", "holy", "knight"],
    },
    "ranger": {
        name: "Ranger",
        items: [
            { item: "bra_lacy", colors: ["Green"] },
            { item: "panties_lacy", colors: ["Green"] },
            { item: "thighhighs", colors: ["Green"] },
            { item: "gloves_fingerlesselbow", colors: ["Green"] },
            { item: "bootyshorts_leather", colors: ["Brown"] },
            { item: "top_halter", colors: ["Green"] },
            { item: "kneehighboots", colors: ["Brown"] },
            { item: "armour", colors: ["Leather"] },
            "mittens_leather",
            "silent",
            "collar_leather",
            { item: "cloak", colors: ["Green"] },
            "rope_hogtie"
        ],
        outfittags: ["leather"],
        outfitsearchtags: ["ranger", "green", "brown"],
    },
    "healer": {
        name: "Healer",
        items: [
            "blindfold_cloth",
            "collar_star",
            "politeSub",
            { item: "stockings", colors: ["White"] },
            "vibe_headpatbattery",
            "belt_ancient",
            "bra_ancient",
            { item: "shrine_maiden", colors: ["White"] },
            { item: "sleeves_detatched", colors: ["White"] },
            { item: "bigcute_ribbon", colors: ["Red"] },
            { item: "headchain", colors: ["Starveiled"] },
            { item: "balletheels", colors: ["White"] },
            "mittens_leather",
            { item: "staff", colors: ["Gohei"] },
            { item: "leash", colors: ["White"] },
            "armbinder_ancient"
        ],
        outfittags: ["chastity"],
        outfitsearchtags: ["healer", "white", "red", "ancient", "chastity", "extreme"],
    },
    "witch": {
        name: "Whitch",
        items: [
            "blindfold_blackout",
            { item: "bra_lacy", colors: [   ...wearablecolors] },
            { item: "panties_lacy", colors: [...wearablecolors] },
            "stockings",
            { item: "gloves_opera", colors: [...wearablecolors] },
            { item: "flowy_dress", colors: [...wearablecolors] },
            { item: "witchhat_normal", colors: [...wearablecolors] },
            { item: "kneehighboots", colors: ["Black"] },
            { item: "tome", colors: ["Shadowy Tome"] },
            "mittens_hardlight",
            "ball",
            "collar_runic",
            "shadowhands"
        ],
        outfittags: [],
        outfitsearchtags: ["witch", "monochrome", "magic"],
        uniformcolor: true
    },
    "angel": {
        name: "Angel",
        items: [
            "blindfold_cloth",
            { item: "halo", colors: ["Angelic"] },
            { item: "wings", colors: ["Angelic"] },
            { item: "armbands", colors: ["Platinum"] },
            { item: "anklets", colors: ["Platinum"] },
            { item: "headchain", colors: ["Platinum"] },
            "belt_featherlight",
            "bra_featherlight",
            { item: "nightie_sheer", colors: ["White"] },
            "mittens_hardlight",
            "hardlight_fetters",
            "politeSub",
            "collar_star",
            { item: "tome", colors: ["Angelic Tome"] },
            { item: "wingbinders", colors: ["White"] },
            { item: "leash", colors: ["White"] },
            "fiddle"
        ],
        outfittags: ["chastity"],
        outfitsearchtags: ["angel", "white", "extreme"],
    },
    "mermaid": {
        name: "Mermaid",
        items: [
            "legbinder_latexmermaidtail",
            { item: "armbands", colors: ["Cobalt"] },
            { item: "headchain", colors: ["Crystal"] },
            { item: "bikini", colors: ["Skimpy"] },
            { item: "pareo", colors: ["Aqua"] },
            "mittens_hardlight",
            "collar_moon",
            "silent",
            "armbinder_latex",
            "mermaid_tank"
        ],
        outfittags: ["latex", "confined"],
        outfitsearchtags: ["mermaid", "blue", "aqua"],
        uniformcolor: true
    },
    "mer_mermaid": {
        name: "Mer Mermaid",
        items: [
            "legbinder_shadowlatexmermaidtail",
            { item: "bikini", colors: ["Frilly"] },
            { item: "sleeves_detatched", colors: ["Black"] },
            "maid_apron",
            "mittens_maid",
            "politeSub",
            "collar_maid",
            "mask_kigu_sadisticmaid",
            "maid_headdress",
            "straitjacket_maid",
            "mermaid_tank"
        ],
        outfittags: ["latex", "confined"],
        outfitsearchtags: ["mermaid", "extreme", "maid"],
    },
    "cheerleader": {
        name: "Cheerleader",
        items: [
            { item: "thighhighs", colors: ["White"] },
            { item: "gloves_fingerlesselbow", colors: ["White"] },
            { item: "panties_sidetie", colors: ["Red"] },
            { item: "nipple_pasties", colors: ["Red"] },
            { item: "mini_skirt", colors: ["White"] },
            { item: "top_halter", colors: ["Red"] },
            { item: "pumps", colors: ["White"] },
            "mittens_pompom",
            "collar_moon",
            "uwu",
            "vibe_reverb",
            "mask_kigu_teto"
        ],
        outfittags: [],
        outfitsearchtags: ["cheerleader", "red", "white"],
    },
    "dryad": {
        name: "Dryad",
        items: [
            { item: "anklets", colors: ["Floral"] },
            { item: "bracelets", colors: ["Floral"] },
            { item: "gloves_fingerlesselbow", colors: ["Green"] },
            "mittens_leather",
            { item: "armbands", colors: ["Livingwood"] },
            "bra_livingwood",
            "belt_livingwood",
            "collar_livingwood",
            "ball",
            "blindfold_floral",
            { item: "bikini", colors: ["Leaf"] },
            { item: "pareo", colors: ["Leafy"] },
            { item: "sandals_strappy", colors: ["Leafy"] },
            "entangling_vines"
        ],
        outfittags: ["chastity", "living"],
        outfitsearchtags: ["dryad", "green", "floral", "leafy"],
        uniformcolor: true
    }
}

exports.outfitslist = outfitslist;