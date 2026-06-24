const { getChastity } = require("../../functions/getters/chastity/getChastity.js");
const { getChastityBra } = require("../../functions/getters/chastity/getChastityBra.js");
const { getChastityBraName } = require("../../functions/getters/chastity/getChastityBraName.js");
const { getChastityName } = require("../../functions/getters/chastity/getChastityName.js");
const { getCollar } = require("../../functions/getters/collar/getCollar.js");
const { getCollarName } = require("../../functions/getters/collar/getCollarName.js");
const { getOption } = require("../../functions/getters/config/getOption.js");
const { getProcessVariable } = require("../../functions/getters/config/getProcessVariable.js");
const { getHeadwear } = require("../../functions/getters/headwear/getHeadwear.js");
const { getHeadwearName } = require("../../functions/getters/headwear/getHeadwearName.js");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy.js");
const { getMitten } = require("../../functions/getters/mitten/getMitten.js");
const { getMittenName } = require("../../functions/getters/mitten/getMittenName.js");
const { getLockedWearable } = require("../../functions/getters/wearable/getLockedWearable.js");
const { getWearable } = require("../../functions/getters/wearable/getWearable.js");
const { getWearableName } = require("../../functions/getters/wearable/getWearableName.js");
const { DOLLVISORS } = require("../../functions/headwearfunctions.js");
const { messageSendChannel } = require("../../functions/messagefunctions.js");
const { assignChastity } = require("../../functions/setters/chastity/assignChastity.js");
const { assignChastityBra } = require("../../functions/setters/chastity/assignChastityBra.js");
const { assignCollar } = require("../../functions/setters/collar/assignCollar.js");
const { setProcessVariable } = require("../../functions/setters/config/setProcessVariable.js");
const { assignHeadwear } = require("../../functions/setters/headwear/assignHeadwear.js");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { assignMitten } = require("../../functions/setters/mitten/assignMitten.js");
const { assignWearable } = require("../../functions/setters/wearable/assignWearable.js");
const { removeWearable } = require("../../functions/setters/wearable/removeWearable.js");
const { getText } = require("../../functions/textfunctions.js");
const { wearablecolors } = require("../../functions/wearablefunctions.js");

