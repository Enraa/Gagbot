const { getHeadwear } = require("../functions/getters/headwear/getHeadwear");

exports.texts_ungag = {
	heavy: {
		self: {
			gag: [`USER_TAG chews on USER_THEIR gag, trying to spit it out because USER_THEY can't use USER_THEIR hands and arms!`, `USER_TAG tries to push USER_THEIR gag out with USER_THEIR tongue, but only succeeds in vigorously drooling on USER_THEMSELF!`],
			// Ephemeral
			nogag: [`You're not gagged, but you wouldn't be able to remove it anyway!`],
		},
		other: {
			gag: [`USER_TAG bumps into TARGET_TAG, trying to use USER_THEIR useless arms to help TARGET_THEM out of TARGET_THEIR gag! It helped... maybe!`],
			// Ephemeral
			nogag: [`TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`],
		},
	},
	noheavy: {
		mitten: {
			self: {
				gag: [`USER_TAG paws at USER_THEIR gag, trying to get a good grasp on the straps, but to no avail!`, `USER_TAG tries to use both hands to get a grip on the buckle of USER_THEIR gag, but gets nowhere because of USER_THEIR mittens.`, `Brushing USER_THEIR cheek, USER_TAG paws at USER_THEIR gag cutely!`, `USER_TAG mews into USER_THEIR gag pitifully as USER_THEY can't grip the straps to take it out!`],
				// Ephemeral
				nogag: [`You're not gagged, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				gag: [`USER_TAG paws at TARGET_TAG's gag, trying to help TARGET_THEM take it off, but USER_THEY can't really do much.`],
				// Ephemeral
				nogag: [`TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`],
			},
		},
		nomitten: {
			self: {
				gag: {
                    failed: [
                        {
                            required: (t) => {
                                return (t.c3 && getHeadwear(t.serverID, t.targetuser.id)?.some((h) => h.type == `gagharness_${t.c3}`))
                            },
                            text: `USER_TAG tugs at USER_THEIR VAR_C2, but the straps on head harness hold it firmly to USER_THEIR head. USER_THEY_CAP twiddleUSER_S with the little locks on it.`
                        },
                        {
                            required: (t) => {
                                return (t.c3 && getHeadwear(t.serverID, t.targetuser.id)?.some((h) => h.type == `gagharness_${t.c3}`))
                            },
                            text: `It's not for lack of trying, but the straps circling USER_TAG's vision remind USER_THEM of the futility in trying to remove USER_THEIR locked gag.`
                        },
                        {
                            required: (t) => {
                                return (t.c3 && getHeadwear(t.serverID, t.targetuser.id)?.some((h) => h.type == `gagharness_${t.c3}`))
                            },
                            text: `USER_TAG paws at the head harness on USER_THEIR head, clearly forgetting that USER_THEY USER_ISARE meant to be gagged until USER_THEIR head harness is unlocked.`
                        },
                        `USER_TAG paws at USER_THEIR facewear, helplessly unable to touch or remove the gags firmly garbling USER_THEIR words. Silence is *golden.*`
                    ],
                    noaccess: [
                        `USER_TAG tries to pull USER_THEIR VAR_C2, but there's a lock preventing it's removal and keeping USER_THEM silent!`
                    ],
                    locked: [
                        `USER_TAG has taken USER_THEIR VAR_C2 out!`, 
                        `With a stream of drool, USER_TAG undoes the straps and takes USER_THEIR VAR_C2 out!`, 
                        `Reaching up and unclasping the straps, USER_TAG unravels USER_THEIR lips from USER_THEIR VAR_C2!`, 
                        `USER_TAG takes USER_THEIR VAR_C2 out, stretching USER_THEIR jaw slightly!`
                    ],
					single: [
                        `USER_TAG has taken USER_THEIR VAR_C2 out!`, 
                        `With a stream of drool, USER_TAG undoes the straps and takes USER_THEIR VAR_C2 out!`, 
                        `Reaching up and unclasping the straps, USER_TAG unravels USER_THEIR lips from USER_THEIR VAR_C2!`, 
                        `USER_TAG takes USER_THEIR VAR_C2 out, stretching USER_THEIR jaw slightly!`
                    ],
                    multipleharnessed: [
                        `USER_TAG undoes the straps on some of USER_THEIR gags, but USER_THEY USER_ISARE unable to remove the rest because of the locked straps on them.`,
                        `USER_TAG sucks in some breath after removing some of USER_THEIR gags, but the rest remain securely locked on USER_THEIR head...`
                    ],
					multiple: [
                        `USER_TAG undoes all the straps holding USER_THEIR gags in USER_THEIR mouth, letting them fall into USER_THEIR lap.`, 
                        `USER_TAG lets out a "pleh~" as USER_THEY undoUSER_ES the straps holding the gags in USER_THEIR mouth.`, 
                        `USER_TAG's gags are covered in drool as USER_THEY gently pullUSER_S them out from between USER_THEIR teeth.`
                    ],
				},
				// Ephemeral
				nogag: [`You aren't currently gagged right now!`],
			},
			other: {
				gag: {
                    failed: [
                        {
                            required: (t) => {
                                return (t.c3 && getHeadwear(t.serverID, t.targetuser.id)?.some((h) => h.type == `gagharness_${t.c3}`))
                            },
                            text: `USER_TAG tugs at the VAR_C2 on TARGET_TAG's face, but fails miserably in removing the head harness holding the gag securely in TARGET_THEIR mouth.`
                        },
                        {
                            required: (t) => {
                                return (t.c3 && getHeadwear(t.serverID, t.targetuser.id)?.some((h) => h.type == `gagharness_${t.c3}`))
                            },
                            text: `Despite USER_TAG's best efforts, TARGET_TAG's speech remains stolen from TARGET_THEM. A shame. Maybe someone should unlock the harness on TARGET_THEM!`
                        },
                        `USER_TAG dances USER_THEIR fingers over TARGET_TAG's impenetrable facewear, the gags underneath completely safe from any nefarious removal. TARGET_THEIR_CAP speech remains safely sealed away.`
                    ],
                    noaccess: [
                        `USER_TAG gently pulls on the straps on TARGET_TAG's gag, tugging TARGET_THEIR head around, but the lock on it offers USER_THEM no give! TARGET_THEIR_CAP speech remains as completely gagged as it was before!`
                    ],
                    locked: [
                        `USER_TAG undoes the straps holding TARGET_TAG's VAR_C2 on TARGET_THEIR face, letting it fall out from between TARGET_THEIR teeth.`, 
                        `USER_TAG unclasps the buckle for TARGET_TAG's VAR_C2, then carefully pops it out.`, 
                        `USER_TAG carefully unbuckles TARGET_TAG's VAR_C2, and lets TARGET_THEIR face fall forward to allow the drool to drain out from TARGET_THEIR mouth.`
                    ],
					single: [
                        `USER_TAG undoes the straps holding TARGET_TAG's VAR_C2 on TARGET_THEIR face, letting it fall out from between TARGET_THEIR teeth.`, 
                        `USER_TAG unclasps the buckle for TARGET_TAG's VAR_C2, then carefully pops it out.`, 
                        `USER_TAG carefully unbuckles TARGET_TAG's VAR_C2, and lets TARGET_THEIR face fall forward to allow the drool to drain out from TARGET_THEIR mouth.`
                    ],
                    multipleharnessed: [
                        `USER_TAG pulls off some of the gags on TARGET_TAG, but not all of them. Several have some pesky locks on the straps covering TARGET_THEIR head!`,
                        `TARGET_TAG looks gratefully at USER_TAG as USER_THEY removeUSER_S the gags. Sadly, not all of them can be removed because of the head harness still on TARGET_THEIR head!`
                    ],
					multiple: [
                        `USER_TAG undoes all the straps holding TARGET_TAG's gags in TARGET_THEIR mouth, letting them fall into TARGET_THEIR lap.`, 
                        `TARGET_TAG lets out a "pleh~" as USER_TAG undoes the straps holding the gags in TARGET_THEIR mouth.`, 
                        `TARGET_TAG's gags are covered in drool as USER_TAG gently pulls them out from between TARGET_THEIR teeth.`
                    ],
				},
				// Ephemeral
				nogag: [`TARGET_TAG is not currently gagged right now!`],
			},
		},
	},
};