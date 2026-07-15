const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getBaseWearable } = require("../wearable/getBaseWearable");

/************
 * Given an item by ID, gets its base definition. 
 * 
 * - (string) itemID - The item ID of the item
 * ---
 * ##### Returns the base item definition if it exists. 
 ************/
function getBaseItem(itemID) {
    if (getBaseWearable(itemID)) {
        return getBaseWearable(itemID)
    }
    if (getBaseChastity(itemID)) {
        return getBaseChastity(itemID)
    }
    if (getBaseCollar(itemID)) {
        return getBaseCollar(itemID)
    }
    if (getBaseGag(itemID)) {
        return getBaseGag(itemID)
    }
    if (getBaseMitten(itemID)) {
        return getBaseMitten(itemID)
    }
    if (getBaseCorset(itemID)) {
        return getBaseCorset(itemID)
    }
    if (getBaseHeavy(itemID)) {
        return getBaseHeavy(itemID)
    }
    if (getBaseHeadwear(itemID)) {
        return getBaseHeadwear(itemID)
    }
    if (getBaseToy(itemID)) {
        return getBaseToy(itemID)
    }
}

exports.getBaseItem = getBaseItem;