/********* 
 * This gag is intended to perform a Vigenère cipher on the input garble text. 
 * 
 * I MADE THIS IN BITBURNER, WHY AM I BRINGING IT HERE :dead:
 * 
 * - Enraa
 *********/
const vigenerekey = "GAGBOT" // This will always be the key for now. 

const garbleText = (text, parent, intensity) => {
    const alphabet = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`

    let vigpos = 0;
    
    let outtext = ``
    for(let i = 0; i < text.length; i++) {
        // Find the string offset of the current vigenere key!
        let vshift = alphabet.indexOf(vigenerekey.charAt(vigpos % (vigenerekey.length))) // Using a modulo to loop over the key

        // Since characters lie in order, we can simply get the char code at the text
        let charcode = text.charCodeAt(i)

        // Upper case
        if ((charcode >= 65) && (charcode <= 90)) {
            charcode = charcode + vshift;

            // If we exceeded 90, then simply subtract the number by 26
            if (charcode > 90) { charcode = (charcode - 26) }
            outtext = `${outtext}${String.fromCharCode(charcode)}`
            vigpos++;
            continue;
        }
        // Lower case
        if ((charcode >= 97) && (charcode <= 122)) {
            charcode = charcode + vshift;

            // If we exceeded 122, then simply subtract the number by 26
            if (charcode > 122) { charcode = (charcode - 26) }
            outtext = `${outtext}${String.fromCharCode(charcode)}`
            vigpos++;
            continue;
        }
        // Anything else
        outtext = `${outtext}${text[i]}`
    }
    console.log(outtext)
}

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;
exports.choicename = "Vigenère Cipher Gag";