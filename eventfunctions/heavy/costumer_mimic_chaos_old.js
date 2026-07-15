const { getChastity } = require("../../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra.js");
const { getChastityBraName } = require("../../functions/getters/chastity/getChastityBraName.js");
const { getChastityName } = require("../../functions/getters/chastity/getChastityName.js");
const { getCollar } = require("../../functions/getters/collar/getCollar.js");
const { getCollarName } = require("../../functions/getters/collar/getCollarName.js");
const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js");
const { getUserTags } = require("../../functions/getters/config/getUserTags.js");
const { getGag } = require("../../functions/getters/gag/getGag.js");
const { convertGagText } = require("../../functions/getters/gag/getGagName.js");
const { getHeadwear } = require("../../functions/getters/headwear/getHeadwear.js");
const { getHeadwearName } = require("../../functions/getters/headwear/getHeadwearName.js");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy.js");
const { getMitten } = require("../../functions/getters/mitten/getMitten.js");
const { getMittenName } = require("../../functions/getters/mitten/getMittenName.js");
const { getLockedWearable } = require("../../functions/getters/wearable/getLockedWearable.js");
const { getWearable } = require("../../functions/getters/wearable/getWearable.js");
const { getWearableName } = require("../../functions/getters/wearable/getWearableName.js");
const { logConsole } = require("../../functions/logfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { assignChastity } = require("../../functions/setters/chastity/assignChastity.js");
const { assignChastityBra } = require("../../functions/setters/chastity/assignChastityBra.js");
const { assignCollar } = require("../../functions/setters/collar/assignCollar.js");
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable.js");
const { assignGag } = require("../../functions/setters/gag/assignGag.js");
const { assignHeadwear } = require("../../functions/setters/headwear/assignHeadwear.js");
const { assignHeavy } = require("../../functions/setters/heavy/assignHeavy.js");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { assignMitten } = require("../../functions/setters/mitten/assignMitten.js");
const { assignWearable } = require("../../functions/setters/wearable/assignWearable.js");
const { deleteWearable } = require("../../functions/setters/wearable/removeWearable.js");
const { getText } = require("../../functions/textfunctions.js");
const { wearabletypes, wearablecolors } = require("../../functions/wearablefunctions.js");

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

let tick = async (serverID, userID, datain) => {
    if (getProcessVariable(serverID, userID, "userevents") == undefined) { setProcessVariable(serverID, userID, "userevents", {}) }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic = { stage: 0 } }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx = 0 }
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder = getHeavy(serverID, userID).origbinder }

    // Randomly generate an outfit
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.outfit == undefined) { 
        let outfitpieces = [];
        // Create a new array of all LOCKED wearables so we don't add them again!
        let outfitpieceschosen = [...getWearable(serverID, userID).filter((f) => (getLockedWearable(serverID, userID).includes(f)))];
        let outfitlength = Math.floor(6 + (Math.random() * 5)) // Equip between 6 and 10 items
        console.log(outfitlength);
        let heavyend;
        let blocks = [];
        let tags = getUserTags(serverID, userID);
        let goodtags = getUserTags(serverID, userID, true)
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
                arr = process.mittentypes.entries().filter((f) => {
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
                arr = process.collartypes.entries().filter((f) => {
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
                arr = [...process.heavytypes]
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
                arr = [...process.headtypes]
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
                arr = [...wearabletypes]
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
        getProcessVariable(serverID, userID, "userevents").costumermimic.outfit = outfitpieces;
    }
    let currclothes = getWearable(serverID, userID).filter((f) => (!getLockedWearable(userID).includes(f))); // Current clothes that can be removed
    let shuffledclothes = shuffleWearables(currclothes); // I admittedly dont think a big shuffler's necessary but its fine
    // Capture length of initial Removable Wearables array
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes == undefined) { getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes = shuffledclothes.length }
    let consumeperpass = Math.round(getProcessVariable(serverID, userID, "userevents").costumermimic.removableclothes / 4);

    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(serverID, userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !getRecentChannel(serverID, userID).valid) {
        return;
    }

    // Only update a max of once every 20 seconds. 
    if ((getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate ?? 0) < Date.now()) {
        //getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate = Date.now() + 3000; // Test Speed
        getProcessVariable(serverID, userID, "userevents").costumermimic.nextupdate = Date.now() + 20000;
    }
    else { return };

    // Build data tree:
    let data = {
        textarray: "texts_eventfunctions",
        textdata: {
            serverID: serverID, 
            interactionuser: userobject,
            targetuser: targetobject,
        }
    }

    console.log(getProcessVariable(serverID, userID, "userevents").costumermimic)

    // Select Item from Chosen Outfit based in index
    let nextitem = getProcessVariable(serverID, userID, "userevents").costumermimic.outfit[getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx];
    let itemtoequipcolored = null;
    let nom_idx = 0;
    let itemsconsumed = "";

    logConsole(("costumer_mimic_chaos: " + "Consume: ", consumeperpass, ", Total: ", getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f))).length, ", Stage: ", getProcessVariable(serverID, userID, "userevents").costumermimic.stage), 1);

    // Initial Text Formatting
    data.heavy = true;
    data.costumer_mimic = true;

    // Stripping Clothes
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage < 3) {
        if (shuffledclothes.length > consumeperpass && consumeperpass >= 2) {
            while (nom_idx < consumeperpass && shuffledclothes[nom_idx] != null) {
                // Fetch Wearable name and concatenate onto string
                if (nom_idx != consumeperpass - 1) {
                    itemsconsumed += getWearableName(undefined, shuffledclothes[nom_idx]) + ", ";
                } else {
                    itemsconsumed += "and " + getWearableName(undefined, shuffledclothes[nom_idx]);
                }
                // remove it 
                deleteWearable(serverID, userID, shuffledclothes[nom_idx]);
                nom_idx++;
            }
            data.textdata.c1 = itemsconsumed;
            console.log(itemsconsumed);
            data.removeclothing = true;

            // Send a message saying it stripped things off the wearer <3
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage++
            return;

        } else if (shuffledclothes.length <= consumeperpass && shuffledclothes.length > 0) {
            console.log("Not enough Clothes remaining for a full cycle! Skipping to stage 3!")
            // Skip to Stage 4 and consume all remaining items
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage = 3
        }
        else {
            // Victim Stripped of all unprotected clothing unexpectedly, progress to next stage
            console.log("Unexpectedly Naked! Skipping to Dress Up!")
            getProcessVariable(serverID, userID, "userevents").costumermimic.stage = 4;
            data.textdata.c1 = "Naked";
            data.donestripping = true;
            data.noneremaining = true;
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
            return;
        }
    }

    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage == 3) {
        // Handle all remaining Wearables
        data.donestripping = true;
        let remainingwearables = getWearable(serverID, userID).filter((f) => (!getLockedWearable(userID).includes(f)))
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
        messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)

        getProcessVariable(serverID, userID, "userevents").costumermimic.stage++
        return;
    }

    // Apply Outfit Items once stripped until last index of array is reached or a heavy item is found
    if (getProcessVariable(serverID, userID, "userevents").costumermimic.stage >= 4 && getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx < getProcessVariable(serverID, userID, "userevents").costumermimic.outfit.length && nextitem.category != "heavy") {

        data.applyingOutfit = true;
        switch (nextitem.category) {
            case "wearable":
                data.wearable = true;
                itemtoequipcolored = colourItem(nextitem.itemtowear, nextitem.color);
                if (itemtoequipcolored != null) {
                    data.textdata.c1 = getWearableName(undefined, itemtoequipcolored)
                    assignWearable(serverID, userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
                }
                else {
                    data.textdata.c1 = getWearableName(undefined, nextitem.itemtowear)
                    assignWearable(userID, itemtoequipcolored);
                    data.add = true;
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "headwear":
                if (!getHeadwear(serverID, userID) || (getHeadwear(serverID, userID) && (getHeadwear(serverID, userID).getHeadwearName != nextitem.itemtowear))) {
                    data.headwear = true;
                    data.textdata.c1 = getHeadwearName(undefined, nextitem.itemtowear), // headwear name

                        // Apply the headwear    
                        assignHeadwear(serverID, userID, nextitem.itemtowear, targetobject.id)

                    data.add = true;
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "gag":
                if (!getGag(serverID, userID) || (getGag(serverID, userID) && (getGag(serverID, userID).getGagName != nextitem.itemtowear))) {
                    data.gag = true;
                    data.textdata.c1 = convertGagText(nextitem.itemtowear), // gag name
                        // Apply the gag    
                        assignGag(userID, nextitem.itemtowear, Math.floor(Math.random() * 10) + 1, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder)
                    data.add = true;
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid)
                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "mittens":
                if (!getMitten(serverID, userID) || (getMitten(serverID, userID) && (getMitten(serverID, userID).getMittenName != nextitem.itemtowear))) {
                    data.mitten = true;
                    if (getMitten(serverID, userID)) {
                        data.textdata.c1 = getMittenName(undefined, getMitten(serverID, userID).mittenname) ?? "mittens", // mitten name
                            data.textdata.c2 = getMittenName(serverID, undefined, nextitem.itemtowear), // new mitten name
                            assignMitten(userID, nextitem.itemtowear, getMitten(serverID, userID).origbinder)

                        data.replace = true;
                    }
                    else {
                        data.textdata.c1 = getMittenName(undefined, nextitem.itemtowear), // mitten name
                            assignMitten(userID, nextitem.itemtowear, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);

                }
                // Increment Costume Index
                getProcessVariable(serverID, serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "chastitybelt":
                if (!getChastity(serverID, userID) || (getChastity(serverID, userID) && (getChastity(serverID, userID).getChastityName != nextitem.itemtowear))) {
                    data.chastitybelt = true;
                    if (getChastity(serverID, userID)) {
                        data.textdata.c1 = getChastityName(serverID, undefined, getChastity(serverID, userID).chastitytype) ?? "chastity belt", // chastity name
                            data.textdata.c2 = getChastityName(serverID, undefined, nextitem.itemtowear), // new chastity name

                            // Update Chastity Belt Name with new type
                            getChastity(serverID, userID).chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityName(serverID, undefined, nextitem.itemtowear), // chastity name
                            assignChastity(serverID, userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "chastitybra":
                if (!getChastityBra(serverID, userID) || (getChastityBra(serverID, userID) && (getChastityBra(serverID, userID).getChastityBraName != nextitem.itemtowear))) {
                    data.chastitybra = true;
                    if (getChastityBra(serverID, userID)) {
                        data.textdata.c1 = getChastityBraName(serverID, undefined, getChastityBra(serverID, userID).chastitytype) ?? "chastity bra", // chastity bra name
                            data.textdata.c2 = getChastityBraName(serverID, undefined, nextitem.itemtowear), // new chastity bra name

                            // Update Chastity Bra Name with new type
                            getChastityBra(serverID, userID).chastitytype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getChastityBraName(serverID, undefined, nextitem.itemtowear), // chastity bra name
                            assignChastityBra(serverID, userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            case "collar":
                if (!getCollar(serverID, userID) || (getCollar(serverID, userID) && (getCollar(serverID, userID).getCollarName != nextitem.itemtowear))) {
                    data.collar = true;
                    if (getCollar(serverID, userID)) {
                        data.textdata.c1 = getCollarName(serverID, undefined, getCollar(serverID, userID).collartype) ?? "collar", // collar name
                            data.textdata.c2 = getCollarName(serverID, undefined, nextitem.itemtowear), // new collar name

                            // Update Collar Name with new type
                            getCollar(serverID, userID).collartype = nextitem.itemtowear

                        data.replace = true;
                    }
                    else {
                        data.textdata.c2 = getCollarName(serverID, undefined, nextitem.itemtowear), // collar name
                            assignCollar(userID, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder, {}, false, nextitem.itemtowear)
                        data.add = true;
                    }
                    messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);

                }
                // Increment Costume Index
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;

            default:
                // Unknown Item Category in Outfit
                data.unknown = true;
                data.textdata.c1 = nextitem.itemtowear; // item name
                messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);

                // Increment Costume Index to bypass unknown item
                getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx++;
                break;
        }

        if (getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx >= getProcessVariable(serverID, userID, "userevents").costumermimic.outfit.length) {
            // Remove Current Heavy (Mimic) if end of Costume Array Reached Without Heavy
            let data = {
                textarray: "texts_eventfunctions",
                textdata: {
                    serverID: serverID,
                    interactionuser: userobject,
                    targetuser: targetobject,
                }
            }
            data.heavy = true;
            data.costumer_mimic = true;
            removeHeavy(serverID, userID, "costumer_mimic_chaos");
            data.spitout = true;
            data.none = true;
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
        }


    } else if (nextitem.category == "heavy" || getProcessVariable(serverID, userID, "userevents").costumermimic.costumeidx >= getProcessVariable(serverID, userID, "userevents").costumermimic.outfit.length) {
        // Final Stage - Remove Mimic Heavy and spit them out, then apply Outfit Heavy!
        // heavy item reached or end of outfit reached        

        // Remove Current Heavy (Mimic)
        removeHeavy(serverID, userID, "costumer_mimic_chaos");
        data.spitout = true;

        // Apply New Heavy
        if (nextitem.itemtowear && nextitem.category == "heavy") {
            assignHeavy(serverID, userID, nextitem.itemtowear, getProcessVariable(serverID, userID, "userevents").costumermimic.origbinder);
            data.textdata.c1 = getHeavy(serverID, userID).displayname; // heavy name
            data.add = true;
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
        } else {
            data.none = true;
            messageSendChannel(getText(data), getRecentChannel(serverID, userID).channelid);
        }

        // Remove Event and exit (Does this automatically go to Garbage Collector?)
        delete getProcessVariable(serverID, userID, "userevents").costumermimic;
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

exports.tick = tick;