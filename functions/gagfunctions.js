const fs = require('fs');
const path = require('path');
const https = require('https');
const { messageSend, messageSendImg, messageSendDev } = require(`./../functions/messagefunctions.js`)
const { getVibe, vibeText } = require(`./../functions/vibefunctions.js`)

// Grab all the command files from the commands directory
const gagtypes = [];
const commandsPath = path.join(__dirname, '..', 'gags');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Push the gag name over to the choice array. 
for (const file of commandFiles) {
    const gag = require(`./../gags/${file}`);
	gagtypes.push(
        { name: gag.choicename, value: file.replace('.js', '') }
    );
}

const convertGagText = (type) => {
    let convertgagarr
    for (let i = 0; i < gagtypes.length; i++) {
        if (convertgagarr == undefined) { convertgagarr = {} }
        convertgagarr[gagtypes[i].value] = gagtypes[i].name
    }
    return convertgagarr[type];
}

const assignGag = (userID, gagtype = "ball", intensity = 5) => {
    if (process.gags == undefined) { process.gags = {} }
    process.gags[userID] = {
        gagtype: gagtype,
        intensity: intensity
    }
    fs.writeFileSync(`./gaggedusers.txt`, JSON.stringify(process.gags));
}

const getGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]?.gagtype
}

const getGagIntensity = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]?.intensity
}

const deleteGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    delete process.gags[userID]
    fs.writeFileSync(`./gaggedusers.txt`, JSON.stringify(process.gags));
}

const assignMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    process.mitten[userID] = true
    fs.writeFileSync(`./mittenedusers.txt`, JSON.stringify(process.mitten));
}

const getMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    return process.mitten[userID]
}

const deleteMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    delete process.mitten[userID]
    fs.writeFileSync(`./mittenedusers.txt`, JSON.stringify(process.mitten));
}

