exports.texts_dressprotocol = {
    "costumer_mimic": {
        // Setup stage, auto advance to stage 1. Further setup stages can be defined by going into negative numbers.
        stage0: [
            `The VAR_C1's tentacles toss and turn USER_TAG all around as USER_THEY struggleUSER_S! The teeth of the mimic hold the chest firmly closed while those tentacles run over every single part of USER_THEIR body, deciding *precisely* what USER_THEY should wear today!`
        ],
        // Remove all clothing stage. Advance to stage 2 if everything is consumed! 
        stage1: {
            nom: {
                multiple: [
                    `The VAR_C1 tugs at USER_TAG's outfit hungrily, tearing away and consuming the VAR_C2 that USER_THEY USER_WERE wearing!`,
                    `The VAR_C1's tentacles rip off the VAR_C2 that USER_TAG is wearing, stuffing them into its gaping maw and storing it away!`,
                    `The VAR_C1's tentacles snake out to swipe across the VAR_C2 that USER_TAG is wearing, dissolving them away before absorbing the remains!`,
                    // If they're wearing makeup, tattoos or other "items that require removers,"" have the tentacles note such
                    {
                        only: (t) => {
                            return (t.nomtags.includes("makeup"))
                        },
                        text: `The VAR_C1's tentacles ravish over USER_TAG's body to remove the VAR_C2, using a gentle substance to remove some items on USER_THEM!`
                    },
                    {
                        only: (t) => {
                            return (t.nomtags.includes("tattoo"))
                        },
                        text: `The VAR_C1's tentacles ravish over USER_TAG's body to remove the VAR_C2, using magical removers to remove some permanent items on USER_THEM!`
                    },
                ],
                single: [
                    `The VAR_C1's tentacles gently swipe over the sole VAR_C2 on USER_TAG's body, removing it swiftly despite USER_THEIR struggles!`,
                    `Already nearly naked, the VAR_C1's tentacles remove the VAR_C2 on USER_TAG's body, devouring it hungrily!`
                ]
            },
            endstage: [
                `Satisfied with a freshly naked USER_TAG, the VAR_C1 continues to toss USER_THEM around inside while collecting the outfit pieces it requires to dress USER_THEM!`,
                `Now that the VAR_C1 has finished removing USER_THEIR outfit USER_TAG is stripped bare, helpless as it begins to dress USER_THEM in one of its preferred costumes.`,
                `With a satisfied hum, the VAR_C1 finishes consuming USER_TAG's clothes and begins to dress USER_THEM in the costume it has picked out!`
            ]
        },
        // Dress the user up now, while removing offending clothing if necessary!
        stage2: {
            nom: {
                multiple: [
                    `The VAR_C1 tugs at USER_TAG's outfit hungrily, tearing away and consuming the VAR_C2 that USER_THEY USER_WERE wearing!`,
                    `The VAR_C1's tentacles rip off the VAR_C2 that USER_TAG is wearing, stuffing them into its gaping maw and storing it away!`,
                    `The VAR_C1's tentacles snake out to swipe across the VAR_C2 that USER_TAG is wearing, dissolving them away before absorbing the remains!`,
                    // If they're wearing makeup, tattoos or other "items that require removers,"" have the tentacles note such
                    {
                        only: (t) => {
                            return (t.nomtags.includes("makeup"))
                        },
                        text: `The VAR_C1's tentacles ravish over USER_TAG's body to remove the VAR_C2, using a gentle substance to remove some items on USER_THEM!`
                    },
                    {
                        only: (t) => {
                            return (t.nomtags.includes("tattoo"))
                        },
                        text: `The VAR_C1's tentacles ravish over USER_TAG's body to remove the VAR_C2, using magical removers to remove some permanent items on USER_THEM!`
                    },
                ],
                single: [
                    `The VAR_C1's tentacles gently swipe over the sole VAR_C2 on USER_TAG's body, removing it swiftly despite USER_THEIR struggles!`,
                    `Already nearly naked, the VAR_C1's tentacles remove the VAR_C2 on USER_TAG's body, devouring it hungrily!`
                ]
            },
            equip: {
                wearable: { add: [`The VAR_C1 pulls out a VAR_C2 from its internal storage and begins to dress USER_TAG in it!`, `The VAR_C1 produces a VAR_C2 from within itself and slips it onto USER_TAG!`, `The VAR_C1's tentacles fish out a VAR_C2 from its storage and begins to dress USER_TAG in it!`] },
				mitten: { replace: [`The VAR_C1 removes the mittens from USER_TAG's hands, replacing it with a pair of VAR_C2 and securing them tightly.`], add: [`The VAR_C1 grabs USER_TAG's wrists, holding them steady as it installs a pair of VAR_C2 on USER_THEM and secures them tightly.`] },
				chastity: { 
					replace: [
						`The VAR_C1 rips off the chastity belt that USER_TAG is wearing, storing it away before locking a VAR_C2 in its place.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The VAR_C1 rips off the chastity that USER_TAG is wearing, storing it away before applying a magic VAR_C2 in its place.`,
						},
					], 
					add: [
						`The VAR_C1 locks a VAR_C2 onto USER_TAG, sealing away USER_THEIR chastity.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The VAR_C1 presses a VAR_C2 onto USER_TAG, activating it and sealing away USER_THEIR chastity.`,
						},
					] 
				},
				chastitybra: { replace: [`The VAR_C1 picks the locking mechanism on USER_TAG's chastity bra, dragging it into its storage. But USER_THEY gets no moment to enjoy the freedom as the mimic traps USER_THEIR breasts in a VAR_C2.`], add: [`The VAR_C1 wraps a VAR_C2 around USER_TAG's chest, locking away USER_THEIR breasts.`] },
				collar: { replace: [`The VAR_C1 forces USER_TAG to lean forward as it removes USER_THEIR collar, consuming it as it instead secures a VAR_C2 around USER_THEIR throat.`], add: [`USER_TAG is forced to lean forward as the VAR_C1 moves USER_THEIR hair out of the way and wraps a VAR_C2 around USER_THEIR throat.`] },
				mask: { add: [`The VAR_C1 produces a VAR_C2 from within itself and secures it onto USER_TAG's head.`] },
				gag: { add: [`The VAR_C1 pulls a VAR_C2 from its storage and secures it into USER_TAG's mouth.`] },
				toy: { add: [`The VAR_C1 pulls a VAR_C2 from its storage and applies it to USER_TAG.`] },
				heavy: { add: [`The VAR_C1 pulls a VAR_C2 from its storage and securely binds USER_TAG with it.`] },
				unknown: { add: [`The VAR_C1 tries to dress USER_TAG in a VAR_C2... but it seems to be missing from its storage. Perhaps it ran out of space?`] },
            },
            endstage: [
                `Finished with the outfit, the VAR_C1 tosses USER_TAG around a bit more inside, having it's last bit of fun before its ready to spit USER_THEM out!`,
                `The VAR_C1 lets out another satisfied hum - USER_TAG's outfit looks so amazing now! It tosses USER_THEM around a bit more inside for now.`
            ]
        },
        stage3: [
            `The VAR_C1 finally spits USER_TAG out - the tentacles giving USER_THEM one final fleeting tease as it returns to a dormant state. USER_THEIR_CAP breath shudders as USER_THEY findUSER_S USER_THEMSELF haunted by the feelings...`
        ]
    },
    "wardrobe_device": {
        // Setup stage, auto advance to stage 1. Further setup stages can be defined by going into negative numbers.
        stage0: [
            `The VAR_C1 engages the door locks and a pair of mechanical arms grab USER_TAG's ankles and pull them into a neutral standing position to keep USER_THEM firmly in place. The outfit display on the screen reads: **VAR_C4**. The mechanical arms whir as they set to work preparing the outfit!`
        ],
        // Remove all clothing stage. Advance to stage 2 if everything is consumed! 
        stage1: {
            nom: {
                multiple: [
                    `The VAR_C1's mechanical arms remove the VAR_C2 from USER_TAG, hiding the remains of the items within a crevice in the floor.`,
                    `The VAR_C1's uncaring mechanical arms remove the VAR_C2 that USER_TAG was wearing. The items are promptly discarded.`,
                    `A mechanical arm swipes across the VAR_C2 on USER_TAG, deftly removing them from USER_THEM! The items are tossed into a chute labelled "Incinerator."`,
                    // If they're wearing makeup, tattoos or other "items that require removers,"" have the tentacles note such
                    {
                        only: (t) => {
                            return (t.nomtags.includes("makeup"))
                        },
                        text: `The VAR_C1's mechanical arms gently remove the VAR_C2 from USER_TAG. The selected outfit does not allow for these things.`
                    },
                    {
                        only: (t) => {
                            return (t.nomtags.includes("tattoo"))
                        },
                        text: `The VAR_C1 uses a process to carefully remove the VAR_C2 from USER_TAG, with advanced nanites carefully dissolving the items without harming USER_THEM.`
                    },
                ],
                single: [
                    `The VAR_C1 uses a single mechanical arm to carefully remove the VAR_C2 remaining on USER_TAG's body. It disposes of the remains of the item immediately. `,
                    `Nearly eligible, the VAR_C1 removes the sole VAR_C2 on USER_TAG, placing it to the side, despite USER_THEIR squirming.`
                ]
            },
            endstage: [
                `The interior screen on the VAR_C1 beeps as it detects no further items to remove from USER_TAG and proceeds to arrange the outfit pieces to place on USER_THEM.`,
                `A dull scanning light flashes over USER_TAG's body as the VAR_C1 detects no further foreign items to remove. Additional arms summon the various outfit pieces to place on USER_THEM.`,
            ]
        },
        // Dress the user up now, while removing offending clothing if necessary!
        stage2: {
            nom: {
                multiple: [
                    `The VAR_C1's mechanical arms remove the VAR_C2 from USER_TAG, hiding the remains of the items within a crevice in the floor.`,
                    `The VAR_C1's uncaring mechanical arms remove the VAR_C2 that USER_TAG was wearing. The items are promptly discarded.`,
                    `A mechanical arm swipes across the VAR_C2 on USER_TAG, deftly removing them from USER_THEM! The items are tossed into a chute labelled "Incinerator."`,
                    // If they're wearing makeup, tattoos or other "items that require removers,"" have the tentacles note such
                    {
                        only: (t) => {
                            return (t.nomtags.includes("makeup"))
                        },
                        text: `The VAR_C1's mechanical arms gently remove the VAR_C2 from USER_TAG. The selected outfit does not allow for these things.`
                    },
                    {
                        only: (t) => {
                            return (t.nomtags.includes("tattoo"))
                        },
                        text: `The VAR_C1 uses a process to carefully remove the VAR_C2 from USER_TAG, with advanced nanites carefully dissolving the items without harming USER_THEM.`
                    },
                ],
                single: [
                    `The VAR_C1 uses a single mechanical arm to carefully remove the VAR_C2 remaining on USER_TAG's body. It disposes of the remains of the item immediately. `,
                    `Nearly eligible, the VAR_C1 removes the sole VAR_C2 on USER_TAG, placing it to the side, despite USER_THEIR squirming.`
                ]
            },
            equip: {
                wearable: { 
                    add: [
                        `A mechanical arm pulls out a VAR_C2 and places it on USER_TAG with surgical precision.`, 
                        `The VAR_C1 spins the platform to manipulate USER_TAG's body in the right way to place the VAR_C2 on USER_THEM.`, 
                        `USER_TAG is squirming, but that does not even slow down the mechanical arms from placing a VAR_C2 on the bound frame.`
                    ] 
                },
				mitten: { 
                    replace: [
                        `The VAR_C1 uses a pair of mechanical arms to grab USER_TAG's wrists and with a laser cutter, carves off the existing mittens before installing a new pair of VAR_C2 on USER_THEM.`
                    ], 
                    add: [
                        `The VAR_C1 pulls USER_TAG's wrists forward and puts a pair of VAR_C2 on USER_THEM, securing them with a tiny little padlock on each.`
                    ] 
                },
				chastity: { 
					replace: [
						`A mechanical arm equipped with a high powered cast-saw cuts the waistband of USER_TAG's chastity belt before replacing it with a VAR_C2. The remains are pulled away with magnets and tossed into the incinerator.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The VAR_C1's platform shifts slightly to allow a mechanical arm to pull the waistband of a VAR_C2 around USER_TAG and click it shut. It is then secured with a lock and the keys placed into a lockbox for later retrieval.`,
						},
					], 
					add: [
						`The VAR_C1 locks a VAR_C2 onto USER_TAG, sealing away USER_THEIR chastity.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The VAR_C1 presses a VAR_C2 onto USER_TAG, activating it and sealing away USER_THEIR chastity.`,
						},
					] 
				},
				chastitybra: { 
                    replace: [
                        `The mechanical arms attack at the armor affixed to USER_TAG's chest. It puts up a good fight, but even it yields as it is pried apart and off of USER_THEIR breasts. The freedom does not last as a VAR_C2 replaces the former chastity bra.`
                    ], 
                    add: [
                        `The VAR_C1's mechanical arms wrap a brand new VAR_C2 around USER_TAG's chest, clicking it shut with a lock before placing the key into a lockbox. USER_THEIR_CAP chest is quite protected now!`
                    ] 
                },
				collar: { 
                    replace: [
                        `The VAR_C1's mechanical arms produce a lockpicking set and quickly work at picking the collar lock around USER_TAG's throat before throwing it off to the side and placing a VAR_C2 in its place.`
                    ], 
                    add: [
                        `USER_TAG is tilted forward as a mechanical arm pulls USER_THEIR hair up and another wraps a VAR_C2 around USER_THEIR throat with swift efficacy.`
                    ] 
                },
				mask: { add: [`A mechanical arm produces a VAR_C2 and quickly wraps it around USER_TAG's head, uncaring as to USER_THEIR facial movements or anything of the sort.`] },
				gag: { add: [`The VAR_C1 produces a VAR_C2 and holds it in front of USER_TAG, giving USER_THEM just a brief moment to voluntarily open USER_THEIR mouth before shoving it on USER_THEM, regardless if USER_THEY did or not.`] },
				toy: { add: [`The VAR_C1 uses a mechanical arm to place a VAR_C2 on USER_TAG.`] },
				heavy: { add: [`The VAR_C1's mechanical arms place USER_TAG into a strict VAR_C2, immobilizing USER_THEIR body!`] },
				unknown: { add: [`The VAR_C1 tries to dress USER_TAG in a VAR_C2. Red lights show a massive "Error" on the screen as it does not know what item this is.`] },
            },
            endstage: [
                `The outfit name, **VAR_C4**, now reads in green text as the mechanical arms conceal themselves into the walls of the VAR_C1 that USER_TAG is in.`,
            ]
        },
        stage3: [
            `The VAR_C1 finally releases it's hold on USER_TAG's ankles before gently pushing USER_THEM out of the box, ready to show the world USER_THEIR new outfit!`
        ]
    },
}