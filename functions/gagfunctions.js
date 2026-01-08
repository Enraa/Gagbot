const fs = require('fs');
const path = require('path');
const https = require('https');
const { messageSend, messageSendImg, messageSendDev } = require(`./../functions/messagefunctions.js`)
const { getCorset, corsetLimitWords, silenceMessage } = require(`./../functions/corsetfunctions.js`)
const { stutterText, getArousedTexts } = require(`./../functions/vibefunctions.js`);
const { getVibeEquivalent } = require('./vibefunctions.js');
const { getHeadwearRestrictions, processHeadwearEmoji, getHeadwearName, getHeadwear, DOLLVISORS } = require('./headwearfunctions.js')

//const DOLLREGEX = /(((?<!\*)\*{1})(\*{2})?([^\*]|\*{2})+\*)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|\n/g
// Abomination of a regex for corset compatibility.
const DOLLREGEX = /(((?<!\*)(?<!(\*hff|\*hnnf|\*ahff|\*hhh|\*nnh|\*hnn|\*hng|\*uah|\*uhf))\*{1})(?!(hff\*|hnnf\*|ahff\*|hhh\*|nnh\*|hnn\*|hng\*|uah\*|uhf\*))(\*{2})?([^\*]|\*{2})+\*)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|\n/g


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

const gagtypesset = () => {
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

    process.gagtypes = gagtypes;
}

// This should probably be better maintained with automation
// Only used for the /list command. 
const gagtypesout = [
    { name: "Ball Gag" },
    { name: "Bast Gag" },
    { name: "Bweh Gag" },
    { name: "Cat Gag" },
    { name: "Code Gag" },
    { name: "Enchanted Dog Gag" },
    { name: "Donald Gag" },
    { name: "Good Sub Gag" },
    { name: "Ring Gag" },
    { name: "Silent Panel Gag" },
    { name: "Stuff Gag" },
    { name: "Tape Gag" },
    { name: "UwU Gag" },
    { name: "Enchanted Wolf Gag" },
]

const mittentypes = [
    { name: "Kitty Paws", value: "mittens_kitty" },
    { name: "Cyber Doll Mittens", value: "mittens_cyberdoll" },
    { name: "Leather Mittens", value: "mittens_leather" },
    { name: "Hardlight Spheres", value: "mittens_hardlight" },
    { name: "Latex Mittens", value: "mittens_latex" },
    { name: "Taped Fists", value: "mittens_tape" },
    { name: "Good Maid Mittens", value: "mittens_maid" },
]

const convertGagText = (type) => {
    let convertgagarr
    for (let i = 0; i < gagtypes.length; i++) {
        if (convertgagarr == undefined) { convertgagarr = {} }
        convertgagarr[gagtypes[i].value] = gagtypes[i].name
    }
    return convertgagarr[type];
}

const assignGag = (userID, gagtype = "ball", intensity = 5, origbinder) => {
    if (process.gags == undefined) { process.gags = {} }
    let originalbinder = process.gags[userID]?.origbinder
    process.gags[userID] = {
        gagtype: gagtype,
        intensity: intensity,
        origbinder: originalbinder ?? origbinder // Preserve original binder until it is removed. 
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.gags = true;
}

const getGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]?.gagtype
}

const getGagBinder = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]?.origbinder
}

const getGagIntensity = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    return process.gags[userID]?.intensity
}

const deleteGag = (userID) => {
    if (process.gags == undefined) { process.gags = {} }
    delete process.gags[userID]
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.gags = true;
}

const assignMitten = (userID, mittentype, origbinder) => {
    if (process.mitten == undefined) { process.mitten = {} }
    let originalbinder = process.mitten[userID]?.origbinder;
    process.mitten[userID] = {
        mittenname: mittentype,
        origbinder: originalbinder ?? origbinder // Preserve original binder until it is removed. 
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.mitten = true;
}

const getMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    return process.mitten[userID]
}

const getMittenBinder = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    return process.mitten[userID]?.origbinder
}

const deleteMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    delete process.mitten[userID]
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.mitten = true;
}

const getMittenName = (userID, mittenname) => {
    if (process.mitten == undefined) { process.mitten = {} }
    let convertmittenarr = {}
    for (let i = 0; i < mittentypes.length; i++) {
        convertmittenarr[mittentypes[i].value] = mittentypes[i].name
    }
    if (mittenname) {
        return convertmittenarr[mittenname];
    }
    else if (process.mitten[userID]?.mittenname) {
        return convertmittenarr[process.mitten[userID]?.mittenname]
    }
    else {
        return undefined;
    }
}

