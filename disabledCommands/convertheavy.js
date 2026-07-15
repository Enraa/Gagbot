const fs = require("fs");
const { mittentypes } = require("./functions/gagfunctions");

let importedheavytypes = mittentypes

importedheavytypes.forEach((h) => {
    let outstring = ``;
    if (h.name) {
        outstring = `${outstring}exports.name = "${h.name}"\n\n`
    }
    if (h.tags) {
        outstring = `${outstring}exports.tags = [${h.tags.map((t) => `"${t}"`).join(", ")}]\n\n`
    }
    if (h.special) {
        outstring = `${outstring}exports.special = true\n`
    }
    if (h.specialonly) {
        outstring = `${outstring}exports.specialonly = true\n`
    }

    fs.writeFileSync(`./mitten/${h.value}.js`, outstring);
})