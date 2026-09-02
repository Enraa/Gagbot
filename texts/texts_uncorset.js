exports.texts_uncorset = {
	heavy: {
		self: {
			corset: [
                `USER_TAG wriggles in USER_THEIR VAR_C1, but without arms, USER_THEY can't easily undo the laces of USER_THEIR VAR_C2 to take it off!`
            ],
			// Ephemeral
			nocorset: [
                `You aren't wearing a corset, but even if you were, you wouldn't be able to take it off!`
            ],
		},
		other: {
			corset: [
                `Maybe in another time, USER_TAG might have been able to help TARGET_TAG out of TARGET_THEIR VAR_C2, but having no arms makes it hard.`
            ],
			// Ephemeral
			nocorset: [
                `TARGET_TAG isn't wearing a corset, but you wouldn't be able to remove it anyway!`
            ],
		},
	},
	noheavy: {
		self: {
			corset: {
				/*chastity: {
					key: {
						fumble: {
							discard: {
								keyholder: [`USER_TAG tries to unlock USER_THEIR belt to remove USER_THEIR VAR_C2, but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! USER_THEY_CAP will have to remain corseted!`],
								clone: [`USER_TAG tries to unlock USER_THEIR belt to remove USER_THEIR VAR_C2, but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! A brilliant light coming from the clear floor indicates USER_THEY will have to remain corseted!`],
							},
							nodiscard: [`USER_TAG shakily tries to unlock USER_THEIR belt, but the key keeps slipping and not going into the mechanism. USER_THEY will have to leave USER_THEIR VAR_C2 alone until USER_THEY calm down!`],
						},
						nofumble: [`USER_TAG unlocks USER_THEIR chastity belt briefly, undoing the laces of the VAR_C2 USER_THEY USER_ISARE wearing and pulling it off of USER_THEIR waist! USER_THEY_CAP then carefully lockUSER_S USER_THEMSELF back up!`],
					},
					nokey: [`USER_TAG tugs at USER_THEIR chastity belt to try to remove USER_THEIR VAR_C2, but the locking mechanism holds firm!`,
						{
							only: (t) => {
								return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
							},
							text: `USER_TAG franticaly attempts to bypass the magic of USER_THEIR chastity seal to try to remove USER_THEIR VAR_C2, but the magics deny them access!`,
						},
					],
				},
				nochastity: [`USER_TAG carefully undoes the laces and USER_THEIR VAR_C2, unwrapping it from USER_THEIR waist. USER_THEY_CAP breatheUSER_S a *huge* breath of relief!`],*/
                noaccess: [
                    `USER_TAG plays with the little lock on USER_THEIR corset. USER_THEY_CAP wantUSER_S to remove it, but alas USER_THEIR breath remains stolen, perhaps in more ways than one.`
                ],
                locked: [
                    `USER_TAG carefully undoes the laces and USER_THEIR VAR_C2, unwrapping it from USER_THEIR waist. USER_THEY_CAP breatheUSER_S a *huge* breath of relief!`
                ],
                nolocked: [
                    `USER_TAG carefully undoes the laces and USER_THEIR VAR_C2, unwrapping it from USER_THEIR waist. USER_THEY_CAP breatheUSER_S a *huge* breath of relief!`
                ]
			},
			// Ephemeral
			nocorset: [`You aren't wearing a corset!`],
		},
		other: {
			corset: {
				/*chastity: {
					key: {
						fumble: {
							discard: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's chastity belt to remove TARGET_THEIR VAR_C2 but the key slips in USER_THEIR careless horniness. Despite USER_THEIR best efforts, the key seems to have disappeared.`], clone: [`USER_TAG tries to unlock TARGET_TAG's chastity belt to remove TARGET_THEIR VAR_C2 but the key slips in USER_THEIR careless horniness, falling on the floor and chipping. The clone is useless now.`] },
							nodiscard: [`USER_TAG shakily tries to unlock TARGET_TAG's chastity belt to get at TARGET_THEIR VAR_C2, but the key keeps slipping. Fortunately, it wasn't lost, but USER_THEY need to calm down first!`],
						},
						nofumble: [`USER_TAG unlocks TARGET_TAG's chastity belt, then removes TARGET_THEIR VAR_C2! While TARGET_THEY TARGET_ISARE breathing fresh air again, USER_THEY lockUSER_S TARGET_THEM back in TARGET_THEIR chastity belt!`],
					},
					public: [`USER_TAG uses the public access key to unlock TARGET_TAG's chastity belt, removing TARGET_THEIR VAR_C2, and then clicking the lock back shut!`],
					// Ephemeral
					nokey: [`You don't have the key for TARGET_TAG's chastity belt!`],
				},
				nochastity: [`USER_TAG carefully undoes the laces on TARGET_TAG's beautiful VAR_C2, loosening it until it finally falls off of TARGET_THEIR waist!`],*/
                noaccess: [
                    `USER_TAG pokes at the lock around the laces on TARGET_TAG's corset. Unfortunately, there's little USER_THEY can do with removing it because it is tightly locked.`
                ],
                locked: [
                    `USER_TAG carefully undoes the laces on TARGET_TAG's beautiful VAR_C2, loosening it until it finally falls off of TARGET_THEIR waist!`
                ],
                nolocked: [
                    `USER_TAG carefully undoes the laces on TARGET_TAG's beautiful VAR_C2, loosening it until it finally falls off of TARGET_THEIR waist!`
                ]
			},
			// Ephemeral
			nocorset: [`TARGET_TAG is not wearing a corset!`],
		},
	},
};