const fs = require("fs");
const path = require("path");

const toytypes = [
    // Vibes
    { name: "Bullet Vibe", value: "vibe_bullet", category: "Vibrator" },
    { name: "Rising Vibe", value: "vibe_rising", category: "Vibrator" },
    { name: "Pulse Vibe", value: "vibe_pulse", category: "Vibrator" },

    // Rear Plugs
    { name: "Plug", value: "plug_rear", category: "Plug" },

    // Nipple Vibes
    { name: "Nipple Massager", value: "nipplevibe_massager", category: "Nipple" },

    // Misc
    { name: "Shock Module", value: "shock_collar_module", category: "Misc", 
        canAdd: (userID) => { return (process.collar && process.collar[userID]) }, 
        canRemove: (userID, placerID) => { return canAccessCollar(userID, placerID, true)},
        forceRemove: (userID) => { return !(process.collar && process.collar[userID]) }
    }
]

// Imports each toy in ./toys and makes them accessible as objects
// in process.toyslist mapped to their respective ids.
function setUpToys() {
    let toys = {}
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
                    let specifictoy = require(`${toysinfolderpath}/${t}`);
                    let specifictoyoverrides = Object.keys(specifictoy);
                    specifictoyoverrides.forEach((specificover) => {
                        newtoy[specificover] = specifictoy[specificover]
                    })
                    if (process.toytypes == undefined) { process.toytypes = {} };
                    process.toytypes[t.replace(".js", "")] = newtoy;
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

exports.setUpToys = setUpToys;