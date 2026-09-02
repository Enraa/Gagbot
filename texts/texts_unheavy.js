exports.texts_unheavy = {
	heavy: {
		self: [
			`USER_TAG wiggles in USER_THEIR VAR_C1, but obviously USER_THEY USER_ISARE *very* helpless and can't get far with taking it off on USER_THEIR own!`,
			{
				only: (t) => {
					return t.c1.endsWith("'s Lap");
				},
				text: `USER_TAG wiggles a bit in VAR_C1, but it's so warm and comfy there...`,
			},
			{
			    only: (t) => {
			        return t.c1.includes("Sticky Glue");
			    },
			    text: `USER_TAG wriggles in the VAR_C1 trap, but it's very hard to escape these without outside help...`,
			},             
            {
                only: (t) => {
                    return t.c2.includes("Stable");
                },
                text: `USER_TAG tries to escape USER_THEIR VAR_C1! Unfortunately USER_THEIR bindings stop USER_THEM from working the latch~!`,
            },
            {
                only: (t) => {
                    return t.c2.includes("Sphere");
                },
                text: `USER_TAG tries to escape the VAR_C1 USER_THEY was caught in! However USER_THEIR struggles only make it wiggle slightly~!`,
            },
            {
                required: (t) => {
                    return t.c2.includes("Bed Restraints");
                },
                text: `USER_TAG tugs against the bindings holding USER_THEM on the bed! However USER_THEY soon flop back onto the plush bedding, tired out but no closer to escaping~!`,
            },
            {
                only: (t) => {
                    return t.c2.includes("Doll Case");
                },
                text: [
                    `USER_TAG squirms slightly in USER_THEIR VAR_C1! However the bindings hold firm, leaving USER_THEM fully on display~!`,
                    `USER_TAG wiggles helplessly inside USER_THEIR VAR_C1!`,
                    `USER_TAG strains against the restraints of USER_THEIR VAR_C1, only succeeding in drawing attention to the misbehaving doll~!`
                ]
            },
            {
                only: (t) => {
                    return t.c2.includes("Delivery Crate");
                },
                text: [
                    `USER_TAG presses against the roof of the VAR_C1! However USER_THEY fail in forcing it open!`,
                    `USER_TAG whimpers slightly as USER_THEY realise USER_THEY won't be able to escape until someone unpackages USER_THEM!`
                ]
            },
            {
                only: (t) => {
                    return t.c2.includes("Mimic");
                },
                text: [
                    `USER_TAG tugs against the VAR_C1! However the VAR_C1 is unwilling to release USER_THEM until USER_THEY is fully dressed~!`,
                    `USER_TAG wiggles helplessly inside the VAR_C1 as the tentacles gently dress USER_THEM in a costume!`,
                    `USER_TAG strains against the tentacles holding USER_THEM inside the VAR_C1, but this only makes the VAR_C1's tentacles tease USER_THEM more~!`
                ]
            },
            

            // PURE_CONTAINERS - May be needed once containers can be struggled when seperate bindings are on arms and no longer take priority
            //{
            //    required: (t) => {
            //        return t.c2.includes("Mermaid Tank");
            //    },
            //    text: `USER_TAG goes looking for an escape from the tank! Unfortunately all USER_THEY achieve is showing USER_THEMSELF off to the audience as USER_THEY swim around~!`,
            //},
            //{
            //    required: (t) => {
            //        return t.c2.includes("Leashing Post");
            //    },
            //    text: `No matter how hard USER_TAG tugs against it USER_THEIR leash remains securely attached to the post!`,
            //},
            
		],
		other: [`USER_TAG brushes up against TARGET_TAG to help TARGET_THEM out of TARGET_THEIR VAR_C2, but being trapped in a VAR_C1, USER_THEY can't really help TARGET_THEM out much.`],
	},
	noheavy: {
		heavyequipped: {
            self: {
                access: [
                    `USER_TAG carefully removes the VAR_C2 from USER_THEMSELF and then stretches!`,
                    {
                        only: (t) => {
                            return t.c2.endsWith("'s Lap");
                        },
                        text: `USER_TAG hops up off the warm lap USER_THEY USER_WERE laying on!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Pet Cage") || t.c2.includes("bed Cage") || t.c2.includes("Pet Carrier"));
                        },
                        text: `USER_TAG paws at the latch holding the door closed on the VAR_C2 and it miraculously falls open! USER_THEY_CAP stepUSER_S out innocently.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Sarcophagus");
                        },
                        text: `USER_TAG slides open the VAR_C2 and holds out USER_THEIR arms as USER_THEY walk clumsily towards others in the dungeon.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Asylum Room");
                        },
                        text: `USER_TAG knocks on the door to the VAR_C2. To USER_THEIR surprise, it swings open and allows USER_THEM to escape!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Leashing Post");
                        },
                        text: `USER_TAG stands up again from the VAR_C2, no longer convinced USER_THEY can't escape!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Doll Storage Unit");
                        },
                        text: `USER_TAG awakens inside the VAR_C2 and thinks really hard to interface with the on-board systems and open the front panel! USER_THEY_CAP stepUSER_S out, ready to serve the Dollmaker.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Glass Display Case");
                        },
                        text: `USER_TAG carefully pushes on the door of the VAR_C2 and it swings open, allowing USER_THEM out of the glass prison!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Mermaid Tank");
                        },
                        text: `USER_TAG swims vigorously for a moment and leaps out of the VAR_C2 with a brilliant splash of water! The floor will now need a Slippery sign!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Manniquin Display");
                        },
                        text: `USER_TAG steps off of the VAR_C2, no longer content to display USER_THEMSELF as a manniquin!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Glass Jar");
                        },
                        text: `USER_TAG pops the cork off of the top of the VAR_C2 and then just barely squeezes USER_THEMSELF through the opening!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Ballpit");
                        },
                        text: `USER_TAG "swims" around in the VAR_C2 for a moment before finally finding the edge and pulling USER_THEMSELF out of it!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Under the Desk");
                        },
                        text: `USER_TAG crawls out from VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Dancer's Pole");
                        },
                        text: `USER_TAG finishes USER_THEIR dance and gives a deep bow before gingerly hopping off the VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Duffel Bag");
                        },
                        text: `USER_TAG manages to wriggle enough in the VAR_C2 to finally open the zipper on it and escape!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Binding Circle");
                        },
                        text: `USER_TAG summons up USER_THEIR might and barely manages to break the lines of the VAR_C2. The magical field dissipates instantly.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Arcane Bindings");
                        },
                        text: `USER_TAG casts a minor dispelling charm over USER_THEIR legs to shatter the VAR_C2.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Cuddle Puddle");
                        },
                        text: `USER_TAG slowly rises out of the VAR_C2 and away from all the warm cuddles it had!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Cat in Lap");
                        },
                        text: `USER_TAG gently taps on the cat sitting in USER_THEIR lap. The cat looks up at USER_THEM, offended, before hopping off and running away at breakneck speed!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Wind-up");
                        },
                        text: `USER_TAG reaches for the enchanted Wind-Up Key Behind USER_THEM! As USER_THEY brush against it the key stops turning and drops into USER_THEIR hand!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Stable");
                        },
                        text: `USER_TAG reaches over the stall door of the VAR_C2, releasing the latch and letting USER_THEMSELF out!`,
                    },
                ],
                noaccess: [
                    `USER_TAG pulls at USER_THEIR VAR_C2, but makes absolutely no progress escaping from it because of the locks.`,
                    `USER_TAG prods USER_THEIR VAR_C2 but unfortunately the lock on it keeps it firmly in place, and thus keeping USER_THEM thoroughly trapped.`
                ]
            },
            other: {
                access: [
                    `USER_TAG helps TARGET_TAG out of TARGET_THEIR VAR_C2! TARGET_THEY_CAP stretchTARGET_ES TARGET_THEIR arms and sighTARGET_S with gratitude!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Doll Processing");
                        },
                        text: `USER_TAG fights off an automated arm as USER_THEY rescueUSER_S TARGET_TAG from the VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Doll Processing");
                        },
                        text: `USER_TAG tackles TARGET_TAG, pulling USER_THEM off of the belt of the VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Pet Cage") || t.c2.includes("bed Cage") || t.c2.includes("Pet Carrier"));
                        },
                        text: `USER_TAG undoes the latch on the VAR_C2 and then holds the door open, beckoning TARGET_TAG out of it.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Sarcophagus");
                        },
                        text: `USER_TAG steps on a false plate and causes a nearby VAR_C2 to fall open, revealing a mummy that looks distinctly like TARGET_TAG!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Asylum Room");
                        },
                        text: `USER_TAG opens the door to TARGET_TAG's VAR_C2 and leads the patient out!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Leashing Post");
                        },
                        text: `USER_TAG helps TARGET_TAG stand up from the VAR_C2! TARGET_THEY_CAP TARGET_ISARE no longer stuck kneeling there!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Doll Storage Unit");
                        },
                        text: `USER_TAG taps a few buttons to open the glass panel of the VAR_C2 housing a doll that looks like TARGET_TAG!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Glass Display Case");
                        },
                        text: `USER_TAG carefully opens the panel on the VAR_C2 and pulls TARGET_TAG out of it!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Mermaid Tank");
                        },
                        text: `USER_TAG pulls out a fishing rod and casts a line into the VAR_C2! Moments later, a TARGET_TAG bites the bait and USER_THEY reelUSER_S TARGET_THEM in! A legendary catch!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Mannequin Display");
                        },
                        text: `USER_TAG finishes posing the TARGET_TAG mannequin and then helps TARGET_THEM off of the VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Glass Jar");
                        },
                        text: `USER_TAG opens the cork on the VAR_C2 containing TARGET_TAG and shakes the bottle upside down in front of USER_THEM!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Ballpit");
                        },
                        text: `USER_TAG dives into the VAR_C2 and rescues TARGET_TAG from it, making it safely to the edge and out again!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Under the Desk");
                        },
                        text: `USER_TAG uses a finger to direct TARGET_TAG out from VAR_C2!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Dancer's Pole");
                        },
                        text: `USER_TAG claps as TARGET_TAG finishes TARGET_THEIR dance and then offers a hand to help TARGET_THEM step safely off the stage! What a wonderful person!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Doll Case");
                        },
                        text: `USER_TAG undoes the clasp of the VAR_C2 with USER_THEIR TARGET_TAG doll inside and sets the beautiful figure down! Maybe TARGET_THEY will become animate if USER_TAG leaves...`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Delivery Crate");
                        },
                        text: `USER_TAG signs a form saying USER_THEY received a package and immediately goes to work opening the side panel to see what's inside! Turns out, inside the VAR_C2 was a TARGET_TAG!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Duffel Bag");
                        },
                        text: `USER_TAG unzips the VAR_C2 to see a carefully folded TARGET_TAG inside! USER_THEY_CAP helpUSER_S TARGET_THEM out of it.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.endsWith("'s Lap");
                        },
                        text: `USER_TAG helps TARGET_TAG off of the warm lap TARGET_THEY TARGET_WERE laying on!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.startsWith("Engulfed");
                        },
                        text: `USER_TAG pulls TARGET_TAG out of the engulfing slime!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Sphere");
                        },
                        text: `USER_TAG throws the VAR_C2 and out comes the captured TARGET_TAG!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Binding Circle");
                        },
                        text: `USER_TAG uses a shoe to smudge part of the drawn magic circle trapping TARGET_TAG! It dissipates immediately.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Arcane Bindings");
                        },
                        text: `USER_TAG casts a minor dispelling charm to overload and shatter the runes sustaining the VAR_C2 on TARGET_TAG.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Costumer Mimic");
                        },
                        text: `It might be a *dumb* idea, but USER_TAG decides to fish TARGET_TAG out of the mimic, somehow narrowly avoiding the tentacles in the process.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Wardrobe Device");
                        },
                        text: `USER_TAG pushes the "Emergency Stop" button on the VAR_C2. It doesn't stop, but it does open a door for USER_THEM to fish TARGET_TAG out of the cruel dressing box!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Sticky Glue");
                        },
                        text: `USER_TAG produces some acetone and pours it over the VAR_C2 trapping TARGET_TAG. Slowly, TARGET_THEY TARGET_ISARE able to pull TARGET_THEIR limbs free!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Dolly");
                        },
                        text: `Finally at the destination with the handtruck, USER_TAG undoes the straps holding TARGET_TAG to the VAR_C2.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Hands-off Blouse");
                        },
                        text: `USER_TAG undoes the ribbon on the front of the VAR_C2, allowing TARGET_TAG to flex TARGET_THEIR arms before undoing the buttons on the back of the blouse.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Shadow Hands");
                        },
                        text: `USER_TAG shines a light over TARGET_TAG, quickly scattering the VAR_C2 groping TARGET_THEIR body.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Lockdown Virus");
                        },
                        text: `USER_TAG taps a button on a tablet to suspend the VAR_C2 upload to TARGET_TAG. TARGET_THEIR_CAP motor functions return swiftly!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Festive Ribbons") || t.c2.includes("Wrapping Paper"));
                        },
                        text: `The holidays are over so USER_TAG undoes the VAR_C2 wrapping over TARGET_TAG's body!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Toasty Kotatsu") || t.c2.includes("Blanket Burrito"));
                        },
                        text: `The VAR_C2 might be *so warm* but fortunately USER_TAG is able to wrestle TARGET_TAG out of it!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Magic Mirror");
                        },
                        text: `USER_TAG blinks as USER_THEY stareUSER_S at the VAR_C2. Suddenly, a striking image of TARGET_TAG appears on the floor in front of USER_THEM!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Latex Ball") || t.c2.includes("Latex Sleepsack"));
                        },
                        text: `USER_TAG unzips the edge of the VAR_C2, pulling the rubber sheets aside as USER_THEY extractUSER_S TARGET_TAG out of it!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("Solidified Rubber Coating") || t.c2.includes("Slime Coating") || t.c2.includes("Slime Coating"));
                        },
                        text: `Using a corrosive latex solvent, USER_TAG carefully pours it over key points on the VAR_C2 holding TARGET_TAG. They burn away slowly, but just enough to allow TARGET_THEM to break free!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Wrapping");
                        },
                        text: `USER_TAG finds the final fold of the VAR_C2 and unwinds the wrapping, walking around the mummified form of TARGET_TAG until it all falls off of TARGET_THEM!`,
                    },
                    {
                        only: (t) => {
                            return (t.c2.includes("tie") || t.c2.includes("Tie") || t.c2.includes("Rope"));
                        },
                        text: `USER_TAG undoes the knots of the VAR_C2 binding TARGET_TAG and guides TARGET_THEM to slowly flex the formerly bound muscles!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Strappado");
                        },
                        text: `USER_TAG lowers the winch of the VAR_C2 while catching TARGET_TAG so that TARGET_THEY TARGET_ISARE no longer falling forward.`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Cuddle Puddle");
                        },
                        text: `USER_TAG gently pulls TARGET_TAG out of the VAR_C2 and into the cold, cruel world!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Cat in Lap");
                        },
                        text: `USER_TAG tries to "pspsps!" to lure the cat away from TARGET_TAG's lap! The cat zooms off and around the corner!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Wind-up");
                        },
                        text: `USER_TAG reaches for the enchanted VAR_C2 attached to TARGET_TAG! As USER_THEY brush against it the key's enchantment fades and it drops into USER_THEIR hand!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Stable");
                        },
                        text: `USER_TAG reaches over the stall door of the VAR_C2, releasing the latch and letting TARGET_TAG escape the confines of the stall!`,
                    },
                ],
                noaccess: [
                    `USER_TAG tries to prod at the mechanisms of TARGET_TAG's VAR_C2, but unfortunately it remains completely locked.`,
                    `USER_TAG runs USER_THEIR fingers over TARGET_TAG's VAR_C2, but TARGET_THEY will just have to endure the bondage a little longer - it's locked.`,
                    {
                        // 1 in 20 chance, joke line!
                        required: (t) => { return (Math.random() < 0.05) },
                        text: `As USER_TAG baps at the lock on TARGET_TAG's VAR_C2, a small voice is heard on a phone's speaker: "This is the Lockpicking Lawyer..."`
                    }
                ]
            },
        },
		noheavyequipped: { self: [`You aren't in any kind of heavy bondage!`], other: [`TARGET_TAG is not in any kind of heavy bondage!`] },
	},
};