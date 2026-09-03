exports.texts_unheadwear = {
    noneworn: {
        self: [
            `You're not wearing any headgear!`
        ],
        other: [
            `TARGET_TAG isn't wearing any headgear!`
        ]
    },
	heavy: {
		self: {
			single: {
				worn: [`USER_TAG tries to use the wall to push off the VAR_C2 on USER_THEIR face, but can't really get any leverage!`],
				// Ephemeral
				noworn: [`You aren't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`USER_TAG tries to use the wall to push off the headgear on USER_THEIR face, but can't really get any leverage!`],
				// Ephemeral
				noworn: [`You aren't wearing any head restraints, but you couldn't remove them anyway!`],
			},
		},
		other: {
			single: {
				worn: [`USER_TAG brushes up against TARGET_TAG, trying to peel off the VAR_C2 stuck on TARGET_THEIR head, but it holds firmly!`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`USER_TAG brushes up against TARGET_TAG, trying to peel off the headwear stuck on TARGET_THEIR head, but it all holds firmly!`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`],
			},
		},
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
                    ],
				},
				multiple: {
					worn: [
                        `USER_TAG paws at USER_THEIR head restraints, trying to scoot them off of USER_THEIR head! No fingers makes it impossible to slip any off!`
                    ],
					// Ephemeral
					noworn: [
                        `You aren't wearing any head restraints, but you couldn't remove them anyway!`
                    ],
				},
			},
			other: {
				single: {
					worn: [
                        `USER_TAG paws at the VAR_C2 on TARGET_TAG's head, trying to inch it off of TARGET_THEIR face!`
                    ],
					// Ephemeral
					noworn: [
                        `TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`
                    ],
				},
				multiple: {
					worn: [
                        `USER_TAG paws at the head gear on TARGET_TAG's head, trying to inch it all off of TARGET_THEIR face!`
                    ],
					// Ephemeral
					noworn: [
                        `TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`
                    ],
				},
			},
		},
		nomitten: {
			self: {
				single: {
                    noaccess: [
                        `USER_TAG tries to put a finger underneath the VAR_C2 to get some leverage and remove it, but the locks keep it firmly secured to USER_THEIR head!`,
                        `Despite USER_THEIR best efforts, the VAR_C2 does not budge from USER_TAG's head without the key. USER_THEY_CAP should find who has it and ask for it back.`
                    ],
                    locked: [
                        `USER_TAG carefully undoes the straps on the VAR_C2, gently pulling it off of USER_THEIR head!`,
                        `USER_TAG runs USER_THEIR fingers carefully over the VAR_C2 and undoes it, letting it fall gently into USER_THEIR lap.`,
                        `The VAR_C2 slips off slowly as the straps on it are unbuckled, freeing USER_TAG from it's effects!`,
                        // Twice as likely on blindfolds. 
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `USER_TAG blinks and squints as USER_THEIR eyes adjust to the light again after being in the darkness from the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `USER_TAG blinks and squints as USER_THEIR eyes adjust to the light again after being in the darkness from the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockemote
                            },
                            text: `USER_TAG's face is no longer hidden as USER_THEY removeUSER_S the VAR_C2!`
                        },
                    ],
					worn: [
                        `USER_TAG carefully undoes the straps on the VAR_C2, gently pulling it off of USER_THEIR head!`,
                        `USER_TAG runs USER_THEIR fingers carefully over the VAR_C2 and undoes it, letting it fall gently into USER_THEIR lap.`,
                        `The VAR_C2 slips off slowly as the straps on it are unbuckled, freeing USER_TAG from it's effects!`,
                        // Twice as likely on blindfolds. 
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `USER_TAG blinks and squints as USER_THEIR eyes adjust to the light again after being in the darkness from the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `USER_TAG blinks and squints as USER_THEIR eyes adjust to the light again after being in the darkness from the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockemote
                            },
                            text: `USER_TAG's face is no longer hidden as USER_THEY removeUSER_S the VAR_C2!`
                        },
                    ],
					// Ephemeral
					noworn: [`You aren't currently wearing a VAR_C2!`],
				},
				multiple: {
					worn: [`USER_TAG carefully undoes the straps on all of the headgear USER_THEY USER_ISARE wearing, gently pulling it off of USER_THEIR head, one by one!`],
					// Ephemeral
					noworn: [`You aren't currently wearing any headgear!`],
				},
			},
			other: {
				single: {
                    noaccess: [
                        `USER_TAG tugs against the VAR_C2 on TARGET_TAG's head, but without some elaborate lockpicking tools, there's no hope of undoing the locks on it!`,
                        `Sadly, USER_TAG does not have the key to unlock the VAR_C2 on TARGET_TAG's head. A shame.`
                    ],
					locked: [
                        `USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR VAR_C2 and taking it off!`,
                        `USER_TAG carefully slips the VAR_C2 off of TARGET_TAG's head, granting TARGET_THEM just a small semblance of freedom!`,
                        // Twice as likely on blindfolds. 
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `TARGET_TAG blinks and squints as TARGET_THEIR eyes adjust to the light again after USER_TAG rescues USER_THEM from the darkness of the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `TARGET_TAG blinks and squints as TARGET_THEIR eyes adjust to the light again after USER_TAG rescues USER_THEM from the darkness of the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockemote
                            },
                            text: `TARGET_TAG's face is no longer hidden as USER_TAG removes the VAR_C2!`
                        },
                    ],
                    worn: [
                        `USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR VAR_C2 and taking it off!`,
                        `USER_TAG carefully slips the VAR_C2 off of TARGET_TAG's head, granting TARGET_THEM just a small semblance of freedom!`,
                        // Twice as likely on blindfolds. 
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `TARGET_TAG blinks and squints as TARGET_THEIR eyes adjust to the light again after USER_TAG rescues USER_THEM from the darkness of the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockinspect
                            },
                            text: `TARGET_TAG blinks and squints as TARGET_THEIR eyes adjust to the light again after USER_TAG rescues USER_THEM from the darkness of the VAR_C2!`
                        },
                        {
                            required: (t) => {
                                return getBaseHeadwear[t.headwearchoice]?.blockemote
                            },
                            text: `TARGET_TAG's face is no longer hidden as USER_TAG removes the VAR_C2!`
                        },
                    ],
					// Ephemeral
					noworn: [`TARGET_TAG isn't currently wearing a VAR_C2!`],
				},
				multiple: {
					worn: [`USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR head restraints and peeling them all off!`],
					// Ephemeral
					noworn: [`TARGET_TAG isn't currently wearing any headgear!`],
				},
			},
		},
	},
};