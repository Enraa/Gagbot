const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_unvibe = {
	heavy: {
		self: {
			chastity: { 
				single: [
					`USER_TAG tries to knock USER_THEIR VAR_C2 off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG tries to knock USER_THEIR VAR_C2 off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity seal of course!`,
							},
				], 
				both: [
					`USER_TAG tries to knock USER_THEIR vibrators off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`,
							{
								only: (t) => {
									return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
								},
								text: `USER_TAG tries to knock USER_THEIR vibrators off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity seal of course!`,
							},
				] 
			},
			nochastity: { single: [`USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`], both: [`USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`] },
		},
		other: {
			chastity: { single: [`USER_TAG tries to knock TARGET_TAG's VAR_C2 off with USER_THEIR knees, however TARGET_THEIR chastity belt holds it firmly in place!`], both: [`USER_TAG tries to knock TARGET_TAG's vibrators off with USER_THEIR knees, however TARGET_THEIR chastity belt holds them firmly in place!`] },
			nochastity: { single: [`USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's VAR_C2, however it stays pretty secure in TARGET_THEIR body!`], both: [`USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's vibrator, however it stays pretty secure in TARGET_THEIR body!`] },
		},
	},
	noheavy: {
		self: {
			hasvibe: {
				chastity: {
					key: {
						fumble: {
							discard: {
								single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips and falls somewhere. The key goes up in flames on the floor.`] },
								both: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips and falls somewhere. A small ghostly key flies up after it lands on the floor and vanishes.`] },
							},
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], both: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking USER_THEMSELF back up.`], both: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting vibrators before closing it and locking USER_THEMSELF back up.`] },
					},
					// No public access to self belt
					nokey: [
						`USER_TAG claws feverishly at USER_THEIR belt, the agonizing vibrators offering USER_THEM no reprieve from their sweet sensation!`,
						{
							only: (t) => {
								return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
							},
							text: `USER_TAG claws feverishly at USER_THEIR seal but fail to bypass it, the agonizing vibrators offering USER_THEM no reprieve from their sweet sensation!`,
						},
					],
				},
				nochastity: { single: [`USER_TAG carefully removes USER_THEIR VAR_C2 and turns it off. Freedom from the torment!`], both: [`USER_TAG carefully removes USER_THEIR vibrator and turns them off. Freedom from the torment!`] },
			},
			novibe: { single: [`You do not have a VAR_C2 on yourself!`], both: [`You do not have any vibrators on yourself!`] },
		},
		other: {
			hasvibe: {
				chastity: {
					key: {
						fumble: {
							discard: {
								single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips and falls somewhere and crumbles into dust.`] },
								both: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`] },
							},
							nodiscard: { single: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], both: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`], both: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`], both: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG carefully removes TARGET_TAG's VAR_C2 and turns it off. Freedom from the torment!`], both: [`USER_TAG carefully removes TARGET_TAG's vibrator and turns them off. Freedom from the torment!`] },
			},
			novibe: { single: [`TARGET_TAG does not have a VAR_C2 on TARGET_THEM!`], both: [`TARGET_TAG does not have any vibrators on TARGET_THEM!`] },
		},
	},
};