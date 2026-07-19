const path = require("node:path");
const fs = require("fs");

/***********
 * Constructs the base definitions for all of the items in the bot from their folders.
 * 
 * ---
 * ##### *No return value*
 ***********/
function initializeBaseObjects() {
    if (process.autocompletes == undefined) { process.autocompletes = {} }

    // region Gags
	let gagautocompletes = [];
    let gagtypes = [];
	let commandsPath = path.join(__dirname, "..", "..", "gags");
	let commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

	// Push the gag name over to the choice array.
	for (const file of commandFiles) {
		const gag = require(`./../gags/${file}`);
        gagtypes[file.replace(".js", "")] = gag;
        gagtypes[file.replace(".js", "")].value = gagtypes[file.replace(".js", "")];
        gagtypes[file.replace(".js", "")].removeItem = function (data) { removeGag(data.serverID, data.userID, this.value, data.forceremove) }
        if (!gag.hidden) { gagautocompletes.push({ name: gag.choicename, value: file.replace(".js", "") }) };
	}

	process.gagtypes = gagtypes;
    process.autocompletes.gag = gagautocompletes;

    // region Mittens
    let mittenautocompletes = [];
    let mittentypes = {};
    commandsPath = path.join(__dirname, "..", "..", "mitten");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    // Push the gag name over to the choice array.
    for (const file of commandFiles) {
        const mitten = require(`${commandsPath}/${file}`);
        mittentypes[file.replace(".js", "")] = mitten;
        mittentypes[file.replace(".js", "")].value = file.replace(".js", "") // Compatibility with old .value code
        mittentypes[file.replace(".js", "")].removeItem = function (data) { removeMitten(data.serverID, data.userID) }
        if (!mitten.hidden) { mittenautocompletes.push({ name: mitten.name, value: file.replace(".js", "") }) };
    }

    process.mittentypes = mittentypes;
    process.autocompletes.mitten = mittenautocompletes;

    // region Corsets
    let corsetautocompletes = [];
    let corsettypes = {};
    commandsPath = path.join(__dirname, "..", "..", "corset");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => !file.startsWith("defaultcorset"));
    commandFiles = commandFiles.filter((file) => file.endsWith(".js"));
    let newcorsetref = require(`${commandsPath}/defaultcorset.js`);

    commandFiles.forEach((foldertype) => {
        let newcorset = new newcorsetref.Corset(); // Instantiate a copy of the corset object.
        let specificcorset = require(`${commandsPath}/${foldertype}`);
        let specificcorsetoverrides = Object.keys(specificcorset);
        specificcorsetoverrides.forEach((specificover) => {
            newcorset[specificover] = specificcorset[specificover];
        });
        if (process.corsettypes == undefined) {
            process.corsettypes = {};
        }
        // Push to corsettypes for reference by corset functions
        corsettypes[foldertype.replace(".js", "")] = newcorset;
        corsettypes[foldertype.replace(".js", "")].value = foldertype.replace(".js", "");
        corsettypes[foldertype.replace(".js", "")].removeItem = function (data) { removeCorset(data.serverID, data.userID) }
    
        corsetautocompletes.push({ name: newcorset.name, value: foldertype.replace(".js", "") });
    })

    process.corsettypes = corsettypes;
    process.autocompletes.corset = corsetautocompletes;

    // region Heavy
    let heavyautocompletes = [];
    let heavytypes = {};
    commandsPath = path.join(__dirname, "..", "..", "heavy");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    // Push the gag name over to the choice array.
    for (const file of commandFiles) {
        const heavy = require(`${commandsPath}/${file}`);
        heavytypes[file.replace(".js", "")] = heavy;
        heavytypes[file.replace(".js", "")].value = file.replace(".js", "") // Compatibility with old .value code
        // Adjust item description with how this will bind the user. 
        heavytypes[file.replace(".js", "")].itemdescription = `### ${heavy.name}\n${heavy.heavytags.includes("arms") ? "- Binds Arms 💪\n" : ""}${heavy.heavytags.includes("legs") ? "- Binds Legs 🦵\n" : ""}${heavy.heavytags.includes("legs") ? "- Container 📦\n" : ""}-# Tags: ${heavy.tags ? `${heavy.tags.join(", ")}\n` : ""}\n${heavy.itemdescription ? heavy.itemdescription : ""}`
        heavytypes[file.replace(".js", "")].removeItem = function (data) { removeHeavy(data.serverID, data.userID, this.value) }

        if (!heavy.hidden) { heavyautocompletes.push({ name: heavy.name, value: file.replace(".js", "") }) };
    }

    process.autocompletes.heavy = heavyautocompletes;
	process.heavytypes = heavytypes;

    // region Masks
    let headwearautocompletes = [];
    let headweartypes = []; // NOTE This is currently an array - figure out why its not a {}
    commandsPath = path.join(__dirname, "..", "..", "headwear");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
    // Push the gag name over to the choice array.
    for (const file of commandFiles) {
        const head = require(`${commandsPath}/${file}`);
        if (head.setupfunction) { 
            let setupreturn = head.setupfunction();
            if (!Array.isArray(setupreturn) && setupreturn) { setupreturn = [setupreturn] }
            setupreturn.forEach((h) => {
                headweartypes[h.type] = h
                if (h.type && h.name && !h.hidden) { headwearautocompletes.push({ name: h.name, value: h.type }) }; 
            })
        }
        headweartypes[file.replace(".js", "")] = head;
        headweartypes[file.replace(".js", "")].itemdescription = `### ${head.name}\n${head.blockinspect ? `- Blinding 🕶️\n` : ""}${head.blockinspect ? `- Blocks Emotes 🎭\n`: ""}${head.blockgag ? `- Prevents Changing Gags 👄\n` : ""}-# Tags: ${head.tags ? `${head.tags.join(", ")}\n` : ""}\n${head.itemdescription ? head.itemdescription : ""}`
        headweartypes[file.replace(".js", "")].value = headweartypes[file.replace(".js", "")] // Compatibility with old .value code
        headweartypes[file.replace(".js", "")].removeItem = function (data) { removeHeadwear(data.serverID, data.userID, this.value) }

        if (!head.hidden && !head.setupfunction) { headwearautocompletes.push({ name: head.name, value: file.replace(".js", "") }) };
    }

    process.autocompletes.headtypes = headwearautocompletes;
    process.headtypes = headweartypes;

    // region Collar
    let collarautocompletes = [];
    let collartypes = {};
    commandsPath = path.join(__dirname, "..", "collar");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    // Push the gag name over to the choice array.
    for (const file of commandFiles) {
        const collar = require(`${commandsPath}/${file}`);
        collartypes[file.replace(".js", "")] = collar;
        collartypes[file.replace(".js", "")].value = file.replace(".js", "") // Compatibility with old .value code
        // Add a remover function that can be called on the item itself!
        collartypes[file.replace(".js", "")].removeItem = function (data) { removeCollar(data.serverID, data.userID) }
        if (!collar.hidden) { collarautocompletes.push({ name: collar.name, value: file.replace(".js", "") }) };
    }
    if (process.autocompletes == undefined) { process.autocompletes = {} }

    process.autocompletes.collar = collarautocompletes;
    process.collartypes = collartypes;

    // region Toy - NEED REFACTOR
    let toysfunctionsroot = path.join(__dirname, "..", "..", "toys");
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
                    process.toytypes[t.replace(".js", "")].value = process.toytypes[t.replace(".js", "")];
                    process.toytypes[t.replace(".js", "")].removeItem = function (data) { removeToy(data.serverID, data.userID, data.keyholderID, this.value) }
                    // Push to autocompletes system for reference in /toy and /untoy
                    if (process.autocompletes == undefined) { process.autocompletes = {} }
                    if (process.autocompletes.toys == undefined) { process.autocompletes.toys = [] }
                    process.autocompletes.toys.push({ name: newtoy.toyname, value: t.replace(".js", "") })
                }
            })
        }
    })

    // region Chastity - NEED REFACTOR
    let chastitiesfunctionsroot = path.join(__dirname, "..", "..", "chastity");
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
                    process.chastitytypes[t.replace(".js", "")].itemdescription = `### ${newchastity.name}\n- Denial Multiplier: ${(Number(newchastity.denialCoefficient.toString().match(/^\(data\)\s*=>\s*\{\s*return\s+(\d+(?:\.\d+)?)\s*\}/)?.[1]) || "*Special*")}\n-# Tags: ${newchastity.tags ? `${newchastity.tags.join(", ")}\n` : ""}\n${newchastity.itemdescription ? newchastity.itemdescription : ""}`
                    process.chastitytypes[t.replace(".js", "")].value = t.replace(".js", "");
                    
                    // Push to autocompletes system for reference in /chastity and /unchastity
                    if (process.autocompletes == undefined) { process.autocompletes = {} }
                    if (process.autocompletes[`chastity${foldertype}`] == undefined) { process.autocompletes[`chastity${foldertype}`] = [] }
                    process.autocompletes[`chastity${foldertype}`].push({ name: newchastity.name, value: t.replace(".js", "") })
                }
            })
        }
    })

    // region Locks
    let lockautocompletes = [];
    let locktypes = {};
    commandsPath = path.join(__dirname, "..", "..", "locks");
    commandFiles = fs.readdirSync(commandsPath).filter((file) => !file.startsWith("defaultlock"));
    commandFiles = commandFiles.filter((file) => file.endsWith(".js"));
    let newlockref = require(`${commandsPath}/defaultlock.js`);

    commandFiles.forEach((foldertype) => {
        let newlock = new newlockref.Lock(); // Instantiate a copy of the corset object.
        let specificlock = require(`${commandsPath}/${foldertype}`);
        let specificlockoverrides = Object.keys(specificlock);
        specificlockoverrides.forEach((specificover) => {
            newlock[specificover] = specificlock[specificover];
        });
        if (process.locktypes == undefined) {
            process.locktypes = {};
        }
        // Push to locktypes
        locktypes[foldertype.replace(".js", "")] = newlock;
        locktypes[foldertype.replace(".js", "")].value = foldertype.replace(".js", "");
        // locktypes[foldertype.replace(".js", "")].removeItem = function (data) { removeCorset(data.serverID, data.userID) }
    
        corsetautocompletes.push({ name: newlock.name, value: foldertype.replace(".js", "") });
    })
}

exports.initializeBaseObjects = initializeBaseObjects;