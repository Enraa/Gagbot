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
                nogag: [
                    `USER_TAG takes a VAR_C3 out and brushes the hair out of TARGET_TAG's face, before pinching TARGET_THEIR nose for a moment and shoving the gag between TARGET_THEIR teeth when TARGET_THEY goTARGET_ES to breathe! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled shut!`,
                    `USER_TAG uses a finger to gently pry open TARGET_TAG's lips before inserting a VAR_C3 between TARGET_THEIR teeth, secured VAR_C2 behind TARGET_THEIR head. A muted meep follows soon after from TARGET_THEM!`,
                    `USER_TAG holds up a VAR_C3, pressing it against TARGET_TAG's lips with ever increasing force until they part, taking away TARGET_THEIR ability to speak coherently! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled under TARGET_THEIR hair!`,
                    `USER_TAG taps TARGET_TAG's lips, silently suggesting to say "ahh" before pushing a VAR_C3 VAR_C2 between TARGET_THEIR lips!`
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
        `USER_TAG buckles USER_THEIR legs, panting in short breaths as USER_THEY attempt to (and fail miserably) to get release!`
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
                `As if USER_THEY want to stay gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`,
            ],
            nogag: [
                `USER_TAG slips USER_THEIR hands into some VAR_C2! USER_THEYLL_CAP be unable to remove a gag if someone puts one on USER_THEM!`,
                `USER_TAG wriggles USER_THEIR fingers into some VAR_C2. Gags will be impossible to remove!`,
                `As if USER_THEY want to be gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`,
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

const texts_unchastity = {
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
                `TARGET_TAG is not wearing chastity!`
            ]
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
                    `Since USER_THEY don't have arms, USER_TAG wiggles USER_THEIR torso a little bit, trying to slink off USER_THEIR corset, but USER_THEIR chastity belt is in the way.`
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
                                `USER_TAG shakily tries to unlock USER_THEIR belt, but the key keeps slipping and not going into the mechanism. USER_THEY will have to leave USER_THEIR corset alone until they calm down!`
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
                            `USER_TAG unlocks TARGET_TAG's chastity belt, then removes TARGET_THEIR corset! While TARGET_THEY are breathing fresh air again, USER_THEY lockUSER_S TARGET_THEM back in TARGET_THEIR chastity belt!`
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
                    `USER_TAG trashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`
                ],
                both: [
                    `USER_TAG trashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`
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

const textarrays = {
    texts_chastity: texts_chastity,
    texts_collar: texts_collar,
    texts_collarequip: texts_collarequip,
    texts_corset: texts_corset,
    texts_gag: texts_gag,
    texts_heavy: texts_heavy,
    texts_letgo: texts_letgo,
    texts_mitten: texts_mitten,
    texts_unchastity: texts_unchastity,
    texts_uncollar: texts_uncollar,
    texts_uncorset: texts_uncorset,
    texts_ungag: texts_ungag,
    texts_unheavy: texts_unheavy,
    texts_unmitten: texts_unmitten,
    texts_unvibe: texts_unvibe,
    texts_vibe: texts_vibe
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