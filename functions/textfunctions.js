const { convertPronounsText } = require("./pronounfunctions.js");

const texts_chastity = {
    chastitybelt: {
        heavy: {
            chastity: [
                `USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`
            ],
            nochastity: [
                `USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`
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
                namedchastity: {
                    key_other: [
                        `USER_TAG slips into a VAR_C2, slipping on a tiny lock, and then hands TARGET_TAG the key!`
                    ],
                    key_self: [
                        `USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`
                    ]
                },
                nonamedchastity: {
                    key_other: [
                        `USER_TAG slips into a VAR_C2, slipping on a tiny lock, and then hands TARGET_TAG the key!`
                    ],
                    key_self: [
                        `USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`
                    ]
                },
            }
        }
    },
    chastitybra: {
        heavy: {
            chastity: [
                `USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`
            ],
            nochastity: [
                `USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`
            ]
        },
        noheavy: {
            chastity: {
                key_other: [
                    `You are already locked in a chastity bra and TARGET_TAG has the key!`
                ],
                key_self: [
                    `You are already locked in a chastity bra and you're holding the key!`
                ]
            },
            nochastity: {
                namedchastity: {
                    key_other: [
                        `USER_TAG slips a VAR_C2 on, also putting on a tiny lock, and then hands TARGET_TAG the key!`
                    ],
                    key_self: [
                        `USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`
                    ]
                },
                nonamedchastity: {
                    key_other: [
                        `USER_TAG slips a VAR_C2 on, also putting on a tiny lock, and then hands TARGET_TAG the key!`
                    ],
                    key_self: [
                        `USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`
                    ]
                },
            }
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
        self: {
            nofreeuse: {
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key.`
                ],
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key.`
                ],
            },
            freeuse: {
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key. A little tag hangs off the collar with "Free Use!" written on it!`
                ],
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key. A little tag hangs off the collar with "Free Use!" written on it!`
                ],
            }
        },
        other: {
            nofreeuse: {
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`
                ],
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`
                ],
            },
            freeuse: {
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`
                ],
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`
                ],
            }
        },
        alreadycollared: [
            `You already have a collar on!`
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
                    namedmitten: {
                        alreadyworn: [
                            `TARGET_TAG's hands are already occupied by a pair of VAR_C3!`
                        ],
                        allowed: [
                            `USER_TAG grabs TARGET_TAG's hands, shoving a set of VAR_C3 on them! TARGET_THEY_CAP won't be able to use TARGET_THEIR hands!`
                        ],
                        notallowed: [
                            `TARGET_TAG's collar does not allow you to mitten TARGET_THEM!`
                        ]
                    },
                    nonamedmitten: {
                        alreadyworn: [
                            `TARGET_TAG is already wearing mittens!`
                        ],
                        allowed: [
                            `USER_TAG grabs TARGET_TAG's hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away TARGET_THEIR hands!`
                        ],
                        notallowed: [
                            `TARGET_TAG's collar does not allow you to mitten TARGET_THEM!`
                        ]
                    }
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
                    chastitybelt: {
                        namedchastity: {
                            alreadyworn: [
                                `TARGET_TAG is already in a chastity belt, with keys held by VAR_C4!`
                            ],
                            allowed: {
                                key_self: [
                                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR waist and clicking the lock shut before TARGET_THEY can even react!`
                                ],
                                key_other: [
                                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR waist before clicking the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`
                                ]
                            }
                        },
                        nonamedchastity: {
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
                        },
                        notallowed: [
                            `TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`
                        ]
                    },
                    chastitybra: {
                        namedchastity: {
                            alreadyworn: [
                                `TARGET_TAG is already in a chastity bra, with keys held by VAR_C4!`
                            ],
                            allowed: {
                                key_self: [
                                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR chest and clicks the lock shut before TARGET_THEY can even react!`
                                ],
                                key_other: [
                                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR chest and clicks the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`
                                ]
                            }
                        },
                        nonamedchastity: {
                            alreadyworn: [
                                `TARGET_TAG is already in a chastity bra, with keys held by VAR_C4!`
                            ],
                            allowed: {
                                key_self: [
                                    `USER_TAG grabs TARGET_TAG and wraps a chastity bra around TARGET_THEIR chest and clicks the lock shut before TARGET_THEY can even react!`
                                ],
                                key_other: [
                                    `USER_TAG grabs TARGET_TAG and wraps a chastity bra around TARGET_THEIR chest and clicks the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`
                                ]
                            },
                            notallowed: [
                                `TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`
                            ]
                        },
                        notallowed: [
                            `TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`
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
                                `USER_TAG tries to unlock USER_THEIR belt to adjust the corset but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so USER_THEY will remain just as out of breath as before!`
                            ],
                            nocorset: [
                                `USER_TAG tries to unlock USER_THEIR belt to put on a corset but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! Hopefully USER_THEY can find it soon!`
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
                `USER_TAG looks at a VAR_C4, attempting to spit out USER_THEIR VAR_C3 and change it, but the straps hold firm! Maybe if USER_THEY had fingers USER_THEY could change USER_THEIR gag!`

            ],
            nogag: [
                `USER_TAG squirms a bit, but USER_THEIR arms are trapped! Someone should help USER_THEM with putting a VAR_C3 on!`
            ]
        },
        other: {
            gag: [
                `USER_TAG uses USER_THEIR toes to pick up a VAR_C3 by the straps and put it on TARGET_TAG, but without arms, USER_THEY can't undo TARGET_THEIR VAR_C4 to switch it out!`
            ],
            nogag: [
                `USER_TAG flops over a table to pick up a VAR_C3 and take it over to TARGET_TAG and put it on TARGET_THEM, but USER_THEY lackUSER_S arms and fingers to work with the straps!`
            ]
        }
    },
    noheavy: {
        mitten: {
            other: {
                gag: [
                    `USER_TAG attempts to change TARGET_TAG's gag from the VAR_C4, but fumbles at holding the VAR_C3 in USER_THEIR mittens!`
                ],
                nogag: [
                    `USER_TAG attempts to gag TARGET_TAG, but fumbles at holding the VAR_C3 in USER_THEIR mittens!`
                ]
            },
            self: [
                `USER_TAG uses both of USER_THEIR mittens to pick up a VAR_C3, but can't secure the straps behind USER_THEIR head anyway.`
            ]
        },
        nomitten: {
            self: {
                gag: [
                    `USER_TAG carefully undoes the straps on USER_THEIR VAR_C4, allowing just a moment to let the drool fall out before replacing it with a VAR_C3, pulling the straps on it VAR_C2 before buckling.`
                ],
                nogag: [
                    `USER_TAG picks up a VAR_C3, takes a deep breath, and then pushes it between USER_THEIR teeth and pulling the straps VAR_C2 behind USER_THEIR head.`
                ]
            },
            other: {
                gag: [
                    `USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
                ],
                nogag: {
                    gentle: [
                        `USER_TAG uses a finger to gently pry open TARGET_TAG's lips before inserting a VAR_C3 between TARGET_THEIR teeth, secured VAR_C2 behind TARGET_THEIR head. A muted meep follows soon after from TARGET_THEM!`,
                    ],
                    forceful: [
                        `USER_TAG takes a VAR_C3 out and brushes the hair out of TARGET_TAG's face, before pinching TARGET_THEIR nose for a moment and shoving the gag between TARGET_THEIR teeth when TARGET_THEY goTARGET_ES to breathe! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled shut!`,
                        `USER_TAG holds up a VAR_C3, pressing it against TARGET_TAG's lips with ever increasing force until they part, taking away TARGET_THEIR ability to speak coherently! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled under TARGET_THEIR hair!`,
                    ],
                    requesting: [
                        `USER_TAG taps TARGET_TAG's lips, silently suggesting to say "ahh" before pushing a VAR_C3 VAR_C2 between TARGET_THEIR lips!`
                    ]
                }
            }
        }
    }
}

