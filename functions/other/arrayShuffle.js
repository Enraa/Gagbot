/********
 * Perform a Durstenfeld shuffle of an array. This is an optimized Fischer-Yates. 
 * 
 * **Note: *This mutates the original array***
 * 
 * Credit to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 * - (array) arr - array to shuffle
 ********/
function arrayShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr; 
}

exports.arrayShuffle = arrayShuffle;