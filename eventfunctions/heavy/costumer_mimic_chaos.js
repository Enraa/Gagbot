const { getCollarName, getCollar, assignCollar, collartypes } = require("../../functions/collarfunctions.js");
const { getUserTags } = require("../../functions/configfunctions.js");
const { assignMitten, getMitten, getMittenName, getGag, convertGagText, assignGag, mittentypes } = require("../../functions/gagfunctions.js");
const { getHeadwear, DOLLVISORS, getHeadwearName, assignHeadwear, headweartypes } = require("../../functions/headwearfunctions.js");
const { removeHeavy, getHeavy, assignHeavy, heavytypes } = require("../../functions/heavyfunctions.js");
const { logConsole } = require("../../functions/logfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { getText } = require("../../functions/textfunctions.js");
const { getChastityBra } = require("../../functions/vibefunctions.js");
const { assignChastityBra } = require("../../functions/vibefunctions.js");
const { getChastityBraName } = require("../../functions/vibefunctions.js");
const { getChastityName, assignChastity } = require("../../functions/vibefunctions.js");
const { getChastity } = require("../../functions/vibefunctions.js");
const { getWearable, getLockedWearable, deleteWearable, getWearableName, assignWearable, wearabletypes, wearablecolors } = require("../../functions/wearablefunctions.js");

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

let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].costumermimic == undefined) { process.userevents[userID].costumermimic = { stage: 0 } }
    if (process.userevents[userID].costumermimic.costumeidx == undefined) { process.userevents[userID].costumermimic.costumeidx = 0 }
    if (process.userevents[userID].costumermimic.origbinder == undefined) { process.userevents[userID].costumermimic.origbinder = getHeavy(userID).origbinder }

    // Randomly generate an outfit
    if (process.userevents[userID].costumermimic.outfit == undefined) { 
        let outfitpieces = [];
        // Create a new array of all LOCKED wearables so we don't add them again!
        let outfitpieceschosen = [...getWearable(userID).filter((f) => (getLockedWearable(userID).includes(f)))];
        let outfitlength = Math.floor(6 + (Math.random() * 5)) // Equip between 6 and 10 items
        console.log(outfitlength);
        let heavyend;
        let blocks = [];
        let tags = getUserTags(userID);
        let goodtags = getUserTags(userID, true)
        for (let i = 0; i < outfitlength; i++) {
            let randomchoice = Math.floor(Math.random() * 9); // PLZ BE RANDOM
            let arr;
            let choice;
            if (randomchoice == 0) {
                // Gag
                arr = Object.keys(process.gagtypes)
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice);
                outfitpieces.push({ category: "gag", itemtowear: choice, color: null })
            }
            else if ((randomchoice == 1) && !blocks.includes("mitten")) {
                // Mitten
                arr = mittentypes
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        if (f.tags && f.tags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((w) => {
                    goodtags.forEach((t) => {
                        if (w.tags && w.tags.includes(t)) {
                            arr.push(w) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice.value)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice.value);
                blocks.push("mitten")
                outfitpieces.push({ category: "mittens", itemtowear: choice.value, color: null })
            } 
            else if ((randomchoice == 2) && !blocks.includes("collar")) {
                arr = collartypes
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        if (f.tags && f.tags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((w) => {
                    goodtags.forEach((t) => {
                        if (w.tags && w.tags.includes(t)) {
                            arr.push(w) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice.value)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice.value);
                blocks.push("collar")
                outfitpieces.push({ category: "collar", itemtowear: choice.value, color: null })
            }
            else if ((randomchoice == 3) && !blocks.includes("chastitybelt")) {
                arr = Object.entries(process.chastitytypes).filter((f) => f[1].category == "Chastity Belt")
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        let basetags = process.chastitytypes[f[0]].tags
                        if (basetags && basetags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((f) => {
                    goodtags.forEach((t) => {
                        let basetags = process.chastitytypes[f[0]].tags
                        if (basetags && basetags.includes(t)) {
                            arr.push(f) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice[0])) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice[0]);
                blocks.push("chastitybelt")
                outfitpieces.push({ category: "chastitybelt", itemtowear: choice[0], color: null })
            }
            else if ((randomchoice == 4) && !blocks.includes("chastitybra")) {
                arr = Object.entries(process.chastitytypes).filter((f) => f[1].category == "Chastity Bra")
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        let basetags = process.chastitytypes[f[0]].tags
                        if (basetags && basetags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((f) => {
                    goodtags.forEach((t) => {
                        let basetags = process.chastitytypes[f[0]].tags
                        if (basetags && basetags.includes(t)) {
                            arr.push(f) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice[0])) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice[0]);
                blocks.push("chastitybra")
                outfitpieces.push({ category: "chastitybra", itemtowear: choice[0], color: null })
            }
            else if ((randomchoice == 5) && !blocks.includes("heavy")) {
                // This one has to go to the end, so it is pushed to the heavyend option.
                arr = heavytypes
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        if (f.tags && f.tags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((w) => {
                    goodtags.forEach((t) => {
                        if (w.tags && w.tags.includes(t)) {
                            arr.push(w) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice.name)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice.name);
                blocks.push("heavy")
                heavyend = { category: "heavy", itemtowear: choice.value, color: null }
            }
            else if ((randomchoice == 5) && !blocks.includes("headwear")) {
                arr = headweartypes
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        if (f.tags && f.tags.includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((w) => {
                    goodtags.forEach((t) => {
                        if (w.tags && w.tags.includes(t)) {
                            arr.push(w) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice.name)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice.name);
                blocks.push("headwear")
                outfitpieces.push({ category: "headwear", itemtowear: choice.value, color: null })
            }
            else {
                arr = wearabletypes
                arr = arr.filter((f) => {
                    let goodtoreturn = true;
                    tags.forEach((t) => {
                        if (f.tags && Object.keys(f.tags).includes(t)) {
                            goodtoreturn = false;
                        }
                    })
                    return goodtoreturn;
                })
                arr.forEach((w) => {
                    goodtags.forEach((t) => {
                        if (w.tags && Object.keys(w.tags).includes(t)) {
                            arr.push(w) // double the chance to get a thing of that tag
                        }
                    })
                })
                choice = arr[Math.floor(arr.length * Math.random())];
                // unique choices only.
                while (outfitpieceschosen.includes(choice.name)) {
                    choice = arr[Math.floor(arr.length * Math.random())];
                }
                outfitpieceschosen.push(choice.name);
                outfitpieces.push({ category: "wearable", itemtowear: choice.value, color: wearablecolors[Math.floor(wearablecolors.length * Math.random())] })
            }
        }
        if (heavyend) { outfitpieces.push(heavyend) }
        process.userevents[userID].costumermimic.outfit = outfitpieces;
    }
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))); // Current clothes that can be removed
    let shuffledclothes = shuffleWearables(currclothes); // I admittedly dont think a big shuffler's necessary but its fine
    // Capture length of initial Removable Wearables array
    if (process.userevents[userID].costumermimic.removableclothes == undefined) { process.userevents[userID].costumermimic.removableclothes = shuffledclothes.length }
    let consumeperpass = Math.round(process.userevents[userID].costumermimic.removableclothes / 4);

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((process.userevents[userID].costumermimic.nextupdate ?? 0) < Date.now()) {
        //process.userevents[userID].costumermimic.nextupdate = Date.now() + 3000; // Test Speed
        process.userevents[userID].costumermimic.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    console.log(process.userevents[userID].costumermimic)

    // Select Item from Chosen Outfit based in index
    let nextitem = process.userevents[userID].costumermimic.outfit[process.userevents[userID].costumermimic.costumeidx];
    let itemtoequipcolored = null;
    let nom_idx = 0;
    let itemsconsumed = "";

    logConsole(("costumer_mimic_chaos: " + "Consume: ", consumeperpass, ", Total: ", getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))).length, ", Stage: ", process.userevents[userID].costumermimic.stage), 1);

    // Initial Text Formatting
    data.heavy = true;
    data.costumer_mimic = true;

    // Stripping Clothes
    if (process.userevents[userID].costumermimic.stage < 3) {
        if (shuffledclothes.length > consumeperpass && consumeperpass >= 2) {
            while (nom_idx < consumeperpass && shuffledclothes[nom_idx] != null) {
                // Fetch Wearable name and concatenate onto string
                if (nom_idx != consumeperpass - 1) {
                    itemsconsumed += getWearableName(undefined, shuffledclothes[nom_idx]) + ", ";
                } else {
                    itemsconsumed += "and " + getWearableName(undefined, shuffledclothes[nom_idx]);
                }
                // remove it 
                deleteWearable(userID, shuffledclothes[nom_idx]);
                nom_idx++;
            }
            data.textdata.c1 = itemsconsumed;
            console.log(itemsconsumed);
            data.removeclothing = true;

            // Send a message saying it stripped things off the wearer <3
            messageSendChannel(getText(data), process.recentmessages[userID])
            process.userevents[userID].costumermimic.stage++
            return;

        } else if (shuffledclothes.length <= consumeperpass && shuffledclothes.length > 0) {
            console.log("Not enough Clothes remaining for a full cycle! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            process.userevents[userID].costumermimic.stage = 3
        }
        else {
            // Victim Stripped of all unprotected clothing unexpectedly, progress to next stage
            console.log("Unexpectedly Naked! Skipping to Dress Up!")
            process.userevents[userID].costumermimic.stage = 4;
            data.textdata.c1 = "Naked";
            data.donestripping = true;
            data.noneremaining = true;
            messageSendChannel(getText(data), process.recentmessages[userID])
            return;
        }
    }

    if (process.userevents[userID].costumermimic.stage == 3) {
        // Handle all remaining Wearables
        data.donestripping = true;
        let remainingwearables = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f)))
        let concat = []
        remainingwearables.forEach((w) => {
            concat.push(getWearableName(undefined, w));
            deleteWearable(userID, w);
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
        messageSendChannel(getText(data), process.recentmessages[userID])

        process.userevents[userID].costumermimic.stage++
        return;
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (process.userevents[userID].costumermimic.stage >= 4 && process.userevents[userID].costumermimic.costumeidx < process.userevents[userID].costumermimic.outfit.length && nextitem.category != "heavy") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(userID) || (getHeadwear(userID) && (getHeadwear(userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "gag":
                if (!getGag(userID) || (getGag(userID) && (getGag(userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                        // Apply the gag    
                        assignGag(userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, process.userevents[userID].costumermimic.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), process.recentmessages[userID])
                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(userID, nextitem.itemtowear, getMitten(userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name
                            assignMitten(userID, nextitem.itemtowear, process.userevents[userID].costumermimic.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "chastitybelt":
                if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(userID)) {
                        data.textdata.c1 = getChastityName(undefined, getChastity(userID).getChastityName) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            process.chastity[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(undefined, nextitem.itemtowear), // chastity name
                            assignChastity(userID, process.userevents[userID].costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "chastitybra":
                if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(userID)) {
                        data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).getChastityBraName) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // new chastity bra name

                            // Update Chastity Bra Name with new type
                            process.chastitybra[userID].chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(undefined, nextitem.itemtowear), // chastity bra name
                            assignChastityBra(userID, process.userevents[userID].costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            case "collar":
                if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(userID)) {
                        data.textdata.c1 = getCollarName(undefined, getCollar(userID).getCollarName) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            process.collar[userID].collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(undefined, nextitem.itemtowear), // collar name
                            assignCollar(userID, process.userevents[userID].costumermimic.origbinder, {}, false, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), process.recentmessages[userID]);

                }
                // Increment Costume Index
                process.userevents[userID].costumermimic.costumeidx++;
                break;

            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), process.recentmessages[userID]);

                // Increment Costume Index to bypass unknown item
                process.userevents[userID].costumermimic.costumeidx++;
                break;
        }

        if (process.userevents[userID].costumermimic.costumeidx >= process.userevents[userID].costumermimic.outfit.length) {
            // Remove Current Heavy (Mimic) if end of Costume Array Reached Without Heavy
            let data = {
                textarray: "texts_eventfunctions",
                textdata: {
                    interactionuser: userobject,
                    targetuser: targetobject,
                }
            }
            data.heavy = true;
            data.costumer_mimic = true;
            removeHeavy(userID);
            data.spitout = true;
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }


    } else if (nextitem.category == "heavy" || process.userevents[userID].costumermimic.costumeidx >= process.userevents[userID].costumermimic.outfit.length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Outfit Heavy!
        // heavy item reached or end of outfit reached        

        // Remove Current Heavy (Mimic)
        removeHeavy(userID);
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "heavy") {
            assignHeavy(userID, nextitem.itemtowear, process.userevents[userID].costumermimic.origbinder);
            data.textdata.c1 = getHeavy(userID).type; // heavy name
            data.add = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        } else {
            data.none = true;
            messageSendChannel(getText(data), process.recentmessages[userID]);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete process.userevents[userID].costumermimic;
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

exports.functiontick = functiontick;