// Headwear stuff
const texts_headwear = {
    heavy: {
        self: {
            // Ephemeral
            worn: [
                `You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`
            ],
            noworn: [
                `USER_TAG scoots against a VAR_C2, but USER_THEY can only move it around a couple of inches, much less lift it because of USER_THEIR VAR_C1!`
            ]
        },
        other: {
            // Ephemeral
            worn: [
                `TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`
            ],
            noworn: [
                `USER_TAG boops a VAR_C2 towards TARGET_TAG, but USER_THEY can't really put it on TARGET_THEM because of USER_THEIR VAR_C1. USER_THEY_CAP should grow arms!`
            ]
        }
    },
    noheavy: {
        mitten: {
            self: {
                worn: [
                    `You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`
                ],
                noworn: [
                    `USER_TAG fumbles with a VAR_C2, trying to put it on USER_THEIR head, but can't grip it well enough!`
                ]
            },
            other: {
                // Ephemeral
                worn: [
                    `TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`
                ],
                noworn: [
                    `USER_TAG uses both mittens and throws a VAR_C2 towards TARGET_TAG, indicating to put it on. USER_THEY_CAP can't put it on TARGET_THEM though.`
                ]
            }
        },
        nomitten: {
            self: {
                // Ephemeral
                worn: [
                    `You are already wearing a VAR_C2!`
                ],
                noworn: [
                    `USER_TAG places a VAR_C2 on USER_THEIR lovely head, securing the straps on snugly!`
                ]
            },
            other: {
                // Ephemeral
                worn: [
                    `You are already wearing a VAR_C2!`
                ],
                noworn: [
                    `USER_TAG grabs a VAR_C2 and places it gently on TARGET_TAG's head, securing the straps so it doesn't fall off.`
                ]
            }
        }
    }
} 

// Thank goodness this one is tiny lol
const texts_heavy = {
    heavy: [
        `USER_TAG writhes in USER_THEIR VAR_C1, trying to change USER_THEIR bondage, but may need some help!`
    ],
    noheavy: [
        `USER_TAG slips into a VAR_C2, rendering USER_THEIR arms and hands completely useless!`
    ]
}

const texts_key = {
    clone: {
        self: {
            collar: [
                `USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR collar key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`
            ],
            chastitybelt: [
                `USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR chastity belt key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`
            ],
            chastitybra: [
                `USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR chastity bra key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`
            ]
        },
        other: {
            collar: [
                `USER_TAG subtly puts TARGET_TAG's collar key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`
            ],
            chastitybelt: [
                `USER_TAG subtly puts TARGET_TAG's chastity belt key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`
            ],
            chastitybra: [
                `USER_TAG subtly puts TARGET_TAG's chastity bra key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`
            ]
        }
    },
    give: {
        self: {
            collar: [
                `USER_TAG gives USER_THEIR collar key to VAR_C2.`
            ],
            chastitybelt: [
                `USER_TAG gives USER_THEIR chastity belt key to VAR_C2.`
            ],
            chastitybra: [
                `USER_TAG gives USER_THEIR chastity bra key to VAR_C2.`
            ]
        },
        other: {
            collar: [
                `USER_TAG subtly gives TARGET_TAG's collar key to VAR_C2 without TARGET_THEM noticing!`
            ],
            chastitybelt: [
                `USER_TAG subtly gives TARGET_TAG's chastity belt key to VAR_C2 without TARGET_THEM noticing!`
            ],
            chastitybra: [
                `USER_TAG subtly gives TARGET_TAG's chastity bra key to VAR_C2 without TARGET_THEM noticing!`
            ]
        }
    },
    revoke: {
        isclone: {
            collar: [
                "USER_TAG magically destroys the cloned key for TARGET_TAG's collar that USER_THEY USER_WERE holding!"
            ],
            chastitybelt: [
                "USER_TAG magically destroys the cloned key for TARGET_TAG's chastity belt that USER_THEY USER_WERE holding!"
            ],
            chastitybra: [
                "USER_TAG magically destroys the cloned key for TARGET_TAG's chastity bra that USER_THEY USER_WERE holding!"
            ],
        },
        isprimary: {
            collar: [
                "USER_TAG has magically broken the cloned key for TARGET_TAG's collar that VAR_C2 was holding!"
            ],
            chastitybelt: [
                "USER_TAG has magically broken the cloned key for TARGET_TAG's chastity belt that VAR_C2 was holding!"
            ],
            chastitybra: [
                "USER_TAG has magically broken the cloned key for TARGET_TAG's chastity bra that VAR_C2 was holding!"
            ]
        }
    }
}

// This follows an inconsistent flat structure - consider reworking in the future.
const texts_letgo = {
    orgasm: [
        `USER_TAG is overwhelmed with pleasure, clenching USER_THEIR thighs in an earth-shattering orgasm!`,
        `USER_TAG convulses, finally reaching the peak and then rolls over limply, swimming in the sensation!`,
        `USER_TAG's breath seizes up as it all bursts, leaving a crumpled frame behind!`,
        `USER_TAG twitches USER_THEIR hips and thighs, finally! USER_THEY_CAP layUSER_S down, basking in the afterglow!`,
        `Like a dam bursting, USER_TAG thrashes out as USER_THEY finally reach the top!`
    ],
    chastity: [
        `USER_TAG tries to get over the edge but is denied by USER_THEIR steel prison!`,
        `USER_TAG frantically *claws* at USER_THEIR chastity belt, but it offers no sensation!`,
        `USER_TAG tries to rub the cold steel of USER_THEIR chastity belt, but USER_THEY can't feel anything!`,
        `USER_TAG squirms, trying to adjust the belt so USER_THEY can feel ***something***, but USER_THEY just can't get over the edge!`,
        `USER_TAG holds USER_THEIR breath, feverishly stroking the smooth belt USER_THEY USER_ISARE wearing, but USER_THEY just can't let go!`,
        `USER_TAG grinds on a near by object, trying to get that last little bit of sensation to let go... but USER_THEY just can't make it!`,
        `USER_TAG buckles USER_THEIR legs, panting in short breaths as USER_THEY attemptUSER_S to (and failUSER_S miserably) to get release!`
    ],
    heavy: [
        `USER_TAG shifts USER_THEIR legs to try to reach the peak! Too bad USER_THEIR VAR_C1 makes it hard to touch there!`,
        `USER_TAG bucks USER_THEIR midsection, trying to climax, but without arms, USER_THEY USER_ISARE not getting anywhere!`,
        `USER_TAG squirms helplessly in USER_THEIR VAR_C1, trying to let go! USER_THEY needUSER_S some more help from vibrators!`
    ],
    free: [
        `USER_TAG takes a deep breath and calms USER_THEIR nerves, the hot feelings *slowly* going away...`,
        `USER_TAG takes some ice and holds it to USER_THEIR crotch. The sensation is unpleasant, but effective in clearing USER_THEIR mind!`,
        `USER_TAG fans USER_THEMSELF and closes USER_THEIR eyes, taking deep breaths.`,
        `USER_TAG carefully uncorks a frigid potion and chugs it. It tastes foul, but USER_THEY feelUSER_S a little more coherent now!`
    ]
}

const texts_mitten = {
    heavy: [
        `USER_TAG nuzzles a pair of mittens, but can't put them on because of USER_THEIR VAR_C1.`
    ],
    // ephemeral
    mitten: [
        `You are already wearing mittens!`
    ],
    nomitten: {
        namedmitten: {
            gag: [
                `USER_TAG puts on a set of VAR_C2. USER_THEYLL_CAP be unable to remove USER_THEIR gag!`,
                `USER_TAG wriggles their fingers into some VAR_C2. USER_THEIR_CAP gag will be impossible to remove!`,
                `As if USER_THEY wantUSER_S to stay gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`,
            ],
            nogag: [
                `USER_TAG slips USER_THEIR hands into some VAR_C2! USER_THEYLL_CAP be unable to remove a gag if someone puts one on USER_THEM!`,
                `USER_TAG wriggles USER_THEIR fingers into some VAR_C2. Gags will be impossible to remove!`,
                `As if USER_THEY wantUSER_S to be gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`,
            ]
        },
        nonamedmitten: {
            gag: [
                `USER_TAG puts on a pair of mittens with a pair of padlocks. USER_THEYLL_CAP be unable to remove USER_THEIR gag!`,
                `USER_TAG balls up USER_THEIR fist as USER_THEY slip USER_THEIR hands into a pair of bondage mittens and secure them!`
            ],
            nogag: [
                `USER_TAG puts on a pair of mittens with a pair of padlocks. USER_THEYLL_CAP be unable to remove a gag if someone puts one on USER_THEM!`,
                `USER_TAG balls up USER_THEIR fist as USER_THEY slip USER_THEIR hands into a pair of bondage mittens and secure them!`
            ]
        }
    }
}

