exports.texts_collar = {
	heavy: { collar: [`USER_TAG crinks USER_THEIR neck, trying to adjust USER_THEIR collar, but USER_THEIR VAR_C1 makes it impossible to adjust!`], nocollar: [`USER_TAG shifts USER_THEIR cheek on a collar, yearning to put it on, but USER_THEIR VAR_C1 makes it incredibly difficult to put on!`] },
	noheavy: {
		self: {
			nofreeuse: { 
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck. USER_THEY_CAP beamUSER_S brightly as USER_THEY proudly displayUSER_S it to the world to see!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG pulls out a shiny necklace with handcuff charm hanging off of it. USER_THEY_CAP putUSER_S it on around USER_THEIR neck and adjusts it for fit.`,
                    },
                ], 
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key.`
                ] 
            },
			freeuse: { 
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck. USER_THEY_CAP beamUSER_S brightly as USER_THEY proudly displayUSER_S it to the world to see! A little tag hangs off the collar with "Free Use!" written on it!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG pulls out a shiny necklace with handcuff charm hanging off of it. USER_THEY_CAP putUSER_S it on around USER_THEIR neck and adjusts it for fit. A clip-on tag with "Use me! <3" written hangs from it.`,
                    },
                ], 
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key. A little tag hangs off the collar with "Free Use!" written on it!`
                ] 
            },
		},
		other: {
             // This should never happen in the future
			nofreeuse: { 
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`, 
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG pulls out a shiny necklace with handcuff charm hanging off of it. USER_THEY_CAP putUSER_S it on around USER_THEIR neck and adjusts it for fit. USER_THEY_CAP smileUSER_S to TARGET_TAG with a silent promise not to remove it until given permission to.`,
                    },
                ], 
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`
                ] 
            },
			freeuse: { 
                namedcollar: [
                    `USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Handcuff Amulet");
                        },
                        text: `USER_TAG pulls out a shiny necklace with handcuff charm hanging off of it. USER_THEY_CAP putUSER_S it on around USER_THEIR neck and adjusts it for fit. A clip-on tag with "Use me! <3" written hangs from it. USER_THEY_CAP smileUSER_S to TARGET_TAG with a silent promise not to remove the VAR_C2 until given permission to.`,
                    },
                ], 
                nonamedcollar: [
                    `USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`
                ] 
            },
		},
		alreadycollared: [
            `You already have a collar on!`,
            {
                only: (t) => {
                    return t.c2.includes("Handcuff Amulet");
                },
                text: `You're already wearing a neck ornament!`,
            },
        ],
	},
};