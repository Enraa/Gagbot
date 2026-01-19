const fs = require('fs');
const path = require('path');

const fillerwords = [
    "processor", "circuit", "sensor", "actuator", "module",
    "system", "network", "interface", "terminal", "console",
    "database", "memory", "storage", "cache", "buffer",
    "algorithm", "protocol", "directive", "command", "routine",
    "subroutine", "function", "parameter", "variable", "constant",
    "signal", "input", "output", "feedback", "response",
    "antenna", "receiver", "transmitter", "frequency", "bandwidth",
    "latency", "throughput", "channel", "packet", "frame",
    "power", "battery", "capacitor", "resistor", "transistor",
    "voltage", "current", "energy", "charge", "capacity",
    "threshold", "limit", "constraint", "override", "priority",
    "target", "objective", "task", "process", "thread",
    "queue", "scheduler", "clock", "timer", "timestamp",
    "firmware", "software", "hardware", "kernel", "driver",
    "bus", "port", "socket", "connection", "link",
    "encryption", "cipher", "key", "certificate", "credential",
    "authentication", "authorization", "compliance", "policy", "rule",
    "diagnostic", "log", "record", "report", "status",
    "alert", "warning", "error", "exception", "fault",
    "calibration", "configuration", "profile", "template", "schema"
]

const determineLang = () => {
    let timepermin = Math.min(performance.now() / 60000, 1) % 3
    timepermin = 0 // For testing
    let lang;
    if (timepermin == 0) { lang = "javascript" }
    else if (timepermin == 1) { lang = "powershell" }
    else if (timepermin == 2) { lang = "python" }
    
    return lang;
}

const codingConstruct = () => {
    let lang = determineLang();
    // Grab all the command files from the commands directory
    let txtsPath = path.join(__dirname, `./../gagfiles/codegag/${lang}`);
    let txts = fs.readdirSync(txtsPath).filter(file => file.endsWith('.txt'));

    let choice = Math.floor(Math.random() * txts.length)

    let readtext = fs.readFileSync(path.join(__dirname, `./../gagfiles/codegag/${lang}`, txts[choice]), 'utf8');

    return readtext;
}

const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    let codingconstruct = codingConstruct();
    let wrestended = false;
    let wnum = 0;
    for (let i = 0; i < 100; i++) {
        if (codingconstruct.search(`w${i}`) > -1) {
            wnum++;
        }
        else {
            wrestended = true;
        }
    }
    console.log(newtextparts)
    while ((newtextparts.length <= wnum)) {
        newtextparts.push(fillerwords[Math.floor(Math.random() * fillerwords.length)])
    }
    for (let i = 0; i < newtextparts.length - 1; i++) { // Should be the full length
        codingconstruct = codingconstruct.replaceAll(`w${i}`, newtextparts[i]);
    }
    newtextparts.splice(0, wnum) // Slice off the first few elements
    codingconstruct = codingconstruct.replaceAll(`wrest`, newtextparts.join(" "));
    return ("```" + determineLang() + "\n" + codingconstruct + "```")
}

exports.garbleText = garbleText;
exports.choicename = "Code Gag"