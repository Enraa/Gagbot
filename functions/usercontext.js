const fs = require('fs');

function setUserVar(user, key, value) {
    console.log("aaaaa");
    if (process.usercontext == undefined) { process.usercontext = {} }
    if (process.usercontext[user] == undefined) { process.usercontext[user] = {} }
    process.usercontext[user][key] = value;
    console.log(process.usercontext);
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.usercontext = true;
}

function getUserVar(user, key) {
    if (process.usercontext == undefined) { process.usercontext = {} }
    if (process.usercontext[user] == undefined) { process.usercontext[user] = {} }
    return process.usercontext[user][key];
}

exports.setUserVar = setUserVar;
exports.getUserVar = getUserVar;