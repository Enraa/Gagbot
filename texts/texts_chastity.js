const { getArousal } = require("../functions/getters/arousal/getArousal");
const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_chastity = {
    self: {
        chastitybelt: {
            heavy: {
                chastity: [
                    `USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`, 
                    `USER_TAG wiggles a bit, trying to adjust USER_THEIR VAR_C2, but USER_THEIR VAR_C1 makes it hard to reach...`
                ],
                nochastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`, `USER_TAG shifts USER_THEIR hips, wanting to put USER_THEMSELF in chastity because USER_THEY USER_ISARE a good USER_PRAISEOBJECT, but USER_THEIR VAR_C1 said no.`, `USER_TAG bumps into a VAR_C2, wanting so desperately to put it on USER_THEIR hips, but USER_THEIR VAR_C1 gives USER_THEM no arms with which to work with.`],
            },
            noheavy: {
                chastity: { 
                    key_other: [`You are already locked in a chastity belt and TARGET_TAG has the key!`,
                        {
                            only: (t) => {
                                return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
                            },
                            text: `You are already wearing a chastity seal with access keyed to TARGET_TAG!`,
                        },
                    ], 
                    key_self: [`You are already locked in a chastity belt and you're holding the key!`,
                        {
                            only: (t) => {
                                return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
                            },
                            text: `You are already wearing a chastity seal keyed to you!`,
                        },
                    ] 
                },
                nochastity: [
                    `USER_TAG puts a VAR_C2 on and clicks the little fastener shut! Now it just needs a lock to ensure it doesn't get so easily removed...`,
                    `USER_TAG slips a VAR_C2 on and pinches the fasteners shut, sealing USER_THEMSELF away... but USER_THEY could still remove it. For now.`,
                    `USER_TAG whispers a sweet goodbye as USER_THEY wrapUSER_S a VAR_C2 around USER_THEIR waist, sealing USER_THEIR chastity away. USER_THEY_CAP needUSER_S only find a lock to finish the deal!`,
                    {
                        required: (t) => {
                            return getArousal(t.serverID, t.interactionuser.id) > 10;
                        },
                        text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR waist before USER_THEY touch there. USER_THEY_CAP could still remove the belt, but at least it's something...`,
                    },
                    {
                        required: (t) => {
                            return getArousal(t.serverID, t.interactionuser.id) > 20;
                        },
                        text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG puts USER_THEMSELF in a VAR_C2. Though, USER_THEY USER_ISARE still able to remove it until it's locked.`,
                    },
                    {
                        only: (t) => {
                            return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
                        },
                        text: `USER_TAG presses a VAR_C2 against USER_THEIR skin, feeling it activate and seal USER_THEM away until USER_THEY choose to remove it!`,
                    },
                ]
            },
        },
        chastitybra: {
            heavy: {
                chastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`, `USER_TAG wiggles a bit, trying to adjust USER_THEIR VAR_C2, but USER_THEIR VAR_C1 makes it hard to reach...`],
                nochastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`, `USER_TAG shifts USER_THEIR shoulder, wanting to put USER_THEMSELF in chastity because USER_THEY USER_ISARE a good USER_PRAISEOBJECT, but USER_THEIR VAR_C1 said no.`, `USER_TAG bumps into a VAR_C2, wanting so desperately to put it on USER_THEIR chest, but USER_THEIR VAR_C1 gives USER_THEM no arms with which to work with.`],
            },
            noheavy: {
                chastity: { key_other: [`You are already locked in a chastity bra and TARGET_TAG has the key!`], key_self: [`You are already locked in a chastity bra and you're holding the key!`] },
                nochastity: [
                    `USER_TAG puts a VAR_C2 on and clicks the clasp shut on it! USER_THEIR_CAP chest is so armored now!`,
                    `USER_TAG slips a VAR_C2 on and pinches the little clasp shut, sealing USER_THEIR breasts away... Imagine what would happen if one were to lock it!`,
                    `USER_TAG whispers a sweet goodbye as USER_THEY wrapUSER_S a VAR_C2 around USER_THEIR chest. USER_THEY_CAP can still get inside quite easily though.`,
                    {
                        required: (t) => {
                            return getArousal(t.serverID, t.interactionuser.id) > 10;
                        },
                        text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR chest before USER_THEY touchUSER_ES there. USER_THEY_CAP just needs to put a lock on to protect USER_THEIR chastity...`,
                    },
                    {
                        required: (t) => {
                            return getArousal(t.serverID, t.interactionuser.id) > 20;
                        },
                        text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG puts USER_THEMSELF in a VAR_C2. However, good USER_PRAISEOBJECTs *also* place locks on USER_THEIR chastity.`,
                    },
                ],
            },
        },
    },
    other: {
        chastitybelt: {
            noheavy: {
                chastity: {
                    key_other: [
                        `TARGET_TAG is already in a VAR_C2, with keys held by VAR_C3!`
                    ],
                    key_self: [
                        `TARGET_TAG is already in a VAR_C2 and you're holding the keys!`
                    ]
                },
                nochastity: [
                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C2 around TARGET_THEIR waist and clicking the fastener shut before TARGET_THEY can even react! It just needs a lock to seal the deal!`,
                    `USER_TAG gingerly wraps a VAR_C2 around TARGET_TAG's waist, giggling as USER_THEY lean over TARGET_THEIR shoulder to whisper sweet nothings as TARGET_THEIR pleasure is sealed away...`,
                    `USER_TAG knows that TARGET_TAG is a good USER_PRAISEOBJECT, and good USER_PRAISEOBJECTs wear chastity. A VAR_C2 is conjured and wrapped around TARGET_THEIR waist to ensure TARGET_THEY TARGET_ISARE good.`
                ],
            },
            heavy: {
                chastity: [
                    `USER_TAG looks at TARGET_TAG, trying to use USER_THEIR eyes to poke and prod at the locking mechanism holding TARGET_THEIR chastity in place on TARGET_THEIR waist. If only USER_THEY could reach...`
                ],
                nochastity: [
                    `USER_TAG rolls around towards TARGET_TAG, trying to put a VAR_C2 on TARGET_THEIR waist, but struggles to grasp the lewd prison while locked away in USER_THEIR heavy bondage!`
                ]
            }
        },
        chastitybra: {
            noheavy: {
                chastity: {
                    key_other: [
                        `TARGET_TAG is already in a VAR_C2, with keys held by VAR_C3!`
                    ],
                    key_self: [
                        `TARGET_TAG is already in a VAR_C2 and you're holding the keys!`
                    ]
                },
                nochastity: [
                    `USER_TAG grabs TARGET_TAG and wraps a VAR_C2 around TARGET_THEIR chest and does the clasp on it before TARGET_THEY can even react!`,
                    `USER_TAG steps from behind TARGET_TAG and wraps a VAR_C2 around TARGET_THEIR chest, pulling TARGET_THEM into a bit of a hug as USER_THEY do the clasp in front, sealing away TARGET_THEIR breasts.`
                ],
            },
            heavy: {
                chastity: [
                    `USER_TAG looks at TARGET_TAG, trying to use USER_THEIR eyes to look *respectfully* at the chaste prison clinging to TARGET_THEIR chest. If only USER_THEY could touch it...`
                ],
                nochastity: [
                    `USER_TAG rolls around towards TARGET_TAG, trying to put a VAR_C2 on TARGET_THEIR breasts, but struggles to grasp the lewd prison while locked away in USER_THEIR heavy bondage!`
                ]
            }
        }
    }
};