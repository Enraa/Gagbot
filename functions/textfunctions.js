const { convertPronounsText } = require("./pronounfunctions.js");

const texts_chastity = {
    heavy: {
        chastity: [
            `USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR chastity belt, but it's futile!`
        ],
        nochastity: [
            `USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a chastity belt, but can't!`
        ]
    },
    noheavy: {
        chastity: {
            key_other: [
                `You are already locked in a chastity belt and TARGET_TAG has the key!`
            ],
            key_self: [
                `You are already locked in a chastity belt and you're holding the key!`
            ]
        },
        nochastity: {
            key_other: [
                `USER_TAG slips into a chastity belt, slipping on a tiny lock, and then hands TARGET_TAG the key!`
            ],
            key_self: [
                `USER_TAG puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`
            ]
        }
    }
}

const texts_collar = {
    heavy: {
        collar: [
            `USER_TAG crinks USER_THEIR neck, trying to adjust USER_THEIR collar, but USER_THEIR VAR_C1 makes it impossible to adjust!`
        ],
        nocollar: [
            `USER_TAG shifts USER_THEIR cheek on a collar, yearning to put it on, but USER_THEIR VAR_C1 makes it incredibly difficult to put on!`
        ]
    },
    noheavy: {
        alreadycollared: [
            `You already have a collar on!`
        ],
        key_other: [
            `USER_TAG puts a collar on USER_THEIR neck, clicking a little lock in the lockable buckle and then hands TARGET_TAG the key!`
        ],
        key_self: [
            `USER_TAG puts a collar on USER_THEIR neck, clicking a little lock in the lockable buckle and then hiding the key!`
        ],
        unlocked: [
            `USER_TAG puts a collar on USER_THEIR neck, but neglects to lock it!`
        ]
    }
}

const texts_collarequip = {
    heavy: [
        `USER_TAG tugs against USER_THEIR VAR_C1, trying to get USER_THEIR hands on TARGET_TAG's collar, but USER_THEY can't reach it!`
    ],
    noheavy: {
        tryingself: [
            `You can't do anything with your own collar!\n-# Don't be cheeky.`
        ],
        collar: {
            key: {
                mitten: {
                    alreadyworn: [
                        `TARGET_TAG is already wearing mittens!`
                    ],
                    allowed: [
                        `USER_TAG grabs TARGET_TAG's hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away TARGET_THEIR hands!`
                    ],
                    notallowed: [
                        `TARGET_TAG's collar does not allow you to mitten TARGET_THEM!`
                    ]
                },
                heavybondage: {
                    alreadyworn: [
                        `TARGET_TAG is already in bondage, wearing a VAR_C2!`
                    ],
                    allowed: [
                        `USER_TAG pulls a VAR_C3 out and grabs TARGET_TAG, forcing TARGET_THEIR arms and hands into the tight restraint! TARGET_THEY_CAP squirmTARGET_S in protest, but TARGET_THEY can't do anything about it!`
                    ],
                    notallowed: [
                        `TARGET_TAG's collar does not allow you to put TARGET_THEM in heavy bondage!`
                    ]
                },
                chastity: {
                    alreadyworn: [
                        `TARGET_TAG is already in a chastity belt, with keys held by VAR_C4!`
                    ],
                    allowed: {
                        key_self: [
                            `USER_TAG grabs TARGET_TAG and wraps a chastity belt around TARGET_THEIR waist and clicking the lock shut before TARGET_THEY can even react!`
                        ],
                        key_other: [
                            `USER_TAG grabs TARGET_TAG and wraps a chastity belt around TARGET_THEIR waist before clicking the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`
                        ]
                    },
                    notallowed: [
                        `TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`
                    ]
                } 
            },
            nokey: [
                `You don't have the key to TARGET_TAG's collar!`
            ]
        },
        nocollar: [
            `TARGET_TAG is not wearing a collar!`
        ]
    }
}

