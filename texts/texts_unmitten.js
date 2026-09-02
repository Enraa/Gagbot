exports.texts_unmitten = {
	heavy: { self: [`USER_TAG wriggles USER_THEIR hands in USER_THEIR VAR_C1, but can't get good leverage to take USER_THEIR mittens off!`], other: [`USER_TAG uses USER_THEIR nose to help TARGET_TAG but can't help TARGET_THEM out of TARGET_THEIR mittens!`] },
	noheavy: { 
        other: {
            noaccess: [
                `USER_TAG tries to pull off TARGET_TAG's mittens, but the lock holds them firmly on TARGET_THEIR wrists!`,
                `USER_TAG tugs at the wrist cuffs on TARGET_TAG's mittens, but the little lock prevents any hope of giving TARGET_THEM TARGET_THEIR fingers any time soon...`,
                `USER_TAG pokes and prods at the little locks holding TARGET_TAG's mittens on. They're quite secure and offer no hope of removing them any time soon...`
            ], 
            gag: [`USER_TAG takes off TARGET_TAG's VAR_C2 so TARGET_THEY can take off TARGET_THEIR gag!`], 
            nogag: [`USER_TAG takes off TARGET_TAG's VAR_C2. Now TARGET_THEY could take off any gag someone wants to put on TARGET_THEM!`] 
        }, 
        self: [`USER_TAG tries to pull off USER_THEIR VAR_C2, but the straps and locks hold them firmly on USER_THEIR wrists!`] 
    },
	// Idk why the structure was like this - Ephemeral
	otherother: {
        other: [`TARGET_TAG is not wearing mittens!`],
        self: [`You aren't wearing mittens!`]
    }
};