const splitMessage = (text, inputRegex=null) => {

    /*************************************************************************************
     * Massive Regex, let's break it down:
     * 
     * 1.) Match User Tags. (@Dollminatrix)
     * 2.) Match >////<
     * 3.) Match Code Blocks
     * 4.) Match ANSI Colored Username Block ("DOLL-0014:")
     * 5.) Match ANSI Colors
     * 6.) Match Italicized Text, WITHOUT false-positives on bolded text.
     * 7.) Match Italicized Text using '_', WITHOUT false-positives on underlined text.
     * 8.) Match Website URLs - Stack Overflow-sourced URL matcher plus Doll's HTTP(S) matching.
     * 9.) Match Emoji - <:Emojiname:000000000000000000>
     * A.) Match Base Unicode Emoji - My stack is overflowing.
    **************************************************************************************/
    //             |-  Tags -| |>///<| |Match code block | |------------ ANSI Color Username Block --------| |-ANSI Colors -| |------------   Match italic text   ------------| |--------  Match underscore italic text --------| |----------------------  Match website URLs     ---------------------------------------------------| |---- Emojis ----| |--- Unicode Emoji -----------------------------------------------|
    const regex = /(<@[0-9]+>)|(>\/+<)|(```((ansi|js)\n)?)|(\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(\u001b\[.+?m) ?|((\-#\s+)?((?<!\*)\*{1})(\*{2})?([^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g

    let output = [];
    let deepCopy = text.split()[0]
    let found = deepCopy.match(inputRegex ? inputRegex : regex)

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

const modifymessage = async (msg, threadId) => {
    try {
        console.log(`${msg.channel.guild.name} - ${msg.member.displayName}: ${msg.content}`);
        // Mark modified message or not
        let modifiedmessage = false;
        let outtext = ``;
        let replacingtext = msg.content;
        // replace all emoji if the wearer is wearing something with emoji
        let replaceemojireturn = replaceEmoji(msg, replacingtext, modifiedmessage);
        modifiedmessage = replaceemojireturn.modifiedmessage;
        replacingtext = replaceemojireturn.replacingtext;

        // See if this message can be skipped. Messages containing only emoji do NOT need to be processed,
        // But only if NOT wearing a headwear that replaces it in previous step.
        if (!modifiedmessage && msg.content.match(/^((<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\s|\n)+$/)) return;

        // At this point, generate all of the parts for the message
        let messageparts = splitMessage(replacingtext);

        // Handle weird exceptions for links
        messageparts = handleLinkExceptions(messageparts);

        // Text garbling due to Arousal
        let vibereturned = textGarbleVibrator(messageparts, msg, modifiedmessage);
        messageparts = vibereturned.messageparts;
        modifiedmessage = vibereturned.modifiedmessage;

        // Text limiting and modifying due to Corset
        let corsetreturned = textGarbleCorset(messageparts, msg, modifiedmessage, threadId);
        if (corsetreturned.corseted) {
            return;
        }
        messageparts = corsetreturned.messageparts;
        modifiedmessage = corsetreturned.modifiedmessage

        // Text garbling due to Gag
        let gagreturned = textGarbleGag(messageparts, msg, modifiedmessage, outtext);
        messageparts = gagreturned.messageparts;
        modifiedmessage = gagreturned.modifiedmessage;
        outtext = gagreturned.outtext;

        // Text garbling due to Doll visors
        let dolltreturned = textGarbleDOLL(msg, modifiedmessage, outtext);
        modifiedmessage = dolltreturned.modifiedmessage;
        outtext = dolltreturned.outtext;
        let dollIDDisplay = dolltreturned.dollIDDisplay;

        // Finally, send it if we modified the message.
        if (modifiedmessage) { 
            await sendTheMessage(msg, outtext, dollIDDisplay, threadId);
        }
    }
    catch (err) {
        console.log(err);
    }
}

function replaceEmoji(msg, replacein, modifiedmessage) {
    let replacingtext = replacein;
    let modified = modifiedmessage;
    // replace all emoji if the wearer is wearing something with emoji
    if (!getHeadwearRestrictions(msg.author.id).canEmote) {
        replacingtext = processHeadwearEmoji(msg.author.id, msg.content)
        // If we actually modified the text, then change modifed message to true. 
        if (replacingtext != msg.content) {
            modified = true;
        }
    }
    return { replacingtext: replacingtext, modifiedmessage: modified };
}

function handleLinkExceptions(messagein) {
    //Weird exception for links
    let messageparts = messagein
    for (let i = 0; i < messageparts.length - 1; i++) {
        let current = messageparts[i];
        let next = messageparts[i + 1];
        if (current.text.startsWith("http://") || current.text.startsWith("https://")) {
            messageparts[i].text += next.text;
            messageparts.splice(i + 1, 1);
            messageparts[i].garble = false
        }
    }
    return messageparts;
}

function textGarbleVibrator(messagein, msg, modifiedmessage) {
    const intensity = getVibeEquivalent(msg.author.id)
    let messageparts = messagein;
    let modified = modifiedmessage
    if (intensity) {
        const arousedtexts = getArousedTexts(msg.author.id);

        //totalwords = 0 // recalculate eligible word count because they're stimmed out of their mind. 
        for (let i = 0; i < messageparts.length; i++) {
            try {
                if (messageparts[i].garble) {
                    let garbledtext = stutterText(msg, messageparts[i].text, intensity, arousedtexts)
                    if (garbledtext.stuttered) { modified = true }
                    messageparts[i].text = garbledtext.text
                    //totalwords = totalwords + messageparts[i].text.split(" ").length
                }
            }
            catch (err) { console.log(err) }
        }
    }
    return { messageparts: messageparts, modifiedmessage: modified }
}

function textGarbleCorset(messagein, msg, modifiedmessage, threadId) {
    // Now corset any words, using an amount to start with.
    let messageparts = messagein;
    let modified = modifiedmessage
    let corseted = false;
    if (getCorset(msg.author.id)) {
        const hadParts = messageparts.length > 0;
        modified = true
        const toRemove = [];
        for (let i = 0; i < messageparts.length; i++) {
            try {
                if (messageparts[i].garble) {
                    messageparts[i].text = corsetLimitWords(msg.author.id, messageparts[i].text)
                    if (messageparts[i].text.length == 0) toRemove.push(i);
                    messageparts[i].text = `${messageparts[i].text}\n`
                }
            }
            catch (err) { console.log(err) }
        }
        for (let i = toRemove.length - 1; i >= 0; i--) {
            messageparts.splice(toRemove[i], 1);
        }
        if (hadParts && messageparts.length == 0) {
            messageSend(msg, silenceMessage(), msg.member.displayAvatarURL(), msg.member.displayName, threadId).then(() => msg.delete())
            corseted = true;
            return { corseted: corseted };
        }
    }
    return { messageparts: messageparts, modifiedmessage: modified, corseted: corseted }
}

function textGarbleGag(messagein, msg, modifiedmessage, outtextin) {
    // Gags now
    let messageparts = messagein;
    let modified = modifiedmessage
    let outtext = outtextin
    if (process.gags == undefined) { process.gags = {} }
    if (process.gags[`${msg.author.id}`]) {
        // Grab all the command files from the commands directory
        const gagtypes = [];
        const commandsPath = path.join(__dirname, '..', 'gags');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        if (commandFiles.includes(process.gags[`${msg.author.id}`].gagtype + ".js")) {
            modified = true;
            let gaggarble = require(path.join(commandsPath, `${process.gags[`${msg.author.id}`].gagtype}.js`))
            let intensity = process.gags[`${msg.author.id}`].intensity ? process.gags[`${msg.author.id}`].intensity : 5
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
        outtext = messagetexts.join("");
    }
    return { messageparts: messageparts, modifiedmessage: modified, outtext: outtext }
}

function textGarbleDOLL(msg, modifiedmessage, outtextin) {
    // Handle Dollification
    let modified = modifiedmessage
    let outtext = outtextin
    let dollIDDisplay;
    if(getHeadwear(msg.author.id).find((headwear) => DOLLVISORS.includes(headwear))){
        modifiedmessage = true;
        dollDigits      = process.dolloverrides[msg.author.id] ? process.dolloverrides[msg.author.id].id : `${msg.author.id}`.slice(-4)
        // Include the tag - Otherwise, there is NO WAY to tell who it is.
        let dollIDShort     = "DOLL-" + dollDigits
        let dollID          = "DOLL-" + (dollDigits.length == 4 ? dollDigits : "0".repeat(4 - dollDigits.length) + dollDigits)
        let dollIDColor     = process.dolloverrides[msg.author.id]?.color ? process.dolloverrides[msg.author.id]?.color : "34"
        // Display names max 32 chars.
        let truncateDisplay = ""
        try{
            truncateDisplay = msg.member.displayName.slice(0,16) + (msg.member.displayName.length > 16 ? "..." : "")
        }catch(err){
            console.error(err.message);     // Following is not tested but SHOULD work.
            truncateDisplay = msg.author.displayName.slice(0,16) + (msg.author.displayName.length > 16 ? "..." : "")
        }
        dollIDDisplay       = dollIDShort + ` (@${truncateDisplay})`

        let dollMessageParts = splitMessage(outtext, DOLLREGEX)     // Reuse splitMessage, but with a different regex.


        // Strip all codeblocks from messages
        for(let i = 0; i < dollMessageParts.length; i++){
            if(dollMessageParts[i].garble){
                dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(/```(js|javascript|ansi)?\s*/g,  "")
            }
        }
        dollMessageParts = dollMessageParts.filter((part) => {return part.text != ""})

        // Put every "garble" messagePart in ANSI.
        for(let i = 0; i < dollMessageParts.length; i++){
            if(dollMessageParts[i].garble){
                // Uncorset
                dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(/ *-# */g,"")
                dollMessageParts[i].text = `\`\`\`ansi\n[1;${dollIDColor}m${dollID}: [0m${dollMessageParts[i].text}\`\`\``
            }
        }

        outtext = dollMessageParts.map(m => m.text).join("")

        // Merge any code blocks with nothing but whitespace in between.
        outtext = outtext.replaceAll(/```\s+```ansi/g,"")
    }
    return { modifiedmessage: modified, outtext: outtext, dollIDDisplay: dollIDDisplay }
}