// Doll Processing Facility will slowly strip the wearer of all of their clothes!
// Then after they are naked, it will announce once that it is applying restraints
// Then it will slowly apply the restraints!
// Then it will spit them out and unwear the processing facility 
let tick = async (serverID, userID, datain) => {
    if (process.userevents == undefined) { process.userevents = {} }
    if (getProcessVariable(serverID, userID, "userevents") == undefined) { setProcessVariable(serverID, userID, "userevents", {}) }
    if (getProcessVariable(serverID, userID, "userevents").dollprocessing == undefined) { getProcessVariable(serverID, userID, "userevents").dollprocessing = { stage: 0 } }  
    if (getProcessVariable(serverID, userID, "userevents").dollprocessing.doll_id == undefined) { getProcessVariable(serverID, userID, "userevents").dollprocessing.doll_id = getOption(serverID, userID, "dollvisorname") }      
    if (getProcessVariable(serverID, userID, "userevents").dollprocessing.existingbarcodelogged == undefined) { getProcessVariable(serverID, userID, "userevents").dollprocessing.existingbarcodelogged = !getWearable(serverID, userID).includes("cyberdoll_barcode"); }

    let currclothes = getWearable(serverID, userID).filter((f) => (!getLockedWearable(serverID, userID).includes(f))); // These are the worn clothes
    // Figure out the color of the wearer's current clothing. If none, choose black because black is sexy.
    wearablecolors.forEach((color) => {
        if ((getProcessVariable(serverID, userID, "userevents").dollprocessing.color == undefined) && getWearable(serverID, userID).some((clothing) => (clothing.search(color.toLowerCase()) > -1))) {
            getProcessVariable(serverID, userID, "userevents").dollprocessing.color = color.toLowerCase();
        }
    })
    if (getProcessVariable(serverID, userID, "userevents").dollprocessing.color == undefined) { getProcessVariable(serverID, userID, "userevents").dollprocessing.color = "black" }
    let droneclothes = [`catsuit_latex_${getProcessVariable(serverID, userID, "userevents").dollprocessing.color}`, "cyberdoll_harness", "doll_heels", "cyberdoll_barcode"]
    currclothes = getWearable(serverID, userID).filter((f) => (!getLockedWearable(userID).includes(f))).filter((f) => (!droneclothes.includes(f))); // These are the worn clothes, minus drone clothing
    // get the user object, if it doesn't exist, go away
    let userobject = await process.client.users.fetch(userID); // The person in the processing terminal!
    let targetobject = await process.client.users.fetch(getHeavy(serverID, userID).origbinder ?? userID); // The cruel person who threw this person in the terminal!
    // Something's wrong. 
    if (!userobject || !targetobject || !(process.recentmessages && process.recentmessages[serverID][userID])) {
        return;
    }
    // Only update a max of once every 60 seconds. 
    if ((getProcessVariable(serverID, userID, "userevents").dollprocessing.nextupdate ?? 0) < Date.now()) {
        getProcessVariable(serverID, userID, "userevents").dollprocessing.nextupdate = Date.now() + 60000;
        //getProcessVariable(serverID, userID, "userevents").dollprocessing.nextupdate = Date.now() + 3000; // TEST SPEED
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
    let catsuited;
    //if ((currclothes.length == 1) && (currclothes[0] == "catsuit_latex")) { catsuited = true }
    data.heavy = true;
    data.doll_processing = true;
    if (currclothes.length > 0) {
        data.textdata.c1 = getWearableName(undefined, currclothes[0]), // wearable name
            data.removeclothing = true;
        removeWearable(serverID, userID, currclothes[0]);
        // Taking off the clothes at the beginning!
        if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 0) {
            data.stage1 = true;
        }
        // Singular step before applying restraints
        else if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 1) {
            data.stage2 = true;
        }
        // Applying restraints
        else if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 2) {
            data.stage3 = true;
        }
        // It is done - wow, such a non-compliant doll! 
        else {
            data.stage4 = true;
        }
        // Send a message saying it stripped something off the wearer <3
        messageSendChannel(getText(data), process.recentmessages[serverID][userID])
    }
    else {
        let newclothes = getWearable(serverID, userID) // All Clothing, check for drone clothes
        let equipped = false;
        droneclothes.forEach((d) => {
            if (!getProcessVariable(serverID, userID, "userevents").dollprocessing.existingbarcodelogged) {
                // Existing Barcode Detection And Messaging
                data.addclothing = true;
                data.existing_barcode = true;
                data.textdata.c1 = getWearableName(undefined, d); // wearable name
                data.textdata.c2 = getProcessVariable(serverID, userID, "userevents").dollprocessing.doll_id;
                messageSendChannel(getText(data), process.recentmessages[serverID][userID]);
                equipped = true;
                getProcessVariable(serverID, userID, "userevents").dollprocessing.existingbarcodelogged = true;
                return;
            } else if (!newclothes.includes(d) && !equipped) {
                data.addclothing = true;
                if (d.includes("catsuit")) {
                    data.catsuit = true
                } 
                else {
                    data[d] = true;
                }
                data.textdata.c1 = getWearableName(undefined, d), // wearable name
                    assignWearable(serverID, userID, d);
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                equipped = true;
                return;
            }
        })
        if (equipped) { return }
        // Done applying clothes, advance to next stage. 
        if (currclothes.length == 0) {
            if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 0) {
                getProcessVariable(serverID, userID, "userevents").dollprocessing.stage++;
                data.donestripping = true;
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                return;
            }
            if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 1) {
                getProcessVariable(serverID, userID, "userevents").dollprocessing.stage++;
            }
        }
        // We are applying restraints if at a high enough stage!
        if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 2) {
            data.applyingrestraints = true;
            let appliedrestraint = false;
            // Apply mittens if the doll is not wearing them. 
            if (!getMitten(serverID, userID) || (getMitten(serverID, userID) && (getMitten(serverID, userID).mittenname != "mittens_cyberdoll"))) {
                data.mitten = true;
                if (getMitten(serverID, userID)) {
                    data.textdata.c1 = getMittenName(undefined, getMitten(serverID, userID).mittenname) ?? "mittens", // mitten name
                        assignMitten(serverID, userID, "mittens_cyberdoll", getMitten(serverID, userID).origbinder)
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignMitten(serverID, userID, "mittens_cyberdoll", targetobject.id)
                    data.textdata.c1 = getMittenName(undefined, "mittens_cyberdoll") ?? "mittens", // mitten name
                        data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            }
            // Apply chastity belt if doll is not wearing it
            else if (!getChastity(serverID, userID) || (getChastity(serverID, userID) && (getChastity(serverID, userID).chastitytype != "belt_cyberdoll"))) {
                data.chastitybelt = true;
                if (getChastity(serverID, userID)) {
                    data.textdata.c1 = getChastityName(serverID, undefined, getChastity(serverID, userID).chastitytype) ?? "chastity belt", // mitten name
                        getChastity(serverID, userID).chastitytype = "belt_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignChastity(serverID, userID, targetobject.id, "belt_cyberdoll")
                    data.textdata.c1 = getChastityName(serverID, undefined, "belt_cyberdoll") ?? "chastity belt", // mitten name
                        data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            }
            // Apply chastity bra if doll is not wearing it
            else if (!getChastityBra(serverID, userID) || (getChastityBra(serverID, userID) && (getChastityBra(serverID, userID).chastitytype != "bra_cyberdoll"))) {
                data.chastitybra = true;
                if (getChastityBra(serverID, userID)) {
                    data.textdata.c1 = getChastityBraName(serverID, undefined, getChastityBra(userID).chastitytype) ?? "chastity bra", // mitten name
                        getChastityBra(serverID, userID).chastitytype = "bra_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignChastityBra(serverID, userID, targetobject.id, "bra_cyberdoll")
                    data.textdata.c1 = getChastityBraName(serverID, undefined, "bra_cyberdoll") ?? "chastity bra", // mitten name
                        data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            }
            // Apply collar to the doll if it is not wearing it
            else if (!getCollar(serverID, userID) || (getCollar(serverID, userID) && (getCollar(serverID, userID).collartype != "collar_cyberdoll"))) {
                data.collar = true;
                if (getCollar(serverID, userID)) {
                    data.textdata.c1 = getCollarName(serverID, undefined, getCollar(serverID, userID).collartype) ?? "collar", // mitten name
                        getCollar(serverID, userID).collartype = "collar_cyberdoll"
                    data.replace = true;
                    appliedrestraint = true;
                }
                else {
                    assignCollar(serverID, userID, targetobject.id, {}, false, "collar_cyberdoll")
                    data.textdata.c1 = getCollarName(serverID, undefined, "collar_cyberdoll") ?? "collar", // mitten name
                        data.add = true;
                    appliedrestraint = true;
                }
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            }
            // Apply doll visor to the doll if it is not wearing it
            else if (!getHeadwear(serverID, userID).some((d) => DOLLVISORS.includes(d))) {
                data.headwear = true;
                data.textdata.c1 = getHeadwearName(serverID, undefined, "doll_visor"), // mitten name
                    assignHeadwear(serverID, userID, "doll_visor", targetobject.id)
                data.add = true;
                appliedrestraint = true;
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
            }
            // We are FINALLY DONE!
            if (!appliedrestraint) {
                getProcessVariable(serverID, userID, "userevents").dollprocessing.stage++
                data.done = true;
                data.textdata.c2 = getProcessVariable(serverID, userID, "userevents").dollprocessing.doll_id;
                messageSendChannel(getText(data), process.recentmessages[serverID][userID])
                return;
            }
        }
        // Yay we now have a new doll! It is such a good doll
        if (getProcessVariable(serverID, userID, "userevents").dollprocessing.stage == 3) {
            data.processingcomplete = true;
            delete getProcessVariable(serverID, userID, "userevents").dollprocessing;
            removeHeavy(serverID, userID, "doll_processing");
            messageSendChannel(getText(data), process.recentmessages[serverID][userID])
        }
    }
}

exports.tick = tick;