const fs = require('fs');
const path = require('path');
const https = require('https');
const { optins } = require('./optinfunctions');

const collartypes = [
    { name: "Latex Collar", value: "collar_latex" },
    { name: "Leather Collar", value: "collar_leather" },
    { name: "Cyber Doll Collar", value: "collar_cyberdoll" },
    { name: "Hardlight Collar", value: "collar_hardlight" },
    { name: "Runic Collar", value: "collar_runic" },
    { name: "Tall Posture Collar", value: "collar_posture" },
    { name: "Ruffled Maid Collar", value: "collar_maid" },
    { name: "Nevermere Tracking Collar", value: "collar_nevermere" },
    { name: "Steel Collar", value: "collar_steel" },
    { name: "Kitty Collar", value: "collar_kitty" },
    { name: "Sheep Collar", value: "collar_sheep" },
    { name: "Potion Collar", value: "collar_potion" },
    { name: "Princess Collar", value: "collar_princess" },
    { name: "Star-cursed Collar", value: "collar_star" },
    { name: "Moonveil Collar", value: "collar_moon" },
]

const assignCollar = (user, keyholder, restraints, only, customcollar) => {
    if (process.collar == undefined) { process.collar = {} }
    process.collar[user] = {
        keyholder: keyholder,
        keyholder_only: only,
        mitten: restraints.mitten,
        chastity: restraints.chastity,
        heavy: restraints.heavy,
        collartype: customcollar
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user];
}

// Collar orig binder is not necessary - it's keyed

const getCollarPerm = (user, perm) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user][perm];
}

const removeCollar = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    delete process.collar[user];
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
}

const getCollarKeys = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    let keysheld = [];
    Object.keys(process.collar).forEach((k) => {
        if (process.collar[k].keyholder == user) {
            keysheld.push(k)
        }
    })
    return keysheld
}

const getCollarName = (userID, collarname) => {
    if (process.collar == undefined) { process.collar = {} }
    let convertcollararr = {}
    for (let i = 0; i < collartypes.length; i++) {
        convertcollararr[collartypes[i].value] = collartypes[i].name
    }
    if (collarname) {
        return convertcollararr[collarname];
    }
    else if (process.collar[userID]?.collartype) {
        return convertcollararr[process.collar[userID]?.collartype]
    }
    else {
        return undefined;
    }
}

const getCollarKeyholder = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    return process.collar[user]?.keyholder;
}

// Returns an object you can check the .access prop of. 
// Unlock actions should set the third param true to ensure
// that users are not unlocking public access. 
const canAccessCollar = (collaruser, keyholder, unlock, cloning) => {
    // As a reference for access in timelocks:
    // 0: "Everyone Else"
    // 1: "Keyholder Only"
    // 2: "Nobody"

    let accessval = {
        access: false,
        public: false,
        hascollar: true
    }
    // no collar, no need
    if (!getCollar(collaruser)) { 
        accessval.hascollar = false;
        return accessval;
    } 
    // Sealed Collar - nobody gets in!
    if (getCollar(collaruser)?.access == 2) {
        return accessval;
    }
    // If unlock is set, only allow access to unlock if the keyholder is the correct one.
    if (unlock) {
        // Allow unlocks by a non-self keyholder at all times, assuming its not sealed. 
        if ((getCollar(collaruser)?.access != 2) && (getCollar(collaruser)?.keyholder == keyholder) && (keyholder != collaruser)) {
            accessval.access = true;
        }
        // Allow unlocks by any keyholder if no timelock. 
        if ((getCollar(collaruser)?.access == undefined) && (getCollar(collaruser)?.keyholder == keyholder)) {
            accessval.access = true;
        }
        // Else, return false.

        return accessval;
    }
    // Others access only when access is set to 0. 
    if ((getCollar(collaruser)?.access == 0) && (keyholder != collaruser)) {
        accessval.access = true;
        accessval.public = true;
    }
    // Keyholder access if access is unset (no timelocks)
    if ((getCollar(collaruser)?.access == undefined) && (getCollar(collaruser)?.keyholder == keyholder)) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key), but only if cloning is NOT true and no timelocks
    let clonedkeys = getCollar(collaruser)?.clonedKeyholders ?? [];
    if ((clonedkeys.includes(keyholder)) && (cloning != true) && (getCollar(collaruser)?.access == undefined)) {
        accessval.access = true;
    }
    // Keyholder access if timelock is 1 (keyholder only) but only if not self.
    if ((getCollar(collaruser)?.access == 1) && (getCollar(collaruser)?.keyholder == keyholder) && (collaruser != keyholder)) {
        accessval.access = true;
    }
    // Secondary Keyholder access (cloned key) if access is 1, but only if not self.
    if ((clonedkeys.includes(keyholder)) && (cloning != true) && (getCollar(collaruser)?.access == 1) && (collaruser != keyholder)) {
        accessval.access = true;
    }
    // Else, return false. 
    
    return accessval;
}

