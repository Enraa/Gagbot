/**************************************************
 * Bweh % is FLATBWEH + intensity(1-10) * MODBWEH 
 **************************************************/
const FLATBWEH = 0.15
const MODBWEH = 0.05

const garbleText = (text, intensity) => {
    let sentenceregex = /[^\n.?!;:]+([\n.?!;:]|$)/g // Find all sentences!
    // Honestly, I may just need to have Doll check this, I'm not confident in the results...
    // > DOLL-14: Regex has been checked.
    let allsentences = text.match(sentenceregex);
    if (allsentences == null) {
        allsentences = [text]; // Regex couldnt match a sentence, just assume the entire part is a bweh.
    }

    let outtext = ''
    for (let t = 0; t < allsentences.length; t++) {

        let words = allsentences[t].split(/\s/)
        let didBweh = false;
        for(let itr = 0; itr < words.length; itr++){
            didBweh = false;
            let allCaps = !(/[a-z]/).test(words[itr]) && (/[B-HJ-Z]/).test(words[itr]);
            if(words[itr] == ""){
                //outtext += " "
            }
            // Bweh based on intensity, up to 45% bweh uptime.
            else if (Math.random() < ((intensity * MODBWEH)) + FLATBWEH) {
                let bwehLen = 0;
                // Iterate on the word to dynamically BWEH
                for(let wordIndex = 0; wordIndex < words[itr].length; wordIndex++){
                    // If a letter, we use it
                    // If NOT a letter, we finish current bweh.
                    if(!(/[^a-zA-Z0-9]/).test(words[itr][wordIndex])){

                        let upperCase = (/[A-Z]/).test(words[itr][wordIndex]) || allCaps;

                        switch(bwehLen){
                            case 0:
                                outtext += upperCase ? "B" : "b";
                                didBweh = true;
                                break;
                            case 1:
                                outtext += upperCase ? "W" : "w";
                                break;
                            default:
                                let nextChar = ""
                                if(wordIndex == words[itr].length -1 && bwehLen > 2){nextChar = "h"}
                                else{nextChar = "e"}
                                outtext += upperCase ? nextChar.toUpperCase() : nextChar;
                                break;
                        }
                        bwehLen++
                    }else{
                        if(bwehLen > 0){
                            switch(bwehLen){
                                case 1:
                                    outtext += allCaps ? "WE" : "we"
                                    break;
                                case 2:
                                    outtext += allCaps ? "E" : "e"
                                    break;
                                default:
                                    break;
                            }
                            outtext += allCaps ? "H" : "h"
                        }
                        bwehLen = 0;
                        outtext += words[itr][wordIndex]
                    }
                    // FINISH INSUFFICIENT BWEH
                    if(wordIndex == words[itr].length - 1){
                        switch(bwehLen){
                            case 0:
                                break;
                            case 1:
                                outtext += "weh"
                                break;
                            case 2:
                                outtext += "eh"
                                break;
                            case 3:
                                outtext+= "h"
                                break;
                            default:
                                break;
                        }
                    }
                }
            // Just output the word
            }else{
                outtext += words[itr]
            }

            //  Space if not last word
            if(itr <  words.length -1 ){
                outtext += " "
            }
        }

        // 15-45% chance to add a ~ at the end of the sentence!
        if (didBweh && Math.random() < ((intensity * MODBWEH)) + FLATBWEH) {
            outtext = `${outtext}~`
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Bweh Gag"





/****************************************
 * Unit Tests
 * Comment out this entire section before putting into live.
 * I am losing my mind reading bweh over and over.
 ***************************************/
// let intensityTestMsg1   = "The quick brown fox jumps over the lazy dog."    // Classic pangram to test all letters.
// let intensityTestMsg2   = "HELP ME! This crazy doll is trying to turn me into one too!"
// let intensityTestMsg3   = "This unit is a good doll, and   will wear all possible tape gags for its Adminstrator."
// let intensityTestMsg4   = "Ha! I, in my brattiness, I created test-4, a test. . .  just to anger DOLL-0014 into domming me!!"

// console.log(`Original:          ${intensityTestMsg1}`)
// console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg1, 2)}`)
// console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg1, 4)}`)
// console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg1, 6)}`)
// console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg1, 8)}`)
// console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg1, 10)}`)

// console.log(`\nOriginal:          ${intensityTestMsg2}`)
// console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg2, 2)}`)
// console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg2, 4)}`)
// console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg2, 6)}`)
// console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg2, 8)}`)
// console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg2, 10)}`)

// console.log(`\nOriginal:          ${intensityTestMsg3}`)
// console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg3, 2)}`)
// console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg3, 4)}`)
// console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg3, 6)}`)
// console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg3, 8)}`)
// console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg3, 10)}`)

// console.log(`\nOriginal:          ${intensityTestMsg4}`)
// console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg4, 2)}`)
// console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg4, 4)}`)
// console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg4, 6)}`)
// console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg4, 8)}`)
// console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg4, 10)}`)