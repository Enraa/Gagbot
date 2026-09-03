exports.texts_headwear = {
	heavy: {
		self: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`],
			noworn: [`USER_TAG scoots against a VAR_C2, but USER_THEY can only move it around a couple of inches, much less lift it because of USER_THEIR VAR_C1!`],
		},
		other: {
			// Ephemeral
			worn: [`TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`],
			noworn: [`USER_TAG boops a VAR_C2 towards TARGET_TAG, but USER_THEY can't really put it on TARGET_THEM because of USER_THEIR VAR_C1. USER_THEY_CAP should grow arms!`],
		},
	},
	noheavy: {
		mitten: {
			self: { worn: [`You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`], noworn: [`USER_TAG fumbles with a VAR_C2, trying to put it on USER_THEIR head, but can't grip it well enough!`] },
			other: {
				// Ephemeral
				worn: [`TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`],
				noworn: [`USER_TAG uses both mittens and throws a VAR_C2 towards TARGET_TAG, indicating to put it on. USER_THEY_CAP can't put it on TARGET_THEM though.`],
			},
		},
		nomitten: {
			self: {
				// Ephemeral
				worn: [`You are already wearing a VAR_C2!`],
				noworn: [
                    `USER_TAG places a VAR_C2 on USER_THEIR lovely head, securing the straps on snugly!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Aphrodisiacs");
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEY_CAP feelUSER_S USER_THEIR heart race as USER_THEIR nostrils are bombarded with a sensual, sweet smell that makes it nearly impossible to think about anything besides horny thoughts...`,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask";
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEIR_CAP breathing starts to hiss through the filter as USER_THEY lookUSER_S through glass lenses. `,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask (Linked)";
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEIR_CAP breathing starts to hiss through the tube as USER_THEY decideUSER_S who to give it to...`,
                    }
                ],
			},
			other: {
                worn: [`TARGET_TAG is already a VAR_C2!`],
                noworn: [
                    `USER_TAG grabs a VAR_C2 and places it gently on TARGET_TAG's head, securing the straps so it doesn't fall off.`,
                    `USER_TAG brushes TARGET_TAG's hair out of the way with USER_THEIR fingers before putting a VAR_C2 on TARGET_THEIR head!`,
                    `Grinning widely, USER_TAG places a VAR_C2 over TARGET_TAG's head. TARGET_THEIR_CAP face is now covered by the new head gear!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Aphrodisiacs");
                        },
                        text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP eyes roll backward as the aphrodisiacs assault TARGET_THEIR senses, rendering TARGET_THEM unable to think clearly!`,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask";
                        },
                        text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP breathing starts to hiss through the filter as TARGET_THEY look through glass lenses. `,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask (Linked)";
                        },
                        text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP breathing starts to hiss through the tube as USER_THEY decideUSER_S who to hand it to...`,
                    }
                ]
			},
		},
	},
};