const texts_struggle = {
    heavy: [
        `USER_TAG squirms in USER_THEIR VAR_C1, trying to squeeze out of it but USER_THEY really didn't think about how challenging that'd be.`,
        `Despite USER_THEIR best efforts, the VAR_C1 binding USER_TAG's arms (and maybe legs) refuse to budge!`,
        `The VAR_C1 creaks loudly as USER_TAG *thrashes* in USER_THEIR bondage, trying to escape!`,
        `USER_TAG tries USER_THEIR *best* to get some leverage and escape USER_THEIR bondage, but stops just short of potentially pulling a muscle.`,
        `USER_TAG fights against USER_THEIR VAR_C1, trying to loosen it even a little bit to maybe escape...`,
        `USER_TAG fights against USER_THEIR VAR_C1, but it doesn't budge even a micrometer...`,
    ],
    gag: {
        heavy: [
            `Try as USER_THEY might, USER_TAG cannot spit out the VAR_C2 USER_THEY USER_ISARE wearing!`,
            `USER_TAG noms on USER_THEIR VAR_C2, trying to loosen it and maybe get it out of USER_THEIR mouth!`,
            `USER_TAG tries to push USER_THEIR VAR_C2 out with USER_THEIR tongue! It had no effect!`
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `USER_TAG paws at USER_THEIR VAR_C2 with USER_THEIR wrist, trying to slip it off.`,
                `USER_TAG uses the palm of USER_THEIR hand and brushes it against USER_THEIR VAR_C2`,
                `USER_TAG sighs into USER_THEIR VAR_C2, happily thinking about how nice it is to not be able to speak!`
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `USER_TAG uses the wrist straps on USER_THEIR VAR_C3 to try to hook under USER_THEIR VAR_C2, but can't really get any leverage.`,
                `USER_TAG brushes the stuffing portion of USER_THEIR VAR_C2 with USER_THEIR VAR_C3. USER_THEY_CAP look very cute.`
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG uses USER_THEIR fingers to hook into the straps on USER_THEIR VAR_C2. Unfortunately, the buckles are very solid and offer no further give.`,
                `USER_TAG runs USER_THEIR fingers all over the stuffing portion of USER_THEIR VAR_C2. So garbled. USER_THEIR_CAP words taken away. `,
                `USER_TAG dances USER_THEIR fingertips on USER_THEIR VAR_C2. USER_THEY_CAP *could* take it off, but USER_THEY USER_ISARE enjoying it right now!`
            ]
        }
    },
    mitten: {
        heavy: [
            `USER_TAG squirms in USER_THEIR VAR_C1 to get to USER_THEIR VAR_C3, but getting to USER_THEIR hands is challenging right now...`,
            `Trying to twist USER_THEIR arm in the VAR_C1 in just the right way, USER_TAG tries to get to USER_THEIR VAR_C3. Without any success, obviously.`,
            `USER_TAG tries to push USER_THEIR VAR_C3 off inside the VAR_C1, but the straps hold firm inside!`,
            `USER_TAG's attempts to get USER_THEIR VAR_C3 off are somewhat moot, considering USER_THEIR arms are still sealed away.`
        ],
        noheavy: {
            // Using only wrists or other leverage, no teeth. 50% chance with or without gag
            nomouth: [
                `USER_TAG tries to brush the back of USER_THEIR VAR_C3 with USER_THEIR cheek.`,
                `USER_TAG uses USER_THEIR chin to pinch and try to pull off the VAR_C3. The straps hold firm!`,
                `USER_TAG claps USER_THEIR hands together. USER_THEY_CAP likeUSER_S these VAR_C3. USER_THEY_CAP USER_DOESNT need hands!`
            ],
            // Using only wrists, but brushing up with gag. 50% chance with gag
            gag: [
                `USER_TAG tries to bite the straps of USER_THEIR VAR_C3 with USER_THEIR teeth- Oh wait, USER_THEY can't. USER_THEY_CAP pout in frustration!`,
                `USER_TAG brushes USER_THEIR VAR_C3 against USER_THEIR VAR_C2, but sadly, USER_THEY can't bite.`,
                `USER_TAG meeps as USER_THEY can't find a way to make USER_THEIR VAR_C3 any looser with USER_THEIR mouth because of USER_THEIR VAR_C2`
            ],
            // Using teeth to try to help take off the mittens! 50% chance without gag
            mouth: [
                `Carefully nibbling on the straps, USER_TAG tries to undo them and escape from USER_THEIR VAR_C3.`,
                `USER_TAG pinches the straps of USER_THEIR VAR_C3 with USER_THEIR teeth, but still can't get any leverage.`,
                `USER_TAG uses USER_THEIR tongue to work on the buckles holding USER_THEIR VAR_C3 in place, but can't quite undo them.`,
                `USER_TAG tries to bite USER_THEIR straps on USER_THEIR VAR_C3 to tear them apart! But the straps are made of high quality materials.`
            ]
        }
    },
    chastity: {
        heavy: [
            `USER_TAG fusses with USER_THEIR VAR_C1, trying to get free so USER_THEY can work on USER_THEIR VAR_C4, but it holds firm!`,
            `USER_TAG tries to squeeze USER_THEIR thighs together to maybe shift USER_THEIR VAR_C4, but it's hard to with USER_THEIR VAR_C1.`,
            `USER_TAG bucks with USER_THEIR hips, but despite the movement, USER_THEY cannot move USER_THEIR VAR_C4 even an inch without arms!`,
            `The VAR_C1 cruelly separates USER_TAG from touching USER_THEIR VAR_C4. What *ever* will USER_THEY do?`
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `USER_TAG runs USER_THEIR palms on USER_THEIR VAR_C4, but despite USER_THEIR best efforts, the belt remains unyielding on USER_THEIR hips.`,
                `USER_TAG wiggles USER_THEIR thighs to make USER_THEIR VAR_C4 sit more comfortably. Steel is so *unforgiving.*`,
                `USER_TAG gropes USER_THEMSELF with USER_THEIR hands, helplessly unable to touch...`,
                `USER_TAG squirms in USER_THEIR VAR_C4, but no matter how much USER_THEY USER_TRY, USER_THEY just can't feel anything...`,
                `USER_TAG sighs as USER_THEY USER_TRY to fumble with USER_THEIR VAR_C4. When was the last time USER_THEY had freedom or relief?`,
                `USER_TAG mews in despair as USER_THEY can't get *any* feeling when touching down there! Poor USER_THEM!`,
                `USER_TAG tried so hard to touch USER_THEMSELF, and didn't get so far. But in the end, it doesn't even matter.`,
                `USER_TAG fusses with USER_THEIR belt, but USER_THEY forgot: Good USER_PRAISEOBJECTs ***never*** cum.`,
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `USER_TAG tries to get USER_THEIR fingers under USER_THEIR VAR_C4, but... USER_THEIR VAR_C3 prevents USER_THEM from hooking on anything.`,
                `USER_TAG's VAR_C3 really limit how much USER_THEY can get under USER_THEIR VAR_C4. Not like USER_THEY needed relief or anything.`,
                `USER_TAG uses the smooth surface of USER_THEIR VAR_C3 to try to push on the waist band of USER_THEIR VAR_C4, but it doesn't help.`,
                `USER_TAG paws at USER_THEIR VAR_C4, but sadly USER_THEY can't really do anything to push it off. Not that USER_THEY'd want to.`,
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG caresses the smooth metal of USER_THEIR VAR_C4, but the lock holds it snugly to USER_THEIR hips!`,
                `USER_TAG tries to get a couple of fingers under USER_THEIR VAR_C4, but it's quite challenging to do so. USER_THEY_CAP should use the key!`,
                `USER_TAG squeezes USER_THEIR thumb under the waistband of USER_THEIR VAR_C4, but can accomplish little more than shift it a bit.`,
                `USER_TAG dances USER_THEIR fingernails on the protective shield of USER_THEIR VAR_C4. Oh how nice it would be to touch...`
            ]
        }
    },
    headwear: {
        heavy: [
            `USER_TAG rubs USER_THEIR face against the wall, trying to scoot the things on USER_THEIR head off, but can't without arms.`,
            `USER_TAG tugs against USER_THEIR VAR_C1 so USER_THEY can take off USER_THEIR head gear, but the restraint holds firm!`,
            `USER_TAG kneels and tries to rub USER_THEIR head gear off on the floor. It looks cute, but the head gear stays on as if nothing happened.`,
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `Using USER_THEIR wrists, USER_TAG tries to push the headwear on USER_THEIR head, but it doesn't budge.`,
                `USER_TAG tries to fumble with USER_THEIR headgear, trying to find something USER_THEY wanted all along. The headgear is somewhere it belongs.`,
                `USER_TAG contorts USER_THEIR face in strange, goofy shapes to try to squeeze USER_THEIR head out of the headgear. It didn't really help though.`,
                `USER_TAG bobs USER_THEIR head back and forth to bounce things off of it. The head gear holds firmly though.`
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `USER_TAG paws at USER_THEIR face cutely to knock some of the things off of USER_THEIR head. The things barely hang on!`,
                `USER_TAG uses the balled fists inside USER_THEIR VAR_C3 to try to peel some of the things off of USER_THEIR head. Unsuccessfully, of course.`,
                `USER_TAG prods at USER_THEIR head gear to try to loosen it and pull something off. The head gear is quite secure though.`,
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG runs USER_THEIR fingers over USER_THEIR head gear. It all feels so nice on USER_THEIR head... USER_THEY_CAP should keep wearing it!`,
                `USER_TAG tries to use a finger to get some leverage and knock some head wear off of USER_THEIR head. It's not falling off anytime soon though.`,
                `USER_TAG dextrously slips USER_THEIR fingers under some of their head gear! USER_THEY_CAP *could* take it off, but USER_THEIR head looks pretty with it on.`,
            ]
        }
    },
    corset: {
        heavy: [
            `USER_TAG squirms in USER_THEIR VAR_C1, but can't really do much about the tightly hugging corset around USER_THEM!`,
            `USER_TAG bounces USER_THEIR hips from side to side, seeing if USER_THEY can flex USER_THEIR corset, but to no avail.`,
            `USER_TAG tugs against USER_THEIR VAR_C1, trying to reach the strings on USER_THEIR corset... but they're just out of reach...`
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `USER_TAG uses USER_THEIR wrists to try to scooch USER_THEIR corset a bit and make it more comfortable. It doesn't work though.`,
                `USER_TAG takes a deep breath- well, as deep as USER_THEY can manage. The corset's boning holds firm and does not show any signs of relief.`,
                `Despite USER_THEIR best efforts to wiggle USER_THEIR midsection, USER_TAG just can't get anywhere with escaping USER_THEIR corset.`
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `USER_TAG paws at the clasps on USER_THEIR corset, trying to use both hands to push the corset clasps apart. The corset refuses to give USER_THEM any chance.`,
                `USER_TAG runs USER_THEIR VAR_C3 on the sides of USER_THEIR corset. So pretty. So feminine. So hourglassy!`,
                `USER_TAG fiddles with the laces on USER_THEIR corset, but obviously the VAR_C3 gives USER_THEM no fingers to grip with!`
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG tries to pinch and undo the laces on USER_THEIR corset, but USER_THEY struggleUSER_S to see what USER_THEY USER_ISARE doing and ends up creating an impossible knot.`,
                `USER_TAG pushes USER_THEIR fingers underneath the corset USER_THEY USER_ISARE wearing but it is so tightly on USER_THEM that USER_THEY can't even make it budge.`,
                `USER_TAG runs USER_THEIR fingers all over USER_THEIR corset. It feels so nice to wear. So formfitting.`
            ]
        }
    },
    collar: {
        heavy: [
            `USER_TAG clumsily tries to use a nearby table to push USER_THEIR VAR_C5 off. It's difficult to do so without arms.`,
            `USER_TAG crinks USER_THEIR neck a bit to adjust USER_THEIR VAR_C5, but it doesn't really help since USER_THEIR VAR_C1 is sealing USER_THEIR arms away.`
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `USER_TAG prods at USER_THEIR collar. Such a good pet. Yes. That is USER_THEM! 💜`,
                `USER_TAG twists USER_THEIR head, trying to get some kind of grip on USER_THEIR VAR_C5 to pull it off, but... no dice.`,
                `Using USER_THEIR wrists, USER_TAG tries to fidget with USER_THEIR VAR_C5. USER_THEIR_CAP elbows projected out looks adorable, almost pet-like!`
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `USER_TAG bats the lock hanging on USER_THEIR VAR_C5, but mittens make it hard to use keys anyway. USER_THEY_CAP probably don't have them. Right?`,
                `USER_TAG paws at USER_THEIR VAR_C5, but the collar's straps are unyielding, just like USER_THEIR mittens.`,
                `USER_TAG runs the back of USER_THEIR hand over USER_THEIR VAR_C5. The collar's lock doesn't really care though.`,
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG tugs at the ring on USER_THEIR VAR_C5. It offers a fantastic leash point, but absolutely no hint that USER_THEY can remove it. Someone should leash USER_THEM!`,
                `USER_TAG squeezes USER_THEIR fingers under USER_THEIR VAR_C5, then tugging as hard as USER_THEY can. The collar too is made of high quality material and refuses to come off!`,
                `USER_TAG tries to use a finger or two to pull against USER_THEIR VAR_C5, as if USER_THEYRE sweating, but the air of the dungeon is kept quite cool. `
            ]
        }
    },
    nostruggle: [
        `USER_TAG squirms absent-mindedly with nothing in particular.`,
        `USER_TAG wiggles with nothing specifically on USER_THEMSELF.`,
        `Despite how fun USER_THEIR imagination may be, USER_TAG fidgets with nothing.`,
        `With nothing on USER_TAG's mind, USER_THEY rollUSER_S USER_THEIR muscles to get more comfortable!`,
        `Fantasizing about intense bondage, USER_TAG twiddles USER_THEIR thumbs!`,
        `USER_TAG considers how USER_THEY could play a card game, before looking back up with a tiny wiggle!`,
        `USER_TAG bumps into a book. Despite this though, maybe USER_THEY shouldn't read it yet.`,
        `The dungeon echoes as USER_TAG shifts USER_THEIR weight a bit, anticipating what will happen next!`,
        `USER_TAG's breath trembles slightly at the cold breeze as USER_THEY considerUSER_S the logistics of being bound by Gagbot.`,
        `Fantasies of struggling in restraints swim through USER_TAG's mind!`,
        `USER_TAG's sighs as USER_THEY realizeUSER_S USER_THEY could REALLY go for cuddles right now...`,
        `USER_TAG's mind is quite unbound right now. USER_THEY_CAP clearly wishUSER_ES that would change!`,
        `Imagining the idea of *thrashing* in some restraints right now, USER_TAG sighs in delicious fantasy!`,
        `USER_TAG fantasizes the idea of eating pizza! Pepperonis and cheese! So tasty!`,
        `USER_TAG imagines eating a chocolate chip cookie! With milk too! Just a soft warm cookie...`,
        `USER_TAG really wants some chocolate right now. Someone should feed USER_THEM some chocolate!`,
        `USER_TAG's mind drifts off to that last video game USER_THEY USER_WERE playing. Such good progress!`,
        `USER_TAG idly fantasizes about being praised. Someone should praise USER_THEM!`,
        `USER_TAG hums to USER_THEMSELF, humming some catchy tune that others probably can't identify. Unless they're in the know.`,
        `USER_TAG is considering announcing to everyone that USER_THEY lost The Game!`,
        `USER_TAG wants a new pair of handcuffs. Where? On who? Who knows!`,
        `USER_TAG wants a new pair of handcuffs. Probably on USER_THEMSELF. Someone should bind USER_THEM!`,
        `USER_TAG nods as USER_THEY USER_ISARE reminded by USER_THEIR subconscious brain to drink some water!`,
        `USER_TAG tries to imagine how best to adjust USER_THEIR speech when gagged. Perhaps with practice, USER_THEY can figure it out!`,
        `All the keys clanging and bondage restraints strewn about makes USER_TAG swim in happy thoughts!`,
        `USER_TAG twirls USER_THEIR hair absentmindedly. Someone should tie USER_THEM up with more bondage, tehe!~`,
        `USER_TAG clears USER_THEIR throat and then begins to speak: The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal bodeboop. A single lap should be completed every time you hear this sound. ding Remember to run in a straight line and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark. Get ready!… Start.`,
        `USER_TAG's mind is fantasizing about the cute characters in that last anime USER_THEY watched. Everyone should ask USER_THEM about it!`,
        `USER_TAG's voice echoes through the halls as USER_THEY monologueUSER_S: ***Tell me, for whom do you fight...***`,
        `USER_TAG wants ice cream. Everyone should have ice cream. USER_THEY_CAP wantUSER_S to know what everyone's favorite flavor is!`,
        `USER_TAG is getting cold feet. Someone should tie USER_THEM up and tickle USER_THEIR feet so they warm up!`,
        `USER_TAG wants hot cocoa and to sit cozily by a fire on a stormy day, just pleasantly reading and enjoying the warm. Under a blankey. So nice...`,
        `USER_TAG fans USER_THEMSELF as USER_THEY lookUSER_S at the strewn restraints. Gagbot has been busy. Hopefully USER_THEY USER_ISARE the next target!`,
        `USER_TAG starts mumbling, counting sheep to USER_THEMSELF. USER_THEY might be a little sleepy...`,
        `USER_TAG starts scrolling on YourSpace, and comes across a post titled, 'rawr XD' with a girl with too much eyeshadow and a terrible webcam in the dark.`,
        `USER_TAG wants to take a selfie. In bondage, of course. Who wouldn't want to take beautiful pictures wearing a ball gag?`,
        `USER_TAG's breathing accelerates a little as USER_THEY fantasizeUSER_S about being in chains, kneeling at the feet of someone here... Who will give USER_THEM that fantasy?`,
        `USER_TAG might have had some water recently, but it's good to remember to get more. Can never have too much, afterall.`,
        `All this talk about servitude and the moans from the dungeon's denizens makes it impossible for USER_TAG to focus...`,
        `USER_TAG wants to lay in someone's lap. Or maybe have someone lay in USER_THEIR lap. Maybe both.`,
        `USER_TAG wants to pet a cute kitty. Or a cute doggo. Maybe lots of cute kitties and doggos!`,
        `USER_TAG prepares for battle with a sword and flourishes it. USER_THEY_CAP USER_ISARE going to hunt the legendary sHE!`,
        `USER_TAG sits and looks around patiently because USER_THEY USER_ISARE a **good USER_PRAISEOBJECT!**`,
    ]
}

