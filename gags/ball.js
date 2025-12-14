/***************************
 * High-Security Ball Gag for Gagbot
 * ~ DollLia
 ***************************/

// Character maps stored in an array in a separate file for code cleanliness
const {ballGagCharMaps} = require('./ball/ballCharMap.js')

// Helper function to garble a text segment.
const garbleText = (text, intensity) => {

    //console.log("Text Seg: " + text)

    let output = "";

    let itr = 0;

    // // Optional feature to handle escaping italicized text.
    // let escapedText = false;
    // let escapeChar = '*';       // Do NOT have an escapeChar in the character map above.

    for (const char of text){

        // Handle italicized text by toggling the escape on each instance of the escape character.
        // if(char == escapeChar){escapedText = !escapedText;}

        // Test for uppercase.
        let isUppercase = (char != char.toLowerCase())

        // Get the new character using the array of character maps.
        // 10 intensities, only five maps.
        let newChar = ballGagCharMaps[intensity / 2 - 1].get(char.toLowerCase());

        // Edit the text if we are not escaped 
        if(newChar){ //(!escapedText && newChar){
            // Append the character with correct case. Only capitalize the first letter. (Ex: "I" becomes "Hm".)
            output += isUppercase ? newChar[0].toUpperCase() + ( newChar[1] ? newChar[1] : "") : newChar;
        }
        else{
            // Append an unmodified character.
            output += char;
        }
        itr++;
    }

    return output
}



exports.garbleText = garbleText;
exports.choicename = "High-Security Ball Gag"




// Unit Tests

// Test 1 - Basic RP Message
// let testMsg = "*Opens her mouth.* I love being gagged! *Twirls happily.* It's so much fun~ meow.com"
// console.log("Unit Test 1 - Basic RP Message:")
// console.log("Original: " + testMsg)
// console.log("Garbled:  " + garbleText(testMsg))

// // Test 2 - Handling BOLDED Text, inside italics, plus random website URLs stapled in.
// let testMsg2 = "Meow meow, I'm a cat! https://stackoverflow.com/questions  *She turns you into a https://stackoverflow.com/questions scratching post with her **CLAWS.*** Nyaaa~"
// console.log("\nUnit Test 2 - Bold Inside & Outside Italics:")
// console.log("Original: " + testMsg2)
// console.log("Garbled:  " + garbleText(testMsg2))

// console.log("\nUnit Test 3 - DollLia is in agony:")
// let testMsg3 = "Do I get to leave my chastity belt now?\nPlease please, http://meow.com PLEASE! *She squirms in agony.*  I CAN'T TAKE IT ANYMORE- *Also https://www.meow.com is a fake website I just came up with.*"
// console.log("Original: " + testMsg3)
// console.log("Garbled:  " + garbleText(testMsg3))

// console.log("\nUnit Test 4 - DollLia made a silly mistake:")
// let testMsg4 = "Meow"
// console.log("Original: " + testMsg4)
// console.log("Garbled:  " + garbleText(testMsg4))


// Test Gag Intensities
let intensityTestMsg = "This unit is a good doll, and will wear all possible ball gags for Mistress."
let intensityTestMsg2 = "The quick brown fox jumped over the lazy dog."

console.log(`Original:     ${intensityTestMsg}\n`)
console.log(`Intensity 1-2:   ${garbleText(intensityTestMsg, 2)}`)
console.log(`Intensity 3-4:   ${garbleText(intensityTestMsg, 4)}`)
console.log(`Intensity 5-6:   ${garbleText(intensityTestMsg, 6)}`)
console.log(`Intensity 7-8:   ${garbleText(intensityTestMsg, 8)}`)
console.log(`Intensity 9-10:  ${garbleText(intensityTestMsg, 10)}`)

console.log(`\nOriginal:     ${intensityTestMsg2}\n`)
console.log(`Intensity 1-2:   ${garbleText(intensityTestMsg2, 2)}`)
console.log(`Intensity 3-4:   ${garbleText(intensityTestMsg2, 4)}`)
console.log(`Intensity 5-6:   ${garbleText(intensityTestMsg2, 6)}`)
console.log(`Intensity 7-8:   ${garbleText(intensityTestMsg2, 8)}`)
console.log(`Intensity 9-10:  ${garbleText(intensityTestMsg2, 10)}`)