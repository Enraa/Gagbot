const { getOption } = require("../../getters/config/getOption")
const { markForSave } = require("../../other/markForSave")

/*********
 * Records a message for Edit Message app command
 * 
 * - (message object) msg - The message that invoked Gagbot
 * - (message object) modifiedmsg - The webhooked message Gagbot sent
 * - (object) reply? - If this is a reply, extra info for the reply
 * ---
 * ##### *No return value*
 *********/
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
    markForSave("recordedmessages");
}

exports.recordMessage = recordMessage;