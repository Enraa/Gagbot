exports.texts_corset = {
	heavy: {
		self: [
            `USER_TAG looks at a VAR_C4, but USER_THEY USER_ISARE is still tightly bound in a VAR_C1 and can't effectively hold the laces!`
        ],
		other: [
            `USER_TAG bumps into a VAR_C4 with USER_THEIR hip. Sadly, because hips don't have fingers, TARGET_TAG cannot be corseted! If only USER_THEY USER_WERENT in an unyielding VAR_C1, USER_THEY might be able to bind TARGET_THEM`
        ],
	},
	noheavy: {
		/*chastity: {
			key: {
				fumble: {
					discard: {
						self: {
							corset: { keyholder: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so USER_THEY will remain just as out of breath as before!`], clone: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! The key poofs in smoke as it falls on the floor!`] },
							nocorset: { keyholder: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! Hopefully USER_THEY can find it soon!`], clone: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! A tiny crack is heard as the cloned key is damaged beyond repair!`] },
						},
						other: {
							corset: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust TARGET_THEIR VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so TARGET_TAG will remain just as out of breath as before!`], clone: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust TARGET_THEIR VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! The key vanishes to smoke, dooming TARGET_TAG to remain out of breath.`] },
							nocorset: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's belt to put a VAR_C4 on TARGET_THEM, but fumbles with the key so much that it falls on the floor somewhere! Sorry TARGET_TAG!`], clone: [`USER_TAG tries to unlock TARGET_TAG's belt to put a VAR_C4 on TARGET_THEM, but fumbles with the key so much that it falls on the floor, shattering into a hundred pieces! Sorry TARGET_TAG!`] },
						},
					},
					nodiscard: {
						self: { corset: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key, so USER_THEYLL have to keep taking *short* breaths!`], nocorset: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so TARGET_TAG will remain without one!`] },
						other: { corset: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust the VAR_C4 but fumbles with the key so TARGET_THEY will remain just as out of breath as before!`], nocorset: [`USER_TAG tries to unlock TARGET_TAG's belt to put on a VAR_C4 but fumbles with the key so TARGET_THEY will remain without one!`] },
					},
				},
				nofumble: {
					self: {
						corset: { tighter: [`USER_TAG unlocks USER_THEIR belt, pulling the strings on the VAR_C4 even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`], looser: [`USER_TAG unlocks USER_THEIR belt, carefully loosening the strings on the VAR_C4, taking a deep breath as USER_THEY can breathe! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`] },
						nocorset: [`USER_TAG unlocks USER_THEIR belt and then puts a VAR_C4 on USER_THEMSELF, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S USER_THEMSELF back up!`],
						newcorset: [`USER_TAG unlocks USER_THEIR belt and removes USER_THEIR VAR_C3 and replaces it with a VAR_C4, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S USER_THEMSELF back up!`]
					},
					other: {
						corset: { tighter: [`USER_TAG unlocks TARGET_TAG's belt, pulling the strings on the VAR_C4 even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`], looser: [`USER_TAG unlocks TARGET_TAG's belt, carefully loosening the strings on the VAR_C4! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`] },
						nocorset: [`USER_TAG unlocks TARGET_TAG's belt and then puts a VAR_C4 on TARGET_THEM, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S TARGET_THEM back up!`],
						newcorset: [`USER_TAG unlocks TARGET_TAG's belt and removes TARGET_THEIR VAR_C3 and replaces it with a VAR_C4, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S TARGET_THEM back up!`],
					},
				},
			},
			nokey: { self: { corset: [`USER_TAG tugs at USER_THEIR VAR_C4, but since USER_THEY can't unlock USER_THEIR chastity belt, USER_THEY will have to tolerate the lightheadedness!`], nocorset: [`USER_TAG dances USER_THEIR fingers on USER_THEIR belt while eying a VAR_C4, but USER_THEY won't be able to put it on because USER_THEY can't unlock USER_THEIR chastity belt!`] }, other: [`You do not have the key for TARGET_TAG's chastity belt!`] },
		},*/
		nochastity: {
			self: {
                noaccess: [
                    `USER_TAG prods at the lock on USER_THEIR corset. Unfortunately, USER_THEIR breaths must remain short until USER_THEY can take the lock off of it! Such beautiful curves!`
                ],
                locked: {
                    corset: { 
                        tighten: [
                            `USER_TAG grabs the strings on USER_THEIR VAR_C4, pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEIR_CAP breaths become shallower.`
                        ], 
                        loosen: [
                            `USER_TAG grabs the strings on USER_THEIR VAR_C4, carefully loosening them with a sigh of relief! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`
                        ] 
                    },
                    newcorset: [
                        `USER_TAG removes the VAR_C3 around USER_THEIR waist and replaces it with a VAR_C4, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`
                    ]
                },
                nolocked: {
                    corset: { 
                        tighten: [
                            `USER_TAG grabs the strings on USER_THEIR VAR_C4, pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEIR_CAP breaths become shallower.`
                        ], 
                        loosen: [
                            `USER_TAG grabs the strings on USER_THEIR VAR_C4, carefully loosening them with a sigh of relief! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`
                        ] 
                    },
                    newcorset: [
                        `USER_TAG removes the VAR_C3 around USER_THEIR waist and replaces it with a VAR_C4, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`
                    ]
                },
				nocorset: [`USER_TAG wraps a VAR_C4 around USER_THEIR waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
			},
			other: {
                noaccess: [
                    `USER_TAG baps at the dangling lock on TARGET_TAG's corset, but unfortunately has no means with which to grant TARGET_THEM the freedom to breathe. If only TARGET_THEY had the key...`
                ],
                locked: {
                    corset: { tighten: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, bracing with USER_THEIR knee, and pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`], loosen: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, tugging on the laces carefully to loosen them a bit! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`] },
                    nocorset: [`USER_TAG wraps a VAR_C4 around TARGET_TAG's waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
                },
                nolocked: {
                    corset: { tighten: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, bracing with USER_THEIR knee, and pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`], loosen: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, tugging on the laces carefully to loosen them a bit! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`] },
                    nocorset: [`USER_TAG wraps a VAR_C4 around TARGET_TAG's waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
                },
				newcorset: [`USER_TAG removes the VAR_C3 around TARGET_TAG's waist and replaces it with a VAR_C4, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
			},
		},
	},
};