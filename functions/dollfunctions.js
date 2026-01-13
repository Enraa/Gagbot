const { getOption } = require(`./../functions/configfunctions.js`);
const { getHeadwearRestrictions, processHeadwearEmoji, getHeadwearName, getHeadwear, DOLLVISORS } = require('./headwearfunctions.js');
const { splitMessage } = require(`./../functions/messagefunctions.js`);

//const DOLLREGEX = /(((?<!\*)\*{1})(\*{2})?([^\*]|\*{2})+\*)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|\n/g
// Abomination of a regex for corset compatibility.
const DOLLREGEX = /(((?<!\*)(?<!(\*hff|\*hnnf|\*ahff|\*hhh|\*nnh|\*hnn|\*hng|\*uah|\*uhf))\*{1})(?!(hff\*|hnnf\*|ahff\*|hhh\*|nnh\*|hnn\*|hng\*|uah\*|uhf\*))(\*{2})?([^\*]|\*{2})+\*)|(((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|\n/g


const DOLLPROTOCOL = [
    // Regex uses an ENQ character to not rematch matches.
    // Banned words
    {"regex": /(?<![\u0005A-Za-z])i(?![-'A-Za-z])/i,           "value": 1, "redact": false, "string": "I",},   // "I"
    {"regex": /(?<![\u0005A-Za-z])i'm(?![A-Za-z])/i,         "value": 1, "redact": false, "string": "I'm",},   // "I'm"
    {"regex": /(?<![\u0005A-Za-z])my(?![A-Za-z])/i,          "value": 1, "redact": false, "string": "My",},   // "my"
    {"regex": /(?<![\u0005A-Za-z])me(?![A-Za-z])/i,          "value": 1, "redact": false, "string": "Me",},   // "Myself"
    {"regex": /(?<![\u0005A-Za-z])myself(?![A-Za-z])/i,      "value": 1, "redact": false, "string": "Myself",},   // "Me"
    // Redacted
    {"regex": /(c.{0,10}a.{0,10}t.{0,10}h.{0,10}e.{0,10}r.{0,10}i.{0,10}n.{0,10}e.{0,10}) ?w.{0,10}i.{0,10}l.{0,10}l.{0,10}o.{0,10}w.{0,10}s/gi, "value": 999, "redact": true },  // SHUT
]

function isDollified(userID){
    return getHeadwear(userID).find((headwear) => DOLLVISORS.includes(headwear))
}

async function textGarbleDOLL(msg, modifiedmessage, outtextin) {
    // Handle Dollification
    let modified = modifiedmessage
    let outtext = outtextin
    let dollIDDisplay;
    let dollID = ``;
    let dollIDOverride = getOption(msg.author.id, "dollvisorname")
    let dollIDColor = getOption(msg.author.id, "dollvisorcolor") ?? 34
    let dollProtocol = (getOption(msg.author.id, "dollforcedprotocol") == "enabled")
    let dollProtocolViolations = []
    let dollProtocolViolated = false;
    if(isDollified(msg.author.id)){
    //if(getHeadwear(msg.author.id).find((headwear) => DOLLVISORS.includes(headwear))){
        modified = true;
        // If dollIDOverride is not specified or the override is exactly a string of numbers...
        if (!dollIDOverride || (Number.isFinite(dollIDOverride) && dollIDOverride.length < 6)) {
            dollDigits      = dollIDOverride ? dollIDOverride : `${msg.author.id}`.slice(-4)
            // Include the tag - Otherwise, there is NO WAY to tell who it is.
            let dollIDShort     = "DOLL-" + dollDigits
            dollID          = "DOLL-" + (dollDigits.length >= 4 ? dollDigits : "0".repeat(4 - dollDigits.length) + dollDigits)
            dollIDColor         = 34
            // Display names max 32 chars.
            let truncateDisplay = ""
            try{
                truncateDisplay = msg.member.displayName.slice(0,16) + (msg.member.displayName.length > 16 ? "..." : "")
            }catch(err){
                console.error(err.message);     // Following is not tested but SHOULD work.
                truncateDisplay = msg.author.displayName.slice(0,16) + (msg.author.displayName.length > 16 ? "..." : "")
            }
            dollIDDisplay       = dollIDShort + ` (${truncateDisplay})`
        }
        else {
            let additionalpart = ``;
            if (dollIDOverride.length < 25) {
                let additionallength = 32 - dollIDOverride.length; // max length of name
                if ((additionallength - 3) > msg.member.displayName.length) {
                    additionalpart = ` (${msg.member.displayName})`
                }
                else {
                    // Get the length of their name, minus 6 for additional characters to fit into ...
                    let reducedname = msg.member.displayName.slice(0, Math.min((additionallength - 6), msg.member.displayName.length))
                    additionalpart = ` (${reducedname}...)`
                }
            }
            dollID = `${dollIDOverride}`
            if (dollIDOverride.includes(msg.member.displayName)) {
                dollIDDisplay = `${dollIDOverride}`
            }
            else {
                dollIDDisplay = `${dollIDOverride}${additionalpart}`;
            }
        }

        let dollMessageParts = splitMessage(outtext, DOLLREGEX)     // Reuse splitMessage, but with a different regex.
        let partstolinkto = Array.from(outtext.matchAll(/(<(@|#)[0-9]+>)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)/g)).map((a) => a[0]) // Match User tags, channel tags and links
        
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
                console.log(dollMessageParts[i].text)
                let replacebolds = Array.from(dollMessageParts[i].text.matchAll(/((\*\*)|(\_\_))[^(\*|\_)]+((\*\*)|(\_\_))/g)).map((a) => a[0])
                //console.log(replacebolds)
                replacebolds.forEach((b) => {
                    let replaceb = `[1m${b.slice(2,-2)}[0m` // Capture the part within the bolding
                    dollMessageParts[i].text = dollMessageParts[i].text.replace(b, replaceb)
                })

                // Loop on protocols
                if(dollProtocol){
                    DOLLPROTOCOL.forEach((r) => {
                        //let replaceProtocol = Array.from(dollMessageParts[i].text.matchAll(r.regex)).map((a) => a[0])
                        let replaceProtocol = dollMessageParts[i].text.match(r.regex)
                        if(replaceProtocol){
                            dollProtocolViolations.push(r.redact ? "REDACTED" : r.string)

                            // Stuff an ENQ character before each match.
                            while(dollMessageParts[i].text.match(r.regex)){
                                dollMessageParts[i].text = dollMessageParts[i].text.replace(r.regex,r.redact ? `[1;40;30m[REDACTED][0m` : `[0;31m[${dollMessageParts[i].text.match(r.regex)[0]}][0m`)
                            }
                        }
                    })
                }


                dollMessageParts[i].text = `\`\`\`ansi\n[1;${dollIDColor}m${dollID}: [0m${dollMessageParts[i].text}`
                dollMessageParts[i].text = dollMessageParts[i].text.replaceAll(``, "")

                // Log protocol violations
                if(dollProtocolViolations.length > 0){
                    dollProtocolViolated = true;
                    dollMessageParts[i].text += `\n[1;31mERROR [0;31m- Protocol Violation!`
                    //dollProtocolViolations.forEach((v) => {dollMessageParts[i].text += `"${v}", `})
                }
                dollMessageParts[i].text += `\`\`\``
            }
        }

        outtext = dollMessageParts.map(m => m.text).join("")
        // And now, append with tags and links
        if (partstolinkto) {
            outtext = `${outtext}${partstolinkto.join("\n")}`
        }

        // Merge any code blocks with nothing but whitespace in between.
        outtext = outtext.replaceAll(/```\s+```ansi/g,"")
    }
    return { modifiedmessage: modified, outtext: outtext, dollIDDisplay: dollIDDisplay, dollProtocolViolation: dollProtocolViolated }
}


exports.textGarbleDOLL = textGarbleDOLL;