const texts_corset = {
    heavy: {
        self: {
            chastity: [
                `USER_TAG nudges a corset with USER_THEIR knee, but USER_THEIR VAR_C1 prevents USER_THEM from even trying to get the corset around USER_THEIR waist, to say nothing of USER_THEIR chastity belt in the way!`
            ],
            nochastity: [
                `USER_TAG looks at a corset, but USER_THEY USER_ISARE is still tightly bound in a VAR_C1 and can't effectively hold the laces!`
            ]
        },
        other: {
            chastity: [
                `USER_TAG brushes a corset with USER_THEIR chin towards TARGET_TAG but USER_THEY can't put it on TARGET_THEM because bound arms and unyielding steel chastity belts make it hard to manipulate corsets!`
            ],
            nochastity: [
                `USER_TAG bumps into a corset with USER_THEIR hip. Sadly, because hips don't have fingers, TARGET_TAG cannot be corseted! If only USER_THEY USER_WERENT in an unyielding VAR_C1, USER_THEY might be able to bind TARGET_THEM`
            ]
        }
    },
    noheavy: {
        chastity: {
            key: {
                fumble: {
                    discard: {
                        self: {
                            corset: [
                                `USER_TAG tries to unlock USER_THEIR belt to adjust the corset but fumbles with the key so much with the key that they drop it somewhere so USER_THEY will remain just as out of breath as before!`
                            ],
                            nocorset: [
                                `USER_TAG tries to unlock USER_THEIR belt to put on a corset but fumbles with the key so much with the key that they drop it somewhere! Hopefully USER_THEY can find it soon!`
                            ]
                        },
                        other: {
                            corset: [
                                `USER_TAG tries to unlock TARGET_TAG's belt to adjust TARGET_THEIR corset but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so TARGET_TAG will remain just as out of breath as before!`
                            ],
                            nocorset: [
                                `USER_TAG tries to unlock TARGET_TAG's belt to put a corset on TARGET_THEM, but fumbles with the key so much that it falls on the floor somewhere! Sorry TARGET_TAG!`
                            ]
                        }
                    },
                    nodiscard: {
                        self: {
                            corset: [
                                `USER_TAG tries to unlock USER_THEIR belt to adjust the corset but fumbles with the key, so USER_THEYLL have to keep taking *short* breaths!`
                            ],
                            nocorset: [
                                `USER_TAG tries to unlock USER_THEIR belt to put on a corset but fumbles with the key so TARGET_TAG will remain without one!`
                            ]
                        },
                        other: {
                            corset: [
                                `USER_TAG tries to unlock TARGET_TAG's belt to adjust the corset but fumbles with the key so TARGET_THEY will remain just as out of breath as before!`
                            ],
                            nocorset: [
                                `USER_TAG tries to unlock TARGET_TAG's belt to put on a corset but fumbles with the key so TARGET_THEY will remain without one!`
                            ]
                        }
                    }
                },
                nofumble: {
                    self: {
                        corset: {
                            tighter: [
                                `USER_TAG unlocks USER_THEIR belt, pulling the strings on the corset even tighter! The length of the strings hanging off of the corset is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`
                            ],
                            looser: [
                                `USER_TAG unlocks USER_THEIR belt, carefully loosening the strings on the corset, taking a deep breath as USER_THEY can breathe! The length of the strings hanging off of the corset is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`
                            ]
                        },
                        nocorset: [
                            `USER_TAG unlocks USER_THEIR belt and then puts a corset on USER_THEMSELF, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S USER_THEMSELF back up!`
                        ]
                    },
                    other: {
                        corset: {
                            tighter: [
                                `USER_TAG unlocks TARGET_TAG's belt, pulling the strings on the corset even tighter! The length of the strings hanging off of the corset is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`
                            ],
                            looser: [
                                `USER_TAG unlocks TARGET_TAG's belt, carefully loosening the strings on the corset! The length of the strings hanging off of the corset is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`
                            ]
                        },
                        nocorset: [
                            `USER_TAG unlocks TARGET_TAG's belt and then puts a corset on TARGET_THEM, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S TARGET_THEM back up!`
                        ]
                    }
                }
            },
            nokey: {
                self: {
                    corset: [
                        `USER_TAG tugs at USER_THEIR corset, but since USER_THEY can't unlock USER_THEIR chastity belt, USER_THEY will have to tolerate the lightheadedness!`
                    ],
                    nocorset: [
                        `USER_TAG dances USER_THEIR fingers on USER_THEIR belt while eying a corset, but USER_THEY won't be able to put it on because USER_THEY can't unlock USER_THEIR chastity belt!`
                    ]
                },
                other: [
                    `You do not have the key for TARGET_TAG's chastity belt!`
                ]
            }
        },
        nochastity: {
            self: {
                corset: {
                    tighten: [
                        `USER_TAG grabs the strings on USER_THEIR corset, pulling them even tighter! The length of the strings hanging off of the corset is now at VAR_C2! USER_THEIR_CAP breaths become shallower.`
                    ],
                    loosen: [
                        `USER_TAG grabs the strings on USER_THEIR corset, carefully loosening them with a sigh of relief! The length of the strings hanging off of the corset is now at VAR_C2!`
                    ]
                },
                nocorset: [
                    `USER_TAG wraps a corset around USER_THEIR waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`
                ]
            },
            other: {
                corset: {
                    tighten: [
                        `USER_TAG grabs the strings on TARGET_TAG's corset, bracing with USER_THEIR knee, and pulling them even tighter! The length of the strings hanging off of the corset is now at VAR_C2!`
                    ],
                    loosen: [
                        `USER_TAG grabs the strings on TARGET_TAG's corset, tugging on the laces carefully to loosen them a bit! The length of the strings hanging off of the corset is now at VAR_C2!`
                    ]
                },
                nocorset: [
                    `USER_TAG wraps a corset around TARGET_TAG's waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`
                ]
            }
        }
    }
}

