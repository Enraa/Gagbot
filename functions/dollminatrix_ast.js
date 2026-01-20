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

const REGEX_OOC = /(?<OOC>((\-#\s+)?((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_))/g


const splitMessageV2Push = (arr, text, type) => {
    arr.push({
        "type":     type,
        "text":     text,
    })
}

const splitMessageV2 = (text, inRegex=REGEX_OOC, base=true) => {
    // RegExp have writable properties - get a fresh copy just in case of synchronization issues.
    let regex = new RegExp(inRegex.source,"g")

    let output = []

    // Split IC/OOC
    let curr, chunk
    let startIndex = 0;
    while((curr = regex.exec(text)) !== null){

        // If anything is before the match, snag it.
        if(startIndex != curr.index){
            chunk = text.substring(startIndex,curr.index)
            if(base){
                splitMessageV2Push(output,chunk, "rawText")
            }else{
                splitMessageV2Push(output,chunk, "rawText")
            }
            console.log(`Chunk: ${chunk}`)
        }

        // Get the match itself.
        splitMessageV2Push(output,curr[0], Object.keys(curr.groups)[0])
        console.log(`Match: ${curr[0]}`)
        startIndex = regex.lastIndex
    }

    // Get the rest of the text.
    if(startIndex < text.length){
        chunk = text.substring(startIndex)
        splitMessageV2Push(output,chunk, "rawText")
        console.log(`Chunk: ${chunk}`)
    }

    return output
}



// Unit Testing

let strA = "Test meowssage. *Italics meowssage.* More text. *Meowre text!*uwu"
let strA_result = splitMessageV2(strA)

console.log(strA)
console.log(strA_result)

