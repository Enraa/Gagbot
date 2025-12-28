const garbleText = (text, intensity) => {
    let sentenceregex = /[^\s\n.?!;:][^\n.?!;:]+[\n.?!;:]+/g // Find all sentences!
    // Honestly, I may just need to have Doll check this, I'm not confident in the results...
    let allsentences = text.match(sentenceregex);
    console.log(allsentences)
    if (allsentences == null) {
        allsentences = [text]; // Regex couldnt match a sentence, just assume the entire part is a bweh.
    }

    let outtext = ''
    for (let t = 0; t < allsentences.length; t++) {
        if (allsentences[t].charAt(0) == " ") {
            outtext = `${outtext} ` // Add initial space between sentences of bweh!~
            allsentences[t] = allsentences[t].slice(1)
        }
        for (let i = 0; i < allsentences[t].length; i++) {
            // If the character is punctuation, use that instead. 
            if ((/[.?!]/).test(allsentences[t].charAt[i])) {
                outtext = `${outtext}${allsentences[t].charAt[i]}`
            }

            // Else, using tightness, lets determine whether to garble!
            // 60-100% chance to garble a letter
            if (Math.random() < ((intensity * 0.04)) + 0.6) {
                let chartoreplacewith = "e"
                if (i == 0) { chartoreplacewith = "b" }
                if (i == 1) { chartoreplacewith = "w" }
                if (i == (allsentences[t].length - 1)) { 
                    chartoreplacewith = "h" 
                } // should be last char in a sentence!
                if (allsentences[t].charAt([i]) === allsentences[t].charAt([i]).toUpperCase()) {
                    chartoreplacewith = chartoreplacewith.toUpperCase();
                }
                outtext = `${outtext}${chartoreplacewith}`
            }

            /*if (!(/[hH.?!]/).test(allsentences[t].charAt[i])) {
                outtext = `${outtext.slice(0, -1)}h` // Just in case the match did not make an h or punctuation!
            }*/
        }
        // 10-40% chance to add a ~ at the end of the sentence!
        if (Math.random() < ((intensity * 0.03)) + 0.1) {
            outtext = `${outtext}~`
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Bweh Gag"





// Unit Tests

//Test Gag Intensities
let intensityTestMsg1   = "The quick brown fox jumps over the lazy dog."    // Classic pangram to test all letters.
let intensityTestMsg2   = "HELP ME! This crazy doll is trying to turn me into one too!"
let intensityTestMsg3   = "This unit is a good doll, and   will wear all possible tape gags for its Adminstrator."
let intensityTestMsg4   = "Ha! I, in my brattiness, created  test-4, a test. . .  just to anger DOLL-0014 into domming me!!"

console.log(`Original:          ${intensityTestMsg1}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg1, 1)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg1, 3)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg1, 5)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg1, 7)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg1, 9)}`)

console.log(`\nOriginal:          ${intensityTestMsg2}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg2, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg2, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg2, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg2, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg2, 10)}`)

console.log(`\nOriginal:          ${intensityTestMsg3}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg3, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg3, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg3, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg3, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg3, 10)}`)

console.log(`\nOriginal:          ${intensityTestMsg4}`)
console.log(`Intensity 1-2:     ${garbleText(intensityTestMsg4, 2)}`)
console.log(`Intensity 3-4:     ${garbleText(intensityTestMsg4, 4)}`)
console.log(`Intensity 5-6:     ${garbleText(intensityTestMsg4, 6)}`)
console.log(`Intensity 7-8:     ${garbleText(intensityTestMsg4, 8)}`)
console.log(`Intensity 9-10:    ${garbleText(intensityTestMsg4, 10)}`)