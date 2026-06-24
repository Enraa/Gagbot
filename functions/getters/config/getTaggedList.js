const { getBaseChastity } = require("../chastity/getBaseChastity");
const { getBaseCollar } = require("../collar/getBaseCollar");
const { getBaseCorset } = require("../corset/getBaseCorset");
const { getBaseGag } = require("../gag/getBaseGag");
const { getBaseHeadwear } = require("../headwear/getBaseHeadwear");
const { getBaseHeavy } = require("../heavy/getBaseHeavy");
const { getBaseMitten } = require("../mitten/getBaseMitten");
const { getBaseToy } = require("../toy/getBaseToy");
const { getBaseWearable } = require("../wearable/getBaseWearable");
const { getUserTags } = require("./getUserTags");

/************
 * Takes a user and a set of items and outputs a modified list where forbidden and preferred items are tagged. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is checking against
 * - (array) itemlist - The list of chosen matches to check
 * - (boolean) noforbidden - If true, forbidden items are removed from the list
 * ---
 * ##### Returns a new array with the name value modified if the checks pass. 
 ************/
function getTaggedList(serverID, userID, itemlist, noforbidden) {
    // Get the user's tags
    let usertags = getUserTags(serverID, userID);
    let userpreferredtags = getUserTags(serverID, userID, true);

    // Determine the type of itemlist we were given
    let typeofcheck = getBaseWearable;
    if (getBaseChastity(itemlist[0].value)) {
        typeofcheck = getBaseChastity;
    }
    if (getBaseCollar(itemlist[0].value)) {
        typeofcheck = getBaseCollar;
    }
    if (getBaseGag(itemlist[0].value)) {
        typeofcheck = getBaseGag;
    }
    if (getBaseMitten(itemlist[0].value)) {
        typeofcheck = getBaseMitten;
    }
    if (getBaseCorset(itemlist[0].value)) {
        typeofcheck = getBaseCorset;
    }
    if (getBaseHeavy(itemlist[0].value)) {
        typeofcheck = getBaseHeavy;
    }
    if (getBaseHeadwear(itemlist[0].value)) {
        typeofcheck = getBaseHeadwear;
    }
    if (getBaseToy(itemlist[0].value)) {
        typeofcheck = getBaseToy;
    }

    // Now iterate over each item and modify the name value in itemlist, creating a new array
    let returneditems = [];
    itemlist.forEach((item) => {
        let i = typeofcheck(item.value);

        // Check if the tag is forbidden first
        let forbidden = false;
        usertags.forEach((t) => {
            if (i.tags && Array.isArray(i.tags) && i.tags.includes(t)) {
                forbidden = true;
            } else if (i.tags && i.tags[t]) {
                forbidden = true;
            }
        });

        // Now check if its preferred
        let preferred = false;
        userpreferredtags.forEach((t) => {
            if (i.tags && Array.isArray(i.tags) && i.tags.includes(t)) {
                preferred = true;
            } else if (i.tags && i.tags[t]) {
                preferred = true;
            }
        });

        // If it has a showfunction, this should evaluate as true. If it doesn't, exclude from the returned list. 
        if (i.showfunction) {
            if (!i.showfunction(serverID, userID)) {
                return;
            }
        }
        // If it is NOT forbidden and preferred, tag it. 
        if (preferred && !forbidden) {
            returneditems.push({ name: `✨✨✨ ${item.name} ✨✨✨`, value: item.value })
        }
        else if (forbidden) {
            if (!noforbidden) {
                returneditems.push({ name: `🛇🛇🛇 ${item.name} 🛇🛇🛇`, value: item.value })
            }
        }
        else {
            returneditems.push(item);
        }
    })
    
    return returneditems;
}

exports.getTaggedList = getTaggedList;