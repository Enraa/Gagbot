exports.texts_lock = {
    lock: {
        // region simplepadlock
        simplepadlock: {
            // Applying to self
            "self": {
                // Locking the lock on self
                "selflock": [
                    {
                        only: (t) => {
                            return (t.c2 == "chastity");
                        },
                        text: `USER_TAG places a Simple Padlock over the locking ring on the front of USER_THEIR VAR_C1, locking it securely before pocketing the key! A dancing finger across USER_THEIR waist reminds USER_THEM of the feeling of chastity...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "chastitybra");
                        },
                        text: `USER_TAG places a Simple Padlock on the locking ring between USER_THEIR breasts, securing USER_THEIR VAR_C1 and locking away any sense of pleasure on USER_THEIR chest! USER_THEY_CAP then tuckUSER_S the key away somewhere.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "collar");
                        },
                        text: `USER_TAG places a Simple Padlock inside the little ring on USER_THEIR VAR_C1's strap! The small lock dangles gently, reminding USER_THEM that it cannot be removed until USER_THEY unlock it with the key USER_THEY USER_ISARE holding.`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "gag");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1 on USER_THEIR face. USER_THEIR_CAP speech will remain firmly locked away until the lock is removed!`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "mask");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1 on USER_THEIR face. USER_THEY_CAP won't be able to take it off USER_THEIR head until USER_THEY unlock it!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "corset");
                        },
                        text: `USER_TAG wriggles slightly as USER_THEY placeUSER_S a Simple Padlock on USER_THEIR VAR_C1, securing it on the ring of USER_THEIR corset! The laces won't loosen until it is removed with USER_THEIR key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "heavy");
                        },
                        text: `USER_TAG places a Simple Padlock over USER_THEIR VAR_C1 - binding USER_THEMSELF with it until it is removed with the key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "mitten");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1, clumsily clicking the lock shut. Using both hands, USER_THEY carefully grabUSER_S the key and tuckUSER_S it away!`,
                    },
                ],
                "otherlock": [
                    {
                        only: (t) => {
                            return (t.c2 == "chastity");
                        },
                        text: `USER_TAG places a Simple Padlock over the locking ring on the front of USER_THEIR VAR_C1, locking it securely before tossing the key to TARGET_TAG! A dancing finger across USER_THEIR waist reminds USER_THEM of the feeling of chastity...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "chastitybra");
                        },
                        text: `USER_TAG places a Simple Padlock on the locking ring between USER_THEIR breasts, securing USER_THEIR VAR_C1 and locking away any sense of pleasure on USER_THEIR chest! USER_THEY_CAP then handUSER_S the key over to TARGET_TAG.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "collar");
                        },
                        text: `USER_TAG places a Simple Padlock inside the little ring on USER_THEIR VAR_C1's strap! The small lock dangles gently, reminding USER_THEM that it cannot be removed until USER_THEY unlock it with the key USER_THEY just handed to TARGET_TAG.`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "gag");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1 on USER_THEIR face. USER_THEIR_CAP speech will remain firmly locked away until the lock is removed! When will TARGET_TAG grant USER_THEM USER_THEIR speech again?`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "mask");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1 on USER_THEIR face. USER_THEY_CAP won't be able to take it off USER_THEIR head until TARGET_TAG unlocks it, since TARGET_THEY now possessTARGET_ES the key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "corset");
                        },
                        text: `USER_TAG wriggles slightly as USER_THEY placeUSER_S a Simple Padlock on USER_THEIR VAR_C1, securing it on the ring of USER_THEIR corset! The laces won't loosen until it is removed with the key that USER_THEY just gave to TARGET_TAG!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "heavy");
                        },
                        text: `USER_TAG places a Simple Padlock over USER_THEIR VAR_C1 - binding USER_THEMSELF with it until it is removed with the key! USER_THEY_CAP handUSER_S it to TARGET_TAG for safekeeping.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "mitten");
                        },
                        text: `USER_TAG places a Simple Padlock on USER_THEIR VAR_C1, clumsily clicking the lock shut. Using both hands, USER_THEY carefully grabUSER_S the key and offerUSER_S it to TARGET_TAG!`,
                    },
                ]
            },
            "other": {
                // Locking the lock on another
                "selflock": [
                    {
                        only: (t) => {
                            return (t.c2 == "chastity");
                        },
                        text: `USER_TAG places a Simple Padlock over the locking ring on the front of TARGET_TAG's VAR_C1, locking it securely before pocketing the key! A dancing finger across TARGET_THEIR waist makes TARGET_THEM shiver in delight!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "chastitybra");
                        },
                        text: `USER_TAG places a Simple Padlock on the locking ring between TARGET_TAG's breasts, securing TARGET_THEIR VAR_C1 and locking away any sense of pleasure on TARGET_THEIR chest! USER_THEY_CAP then tuckUSER_S the key away somewhere.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "collar");
                        },
                        text: `USER_TAG places a Simple Padlock inside the little ring on TARGET_TAG's VAR_C1 strap! The small lock dangles gently, a reminder that TARGET_THEY TARGET_ISARE at USER_THEIR mercy until the lock is removed!`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "gag");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face, placing TARGET_THEIR speech under lock and key, that USER_THEY then pocketUSER_S.`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "mask");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face. TARGET_THEY_CAP won't be able to take it off TARGET_THEIR head until USER_THEY unlock it!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "corset");
                        },
                        text: `USER_TAG wriggles slightly as USER_THEY placeUSER_S a Simple Padlock on TARGET_TAG's VAR_C1, securing it on the ring of TARGET_THEIR corset! The laces won't loosen until it is removed with USER_THEIR key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "heavy");
                        },
                        text: `USER_TAG places a Simple Padlock over TARGET_TAG's VAR_C1, preventing anyone from removing it until USER_THEY unlock it with USER_THEIR key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "mitten");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1, using USER_THEIR fingers to click the lock shut!. With a small flourish, USER_THEY pullUSER_S the key out of the lock and then hideUSER_S it away.`,
                    },
                ],
                "otherselflock": [
                    // Locking it on another, but giving THEM the key
                    {
                        only: (t) => {
                            return (t.c2 == "chastity");
                        },
                        text: `USER_TAG places a Simple Padlock over the locking ring on the front of TARGET_TAG's VAR_C1, locking it securely before handing the key to TARGET_THEM! A dancing finger across TARGET_THEIR waist reminds TARGET_THEM of the feeling of chastity...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "chastitybra");
                        },
                        text: `USER_TAG places a Simple Padlock on the locking ring between TARGET_TAG's breasts, securing TARGET_THEIR VAR_C1 and locking away any sense of pleasure on TARGET_THEIR chest! USER_THEY_CAP then handUSER_S the key over to TARGET_THEM.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "collar");
                        },
                        text: `USER_TAG places a Simple Padlock inside the little ring on TARGET_TAG's VAR_C1's strap! The small lock dangles gently, reminding TARGET_THEM that it cannot be removed until TARGET_THEY unlock it with the key USER_THEY just handed to TARGET_THEM.`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "gag");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face. TARGET_THEIR_CAP speech will remain firmly locked away until the lock is removed! Fortunately, USER_THEY gave TARGET_THEM the key! How thoughtful!`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "mask");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face. TARGET_THEIR_CAP won't be able to take it off TARGET_THEIR head until TARGET_THEY unlockTARGET_S it, since TARGET_THEY now possessTARGET_ES the key!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "corset");
                        },
                        text: `USER_TAG wriggles slightly as USER_THEY placeUSER_S a Simple Padlock on TARGET_TAG's VAR_C1, securing it on the ring of TARGET_THEIR corset! The laces won't loosen until it is removed with the key that USER_THEY just gave to TARGET_THEM!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "heavy");
                        },
                        text: `USER_TAG places a Simple Padlock over TARGET_TAG's VAR_C1, preventing it's removal until unlocked with the key that USER_THEY just gave to TARGET_THEM. Hopefully TARGET_THEY can figure out how to remove it!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "mitten");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1, using USER_THEIR fingers to click the lock shut!. As if to tease TARGET_THEM, USER_THEY putUSER_S it next to TARGET_THEM.`,
                    },
                ],
                "otherlock": [
                    // Locking it on another, but giving another person the key
                    {
                        only: (t) => {
                            return (t.c2 == "chastity");
                        },
                        text: `USER_TAG places a Simple Padlock over the locking ring on the front of TARGET_TAG's VAR_C1, locking it securely before handing the key to <@VAR_C3>! A dancing finger across TARGET_THEIR waist reminds TARGET_THEM of the feeling of chastity...`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "chastitybra");
                        },
                        text: `USER_TAG places a Simple Padlock on the locking ring between TARGET_TAG's breasts, securing TARGET_THEIR VAR_C1 and locking away any sense of pleasure on TARGET_THEIR chest! USER_THEY_CAP then handUSER_S the key over to <@VAR_C3>.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "collar");
                        },
                        text: `USER_TAG places a Simple Padlock inside the little ring on TARGET_TAG's VAR_C1's strap! The small lock dangles gently, reminding TARGET_THEM that it cannot be removed until TARGET_THEY unlock it with the key USER_THEY just handed to <@VAR_C3>.`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "gag");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face. TARGET_THEIR_CAP speech will remain firmly locked away until the lock is removed! Unfortunately, USER_THEY gave <@VAR_C3> the key!`,
                    },
                    // This is a large lock, so this case shouldn't happen, but added text in case. 
                    {
                        only: (t) => {
                            return (t.c2 == "mask");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1 on TARGET_THEIR face. TARGET_THEIR_CAP won't be able to take it off TARGET_THEIR head until TARGET_THEY unlockTARGET_S it. <@VAR_C3> will get to decide that now, as the new owner of the key.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "corset");
                        },
                        text: `USER_TAG wriggles slightly as USER_THEY placeUSER_S a Simple Padlock on TARGET_TAG's VAR_C1, securing it on the ring of TARGET_THEIR corset! The laces won't loosen until it is removed with the key that USER_THEY just gave to <@VAR_C3>!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "heavy");
                        },
                        text: `USER_TAG places a Simple Padlock over TARGET_TAG's VAR_C1, preventing it's removal until unlocked with the key that USER_THEY just gave to <@VAR_C3>.`,
                    },
                    {
                        only: (t) => {
                            return (t.c2 == "mitten");
                        },
                        text: `USER_TAG places a Simple Padlock on TARGET_TAG's VAR_C1, using USER_THEIR fingers to click the lock shut!. After the mittens are securely locked, USER_THEY giveUSER_S the key to <@VAR_C3>.`,
                    },
                ]
            }
        },
        // region fiveminutelock
        fiveminutelock : {
            "self": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a little 5 Minute Lock on USER_THEIR VAR_C1. It will keep USER_THEM chaste and securely unable to touch for... five minutes. What ever will USER_THEY do until then?`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG slips a tiny 5 Minute Lock on the closing ring of USER_THEIR VAR_C1. USER_THEIR_CAP breasts will remain secure from unwarranted groping for the next five minutes!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG threads a tiny little 5 Minute Lock timer into the little ring on USER_THEIR VAR_C1's strap. USER_THEIR_CAP neck will remain adorned, showing the world what a sub USER_THEY USER_ISARE for the next five minutes!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG places a small 5 Minute Lock onto USER_THEIR VAR_C1. Who needs speech for the next five minutes? Hopefully not USER_THEM because it won't be forthcoming until then.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG giggles as USER_THEY putUSER_S a 5 Minute Lock somewhere on USER_THEIR VAR_C1, preventing it's removal. USER_THEIR_CAP head looks so pretty with it on, for at least the next five minutes!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG takes in what breath USER_THEY can before threading a 5 Minute Lock into the straps of USER_THEIR VAR_C1! Hopefully USER_THEY didn't plan on breathing because it won't happen until the timer is up!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a 5 Minute Lock on USER_THEIR VAR_C1. Hopefully USER_THEY didn't have any plans on doing anything useful for the next little bit!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG somehow manages to thread a little 5 Minute Lock into the straps of USER_THEIR VAR_C1, and then USER_THEY pressUSER_ES the button to engage the timer! USER_THEY_CAP USER_HAVE no fingers!`,
                },
            ],
            "other": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a little 5 Minute Lock on TARGET_TAG's VAR_C1. It will keep TARGET_THEM chaste and securely unable to touch for... five minutes. A chaste subbie is a good subbie!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG slips a tiny 5 Minute Lock on the closing ring of TARGET_TAG's VAR_C1. TARGET_THEIR_CAP breasts will remain secure from unwarranted groping for the next five minutes!.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG threads a tiny little 5 Minute Lock timer into the little ring on TARGET_TAG's VAR_C1 strap. At least for the next five minutes, TARGET_THEY won't be able to hide how TARGET_THEY TARGET_ISARE a good TARGET_PRAISEOBJECT!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG places a small 5 Minute Lock onto TARGET_TAG's VAR_C1. Who needs speech for the next five minutes? Hopefully not TARGET_THEM because it won't be forthcoming until then.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG giggles as USER_THEY putUSER_S a 5 Minute Lock somewhere on TARGET_TAG's VAR_C1, preventing it's removal. TARGET_THEIR_CAP head looks so pretty with it on, for at least the next five minutes!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG tugs on TARGET_TAG's waist, pulling TARGET_THEM closer a moment before threading a 5 Minute Lock onto the laces. With a click of a button, the timer engages, ensuring TARGET_THEY TARGET_ISARE not allowed to breathe for the next five minutes!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a 5 Minute Lock on TARGET_TAG's VAR_C1. Hopefully TARGET_THEY didn't have any plans on doing anything useful for the next little bit!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG grabs TARGET_TAG's wrists and then threads little 5 Minute Locks onto the straps before pressing the engage button on them! TARGET_THEY_CAP will have no fingers for the next little bit!`,
                },
            ]
        },
        // region selflock
        selflock: {
            "self": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a little biometric lock on USER_THEIR VAR_C1, preventing others from touching until USER_THEY removeUSER_S the lock!`,
                },
            ],
            "other": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from touching until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a little biometric lock on TARGET_TAG's VAR_C1, preventing USER_THEM from doing anything else with it until TARGET_THEY removeTARGET_S the lock!`,
                },
            ]
        },
        // region timerlock
        timerlock: {
            "self": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a timer lock on USER_THEIR VAR_C1, sealing away USER_THEIR chastity! USER_THEY_CAP won't be able to touch VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a timer lock on USER_THEIR VAR_C1, sealing away USER_THEIR breasts! USER_THEY_CAP won't be able to touch them VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a timer lock on USER_THEIR VAR_C1, keeping USER_THEIR neck adorned VAR_C3! It will be impossible to hide now...`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG somehow puts a timer lock on USER_THEIR VAR_C1, sealing USER_THEIR words VAR_C3!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG somehow puts a timer lock on USER_THEIR VAR_C1, hiding USER_THEIR face VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a timer lock on the laces of USER_THEIR VAR_C1! Really, who needs to breathe VAR_C3 anyway?`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG manages to slip a timer lock on USER_THEIR VAR_C1, keeping it firmly locked away VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG manages to slip a little timer locks on USER_THEIR VAR_C1, rendering USER_THEIR hands completely useless VAR_C3!`,
                },
            ],
            "other": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1, sealing away TARGET_THEIR chastity! TARGET_THEY_CAP will just have to be a good TARGET_PRAISEOBJECT VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1, sealing away TARGET_THEIR breasts! TARGET_THEY_CAP will just have to be a good TARGET_PRAISEOBJECT VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1, keeping TARGET_THEIR neck adorned with a reminder of TARGET_THEIR submission! TARGET_THEY_CAP will have to wear it VAR_C3!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1! TARGET_THEY_CAP will not speak VAR_C3!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1! TARGET_THEY_CAP will not remove TARGET_THEIR headgear VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1, stealing TARGET_THEIR breath away VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a timer lock on TARGET_TAG's VAR_C1, locking TARGET_THEM up VAR_C3!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a timer lock on each of TARGET_TAG's VAR_C1, keeping TARGET_THEIR hands completely helpless VAR_C3!`,
                },
            ]
        },
        // region timerlock
        timedpadlock: {
            "self": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a timed padlock on USER_THEIR VAR_C1, sealing away USER_THEIR chastity! USER_THEY_CAP won't be able to touch VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a timed padlock on USER_THEIR VAR_C1, sealing away USER_THEIR breasts! USER_THEY_CAP won't be able to touch them VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a timed padlock on USER_THEIR VAR_C1, keeping USER_THEIR neck adorned VAR_C3! It will be impossible to hide from <@VAR_C4> now... `,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG somehow puts a timed padlock on USER_THEIR VAR_C1, sealing USER_THEIR words VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG somehow puts a timed padlock on USER_THEIR VAR_C1, hiding USER_THEIR face VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a timed padlock on the laces of USER_THEIR VAR_C1! Really, who needs to breathe VAR_C3 anyway? The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG manages to slip a timed padlock on USER_THEIR VAR_C1, keeping it firmly locked away VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG manages to slip a little timed padlocks on USER_THEIR VAR_C1, rendering USER_THEIR hands completely useless VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
            ],
            "other": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1, sealing away TARGET_THEIR chastity! TARGET_THEY_CAP will just have to be a good TARGET_PRAISEOBJECT VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1, sealing away TARGET_THEIR breasts! TARGET_THEY_CAP will just have to be a good TARGET_PRAISEOBJECT VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1, keeping TARGET_THEIR neck adorned with a reminder of TARGET_THEIR submission! TARGET_THEY_CAP will have to wear it VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1! TARGET_THEY_CAP will not speak VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1! TARGET_THEY_CAP will not remove TARGET_THEIR headgear VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1, stealing TARGET_THEIR breath away VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a timed padlock on TARGET_TAG's VAR_C1, locking TARGET_THEM up VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a timed padlock on each of TARGET_TAG's VAR_C1, keeping TARGET_THEIR hands completely helpless VAR_C3! The key for it is given to <@VAR_C4>.`,
                },
            ]
        },
        // region orgasmlock
        orgasmlock: {
            "self": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on USER_THEIR VAR_C1. USER_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
            ],
            "other": [
                {
                    only: (t) => {
                        return (t.c2 == "chastity");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "chastitybra");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "collar");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "gag");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                // Should not happen
                {
                    only: (t) => {
                        return (t.c2 == "mask");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "corset");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "heavy");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
                {
                    only: (t) => {
                        return (t.c2 == "mitten");
                    },
                    text: `USER_TAG puts a heat sensing Orgasm Lock on TARGET_TAG's VAR_C1. TARGET_THEY_CAP will need to orgasm at least VAR_C3 times for it to unlock!`,
                },
            ]
        },
        // region passwordlock
        passwordlock: {
            "self": [
                `USER_TAG puts a Password Lock on USER_THEIR VAR_C1 and types in a password on the touch screen. Hopefully USER_THEY won't forget it...`
            ],
            "other": [
                `USER_TAG slips a Password Lock onto TARGET_TAG's VAR_C1, typing in a password that USER_THEY kept secret in USER_THEIR mind. Hopefully it doesn't get lost!`
            ]
        },
        // region exclusivelock
        exclusivelock: {
            "self": [
                `USER_TAG puts an Exclusive Lock on USER_THEIR VAR_C1, locking USER_THEMSELF out of the restraint! Maybe someone can help USER_THEM with it...`
            ],
            "other": [
                `USER_TAG puts an Exclusive lock on TARGET_TAG's VAR_C1. Now TARGET_THEY will have to ask others for help!`
            ]
        },
        // region headpatlock
        headpatlock: {
            "self": [
                `USER_TAG puts a Timer Lock on USER_THEIR VAR_C1, locking USER_THEMSELF out of the restraint! It seems like giving USER_THEM headpats will make it longer!`
            ],
            "other": [
                `USER_TAG puts an Exclusive lock on TARGET_TAG's VAR_C1. Now TARGET_THEY will have to ask others for help!`
            ]
        },
        // region headpatlock
        locktoberlock: {
            "self": [
                `USER_TAG places a pumpkin shaped Locktober Lock on USER_THEIR VAR_C1, sealing it until November!`
            ],
            "other": [
                `USER_TAG places a pumpkin shaped Locktober Lock on TARGET_TAG's VAR_C1, sealing it until November!`
            ]
        }
    },
    unlock: {
        simplepadlock: {
            "self": [
                `USER_TAG removes the Simple Padlock from USER_THEIR VAR_C1!`
            ],
            "other": [
                `USER_TAG removes the Simple Padlock from TARGET_TAG's VAR_C1!`
            ]
        },
        fiveminutelock: {
            "self": [
                `After a tantalizing five minutes, the lock on USER_TAG's VAR_C1 falls off!`,
                `It was a short spell of bondage, but the five minute timer expires and falls off of USER_TAG's VAR_C1.`,
                `USER_TAG had to wait super long, but finally after five minutes, the lock on USER_THEIR VAR_C1 clicks open!`
            ],
            // This should never happen
            "other": [
                `Something went wrong with the five minute timer, because somehow USER_TAG removes TARGET_TAG's lock on TARGET_THEIR VAR_C1!`
            ]
        },
        selflock: {
            "self": [
                `USER_TAG removes the biometric Self Lock from USER_THEIR VAR_C1!`
            ],
            // This should never happen
            "other": [
                `USER_TAG removes the Self Lock from TARGET_TAG's VAR_C1! This should never happen, so please report it!`
            ]
        },
        timerlock: {
            "self": [
                `The timer lock finally falls off of USER_TAG's VAR_C1!`
            ],
            // This should never happen
            "other": [
                `After USER_TAG's intervention, the timer lock finally falls off of TARGET_TAG's VAR_C1! This should never happen, so please report it!`
            ]
        },
        timedpadlock: {
            "self": [
                `The timed padlock finally falls off of USER_TAG's VAR_C1!`
            ],
            "other": [
                `USER_TAG removes the timer lock from TARGET_TAG's VAR_C1 early!`
            ]
        },
        orgasmlock: {
            "self": [
                `With a thrust of USER_THEIR hips, the Orgasm Lock finally falls off of USER_TAG's VAR_C1!`
            ],
            // This should never happen
            "other": [
                `USER_TAG removes the timer lock from TARGET_TAG's VAR_C1 early!`
            ]
        },
        exclusivelock: {
            // This should never happen
            "self": [
                `USER_TAG *somehow* removes the Exclusive Lock from USER_THEIR VAR_C1! This catastrophic event should be reported.`
            ],
            "other": [
                `USER_TAG removes the Exclusive Lock from TARGET_TAG's VAR_C1! Now TARGET_THEY can do stuff with TARGET_THEIR restraint again!`
            ]
        },
        passwordlock: {
            // This should never happen
            "self": [
                `USER_TAG enters the password on USER_THEIR VAR_C1 and takes it off!`
            ],
            "other": [
                `USER_TAG dials in the password on TARGET_TAG's VAR_C1! The lock clicks open and then USER_THEY remove it from the ring!`
            ]
        },
        headpatlock: {
            "self": [
                `The timer lock finally falls off of USER_TAG's VAR_C1!`
            ],
            // This should never happen
            "other": [
                `After USER_TAG's intervention, the timer lock finally falls off of TARGET_TAG's VAR_C1! This should never happen, so please report it!`
            ]
        },
        locktoberlock: {
            "self": [
                `Locktober is finally over, and the pumpkin shaped lock fades away from USER_TAG's VAR_C1!`
            ],
            // This should never happen
            "other": [
                `Locktober is finally over, and the pumpkin shaped lock fades away from USER_TAG's VAR_C1!`
            ]
        },
        defaultlock: {
            "self": [
                `USER_TAG removes the lock from USER_THEIR VAR_C1! Text keys are probably missing and should be fixed though.`
            ],
            "other": [
                `USER_TAG removes the lock from TARGET_TAG's VAR_C1! Text keys are probably missing and should be fixed though.`
            ]
        }
    },
    timeAdd: {
        headpatlock: {
            "self": [
                `As USER_TAG receives a headpat, the timer on USER_THEIR VAR_C1 just got a little longer...`
            ],
            "other": [
                `As USER_TAG receives a headpat, the timer on USER_THEIR VAR_C1 just got a little longer...`
            ]
        }
    }
}