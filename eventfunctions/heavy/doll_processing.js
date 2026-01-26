const { getCollarName, getCollar, assignCollar } = require("../../functions/collarfunctions.js");
const { assignMitten, getMitten, getMittenName } = require("../../functions/gagfunctions.js");
const { getHeadwear, DOLLVISORS, getHeadwearName, assignHeadwear } = require("../../functions/headwearfunctions.js");
const { removeHeavy, getHeavy } = require("../../functions/heavyfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { getText } = require("../../functions/textfunctions.js");
const { getChastityBra } = require("../../functions/vibefunctions.js");
const { assignChastityBra } = require("../../functions/vibefunctions.js");
const { getChastityBraName } = require("../../functions/vibefunctions.js");
const { getChastityName, assignChastity } = require("../../functions/vibefunctions.js");
const { getChastity } = require("../../functions/vibefunctions.js");
const { getWearable, getLockedWearable, deleteWearable, getWearableName, assignWearable, wearablecolors } = require("../../functions/wearablefunctions.js");

// Doll Processing Facility will slowly strip the wearer of all of their clothes!
// Then after they are naked, it will announce once that it is applying restraints
// Then it will slowly apply the restraints!
// Then it will spit them out and unwear the processing facility 
let functiontick = async (userID) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (process.userevents[userID] == undefined) { process.userevents[userID] = {} }
    if (process.userevents[userID].dollprocessing == undefined) { process.userevents[userID].dollprocessing = { stage: 0 } }
    let currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f)) ); // These are the worn clothes
    // Figure out the color of the wearer's current clothing. If none, choose black because black is sexy.
    wearablecolors.forEach((color) => {
        if ((process.userevents[userID].dollprocessing.color == undefined) && getWearable(userID).some((clothing) => (clothing.search(color.toLowerCase()) > -1))) {
            process.userevents[userID].dollprocessing.color = color.toLowerCase();
        }
    })
    if (process.userevents[userID].dollprocessing.color == undefined) { process.userevents[userID].dollprocessing.color = "black" }
    let droneclothes = [`catsuit_latex_${process.userevents[userID].dollprocessing.color}`, "cyberdoll_harness", "doll_heels", "cyberdoll_barcode"]
    currclothes = getWearable(userID).filter((f) => (!getLockedWearable(userID).includes(f))).filter((f) => (!droneclothes.includes(f))); // These are the worn clothes, minus drone clothing
    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[userID])) {
        return;
    }
    // Only update a max of once every 60 seconds. 
    if ((process.userevents[userID].dollprocessing.nextupdate ?? 0) < Date.now()) {
        process.userevents[userID].dollprocessing.nextupdate = Date.now() + 60000;
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
    let catsuited;
    //if ((currclothes.length == 1) && (currclothes[0] == "catsuit_latex")) { catsuited = true }
    data.heavy = true;
    data.doll_processing = true;
    if (currclothes.length > 0) {
        data.textdata.c1 = getWearableName(undefined, currclothes[0]), // wearable name
        data.removeclothing = true;
        deleteWearable(userID, currclothes[0]);
        // Taking off the clothes at the beginning!
        if (process.userevents[userID].dollprocessing.stage == 0) {
            data.stage1 = true;
        }
        // Singular step before applying restraints
        else if (process.userevents[userID].dollprocessing.stage == 1) {
            data.stage2 = true;
        }
        // Applying restraints
        else if (process.userevents[userID].dollprocessing.stage == 2) {
            data.stage3 = true;
        }
        // It is done - wow, such a non-compliant doll! 
        else {
            data.stage4 = true;
        }
        // Send a message saying it stripped something off the wearer <3
        messageSendChannel(getText(data), process.recentmessages[userID])
    }
    else {
        let newclothes = getWearable(userID) // Clothing, check for drone clothes
        let equipped = false;
        droneclothes.forEach((d) => {
            if (!newclothes.includes(d) && !equipped) {
                data.addclothing = true;
                if (d.includes("catsuit")) { 
                    data.catsuit = true 
                }
                else {
                    data[d] = true;
                } 
                data.textdata.c1 = getWearableName(undefined, d), // wearable name
                assignWearable(userID, d);
                messageSendChannel(getText(data), process.recentmessages[userID])
                equipped = true;
                return;
            } 
        })
        if (equipped) { return }
        // Done applying clothes, advance to next stage. 
        if (currclothes.length == 0) {
            if (process.userevents[userID].dollprocessing.stage == 0) {
                process.userevents[userID].dollprocessing.stage++;
                data.donestripping = true;
                messageSendChannel(getText(data), process.recentmessages[userID])
                return;
            }
            if (process.userevents[userID].dollprocessing.stage == 1) {
                process.userevents[userID].dollprocessing.stage++;
            }
        }
        // We are applying restraints if at a high enough stage!
        if (process.userevents[userID].dollprocessing.stage == 2) {
            data.applyingrestraints = true; 
            let appliedrestraint = false;
            // Apply mittens if the doll is not wearing them. 
            if (!getMitten(userID) || (getMitten(userID) && (getMitten(userID).mittenname != "mittens_cyberdoll"))) {
                data.mitten = true;
                if (getMitten(userID)) {
                    data.textdata.c1 = getMittenName(undefined, getMitten(userID).mittenname) ?? "mittens", // mitten name
                    assignMitten(userID, "mittens_cyberdoll", getMitten(userID).origbinder)
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignMitten(userID, "mittens_cyberdoll", targetobject.id)
                    data.textdata.c1 = getMittenName(undefined, "mittens_cyberdoll") ?? "mittens", // mitten name
                    data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[userID])
            }
            // Apply chastity belt if doll is not wearing it
            else if (!getChastity(userID) || (getChastity(userID) && (getChastity(userID).chastitytype != "belt_cyberdoll"))) {
                data.chastitybelt = true;
                if (getChastity(userID)) {
                    data.textdata.c1 = getChastityName(undefined, getChastity(userID).chastitytype) ?? "chastity belt", // mitten name
                    process.chastity[userID].chastitytype = "belt_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignChastity(userID, targetobject.id, "belt_cyberdoll")
                    data.textdata.c1 = getChastityName(undefined, "belt_cyberdoll") ?? "chastity belt", // mitten name
                    data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[userID])
            }
            // Apply chastity bra if doll is not wearing it
            else if (!getChastityBra(userID) || (getChastityBra(userID) && (getChastityBra(userID).chastitytype != "bra_cyberdoll"))) {
                data.chastitybra = true;
                if (getChastityBra(userID)) {
                    data.textdata.c1 = getChastityBraName(undefined, getChastityBra(userID).chastitytype) ?? "chastity bra", // mitten name
                    process.chastitybra[userID].chastitytype = "bra_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignChastityBra(userID, targetobject.id, "bra_cyberdoll")
                    data.textdata.c1 = getChastityBraName(undefined, "bra_cyberdoll") ?? "chastity bra", // mitten name
                    data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[userID])
            }
            // Apply collar to the doll if it is not wearing it
            else if (!getCollar(userID) || (getCollar(userID) && (getCollar(userID).collartype != "collar_cyberdoll"))) {
                data.collar = true;
                if (getCollar(userID)) {
                    data.textdata.c1 = getCollarName(undefined, getCollar(userID).collartype) ?? "collar", // mitten name
                    process.collar[userID].collartype = "collar_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignCollar(userID, targetobject.id, { }, false, "collar_cyberdoll")
                    data.textdata.c1 = getCollarName(undefined, "collar_cyberdoll") ?? "collar", // mitten name
                    data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[userID])
            }
            // Apply doll visor to the doll if it is not wearing it
            else if (!getHeadwear(userID).some((d) => DOLLVISORS.includes(d))) {
                data.headwear = true;
                data.textdata.c1 = getHeadwearName(undefined, "doll_visor"), // mitten name
                assignHeadwear(userID, "doll_visor", targetobject.id)
                data.add = true;
                appliedrestraint = true;
                messageSendChannel(getText(data), process.recentmessages[userID])
            }
            // We are FINALLY DONE!
            if (!appliedrestraint) {
                process.userevents[userID].dollprocessing.stage++
                data.done = true;
                messageSendChannel(getText(data), process.recentmessages[userID])
                return;
            }
        }
        // Yay we now have a new doll! It is such a good doll
        if (process.userevents[userID].dollprocessing.stage == 3) {
            data.processingcomplete = true;
            delete process.userevents[userID].dollprocessing;
            removeHeavy(userID);
            messageSendChannel(getText(data), process.recentmessages[userID])
        }
    }
}

exports.functiontick = functiontick;