const texts_unchastity = {
    chastitybelt: {
        heavy: {
            self: {
                chastity: [
                    `USER_TAG shifts in USER_THEIR VAR_C1, trying to squirm out of USER_THEIR chastity belt, but USER_THEIR metal prison holds firmly to USER_THEIR body!`
                ],
                // ephemeral
                nochastity: [
                    `You're not in a chastity belt, but you wouldn't be able to remove it anyway!`
                ]
            },
            other: {
                chastity: [
                    `USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity belt, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`
                ],
                // ephemeral
                nochastity: [
                    `TARGET_TAG is not in a chastity belt, but you wouldn't be able to remove it anyway!`
                ]
            }
        },
        noheavy: {
            self: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`
                            ],
                            nodiscard: [
                                `USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEY struggleUSER_S to guide it in the mechanism!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG puts the key in the lock on USER_THEIR belt and unlocks it, freeing USER_THEMSELF from that wretched prison!`
                        ]
                    },
                    nokey: [
                        `USER_TAG runs USER_THEIR fingers uselessly on the metal of USER_THEIR chastity belt, but USER_THEY can't unlock it without the key!`
                    ]
                },
                // ephemeral
                nochastity: [
                    `You aren't wearing a chastity belt!`
                ]
            },
            other: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to use the key for TARGET_TAG's belt, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`
                            ],
                            nodiscard: [
                                `USER_TAG tries to unlock TARGET_TAG's belt, but USER_THEY can't focus enough to guide the key into the keyhole!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG puts the key into TARGET_TAG's belt and turns the lock, letting it fall open and onto the floor. TARGET_THEY_CAP TARGET_ISARE free!`
                        ]
                    },
                    // ephemeral
                    nokey: [
                        `You don't have the key for TARGET_TAG's belt!`
                    ]
                },
                // ephemeral
                nochastity: [
                    `TARGET_TAG is not wearing a chastity belt!`
                ]
            }
        }
    },
    chastitybra: {
        heavy: {
            self: {
                chastity: [
                    `USER_TAG shifts in USER_THEIR VAR_C1, trying to shift out of USER_THEIR chastity bra, but USER_THEIR metal prison holds firmly to USER_THEIR body!`
                ],
                // ephemeral
                nochastity: [
                    `You're not in a chastity bra, but you wouldn't be able to remove it anyway!`
                ]
            },
            other: {
                chastity: [
                    `USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity bra, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`
                ],
                // ephemeral
                nochastity: [
                    `TARGET_TAG is not in a chastity bra, but you wouldn't be able to remove it anyway!`
                ]
            }
        },
        noheavy: {
            self: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`
                            ],
                            nodiscard: [
                                `USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEY struggleUSER_S to guide it in the mechanism!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG puts the key in the lock on USER_THEIR bra and unlocks it, freeing USER_THEIR breasts from that wretched prison!`
                        ]
                    },
                    nokey: [
                        `USER_TAG caresses USER_THEIR fingers uselessly on the smooth metal of USER_THEIR chastity bra's breast cups, but USER_THEY can't unlock it without the key!`
                    ]
                },
                // ephemeral
                nochastity: [
                    `You aren't wearing a chastity bra!`
                ]
            },
            other: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to use the key for TARGET_TAG's bra, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`
                            ],
                            nodiscard: [
                                `USER_TAG tries to unlock TARGET_TAG's bra, but USER_THEY can't focus enough to guide the key into the keyhole!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG puts the key into TARGET_TAG's bra and turns the lock, letting it fall off of TARGET_THEIR breasts and onto the floor.`
                        ]
                    },
                    // ephemeral
                    nokey: [
                        `You don't have the key for TARGET_TAG's bra!`
                    ]
                },
                // ephemeral
                nochastity: [
                    `TARGET_TAG is not wearing a chastity bra!`
                ]
            }
        }
    }
}

