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
//                |-  Tags -| |>///<| |Match code block | |------------ ANSI Color Username Block --------| |-ANSI Colors -| |-- Match italic text (ignore escaped asterisks)  -------| |--------  Match underscore italic text --------| |----------------------  Match website URLs     ---------------------------------------------------| |---- Emojis ----| |--- Unicode Emoji -----------------------------------------------|
const oldregex = /(<@[0-9]+>)|(>\/+<)|(```((ansi|js)\n)?)|(\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(\u001b\[.+?m) ?|((\-#\s+)?((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_)|(<?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(<a?:[^:]+:[^>]+>)|(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g;

// Regex used to separate OOC text from IC text.
const REGEX_OOC = /(?<OOC>((\-#\s+)?((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_))/g

// Regex used when splitting IC or OOC text.
// NOTE - REGEX_SENTENCE must *NEVER* match more than one named capture group at a time.
const REGEX_SENTENCE = /(?<tag><@[0-9]+>)|(?<textEmote>(>\/+<))|(?<codeBlock>```((ansi|js)\n)?)|(?<ANSIUsername>\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(?<ANSIColor>\u001b\[.+?m) ?|(?<websiteURL><?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(?<emoji><a?:[^:]+:[^>]+>)|(?<uncodeEmoji>\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|\n/g;

const HIGHESTLEVELNODES = ["IC","OOC"]

/**************************************************
 * Add a new object to the syntax tree
 * @param arr   - Array to push onto
 * @param text  - Raw text
 * @param type  - What does this text represent?
 *************************************************/
const splitMessageV2Push = (arr, text, type) => {
    let newObject = {"type": type}

    // Highest-level nodes (IC, OOC) contain arrays of text
    if(HIGHESTLEVELNODES.includes(type)){
        newObject["data"] = text
    // Lower-level nodes contain raw text only.
    }else{
        newObject["text"] = text;
    }
    arr.push(newObject)     // Add it to the array.
}

/**************************************************
 * Recursively construct an Abstract Syntax Tree-like Model of a Message
 * Intended Use: splitMessage(text)
 * @param text      - Raw text of the discord message.
 * @param inRegex   - Regex to split with.
 * @param base      - Is this function call the uppermost level?
 *************************************************/
const splitMessageV2 = (text, inRegex=REGEX_OOC, base=true) => {
    // RegExp have writable properties - get a fresh copy just in case of synchronization issues.
    let regex = new RegExp(inRegex.source,"g")

    let output = []

    // Split on the regex, match by match
    let curr, chunk
    let startIndex = 0;
    while((curr = regex.exec(text)) !== null){

        // If anything is before the match, snag it.
        ///////////////////////////////////////////////
        if(startIndex != curr.index){
            chunk = text.substring(startIndex,curr.index)
            if(base){
                splitMessageV2Push(output, splitMessageV2(chunk,REGEX_SENTENCE,false), "IC")
            }else{
                splitMessageV2Push(output,chunk, "rawText")
            }
        }

        // Get the match itself.
        ////////////////////////////////////////
        let matchTag = Object.keys(curr.groups).find((e) => {return !!curr.groups[e]})
        if(base){
            splitMessageV2Push(output, splitMessageV2(curr[0],REGEX_SENTENCE,false), matchTag)
        }else{
            splitMessageV2Push(output, curr[0], matchTag)
        }
        startIndex = regex.lastIndex
    }

    // Get the text after the last match, if any.
    if(startIndex < text.length){
        chunk = text.substring(startIndex)
        if(base){
            splitMessageV2Push(output, splitMessageV2(chunk,REGEX_SENTENCE,false), "IC")
        }else{
            splitMessageV2Push(output,chunk, "rawText")
        }
    }

    return output
}



// Unit Testing

let strA = "Test meowssage. >///< *Italics meowssage.* More text. *Meowre text! >///<* uwu"
let strA_result = splitMessageV2(strA)

console.log(strA)
console.log(strA_result)

