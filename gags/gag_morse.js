/************************************************
 * Character Maps for Morse Code Gag
 * 
 * Enraa
 ************************************************/
const morseCharMap = new Map([
    // Letters
    ['a',".-"],
    ['b',"-..."],
    ['c',"-.-."],
    ['d',"-.."],
    ['e',"."],
    ['f',"..-."],
    ['g',"--."],
    ['h',"...."],
    ['i',".."],
    ['j',".---"],
    ['k',"-.-"],
    ['l',".-.."],
    ['m',"--"],
    ['n',"-."],
    ['o',"---"],
    ['p',".--."],
    ['q',"--.-"],
    ['r',".-."],
    ['s',"..."],
    ['t',"-"],
    ['u',"..-"],
    ['v',"...-"],
    ['w',".--"],
    ['x',"-..-"],
    ['y',"-.--"],
    ['z',"--.."],

    // Numbers
    ['1',".----"],
    ['2',"..---"],
    ['3',"...--"],
    ['4',"....-"],
    ['5',"....."],
    ['6',"-...."],
    ['7',"--..."],
    ['8',"---.."],
    ['9',"----."],
    ['0',"-----"],

    // Sentence structure
    [' ',"/"], // space with /
    ['\n',"\n"],
]);

const punctuationMap = new Map([
    // Punctuation
    ['.',"."],
    ['!',"!"],
    [',',","],
    [':',":"],
    ['"','"'],
    ["'","'"],
    ['`',"`"],
])

const garbleText = (text, parent, locarr, intensity) => {
    let output = "📻 "; // radio!
    for(let i = 0; i < text.length; i++) {
        if (morseCharMap.get(text.charAt(i).toLowerCase())) {
            output = `${output}${morseCharMap.get(text.charAt(i).toLowerCase())} `
        }
    }
    return output;
}

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;
exports.choicename = "Morse Code Gag";