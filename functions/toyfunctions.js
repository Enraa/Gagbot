const fs = require("fs");
const path = require("path");

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

exports.setUpToys = setUpToys;