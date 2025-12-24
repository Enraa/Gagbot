const { getText } = require("./functions/textfunctions.js");

let object = {
    textarray: "texts_chastity",
    textdata: { 
        interactionuser: { id: "125093095405518850" },
        targetuser: { id: "185614860942442496" },
        c1: "Latex Armbinder"
    },
    heavy: true,
    chastity: true
}

console.log(getText(object))