const splitMessage = (text) => {

    const regex = /\*{1}(\*{2})?([^\*]|\*{2})+\*|[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|https?\:\/\//g

    let output = [];
    let deepCopy = text.split()[0]
    let found = deepCopy.match(regex)

    for(const x in found){

        index = deepCopy.indexOf(found[x])           // Get the index of the regex token

        if(index > 0){
            output.push({
                text: deepCopy.substring(0,index),//garbleTextSegment(deepCopy.substring(0,index)),
                garble:  true
            })
        }

        output.push({
            text: found[x],
            garble:  false
        })
        // Work on the rest of the string
        deepCopy = deepCopy.substring(index+found[x].length)
    }
    // Garble everything after the final token, if we have anything.
    if(deepCopy.length > 0){    // Don't append nothing.
        output.push({
            text: deepCopy,//garbleTextSegment(deepCopy),
            garble:  true
        })
    }

    // Garble only valid text segments.
    return output;
}

const garbleMessage = async (msg) => {
    try {
        let outtext = '';
        let messageparts = splitMessage(msg.content);
        let modifiedmessage = false;

        // Vibrators first
        if (process.vibe == undefined) { process.vibe = {} }
        if (process.vibe[msg.author.id]) {
            const vibetypes = [];
            const commandsPath = path.join(__dirname, '..', 'vibes');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            console.log(commandFiles)
            
            if (commandFiles.includes(process.vibe[msg.author.id].vibetype + ".js")) {
                modifiedmessage = true;
                let vibegarble = require(path.join(commandsPath, `${process.vibe[msg.author.id].vibetype}.js`))
                let vibeintensity = process.vibe[msg.author.id].intensity || 5
                for (let i = 0; i < messageparts.length; i++) {
                    try {
                        if (messageparts[i].garble) {
                            console.log(messageparts[i].text);
                            messageparts[i].text = vibegarble.garbleText(messageparts[i].text, msg.author.id, vibeintensity)
                            console.log(messageparts[i].text);
                        }
                    }
                    catch (err) { console.log(err) }
                }
            }
        }

        console.log(messageparts)
        // Gags now
        if (process.gags == undefined) { process.gags = {} }
        if (process.gags[`<@${msg.author.id}>`]) {
            // Grab all the command files from the commands directory
            const gagtypes = [];
            const commandsPath = path.join(__dirname, '..', 'gags');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            if (commandFiles.includes(process.gags[`<@${msg.author.id}>`].gagtype + ".js")) {
                modifiedmessage = true;
                let gaggarble = require(path.join(commandsPath, `${process.gags[`<@${msg.author.id}>`].gagtype}.js`))
                let intensity = process.gags[`<@${msg.author.id}>`].intensity ? process.gags[`<@${msg.author.id}>`].intensity : 5
                console.log(messageparts);
                if (gaggarble.messagebegin) {
                    try {
                        outtext = `${gaggarble.messagebegin(msg.content, intensity)}`
                    }
                    catch (err) { console.log(err) }
                }
                for (let i = 0; i < messageparts.length; i++) {
                    try {
                        if (messageparts[i].garble) {
                            outtext = `${outtext}${gaggarble.garbleText(messageparts[i].text, intensity)}`
                        }
                        else {
                            outtext = `${outtext}${messageparts[i].text}`
                        }
                    }
                    catch (err) { console.log(err) }
                }
                if (gaggarble.messageend) {
                    try {
                        outtext = `${outtext}${gaggarble.messageend(msg.content, intensity)}`
                    }
                    catch (err) { console.log(err) }
                }
                
            }
        }
        else {
            let messagetexts = messageparts.map(m => m.text);
            outtext = messagetexts.join(" ");
        }

        if (modifiedmessage) { //Fake reply with a ping
            if (msg.type == "19") {
                const replied = await msg.fetchReference();
                outtext = `${replied.author.toString()}\n${outtext}`
            }
            if (outtext.length > 1999) {
                outtext = outtext.slice(0, 1999); // Seriously, STOP POSTING LONG MESSAGES
            }
            if (msg.attachments?.first()) {
                console.log(msg.attachments?.first())
                let spoilertext = msg.attachments.first().url.search("SPOILER") ? "SPOILER_" : ""
                let spoiler = msg.attachments.first().url.search("SPOILER") ? true : false
                let nodedownload = new Promise((res,rej) => {
                    let spoilertext = msg.attachments.first().url.search("SPOILER") ? "SPOILER_" : ""
                    const file = fs.createWriteStream(`./${spoilertext}downloadedimage_${msg.id}.png`);
                    https.get(msg.attachments.first().url, (response) => {
                        response.pipe(file);
                        file.on('finish', () => {
                        file.close();
                        console.log(`Downloaded to ${`./${spoilertext}downloadedimage_${msg.id}.png`}`);
                        res(true);
                        });
                    }).on('error', (err) => {
                        fs.unlink(dest); // Delete the file if an error occurs
                        console.error(err.message);
                        rej(false);
                    });
                }).then(() => {
                    messageSendImg(outtext, msg.member.displayAvatarURL(), msg.member.displayName, msg.id, spoiler).then(() => {
                        msg.delete().then(() => {
                            fs.rmSync(`./${spoilertext}downloadedimage_${msg.id}.png`)
                        });
                    })
                })
            }
            else {
                if (outtext.length == 0) { outtext = "Something went wrong. Ping <@125093095405518850> and let her know!"}
                let sentmessage = messageSend(outtext, msg.member.displayAvatarURL(), msg.member.displayName).then(() => {
                    msg.delete();
                })
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.assignGag = assignGag;
exports.getGag = getGag;
exports.getGagIntensity = getGagIntensity;
exports.deleteGag = deleteGag;
exports.assignMitten = assignMitten;
exports.getMitten = getMitten;
exports.deleteMitten = deleteMitten;
exports.garbleMessage = garbleMessage;
exports.convertGagText = convertGagText;