async function sendTheMessage(msg, outtext, dollIDDisplay, threadID) {
    try {
        // If this is a reply, we want to create a reply in-line because webhooks can't reply. 
        if (msg.type == "19") {
            const replied = await msg.fetchReference();
            const replyauthorobject = await replied.guild.members.search({ query: replied.author.displayName, limit: 1 });
            const first = replyauthorobject.first()
            outtext = `<@${first.id}> ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`
        }

        // Truncate the text if it's too long
        if (outtext.length > 1999) {
            outtext = outtext.slice(0, 1999); // Seriously, STOP POSTING LONG MESSAGES
        }

        // Determine if an attachment was posted in the original message. 
        if (msg.attachments.size > 0) {
            console.log(`IT HAS IMAGES LOL`)
            let attachments = [];
            let promisearr = [];
            for (let attach of msg.attachments) {
                console.log(attach[1])
                promisearr.push(new Promise((res,rej) => {
                    // Download it, as a promise, and then Promise.all to grab all of the files once they've all finished.
                    // Doing it this way lets us multithread from the CDN and do it faster. 
                    if (!fs.existsSync(`./downloaded`)) { fs.mkdirSync(`./downloaded`, { recursive: true }) }
                    fs.mkdirSync(`./downloaded`, { recursive: true });
                    const file = fs.createWriteStream(`./downloaded/${attach[1].name}`)
                    https.get(attach[1].url, (response) => {
                        response.pipe(file);
                        file.on('finish', async () => {
                            file.close();
                            console.log(`Downloaded file: ./downloaded/${attach[1].name}`)
                            //attachments.push({ name: attach[1].name, spoiler: attach[1].spoiler });
                            res({ name: attach[1].name, spoiler: attach[1].spoiler })
                        })
                    }).on('error', (err) => {
                        console.log(err);
                        rej(false);
                    })
                }).then((v) => attachments.push(v)));
            }
            Promise.all(promisearr).then(async (v) => {
                // Send it!
                messageSendImg(msg, outtext, msg.member.displayAvatarURL(), (dollIDDisplay ? dollIDDisplay : msg.member.displayName), threadID, attachments).then(() => {
                    // Cleanup after sending
                    msg.delete().then(() => {
                        attachments.forEach((attach) => {
                            try {
                                // Screw it, deleting files is too hard. 
                                //fs.rmSync(`./downloaded/${attach.name}`);
                            }
                            catch (err) {
                                console.log(err);
                            }
                        })
                    });
                })
            })
        }
        // No attachments to download
        else {
            // If the message somehow creates a fully empty message, we want to avoid sending it and send the debug text
            if (!(/[^\u0000-\u0020]/).test(outtext)) {
                if (msg.content.length > 0) {
                    msg.channel.send(msg.content)
                }
                outtext = "Miss <@125093095405518850>, I broke the bot! The bot said what I was trying to say, for debugging purposes. Unless it was 0 length somehow."
            }
            // Check again, if we somehow got a 0 length text, something broke
            if (outtext.length == 0) { outtext = "Something went wrong. Ping <@125093095405518850> and let her know!"}
            // Finally send it!
            messageSend(msg, outtext, msg.member.displayAvatarURL(), (dollIDDisplay ? dollIDDisplay : msg.member.displayName), threadID).then(() => {
                // Cleanup after sending. 
                msg.delete();
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}

exports.gagtypesset = gagtypesset;

exports.assignGag = assignGag;
exports.getGag = getGag;
exports.getGagBinder = getGagBinder;
exports.getMittenBinder = getMittenBinder;
exports.getGagIntensity = getGagIntensity;
exports.deleteGag = deleteGag;
exports.assignMitten = assignMitten;
exports.getMitten = getMitten;
exports.deleteMitten = deleteMitten;
exports.modifymessage = modifymessage;
exports.convertGagText = convertGagText;
exports.getMittenName = getMittenName;
exports.mittentypes = mittentypes;
exports.gagtypes = gagtypesout;