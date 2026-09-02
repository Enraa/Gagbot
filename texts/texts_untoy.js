const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_untoy = {
    heavy: {
        self: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to take off USER_THEIR VAR_C2, but because USER_THEY USER_HAVE no arms, USER_THEY can't get very far!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips to take off USER_THEIR VAR_C2, but can't because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG twists USER_THEIR thighs slightly, but can't click the button on USER_THEIR VAR_C2 to turn it off!`
                ],
                "Plug": [
                    `USER_TAG flexes USER_THEIR hip muscles to squeeze out of the VAR_C2... but it's still quite secure inside USER_THEM!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice on USER_THEIR crotch... but can't grip it without hands!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG tries to put a VAR_C2 on TARGET_TAG's head, but fumbles and drops the tool!`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to take off USER_THEIR VAR_C2, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to remove USER_THEIR VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock USER_THEIR chastity bra to put them on!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips to remove USER_THEIR VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR chastity belt prevents USER_THEM from getting to it.`,
						{
							only: (t) => {
								return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
							},
							text: `USER_TAG bucks USER_THEIR hips to remove USER_THEIR VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR seal traps it inside USER_THEM.`,
						},
                ],
                "Wand": [
                    `USER_TAG twists USER_THEIR thighs slightly, but can't click the button on USER_THEIR VAR_C2 to turn it off! (this is a bug, please report)`
                ],
                "Plug": [
                    `USER_TAG flexes USER_THEIR hip muscles to squeeze out of the VAR_C2 since USER_THEY can't reach it through USER_THEIR chastity belt!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice, but is blocked for some reason?! (this is a bug, report!)`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG attempts to remove the VAR_C2 but... something stops USER_THEM? (this is a bug!)`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove USER_THEIR VAR_C2 from USER_THEMSELF, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to remove it! (This is a bug, report)`
                ]
            }
        },
        other: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to remove TARGET_TAG's VAR_C2, but struggles to remove them because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards TARGET_TAG to remove USER_THEIR VAR_C2, but USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG wiggles towards TARGET_TAG, but can't click the button on TARGET_THEIR VAR_C2 to turn it off!`
                ],
                "Plug": [
                    `USER_TAG tries to reach toward TARGET_TAG to help USER_THEM with taking USER_THEIR VAR_C2 out, with the sense of encouragement since USER_THEY USER_HAVE no fingers with which to grip it!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice on TARGET_TAG's crotch... but can't grip it without hands!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG tries to remove the VAR_C2 from TARGET_TAG's head but fails to get a good grip on it.`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove the VAR_C2 on TARGET_TAG, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to remove the VAR_C2 from TARGET_TAG, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock TARGET_THEIR chastity bra to get to them!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards TARGET_TAG to remove TARGET_THEIR VAR_C2 despite USER_THEIR VAR_C1. TARGET_THEIR_CAP chastity belt prevents USER_THEM from removing the toy anyway, though.`
                ],
                "Wand": [
                    `USER_TAG wiggles towards TARGET_TAG, but can't click the button on TARGET_THEIR VAR_C2 to turn it off! (this is a bug, please report)`
                ],
                "Plug": [
                    `USER_TAG tries to reach toward TARGET_TAG to help USER_THEM with taking USER_THEIR VAR_C2 out! Both a chastity belt and arm bondage stand in the way, though which is causing more of a hindrance remains to be seen.`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice, but is blocked for some reason?! (this is a bug, report!)`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "Scalp Massager")
                        },
                        text: `USER_TAG tries to remove the VAR_C2 but a hot dog truck stops USER_THEM. (this is a bug, report!)`,
                    },
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove a VAR_C2 from TARGET_TAG, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to remove it! (This is a bug, report)`
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
                                        `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                {
                                    only: (t) => {
                                        return (t.c2 == "Clover Clamps")
                                    },
                                    text: `USER_TAG puts the key in USER_THEIR bra, unlocking it for just a moment before gently pinching the VAR_C2, gasping in hazy delight as the blood rushes back to USER_THEIR nipples! After a brief moment of repose, USER_THEY lockUSER_S USER_THEIR bra back up!`
                                },
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and removing USER_THEIR VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and removing USER_THEIR VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and sliding out USER_THEIR VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG presses the button on USER_THEIR VAR_C2, turning off the pleasurable vibrations for now...`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG removes the frigid ice from USER_THEIR crotch!`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG slowly removes the VAR_C2 from atop USER_THEIR head.`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it and removing USER_THEIR VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to remove USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to remove USER_THEIR VAR_C2.`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG tries as USER_THEY might, but is unable to breach the protections of USER_THEIR seal to remove USER_THEIR VAR_C2.`,
							},
                        ],
                        "Plug": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to remove USER_THEIR VAR_C2.`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG tries as USER_THEY might, but is unable to breach the protections of USER_THEIR seal to remove USER_THEIR VAR_C2.`,
							},
                        ],
                        "Wand": [
                            `USER_TAG tries to press the button on USER_THEIR VAR_C2, but... can't? (this is a bug, please report)`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to remove the ice but can't?! (This is a bug, report!)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG attempts to displace the VAR_C2, but some magic said no. (This is a bug, report!)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to remove USER_THEIR VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG removes the teasing VAR_C2 from USER_THEIR breasts. The sensation continues to haunt USER_THEM as USER_THEY putUSER_S them away.`,
                        {
                            only: (t) => {
                                return (t.c2 == "Clover Clamps")
                            },
                            text: `USER_TAG carefully reaches up and unclasps the VAR_C2 from USER_THEIR nipples, letting out a moan mixed with delight and adrenaline as the blood rushes back to them!`
                        },
                    ],
                    "Vibrator": [
                        `USER_TAG gently removes the VAR_C2 from inside USER_THEM and puts it away. `
                    ],
                    "Plug": [
                        `USER_TAG gently slides out the VAR_C2 from inside USER_THEM and puts it away. `
                    ],
                    "Wand": [
                        `USER_TAG presses the button on USER_THEIR VAR_C2, turning off the pleasurable vibrations for now...`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG removes the frigid ice from USER_THEIR crotch!`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG slowly removes the VAR_C2 from atop USER_THEIR head.`,
                        },
                    ],
                    default: [
                        `USER_TAG materializes a tear in reality to remove the VAR_C2 from USER_THEM! (This is a bug, report)`
                    ],
                }
            },
            notoy: [
                `You are not wearing a VAR_C2!`
            ]
        },
        other: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                {
                                    only: (t) => {
                                        return (t.c2 == "Clover Clamps")
                                    },
                                    text: `USER_TAG puts the key into TARGET_TAG's bra, unlocking it and carefully pinching the VAR_C2 to slip them off, giggling as TARGET_TAG meeps from the sensations of the blood rushing back to USER_THEIR nipples! While distracted, USER_THEY lockUSER_S the bra back onto TARGET_THEM.`
                                },
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and removing the VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Plug": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and sliding out the VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG presses the button on TARGET_TAG's VAR_C2, turning off the pleasurable vibrations for now...`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG removes the frigid ice from TARGET_TAG's crotch!`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG finally removes the amazing feeling VAR_C2 from TARGET_TAG's head.`,
                            },
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it and removing TARGET_THEIR VAR_C2! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to remove USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to remove USER_THEIR VAR_C2.`
                        ],
                        "Plug": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to remove USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG tries to press the button on TARGET_TAG's VAR_C2, but... can't? (this is a bug, please report)`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to remove the ice from TARGET_TAG... but can't access it somehow. (this is a bug, report!)`,
                            },
                            {
                                only: (t) => {
                                    return (t.c2 == "Scalp Massager")
                                },
                                text: `USER_TAG tries to remove the VAR_C2 from TARGET_TAG but somehow can't touch it. (report!)`,
                            },
                        ],
                        default: [
                            `USER_TAG tries to remove TARGET_TAG's VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        {
                            only: (t) => {
                                return (t.c2 == "Clover Clamps")
                            },
                            text: `USER_TAG runs USER_THEIR fingers over TARGET_TAG's breasts, removing the VAR_C2 carefully with a smile as TARGET_THEIR face twists in a variety of pleasurable sensations!`
                        },
                        `USER_TAG removes the teasing VAR_C2 from TARGET_TAG's breasts. The sensation continues to haunt TARGET_THEM as USER_THEY putUSER_S them away.`
                    ],
                    "Vibrator": [
                        `USER_TAG gently removes the VAR_C2 from inside TARGET_TAG and puts it away. `
                    ],
                    "Plug": [
                        `USER_TAG gently slides out the VAR_C2 from inside TARGET_TAG and puts it away. `
                    ],
                    "Wand": [
                        `USER_TAG presses the button on TARGET_TAG's VAR_C2, turning off the pleasurable vibrations for now...`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG removes the frigid ice from TARGET_TAG's crotch!`,
                        },
                        {
                            only: (t) => {
                                return (t.c2 == "Scalp Massager")
                            },
                            text: `USER_TAG finally removes the amazing feeling VAR_C2 from TARGET_TAG's head.`,
                        },
                    ],
                    default: [
                        `USER_TAG materializes a tear in reality to remove the VAR_C2 from TARGET_TAG! (This is a bug, report)`
                    ],
                }
            },
            notoy: [
                `TARGET_TAG is not wearing a VAR_C2!`
            ]
        }
    },
    toyreflect: [
        `Gagbot recognizes what you're attempting to do. Cheeky.`
    ]
}