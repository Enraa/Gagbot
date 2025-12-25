const fs = require('fs');
const path = require('path');
const https = require('https');
const { messageSend, messageSendImg, messageSendDev } = require(`./../functions/messagefunctions.js`)
const { getCorset, corsetLimitWords } = require(`./../functions/corsetfunctions.js`)
const { stutterText } = require(`./../functions/vibefunctions.js`);
const { getVibeEquivalent } = require('./vibefunctions.js');

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
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`, JSON.stringify(process.gags));
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
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/gaggedusers.txt`, JSON.stringify(process.gags));
}

const assignMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    process.mitten[userID] = true
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`, JSON.stringify(process.mitten));
}

const getMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    return process.mitten[userID]
}

const deleteMitten = (userID) => {
    if (process.mitten == undefined) { process.mitten = {} }
    delete process.mitten[userID]
    fs.writeFileSync(`${process.GagbotSavedFileDirectory}/mittenedusers.txt`, JSON.stringify(process.mitten));
}

const splitMessage = (text) => {

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
    //             |-  Tags -| |>///<| |Match code block | |------------ ANSI Color Username Block --------| |-ANSI Colors -| |--------   Match italic text   -------| |---  Match underscore italic text-----| |----------------------  Match website URLs     ---------------------------------------------------| |---- Emojis ----| |--- Unicode Emoji -----------------------------------------------|
    const regex = /(<@[0-9]+>)|(>\/+<)|(```((ansi|js)\n)?)|(\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(\u001b\[.+?m) ?|(((?<!\*)\*{1})(\*{2})?([^\*]|\*{2})+\*)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g

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

const garbleMessage = async (threadId, msg) => {
    try {
        // fast-track if the message is just emotes and spaces
        if (msg.content.match(/^((<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\s|\n)+$/)) return;

        let outtext = '';
        let messageparts = splitMessage(msg.content);
        let modifiedmessage = false;

        //Weird exception for links
        for (let i = 0; i < messageparts.length - 1; i++) {
            let current = messageparts[i];
            let next = messageparts[i + 1];
            if (current.text.startsWith("http://") || current.text.startsWith("https://")) {
                messageparts[i].text += next.text;
                messageparts.splice(i + 1, 1);
                messageparts[i].garble = false
            }
        }

        let totalwords = 0;
        for (let i = 0; i < messageparts.length; i++) {
            if (messageparts[i].garble) {
                totalwords = totalwords + messageparts[i].text.split(" ").length
            }
        }
        console.log(msg.content)
        
        // Vibrators first
        const intensity = getVibeEquivalent(msg.author.id)
        if (intensity) {
            modifiedmessage = true;

            totalwords = 0 // recalculate eligible word count because they're stimmed out of their mind. 
            for (let i = 0; i < messageparts.length; i++) {
                try {
                    if (messageparts[i].garble) {
                        messageparts[i].text = stutterText(messageparts[i].text, intensity)
                        totalwords = totalwords + messageparts[i].text.split(" ").length
                    }
                }
                catch (err) { console.log(err) }
            }
        }

        console.log(messageparts)
        console.log(totalwords)
        // Now corset any words, using an amount to start with.
        if (getCorset(msg.author.id)) {
            let wordspermitted = (22 - (getCorset(msg.author.id).tightness * 2)) // subtract 2 for each tightness level
            if ((totalwords >= wordspermitted) || (getCorset(msg.author.id).tightness >= 7)) { // Only bother modifying at this point if the eligible word count is longer than X words permitted. 
                for (let i = 0; i < messageparts.length; i++) {
                    modifiedmessage = true
                    try {
                        if (messageparts[i].garble) {
                            messageparts[i].text = corsetLimitWords(msg.author.id, messageparts[i].text, wordspermitted)
                            messageparts[i].text = `${messageparts[i].text}\n`
                        }
                    }
                    catch (err) { console.log(err) }
                }
            }
        }
        // Gags now
        if (process.gags == undefined) { process.gags = {} }
        if (process.gags[`${msg.author.id}`]) {
            // Grab all the command files from the commands directory
            const gagtypes = [];
            const commandsPath = path.join(__dirname, '..', 'gags');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

            if (commandFiles.includes(process.gags[`${msg.author.id}`].gagtype + ".js")) {
                modifiedmessage = true;
                let gaggarble = require(path.join(commandsPath, `${process.gags[`${msg.author.id}`].gagtype}.js`))
                let intensity = process.gags[`${msg.author.id}`].intensity ? process.gags[`${msg.author.id}`].intensity : 5
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
                const replyauthorobject = await replied.guild.members.search({ query: replied.author.displayName, limit: 1 });
                const first = replyauthorobject.first()
                outtext = `<@${first.id}> ⟶ https://discord.com/channels/${replied.guildId}/${replied.channelId}/${replied.id}\n${outtext}`
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
                    if ((!(/[^\u0000-\u0020]/).test(outtext)) && (outtext.length > 0)) {
                        msg.channel.send(msg.content)
                        outtext = "Mistress <@125093095405518850>, I broke the bot! The bot said what I was trying to say, for debugging purposes."
                    }
                    messageSendImg(threadId, outtext, msg.member.displayAvatarURL(), msg.member.displayName, msg.id, spoiler).then(() => {
                        msg.delete().then(() => {
                            fs.rmSync(`./${spoilertext}downloadedimage_${msg.id}.png`)
                        });
                    })
                })
            }
            else {
                if (!(/[^\u0000-\u0020]/).test(outtext)) {
                    msg.channel.send(msg.content)
                    outtext = "Mistress <@125093095405518850>, I broke the bot! The bot said what I was trying to say, for debugging purposes."
                }
                if (outtext.length == 0) { outtext = "Something went wrong. Ping <@125093095405518850> and let her know!"}
                let sentmessage = messageSend(threadId, outtext, msg.member.displayAvatarURL(), msg.member.displayName).then(() => {
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