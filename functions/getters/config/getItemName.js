const { getChastityBraName } = require("../chastity/getChastityBraName");
const { getChastityName } = require("../chastity/getChastityName");
const { getCollarName } = require("../collar/getCollarName");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getGagName } = require("../gag/getGagName");
const { getHeadwearName } = require("../headwear/getHeadwearName");
const { getHeavyName } = require("../heavy/getHeavyName");
const { getMittenName } = require("../mitten/getMittenName");
const { getBaseToy } = require("../toy/getBaseToy");
const { getWearableName } = require("../wearable/getWearableName");
const { getItemType } = require("./getItemType");

/***********
 * Given an item, return the user facing display name of the item. 
 * 
 * - (string) item - The item to get the user displaying name of
 * ---
 * ##### Returns a string containing the item's name, or undefined
 ***********/
function getItemName(item) {
    let itemtype = getItemType(item);
    switch(itemtype) {
        case "wearable":
            return getWearableName(undefined, item);
        case "chastity":
            return getChastityName("NoServer", undefined, item);
        case "chastitybra":
            return getChastityBraName("NoServer", undefined, item);
        case "collar":
            return getCollarName("NoServer", undefined, item);
        case "gag":
            return getGagName(item)
        case "mitten":
            return getMittenName("NoServer", undefined, item)
        case "corset":
            return getBaseCorset(item).name; // Needs a dedicated getCorsetName function!
        case "heavy":
            return getHeavyName(item);
        case "mask":
            return getHeadwearName("NoServer", undefined, item)
        case "toy":
            return getBaseToy(item).toyname // Needs a dedicated getToyName function!
        default:
            console.log(`Unknown item name - ${item}`)
            break;
    }
}

exports.getItemName = getItemName;