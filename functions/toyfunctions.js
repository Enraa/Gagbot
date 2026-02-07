const fs = require("fs");
const path = require("path");
const { getOption } = require("./configfunctions");

// Imports each toy in ./toys and makes them accessible as objects
// in process.toyslist mapped to their respective ids.
// Toys are constructed as default -> class -> specific toy, overwriting in that order.
function setUpToys() {
    let toysfunctionsroot = path.join(__dirname, "..", "toys");
    let newtoyref = require(`${toysfunctionsroot}/defaulttoy.js`);
    let toytypes = fs.readdirSync(toysfunctionsroot)
    toytypes.forEach((foldertype) => {
        if (foldertype != "defaulttoy.js") {
            let toysinfolderpath = path.join(toysfunctionsroot, foldertype);
            let toysinfolder = fs.readdirSync(toysinfolderpath);
            // Find and setup the toy type defaults
            let toydefaults = require(`${toysinfolderpath}/default.js`);
            let toydefaultoverrides = Object.keys(toydefaults)
            toysinfolder.forEach((t) => {
                if (t != "default.js") {
                    let newtoy = new newtoyref.Toy(); // Instantiate a copy of the Toy object.
                    // Overwrite with the toy type defaults, if specified.
                    toydefaultoverrides.forEach((override) => {
                        newtoy[override] = toydefaults[override]
                    })
                    // Overwrite with specific toy's values, if specified. 
                    let specifictoy = require(`${toysinfolderpath}/${t}`);
                    let specifictoyoverrides = Object.keys(specifictoy);
                    specifictoyoverrides.forEach((specificover) => {
                        newtoy[specificover] = specifictoy[specificover]
                    })
                    if (process.toytypes == undefined) { process.toytypes = {} };
                    // Push to toytypes for reference by toy functions
                    process.toytypes[t.replace(".js", "")] = newtoy;
                    // Push to autocompletes system for reference in /toy and /untoy
                    if (process.autocompletes == undefined) { process.autocompletes = {} }
                    if (process.autocompletes.toys == undefined) { process.autocompletes.toys = [] }
                    process.autocompletes.toys.push({ name: newtoy.toyname, value: t.replace(".js", "") })
                }
            })
        }
    })
}

// Returns true/false if the toy can be placed on the user
// Respects blockers such as chastity, if specified on the toy type
function canPlaceToy(userID, placerID, toy) {
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canEquip({ userID: userID, placerID: placerID }))
}

// Returns true/false if the toy can be removed from the user
// Respects blockers such as chastity, if specified on the toy type
function canRemoveToy(userID, placerID, toy) {
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canUnequip({ userID: userID, placerID: placerID }))
}

// Idk what to name this honestly.
function userBlockArousingToy(user, toy) {
    if (toy && (getOption(user, "arousalsystem") == "disabled") && (process.toytypes[toy].vibescale() > 0)) {
        return true; // Do not add a toy that can increase arousal, thats bad. 
    }
    else {
        return false;
    }
}

function assignToy (user, keyholder, intensity, toytype = "vibe_bullet", origbinder) {
    let vibe = process.toytypes[toytype];
    if (!vibe) { return "NoToy" }
    if ((getOption(user, "arousalsystem") == "disabled") && (vibe.vibescale() > 0)) {
        return "NoArousal"; // Do not add a toy that can increase arousal, thats bad. 
    }
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let toy = process.toys[user].find((toy) => toy.type == toytype)
    console.log(process.toys[user])
    // Toy already exists, modify it to the new intensity, if allowed. 
    if (toy) {
        if (vibe.canModify({ userID: user, keyholderID: keyholder ?? user })) {
            toy.intensity = intensity
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.toys = true;
            return "Success"
        }
        else {
            return "NoModify";
        }
    }
    // Toy does not exist, add it! 
    else {
        if (vibe.canEquip({ userID: user, keyholderID: keyholder ?? user })) {
            process.toys[user].push({
                type: toytype,
                intensity: intensity,
                origbinder: origbinder
            })
            vibe.onEquip({ userID: user, intensity: intensity })
            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.toys = true;
            return "Success"
        }
        else {
            return "NoEquip"
        }
    }
}

// This should always return an array of toys no matter who its invoked for!
function getToys (user) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    return process.toys[user];
}

function getSpecificToy(user, toytype) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    return process.toys[user].find((toy) => toy.type == toytype);
}

function getBaseToy(toytype) {
    return process.toytypes[toytype];
}

function removeToy(user, toytype) {
    if (process.toys == undefined) { process.toys = {} }
    if (process.toys[user] == undefined) { process.toys[user] = [] }
    let index = process.toys[user].findIndex((toy) => toy.type == toytype)
    if (index > -1) {
        let vibe = process.toytypes[toytype];
        if (vibe && vibe.onUnequip) {
            vibe.onUnequip({ userID: user });
        }
        process.toys[user].splice(index, 1);
    }
    if (process.readytosave == undefined) {
        process.readytosave = {};
    }
    process.readytosave.toys = true;
}


exports.setUpToys = setUpToys;

exports.canPlaceToy = canPlaceToy;
exports.canRemoveToy = canRemoveToy;
exports.userBlockArousingToy = userBlockArousingToy;
exports.assignToy = assignToy;
exports.getToys = getToys;
exports.getSpecificToy = getSpecificToy;
exports.removeToy = removeToy;
exports.getBaseToy = getBaseToy;