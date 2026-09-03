const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_toy = {
    heavy: {
        self: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but struggles to put them on because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it in because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Plug": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it in because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't reach the buttons on a VAR_C2 to pleasure USER_THEMSELF.`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto USER_THEMSELF to cool off...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG boops USER_THEIR head on a VAR_C2, but can't get it on USER_THEIR head...`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to USER_THEMSELF, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock USER_THEIR chastity bra to put them on!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR chastity belt prevents USER_THEM from putting the toy inside anyway.`,
					{
						only: (t) => {
							return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
						},
						text: `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but the seal on USER_THEM would prevent USER_THEM putting the toy inside anyway~.`,
					},
                ],
                "Plug": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR chastity belt prevents USER_THEM from putting the toy inside anyway.`,
					{
						only: (t) => {
							return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
						},
						text: `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but the seal on USER_THEM would prevent USER_THEM putting the toy inside anyway~.`,
					},
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure USER_THEMSELF. (this is a bug, please report)`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto USER_THEMSELF to cool off... (this is a bug, please report)`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG boops USER_THEIR head on a VAR_C2, but can't get it on USER_THEIR head... (this is a bug, please report)`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to USER_THEMSELF, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to add it! (This is a bug, report)`
                ]
            }
        },
        other: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but struggles to put them on TARGET_TAG because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it into TARGET_TAG because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Plug": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it into TARGET_TAG because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure TARGET_TAG!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto TARGET_TAG to cool TARGET_THEM off...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG boops USER_THEIR head on a VAR_C2, but can't get it on TARGET_TAG's head...`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to TARGET_TAG, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock TARGET_TAG's chastity bra to put them on TARGET_THEM!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but TARGET_TAG's chastity belt prevents USER_THEM from putting the toy inside anyway.`
                ],
                "Plug": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but TARGET_TAG's chastity belt prevents USER_THEM from putting the toy inside anyway.`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure TARGET_TAG! (this is a bug, please report!)`
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to TARGET_TAG, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to add it! (This is a bug, report)`
                ]
            }
        }
    },
    noheavy: {
        self: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change out USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change out USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to change out USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and sliding out the VAR_C2 before lubricating and replacing it with another one with a width of VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue to rock USER_THEIR hips while holding it to USER_THEIR crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a new piece of ice onto USER_THEIR crotch!`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head, moaning in delight at the sensations!`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it and adjusting the VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to adjust USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to adjust USER_THEIR VAR_C2.`
                        ],
                        "Plug": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to change out USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs the VAR_C2 but can't change it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to place some ice but... can't? (this is a bug, please report)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head - but some dimensional imp steals it away! (this is a bug, please report)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to adjust USER_THEIR VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG carefully adjusts the VAR_C2 on USER_THEIR breasts, changing them to VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG taps a button on the VAR_C2 USER_THEY USER_ISARE wearing! It vibrates at a strength of VAR_C3!`
                    ],
                    "Plug": [
                        `USER_TAG carefully removes the VAR_C2 USER_THEY USER_ISARE wearing! After a moment, USER_THEY pickUSER_S another similar looking one with a width of VAR_C3 and lubricates it before inserting it into USER_THEMSELF again!`
                    ],
                    "Wand": [
                        `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue to rock USER_THEIR hips while holding it to USER_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a new piece of ice onto USER_THEIR crotch!`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head, shivering in delight at the wonderful sensations!`,
                        },
                    ],
                    default: [
                        `USER_TAG causes fuzzy shifting in the universe adjusting USER_THEIR VAR_C2 to VAR_C3! (This is a bug, report!)`
                    ]
                }
            },
            notoy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`,
                                {
                                    only: (t) => {
                                        return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
                                    },
                                    text: `USER_TAG disables the magics of USER_THEIR seal, allowing USER_THEM to add a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then reactivateUSER_S the seal, denying USER_THEMSELF access once more.`,
                                },
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adding a VAR_C2 with a width of VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`,
                                {
                                    only: (t) => {
                                        return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
                                    },
                                    text: `USER_TAG disables the magics of USER_THEIR seal, allowing USER_THEM to add a VAR_C2 with a width of VAR_C3! USER_THEY_CAP then reactivateUSER_S the seal, denying USER_THEMSELF access once more.`,
                                },
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into USER_THEIR crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a piece of ice onto USER_THEIR crotch, cooling USER_THEM off harshly, but effectively...`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head, shivering in delight at the wonderful sensations!`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it to add a VAR_C2 at VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to add a VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to add a VAR_C2.`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG tries as USER_THEY might, but is unable to bypass the magics of USER_THEIR seal to add a VAR_C2.`,
							},
                        ],
                        "Plug": [
                            `USER_TAG brushes the VAR_C2 against USER_THEIR legs, but there is a chastity belt in the way...`
                        ],
                        "Wand": [
                            `USER_TAG grabs a VAR_C2 but can't apply it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG takes a piece of ice to apply to USER_THEMSELF, but can't? (This is a bug, report!)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head, but a magical demon stops them (this is a bug, report)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to add a VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG grabs a pair of VAR_C2 and places them gingerly on USER_THEIR breasts! It hums at VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG grabs a VAR_C2 and inserts it into USER_THEMSELF at VAR_C3!`
                    ],
                    "Plug": [
                        `USER_TAG grabs a VAR_C2 with a width of VAR_C3 and lubricates it before inserting it into USER_THEMSELF!`
                    ],
                    "Wand": [
                        `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into USER_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a piece of ice onto USER_THEIR crotch, cooling USER_THEM off harshly, but effectively...`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG slowly lowers a VAR_C2 on USER_THEIR head, shivering in delight at the wonderful sensations!`,
                        },
                    ],
                    default: [
                        `USER_TAG potentially summons a black hole putting on a VAR_C2 at VAR_C3 power! (This is a bug, report!)`
                    ]
                }
            }
        },
        other: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change out the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change out the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to change out the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and popping out the VAR_C2. USER_THEY_CAP then replace it with a similar looking one with a width of VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue holding it against TARGET_TAG's crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a new piece of ice onto TARGET_TAG's crotch, the cruel coldness briskly bringing clarity back...`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head, smiling as TARGET_THEY makeTARGET_S soft sounds of pleasure!`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it and adjusting the VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to adjust TARGET_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to adjust TARGET_THEIR VAR_C2.`
                        ],
                        "Plug": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to change out TARGET_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs the VAR_C2 on TARGET_TAG but can't change it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG grabs a new piece of ice to put on TARGET_TAG, but can't because of unforeseen magic. (this is a bug, report)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head, but a hot dog truck distracted both of them. (this is a bug, report)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to adjust TARGET_TAG's VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG carefully adjusts the VAR_C2 on TARGET_TAG's breasts, changing them to VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG taps a button on the VAR_C2 TARGET_TAG is wearing! It vibrates at a strength of VAR_C3!`
                    ],
                    "Plug": [
                        `USER_TAG carefully slides out the VAR_C2 TARGET_TAG is wearing! USER_THEY_CAP produces a similar looking one with a width of VAR_C3 and slides it into TARGET_THEM!`
                    ],
                    "Wand": [
                        `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as TARGET_TAG continues to rock TARGET_THEIR hips while holding it to TARGET_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a new piece of ice onto TARGET_TAG's crotch, the cruel coldness briskly bringing clarity back...`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head, smiling as TARGET_THEY makeTARGET_S soft sounds of pleasure!`,
                        },
                    ],
                    default: [
                        `USER_TAG causes fuzzy shifting in the universe adjusting TARGET_TAG's VAR_C2 to VAR_C3! (This is a bug, report!)`
                    ]
                }
            },
            notoy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a VAR_C2 with a width of VAR_C3. USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into TARGET_TAG's crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a piece of ice onto TARGET_TAG's crotch, cooling TARGET_THEM off...`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head, smiling as TARGET_THEY makeTARGET_S soft sounds of pleasure!`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it to add a VAR_C2 at VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to add a VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to add a VAR_C2.`
                        ],
                        "Plug": [
                            `USER_TAG brushes the VAR_C2 against TARGET_TAG, but there is a chastity belt in the way...`
                        ],
                        "Wand": [
                            `USER_TAG grabs a VAR_C2 but can't apply it to TARGET_TAG for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to place a piece of ice on TARGET_TAG, but can't! (this is a bug, report!)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head... but some unseen force stops USER_THEM. (this is a bug report!)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to add a VAR_C2 to TARGET_TAG, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG grabs a pair of VAR_C2 and places them gingerly on TARGET_TAG's breasts! It hums at VAR_C3 power!`
                    ],
                    "Vibrator": [
                        `USER_TAG grabs a VAR_C2 and inserts it into TARGET_TAG! It vibrates at VAR_C3!`
                    ],
                    "Plug": [
                        `USER_TAG grabs a VAR_C2 with a width of VAR_C3 and lubricates it before inserting it into TARGET_TAG!`
                    ],
                    "Wand": [
                        `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY lustfully shoveUSER_S it into TARGET_TAG's crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a piece of ice onto TARGET_TAG's crotch, cooling TARGET_THEM off...`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG slowly lowers a VAR_C2 on TARGET_TAG's head, smiling as TARGET_THEY makeTARGET_S soft sounds of pleasure!`,
                        },
                    ],
                    default: [
                        `USER_TAG potentially summons a black hole putting a VAR_C2 on TARGET_TAG at VAR_C3! (This is a bug, report!)`
                    ]
                }
            }
        }
    },
    toyreflect: [
        `Gagbot recognizes what you're attempting to do. Cheeky.`
    ]
}