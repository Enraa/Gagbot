exports.texts_uncollar = {
	heavy: {
		self: {
			collar: [
                `USER_TAG crinks USER_THEIR neck, trying to take off USER_THEIR collar, but without USER_THEIR arms due to USER_THEIR VAR_C1, USER_THEY can't!`,
                {
                    only: (t) => {
                        return t.c2.includes("Handcuff Amulet");
                    },
                    text: `USER_TAG tries to wriggle USER_THEIR upper shoulders, but makes no progress at actually unclasping USER_THEIR necklace.`,
                },
            ],
			// Ephemeral
			nocollar: [`You aren't wearing a collar, but you wouldn't be able to take it off even if you were!`],
		},
		other: {
			collar: [
                `USER_TAG wriggles towards TARGET_TAG, trying to take off TARGET_THEIR collar, but USER_THEY needUSER_S arms to unlock and undo the buckle!`,
                {
                    only: (t) => {
                        return t.c2.includes("Handcuff Amulet");
                    },
                    text: `USER_TAG tries to roll towards TARGET_TAG to help undo the amulet around TARGET_TAG's neck, but unfortunately can't do too much without USER_THEIR arms.`,
                },
            ],
			// Ephemeral
			nocollar: [`TARGET_TAG is not wearing a collar, but you wouldn't be able to take it off anyway!`],
		},
	},
	noheavy: {
		self: {
			collar: { 
                key: [
                    `USER_TAG leans forward to let USER_THEIR hair fall forward, then puts a key in the tiny lock and unlocks USER_THEIR collar, undoing the buckle and putting it away!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG reaches up behind USER_THEIR neck and undoes the clasp holding USER_THEIR VAR_C2 around USER_THEIR neck. It gently falls into USER_THEIR other hand and USER_THEY putUSER_S it away.`,
                    },
                ], 
                nokey: [
                    `USER_TAG tugs at USER_THEIR collar, trying to adjust and maybe take it off, but without the key USER_THEY can't really take it off!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG runs USER_THEIR fingers along USER_THEIR VAR_C2, but since USER_THEY promised not to remove it without permission, USER_THEY decideUSER_S to keep it on.`,
                    },
                ],
                nolock: [
                    `USER_TAG undoes the strap holding USER_THEIR collar on USER_THEIR neck, smiling as the cool air touches USER_THEIR neck once more. The collar is put away for later use.`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG reaches up and undoes the little clasp holding USER_THEIR VAR_C2 on USER_THEIR neck. The fashionable kinky necklace is returned to it's rightful box to be worn next time!`,
                    },
                ]
            },
			// Ephemeral
			nocollar: [`You're not wearing a collar!`],
		},
		other: {
			collar: {
				key: [
                    `USER_TAG puts a key in TARGET_TAG's collar, unlocking it and undoing the strap around TARGET_THEIR neck.`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG carefully undoes the clasp on TARGET_TAG's amulet and presents it to TARGET_THEM to put away.`,
                    },
                ],
				nokey: {
					// Ephemeral
					nokeyholderonly: [
                        `TARGET_TAG's collar is unlocked, but it would be impolite to take it off!`,
                        {
                            only: (t) => {
                                return t.c2.includes("Handcuff Amulet");
                            },
                            text: `TARGET_TAG hasn't promised TARGET_THEIR necklace to anyone!`,
                        },
                    ],
					// Ephemeral
					keyholderonly: [
                        `You don't have the key for TARGET_TAG's collar!`,
                        {
                            only: (t) => {
                                return t.c2.includes("Handcuff Amulet");
                            },
                            text: `TARGET_TAG hasn't promised TARGET_THEIR necklace to you!`,
                        },
                    ],
				},
                nolock: [
                    `USER_TAG undoes the strap on TARGET_TAG's collar before gently pulling it off of TARGET_THEIR neck.`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG carefully undoes the clasp on TARGET_TAG's amulet and presents it to TARGET_THEM to put away.`,
                    },
                ],
			},
			// Ephemeral
			nocollar: [`TARGET_TAG is not wearing a collar!`],
		},
	},
};