exports.texts_gag = {
	heavy: {
		self: { 
            gag: [
                `USER_TAG looks at a VAR_C3, attempting to put it on over USER_THEIR gag! Maybe if USER_THEY had fingers USER_THEY could add it!`,
                `USER_TAG squirms in USER_THEIR VAR_C2, but alas, it does not allow USER_THEM to have arms to add a VAR_C3...`,
                `Drool covers USER_TAG's gags, but they must remain in place because USER_THEY USER_HAVE no arms. Maybe someone should help USER_THEM with a VAR_C3!`
            ], 
            nogag: [
                `USER_TAG squirms a bit, but USER_THEIR arms are trapped! Someone should help USER_THEM with putting a VAR_C3 on!`,
                `USER_TAG rolls over a VAR_C3, but can't get a good grip on it to put it on without hands...`,
                `USER_TAG tries USER_THEIR best to poke a VAR_C3, silently pleading to others to put it on USER_THEM!`
            ] 
        },
		other: { 
            gag: [
                `USER_TAG uses USER_THEIR toes to pick up a VAR_C3 by the straps and put it on TARGET_TAG, but without arms, USER_THEY can't undo TARGET_THEIR VAR_C4 to switch it out!`,
                `USER_TAG bats a VAR_C3 over towards TARGET_TAG to put it on TARGET_THEM, but USER_THEY USER_HAVE no arms with which to pick it up and secure it in TARGET_THEIR mouth!`
            ], 
            nogag: [
                `USER_TAG flops over a table to pick up a VAR_C3 and take it over to TARGET_TAG and put it on TARGET_THEM, but USER_THEY lackUSER_S arms and fingers to work with the straps!`,
                `USER_TAG cutely squirms over a VAR_C3, trying USER_THEIR very best to put it on TARGET_TAG. No fingers makes the task quite impossible, though.`,
                `USER_TAG wants to take away TARGET_TAG's words with a VAR_C3. The jury is out on whether there'll be any success here since USER_THEY USER_ISARE quite bound...`
            ] 
        },
	},
	noheavy: {
		mitten: { 
            other: { 
                gag: [
                    `USER_TAG attempts to pick up a VAR_C3 to further gag TARGET_TAG, but drops it because of USER_THEIR mittens!`,
                    `USER_TAG vainly paws at a VAR_C3 while eying TARGET_TAG, but without fingers, USER_THEY can't pick it up anyway.`
                ], 
                nogag: [
                    `USER_TAG attempts to gag TARGET_TAG, but fumbles at holding the VAR_C3 in USER_THEIR mittens!`,
                    `Despite USER_THEIR mittens, USER_TAG manages to pick up a VAR_C3 and moves towards TARGET_TAG. Sadly, the straps require a bit more finesse. USER_THEY_CAP lookUSER_S down dejectedly as USER_THEY realizeUSER_S this.`,
                    `USER_TAG throws a VAR_C3 at TARGET_TAG. It's about the best USER_THEY can do because of USER_THEIR mittens...`
                ] 
            }, 
            self: [
                `USER_TAG uses both of USER_THEIR mittens to pick up a VAR_C3, but can't secure the straps behind USER_THEIR head anyway.`,
                `USER_TAG carefully uses one mitten to scoop a VAR_C3 up and put it on USER_THEIR head... but can't secure the straps, so it just falls out.`
            ] 
        },
		nomitten: {
			self: {
				gag: {
                    canaccess: {
                        changetightness: {
                            nolockaccess: [
                                `USER_TAG paws at USER_THEIR VAR_C3, but unfortunately the locks on it hold firm, preventing any form of adjustment! USER_THEY_CAP will just have to continue wearing it like it is now!`
                            ],
                            lockaccess: [
                                `USER_TAG adjusts USER_THEIR VAR_C3, undoing the straps before pulling them VAR_C2 around USER_THEIR head again.`,
                                `USER_TAG flexes USER_THEIR jaw holding the VAR_C3 in place, carefully adjusting the straps VAR_C2 around USER_THEIR head. It sits more comfortably now!`,
                                `USER_TAG undoes the straps on USER_THEIR VAR_C3, holding the gag carefully between USER_THEIR teeth as USER_THEY adjust it and pull the straps VAR_C2 around USER_THEIR head.`,
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over USER_THEIR mouth again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around USER_THEIR head and under USER_THEIR hair again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, pulling the material VAR_C2 around USER_THEIR head and securing it!`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, pulling the material VAR_C2 around USER_THEIR head and securing it!`,
                                },

                                //`USER_TAG carefully undoes the straps on USER_THEIR VAR_C4, allowing just a moment to let the drool fall out before replacing it with a VAR_C3, pulling the straps on it VAR_C2 before buckling.`
                            ],
                            nolock: [
                                `USER_TAG adjusts USER_THEIR VAR_C3, undoing the straps before pulling them VAR_C2 around USER_THEIR head again.`,
                                `USER_TAG flexes USER_THEIR jaw holding the VAR_C3 in place, carefully adjusting the straps VAR_C2 around USER_THEIR head. It sits more comfortably now!`,
                                `USER_TAG undoes the straps on USER_THEIR VAR_C3, holding the gag carefully between USER_THEIR teeth as USER_THEY adjust it and pull the straps VAR_C2 around USER_THEIR head.`,
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over USER_THEIR mouth again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around USER_THEIR head and under USER_THEIR hair again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, pulling the material VAR_C2 around USER_THEIR head and securing it!`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts USER_THEIR VAR_C3, pulling the material VAR_C2 around USER_THEIR head and securing it!`,
                                },

                                //`USER_TAG carefully undoes the straps on USER_THEIR VAR_C4, allowing just a moment to let the drool fall out before replacing it with a VAR_C3, pulling the straps on it VAR_C2 before buckling.`
                            ],
                        },
                        newgag: [
                            `USER_TAG sucks in what breath USER_THEY can, before adding a VAR_C3 over top of USER_THEIR VAR_C4, pulling the straps VAR_C2 before buckling.`,
                            {
                                only: (t) => {
                                    return t.c2.includes("loosely") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG sucks in what breath USER_THEY can around USER_THEIR VAR_C4, before pressing a strip of tape VAR_C2 over USER_THEIR mouth in a loose VAR_C3.`,
                            },
                            {
                                only: (t) => {
                                    return t.c2.includes("tightly") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG sucks in what breath USER_THEY can around USER_THEIR VAR_C4, before wrapping tape VAR_C2 around USER_THEIR head and under USER_THEIR hair.`,
                            },
                            {
                                only: (t) => {
                                    return t.c3.includes("OTN");
                                },
                                text: `USER_TAG sucks in what breath USER_THEY can around USER_THEIR VAR_C4, before placing a VAR_C3 VAR_C2 over top of USER_THEIR gags, making it that much harder to breathe!`,
                            },
                        ],
                    },
                    noaccess: {
                        changetightness: [
                            `USER_TAG tries to claw at the VAR_C3 around USER_THEIR mouth to adjust it, but can't reach it because of USER_THEIR facewear!`
                        ],
                        newgag: [
                            `USER_TAG holds a VAR_C3 up to USER_THEIR mouth, but USER_THEIR facewear fully prevents adding it. USER_THEIR_CAP words will remain... less garbled.`
                        ],
                    }
				},
				nogag: {
                    canaccess: [
                        `USER_TAG picks up a VAR_C3, takes a deep breath, and then pushes it between USER_THEIR teeth and pulling the straps VAR_C2 behind USER_THEIR head.`,
                        {
                            only: (t) => {
                                return t.c2.includes("loosely") && t.c3.includes("Tape");
                            },
                            text: `USER_TAG picks up a roll of tape, takes a deep breath, and then presses a strip VAR_C2 over USER_THEIR mouth and smoothing it down across USER_THEIR cheeks.`,
                        },
                        {
                            only: (t) => {
                                return t.c2.includes("tightly") && t.c3.includes("Tape");
                            },
                            text: `USER_TAG picks up a roll of tape, takes a deep breath, and then begins to wrap it VAR_C2 around USER_THEIR head and under USER_THEIR hair in a wraparound VAR_C3.`,
                        },
                        {
                            only: (t) => {
                                return t.c3.includes("OTN");
                            },
                            text: `USER_TAG picks up a VAR_C3, positioning it over USER_THEIR lips before pulling it VAR_C2 behind USER_THEIR head and then securing it firmly.`,
                        },
                    ],
                    noaccess: [
                        `USER_TAG picks up a VAR_C3 but struggles to put it on past USER_THEIR facewear. USER_THEY_CAP will just have to remain ungagged!`
                    ]
                },
			},
			other: {
				gag: {
                    canaccess: {
                        changetightness: {
                            nolockaccess: [
                                `USER_TAG gently runs USER_THEIR fingers over TARGET_TAG's VAR_C3. TARGET_THEIR speech is so helplessly taken away and not a single thing that USER_THEY could do about it!`
                            ],
                            lockaccess: [
                                `USER_TAG adjusts TARGET_TAG's VAR_C3, undoing the straps before pulling them VAR_C2 around TARGET_THEIR head again.`,
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over TARGET_THEIR mouth again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around TARGET_THEIR head and under TARGET_THEIR hair again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, pulling the material VAR_C2 around TARGET_THEIR head and securing it!`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, pulling the material VAR_C2 around TARGET_THEIR head and securing it!`,
                                },
                                //`USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
                            ],
                            nolock: [
                                `USER_TAG adjusts TARGET_TAG's VAR_C3, undoing the straps before pulling them VAR_C2 around TARGET_THEIR head again.`,
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over TARGET_THEIR mouth again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("Tape");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around TARGET_THEIR head and under TARGET_THEIR hair again.`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("tightly") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, pulling the material VAR_C2 around TARGET_THEIR head and securing it!`,
                                },
                                {
                                    only: (t) => {
                                        return t.c2.includes("loosely") && t.c3.includes("OTN");
                                    },
                                    text: `USER_TAG adjusts TARGET_TAG's VAR_C3, pulling the material VAR_C2 around TARGET_THEIR head and securing it!`,
                                },
                                //`USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
                            ],
                        },
                        newgag: [
                            `USER_TAG places a VAR_C3 against TARGET_TAG's mouth over top of TARGET_THEIR VAR_C4. The buckles are pulled VAR_C2 around TARGET_THEIR head before they are buckled again.`,
                            {
                                only: (t) => {
                                    return t.c2.includes("loosely") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG applies a VAR_C3 over TARGET_TAG's VAR_C4, pressing fresh strips of tape VAR_C2 over TARGET_THEIR mouth.`,
                            },
                            {
                                only: (t) => {
                                    return t.c2.includes("tightly") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG applies a VAR_C3 over TARGET_TAG's VAR_C4, winding a roll of tape VAR_C2 around TARGET_THEIR head and under TARGET_THEIR hair.`,
                            },
                            {
                                only: (t) => {
                                    return t.c3.includes("OTN");
                                },
                                text: `USER_TAG applies a VAR_C3 over TARGET_TAG's VAR_C4, covering TARGET_THEIR lips and nose with the new material as USER_THEY secureUSER_S the straps VAR_C2 behind TARGET_THEIR head.`,
                            },
                        ],
                    },
                    noaccess: {
                        changetightness: [
                            `USER_TAG runs USER_THEIR fingers over TARGET_TAG's face, teasing TARGET_THEM with the thoughts of adjusting TARGET_THEIR VAR_C3. Alas, TARGET_THEIR facewear is in the way. Oh well!`
                        ],
                        newgag: [
                            `USER_TAG boops a VAR_C3 into TARGET_TAG's face, but since TARGET_THEY TARGET_ISARE wearing some facewear covering TARGET_THEIR mouth, it's quite hard to reach TARGET_THEIR lips!`
                        ]
                    }
                },
				nogag: {
                    canaccess: {
                        gentle: [
                            `USER_TAG uses a finger to gently pry open TARGET_TAG's lips before inserting a VAR_C3 between TARGET_THEIR teeth, secured VAR_C2 behind TARGET_THEIR head. A muted meep follows soon after from TARGET_THEM!`,
                            `USER_TAG uses a fingernail to gently tickle TARGET_TAG's chin before carefully inserting a VAR_C3 between TARGET_THEIR teeth, pulling the straps VAR_C2 behind TARGET_THEIR head.`,
                            `USER_TAG uses USER_THEIR thumb and gently rubs TARGET_TAG's cheek before pushing the VAR_C3 into TARGET_THEIR mouth. The straps are then slowly pulled VAR_C2 behind TARGET_THEIR head.`,
                            {
                                only: (t) => {
                                    return t.c2.includes("loosely") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG places a finger gently on TARGET_TAG's lips and waits for them to stop talking before gently pressing fresh strips of tape VAR_C2 over TARGET_THEIR mouth, sealing it shut.`,
                            },
                            {
                                only: (t) => {
                                    return t.c2.includes("tightly") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG taps a finger gently on TARGET_TAG's lips and waits for them to stop talking before carefully winding a roll of tape VAR_C2 around TARGET_THEIR head to form a VAR_C3.`,
                            },
                            {
                                only: (t) => {
                                    return t.c3.includes("OTN");
                                },
                                text: `USER_TAG holds up a VAR_C3, gently massaging TARGET_TAG's lips before placing it VAR_C2 over them, securing the straps behind TARGET_THEIR head.`,
                            },
                        ],
                        forceful: [
                            `USER_TAG takes a VAR_C3 out and brushes the hair out of TARGET_TAG's face, before pinching TARGET_THEIR nose for a moment and shoving the gag between TARGET_THEIR teeth when TARGET_THEY goTARGET_ES to breathe! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled shut!`,
                            `USER_TAG holds up a VAR_C3, pressing it against TARGET_TAG's lips with ever increasing force until they part, taking away TARGET_THEIR ability to speak coherently! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled under TARGET_THEIR hair!`,
                            `USER_TAG takes a VAR_C3 and pries TARGET_TAG's lips apart to put it into TARGET_THEIR mouth. TARGET_THEY_CAP barely has time to react as the straps are pulled VAR_C2 behind TARGET_THEIR head!`,
                            {
                                only: (t) => {
                                    return t.c2.includes("loosely") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG pinches TARGET_TAG's lips shut before VAR_C2 sealing them with strips of tape.`,
                            },
                            {
                                only: (t) => {
                                    return t.c2.includes("tightly") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG pinches TARGET_TAG's lips shut before VAR_C2 winding a roll of tape around TARGET_THEIR head to form a VAR_C3.`,
                            },
                            {
                                only: (t) => {
                                    return t.c3.includes("OTN");
                                },
                                text: `USER_TAG uses a hand to cover TARGET_TAG's lips and silence TARGET_THEIR protest *forcefully* before covering them with a VAR_C3 and pulling the straps VAR_C2 behind TARGET_THEIR head!`,
                            },
                        ],
                        requesting: [
                            `USER_TAG taps TARGET_TAG's lips, silently suggesting to say "ahh" before pushing a VAR_C3 VAR_C2 between TARGET_THEIR lips!`,
                            `USER_TAG wraps an arm around TARGET_TAG, with a finger brushing the back of TARGET_THEIR cheek as a VAR_C3 is proffered to TARGET_THEM. USER_THEY_CAP waitUSER_S for TARGET_THEM to bite it before pulling the straps VAR_C2 behind TARGET_THEIR head.`,
                            `USER_TAG holds up a VAR_C3, grinning as TARGET_TAG eyes it with a hint of desire as TARGET_THEY openTARGET_S TARGET_THEIR mouth and bites it! USER_THEY_CAP then pulls the straps VAR_C2 behind TARGET_THEIR head and buckles them!`,
                            {
                                only: (t) => {
                                    return t.c2.includes("loosely") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG taps on TARGET_TAG's lips, silently suggesting they keep them closed before VAR_C2 sealing them with strips of tape.`,
                            },
                            {
                                only: (t) => {
                                    return t.c2.includes("tightly") && t.c3.includes("Tape");
                                },
                                text: `USER_TAG taps on TARGET_TAG's lips, silently suggesting they keep them closed before VAR_C2 winding a roll of tape around TARGET_THEIR head to form a VAR_C3.`,
                            },
                            {
                                only: (t) => {
                                    return t.c3.includes("OTN");
                                },
                                text: `USER_TAG gives TARGET_TAG a moment to finish speaking before gently placing a VAR_C3 over TARGET_THEIR lips, securing the straps of the gag VAR_C2 behind TARGET_THEIR head!`,
                            },
                        ],
                    },
                    noaccess: [
                        `USER_TAG holds a VAR_C3 up to TARGET_TAG's pretty lips. But since TARGET_THEY TARGET_ISARE wearing something over them, USER_THEY USER_ISARE unable to put the gag on TARGET_THEM. TARGET_THEIR_CAP speech remains unbound!`
                    ]
				},
			},
		},
	},
	gagreflect: {
        heavy: {
            other: {
                gag: [
                    `TARGET_TAG tries TARGET_THEIR best to place a gag on USER_TAG. Unfortunately, being bound in restraints makes it incredibly hard even before trying to place a gag on an agile bot. It decides that TARGET_THEY TARGET_ISARE already gagged enough though.`
                ],
                nogag: [
                    `TARGET_TAG tries TARGET_THEIR best to place a gag on USER_TAG. Unfortunately, being bound in restraints makes it incredibly hard even before trying to place a gag on an agile bot. It laughs at TARGET_THEM in response and leaves TARGET_THEM ungagged.`
                ]
            }
        },
		noheavy: {
			nomitten: {
				other: {
					gag: {
                        canaccess: {
                            changetightness: [
							`TARGET_TAG is cheeky and tries to gag USER_TAG, but USER_TAG gets the upper hand and adjusts the tightness on the VAR_C4 that TARGET_THEY TARGET_ISARE wearing, pulling the straps VAR_C2.`,
							//`USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
                            ],
                            newgag: [`USER_TAG looks at TARGET_TAG flatly as it instead takes the VAR_C3 and puts it on TARGET_THEM over top of the VAR_C4.`],
                        },
                        noaccess: [
                            `USER_TAG looks at TARGET_TAG sternly as TARGET_THEY go to gag USER_THEM. USER_THEY_CAP considerUSER_S putting the gag on TARGET_THEM instead, but there is a muzzle in the way. TARGET_THEY_CAP TARGET_ISARE spared USER_THEIR wrath.`
                        ]
					},
					nogag: {
                        canaccess: {
                            gentle: [`USER_TAG grabs the VAR_C3 and then uses a robotic arm to gently caress TARGET_TAG's cheek, before putting it on TARGET_THEM, pulling the straps VAR_C2 and buckling them.`],
						    forceful: [`TARGET_TAG tries to gag USER_TAG, but USER_TAG's deft agility allows it to wrestle the gag out of TARGET_THEIR hands before shoving it into TARGET_THEIR mouth instead.`],
						    requesting: [`TARGET_TAG presents a gag to USER_TAG. It is somewhat unamused and points at TARGET_THEM to wear it instead. TARGET_THEY_CAP feelTARGET_S compelled to obey the order.`],
                        },
						noaccess: [
                            `USER_TAG looks at TARGET_TAG sternly as TARGET_THEY go to gag USER_THEM. USER_THEY_CAP considerUSER_S putting the gag on TARGET_THEM instead, but there is a muzzle in the way. TARGET_THEY_CAP TARGET_ISARE spared USER_THEIR wrath.`
                        ]
					},
				},
			},
		},
	},
};