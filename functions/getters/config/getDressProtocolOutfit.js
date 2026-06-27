const { collartypes } = require("../../collarfunctions.js");
const { outfitslist } = require("./../../../lists/outfitslist.js");
const { getItemName } = require("./getItemName.js");
const { getItemTags } = require("./getItemTags.js");
const { userHasTags } = require("./UserHasTags.js");

/***********
 * Outputs a random outfit, with colors assigned for each wearable, if specified. Will check for and respect user tags.
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user this is checking against
 * - (string | array) outfittagfilter? - Filters outfits to just those which contain all of the tags specified in outfitsearchtags,
 * - (string | array) requiredtags? - Filters outfits which as a composite, has all tags on this list.
 * - (string) color? - If specified, all colorable items will attempt to use this color first. 
 * ---
 * ##### Outputs an array of item IDs to equip, which can be passed into the items param of a dressprotocol object
 ***********/
function getDressProtocolOutfit(serverID, userID, outfittagfilter = undefined, requiredtags = undefined, color = undefined) {
    // If an outfit filter was chosen, then make sure its an array if we're given a string. 
    if (outfittagfilter && !Array.isArray(outfittagfilter)) { outfittagfilter = [outfittagfilter] };

    // If required tags filter was chosen, then make sure its an array if we're given a string. 
    if (requiredtags && !Array.isArray(requiredtags)) { requiredtags = [requiredtags] };

    // If color is specified, set uniformcolor to it!
    let uniformcolor = color;

    // Get all outfits which are eligible! Choose all outfits, then filter. 
    let alloutfits = Object.keys(outfitslist)

    // Filter for outfits which match an outfit search tag filter
    if (outfittagfilter) {
        outfittagfilter.forEach((t) => {
            alloutfits.forEach((k) => {
                if (!(outfitslist[k].outfitsearchtags && outfitslist[k].outfitsearchtags.includes(t))) {
                    alloutfits.splice(alloutfits.indexOf(k), 1);
                }
            })
        })
    }

    // Filter for outfits which have the required content tags
    if (requiredtags) {
        requiredtags.forEach((t) => {
            alloutfits.forEach((k) => {
                let collateditems = [];
                outfitslist[k].items.forEach((i) => {
                    if (i.item) {
                        collateditems.push(i.item);
                    }
                    else {
                        collateditems.push(i)
                    }
                })
                let itemtags = getItemTags(collateditems)
                if (outfitslist[k].outfittags) {
                    outfitslist[k].outfittags.forEach((ot) => {
                        itemtags.push(ot);
                    })
                }
                if (!(itemtags.includes(t))) {
                    alloutfits.splice(alloutfits.indexOf(k), 1);
                }
            })
        })
    }

    // Finally, of the remaining outfits, create two categories. Any outfit which matches a preferred tag into preferred list. 
    // If any preferred outfits exist, then a 50/50 random is rolled, where 50% of the time it chooses preferred, the other 50% it chooses the standard list.
    // Any outfit which has a forbidden tag for the user will be removed from both lists. 
    let normaloutfits = [];
    let preferredoutfits = [];

    alloutfits.forEach((k) => {
        let collateditems = [];
        outfitslist[k].items.forEach((i) => {
            if (i.item) {
                collateditems.push(i.item);
            }
            else {
                collateditems.push(i)
            }
        })
        let itemtags = getItemTags(collateditems)

        // Now check if it is preferred. 
        if (userHasTags(serverID, userID, itemtags, true)) { preferredoutfits.push(k) }

        // And now check if it is NOT forbidden
        if (!userHasTags(serverID, userID, itemtags)) { normaloutfits.push(k) }
    })

    if (normaloutfits.length == 0) {
        console.log(`NO VALID OUTFITS FOR ${userID}!`)
        // Give back an invalid outfit
        return {
            name: "Pink Square Outfit",
            items: [
                `shirt_checked_pink`,
                `shorts_denim_pink`,
                `tennis_shoes_pink`
            ],
            outfitid: "erroroutfit"
        }
    }

    console.log(normaloutfits);
    console.log(preferredoutfits);

    let chosenoutfit = outfitslist[normaloutfits[Math.floor(Math.random() * normaloutfits.length)]];
    if ((preferredoutfits.length > 0) && (Math.random > 0.50)) {
        chosenoutfit = outfitslist[preferredoutfits[Math.floor(Math.random() * preferredoutfits.length)]];
    }

    let chosenitems = []

    chosenoutfit.items.forEach((i) => {
        if (i.item) {
            if (i.colors) {
                console.log(uniformcolor);
                console.log(i.colors[Math.floor(Math.random() * i.colors.length)])
                if (uniformcolor && chosenoutfit.uniformcolor && i.colors.includes(uniformcolor)) {
                    chosenitems.push(`${i.item}_${uniformcolor.toLowerCase()}`)
                }
                else {
                    let newcolor = i.colors[Math.floor(Math.random() * i.colors.length)]
                    if (!uniformcolor) {
                        uniformcolor = newcolor
                    }
                    chosenitems.push(`${i.item}_${newcolor.toLowerCase()}`);
                }
            }
        }
        else {
            chosenitems.push(i);
        }
    })

    let finalchosenitems = chosenitems.filter((f) => getItemName(f)); // Filter out everything that isnt an item!
    if (finalchosenitems.length != chosenitems.length) {
        console.log(`One or more items does not exist!`)
        console.log(chosenitems)
        console.log(finalchosenitems);
    }

    return {
        name: chosenoutfit.name,
        items: finalchosenitems
    }
}

exports.getDressProtocolOutfit = getDressProtocolOutfit;