// Called to prompt the wearer if it is okay to clone a key.
async function promptCloneCollarKey(user, target, clonekeyholder) {
    return new Promise(async (res,rej) => {
        let buttons = [
            new ButtonBuilder().setCustomId("denyButton").setLabel("Deny").setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId("acceptButton").setLabel("Allow").setStyle(ButtonStyle.Success)
        ]
        let bondageaccess = `${(getCollarPerm(target, "mitten")) ? "mitten you, " : ""}${(getCollarPerm(target, "chastity")) ? "put you in chastity, " : ""}${(getCollarPerm(target, "chastity")) ? "put heavy bondage on you, " : ""}`.slice(0,-2);
        let dmchannel = await target.createDM();
        await dmchannel.send({
            content: `${user} would like to give ${clonekeyholder} a copy of your collar key. Do you want to allow this?${(bondageaccess.length > 0) ? `\n\n**Note: ${clonekeyholder} will have access to ${bondageaccess}.**` : "" }`,
            components: [new ActionRowBuilder().addComponents(...buttons)]
        }).then((mess) => {
            // Create a collector for up to 30 seconds
            const collector = mess.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30_000, max: 1 })

            collector.on('collect', async (i) => {
                console.log(i)
                if (i.customId == "acceptButton") {
                    await mess.delete().then(() => {
                        i.reply(`Confirmed - ${clonekeyholder} will receive a copied key for your collar!`)
                    })
                    res(true);
                }
                else {
                    await mess.delete().then(() => {
                        i.reply(`Rejected - ${clonekeyholder} will NOT receive a copied key for your collar!`)
                    })
                    rej(true);
                }
            })

            collector.on('end', async (collected) => {
                // timed out
                if (collected.length == 0) {
                    await mess.delete().then(() => {
                        i.reply(`Timed Out - ${clonekeyholder} will NOT receive a copied key for your collar!`)
                    })
                    rej(true);
                }
            })
        })
    })
}

// Called once we confirm the user is okay with it!
// For cloned keys, we want to allow a cloned key to do everything except
// giving the key or cloning the key. These actions should check the
// fourth param of the canAccessCollar function and set it to true
// when the action needs to REJECT cloned keys. 
const cloneCollarKey = (collarUser, newKeyholder) => {
    let collar = getCollar(collarUser);
    if (!collar.clonedKeyholders) {
        collar.clonedKeyholders = [];
    }
    collar.clonedKeyholders.push(newKeyholder)
}

// transfer keys and returns whether the transfer was successful
const transferCollarKey = (lockedUser, newKeyholder) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.collar[lockedUser]) {
        if (process.collar[lockedUser].keyholder != newKeyholder) { 
            process.collar[lockedUser].keyholder = newKeyholder;
            // Erase cloned keys in this process!
            delete process.collar[lockedUser].clonedKeyholders;
            fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
            return true;
        }
    }

    return false;
}

const discardCollarKey = (user) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    if (process.collar[user]) {
        process.collar[user].keyholder = "discarded";
        process.discardedKeys.push({
          restraint: "collar",
          wearer: user
        })
    }
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
}

const findCollarKey = (index, newKeyholder) => {
    if (process.collar == undefined) { process.collar = {} }
    if (process.discardedKeys == undefined) { process.discardedKeys = [] }
    const collar = process.discardedKeys.splice(index, 1);
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/discardedkeys.txt`, JSON.stringify(process.discardedKeys));
    if (collar.length < 1) return false;
    if (process.collar[collar[0].wearer]) {
      process.collar[collar[0].wearer].keyholder = newKeyholder;
      // Erase cloned keys in this process!
      delete process.collar[lockedUser].clonedKeyholders;
      fs.writeFileSync(`${process.GagbotSavedFileDirectory}/collarusers.txt`, JSON.stringify(process.collar));
      return true;
    }
    return false;
}

exports.assignCollar = assignCollar
exports.getCollar = getCollar
exports.removeCollar = removeCollar
exports.getCollarKeys = getCollarKeys
exports.getCollarKeyholder = getCollarKeyholder;
exports.transferCollarKey = transferCollarKey
exports.getCollarPerm = getCollarPerm
exports.discardCollarKey = discardCollarKey;
exports.findCollarKey = findCollarKey;
exports.getCollarName = getCollarName;
exports.getCollarName = getCollarName;
exports.collartypes = collartypes;
exports.canAccessCollar = canAccessCollar;
exports.promptCloneCollarKey = promptCloneCollarKey;
exports.cloneCollarKey = cloneCollarKey;