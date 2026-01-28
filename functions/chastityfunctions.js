const fs = require("fs");
const path = require("path");
const { getOption } = require("./configfunctions");

// We want to move all the chastity stuff eventually anyway lol
// Moving all of the instances of assignChastity and whatnot will require a bit of work
// For now, Im only adding NEW functions here and placing them where relevant in vibefunctions.js

// Imports each chastity in ./chastities and makes them accessible as objects
// in process.chastitieslist mapped to their respective ids.
// chastities are constructed as default -> class -> specific chastity, overwriting in that order.
function setUpChastity() {
    let chastitiesfunctionsroot = path.join(__dirname, "..", "chastity");
    let newchastityref = require(`${chastitiesfunctionsroot}/defaultchastity.js`);
    let chastitytypes = fs.readdirSync(chastitiesfunctionsroot)
    chastitytypes.forEach((foldertype) => {
        if (foldertype != "defaultchastity.js") {
            let chastitiesinfolderpath = path.join(chastitiesfunctionsroot, foldertype);
            let chastitiesinfolder = fs.readdirSync(chastitiesinfolderpath);
            // Find and setup the chastity type defaults
            let chastitydefaults = require(`${chastitiesinfolderpath}/default.js`);
            let chastitydefaultoverrides = Object.keys(chastitydefaults)
            chastitiesinfolder.forEach((t) => {
                if (t != "default.js") {
                    let newchastity = new newchastityref.Chastity(); // Instantiate a copy of the chastity object.
                    // Overwrite with the chastity type defaults, if specified.
                    chastitydefaultoverrides.forEach((override) => {
                        newchastity[override] = chastitydefaults[override]
                    })
                    // Overwrite with specific chastity's values, if specified. 
                    let specificchastity = require(`${chastitiesinfolderpath}/${t}`);
                    let specificchastityoverrides = Object.keys(specificchastity);
                    specificchastityoverrides.forEach((specificover) => {
                        newchastity[specificover] = specificchastity[specificover]
                    })
                    if (process.chastitytypes == undefined) { process.chastitytypes = {} };
                    // Push to chastitytypes for reference by chastity functions
                    process.chastitytypes[t.replace(".js", "")] = newchastity;
                    // Push to autocompletes system for reference in /chastity and /unchastity
                    if (process.autocompletes == undefined) { process.autocompletes = {} }
                    if (process.autocompletes[`chastity${foldertype}`] == undefined) { process.autocompletes[`chastity${foldertype}`] = [] }
                    process.autocompletes[`chastity${foldertype}`].push({ name: newchastity.name, value: t.replace(".js", "") })
                }
            })
        }
    })
}

function getBaseChastity(chastitytype) {
    return process.chastitytypes[chastitytype];
}

exports.setUpChastity = setUpChastity;
exports.getBaseChastity = getBaseChastity;