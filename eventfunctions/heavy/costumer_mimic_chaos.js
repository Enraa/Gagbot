const { getDressProtocolOutfit } = require("../../functions/getters/config/getDressProtocolOutfit");
const { getHeavy } = require("../../functions/getters/heavy/getHeavy");
const { removeHeavy } = require("../../functions/setters/heavy/removeHeavy.js");
const { markForSave } = require("../../functions/other/markForSave.js");
const { getRecentChannel } = require("../../functions/getters/config/getRecentChannel.js");
const { handleDressProtocol } = require("../../functions/other/handleDressProtocol.js");
const { getUserTags } = require("../../functions/getters/config/getUserTags.js");
const { getLockedWearable } = require("../../functions/getters/wearable/getLockedWearable.js");
const { getWearable } = require("../../functions/getters/wearable/getWearable.js");
const { getBaseWearable } = require("../../functions/getters/wearable/getBaseWearable.js");
const { mittentypes } = require("../../functions/gagfunctions.js");
const { collartypes } = require("../../functions/collarfunctions.js");

/**********
 * Event for Dress Protocol. This is a subclass of tick events, but comes with the heavy bondage object in question. 
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user this is for
 * - (heavy object) heavy - The output from getHeavy for this bondage
 * ---
 * Dress Protocol Stages consist of the following:
 * - Stage 0: The prep work handled by the heavy bondage before engaging the Dress Protocol. This sets up the DP object. 
 * - Stage 1: Strip away the clothing until nothing is left, excluding locked and .excludeWearable
 * - Stage 2: Dress each item in .items until all are found on the user. Remove offending clothing if necessary.
 * - Stage 3: Pre-finalized Step. Remove offending clothing if necessary. 
 * - Stage 4: Remove the Heavy Bondage that invoked the dressprotocol. 
 * - --> Additional stages beyond this can be handled, but the final stage MUST remove the heavy restraint. 
 * ---
 * The .dressprotocol should be inserted with the following info:
 * - dressprotocolname: This heavy bondage's name 
 * - name: Name of the outfit
 * - keyholder?: User ID to give keyed restraints to, if any.
 * - stage: integer, starting at 0
 * - items: An array of strings with items to equip. The array will be equipped in order.
 * - excludeWearable: An array of strings in wearables that will be ignored
 * - ignoreclothing?: If true, skips the removal step entirely.
 * - cooldown: Rate between updates. Defaults to 20000ms.
 * - nextupdate: The timestamp the next update is permitted.
 **********/
let dressprotocoltick = async (serverID, userID, heavy) => {
    if (!heavy.dressprotocol) {
        // Chaos is one that already respects tags! 
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
                outfitpieces.push(choice)
            }
            else if ((randomchoice == 1) && !blocks.includes("mitten")) {
                // Mitten
                arr = [...mittentypes]
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
                outfitpieces.push(choice.value)
            } 
            else if ((randomchoice == 2) && !blocks.includes("collar")) {
                arr = [...collartypes]
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
                outfitpieces.push(choice.value)
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
                outfitpieces.push(choice[0])
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
                outfitpieces.push(choice[0])
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
                heavyend = choice.value;
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
                outfitpieces.push(choice.value)
            }
            else {
                arr = [...process.wearabletypes]
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
                outfitpieces.push(choice.value)
            }
        }
        if (heavyend) { outfitpieces.push(heavyend) }

        heavy.dressprotocol = {
            dressprotocolname: heavy.displayname,
            name: "Chaotic Outfit",
            keyholder: heavy.origbinder,
            stage: 0,
            prevstage: 0,
            items: outfitpieces,
            excludeWearable: [],
            ignoreclothing: false,
            cooldown: 20000,
            nextupdate: Date.now() + 5000,
            heavyid: 'costumer_mimic'
        }
        console.log(`Chose the ${heavy.dressprotocol.name} Outfit!`);
        console.log(heavy.dressprotocol.items);
    }
    else {
        if (heavy.dressprotocol.stage >= 4) {
            removeHeavy(serverID, userID, 'costumer_mimic_chaos')
            return;
        }
        // My brain is failing me right now but we need to figure out a way to catch the "already naked" case
        // This is a simple race condition my brain refuses to figure out. 
        handleDressProtocol(serverID, userID, heavy.dressprotocol);
        if ((heavy.dressprotocol.nextupdate < Date.now()) && getRecentChannel(serverID, userID).valid) {
            heavy.dressprotocol.nextupdate = (Date.now() + heavy.dressprotocol.cooldown);
        }
        markForSave("heavy");
    }
}

let tick = async (serverID, userID, datain) => {
    let thisheavyrestraint = getHeavy(serverID, userID, 'costumer_mimic_chaos');
    if (thisheavyrestraint && dressprotocoltick) { 
        await dressprotocoltick(serverID, userID, thisheavyrestraint);
    }
}

exports.tick = tick;