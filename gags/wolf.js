/***************************
 * High-Security Ball Gag for Gagbot
 * ~ Punyo
 ***************************/

// Object storing a one-to-one character mapping for lowercase only.
// > Code handles changing cases so we don't need to handle 'a' and 'A' separately here.
const highSecGagCharMap = {
    'w':"woof",
	'a':"awoo",
	'g':"grrrr-",
	'm':"m-mmmhh!",
    'e':"eep!",
    'y':"yelp",


}

const garbleText = (text, intesity) => {

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
        if(!escapedText && newChar && (Math.random() > (0.9 - (0.08 * intesity)))){
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
exports.choicename = "Enchanted Wolf Gag"