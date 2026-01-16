/************************************************
 * Character Maps for L337 Gag Intensity Slider *
 * 
 * Pyra~
 ************************************************/

// Numerical Substitutions Only (1-2 Intensity)
const leetCharMap_Intensity1 = new Map([
    ['a', "4"],
    ['b', "8"],
    ['e', "3"],
    ['g', "6"],
    ['i', "1"],
    ['o', "0"],
    ['p', "9"],
    ['s', "5"],
    ['t', "7"],
    ['z', "2"],
]);

// Numerical and Simple Symbol Substitutions (3-4 Intensity)
const leetCharMap_Intensity2 = new Map([
    ['a', "4"],
    ['b', "8"],
    ['c', "("],
    ['e', "3"],
    ['f', "ƒ"],
    ['g', "6"],
    ['i', "1"],
    ['j', "]"],
    ['o', "0"],
    ['p', "9"],
    ['q', "&"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['y', "¥"],
    ['z', "2"],
]);

// Numerical and Moderate Symbol Substitutions (5-6 Intensity)
const leetCharMap_Intensity3 = new Map([
    ['a', "4"],
    ['b', "8"],
    ['c', "("],
    ['e', "3"],
    ['f', "ƒ"],
    ['g', "6"],
    ['i', "1"],
    ['j', "]"],
    ['l', "["],
    ['o', "0"],
    ['p', "9"],
    ['q', "&"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['y', "¥"],
    ['z', "2"],
]);

// Numerical and Complex Symbol Substitutions (7-8 Intensity)
const leetCharMap_Intensity4 = new Map([
    ['a', "4"],
    ['b', "8"],
    ['c', "("],
    ['e', "3"],
    ['f', "ƒ"],
    ['g', "6"],
    ['h', "#"],
    ['i', "1"],
    ['j', "]"],
    ['l', "["],
    ['o', "0"],
    ['p', "9"],
    ['q', "&"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['y', "¥"],
    ['z', "2"],
]);

// All Single Symbol Substitutions (9-10 Intensity)
const leetCharMap_Intensity5 = new Map([
    ['a', "4"],
    ['b', "8"],
    ['c', "("],
    ['e', "3"],
    ['f', "ƒ"],
    ['g', "6"],
    ['h', "#"],
    ['i', "1"],
    ['j', "]"],
    ['l', "["],
    ['n', "π"],
    ['o', "0"],
    ['p', "9"],
    ['q', "&"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['y', "¥"],
    ['z', "2"],
]);

/*/
// Multiple Character Substitutions
const leetCharMap_IntensityN = new Map([
    ['a', "4"],
    ['b', "!3"],
    ['c', "("],
    ['d', "|)"],
    ['e', "3"],
    ['g', "6"],
    ['h', "#"],
    ['i', "1"],
    ['j', "]"],
    ['k', "|<"],
    ['m', "^^"],
    ['n', "^"],
    ['o', "0"],
    ['p', "|*"],
    ['q', "&"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['w', "VV"],
    ['x', "><"],
    ['y', "¥"],
    ['z', "2"],
]);

// Maximum Leet Speak Substitutions
const leetCharMap_IntensityNmax = new Map([
    ['a', "4"],
    ['b', "!3"],
    ['c', "("],
    ['d', "|)"],
    ['e', "3"],
    ['f', "|="],
    ['g', "6"],
    ['h', "#"],
    ['i', "1"],
    ['j', "]"],
    ['k', "|<"],
    ['l', "|_"],
    ['m', "^^"],
    ['n', "^"],
    ['o', "0"],
    ['p', "|*"],
    ['q', "&"],
    ['r', "I2"],
    ['s', "5"],
    ['t', "7"],
    ['u', "บ"],
    ['v', "|/"],
    ['w', "VV"],
    ['x', "><"],
    ['y', "¥"],
    ['z', "2"],
]);
//*/

const leetGagCharMaps = [leetCharMap_Intensity1, leetCharMap_Intensity2, leetCharMap_Intensity3, leetCharMap_Intensity4, leetCharMap_Intensity5];

// Export the array for use in other functions.
exports.leetGagCharMaps = leetGagCharMaps;