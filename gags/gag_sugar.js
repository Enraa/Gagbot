/******
 * This gag removes all spaces from the wearer's words. Nothing more, nothing less. 
 * 
 ******/
const garbleText = (text, parent, intensity) => {
    let output = ""; // radio!
    for(let i = 0; i < text.length; i++) {
        if (text.charAt(i) != " ") {
            output = `${output}${text.charAt(i)}`
        }
    }
    return output;
}

exports.garbleText = garbleText;
exports.breathRecovery = (_user, intensity) => 1 - intensity / 20;
exports.choicename = "Sugar Rush Gag";
exports.tags = ["drug"]