const texts_uncollar = {
    heavy: {
        self: {
            collar: [
                `USER_TAG crinks USER_THEIR neck, trying to take off USER_THEIR collar, but without USER_THEIR arms due to USER_THEIR VAR_C1, USER_THEY can't!`
            ],
            // Ephemeral
            nocollar: [
                `You aren't wearing a collar, but you wouldn't be able to take it off even if you were!`
            ]
        },
        other: {
            collar: [
                `USER_TAG wriggles towards TARGET_TAG, trying to take off TARGET_THEIR collar, but USER_THEY needUSER_S arms to unlock and undo the buckle!`
            ],
            // Ephemeral
            nocollar: [
                `TARGET_TAG is not wearing a collar, but you wouldn't be able to take it off anyway!`
            ]
        }
    },
    noheavy: {
        self: {
            collar: {
                key: [
                    `USER_TAG leans forward to let USER_THEIR hair fall forward, then puts a key in the tiny lock and unlocks USER_THEIR collar, undoing the buckle and putting it away!`
                ],
                nokey: [
                    `USER_TAG tugs at USER_THEIR collar, trying to adjust and maybe take it off, but without the key USER_THEY can't really take it off!`
                ]
            },
            // Ephemeral
            nocollar: [
                `You're not wearing a collar!`
            ]
        },
        other: {
            collar: {
                key: [
                    `USER_TAG puts a key in TARGET_TAG's collar, unlocking it and undoing the strap around TARGET_THEIR neck.`
                ],
                nokey: {
                    // Ephemeral
                    nokeyholderonly: [
                        `TARGET_TAG's collar is unlocked, but it would be impolite to take it off!`
                    ],
                    // Ephemeral
                    keyholderonly: [
                        `You don't have the key for TARGET_TAG's collar!`
                    ]
                }
            },
            // Ephemeral
            nocollar: [
                `TARGET_TAG is not wearing a collar!`
            ]
        }
    }
}

