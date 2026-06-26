const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getBaseWearable } = require("../wearable/getBaseWearable");

/**********
 * Returns the item type as guessed from supplied string, based on if it has a valid getBase___ return.
 * 
 * - (string) itemID - The item to check
 * ---
 * ##### Returns "wearable", "chastity", "chastitybra", "gag", "corset", "mask", "collar", "heavy", "toy" if known. Undefined if the item does not exist. 
 **********/
function getItemType(itemID) {
    if (getBaseWearable(itemID)) {
        return "wearable"
    }
    if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Belt")) {
        return "chastity"
    }
    if (getBaseChastity(itemID) && (getBaseChastity(itemID).category == "Chastity Bra")) {
        return "chastitybra"
    }
    if (getBaseCollar(itemID)) {
        return "collar"
    }
    if (getBaseGag(itemID)) {
        return "gag"
    }
    if (getBaseMitten(itemID)) {
        return "mitten"
    }
    if (getBaseCorset(itemID)) {
        return "corset"
    }
    if (getBaseHeavy(itemID)) {
        return "heavy"
    }
    if (getBaseHeadwear(itemID)) {
        return "mask"
    }
    if (getBaseToy(itemID)) {
        return "toy"
    }
}

exports.getItemType = getItemType;