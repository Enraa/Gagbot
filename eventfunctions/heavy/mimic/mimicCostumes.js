// File Containing Costumer Mimic Outfits - Wearables, Headwear, Mittens, Gags, Heavy. Only one Heavy item per outfit, and always at the end.

const maid_outfit = new Array([
    {category: "wearable", itemtowear: "maid_dress", color: "Black" },
    {category: "wearable", itemtowear: "maid_apron", color: "White" },
    {category: "wearable", itemtowear: "maid_headdress", color: null },
    {category: "wearable", itemtowear: "garters", color: "White" },
    {category: "wearable", itemtowear: "stockings", color: "White" },
    {category: "mittens", itemtowear: "mittens_maid", color: null },
    {category: "headwear", itemtowear: "mask_kigu_cutemaid", color: null },
    {category: "gag", itemtowear: "politesub", color: null },
    {category: "heavy", itemtowear: "straitjacket_maid", color: null },
]);

const ponygirl_outfit = new Array ([
    {category: "wearable", itemtowear: "ponyboots_leather", color: "Red" },
    {category: "wearable", itemtowear: "ponytack_leather", color: "Red" },
    {category: "wearable", itemtowear: "headharness_leather", color: "Red" },
    {category: "wearable", itemtowear: "blinkers_leather", color: "Red" },
    {category: "mittens", itemtowear: "mittens_leather", color: null },
    {category: "headwear", itemtowear: "blindfold_leather", color: null },
    {category: "gag", itemtowear: "ball", color: null },
    {category: "heavy", itemtowear: "armbinder_latex", color: null },
]);


const mimicCostumes = [maid_outfit, ponygirl_outfit];

// Export the array for use in other functions.
exports.mimicCostumes = mimicCostumes;