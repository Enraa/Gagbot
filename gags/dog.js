/***************************
 * High-Security Ball Gag for Gagbot
 * ~ DollLia
 ***************************/

// Object storing a one-to-one character mapping for lowercase only.
// > Code handles changing cases so we don't need to handle 'a' and 'A' separately here.
const highSecGagCharMap = {
    'w':"woof",
	'r':"ruff",
	'b':"bark",
	'a':"arf",
	'y':"yip",
    'm':"mghhh~"
}

const garbleText = (text, intensity) => {

    let output = "";

    // Optional feature to handle escaping italicized text.
    let escapedText = false;
    let escapeChar = '*';       // Do NOT have an escapeChar in the character map above.

    for (const char of text){

        // Handle italicized text by toggling the escape on each instance of the escape character.
        if(char == escapeChar){
			escapedText = !escapedText;
		}

        // Test for uppercase.
        let isUppercase = (char != char.toLowerCase());

        // Get the new character using the above map.
        let newChar = highSecGagCharMap[char.toLowerCase()];

        // Edit the text if we are not escaped 
        if(!escapedText && newChar && (Math.random() > (0.6 - (0.06 * intensity)))) {
            // Append the character with correct case. Only capitalize the first letter. (Ex: "I" becomes "Hm".)
            output += isUppercase ? newChar[0].toUpperCase() + ( newChar[1] ? newChar[1] : "") : newChar;
        }
        else{
            // Append an unmodified character.
            output += char;
        }
    }

    return output
}



exports.garbleText = garbleText;
exports.choicename = "Enchanted Dog Gag"