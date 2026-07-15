const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getBaseWearable } = require("../wearable/getBaseWearable");

/***********
 * Given an item or items, return an array of all tags that at least one item is affected by. 
 * 
 * - (string | array) items - The item or items to check
 * ---
 * ##### Returns an array of string tags that at least one item contains. 
 ***********/
function getItemTags(items, suppresserror = false) {
    let itemarr = items;
    if (!Array.isArray(items)) {
        itemarr = [items]
    }
    let outtags = {};
    itemarr.forEach((item) => {
        // Determine the type of itemlist we were given
        let typeofcheck = getBaseWearable;
        if (getBaseChastity(item)) {
            typeofcheck = getBaseChastity;
        }
        if (getBaseCollar(item)) {
            typeofcheck = getBaseCollar;
        }
        if (getBaseGag(item)) {
            typeofcheck = getBaseGag;
        }
        if (getBaseMitten(item)) {
            typeofcheck = getBaseMitten;
        }
        if (getBaseCorset(item)) {
            typeofcheck = getBaseCorset;
        }
        if (getBaseHeavy(item)) {
            typeofcheck = getBaseHeavy;
        }
        if (getBaseHeadwear(item)) {
            typeofcheck = getBaseHeadwear;
        }
        if (getBaseToy(item)) {
            typeofcheck = getBaseToy;
        }

        let i = typeofcheck(item);
        if ((i == undefined) && !suppresserror) {
            console.log(`Error finding item`)
            console.log(item);
            console.trace()
        }
        if (i && i.tags && Array.isArray(i.tags)) {
            i.tags.forEach((tag) => {
                outtags[tag] = true;
            })
        } else if (i && i.tags) {
            Object.keys(i.tags).forEach((tagkey) => {
                outtags[tagkey] = true;
            })
        }
    })

    // Return a string list of tags given the item names. 
    return Object.keys(outtags);
}

exports.getItemTags = getItemTags;