const texts_uncorset = {
    heavy: {
        self: {
            corset: {
                chastity: [
                    `Since USER_THEY USER_DOESNT have arms, USER_TAG wiggles USER_THEIR torso a little bit, trying to slink off USER_THEIR corset, but USER_THEIR chastity belt is in the way.`
                ],
                nochastity: [
                    `USER_TAG wriggles in USER_THEIR VAR_C1, but without arms, USER_THEY can't easily undo the laces of USER_THEIR corset to take it off!`
                ]
            },
            // Ephemeral
            nocorset: [
                `You aren't wearing a corset, but even if you were, you wouldn't be able to take it off!`
            ]
        },
        other: {
            corset: {
                chastity: [
                    `USER_TAG tugs against USER_THEIR VAR_C1, but USER_THEY can't really get a good grasp of TARGET_TAG's corset strings behind TARGET_THEIR chastity belt!`
                ],
                nochastity: [
                    `Maybe in another time, USER_TAG might have been able to help TARGET_TAG out of TARGET_THEIR corset, but having no arms makes it hard.`
                ]
            },
            // Ephemeral
            nocorset: [
                `TARGET_TAG isn't wearing a corset, but you wouldn't be able to remove it anyway!`
            ]
        }
    },
    noheavy: {
        self: {
            corset: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to unlock USER_THEIR belt to remove USER_THEIR corset, but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! USER_THEY_CAP will have to remain corseted!`
                            ],
                            nodiscard: [
                                `USER_TAG shakily tries to unlock USER_THEIR belt, but the key keeps slipping and not going into the mechanism. USER_THEY will have to leave USER_THEIR corset alone until USER_THEY calm down!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG unlocks USER_THEIR chastity belt briefly, undoing the laces of the corset USER_THEY USER_ISARE wearing and pulling it off of USER_THEIR waist! USER_THEY_CAP then carefully lockUSER_S USER_THEMSELF back up!`
                        ]
                    },
                    nokey: [
                        `USER_TAG tugs at USER_THEIR chastity belt to try to remove USER_THEIR corset, but the locking mechanism holds firm!`
                    ]
                },
                nochastity: [
                    `USER_TAG carefully undoes the laces and USER_THEIR corset, unwrapping it from USER_THEIR waist. USER_THEY_CAP breatheUSER_S a *huge* breath of relief!`
                ]
            },
            // Ephemeral
            nocorset: [
                `You aren't wearing a corset!`
            ]
        },
        other: {
            corset: {
                chastity: {
                    key: {
                        fumble: {
                            discard: [
                                `USER_TAG tries to unlock TARGET_TAG's chastity belt to remove TARGET_THEIR corset but the key slips in USER_THEIR careless horniness. Despite USER_THEIR best efforts, the key seems to have disappeared.`
                            ],
                            nodiscard: [
                                `USER_TAG shakily tries to unlock TARGET_TAG's chastity belt to get at TARGET_THEIR corset, but the key keeps slipping. Fortunately, it wasn't lost, but USER_THEY need to calm down first!`
                            ]
                        },
                        nofumble: [
                            `USER_TAG unlocks TARGET_TAG's chastity belt, then removes TARGET_THEIR corset! While TARGET_THEY TARGET_ISARE breathing fresh air again, USER_THEY lockUSER_S TARGET_THEM back in TARGET_THEIR chastity belt!`
                        ]
                    },
                    public: [
                        `USER_TAG uses the public access key to unlock TARGET_TAG's chastity belt, removing TARGET_THEIR corset, and then clicking the lock back shut!`
                    ],
                    // Ephemeral
                    nokey: [
                        `You don't have the key for TARGET_TAG's chastity belt!`
                    ]
                },
                nochastity: [
                    `USER_TAG carefully undoes the laces on TARGET_TAG's beautiful corset, loosening it until it finally falls off of TARGET_THEIR waist!`
                ]
            },
            // Ephemeral
            nocorset: [
                `TARGET_TAG is not wearing a corset!`
            ]
        }
    }
}

const texts_ungag = {
    heavy: {
        self: {
            gag: [
                `USER_TAG chews on USER_THEIR gag, trying to spit it out because USER_THEY can't use USER_THEIR hands and arms!`,
                `USER_TAG tries to push USER_THEIR gag out with USER_THEIR tongue, but only succeeds in vigorously drooling on USER_THEMSELF!`
            ],
            // Ephemeral
            nogag: [
                `You're not gagged, but you wouldn't be able to remove it anyway!`
            ]
        },
        other: {
            gag: [
                `USER_TAG bumps into TARGET_TAG, trying to use USER_THEIR useless arms to help TARGET_THEM out of TARGET_THEIR gag! It helped... maybe!`
            ],
            // Ephemeral
            nogag: [
                `TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`
            ]
        }
    },
    noheavy: {
        mitten: {
            self: {
                gag: [
                    `USER_TAG paws at USER_THEIR gag, trying to get a good grasp on the straps, but to no avail!`,
                    `USER_TAG tries to use both hands to get a grip on the buckle, but gets nowhere because of USER_THEIR mittens.`,
                    `Brushing USER_THEIR cheek, USER_TAG paws at USER_THEIR gag cutely!`,
                    `USER_TAG mews into USER_THEIR gag pitifully as USER_THEY can't grip the straps to take it out!`
                ],
                // Ephemeral
                nogag: [
                    `You're not gagged, but you wouldn't be able to remove it anyway!`
                ]
            },
            other: {
                gag: [
                    `USER_TAG paws at TARGET_TAG's gag, trying to help TARGET_THEM take it off, but USER_THEY can't really do much.`
                ],
                // Ephemeral
                nogag: [
                    `TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`
                ]
            }
        },
        nomitten: {
            self: {
                gag: [
                    `USER_TAG has taken USER_THEIR gag out!`,
                    `With a stream of drool, USER_TAG undoes the straps and takes USER_THEIR gag out!`,
                    `Reaching up and unclasping the straps, USER_TAG unravels USER_THEIR lips from USER_THEIR gag!`,
                    `USER_TAG takes USER_THEIR gag out, stretching USER_THEIR jaw slightly!`
                ],
                // Ephemeral
                nogag: [
                    `You aren't currently gagged right now!`
                ]
            },
            other: {
                gag: [
                    `USER_TAG undoes the straps holding TARGET_TAG's gag on TARGET_THEIR face, letting it fall out from between TARGET_THEIR teeth.`,
                    `USER_TAG unclasps the buckle for TARGET_TAG's gag, then carefully pops it out.`,
                    `USER_TAG carefully unbuckle's TARGET_TAG's gag, and lets TARGET_THEIR face fall forward to allow the drool to drain out from TARGET_THEIR mouth.`
                ],
                // Ephemeral
                nogag: [
                    `TARGET_TAG is not currently gagged right now!`
                ]
            }
        }
    }
}

