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
        outfittags: [],
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
}

exports.outfitslist = outfitslist;