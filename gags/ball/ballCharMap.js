/************************************************
 * Character Maps for Ball Gag Intensity Slider *
 * 
 * ~DOLL-14
 ************************************************/

// Is this even a ball gag?
const ballCharMap_Intensity1 = new Map([
    ['a',"ah"],
    ['b',"b"],
    ['c',"g"],
    ['d',"d"],
    ['e',"eh"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"ih"],       // Unique two-char case
    ['j',"j"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"ch"],
    ['r',"r"],
    ['s',"s"],
    ['t',"t"],
    ['u',"uh"],
    ['v',"v"],
    ['w',"w"],
    ['x',"sh"],
    ['y',"h"],
    ['z',"z"],
]);

// Someone didn't pull the strap tight enough.
const ballCharMap_Intensity2 = new Map([
    ['a',"ah"],
    ['b',"b"],
    ['c',"g"],
    ['d',"d"],
    ['e',"m"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"hm"],       // Unique two-char case
    ['j',"j"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"ch"],
    ['r',"r"],
    ['s',"s"],
    ['t',"t"],
    ['u',"h"],
    ['v',"v"],
    ['w',"w"],
    ['x',"sh"],
    ['y',"h"],
    ['z',"sh"],
]);


// Default! Somewhat intelligible.
const ballCharMap_Intensity3 = new Map([
    ['a',"h"],
    ['b',"b"],
    ['c',"g"],
    ['d',"d"],
    ['e',"m"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"hm"],       // Unique two-char case
    ['j',"j"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"g"],
    ['r',"r"],
    ['s',"s"],
    ['t',"t"],
    ['u',"h"],
    ['v',"v"],
    ['w',"w"],
    ['x',"ph"],
    ['y',"h"],
    ['z',"sh"],
]);

// Try speaking up, please?~
// The original version before intensity changes.
const ballCharMap_Intensity4 = new Map([
    ['a',"h"],
    ['b',"b"],
    ['c',"g"],
    ['d',"d"],
    ['e',"m"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"hm"],       // Unique two-char case
    ['j',"j"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"g"],
    ['r',"r"],
    ['s',"f"],
    ['t',"t"],
    ['u',"h"],
    ['v',"v"],
    ['w',"w"],
    ['x',"ph"],
    ['y',"h"],
    ['z',"m"],
]);

// Yeah, no.  I can't.
// Mmmph, mmhfgh, mnnnh!!  MMGHHH!!
// Limit to m, n, h, f, g, h, p
const ballCharMap_Intensity5 = new Map([
    ['a',"h"],
    ['b',"m"],
    ['c',"g"],
    ['d',"d"],
    ['e',"m"],
    ['f',"f"],
    ['g',"g"],
    ['h',"h"],
    ['i',"hm"],       // Unique two-char case
    ['j',"g"],
    ['k',"g"],
    ['l',"l"],
    ['m',"m"],
    ['n',"n"],
    ['o',"h"],
    ['p',"p"],
    ['q',"g"],
    ['r',"r"],
    ['s',"f"],
    ['t',"t"],
    ['u',"h"],
    ['v',"f"],
    ['w',"h"],
    ['x',"m"],
    ['y',"h"],
    ['z',"m"],
]);

const ballGagCharMaps = [ballCharMap_Intensity1, ballCharMap_Intensity2, ballCharMap_Intensity3, ballCharMap_Intensity4, ballCharMap_Intensity5];

// Export the array for use in other functions.
exports.ballGagCharMaps = ballGagCharMaps;