const texts_unheadwear = {
    heavy: {
        self: {
            single: {
                worn: [
                    `USER_TAG tries to use the wall to push off the VAR_C2 on USER_THEIR face, but can't really get any leverage!`
                ],
                // Ephemeral
                noworn: [
                    `You aren't wearing a VAR_C2, but you couldn't remove it anyway!`
                ]
            },
            multiple: {
                worn: [
                    `USER_TAG tries to use the wall to push off the headgear on USER_THEIR face, but can't really get any leverage!`
                ],
                // Ephemeral
                noworn: [
                    `You aren't wearing any head restraints, but you couldn't remove them anyway!`
                ]
            }
        },
        other: {
            single: {
                worn: [
                    `USER_TAG brushes up against TARGET_TAG, trying to peel off the VAR_C2 stuck on TARGET_THEIR head, but it holds firmly!`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`
                ]
            },
            multiple: {
                worn: [
                    `USER_TAG brushes up against TARGET_TAG, trying to peel off the headwear stuck on TARGET_THEIR head, but it all holds firmly!`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`
                ]
            }
        }
    },
    noheavy: {
        mitten: {
            self: {
                single: {
                    worn: [
                        `USER_TAG paws at USER_THEIR VAR_C2, trying to scoot it off of USER_THEIR head! No fingers makes it impossible to slip off!`
                    ],
                    // Ephemeral
                    noworn: [
                        `You aren't wearing a VAR_C2, but you couldn't remove it anyway!`
                    ]
                },
                multiple: {
                    worn: [
                        `USER_TAG paws at USER_THEIR head restraints, trying to scoot them off of USER_THEIR head! No fingers makes it impossible to slip any off!`
                    ],
                    // Ephemeral
                    noworn: [
                        `You aren't wearing any head restraints, but you couldn't remove them anyway!`
                    ]
                }
            },
            other: {
                single: {
                    worn: [
                        `USER_TAG paws at the VAR_C2 on TARGET_TAG's head, trying to inch it off of TARGET_THEIR face!`
                    ],
                    // Ephemeral
                    noworn: [
                        `TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`
                    ]
                },
                multiple: {
                    worn: [
                        `USER_TAG paws at the head gear on TARGET_TAG's head, trying to inch it all off of TARGET_THEIR face!`
                    ],
                    // Ephemeral
                    noworn: [
                        `TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`
                    ]
                }
            }
        },
        nomitten: {
            self: {
                single: {
                    worn: [
                        `USER_TAG carefully undoes the straps on the VAR_C2, gently pulling it off of USER_THEIR head!`
                    ],
                    // Ephemeral
                    noworn: [
                        `You aren't currently wearing a VAR_C2!`
                    ]
                },
                multiple: {
                    worn: [
                        `USER_TAG carefully undoes the straps on all of the headgear USER_THEY USER_ISARE wearing, gently pulling it off of USER_THEIR head, one by one!`
                    ],
                    // Ephemeral
                    noworn: [
                        `You aren't currently wearing any headgear!`
                    ]
                }
            },
            other: {
                single: {
                    worn: [
                        `USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR VAR_C2 and taking it off!`
                    ],
                    // Ephemeral
                    noworn: [
                        `TARGET_TAG isn't currently wearing a VAR_C2!`
                    ]
                },
                multiple: {
                    worn: [
                        `USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR head restraints and peeling them all off!`
                    ],
                    // Ephemeral
                    noworn: [
                        `TARGET_TAG isn't currently wearing any headgear!`
                    ]
                }
            }
        }
    }
}

const texts_unheavy = {
    heavy: {
        self: [
            `USER_TAG wiggles in USER_THEIR VAR_C1, but obviously USER_THEY USER_ISARE *very* helpless and can't get far with taking it off on USER_THEIR own!`
        ],
        other: [
            `USER_TAG brushes up against TARGET_TAG to help TARGET_THEM out of USER_THEIR VAR_C2, but being trapped in a VAR_C1, USER_THEY can't really help TARGET_THEM out much.`
        ]
    },
    noheavy: {
        heavyequipped: [
            `USER_TAG helps TARGET_TAG out of TARGET_THEIR VAR_C2! TARGET_THEY_CAP stretchTARGET_S TARGET_THEIR arms and sighTARGET_S with gratitude!`
        ],
        noheavyequipped: {
            self: [
                `You aren't in any kind of heavy bondage!`
            ],
            other: [
                `TARGET_TAG is not in any kind of heavy bondage!`
            ]
        }
    }
}

const texts_unmitten = {
    heavy: {
        self: [
            `USER_TAG wriggles USER_THEIR hands in their VAR_C1, but can't get good leverage to take USER_THEIR mittens off!`
        ],
        other: [
            `USER_TAG uses USER_THEIR nose to help TARGET_TAG but can't help TARGET_THEM out of TARGET_THEIR mittens!`
        ]
    },
    noheavy: {
        other: {
            gag: [
                `USER_TAG takes off TARGET_TAG's mittens so TARGET_THEY can take off TARGET_THEIR gag!`
            ],
            nogag: [
                `USER_TAG takes off TARGET_TAG's mittens. Now TARGET_THEY could take off any gag someone wants to put on TARGET_THEM!`
            ]
        },
        self: [
            `USER_TAG tries to pull off USER_THEIR mittens, but the straps and locks hold them firmly on USER_THEIR wrists!`
        ]
    },
    // Idk why the structure was like this - Ephemeral
    otherother: [
        `USER_TAG is not wearing mittens!`
    ]
}

const texts_unvibe = {
    heavy: {
        self: {
            chastity: {
                single: [
                    `USER_TAG tries to knock USER_THEIR VAR_C2 off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`
                ],
                both: [
                    `USER_TAG tries to knock USER_THEIR vibrators off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`
                ]
            },
            nochastity: {
                single: [
                    `USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`
                ],
                both: [
                    `USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`
                ]
            }
        },
        other: {
            chastity: {
                single: [
                    `USER_TAG tries to knock TARGET_TAG's VAR_C2 off with USER_THEIR knees, however TARGET_THEIR chastity belt holds it firmly in place!`
                ],
                both: [
                    `USER_TAG tries to knock TARGET_TAG's vibrators off with USER_THEIR knees, however TARGET_THEIR chastity belt holds them firmly in place!`
                ]
            },
            nochastity: {
                single: [
                    `USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's VAR_C2, however it stays pretty secure in TARGET_THEIR body!`
                ],
                both: [
                    `USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's vibrator, however it stays pretty secure in TARGET_THEIR body!`
                ]
            }
        }
    },
    noheavy: {
        self: {
            hasvibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                                both: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ]
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                                both: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking USER_THEMSELF back up.`
                            ],
                            both: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting vibrators before closing it and locking USER_THEMSELF back up.`
                            ]
                        }
                    },
                    // No public access to self belt
                    nokey: [
                        `USER_TAG claws feverishly at USER_THEIR belt, the agonizing vibrators offering USER_THEM no reprieve from their sweet sensation!`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG carefully removes USER_THEIR VAR_C2 and turns it off. Freedom from the torment!`
                    ],
                    both: [
                        `USER_TAG carefully removes USER_THEIR vibrator and turns them off. Freedom from the torment!`
                    ]
                }
            },
            novibe: {
                single: [
                    `You do not have a VAR_C2 on yourself!`
                ],
                both: [
                    `You do not have any vibrators on yourself!`
                ]
            }
        },
        other: {
            hasvibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                                both: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ]
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                                both: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`
                            ],
                            both: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`
                            ]
                        }
                    },
                    public: {
                        single: [
                            `USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`
                        ],
                        both: [
                            `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`
                        ]
                    },
                    nokey: [
                        `You do not have the key to TARGET_TAG's chastity belt.`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG carefully removes TARGET_TAG's VAR_C2 and turns it off. Freedom from the torment!`
                    ],
                    both: [
                        `USER_TAG carefully removes TARGET_TAG's vibrator and turns them off. Freedom from the torment!`
                    ]
                }
            },
            novibe: {
                single: [
                    `TARGET_TAG does not have a VAR_C2 on TARGET_THEM!`
                ],
                both: [
                    `TARGET_TAG does not have any vibrators on TARGET_THEM!`
                ]
            }
        }
    }
}

