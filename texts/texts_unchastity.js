const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_unchastity = {
	chastitybelt: {
		heavy: {
			self: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to squirm out of USER_THEIR chastity belt, but USER_THEIR metal prison holds firmly to USER_THEIR body!`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG shifts in USER_THEIR VAR_C1, trying to detatch USER_THEIR seal, but paper tag remains stubbornly attached to USER_THEIR body!`,
							},
						],

				// ephemeral
				nochastity: [`You're not in a chastity belt, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity belt, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`],
				// ephemeral
				nochastity: [`TARGET_TAG is not in a chastity belt, but you wouldn't be able to remove it anyway!`],
			},
		},
		noheavy: {
			self: {
				chastity: {
					key: {
						fumble: {
							discard: { keyholder: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`], clone: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEIR hands are so shaky that the key slips and falls somewhere and turns to magical smoke!`] },
							nodiscard: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEY struggleUSER_S to guide it in the mechanism!`],
						},
						nofumble: [`USER_TAG puts the key in the lock on USER_THEIR belt and unlocks it, freeing USER_THEMSELF from that wretched prison!`],
					},
					nokey: [`USER_TAG runs USER_THEIR fingers uselessly on the metal of USER_THEIR chastity belt, but USER_THEY can't unlock it without the key!`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG reaches USER_THEIR fingers uselessly towards USER_THEIR seal, but USER_THEIR fingers can't bypass the magic protections!`,
							},
						],
                    nolock: [`USER_TAG undoes the hooks holding USER_THEIR chastity belt around USER_THEIR waist, letting it come loose as USER_THEY putUSER_S it away for the next time USER_THEY needUSER_S to be denied!`] // Need to write seal lines here
				},
				// ephemeral
				nochastity: [`You aren't wearing a chastity belt!`],
			},
			other: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to use the key for TARGET_TAG's belt, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`], clone: [`USER_TAG tries to use the key for TARGET_TAG's belt, but USER_THEIR thoughts cause a momentary slip-up and the key bends out of shape! It's now useless!`] }, nodiscard: [`USER_TAG tries to unlock TARGET_TAG's belt, but USER_THEY can't focus enough to guide the key into the keyhole!`] },
						nofumble: [`USER_TAG puts the key into TARGET_TAG's belt and turns the lock, letting it fall open and onto the floor. TARGET_THEY_CAP TARGET_ISARE free!`],
					},
					// ephemeral
					nokey: [`You don't have the key for TARGET_TAG's belt!`],
                    nolock: [`USER_TAG unhooks the plastic tag holding TARGET_TAG's belt shut, freeing TARGET_THEM from its torments!`]
				},
				// ephemeral
				nochastity: [`TARGET_TAG is not wearing a chastity belt!`],
			},
		},
	},
	chastitybra: {
		heavy: {
			self: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to shift out of USER_THEIR chastity bra, but USER_THEIR metal prison holds firmly to USER_THEIR body!`],
				// ephemeral
				nochastity: [`You're not in a chastity bra, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity bra, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`],
				// ephemeral
				nochastity: [`TARGET_TAG is not in a chastity bra, but you wouldn't be able to remove it anyway!`],
			},
		},
		noheavy: {
			self: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`], clone: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEIR hands are so shaky that the key slips and disappears as it hits the floor!`] }, nodiscard: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEY struggleUSER_S to guide it in the mechanism!`] },
						nofumble: [`USER_TAG puts the key in the lock on USER_THEIR bra and unlocks it, freeing USER_THEIR breasts from that wretched prison!`],
					},
					nokey: [`USER_TAG caresses USER_THEIR fingers uselessly on the smooth metal of USER_THEIR chastity bra's breast cups, but USER_THEY can't unlock it without the key!`],
                    nolock: [`USER_TAG undoes the retaining fastener on USER_THEIR chastity bra, letting it clang on the floor as USER_THEIR chest is met with the brisk air of the dungeon once more!`]
				},
				// ephemeral
				nochastity: [`You aren't wearing a chastity bra!`],
			},
			other: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to use the key for TARGET_TAG's bra, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`], clone: [`USER_TAG tries to use the key for TARGET_TAG's bra, but USER_THEIR thoughts cause a momentary slip-up and the key melts in USER_THEIR hands!`] }, nodiscard: [`USER_TAG tries to unlock TARGET_TAG's bra, but USER_THEY can't focus enough to guide the key into the keyhole!`] },
						nofumble: [`USER_TAG puts the key into TARGET_TAG's bra and turns the lock, letting it fall off of TARGET_THEIR breasts and onto the floor.`],
					},
					// ephemeral
					nokey: [`You don't have the key for TARGET_TAG's bra!`],
                    nolock: [`USER_TAG pinches the little fastener on TARGET_TAG's chastity bra, letting it come loose and fall off of USER_THEIR chest. The bra clangs on the floor with a dull sound.`]
				},
				// ephemeral
				nochastity: [`TARGET_TAG is not wearing a chastity bra!`],
			},
		},
	},
};