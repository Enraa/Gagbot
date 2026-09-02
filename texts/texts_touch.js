const { getArousal } = require("../functions/getters/arousal/getArousal");
const { getCollar } = require("../functions/getters/collar/getCollar");
const { getUserTags } = require("../functions/getters/config/getUserTags");
const { getHeadwearRestrictions } = require("../functions/getters/headwear/getHeadwearRestrictions");
const { getHeavyList } = require("../functions/getters/heavy/getHeavyList");

exports.texts_touch = {
    //region touch - headpat
    headpat: {
        self: {
            hit: {
                triplecrit: {
                    noboundmiss: [
                        `USER_TAG looks upon the channel and thinks to USER_THEMSELF - *Never tell me the odds*. Then, with careful precision, USER_THEY placeUSER_S USER_THEIR hand on USER_THEIR head. The critical hit echoes, for a second time. And then... a ***third*** time! USER_THEY_CAP beat the 1/8000 odds!`
                    ]
                },
                doublecrit: {
                    noboundmiss: [
                        `USER_TAG focuses USER_THEIR breath and places USER_THEIR hand on USER_THEIR waist, as if to unsheathe and perform a Middare Patsugekka on USER_THEMSELF, critting *twice* in one swing!`,
                        `USER_TAG carefully breathes in and out... then out comes USER_THEIR pat on top of USER_THEIR head! Lady luck must favor USER_THEM twice over, as the sound echoes on the wall in succession!`
                    ]
                },
                crit: {
                    // This is the only thing that can occur on hit
                    noboundmiss: [
                        `USER_TAG raises USER_THEIR hand to give USER_THEMSELF a headpat! It hits in JUST the perfect spot and gives USER_THEM the critical satisfaction!`,
                        `As if guided by an unseen hand, USER_TAG places USER_THEIR hand on USER_THEIR head at just the perfect angle for the *perfect* headpat!`,
                        `USER_TAG gasps as USER_THEY manageUSER_S to deliver the best headpat ever to USER_THEMSELF! Not too firm, not too soft, it's just right!`,
                        `A faint chime can be heard as USER_TAG places USER_THEIR hand on USER_THEIR head! It landed just in the right spot, providing a hefty amount of happiness!`,
                        `It might only be on USER_THEMSELF, but who better to know just where the best sensations can be found on USER_TAG's head? USER_THEY_CAP meltUSER_S under USER_THEIR own critical pat...`
                    ]
                },
                nocrit: {
                    // This is the only thing that can occur on hit
                    noboundmiss: [
                        `USER_TAG grins as USER_THEY placeUSER_S USER_THEIR hand on USER_THEIR head! USER_THEY_CAP USER_ISARE content!`,
                        `USER_TAG giggles as USER_THEY runUSER_S USER_THEIR fingers up to USER_THEIR head, spreading them ever so slightly over the top of USER_THEIR head!`,
                        `USER_TAG nods as USER_THEY placeUSER_S USER_THEIR hand on USER_THEIR head. It's not quite the same as someone else doing it to USER_THEM though.`,
                        `Leaning forward slightly, USER_TAG places USER_THEIR hand on USER_THEIR head, taking in the moment.`,
                        `USER_TAG places both hands on USER_THEIR head, rubbing them slightly over the top of it, ruffling USER_THEIR hair!`,
                        `USER_TAG ruffles USER_THEIR own hair, enjoying the sensation as USER_THEIR bangs fly around in front of USER_THEIR face!`
                    ]
                }
            },
            nohit: {
                nocrit: {
                    "arms": [
                        `USER_TAG tries to manipulate USER_THEIR arms to give USER_THEMSELF a well deserved headpat, but despite USER_THEIR greatest effort, USER_THEIR bondage holds USER_THEM firmly in place.`,
                        `USER_TAG sighs and looks around the room, pleading someone to pat USER_THEIR head! USER_THEY_CAP definitely deserveUSER_S it!`,
                        `Not for lack of trying, USER_TAG squirms in USER_THEIR bondage to try to give USER_THEMSELF a pat on the head. Unfortunately, USER_THEY will need some assistance from someone.`,
                        `The cruel bondage binding USER_THEIR arms prevents USER_TAG from giving USER_THEMSELF a pat on the head. How saddening. Someone should cheer USER_THEM up!`,
                    ],
                    // These should never occur on self, but I'll add a couple for my demo!
                    "legs": [
                        `USER_TAG attempts to give USER_THEMSELF a pat on the head, but somehow USER_THEIR legs have failed USER_THEM! (This is a bug, report!)`
                    ],
                    // These should never occur on self, but I'll add a couple for my demo!
                    "container": [
                        `USER_TAG attempts to give USER_THEMSELF a pat on the head, but USER_THEY USER_ISARE in some kind of container preventing that! (This is a bug, report!)`
                    ],
                    // These should never occur on self, but I'll add a couple for my demo!
                    "blind": [
                        `USER_TAG attempts to give USER_THEMSELF a pat on the head, but USER_THEY USER_ISARE are somehow too blind to see! (This is a bug, report!)`
                    ],
                    // These should never occur on self, but I'll add a couple for my demo!
                    noboundmiss: [
                        `USER_TAG attempts to give USER_THEMSELF a pat on the head, but somehow can't because of some arcane curse! (This is a bug, report!)`
                    ]
                }
            }
        },
        other: {
            hit: {
                triplecrit: {
                    noboundmiss: [
                        `USER_TAG looks upon the channel and thinks to USER_THEMSELF - *Never tell me the odds*. Then, with careful precision, USER_THEY placeUSER_S USER_THEIR hand on TARGET_TAG's head. The critical hit echoes, for a second time. And then... a ***third*** time! USER_THEY_CAP beat the 1/8000 odds!`
                    ]
                },
                doublecrit: {
                    noboundmiss: [
                        `USER_TAG focuses USER_THEIR breath and places USER_THEIR hand on USER_THEIR waist, as if to unsheathe and perform a Middare Patsugekka on TARGET_TAG, critting *twice* on TARGET_THEIR head in one swing!`,
                        `USER_TAG carefully breathes in and out... then out comes USER_THEIR pat on top of TARGET_TAG's head! Lady luck must favor USER_THEM twice over, as the sound echoes on the wall in succession!`,
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG places USER_THEIR hand on TARGET_TAG's head! Shockingly, USER_THEY manage to find the secret reset switch, instantly disabling the bot for a moment. It recovers just a minute later before falling over a *second* time with stars in its eyes. After another cycle, it finally manages to stand up again and curtsies to USER_THEM, giving a pleasurable sound not unlike a 'thank you!' Well, as best can be understood through its gag anyway.`
                        },
                    ]
                },
                crit: {
                    // This is the only thing that can occur on hit
                    noboundmiss: [
                        `A chime is heard and USER_TAG's face cuts in as USER_THEY deftly moveUSER_S to deliver a headpat to TARGET_TAG, placing USER_THEIR fingers in just the right spot!`,
                        `USER_TAG leaps towards TARGET_TAG and places USER_THEIR hand in just the right way, giving TARGET_THEM a critical headpat!`,
                        `USER_TAG grins devillishly as USER_THEY giveUSER_S TARGET_TAG a headpat! It connects in just the *perfect* spot! TARGET_THEY_CAP TARGET_ISARE stunned for a brief moment!`,
                        `There may have been thousands of headpats before, but the one USER_TAG is giving TARGET_TAG now is a perfectly unique one!`,
                        `A different sound is heard as USER_TAG places USER_THEIR hand on TARGET_TAG. The headpat leaves TARGET_THEM in a bubbly glee!`,
                        `USER_TAG disappears for a brief moment and then appears behind TARGET_TAG, giving TARGET_THEM a stealthy critical pat before TARGET_THEY spotTARGET_S USER_THEM!`,
                        `USER_TAG limit breaks and casts a super-pat on TARGET_TAG! TARGET_THEY_CAP TARGET_ISARE left stunned from the sensation!`,
                        `USER_TAG meditates for a moment and then gently places USER_THEIR hand on TARGET_TAG, moving at such a practiced and deliberate pace. The efforts pay off as TARGET_THEY meltTARGET_S under the gentlest, bestest of pats!`,
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG runs USER_THEIR finger along TARGET_TAG's cheek, showering the bot with praise as the bot's synthetic porcelain skin almost appears to grow pink for a moment!`
                        },
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG places a hand on TARGET_TAG's head. It's eyes go blank unexpectedly and a chime of falling notes can be heard from it's vocal processors as it goes unresponsive for a moment. Before USER_THEY can register what happened, the bot returns to life again!`
                        },
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG pats TARGET_TAG in just the right way, causing it to utter a synthetic, but genuine sound of pleasure - whatever a robot would sound like, anyway!`
                        },
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG places USER_THEIR hand on TARGET_TAG's head. Its eyes glow brightly and it smiles while it's vocal processors utter a sound of sheer delight!`
                        },
                    ]
                },
                nocrit: {
                    // This is the only thing that can occur on hit
                    noboundmiss: [
                        `USER_TAG reaches over and gives TARGET_TAG a pat on the head!`,
                        `USER_TAG smiles as USER_THEY leanUSER_S forward and placeUSER_S USER_THEIR hand on TARGET_TAG's head!`,
                        `With a soft coo, USER_TAG runs USER_THEIR hand on TARGET_TAG's head, giving TARGET_THEM a headpat!`,
                        `TARGET_TAG looked like TARGET_THEY needed a headpat, so USER_TAG reaches over and gives TARGET_THEM a pat on the head!`,
                        `USER_TAG places USER_THEIR hand on TARGET_TAG's head. It's a gentle headpat, endearing even!`,
                        `USER_TAG dances USER_THEIR fingers over TARGET_TAG's head and through TARGET_THEIR hair! It provides a faintly ticklish sensation!`,
                        `USER_TAG gives TARGET_TAG a headpat, running USER_THEIR fingers back and forth a bit to ruffle TARGET_THEIR hair!`,
                        `USER_TAG gently pats TARGET_TAG's head. Pat pat pat!`,
                        `USER_TAG conjures a ghostly hand to run over TARGET_TAG's head. It ruffles TARGET_THEIR hair and returns back to it's conjurer!`,
                        `USER_TAG places a hand on TARGET_TAG's head, giggling to USER_THEMSELF as TARGET_THEY leanTARGET_S into the pat!`,
                        `Because TARGET_TAG is absolutely adorable, USER_TAG pats TARGET_THEIR head!`,
                        `USER_TAG places a single finger on TARGET_TAG's head... then adds more one by one before lowering USER_THEIR hand fully onto TARGET_THEIR head. **Pat.**`,
                        {
                            // If both parties like pet play...
                            required: (t) => {
                                return !(getUserTags(t.serverID, t.interactionuser.id).includes("pet") && getUserTags(t.serverID, t.targetuser.id).includes("pet"));
                            },
                            text: `USER_TAG imagines USER_THEY USER_ISARE petting a pet as USER_THEY placeUSER_S USER_THEIR hand on TARGET_TAG's head.`
                        },
                        {
                            // If both parties havent blocked pet tag and the interaction user has targetuser's collar key, this can happen!
                            required: (t) => {
                                return (!(getUserTags(t.serverID, t.interactionuser.id).includes("pet") && getUserTags(t.serverID, t.targetuser.id).includes("pet")) &&
                                        (getCollar(t.serverID, t.targetuser.id)?.keyholder == t.interactionuser.id) || (getCollar(t.serverID, t.targetuser.id)?.clonedKeyholders && getCollar(t.serverID, t.targetuser.id)?.clonedKeyholders.includes(t.interactionuser.id)));
                            },
                            text: `USER_TAG runs USER_THEIR hand over USER_THEIR beautiful and loyal pet's head! TARGET_TAG shines in delight!`
                        },
                        {
                            // If both parties havent blocked pet tag and the interaction user has targetuser's collar key, this can happen!
                            required: (t) => {
                                return (!(getUserTags(t.serverID, t.interactionuser.id).includes("pet") && getUserTags(t.serverID, t.targetuser.id).includes("pet")) &&
                                        (getCollar(t.serverID, t.targetuser.id)?.keyholder == t.interactionuser.id) || (getCollar(t.serverID, t.targetuser.id)?.clonedKeyholders && getCollar(t.serverID, t.targetuser.id)?.clonedKeyholders.includes(t.interactionuser.id)));
                            },
                            text: `USER_TAG plays with TARGET_TAG's ears as USER_THEY patUSER_S USER_THEIR bestest pet! TARGET_THEY_CAP TARGET_ISARE such a good TARGET_PRAISEOBJECT! Yes TARGET_THEY TARGET_ISARE!`
                        },
                        `USER_TAG places USER_THEIR hand on TARGET_TAG's head. TARGET_THEY_CAP nuzzleTARGET_S into USER_THEIR hand with zero thoughts!`,
                        `USER_TAG considers pouncing on TARGET_TAG to tie TARGET_THEM up, but instead opts to pat TARGET_THEM. The bondage can wait for later!`,
                        `USER_TAG giggles as USER_THEY placeUSER_S USER_THEIR hands on TARGET_TAG's head, giving TARGET_THEM a silly little headpat!`,
                        `USER_TAG scritches TARGET_TAG's head in all the fun little places! TARGET_THEY_CAP sighTARGET_S in content at the headpat...`,
                        `USER_TAG gently pats the hair on TARGET_TAG's head, giving TARGET_THEM a sense of glee as the sensations run down TARGET_THEIR body!`,
                        `USER_TAG gingerly runs USER_THEIR fingers over TARGET_TAG's ears and behind TARGET_THEIR head to give TARGET_THEM a small but gentle scritch!`,
                        `USER_TAG brushes the hair out of TARGET_TAG's face as USER_THEY runUSER_S USER_THEIR hand over TARGET_THEIR head with a cute little headpat!`,
                        {
                            required: (t) => {
                                return (getArousal(t.serverID, t.targetuser.id) > 50)
                            },
                            text: `USER_TAG runs USER_THEIR hand over TARGET_TAG's hair. The heat radiating from TARGET_THEIR breath is enough to cook an egg with!`
                        },
                        {
                            required: (t) => {
                                return (getArousal(t.serverID, t.targetuser.id) > 100)
                            },
                            text: `USER_TAG runs USER_THEIR hand over TARGET_TAG's hair. TARGET_THEIR_CAP eyes are a bit glazed over from how horny TARGET_THEY feelTARGET_S right now...`
                        },

                        // If they target gagbot, these lines are available. They will each be tripled to ensure they're likely chosen!
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG places a hand on TARGET_TAG, rewarding the bot for a job well done! It is a good bot, tying up all the silly subbies!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG places a hand on TARGET_TAG, rewarding the bot for a job well done! It is a good bot, tying up all the silly subbies!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG reaches over to pat TARGET_TAG and... it allows USER_THEM! Such a good bot! Maybe it will reward USER_THEM with some extra special bondage!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG reaches over to pat TARGET_TAG and... it allows USER_THEM! Such a good bot! Maybe it will reward USER_THEM with some extra special bondage!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG tries to reach up and place USER_THEIR hand on the tall TARGET_TAG. A mechanical *giggle* can be heard from it as it kneels down to allow USER_THEM to ruffle its hair!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG tries to reach up and place USER_THEIR hand on the tall TARGET_TAG. A mechanical *giggle* can be heard from it as it kneels down to allow USER_THEM to ruffle its hair!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `TARGET_TAG has been behaving so well lately, so USER_TAG goes to deliver an amazing headpat to the bestest bot!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `TARGET_TAG has been behaving so well lately, so USER_TAG goes to deliver an amazing headpat to the bestest bot!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG meeps a request to TARGET_TAG to kneel. It complies and USER_THEY placeUSER_S USER_THEIR hands in the bot's hair, ruffling it and playing with the head harness affixed to it! It is a good bot!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG meeps a request to TARGET_TAG to kneel. It complies and USER_THEY placeUSER_S USER_THEIR hands in the bot's hair, ruffling it and playing with the head harness affixed to it! It is a good bot!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG recognizes that even mechanical robots need a break sometimes, so USER_THEY decideUSER_S to pat TARGET_TAG! It's cooling fans can be heard spinning up to a slightly higher speed after the headpat!`
                        },
                        {
                            required: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG recognizes that even mechanical robots need a break sometimes, so USER_THEY decideUSER_S to pat TARGET_TAG! It's cooling fans can be heard spinning up to a slightly higher speed after the headpat!`
                        },
                    ]
                }
            },
            nohit: {
                nocrit: {
                    "arms": [
                        `USER_TAG squirms as USER_THEY attemptUSER_S to pat TARGET_TAG, but fails without USER_THEIR arms.`,
                        `USER_TAG tries to contort USER_THEIR arms in some kind of angle to pat TARGET_TAG, but unfortunately USER_THEY just can't place USER_THEIR hands on TARGET_THEM!`,
                        `USER_TAG knows USER_THEIR arms are bound away, but that doesn't stop USER_THEM from trying to pat TARGET_TAG on the head!`,
                        `With the power of imagination, USER_TAG tries to pat TARGET_TAG. It's about the best that can be done without arms.`,
                        `USER_TAG wants to pat TARGET_TAG but cannot. Maybe USER_THEY should enlist the help of some nearby friends to assist!`,
                        `USER_TAG tugs against USER_THEIR bondage to try to break an arm free, but sadly fails to do so. TARGET_TAG's head will just have to remain unpatted.`,
                        `*If only my arms were free...* thinks USER_TAG. TARGET_TAG's head looks so appealing to pat right now but USER_THEY just can't get USER_THEIR hand free to do so.`
                    ],
                    "legs": [
                        `USER_TAG almost falls over trying to pat TARGET_TAG, but TARGET_THEY TARGET_ISARE able to deftly dodge the pats!`,
                        `USER_TAG tries to reach towards TARGET_TAG, but unfortunately USER_THEIR legs are bound away, making it impossible to even touch TARGET_THEM!`
                    ],
                    "container": [
                        `USER_TAG wants to pat TARGET_TAG, but USER_THEY USER_ISARE locked away in a container!`,
                        `USER_TAG waves USER_THEIR hands to pat TARGET_TAG, but unfortunately TARGET_THEY TARGET_ISARE in a different container. Or castle. One of the two!`,
                        `USER_TAG probably forgot that USER_THEY USER_ISARE in a container right now, so reaching TARGET_TAG is a challenging prospect.`,
                        `USER_TAG imagines patting TARGET_TAG since USER_THEY USER_ISARE in a container. Oh well.`,
                        `TARGET_TAG looks like TARGET_THEY wantTARGET_S a headpat, from over there. Sadly, TARGET_THEY TARGET_ISARE not in the same container as USER_TAG so TARGET_THEIR head remains unpatted.`
                    ],
                    "blind": [
                        `USER_TAG waves USER_THEIR hands around in the dark, trying to feel USER_THEIR way to TARGET_TAG to pat TARGET_THEIR head. Unfortunately, TARGET_THEY just can't be found!`,
                        `Though USER_TAG is peering deeply into USER_THEIR own dark void, USER_THEY just can't find TARGET_TAG, let alone give TARGET_THEM a headpat!`,
                        `USER_TAG tries to focus on the voice of TARGET_TAG, to find TARGET_THEM in the inky darkness, but sadly, USER_THEIR hands do not find TARGET_THEIR head...`,
                        `USER_TAG is not a bat, so using echolocation to find TARGET_TAG is a serious challenge. USER_THEY_CAP failUSER_S to find TARGET_THEM.`
                    ],
                    noboundmiss: [
                        `USER_TAG tries to pat TARGET_TAG's head, but fumbles and misses TARGET_THEM completely!`,
                        `USER_TAG lunges forward to pat TARGET_TAG's head, but TARGET_THEY TARGET_ISARE able to move out of the way just in time!`,
                        `USER_TAG closes USER_THEIR eyes, preparing USER_THEIR signature attack: The Pat Sonata! But the attack misses TARGET_TAG.`,
                        `USER_TAG tries to place USER_THEIR hand on TARGET_TAG's head, but unfortunately a slight movement and a cascade of errors causes USER_THEM to miss!`,
                        `It's not for lack of trying, but for some reason, USER_TAG fumbles while trying to give TARGET_TAG a headpat and misses TARGET_THEM!`,
                        `USER_TAG may need to check USER_THEIR calculations because the headpat missed TARGET_TAG entirely.`,
                        `Despite not being blindfolded or USER_THEIR legs bound or anything, USER_TAG still manages to miss TARGET_TAG. TARGET_THEY_CAP must be built different.`,
                        `The accuracy check is 95% - a 1 in 20 chance to miss - and *still* USER_TAG manages to miss TARGET_TAG when trying to place USER_THEIR hand on TARGET_THEIR head.`,

                        // Gagbot dodges
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG tries to place USER_THEIR hand on TARGET_TAG's head, but it dodges to the side and a taunting giggle can be heard from it, along with it's fiery amethyst eyes almost... smiling!`
                        },
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG almost manages to place USER_THEIR hands on TARGET_TAG before it twists around in a flourish to pull away from the hands. It has *not* granted USER_THEM permission yet! USER_THEY_CAP should grovel and beg for the opportunity.`
                        },
                        {
                            only: (t) => {
                                return (t.targetuser.id == process.client.user.id);
                            },
                            text: `USER_TAG tries to headpat TARGET_TAG but it slinks away from the hand, staring sharply at USER_THEM to *kneel* to it instead.`
                        },
                    ]
                }
            }
        }
    },
    //region touch - nom
    nom: {
        self: {
            masked: [
                {
                    required: (t) => {
                        return (getHeavyRestrictions(t.serverID, t.interactionuser.id).touchself);
                    },
                    text: `USER_TAG tries to nibble on USER_THEMSELF, but only succeeds in rubbing USER_THEIR mask on USER_THEIR arm. How *cute!*`,
                },
                {
                    required: (t) => {
                        return (getHeavyRestrictions(t.serverID, t.interactionuser.id).touchself);
                    },
                    text: `USER_TAG absentmindedly massages USER_THEIR masked lips on USER_THEIR arm. Not much else USER_THEY could do anyway.`
                },
                `USER_TAG clicks USER_THEIR teeth, trying desperately to nom but can't bite past the mask USER_THEY USER_ISARE wearing!`,
                `If only USER_TAG remembered that nibbing past masks is a challenging prospect in the best of times...`,
                `USER_TAG tries to nom but is cruelly stopped by USER_THEIR mask. Who ever was going to be the target?`,
            ],
            gagged: [
                {
                    required: (t) => {
                        return (getHeavyRestrictions(t.serverID, t.interactionuser.id).touchself);
                    },
                    text: `USER_TAG paws USER_THEIR wrist against USER_THEIR gag, trying to bite somewhere, but the gag does a good job stopping that!`,
                },
                {
                    required: (t) => {
                        return (getHeavyRestrictions(t.serverID, t.interactionuser.id).touchself);
                    },
                    text: `USER_TAG absentmindedly massages USER_THEIR gagged lips on USER_THEIR arm. Not much else USER_THEY could do anyway.`
                },
                {
                    required: (t) => {
                        return (getHeavyRestrictions(t.serverID, t.interactionuser.id).touchself);
                    },
                    text: `USER_TAG decides to act very preciously, and runs USER_THEIR fingers on USER_THEIR face. Oh if only USER_THEY could nom...`
                },
                `USER_TAG wants to nibble, USER_THEY wantUSER_S to *bite!* But the gag in USER_THEIR mouth said no. Oh well. At least it looks good on USER_THEM!`,
                `USER_TAG giggles as USER_THEY aimUSER_S to nibble on USER_THEMSELF, but the gag does a fine job preventing USER_THEIR teeth from ever coming together on USER_THEIR finger!`,
                `USER_TAG rubs USER_THEIR shoulder against USER_THEIR chin, trying to get a little bit of leverage to nibble. Sadly, no luck there. No nibbling today...`
            ],
            heavy: [
                `USER_TAG wants to nibble on USER_THEIR arm, but alas, USER_THEIR bondage makes it nearly impossible to connect USER_THEIR mouth with its destination.`,
                `Trying to place USER_THEIR wrist on USER_THEIR mouth to nom on it is a challenging prospect when wearing such heavy bondage. USER_THEY_CAP should consider fixing that.`,
                `It won't be for lack of trying, USER_THEY supposeUSER_S, but USER_TAG is unable to reach USER_THEIR arms when bound like so. USER_THEY_CAP will have to remain unbitten!`
            ],
            free: [
                `USER_TAG nibbles on USER_THEIR arm, a cute little smile escaping from USER_THEIR lips as USER_THEY happily and silently nomUSER_S away!`,
                `USER_TAG sinks USER_THEIR teeth into USER_THEIR forearm, humming to USER_THEMSELF as USER_THEY absentmindedly nibbleUSER_S and nibbleUSER_S.`,
                `USER_TAG blissfully chews on USER_THEIR finger, unburdened by any other thoughts! Nom nom nom!`,
                `USER_TAG places USER_THEIR teeth on USER_THEIR fingers and just rests them there. Nom.`,
                `USER_TAG doesn't want to nom on anyone but USER_THEMSELF apparently as USER_THEY nibbleUSER_S gently on USER_THEIR arm!`
            ]
        },
        other: {
            masked: [
                `USER_TAG rubs USER_THEIR face on TARGET_TAG's arm very cutely. USER_THEY_CAP wantUSER_S to nibble, but sadly, USER_THEIR mask stops USER_THEM.`,
                `USER_TAG tries to nibble on TARGET_TAG, but TARGET_THEY TARGET_ISARE saved by the protective headgear that USER_THEY USER_ISARE wearing!`,
                `USER_TAG goes to nibble on TARGET_TAG, but is sadly stopped and reminded of how futile that would be. USER_THEY_CAP needUSER_S to get rid of the mask first!`,
                `USER_TAG nuzzles USER_THEIR face into TARGET_TAG's chest since USER_THEY can't nibble due to the mask USER_THEY USER_ISARE wearing. Oh well.`,
                `USER_TAG thinks TARGET_TAG looks very nommable! USER_THEY_CAP goes to nibble and... aw, USER_THEY USER_ISARE stopped by the mask!`,
                `USER_TAG tries to nom but is cruelly stopped by USER_THEIR mask. Who ever was going to be the target?`,
            ],
            gagged: [
                `USER_TAG rubs USER_THEIR gagged lips against TARGET_TAG's skin. It's absolutely adorable. Good thing USER_THEY USER_ISARE gagged so TARGET_THEY TARGET_ISARE safe!`,
                `USER_TAG baps USER_THEIR mouth into TARGET_TAG clumsily. USER_THEY_CAP wantUSER_S to nibble, but alas, USER_THEIR gag had other plans. Oh well.`,
                `USER_TAG imagines what it would be like to gently sink USER_THEIR teeth into TARGET_TAG's arm. It's a fantasy for after USER_THEY getUSER_S out of USER_THEIR gag, probably!`,
                {
                    required: (t) => {
                        return (getHeadwearRestrictions(t.serverID, t.interactionuser.id).canEmote);
                    },
                    text: `USER_TAG twists USER_THEIR face into such a cute and adorable look as USER_THEY pleadUSER_S TARGET_TAG to ungag USER_THEM. Why? To *nom.*`
                },
                `USER_TAG lays USER_THEIR head gently against TARGET_TAG. It would be so nice to nom. USER_THEY_CAP chewUSER_S on USER_THEIR gag in deep thought.`,
                `USER_TAG smugly stares at TARGET_TAG. TARGET_THEY_CAP TARGET_ISARE lucky afterall. USER_THEY_CAP can't nom! But one day, USER_THEY will nom!`,
                `USER_TAG sighs as USER_THEY goUSER_ES to nom on TARGET_TAG, but is stopped by USER_THEIR gags. USER_THEY_CAP must nom!`,
                `USER_TAG tries to nom but is cruelly stopped by USER_THEIR gag! Who ever was going to be the target?`,
            ],
            heavy: [
                `USER_TAG noms on TARGET_TAG, but somehow encounters a GLITCH that USER_THEY should report!`
            ],
            free: [
                `USER_TAG nibbles on TARGET_TAG's arm. Nibble nibble nibble!`,
                `USER_TAG noms on TARGET_TAG's forearm oh so gently. Nom!`,
                `USER_TAG brushes USER_THEIR lips along TARGET_TAG's skin before sinking USER_THEIR teeth. Not too hard, mind you. Just a little bit. Just enough to nibble!`,
                `USER_TAG chews on TARGET_TAG's wrist, trying to get attention!`,
                `USER_TAG eyes USER_THEIR target - TARGET_TAG! With a deft motion USER_THEY dartUSER_S forward to *nom!* TARGET_THEY_CAP is nibbled!`,
                `Nibbling is a favorite passtime of USER_TAG, so USER_THEY decideUSER_S to nibble on TARGET_TAG.`,
                `USER_TAG giggles as USER_THEY quickly moveUSER_S to nibble on TARGET_TAG!`,
                `USER_TAG must nibble, so USER_THEY nomUSER_S on TARGET_TAG! Nom nom!`,
                `USER_TAG gently noms on TARGET_TAG's arm. It's a cute little bite. Nom!~`,
                {
                    // If both parties havent blocked pet tag and the target user has the interactionuser's key, nom because brat
                    required: (t) => {
                        return (!(getUserTags(t.serverID, t.interactionuser.id).includes("pet") && getUserTags(t.serverID, t.targetuser.id).includes("pet")) &&
                                (getCollar(t.serverID, t.interactionuser.id)?.keyholder == t.targetuser.id) || (getCollar(t.serverID, t.interactionuser.id)?.clonedKeyholders && getCollar(t.serverID, t.interactionuser.id)?.clonedKeyholders.includes(t.targetuser.id)));
                    },
                    text: `USER_TAG decides to nom on USER_THEIR keyholder. Such a bratty pet!`
                },
            ]
        }
    },
    // region touch - hug
    hug: {
        self: {
            heavy: [
                {
                    // If wearing a straitjacket, the user should get some unique self hugging text!
                    only: (t) => {
                        return (getHeavyList(t.serverID, t.interactionuser.id).find((h) => h.type.includes("straitjacket")))
                    },
                    text: `USER_TAG goes to hug USER_THEMSELF and is happy to realize USER_THEY USER_ISARE already hugging USER_THEMSELF! Yay!`
                },
                `USER_TAG wiggles in USER_THEIR bondage, trying to hug USER_THEMSELF but sadly USER_THEY cannot...`,
                `USER_TAG wants to be hugged but fails at trying to hug USER_THEMSELF. If only someone could hug USER_THEM...`,
                `USER_TAG wriggles, trying to squirm out of USER_THEIR bondage so USER_THEY can hug USER_THEMSELF. It isn't working.`,
            ],
            free: [
                `USER_TAG wraps USER_THEIR arms around USER_THEMSELF in a gleeful hug. Hehe!`,
                `USER_TAG giggles as USER_THEY plant USER_THEIR arms around USER_THEMSELF in a cute little hug!`,
                `USER_TAG clutches USER_THEIR arms to USER_THEIR chest and laughs! Eeeeee!~`
            ]
        },
        other: {
            heavy: [
                `USER_TAG goes to hug TARGET_TAG, but without arms USER_THEY can do little more than lay USER_THEIR body against TARGET_THEM!`,
                `USER_TAG tries to hug TARGET_TAG, but can't quite wrap USER_THEIR arms around TARGET_THEM. The sentiment is there though.`,
                `USER_TAG brushes up against TARGET_TAG and nuzzles TARGET_THEM since USER_THEIR arms are bound so tightly.`
            ],
            free: [
                `USER_TAG gives TARGET_TAG a big hug!`,
                `USER_TAG wraps USER_THEIR arms around TARGET_TAG and gives TARGET_THEM a hug!`,
                `USER_TAG gingerly wraps USER_THEIR arms around TARGET_TAG in a soft embrace!`,
                `USER_TAG clutches TARGET_TAG around TARGET_THEIR waist, pulling TARGET_THEM closely for a warm hug!`,
                `USER_TAG giggles as USER_THEY cheerily wrapUSER_S USER_THEIR arms around TARGET_TAG with a soft and sweet hug!`,
                `USER_TAG grabs TARGET_TAG and pulls TARGET_THEM into a tight hug, not letting go for a bit!`,
                `USER_TAG pinches TARGET_TAG's sleeve cutely before tugging TARGET_THEM into a hug!`
            ]
        }
    },
    // region touch - boop
    /*boop: {
        self: {
            heavy: [
                
            ],
            mitten: [

            ],
            free: [

            ]
        },
        other: {
            heavy: [

            ],
            mitten: [

            ],
            free: [

            ]
        }
    }*/
}