const texts_gag = {
    heavy: {
        self: {
            gag: [
                `USER_TAG looks at a `
            ],
            nogag: [

            ]
        },
        other: {
            gag: [

            ],
            nogag: [

            ]
        }
    }
}


const textarrays = {
    texts_chastity: texts_chastity,
    texts_collar: texts_collar,
    texts_collarequip: texts_collarequip,
    texts_corset: texts_corset,
    texts_gag: texts_gag
}


/* ----------------------------------
getText() -> Returns a full text depending on data
NOTE: data MUST be constructed in the same property
order as specified on the relevant texts string, which should
be referenced in the beginning of the data function. 
For example, to retrieve the chastity text with no heavy bondage,
chastity, held by self, you should construct the data like this:
    data: {
        textarray: "texts_chastity", // the array to retrieve from
        textdata: { interactionuser, targetuser, ...c1, c2, etc } // see convertPronounsText function

        noheavy: true,
        chastity: true,
        key_self: true
    }
These properties are constructed dynamically with a for... in loop 
and then retrieved from the array using texts_chastity["noheavy"]["chastity"]["key_self"] 
to get the particular array of texts for that condition. 

THE PROPERTY ORDER IS IMPORTANT TO ENSURE THE TEXT RETRIEVAL WORKS AS INTENDED.
-------------------------------------*/
const getText = (data) => {
    try {
        let textarray = data.textarray;
        let data_in = data.textdata;
        let props = [];
        for (k in data) {
            if ((k != "textarray") && (k != "textdata")) {
                props.push(k); // Should create the same order. 
            }
        }
        // At first I thought, a reducer might not be good performance. 
        // Then I remembered, javascript passes *objects* and *arrays* by reference.
        // This is gonna be so clever.
        let sentencearr = props.reduce((prev, curr) => {
            return prev[curr];
        }, textarrays[textarray]);
        /* so what is this thing doing? 
        It is iterating over each property and then returning the object at the named property.
        This should always end with an array AS LONG AS THE INPUT OBJECT IS CONSTRUCTED
        EXACTLY THE WAY THE TREE IS SET UP */
        if (Array.isArray(sentencearr)) {
            let outstring = sentencearr[Math.floor(Math.random() * sentencearr.length)];
            outstring = convertPronounsText(outstring, data_in);

            return outstring;
        }
        else {
            return "There was an error generating this text. No error, but the destination was not an array of strings."
        }
    }
    catch (err) {
        console.log(err)
        return "There was an error generating this text. See console error."
    }
}

exports.getText = getText;