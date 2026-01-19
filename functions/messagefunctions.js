const { WebhookClient, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs')
const path = require('path');

// Load all .png files into the bot as emoji, then assign them to process.emojis. 
// This can be used to allow the bot's emojis to function elsewhere. 
const loadEmoji = async (client) => {
    let emojifileslocalpath = path.resolve(__dirname, "..", "emoji");
    let emojifileslocal = fs.readdirSync(emojifileslocalpath).filter(file => file.endsWith('.png')).map((emoji) => `${emoji.slice(0,-4)}`);
    let emojisbot = await client.application.emojis.fetch();
    let emojisbotfiltered = emojisbot.map((emoji) => emoji.name);
    let sortedupload = emojifileslocal.filter(f => !emojisbotfiltered.includes(f)) // Sort out what needs to be uploaded
    sortedupload.forEach((s) => {
        client.application.emojis.create({ attachment: path.resolve(emojifileslocalpath, `${s}.png`), name: s }).then((emoji) => {
            console.log(`Uploaded emoji with name: ${emoji.name}. ${emoji}`)
        }).catch((err) => { console.log(err) })
    })
    emojisbot = await client.application.emojis.fetch();
    process.emojis = {};
    for (const emoji of emojisbot.keys()) {
        process.emojis[emojisbot.get(emoji).name] = `${emojisbot.get(emoji)}`
    }
}

const messageSend = async (msg, str, avatarURL, username, threadId) => {
    let webhookClient;
    let channel_id = threadId ? msg.channel.parentId : msg.channel.id
    // New webhook method
    if (process.webhook[channel_id]) {
        webhookClient = process.webhook[channel_id];
        webhookClient.send({
            threadId: threadId,
            content: str,
            username: username,
            avatarURL: avatarURL,
            allowedMentions: {
                "parse": []
            }
        }).then(() => {
            return true
        })
    }
    // Legacy Webhook method
    /*else {
        webhookClient = new WebhookClient({ 
            id: process.env.WEBHOOKID, 
            token: process.env.WEBHOOKTOKEN 
        })
    }*/
}

const messageSendImg = async (msg, str, avatarURL, username, threadId, attachs) => {
    let webhookClient;
    let channel_id = threadId ? msg.channel.parentId : msg.channel.id
    // New webhook method
    if (process.webhook[channel_id]) {
        webhookClient = process.webhook[channel_id];   
        let attachments = [];
        attachs.forEach((f) => {
            attachments.push(new AttachmentBuilder(`./downloaded/${f.name}`, { name: f.name, spoiler: f.spoiler }))
        })

        webhookClient.send({
            threadId: threadId,
            content: str,
            username: username,
            avatarURL: avatarURL,
            files: attachments,
            allowedMentions: {
                "parse": []
            }
        }).then(() => {
            return true
        })
    }
    // Legacy Webhook method
    /*else {
        webhookClient = new WebhookClient({ 
            id: process.env.WEBHOOKID, 
            token: process.env.WEBHOOKTOKEN 
        })
    }*/
}

// Sends a message to a channel, handling threads by retrieving the ID as it comes in
// Please god don't send to an invalid place I can't take it anymore
const messageSendChannel = async (str, channel, components = []) => {
    try {
        let channeltosendto = await process.client.channels.fetch(channel)
        if (channeltosendto) {
            if (channeltosendto.isSendable() && !channeltosendto.archived && !channeltosendto.locked) {
                if (channeltosendto.permissionsFor(channeltosendto.guild.members.me).has(PermissionsBitField.Flags.SendMessagesInThreads)) {
                    let messageoutput = {
                        content: str,
                        components: components
                    }
                    await channeltosendto.send(messageoutput)
                    console.log(`Message ${str.slice(0,30)}${(str.length > 30) ? "..." : ""} sent to ${channeltosendto.name}`)
                }
                else {
                    // Warn! 
                    console.log(`Sending message to the parent channel since we don't have access to send to these threads!`)
                    let messageoutput = {
                        content: `**WARNING: Bot cannot send to threads directly. Please review permissions and grant it __Send Messages in Threads__!**\n\n${str}`,
                        components: components
                    }
                    await channeltosendto.parent.send(messageoutput)
                    console.log(`Message ${str.slice(0,30)}${(str.length > 30) ? "..." : ""} sent to ${channeltosendto.name}'s parent channel, ${channeltosendto.parent.name} due to no permissions.`)
                }
            }
            else {
                // Warn! 
                console.log(`Sending message to the parent channel since the thread isnt sendable!`)
                let messageoutput = {
                    content: `**WARNING: Bot cannot send to locked or closed threads!**\n\n${str}`,
                    components: components
                }
                await channeltosendto.parent.send(messageoutput)
                console.log(`Message ${str.slice(0,30)}${(str.length > 30) ? "..." : ""} sent to ${channeltosendto.name}'s parent channel, ${channeltosendto.parent.name} due to no permissions.`)
            }
        }
        else {
            console.log("Failed to obtain a channel by ID " + channel);
        }
    }
    catch (err) {
        console.log(err);
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
     * 6.) Match Italicized Text, WITHOUT false-positives on bolded text or escaped asterisks.
     * 7.) Match Italicized Text using '_', WITHOUT false-positives on underlined text.
     * 8.) Match Website URLs - Stack Overflow-sourced URL matcher plus Doll's HTTP(S) matching.
     * 9.) Match Emoji - <:Emojiname:000000000000000000>
     * A.) Match Base Unicode Emoji - My stack is overflowing.
    **************************************************************************************/
    //             |-  Tags -| |>///<| |Match code block | |------------ ANSI Color Username Block --------| |-ANSI Colors -| |-- Match italic text (ignore escaped asterisks)  -------| |--------  Match underscore italic text --------| |----------------------  Match website URLs     ---------------------------------------------------| |---- Emojis ----| |--- Unicode Emoji -----------------------------------------------|
    const regex = /(<@[0-9]+>)|(>\/+<)|(```((ansi|js)\n)?)|(\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(\u001b\[.+?m) ?|((\-#\s+)?((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g

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



exports.splitMessage = splitMessage

exports.messageSend = messageSend;
exports.messageSendImg = messageSendImg;

exports.loadEmoji = loadEmoji;

exports.splitMessage = splitMessage;

exports.messageSendChannel = messageSendChannel;