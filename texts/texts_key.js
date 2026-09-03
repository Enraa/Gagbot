const { getArousal } = require("../functions/getters/arousal/getArousal");
const { getHeadwearRestrictions } = require("../functions/getters/headwear/getHeadwearRestrictions");

exports.texts_key = {
	clone: {
		self: [
            `USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR collar key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`,
            `USER_TAG takes a file and carefully carves a duplicate of USER_THEIR VAR_C1 key and offers it to VAR_C2!`,
        ],
		other: [ 
            `USER_TAG subtly puts TARGET_TAG's VAR_C1 key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`,
            `USER_TAG takes a file and carefully carves a duplicate of TARGET_TAG's VAR_C1 key and slips it into VAR_C2's pocket.`,
            `TARGET_TAG's VAR_C1 key is wrapped up in some clay and then a duplicate is made! USER_TAG hands it to VAR_C2 before TARGET_THEY can notice!`,
        ],
	},
	give: {
		self: [
            `USER_TAG gives USER_THEIR VAR_C1 key to VAR_C2.`,
            `With a small flourish, USER_TAG offers USER_THEIR VAR_C1 key to VAR_C2!`,
            `USER_TAG holds up USER_THEIR key to USER_THEIR VAR_C1 in USER_THEIR palm, ready for VAR_C2 to take! Such a good USER_PRAISEOBJECT!`
        ], 
		other: [
            `USER_TAG subtly gives TARGET_TAG's VAR_C1 key to VAR_C2 without TARGET_THEM noticing!`,
            `With a deft motion, USER_TAG hands TARGET_TAG's VAR_C1 key over to VAR_C2. Maybe TARGET_THEY didn't notice!`,
            `USER_TAG gives TARGET_TAG's precious VAR_C1 key to VAR_C2. Even if TARGET_THEY complained, not like TARGET_THEY can do anything about it!`
        ], 
	},
	revoke: {
		isclone: {
            self: [
                "USER_TAG has magically broken the cloned key for USER_THEIR VAR_C1 that USER_THEY USER_WERE holding!",
                `With a snap of USER_THEIR fingers, USER_TAG's key to USER_THEIR VAR_C1 vanishes!`
            ],
            other: [
                "USER_TAG has magically broken the cloned key for TARGET_TAG's VAR_C1 that USER_THEY USER_WERE holding!",
                `With a snap of USER_THEIR fingers, USER_TAG's key to TARGET_TAG's VAR_C1 vanishes!`
            ]
        },
		isprimary: {
            self: [
                "USER_TAG has magically broken the cloned key for USER_THEIR VAR_C1 that VAR_C2 was holding!",
                `With a snap of USER_TAG's fingers, VAR_C2's key to USER_THEIR VAR_C1 vanishes!`
            ],
            other: [
                "USER_TAG has magically broken the cloned key for TARGET_TAG's VAR_C1 that VAR_C2 was holding!",
                `With a snap of USER_TAG's fingers, VAR_C2's key to TARGET_TAG's VAR_C1 vanishes!`
            ],
        },
	},
	swapitem: {
		self: {
			collar: [`USER_TAG carefully undoes the strap on USER_THEIR VAR_C1, letting it fall in front of USER_THEM as USER_THEY swapUSER_S it to a VAR_C2!`],
			chastitybelt: [`USER_TAG puts the key in USER_THEIR VAR_C1. The locking mechanism opens, granting USER_THEM a brief moment of freedom before USER_THEY putUSER_S a VAR_C2 in the same place!`],
			chastitybra: [`USER_TAG unlocks the little lock on the front of USER_THEIR VAR_C1. USER_THEIR_CAP chest is free for a brief moment before it is bound again with a VAR_C2!`],
		},
		other: {
			collar: [`USER_TAG carefully undoes the strap on TARGET_TAG's VAR_C1, letting it fall in front of TARGET_THEM as USER_THEY swapUSER_S it to a VAR_C2!`],
			chastitybelt: [`USER_TAG puts the key in TARGET_TAG's VAR_C1. The locking mechanism opens, granting TARGET_THEM a brief moment of freedom before USER_THEY putUSER_S a VAR_C2 on TARGET_THEM in the same place!`],
			chastitybra: [`USER_TAG unlocks the little lock on the front of TARGET_TAG's VAR_C1. TARGET_THEIR_CAP chest is free for a brief moment before it is bound once more with a VAR_C2!`],
		},
	},
    discardkey: {
        self: {
            keyholder: [
                {
                    required: (t) => {
                        return getArousal(t.serverID, t.interactionuser.id) < 20;
                    },
                    text: `USER_TAG looks one last time at USER_THEIR key to USER_THEIR VAR_C1 and tosses it without a second thought.`,
                },
                {
                    required: (t) => {
                        return !getHeadwearRestrictions(t.serverID, t.interactionuser.id).canInspect;
                    },
                    text: `USER_TAG is unable to see, so USER_THEY decideUSER_S to toss the key to USER_THEIR VAR_C1 somewhere... Who knows where?`,
                },
                {
                    required: (t) => {
                        return getArousal(t.serverID, t.interactionuser.id) > 10;
                    },
                    text: `USER_TAG shudders slightly as USER_THEY stareUSER_S at USER_THEIR VAR_C1 key before flinging it off into the void!`,
                },
                {
                    required: (t) => {
                        return getArousal(t.serverID, t.interactionuser.id) > 20;
                    },
                    text: `Desperate to stay helpless and horny, USER_TAG throws USER_THEIR VAR_C1 key off into the distance!`,
                },
            ],
            none: [
                `USER_TAG tries to throw away USER_THEIR key... but a mysterious entity stops USER_THEM!? (this is a bug, report)`
            ]
        },
        other: {
            keyholder: [
                `USER_TAG smirks at TARGET_TAG before tossing TARGET_THEIR VAR_C1 key off into the nether.`,
                {
                    required: (t) => {
                        return !getHeadwearRestrictions(t.serverID, t.targetuser.id).canInspect;
                    },
                    text: `USER_TAG taunts TARGET_TAG with TARGET_THEIR key for a moment, dangling it in front of TARGET_THEIR eyes before flinging it away.`,
                }
            ],
            none: [
                `USER_TAG tries to throw away TARGET_TAG's key... but a mysterious entity stops USER_THEM!? (this is a bug, report)`
            ]
        }
    },
    returnkey: {
        other: [
            `USER_TAG decides to return the key for TARGET_TAG's VAR_C1 early. TARGET_THEY_CAP lookTARGET_S at USER_THEM gratefully!`
        ]
    },
    additionalcollar: {
        self: {
            add: [
                `USER_TAG pulls out a VAR_C1 and uses a bit of magic to transcribe its effects into USER_THEIR VAR_C2!`,
                `USER_TAG casts a small spell on USER_THEIR VAR_C2 and clones the effects of a VAR_C1 onto it!`,
                {
                    only: (t) => {
                        return (t.c1.includes("Collar Bell"))
                    },
                    text: `USER_TAG clips a little VAR_C1 onto USER_THEIR VAR_C2. It gives a little jingle as USER_THEY moveUSER_S!`
                }
            ],
            remove: [
                `USER_TAG snaps USER_THEIR fingers and dispels the VAR_C1 effect on USER_THEIR VAR_C2.`,
                {
                    only: (t) => {
                        return (t.c1.includes("Collar Bell"))
                    },
                    text: `USER_TAG unhooks the little VAR_C1 on USER_THEIR VAR_C2 and puts it away!`
                }
            ]
        },
        other: {
            add: [
                `USER_TAG pulls out a VAR_C1 and uses a bit of magic to transcribe its effects into TARGET_TAG's VAR_C2!`,
                `USER_TAG casts a small spell on TARGET_TAG's VAR_C2 and clones the effects of a VAR_C1 onto it!`,
                {
                    only: (t) => {
                        return (t.c1.includes("Collar Bell"))
                    },
                    text: `USER_TAG clips a little VAR_C1 onto TARGET_TAG's VAR_C2. It gives a little jingle as TARGET_THEY moveTARGET_S!`
                }
            ],
            remove: [
                `USER_TAG snaps USER_THEIR fingers and dispels the VAR_C1 effect on TARGET_TAG's VAR_C2.`,
                {
                    only: (t) => {
                        return (t.c1.includes("Collar Bell"))
                    },
                    text: `USER_TAG unhooks the little VAR_C1 on TARGET_TAG's VAR_C2 and puts it away!`
                }
            ]
        }
    }
};