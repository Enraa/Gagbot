const { WebhookClient, AttachmentBuilder, PermissionsBitField } = require("discord.js");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const axios = require("axios");
const { getToys } = require("./toyfunctions");
const { getWearable } = require("./wearablefunctions");
const { getHeavy } = require("./heavyfunctions");
const { getHeadwear, DOLLVISORS } = require("./headwearfunctions");
const { getCollar } = require("./collarfunctions");
const { getOption } = require("./configfunctions");

// Load all .png files into the bot as emoji, then assign them to process.emojis.
// This can be used to allow the bot's emojis to function elsewhere.
const loadEmoji = async (client) => {
	let emojifileslocalpath = path.resolve(__dirname, "..", "emoji");
	let emojifileslocal = fs
		.readdirSync(emojifileslocalpath)
		.filter((file) => file.endsWith(".png"))
		.map((emoji) => `${emoji.slice(0, -4)}`);
	let emojisbot = await client.application.emojis.fetch();
	let emojisbotfiltered = emojisbot.map((emoji) => emoji.name);
	let sortedupload = emojifileslocal.filter((f) => !emojisbotfiltered.includes(f)); // Sort out what needs to be uploaded
	sortedupload.forEach((s) => {
		client.application.emojis
			.create({ attachment: path.resolve(emojifileslocalpath, `${s}.png`), name: s })
			.then((emoji) => {
				console.log(`Uploaded emoji with name: ${emoji.name}. ${emoji}`);
			})
			.catch((err) => {
				console.log(err);
			});
	});
	emojisbot = await client.application.emojis.fetch();
	process.emojis = {};
	for (const emoji of emojisbot.keys()) {
		process.emojis[emojisbot.get(emoji).name] = `${emojisbot.get(emoji)}`;
	}
};
/**********
 * Records a message into process.recordedmessages.
 * This will generate a map of IDs to reference against, where searching the modifiedmsg's ID will provide the content, user ID and timestamp of the message
 **********/
function recordMessage (msg, modifiedmsg, reply) {
    if (getOption(msg?.author?.id, "recordmessages") == "disabled") { return }
    if (process.recordedmessages == undefined) { process.recordedmessages = {} }
    if (modifiedmsg?.id && msg?.content && msg?.author?.id && msg?.createdTimestamp) {
        process.recordedmessages[modifiedmsg.id] = {
            content: msg.content,
            timestamp: msg.createdTimestamp,
            authorid: msg.author.id
        }
        if (reply) {
            process.recordedmessages[modifiedmsg.id].replyauthor = reply.replyauthor
            process.recordedmessages[modifiedmsg.id].replymessageid = reply.replymessageid
        }
    } 
    if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.recordedmessages = true;
}

const messageSend = async (msg, str, avatarURL, username, threadId, botemoji, isreply, replyobject) => {
    try {
        let webhookClient;
        let channel_id = threadId ? msg.channel.parentId : msg.channel.id;
        // New webhook method - human emoji
        if (process.webhook[channel_id]) {
            if (process.webhook[channel_id].human && botemoji) {
                webhookClient = process.webhook[channel_id].bot;
            } else if (process.webhook[channel_id].human && !botemoji) {
                webhookClient = process.webhook[channel_id].human;
            } else {
                webhookClient = process.webhook[channel_id];
            }
            webhookClient.send({ threadId: threadId, content: str, username: username, avatarURL: avatarURL, allowedMentions: { parse: [] } }).then((webmess) => {
                if (isreply && !threadId) {
                    recordMessage(msg, webmess, replyobject);
                    webhookClient.editMessage(webmess, { content: `${webmess.content.slice(0,1998)} ​`, allowedMentions: { parse: ["users"] } }).then(() => {
                        return webmess;
                    })
                }
                else {
                    recordMessage(msg, webmess, replyobject);
                    return webmess;
                }
            });
        }
    }
	catch (err) {
        console.log(err);
    }
	// Legacy Webhook method
	/*else {
        webhookClient = new WebhookClient({ 
            id: process.env.WEBHOOKID, 
            token: process.env.WEBHOOKTOKEN 
        })
    }*/
};

