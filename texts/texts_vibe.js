const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_vibe = {
	heavy: {
		self: { chastity: { single: [`USER_TAG scoots a VAR_C2 with USER_THEIR ankle, but can't slip it past USER_THEIR chastity belt!`] }, nochastity: { single: [`USER_TAG tries to fanagle a VAR_C2 into USER_THEMSELF with USER_THEIR toes, but isn't flexible enough!`] } },
		other: { chastity: { single: [`USER_TAG tries to carefully manipulate a VAR_C2 into TARGET_TAG, but isn't able to get past TARGET_THEIR chastity belt without arms!`] }, nochastity: { single: [`USER_TAG twists USER_THEIR leg to push a VAR_C2 towards TARGET_TAG, but without arms, USER_THEY can't really put it on TARGET_THEM.`] } },
	},
	noheavy: {
		self: {
			vibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG disables the magic in USER_THEIR seal, removing it before adding a VAR_C2 set to VAR_C3! USER_THEY_CAP then replaceUSER_S and reactivateUSER_S the seal.`,
								},
							] 
						},
					},
					// No public access to self belt
					nokey: [`USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`,
						{
							only: (t) => {
								return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
							},
							text: `USER_TAG tries to slip past USER_THEIR seal to play with a vibe, but the seal's magics deny USER_THEM access!`,
						},
					],
				},
				nochastity: { single: [`USER_TAG adjusts USER_THEIR VAR_C2 and sets it to VAR_C3! The toy buzzes gently!`] },
			},
			novibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and vanishes. There's a loud crack as it lands on the floor.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it before adding a VAR_C2 set to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG disables the magic in USER_THEIR seal, removing it before adding a VAR_C2 set to VAR_C3! USER_THEY_CAP then replaceUSER_S and reactivateUSER_S the seal.`,
								},
							] 
						},
					},
					// No public access to self belt
					nokey: [`USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`,
						{
							only: (t) => {
								return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
							},
							text: `USER_TAG tries to slip past USER_THEIR seal to play with a vibe, but the seal's magics deny USER_THEM access!`,
						},
					],
				},
				nochastity: { single: [`USER_TAG carefully inserts a VAR_C2 set to VAR_C3! The toy buzzes gently!`] },
			},
		},
		other: {
			vibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to change the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to change the VAR_C2, but the key slips and explodes as it lands on the floor. A small amount of dust remains.`] } },
							nodiscard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to adjust the buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to adjust the buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] } },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adjusting the buzzing VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adjusting the VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG adjusts the VAR_C2 inside TARGET_TAG, setting it to VAR_C3. The toy's buzzing song continues TARGET_THEIR joy!`] },
			},
			novibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a VAR_C2, but the key slips and falls somewhere, but it wasn't lost! Unfortunately, the key is bent horribly out of shape and is no longer usable.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a buzzing VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adding a VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG carefully adds a VAR_C2 to TARGET_TAG, setting it to VAR_C3. The toy's buzzing song precludes TARGET_THEIR joy!`] },
			},
		},
	},
};