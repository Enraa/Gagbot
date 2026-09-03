exports.texts_eventfunctions = {
	heavy: {
		doll_processing: {
			removeclothing: {
				// It is a good doll, all the clothing removed at proper stage
				stage1: [
					`The Doll Processing Facility uses some nanomaterial to eat away at the VAR_C1 that USER_TAG is wearing!`,
					`The Doll Processing Facility's arms rip off the VAR_C1 that was on USER_TAG!`,
					`The Doll Processing Facility's arms carefully remove the VAR_C1 that was on USER_TAG!`,
					`The Doll Processing Facility's arms use scissors to cut off the VAR_C1 that USER_TAG is wearing!`,
					{
						only: (t) => {
                            return (process.wearabletypes?.find((w) => w.name == t.c1)?.tags && process.wearabletypes?.find((w) => w.name == t.c1)?.tags["makeup"])
						},
						text: `The Doll Processing Facility's arms wipe away USER_TAG's VAR_C1!`,
					},
				],
				// Added before the restraint phase after the facility deemed it was ready to put restraints on the doll!
				stage2: [
					`The Doll Processing Facility realizes that there was also a VAR_C1 on USER_TAG. It removes the item using some nanomaterial!`,
					`The Doll Processing Facility's belt stops for a second, and a set of arms rip off the VAR_C1 on USER_TAG.`,
					`The Doll Processing Facility appears to make an "oops" sound as it realizes USER_TAG is still wearing a VAR_C1. It removes the item posthaste!`,
					{
						only: (t) => {
                            return (process.wearabletypes?.find((w) => w.name == t.c1)?.tags && process.wearabletypes?.find((w) => w.name == t.c1)?.tags["makeup"])
						},
						text: `The Doll Processing Facility realizes USER_TAG is still wearing VAR_C1. It cleans it off it with haste!`,
					},
				],
				// Added while the Doll is being restrained!
				stage3: [
					`The Doll Processing Facility brings out another restraint, but drops it as it realizes USER_TAG is somehow wearing a VAR_C1. The item is promptly removed.`,
					`The Doll Processing Facility's belt reverses in direction as it sees offending clothing on USER_TAG. The VAR_C1 is removed in agitation.`,
					{
						only: (t) => {
                            return (process.wearabletypes?.find((w) => w.name == t.c1)?.tags && process.wearabletypes?.find((w) => w.name == t.c1)?.tags["makeup"])
						},
						text: `The Doll Processing Facility realizes USER_TAG has somehow gained VAR_C1. It promptly removes it with a cloth!`,
					},
				],
				// Added at the final step after all restraints
				stage4: [
					`The Doll Processing Facility's belt stalls at the very end as it notices a VAR_C1 on USER_TAG. Dolls do not have a use for these items and so it is discarded.`,
					`The Doll Processing Facility beeps loudly as it detects a foreign object, VAR_C1 on the new doll, USER_TAG. The item is incinerated immediately.`,
					{
						only: (t) => {
                            return (process.wearabletypes?.find((w) => w.name == t.c1)?.tags && process.wearabletypes?.find((w) => w.name == t.c1)?.tags["makeup"])
						},
						text: `The Doll Processing Facility sounds an alert as it detects someone has applied VAR_C1 on the new doll, USER_TAG. The doll is promptly scrubbed clean!`,
					},
				],
			},
			addclothing: {
				catsuit: [`The Doll Processing Facility puts a VAR_C1 on the USER_TAG Doll, pulling the zipper up and sealing it on USER_THEIR body.`],
				cyberdoll_harness: [`The Doll Processing Facility wraps the straps of a VAR_C1 on the USER_TAG Doll's chest, securing them tightly around it's body and providing a variety of hardpoints to grab on it.`],
				cuffs_cyberdoll: [`The Doll Processing Facility wraps cuffs around the USER_TAG Doll's wrists and ankles. Their digital display glows green as they activate and link up to the harness, providing further restraint points.`],
				doll_heels: [`The Doll Processing Facility grips the USER_TAG Doll gently to lift it up before slipping a pair of Doll Heels on its feet, forcing it to stand taller. A display light glows green on the shoes.`],
				cyberdoll_barcode: [`The Doll Processing Facility uses a flash-ink process to engrave an identifying barcode on USER_TAG Doll's body somewhere. It will be registered with the Doll Asset Management system.`],
				existing_barcode: [`The Doll Processing Facility scans an existing barcode somewhere on USER_TAG Doll's body. Welcome back VAR_C2~.`],
			},
			donestripping: [`Having finished removing all of the wrong clothing on the new Doll, the Doll Processing Facility's belt pushes USER_TAG along to the Restraints section to adorn USER_THEM in appropriate Cyber Doll Integration.`],
			applyingrestraints: {
				mitten: { replace: [`The Doll Processing Facility rips off the VAR_C1 that USER_TAG is wearing, tossing them to the side before installing a pair of Cyber Doll Mittens. The Doll will not remove gags or its visor.`], add: [`The Doll Processing Facility grabs USER_TAG's wrists, holding them to the sides as it installs a pair of Cyber Doll Mittens on USER_THEM. USER_THEY_CAP USER_ISARE so vulnerable now...`] },
				chastitybelt: { replace: [`The Doll Processing Facility uses an angle grinder to cut off the VAR_C1 sitting on USER_TAG's hips. It quickly replaces the chastity belt with a Cyber Doll Belt, keying it to the original owner.`], add: [`The Doll Processing Facility installs a Cyber Doll Belt on USER_TAG, sealing away the Doll's chastity. The digital display glows bright green. It is a Good Doll. It will be chaste.`] },
				chastitybra: { replace: [`The Doll Processing Facility destroys the locking mechanism on USER_TAG's VAR_C1. It falls to the floor with a clang, but USER_THEY getUSER_S no moment to enjoy the freedom as USER_THEIR breasts are wrapped in a Cyber Doll Bra.`], add: [`The Doll Processing Facility wraps a Cyber Doll Bra around USER_TAG's chest. The digital display on it glows as it integrates with the rest of the Doll's systems. It is a chaste Doll.`] },
				collar: { replace: [`The Doll Processing Facility undoes the collar on the Doll vaguely resembling USER_TAG. The collar is taken away as USER_THEIR neck is quickly readorned with a Cyber Doll Collar.`], add: [`The Doll Processing Facility forces USER_TAG to lean forward as it wraps a Cyber Doll Collar around USER_THEIR throat. It beeps as it integrates with the rest of the Doll's restraints. It will not escape.`] },
				headwear: { add: [`The Doll Processing Facility installs a Doll Visor on the USER_TAG Doll. It's face now has a clear colored glass sheen across it. A beep indicates the speech protocols have been activated on it.`] },
				done: [`Having reached the end of the Restraints section, VAR_C2 moves along the belt, nearly to USER_THEIR destination.`],
			},
			processingcomplete: [`As USER_TAG reaches the end of the Doll Processing Facility, USER_THEY USER_ISARE finally released. USER_THEY_CAP USER_ISARE no longer human. USER_THEY_CAP USER_ISARE just a Doll. USER_THEY_CAP serveUSER_S the Dollmaker.`],
		},
		costumer_mimic: {
			removeclothing: [
				// OMNOMNOMNOM
				`The Costumer Mimic tugs at USER_TAG's outfit hungrily, tearing away and consuming the VAR_C1 that USER_THEY USER_ISARE wearing!`,
				`The Costumer Mimic's tentacles rip off the VAR_C1 that USER_TAG is wearing, stuffing them into its gaping maw and storing it away!`,
				`The Costumer Mimic's tentacles snake out to swipe across the VAR_C1 that USER_TAG is wearing, dissolving them away before absorbing the remains!`,
				{
					only: (t) => {
						return t.c1.includes("ipstick") || t.c1.includes("yeshadow");
					},
					text: `The Mimic senses VAR_C1 on USER_TAG! Its tentacles tear away USER_THEIR clothing, using the scraps to wipe away the makeup!`,
				},
				{
					only: (t) => {
						return t.c1.includes("attoo") || t.c1.includes("arcode");
					},
					text: `The Mimic senses a VAR_C1 on USER_TAG, erasing the markings with a burst of magic before consuming USER_THEIR clothes!`,
				},
				{
					only: (t) => {
						return t.c1.includes("olish");
					},
					text: `The Costumer Mimic's tentacles secrete some liquid that washes away USER_TAG's VAR_C1 leaving bare skin and nails behind!`,
				},
			],
			donestripping: {
				remainingitems: {
					multiple: [`The Costumer Mimic lets out a satisfied hum as USER_TAG's VAR_C1 are all removed, leaving USER_THEM completely naked! The mimic begins dressing USER_THEM promptly.`],
					single: [ `The Costumer Mimic lets out a satisfied hum as USER_TAG's VAR_C1 is removed, leaving USER_THEM completely naked! The mimic begins dressing USER_THEM promptly.`]
				},
				noneremaining: [
					`As the Costumer Mimic finishes consuming USER_THEIR clothing, USER_TAG is left completely bare and the Mimic can begin to dress USER_THEM in its chosen costume!`,
					`Now that the Costumer Mimic has finished removing USER_THEIR outfit USER_TAG is stripped bare, helpless as it begins to dress USER_THEM in one of its preferred costumes.`,
					`With a satisfied hum, the Costumer Mimic finishes consuming USER_TAG's clothes and begins to dress USER_THEM in the costume it has picked out!`,
					{
						only: (t) => {
							return t.c1 == "Naked";
						},
						text: `The Costumer Mimic realises that USER_TAG is already naked, and immediately moves to dress USER_THEIR helpless form in a costume it thinks will suit USER_THEM!`,
					},
				],

			},

			applyingOutfit: {
				wearable: { add: [`The Costumer Mimic pulls out a VAR_C1 from its internal storage and begins to dress USER_TAG in it!`, `The Costumer Mimic produces a VAR_C1 from within itself and slips it onto USER_TAG!`, `The Costumer Mimic's tentacles fish out a VAR_C1 from its storage and begins to dress USER_TAG in it!`] },
				mitten: { replace: [`The Costumer Mimic removes the VAR_C1 from USER_TAG's hands, replacing it with a pair of VAR_C2 and securing them tightly.`], add: [`The Costumer Mimic grabs USER_TAG's wrists, holding them steady as it installs a pair of VAR_C1 on USER_THEM and secures them tightly.`] },
				chastitybelt: { 
					replace: [
						`The Costumer Mimic rips off the VAR_C1 that USER_TAG is wearing, storing it away before locking a VAR_C2 in its place.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The Costumer Mimic rips off the VAR_C1 that USER_TAG is wearing, storing it away before applying a VAR_C2 in its place.`,
						},
					], 
					add: [
						`The Costumer Mimic locks a VAR_C2 onto USER_TAG, sealing away USER_THEIR chastity.`,
						{
							only: (t) => {
								return t.c2.includes("seal");
							},
							text: `The Costumer Mimic presses a VAR_C2 onto USER_TAG, activating it and sealing away USER_THEIR chastity.`,
						},
					] 
				},
				chastitybra: { replace: [`The Costumer Mimic picks the locking mechanism on USER_TAG's VAR_C1, dragging it into its storage. But USER_THEY gets no moment to enjoy the freedom as the mimic traps USER_THEIR breasts in a VAR_C2.`], add: [`The Costumer Mimic wraps a VAR_C2 around USER_TAG's chest, locking away USER_THEIR breasts.`] },
				collar: { replace: [`The Costumer Mimic forces USER_TAG to lean forward as it removes USER_THEIR VAR_C1, consuming it as it instead secures a VAR_C2 around USER_THEIR throat.`], add: [`USER_TAG is forced to lean forward as the Costumer Mimic moves USER_THEIR hair out of the way and wraps a VAR_C2 around USER_THEIR throat.`] },
				headwear: { add: [`The Costumer Mimic produces a VAR_C1 from within itself and secures it onto USER_TAG's head.`] },
				gag: { add: [`The Costumer Mimic pulls a VAR_C1 from its storage and secures it into USER_TAG's mouth.`] },
				toy: { add: [`The Costumer Mimic pulls a VAR_C1 from its storage and applies it to USER_TAG.`] },
				heavyrestraint: { add: [`The Costumer Mimic pulls a VAR_C1 from its storage and securely binds USER_TAG with it.`] },
				unknown: [`The Costumer Mimic tries to dress USER_TAG in a VAR_C1... but it seems to be missing from its storage. Perhaps it ran out of space?`],
			},
			spitout: { 
				add: [
					`The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... but not before securing USER_THEM into a VAR_C1 first~.`,
					{
						only: (t) => {
							return t.c1.includes("Vines");
						},
						text: `The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... but before USER_THEY get far, the VAR_C1 from USER_THEIR costume take root~.`,
					},
					{
						only: (t) => {
							return t.c1.includes("Leashing");
						},
						text: `The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... but as USER_THEY wobbles in USER_THEIR new heels, the Mimic hitches USER_THEM to a nearby VAR_C1~.`,
					},
					{
						only: (t) => {
							return t.c1.includes("Dancer");
						},
						text: `The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... and onto a stage with a VAR_C1 so USER_THEY can dance for everyone's pleasure~.`,
					},
					{
						only: (t) => {
							return t.c1.includes("Shadow");
						},
						text: `The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... but as USER_THEY gets USER_THEIR bearings USER_THEY fails to notice the grasping VAR_C1 coming from USER_THEIR new tome until it is too late~.`,
					},
					{
						only: (t) => {
							return t.c1.includes("Mermaid");
						},
						text: `The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume... and straight into a large VAR_C1 where USER_THEY can swim around as a pretty bound mermaid~.`,
					},
				], 
				none: [`The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume.`] },
		},
        capturesphere: {
            wigglefail0: [
                `*USER_TAG breaks free...*\nOh no! USER_THEY_CAP broke free!`
            ],
            wigglefail1: [
                `*USER_TAG breaks free...*\nAww! USER_THEY_CAP appeared to be caught!`
            ],
            wigglefail2: [
                `*USER_TAG breaks free...*\nAargh! Almost had it!`,
                `*USER_TAG breaks free...*\nShoot! It was so close, too!`
            ],
            capturesuccess_other: [
                `Gotcha! USER_TAG was caught!`
            ],
            capturesuccess_self: [
                `Gotcha! USER_TAG... captured USER_THEMSELF!`
            ]
        }
	},
};