const messageSendImg = async (msg, str, avatarURL, username, threadId, attachs, botemoji, isreply, replyobject) => {
    try {
        let webhookClient;
        let channel_id = threadId ? msg.channel.parentId : msg.channel.id;
        // New webhook method
        if (process.webhook[channel_id]) {
            if (process.webhook[channel_id].human && botemoji) {
                webhookClient = process.webhook[channel_id].bot;
            } else if (process.webhook[channel_id].human && !botemoji) {
                webhookClient = process.webhook[channel_id].human;
            } else {
                webhookClient = process.webhook[channel_id];
            }
            let attachments = [];
            attachs.forEach((f) => {
                attachments.push(new AttachmentBuilder(`./downloaded/${f.name}`, { name: f.name, spoiler: f.spoiler }));
            });

            webhookClient.send({ threadId: threadId, content: str, username: username, avatarURL: avatarURL, files: attachments, allowedMentions: { parse: [] } }).then((webmess) => {
                if (isreply && !threadId) {
                    recordMessage(msg, webmess, replyobject);
                    webhookClient.editMessage(webmess, { content: `${webmess.content.slice(0,1998)} ​`, files: attachments, allowedMentions: { parse: ["users"] } }).then(() => {
                        return webmess;
                    })
                }
                else {
                    recordMessage(msg, webmess, replyobject);
                    return webmess;
                }
            });
        }
    }
	catch (err) {
        console.log(err);
    }
	// Legacy Webhook method
	/*else {
        webhookClient = new WebhookClient({ 
            id: process.env.WEBHOOKID, 
            token: process.env.WEBHOOKTOKEN 
        })
    }*/
};

// Sends a message to a channel, handling threads by retrieving the ID as it comes in
// Please god don't send to an invalid place I can't take it anymore
const messageSendChannel = async (str, channel, components = []) => {
	try {
		let channeltosendto = await process.client.channels.fetch(channel);
		if (channeltosendto) {
			if (channeltosendto.isSendable() && !channeltosendto.archived && !channeltosendto.locked) {
				if (channeltosendto.permissionsFor(channeltosendto.guild.members.me).has(PermissionsBitField.Flags.SendMessagesInThreads)) {
					let messageoutput = { content: str, components: components };
					await channeltosendto.send(messageoutput);
					console.log(`Message ${str.slice(0, 30)}${str.length > 30 ? "..." : ""} sent to ${channeltosendto.name}`);
				} else {
					// Warn!
					console.log(`Sending message to the parent channel since we don't have access to send to these threads!`);
					let messageoutput = { content: `**WARNING: Bot cannot send to threads directly. Please review permissions and grant it __Send Messages in Threads__!**\n\n${str}`, components: components };
					await channeltosendto.parent.send(messageoutput);
					console.log(`Message ${str.slice(0, 30)}${str.length > 30 ? "..." : ""} sent to ${channeltosendto.name}'s parent channel, ${channeltosendto.parent.name} due to no permissions.`);
				}
			} else {
				// Warn!
				console.log(`Sending message to the parent channel since the thread isnt sendable!`);
				let messageoutput = { content: `**WARNING: Bot cannot send to locked or closed threads!**\n\n${str}`, components: components };
				await channeltosendto.parent.send(messageoutput);
				console.log(`Message ${str.slice(0, 30)}${str.length > 30 ? "..." : ""} sent to ${channeltosendto.name}'s parent channel, ${channeltosendto.parent.name} due to no permissions.`);
			}
		} else {
			console.log("Failed to obtain a channel by ID " + channel);
		}
	} catch (err) {
		console.log(err);
	}
};

