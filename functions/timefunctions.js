// We were originally going to install Moment, but frankly, since I just need to try to do a basic time parse, we're going to write our own. 
let fs = require('fs')
let path = require('path')
let admZip = require('adm-zip');
const { unlockTimelockChastity, unlockTimelockChastityBra, unlockTimelockCollar } = require(`./timelockfunctions.js`);

// Takes input string, outputs a date object. 
const parseTime = (text) => {
    try {
        let t = text.toLowerCase();

        let num = (regex) => {
            const m = t.match(regex);
            return m ? parseInt(m[1], 10) : 0;
        };

        let days    = num(/(\d+)\s*d(?:ay|ays)?/);
        let hours   = num(/(\d+)\s*h(?:our|rs?)?/);
        let minutes = num(/(\d+)\s*m(?:in|ins?)?/);

        // Create date output
        let dateout = new Date();
        // add days
        dateout.setTime(dateout.getTime() + days * 24 * 60 * 60 * 1000);
        // add hours
        dateout.setTime(dateout.getTime() + hours * 60 * 60 * 1000);
        // add minutes
        dateout.setTime(dateout.getTime() + minutes * 60 * 1000);

        return dateout
    }
    catch (err) {
        return new Date;
    }
}

// Takes string input, returns an integer with number of ms for the setTimeout function
const calculateTimeout = (text) => {
    try {
        return (parseTime(text) - (new Date));
    }
    catch (err) {
        return 0;
    }
}

// I refuse to use proper databases. This is to generate backups. 
// This is vibecoded, admittedly, and then adjusted, but the result looks solid. 
const getTimestringForZip = () => {
    const d = new Date();

    // Date Components
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    // Time Components
    const hh = String(d.getHours()).padStart(2, '0'); // 24-hour format
    const min = String(d.getMinutes()).padStart(2, '0');

    // Combine
    const formatted = `${mm}-${dd}-${yyyy}-${hh}-${min}`;
    //console.log(formatted); // Example: "01/01/2026-21:05"

    return formatted;
}

const backupsAreAnnoying = () => {
    try {
        let filepath = process.GagbotSavedFileDirectory;
        let dest = path.resolve(filepath, "backups");
        let files = fs.readdirSync(filepath).filter(file => file.endsWith('.txt'));

        let zip = new admZip();

        let timestring = getTimestringForZip();

        files.forEach(f => {
            zip.addLocalFile(path.resolve(filepath, f));
        })

        zip.writeZip(path.resolve(dest, `backup-${timestring}.zip`));

        console.log(`Completed zip .\\backup\\backup-${timestring}.zip`)
    }
    catch (err) {
        console.log(err)
    }
}

// Take each prop of the process.readytosave and save that file. 
// Then reset it. 
const saveFiles = () => {
    try {
        if (process.readytosave == undefined) { process.readytosave = {} }
        console.log(process.readytosave)
        Object.keys(process.readytosave).forEach((k) => {
            let filepath;
            let processvar;
            // Honestly, this could probably just be a similar thing like the processdatatoload at the beginning of index.js
            // but meh. This allows for potential configuration later. 
            switch (k) {
                case "wearable":
                    filepath = `${process.GagbotSavedFileDirectory}/wearables.txt`
                    processvar = "wearable"
                    break;
                case "gags":
                    filepath = `${process.GagbotSavedFileDirectory}/gaggedusers.txt`
                    processvar = "gags"
                    break;
                case "mitten":
                    filepath = `${process.GagbotSavedFileDirectory}/mittenedusers.txt`
                    processvar = "mitten"
                    break;
                case "chastity":
                    filepath = `${process.GagbotSavedFileDirectory}/chastityusers.txt`
                    processvar = "chastity"
                    break;
                case "chastitybra":
                    filepath = `${process.GagbotSavedFileDirectory}/chastitybrausers.txt`
                    processvar = "chastitybra"
                    break;
                case "arousal":
                    filepath = `${process.GagbotSavedFileDirectory}/arousal.txt`
                    processvar = "arousal"
                    break;
                case "vibe":
                    filepath = `${process.GagbotSavedFileDirectory}/vibeusers.txt`
                    processvar = "vibe"
                    break;
                case "collar":
                    filepath = `${process.GagbotSavedFileDirectory}/collarusers.txt`
                    processvar = "collar"
                    break;
                case "heavy":
                    filepath = `${process.GagbotSavedFileDirectory}/heavyusers.txt`
                    processvar = "heavy"
                    break;
                case "pronouns":
                    filepath = `${process.GagbotSavedFileDirectory}/pronounsusers.txt`
                    processvar = "pronouns"
                    break;
                case "usercontext":
                    filepath = `${process.GagbotSavedFileDirectory}/usersdata.txt`
                    processvar = "usercontext"
                    break;
                case "consented":
                    filepath = `${process.GagbotSavedFileDirectory}/consentusers.txt`
                    processvar = "consented"
                    break;
                case "corset":
                    filepath = `${process.GagbotSavedFileDirectory}/corsetusers.txt`
                    processvar = "corset"
                    break;
                case "headwear":
                    filepath = `${process.GagbotSavedFileDirectory}/headwearusers.txt`
                    processvar = "headwear"
                    break;
                case "discardedKeys":
                    filepath = `${process.GagbotSavedFileDirectory}/discardedkeys.txt`
                    processvar = "discardedKeys"
                    break;
                case "configs":
                    filepath = `${process.GagbotSavedFileDirectory}/configs.txt`
                    processvar = "configs"
                    break;
                case "dolls":
                    filepath = `${process.GagbotSavedFileDirectory}/dollusers.txt`
                    processvar = "dolls"
                    break;
                case "webhooks":
                    filepath = `${process.GagbotSavedFileDirectory}/webhooks.txt`
                    processvar = "webhookstoload"
                    break;
                default:
                    console.log(`Unknown save variable: ${k}`)
            }
            if (filepath && processvar) {
                fs.writeFileSync(filepath, JSON.stringify(process[processvar]))
                console.log(`----> Successfully Saved file ${filepath}`)
            }
        })
        process.readytosave = {};
    }
    catch (err) {
        console.log(err);
    }
}

function processUnlockTimes(client) {
    let now = Date.now();
    if (process.chastity) {
        Object.keys(process.chastity).forEach((person) => {
            if (process.chastity[person]?.unlockTime < now) {
                unlockTimelockChastity(client, person);
            }
        })
    }
    if (process.chastitybra) {
        Object.keys(process.chastitybra).forEach((person) => {
            if (process.chastitybra[person]?.unlockTime < now) {
                unlockTimelockChastityBra(client, person);
            }
        })
    }
    if (process.collar) {
        Object.keys(process.collar).forEach((person) => {
            if (process.collar[person]?.unlockTime < now) {
                unlockTimelockCollar(client, person);
            }
        })
    }
}

exports.parseTime = parseTime;
exports.calculateTimeout = calculateTimeout;
exports.getTimestringForZip = getTimestringForZip;
exports.backupsAreAnnoying = backupsAreAnnoying;
exports.saveFiles = saveFiles;

exports.processUnlockTimes = processUnlockTimes;