const texts_unwear = {
    heavy: {
        self: {
            single: {
                worn: [
                    `Try as USER_THEY might, USER_TAG can't wriggle out of USER_THEIR VAR_C2 right now in USER_THEIR bondage.`
                ],
                // Ephemeral
                noworn: [
                    `You aren't wearing a VAR_C2, but you couldn't remove it anyway!`
                ]
            },
            multiple: {
                worn: [
                    `Try as USER_THEY might, USER_TAG can't really take off USER_THEIR clothes while USER_THEY are tied up.`
                ],
                // Ephemeral
                noworn: [
                    `You aren't wearing any head restraints, but you couldn't remove them anyway!`
                ]
            }
        },
        other: {
            single: {
                worn: [
                    `Despite all of USER_THEIR enthusiasm, USER_TAG is unable to take off TARGET_TAG's VAR_C2 without USER_THEIR arms.`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`
                ]
            },
            multiple: {
                worn: [
                    `Despite all of USER_THEIR enthusiasm, USER_TAG is unable to undress TARGET_TAG without USER_THEIR arms.`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`
                ]
            }
        }
    },
    noheavy: {
        self: {
            single: {
                worn: [
                    `USER_TAG slowly slips out of USER_THEIR VAR_C2, folding it and putting it away for future wear!`
                ],
                // Ephemeral
                noworn: [
                    `You aren't currently wearing a VAR_C2!`
                ]
            },
            multiple: {
                worn: [
                    `USER_TAG slowly slips out of USER_THEIR clothes, folding them all up and stowing them away for future wear!`
                ],
                // Ephemeral
                noworn: [
                    `You aren't currently wearing any headgear!`
                ]
            }
        },
        other: {
            single: {
                worn: [
                    `Slowly, USER_TAG runs USER_THEIR fingers over TARGET_TAG, sensually pulling off TARGET_THEIR VAR_C2 and setting it aside.`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't currently wearing a VAR_C2!`
                ]
            },
            multiple: {
                worn: [
                    `Giggling with glee, USER_TAG pulls all the clothes off of TARGET_TAG and sets them aside!`
                ],
                // Ephemeral
                noworn: [
                    `TARGET_TAG isn't currently wearing any headgear!`
                ]
            }
        }
    }
}

const texts_vibe = {
    heavy: {
        self: {
            chastity: {
                single: [
                    `USER_TAG scoots a VAR_C2 with USER_THEIR ankle, but can't slip it past USER_THEIR chastity belt!`
                ]
            },
            nochastity: {
                single: [
                    `USER_TAG tries to fanagle a VAR_C2 into USER_THEMSELF with USER_THEIR toes, but isn't flexible enough!`
                ],
            }
        },
        other: {
            chastity: {
                single: [
                    `USER_TAG tries to carefully manipulate a VAR_C2 into TARGET_TAG, but isn't able to get past TARGET_THEIR chastity belt without arms!`
                ],
            },
            nochastity: {
                single: [
                    `USER_TAG twists USER_THEIR leg to push a VAR_C2 towards TARGET_TAG, but without arms, USER_THEY can't really put it on TARGET_THEM.`
                ],
            }
        }
    },
    noheavy: {
        self: {
            vibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ],
                        }
                    },
                    // No public access to self belt
                    nokey: [
                        `USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG adjusts USER_THEIR VAR_C2 and sets it to VAR_C3! The toy buzzes gently!`
                    ],
                }
            },
            novibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it before adding a VAR_C2 set to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ],
                        }
                    },
                    // No public access to self belt
                    nokey: [
                        `USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG carefully inserts a VAR_C2 set to VAR_C3! The toy buzzes gently!`
                    ],
                }
            }
        },
        other: {
            vibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to change the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to adjust the buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adjusting the buzzing VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`
                            ],
                        }
                    },
                    public: {
                        single: [
                            `USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adjusting the VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`
                        ],
                    },
                    nokey: [
                        `You do not have the key to TARGET_TAG's chastity belt.`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG adjusts the VAR_C2 inside TARGET_TAG, setting it to VAR_C3. The toy's buzzing song continues TARGET_THEIR joy!`
                    ],
                }
            },
            novibe: {
                chastity: {
                    key: {
                        fumble: {
                            discard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to insert a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                ],
                            },
                            nodiscard: {
                                single: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to insert a buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ],
                            }
                        },
                        nofumble: {
                            single: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a buzzing VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`
                            ],
                        }
                    },
                    public: {
                        single: [
                            `USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adding a VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`
                        ],
                    },
                    nokey: [
                        `You do not have the key to TARGET_TAG's chastity belt.`
                    ]
                },
                nochastity: {
                    single: [
                        `USER_TAG carefully adds a VAR_C2 to TARGET_TAG, setting it to VAR_C3. The toy's buzzing song precludes TARGET_THEIR joy!`
                    ],
                }
            }
        }
    }
}

const texts_wear = {
    heavy: {
        self: {
            // Ephemeral
            worn: [
                `You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`
            ],
            noworn: [
                `USER_TAG nuzzles a VAR_C2, but putting it on would be kinda difficult without USER_THEIR arms.`
            ]
        },
        other: {
            // Ephemeral
            worn: [
                `TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`
            ],
            noworn: [
                `USER_TAG tries to pick up a VAR_C2 and slip it on TARGET_TAG... with something besides USER_THEIR arms, since USER_THEY USER_ISARE wearing a VAR_C1.`
            ]
        }
    },
    noheavy: {
        self: {
            // Ephemeral
            worn: [
                `You are already wearing a VAR_C2!`
            ],
            noworn: [
                `USER_TAG picks up a beautiful VAR_C2 and puts it on! It sits snugly on USER_THEM!`
            ]
        },
        other: {
            // Ephemeral
            worn: [
                `You are already wearing a VAR_C2!`
            ],
            noworn: [
                `USER_TAG helps TARGET_TAG into a VAR_C2, ensuring it all fits snugly!`
            ]
        }
    }
} 

const textarrays = {
    texts_chastity: texts_chastity,
    texts_collar: texts_collar,
    texts_collarequip: texts_collarequip,
    texts_corset: texts_corset,
    texts_gag: texts_gag,
    texts_headwear: texts_headwear,
    texts_heavy: texts_heavy,
    texts_key: texts_key,
    texts_letgo: texts_letgo,
    texts_mitten: texts_mitten,
    texts_struggle: texts_struggle,
    texts_unchastity: texts_unchastity,
    texts_uncollar: texts_uncollar,
    texts_uncorset: texts_uncorset,
    texts_ungag: texts_ungag,
    texts_unheadwear: texts_unheadwear,
    texts_unheavy: texts_unheavy,
    texts_unmitten: texts_unmitten,
    texts_unvibe: texts_unvibe,
    texts_unwear: texts_unwear,
    texts_vibe: texts_vibe,
    texts_wear: texts_wear
}

// Get generic text and spit out a pronoun respecting version YAY
const getTextGeneric = (type, data_in) => {
    let generics = {
        "unbind": "TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be removed. Please wait as TARGET_THEY confirmTARGET_S (30 second timeout).",
        "unbind_decline": "TARGET_TAG has declined your help with USER_THEIR VAR_C1.",
        "unbind_accept": "TARGET_TAG has accepted your offer to help with USER_THEIR VAR_C1!",
        "unbind_timeout": "The request to help TARGET_TAG timed out!",
        "changebind": "TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be changed. Please wait as TARGET_THEY confirmTARGET_S (30 second timeout).",
        "changebind_decline": "TARGET_TAG has declined allowing you to change USER_THEIR bindings.",
        "changebind_accept": "TARGET_TAG has allowed you to change USER_THEIR bindings.",
        "clone_accept": "TARGET_TAG has allowed you to make a clone of USER_THEIR VAR_C1 key, giving it to VAR_C2!",
        "clone_accept_self": "Cloning your key...",
        "clone_decline": "TARGET_TAG has forbidden you from making a clone of USER_THEIR VAR_C1 key for VAR_C2!",
        "give_accept": "TARGET_TAG has allowed you to give USER_THEIR VAR_C1 key to VAR_C2!",
        "give_accept_self": "Giving your key...",
        "give_decline": "TARGET_TAG has forbidden you from giving USER_THEIR VAR_C1 key to VAR_C2!",
        "revoke_accept": "You have destroyed the key VAR_C2 had to TARGET_TAG's VAR_C1.",
    }

    let chosentext = generics[type];
    return convertPronounsText(chosentext, data_in)
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
        console.log(props)
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
            return ("There was an error generating this text. No error, but the destination was not an array of strings. Please tell Enraa that the tree followed this path: " + props.join(", "))
        }
    }
    catch (err) {
        console.log(err)
        return "There was an error generating this text. See console error."
    }
}

exports.getText = getText;
exports.getTextGeneric = getTextGeneric;