const splitMessage = (text, inputRegex = null) => {
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
	const regex = /(<@[0-9]+>)|(>\/+<)|(```((ansi|js)\n)?)|(\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(\u001b\[.+?m) ?|((\-#\s+)?((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g;

	let output = [];
	let deepCopy = text.split()[0];
	let found = deepCopy.match(inputRegex ? inputRegex : regex);

	for (const x in found) {
		index = deepCopy.indexOf(found[x]); // Get the index of the regex token

		if (index > 0) {
			output.push({
				text: deepCopy.substring(0, index), //garbleTextSegment(deepCopy.substring(0,index)),
				garble: true,
			});
		}

		output.push({ text: found[x], garble: false });
		// Work on the rest of the string
		deepCopy = deepCopy.substring(index + found[x].length);
	}
	// Garble everything after the final token, if we have anything.
	if (deepCopy.length > 0) {
		// Don't append nothing.
		output.push({
			text: deepCopy, //garbleTextSegment(deepCopy),
			garble: true,
		});
	}

	// Garble only valid text segments.
	return output;
};

function runMessageEvents(data) {
	// Gags
	/*if (process.gags) {
		Object.keys(process.gags).forEach((userid) => {
			getGags(userid).forEach((g) => {
				if (process.msgfunctions.gags && process.msgfunctions.gags[g.gagtype]) {
					process.msgfunctions.gags[g.gagtype](userid, data);
				}
			});
		});
	}*/ // This will cause a circular to have it. 
	// Headwear
	if (process.headwear) {
        getHeadwear(data.msg.author.id).forEach((h) => {
            if (process.msgfunctions.headwear && process.msgfunctions.headwear[h]) {
                process.msgfunctions.headwear[h](data.msg.author.id, data);
            }
        });
	}
	// Mittens
	/*if (process.mitten) {
		Object.keys(process.mitten).forEach((userid) => {
			if (getMitten(userid)) {
				if (process.msgfunctions.mitten && process.msgfunctions.mitten[getMitten(userid).mittenname]) {
					process.msgfunctions.mitten[getMitten(userid).mittenname](userid, data);
				}
			}
		});
	}*/ // This will cause a circular to have it. 
	// Heavy Bondage
	if (process.heavy) {
        if (getHeavy(data.msg.author.id)) {
            if (process.msgfunctions.heavy && process.msgfunctions.heavy[getHeavy(data.msg.author.id).typeval]) {
                process.msgfunctions.heavy[getHeavy(data.msg.author.id).typeval](data.msg.author.id, data);
            }
        }
	}
	// Wearables
	if (process.wearable) {
        getWearable(data.msg.author.id).forEach((h) => {
            if (process.msgfunctions.wearable && process.msgfunctions.wearable[h]) {
                process.msgfunctions.wearable[h](data.msg.author.id, data);
            }
        });
	}
    // Toys
    if (process.toys) {
        getToys(data.msg.author.id).forEach((h) => {
            if (process.msgfunctions.toys && process.msgfunctions.toys[h.type]) {
                process.msgfunctions.toys[h.type](data.msg.author.id, data);
            }
        });
	}
    // Collars
    if (process.collar) {
        if (getCollar(data.msg.author.id)) {
            if (process.msgfunctions.collar && process.msgfunctions.collar[getCollar(data.msg.author.id).collartype]) {
                process.msgfunctions.collar[getCollar(data.msg.author.id).collartype](data.msg.author.id, data);
            }
            if (getCollar(data.msg.author.id).additionalcollars) {
                getCollar(data.msg.author.id).additionalcollars.forEach((ac) => {
                    if (process.msgfunctions.collar && process.msgfunctions.collar[ac]) {
                        process.msgfunctions.collar[ac](data.msg.author.id, data);
                    }
                })
            }
        }
	}
}

// Retrieves any alternate user name for a given user.
function getAlternateName(user) {
    let outname = user.displayName // We're putting a member object in here
    // Handle pet collar name
    if ((getCollar(user.id)?.collartype == "collarengraved") || (getCollar(user.id) && getCollar(user.id).additionalcollars && getCollar(user.id).additionalcollars.includes("collarengraved"))) {
        if (getOption(user.id, "engravedcollarname") && getOption(user.id, "engravedcollarname").length > 0) {
            outname = getOption(user.id, "engravedcollarname");
        }
    }

    // Handle Doll Visor name
    if (getHeadwear(user.id).find((headwear) => DOLLVISORS.includes(headwear))) {
        let dollIDOverride = getOption(user.id, "dollvisorname");
        let dollmaker = getHeadwear(user.id).find((headwear) => headwear === "dollmaker_visor");
        // If dollIDOverride is not specified or the override is exactly a string of numbers...
        // Force Dollmaker's Visor wearers to get this generation function
        if (!dollIDOverride || (Number.isFinite(dollIDOverride) && dollIDOverride.length < 6) || dollmaker) {
            if (!dollIDOverride.search(new RegExp(/\\D/, "g"))) {
                // If the DollIDOverride is only a string of numbers 
                outname = `DOLL-${dollIDout}`;
            }
            else {
                outname = `DOLL-${user.id.slice(-4)}`
            }
        }
        else {
            outname = dollIDOverride;
        }
    }

    // Finally, if the outname is EXACTLY the same as the displayName we recieved, 
    // or the user's display name can be found in the modified name,
    // or the modified name can be found in the user's display name, return it
    if ((user.displayName.toLowerCase() == outname.toLowerCase()) || 
        (outname.toLowerCase().includes(user.displayName.toLowerCase())) ||
        (user.displayName.toLowerCase().includes(outname.toLowerCase()))) { return outname }

    // Otherwise, we need to append the user's display name as we can
    let additionalpart = ``;
    // If the length of the replacement name is less than 25, we can add some of the username...
    if (outname.length < 25) {
        let additionallength = 32 - outname.length; // max length of name
        if (additionallength - 3 > user.displayName.length) {
            additionalpart = ` (${user.displayName})`;
        } else {
            // Get the length of their name, minus 6 for additional characters to fit into ...
            let reducedname = user.displayName.slice(0, Math.min(additionallength - 6, user.displayName.length));
            additionalpart = ` (${reducedname}...)`;
        }
    }

    return `${outname}${additionalpart}`.slice(0,32)
}

/**********
 * Get the combined profile picture of the user, if their original one matches the one we have on file
 * 
 * (guild member) member - The Guild Member object sending the message
 **********/
async function getPFP(member, mods = []) {
    console.log(member.displayAvatarURL());
    console.log(member.displayAvatarDecorationURL());
    if (process.memberavatars == undefined) { process.memberavatars = {} }
    if (process.memberavatars[member.id] && (process.memberavatars[member.id].avatarURL == member.displayAvatarURL()) && (process.memberavatars[member.id].decorationURL == member.displayAvatarDecorationURL())) {
        if (process.memberavatars[member.id].link) {
            return process.memberavatars[member.id].link;
        }
    }

    // Fetch the Avatar URL
    try {
        // Get avatar decoration image
        let imgfetch = await fetch(member.displayAvatarDecorationURL())
        if (!imgfetch.ok) { console.log(`Error fetching Decoration URL: ${member.displayAvatarDecorationURL()}`)}
        let buffd = await Buffer.from(await imgfetch.arrayBuffer())

        let decorationimage = await sharp(buffd)
            .resize({
                fit: sharp.fit.contain,
                height: 288,
                width: 288
            })
            .toBuffer({ resolveWithObject: true })

        // Get Avatar Image
        imgfetch = await fetch(member.displayAvatarURL())
        if (!imgfetch.ok) { console.log(`Error fetching Avatar URL: ${member.displayAvatarURL()}`)}
        let buff = await Buffer.from(await imgfetch.arrayBuffer())

        let avatarimage = await sharp(buff)
            .resize({
                fit: sharp.fit.contain,
                height: 256,
                width: 256
            })
            .toBuffer({ resolveWithObject: true})

        console.log(decorationimage)
        console.log(avatarimage)

        // Put them all together!
        let almostfinalimage = await sharp({
            create: {
                width: 300,
                height: 300,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0}
            }})
            .composite([
                {
                    input: avatarimage.data,
                    top: 16,
                    left: 16,
                },
                {
                    input: decorationimage.data,
                    top: 0,
                    left: 0
                }
            ])
            .png()
            .toBuffer()

        // Create another instance to shrink it, because apparently doing this cleanly in one sharp instance is too hard. 
        let finalimage = await sharp(almostfinalimage)
            .extract({
                top: 16,
                left: 16,
                width: 256,
                height: 256
            })
            .png()
            .toBuffer({ resolveWithObject: true })

        // Finally, make a payload and upload the image
        let imagepayload = new URLSearchParams({
            image: finalimage.data.toString('base64'),
            type: "base64"
        })
        let imgurupload = await axios.post('https://api.imgur.com/3/image', imagepayload, {
            headers: { 
                'Authorization': 'Client-ID 546c25a59c58ad7',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        let imgururl = imgurupload?.data?.data?.link;

        if (imgururl) {
            process.memberavatars[member.id] = {
                avatarURL: member.displayAvatarURL(),
                decorationURL: member.displayAvatarDecorationURL(),
                link: imgururl
            }

            if (process.readytosave == undefined) {
                process.readytosave = {};
            }
            process.readytosave.memberavatars = true;

            return imgururl;
        }
    }
    catch (err) {
        console.log(err);
        return member.displayAvatarURL();
    }

    return member.displayAvatarURL();
}

/*********
 * Create a combined profile picture for the user to use on the webhook
 * 
 * 
 *********/
function createPFP(userobject, avatarURL, decorationURL, force = false) {

}


exports.splitMessage = splitMessage;

exports.messageSend = messageSend;
exports.messageSendImg = messageSendImg;
exports.recordMessage = recordMessage;

exports.loadEmoji = loadEmoji;

exports.splitMessage = splitMessage;

exports.messageSendChannel = messageSendChannel;

exports.runMessageEvents = runMessageEvents;

exports.getAlternateName = getAlternateName;

exports.getPFP = getPFP;