const { getChastity } = require("../functions/getters/chastity/getChastity");
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra");
const { getUserTags } = require("../functions/getters/config/getUserTags");
const { getGag } = require("../functions/getters/gag/getGag");
const { getHeavy } = require("../functions/getters/heavy/getHeavy");

exports.texts_struggle = {
	heavy: [
		// True Generics
		`USER_TAG tries USER_THEIR *best* to get some leverage and escape USER_THEIR bondage, but stops just short of potentially pulling a muscle.`,
		// Blacklisted Generics - Filter Out Messages that will not read smoothly with some types
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic", "Dancer", "Horse", "Sticky Glue"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `USER_TAG squirms in USER_THEIR VAR_C1, trying to squeeze out of it but USER_THEY really didn't think about how challenging that'd be.`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["One Bar Prison", "Pet Cage", "Dancer"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `Despite USER_THEIR best efforts, the VAR_C1 binding USER_TAG's arms (and maybe legs) refuses to budge!`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["One Bar Prison", "Weighted Blanket", "Toasty Kotatsu","Sticky Glue"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `The VAR_C1 creaks loudly as USER_TAG *thrashes* in USER_THEIR bondage, trying to escape!`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic","Sticky Glue", "Wardrobe Device"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `USER_TAG fights against USER_THEIR VAR_C1, trying to loosen it even a little bit to maybe escape...`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic", "Wardrobe Device"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `USER_TAG fights against USER_THEIR VAR_C1, but it doesn't budge even a micrometer...`,
		},
		// Doll
		{
			required: (t) => {
				return t.c1 == "Doll Processing Facility";
			},
			text: `USER_TAG fights against the VAR_C1 as USER_THEY USER_ISARE moved along the belt, but it refuses to acknowledge USER_THEIR struggle! After all, USER_THEY USER_ISARE just a Doll.`,
		},
		// General Types
		{
			required: (t) => {
				return t.c1.includes("Petsuit") || t.c1.includes("Piddlefours");
			},
			text: `USER_TAG squirms helplessly on the floor in USER_THEIR VAR_C1, any helpful implements kept well out of the reach of pets~!`,
		},
		// Stationary
		{
			required: (t) => {
				return t.c1.includes("Display Stand");
			},
			text: `USER_TAG squirms in the VAR_C1, but the cuffs lock USER_THEM in place, forcing USER_THEM to maintain USER_THEIR posture and keeping USER_THEM helpless and on display!`,
		},
		{
			required: (t) => {
				return t.c1.includes("One Bar Prison");
			},
			text: `USER_TAG squirms atop the VAR_C1, failing to gain the extra height needed to escape the bar cruelly trapping USER_THEM in place!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Wooden Horse");
			},
			text: `USER_TAG squirms atop the VAR_C1, every attempt to tug at USER_THEIR cuffs grinding USER_THEIR crotch into the ridge!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Dancer's Pole");
			},
			text: `USER_TAG considers stepping away from the VAR_C1 but can't bring USER_THEMSELF to disappoint USER_THEIR audience! USER_THEY will just have to keep dancing until USER_THEY have finished USER_THEIR performance!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Pet Cage");
			},
			text: `USER_TAG squirms inside the VAR_C1, knowing that there is nothing USER_THEY can do to release the lock from inside!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Leashing Post");
			},
			text: `USER_TAG tugs against USER_THEIR leash, but the VAR_C1 anchors USER_THEM in place!`,
		},
		// Latex
		{
			required: (t) => {
				return t.c1.includes("Latex");
			},
			text: `USER_TAG strains against the VAR_C1, the latex stretching and squeaking as USER_THEY doUSER_ES so! But no matter how far USER_THEY twistUSER_S or bendUSER_S the latex, it always pulls USER_THEM back into position.`,
		},
		// Furniture
		{
			required: (t) => {
				return t.c1.includes("Bed Restraints") || t.c1.includes("X-Frame");
			},
			text: `USER_TAG tugs against the cuffs holding USER_THEM stretched out, but the VAR_C1 offers no slack!`,
		},
		// Encasement or Wrappings
		{
			required: (t) => {
				return (t.c1.includes("Autotape") || t.c1.includes("Tape Mumm"));
			},
			text: `USER_TAG struggles against the VAR_C1, but the Autotape is too sticky to come loose that easily!`,
		},
		{
			required: (t) => {
				return (t.c1.includes("Bandage") || t.c1.includes("Tape Mummi"));
			},
			text: `USER_TAG squirms in the VAR_C1, but USER_THEY makeUSER_S no progress in escaping USER_THEIR mummification!!`,
		},
		// Comfy
		{
			required: (t) => {
				return t.c1.includes("Weighted Blanket");
			},
			text: `The comfortable weight of the VAR_C1 saps USER_TAG's desire to try and escape! Surely 5 more minutes wouldn't hurt?`,
		},
		{
			required: (t) => {
				return t.c1.includes("Blanket Burrito");
			},
			text: `Rolled up in the VAR_C1, USER_TAG is too warm and comfortable to want to escape!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Toasty Kotatsu");
			},
			text: `As USER_THEY relaxUSER_ES under the VAR_C1, USER_TAG realises USER_THEY can't bring USER_THEMSELF to leave the comfortable warmth!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Mimic");
			},
			text: `USER_TAG struggles against the tentacles of the VAR_C1 to no avail! It seems USER_THEY will be trapped inside until it has finished with USER_THEM!`,
		},
        {
            only: (t) => {
                return t.c3.includes("Lockdown Virus");
            },
            text: `USER_TAG attempts to assert override commands to move a muscle servo in USER_THEIR body! The Daemon's control remains absolute.`,
        },
		{
			only: (t) => {
				return t.c1.endsWith("'s Lap");
			},
			text: `USER_TAG wiggles a little bit in VAR_C1, but a stern look quickly keeps USER_THEM in check.`,
		},
        {
			only: (t) => {
				return t.c1.endsWith("Sphere");
			},
			text: `USER_TAG squirms in USER_THEIR VAR_C1, enough to cause it to shake a bit on the outside! It's such a tiny digitized space USER_THEY USER_ISARE trapped in...`,
		},
        {
            only: (t) => {
                return t.c1.includes("Cat in Lap");
            },
            text: `USER_TAG giggles and continues petting the adorable little kitty sitting in USER_THEIR lap! It purrs in delight!`,
        },
        // Misc
        {
			required: (t) => {
				return t.c1.includes("Sticky Glue");
		    },
		    text: `USER_TAG struggles and pulls against USER_THEIR VAR_C1, but the stickiness leaves USER_THEM more helpless than before!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Sticky Glue");
		    },
		    text: `USER_TAG squirms helplessly like a cute mouse in USER_THEIR VAR_C1 trap!`,
		},
        {
            only: (t) => {
                return t.c1.includes("Lockdown Virus");
            },
            text: `USER_TAG tries to move USER_THEIR body, but the VAR_C1 continues causing USER_THEIR movement processes to hang! USER_THEY_CAP should update USER_THEIR firewalls!`,
        },
	],
	gag: {
		heavy: [`Try as USER_THEY might, USER_TAG cannot spit out the VAR_C2 USER_THEY USER_ISARE wearing!`, `USER_TAG noms on USER_THEIR VAR_C2, trying to loosen it and maybe get it out of USER_THEIR mouth!`, `USER_TAG tries to push USER_THEIR VAR_C2 out with USER_THEIR tongue! It had no effect!`],
		noheavy: {
			// Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
			nofingers: [
				`USER_TAG paws at USER_THEIR VAR_C2 with USER_THEIR wrist, trying to slip it off.`,
				`USER_TAG uses the palm of USER_THEIR hand and brushes it against USER_THEIR VAR_C2.`,
				`USER_TAG sighs into USER_THEIR VAR_C2, happily thinking about how nice it is to not be able to speak!`,
				{
					required: (t) => {
						return t.c2.includes("Polite");
					},
					text: `USER_TAG sighs happily into USER_THEIR VAR_C2, thinking about the importance of politeness when speaking with others!`,
				},
				{
					required: (t) => {
						return t.c2.includes("Good");
					},
					text: `USER_TAG giggles into USER_THEIR VAR_C2, any thoughts of removing the gag fading away because USER_THEY existUSER_S to *serve*!`,
				},
				{
					required: (t) => {
						return t.c2.includes("Clock");
					},
					text: `USER_TAG fidgets with USER_THEIR VAR_C2, but it appears that the clockwork renders removal impossible at this time!`,
				},
				{
					required: (t) => {
						return t.c2.includes("Censor");
					},
					text: `USER_TAG ████ at USER_THEIR ██████████ ███, trying to ████ ██ ███ to no avail!`,
				},
			],
			// In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
			mitten: [`USER_TAG uses the wrist straps on USER_THEIR VAR_C3 to try to hook under USER_THEIR VAR_C2, but can't really get any leverage.`, `USER_TAG brushes the stuffing portion of USER_THEIR VAR_C2 with USER_THEIR VAR_C3. USER_THEY_CAP look very cute.`],
			// Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
			nomitten: [`USER_TAG uses USER_THEIR fingers to hook into the straps on USER_THEIR VAR_C2. Unfortunately, the buckles are very solid and offer no further give.`, `USER_TAG runs USER_THEIR fingers all over the stuffing portion of USER_THEIR VAR_C2. So garbled. USER_THEIR_CAP words taken away. `, `USER_TAG dances USER_THEIR fingertips on USER_THEIR VAR_C2. USER_THEY_CAP *could* take it off, but USER_THEY USER_ISARE enjoying it right now!`],
		},
	},
	mitten: {
		heavy: [
			`USER_TAG squirms in USER_THEIR VAR_C1 to get to USER_THEIR VAR_C3, but getting to USER_THEIR hands is challenging right now...`,
			`Trying to twist USER_THEIR arm in the VAR_C1 in just the right way, USER_TAG tries to get to USER_THEIR VAR_C3. Without any success, obviously.`,
			`USER_TAG tries to push USER_THEIR VAR_C3 off inside the VAR_C1, but the straps hold firm inside!`,
			`USER_TAG's attempts to get USER_THEIR VAR_C3 off are somewhat moot, considering USER_THEIR arms are still sealed away.`,
		],
		noheavy: {
			// Using only wrists or other leverage, no teeth. 50% chance with or without gag
			nomouth: [`USER_TAG tries to brush the back of USER_THEIR VAR_C3 with USER_THEIR cheek.`, `USER_TAG uses USER_THEIR chin to pinch and try to pull off the VAR_C3. The straps hold firm!`, `USER_TAG claps USER_THEIR hands together. USER_THEY_CAP likeUSER_S these VAR_C3. USER_THEY_CAP USER_DOESNT need hands!`],
			// Using only wrists, but brushing up with gag. 50% chance with gag
			gag: [`USER_TAG tries to bite the straps of USER_THEIR VAR_C3 with USER_THEIR teeth- Oh wait, USER_THEY can't. USER_THEY_CAP pout in frustration!`, `USER_TAG brushes USER_THEIR VAR_C3 against USER_THEIR VAR_C2, but sadly, USER_THEY can't bite.`, `USER_TAG meeps as USER_THEY can't find a way to make USER_THEIR VAR_C3 any looser with USER_THEIR mouth because of USER_THEIR VAR_C2`],
			// Using teeth to try to help take off the mittens! 50% chance without gag
			mouth: [`Carefully nibbling on the straps, USER_TAG tries to undo them and escape from USER_THEIR VAR_C3.`, `USER_TAG pinches the straps of USER_THEIR VAR_C3 with USER_THEIR teeth, but still can't get any leverage.`, `USER_TAG uses USER_THEIR tongue to work on the buckles holding USER_THEIR VAR_C3 in place, but can't quite undo them.`, `USER_TAG tries to bite USER_THEIR straps on USER_THEIR VAR_C3 to tear them apart! But the straps are made of high quality materials.`],
		},
	},
	chastity: {
		heavy: [
			`USER_TAG fusses with USER_THEIR VAR_C1, trying to get free so USER_THEY can work on USER_THEIR VAR_C4, but it holds firm!`,
			`USER_TAG tries to squeeze USER_THEIR thighs together to maybe shift USER_THEIR VAR_C4, but it's hard to with USER_THEIR VAR_C1.`,
			`USER_TAG bucks with USER_THEIR hips, but despite the movement, USER_THEY cannot move USER_THEIR VAR_C4 even an inch without arms!`,
			`The VAR_C1 cruelly separates USER_TAG from touching USER_THEIR VAR_C4. What *ever* will USER_THEY do?`,
		],
		noheavy: {
			// Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
			nofingers: [
				`USER_TAG runs USER_THEIR palms on USER_THEIR VAR_C4, but despite USER_THEIR best efforts, the belt remains unyielding on USER_THEIR hips.`,
				`USER_TAG gropes USER_THEMSELF with USER_THEIR hands, helplessly unable to touch...`,
				`USER_TAG squirms in USER_THEIR VAR_C4, but no matter how much USER_THEY USER_TRY, USER_THEY just can't feel anything...`,
				{
					required: (t) => {
						let blacklistTypes = ["livingwood", "seal"]
						return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true
					},
					text: `USER_TAG wiggles USER_THEIR thighs to make USER_THEIR VAR_C4 sit more comfortably. Steel is so *unforgiving.*`,
				},
				{
					required: (t) => {
						getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal")
					},
					text: `USER_TAG tries to touch the VAR_C4, but the magic in the seal repels USER_THEIR fingers!`,
				},
				{
					required: (t) => {
						return getChastity(t.serverID, t.interactionuser.id)?.timestamp + 7200000 < Date.now();
					},
					text: `USER_TAG sighs as USER_THEY USER_TRY to fumble with USER_THEIR VAR_C4. When was the last time USER_THEY had freedom or relief?`,
				},
				`USER_TAG mews in despair as USER_THEY can't get *any* feeling when touching down there! Poor USER_THEM!`,
				`USER_TAG tried so hard to touch USER_THEMSELF, and didn't get so far. But in the end, it doesn't even matter.`,
				`USER_TAG fusses with USER_THEIR belt, but USER_THEY forgot: Good USER_PRAISEOBJECTs ***never*** cum.`,
			],
			// In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
			mitten: [
				`USER_TAG tries to get USER_THEIR fingers under USER_THEIR VAR_C4, but... USER_THEIR VAR_C3 prevents USER_THEM from hooking on anything.`,
				`USER_TAG's VAR_C3 really limit how much USER_THEY can get under USER_THEIR VAR_C4. Not like USER_THEY needed relief or anything.`,
				`USER_TAG uses the smooth surface of USER_THEIR VAR_C3 to try to push on the waist band of USER_THEIR VAR_C4, but it doesn't help.`,
				`USER_TAG paws at USER_THEIR VAR_C4, but sadly USER_THEY can't really do anything to push it off. Not that USER_THEY'd want to.`,
			],
			// Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
			nomitten: [
				{
					required: (t) => {
						let blacklistTypes = ["livingwood", "seal"]
						return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true
					},
				text: `USER_TAG caresses the smooth metal of USER_THEIR VAR_C4, but the lock holds it snugly to USER_THEIR hips!`,
				},
				{
					required: (t) => {
						let blacklistTypes = ["seal"]
						return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true
					},
				text: `USER_TAG squeezes USER_THEIR thumb under the waistband of USER_THEIR VAR_C4, but can accomplish little more than shift it a bit.`,
				},
				{
					required: (t) => {
						let blacklistTypes = ["seal"]
						return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true
					},
				text: `USER_TAG tries to get a couple of fingers under USER_THEIR VAR_C4, but it's quite challenging to do so. USER_THEY_CAP should use the key!`,
				},
				`USER_TAG dances USER_THEIR fingernails on the protective shield of USER_THEIR VAR_C4. Oh how nice it would be to touch...`,
			],
		},
	},
    chastitybra: {
        heavy: [
            `USER_TAG wriggles USER_THEIR chest, but *obviously* USER_THEY USER_ISARE not going to be able to slip off USER_THEIR VAR_C6 while in a VAR_C1.`,
            `Sighing to USER_THEMSELF, USER_TAG gives up on the hopes of ever fighting the VAR_C6 USER_THEY USER_ISARE wearing.`,
            `Unfortunately, USER_TAG's breasts will have to remain bound because USER_TAG is stuck in a VAR_C1.`
        ],
        noheavy: {
            // Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
            nofingers: [
                `USER_TAG uses USER_THEIR wrists to push USER_THEIR VAR_C6 back and forth on USER_THEIR breasts. It succeeds only in making USER_THEM feel hornier in USER_THEIR chastity!`,
                `USER_TAG fidgets with USER_THEIR VAR_C6 absentmindedly, but is unable to pull USER_THEIR breasts free from the prison!`,
                `USER_TAG uses one wrist to squish against the top of USER_THEIR breast in the VAR_C6, but it's still just as inaccessible as before...`
            ],
            // In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
            mitten: [
                `Thinking only of freedom, if at all, USER_TAG bats at the locking mechanism on USER_THEIR VAR_C6, but cannot do much without fingers.`,
                `USER_TAG imagines having the key to USER_THEIR VAR_C6. Of course, having mittens might make it hard to use but USER_THEIR imagination ran wild anyway.`
            ],
            // Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
            nomitten: [
                `USER_TAG gently taps USER_THEIR VAR_C6 on USER_THEIR chest, locked on and sealing away USER_THEIR breasts... if only USER_THEY could touch....`,
                `USER_TAG runs USER_THEIR hands over the VAR_C6 on USER_THEIR chest, whining softly as USER_THEY struggles to get any sensation on USER_THEIR breasts~.`,
				{
					required: (t) => {
						return !getChastityBra(t.serverID, t.interactionuser.id)?.chastitytype.includes("livingwood");
					},
					text: `USER_TAG dances USER_THEIR fingers on the smooth exterior trapping USER_THEIR breasts. The unyielding steel denies USER_THEM any reprieve.`
				}
            ]
        }
    },
	headwear: {
		heavy: [`USER_TAG rubs USER_THEIR face against the wall, trying to scoot the things on USER_THEIR head off, but can't without arms.`, `USER_TAG tugs against USER_THEIR VAR_C1 so USER_THEY can take off USER_THEIR head gear, but the restraint holds firm!`, `USER_TAG kneels and tries to rub USER_THEIR head gear off on the floor. It looks cute, but the head gear stays on as if nothing happened.`],
		noheavy: {
			// Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
			nofingers: [
				`Using USER_THEIR wrists, USER_TAG tries to push the headwear on USER_THEIR head, but it doesn't budge.`,
				`USER_TAG tries to fumble with USER_THEIR headgear, trying to find something USER_THEY wanted all along. The headgear is somewhere it belongs.`,
				`USER_TAG contorts USER_THEIR face in strange, goofy shapes to try to squeeze USER_THEIR head out of the headgear. It didn't really help though.`,
				`USER_TAG bobs USER_THEIR head back and forth to bounce things off of it. The head gear holds firmly though.`,
			],
			// In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
			mitten: [`USER_TAG paws at USER_THEIR face cutely to knock some of the things off of USER_THEIR head. The things barely hang on!`, `USER_TAG uses the balled fists inside USER_THEIR VAR_C3 to try to peel some of the things off of USER_THEIR head. Unsuccessfully, of course.`, `USER_TAG prods at USER_THEIR head gear to try to loosen it and pull something off. The head gear is quite secure though.`],
			// Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
			nomitten: [`USER_TAG runs USER_THEIR fingers over USER_THEIR head gear. It all feels so nice on USER_THEIR head... USER_THEY_CAP should keep wearing it!`, `USER_TAG tries to use a finger to get some leverage and knock some head wear off of USER_THEIR head. It's not falling off anytime soon though.`, `USER_TAG dextrously slips USER_THEIR fingers under some of USER_THEIR head gear! USER_THEY_CAP *could* take it off, but USER_THEIR head looks pretty with it on.`],
		},
	},
	corset: {
		heavy: [`USER_TAG squirms in USER_THEIR VAR_C1, but can't really do much about the tightly hugging corset around USER_THEM!`, `USER_TAG bounces USER_THEIR hips from side to side, seeing if USER_THEY can flex USER_THEIR corset, but to no avail.`, `USER_TAG tugs against USER_THEIR VAR_C1, trying to reach the strings on USER_THEIR corset... but they're just out of reach...`],
		noheavy: {
			// Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
			nofingers: [`USER_TAG uses USER_THEIR wrists to try to scooch USER_THEIR corset a bit and make it more comfortable. It doesn't work though.`, `USER_TAG takes a deep breath- well, as deep as USER_THEY can manage. The corset's boning holds firm and does not show any signs of relief.`, `Despite USER_THEIR best efforts to wiggle USER_THEIR midsection, USER_TAG just can't get anywhere with escaping USER_THEIR corset.`],
			// In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
			mitten: [`USER_TAG paws at the clasps on USER_THEIR corset, trying to use both hands to push the corset clasps apart. The corset refuses to give USER_THEM any chance.`, `USER_TAG runs USER_THEIR VAR_C3 on the sides of USER_THEIR corset. So pretty. So feminine. So hourglassy!`, `USER_TAG fiddles with the laces on USER_THEIR corset, but obviously the VAR_C3 gives USER_THEM no fingers to grip with!`],
			// Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
			nomitten: [`USER_TAG tries to pinch and undo the laces on USER_THEIR corset, but USER_THEY struggleUSER_S to see what USER_THEY USER_ISARE doing and ends up creating an impossible knot.`, `USER_TAG pushes USER_THEIR fingers underneath the corset USER_THEY USER_ISARE wearing but it is so tightly on USER_THEM that USER_THEY can't even make it budge.`, `USER_TAG runs USER_THEIR fingers all over USER_THEIR corset. It feels so nice to wear. So formfitting.`],
		},
	},
	collar: {
		heavy: [`USER_TAG clumsily tries to use a nearby table to push USER_THEIR VAR_C5 off. It's difficult to do so without arms.`, `USER_TAG crinks USER_THEIR neck a bit to adjust USER_THEIR VAR_C5, but it doesn't really help since USER_THEIR VAR_C1 is sealing USER_THEIR arms away.`],
		noheavy: {
			// Using open hand, wrists, etc. 50% chance to use with mittens, 50% chance to use with free hands
			nofingers: [{
                required: (t) => {
                    return !getUserTags(t.serverID, t.interactionuser.id).includes("pet");
                },
                text: `USER_TAG prods at USER_THEIR collar. Such a good pet. Yes. That is USER_THEM! 💜` },
                `USER_TAG twists USER_THEIR head, trying to get some kind of grip on USER_THEIR VAR_C5 to pull it off, but... no dice.`, 
                {
                required: (t) => {
                    return !getUserTags(t.serverID, t.interactionuser.id).includes("pet");
                },
                text: `Using USER_THEIR wrists, USER_TAG tries to fidget with USER_THEIR VAR_C5. USER_THEIR_CAP elbows projected out looks adorable, almost pet-like!`}],
			// In mittens, so definitely no fingers. 50% chance to use with mittens, 0% chance with free hands
			mitten: [`USER_TAG bats the lock hanging on USER_THEIR VAR_C5, but mittens make it hard to use keys anyway. USER_THEY_CAP probably don't have them. Right?`, `USER_TAG paws at USER_THEIR VAR_C5, but the collar's straps are unyielding, just like USER_THEIR mittens.`, `USER_TAG runs the back of USER_THEIR hand over USER_THEIR VAR_C5. The collar's lock doesn't really care though.`],
			// Able to use fingers. 50% chance to use with free hands, 0% chance to use with mittens
			nomitten: [
				`USER_TAG tugs at the ring on USER_THEIR VAR_C5. It offers a fantastic leash point, but absolutely no hint that USER_THEY can remove it. Someone should leash USER_THEM!`,
				`USER_TAG squeezes USER_THEIR fingers under USER_THEIR VAR_C5, then tugging as hard as USER_THEY can. The collar too is made of high quality material and refuses to come off!`,
				`USER_TAG tries to use a finger or two to pull against USER_THEIR VAR_C5, as if USER_THEYRE sweating, but the air of the dungeon is kept quite cool. `,
			],
		},
	},
	nostruggle: [
		`USER_TAG squirms absent-mindedly with nothing in particular.`,
		`USER_TAG wiggles with nothing specifically on USER_THEMSELF.`,
		`Despite how fun USER_THEIR imagination may be, USER_TAG fidgets with nothing.`,
		`With nothing on USER_TAG's mind, USER_THEY rollUSER_S USER_THEIR muscles to get more comfortable!`,
		`Fantasizing about intense bondage, USER_TAG twiddles USER_THEIR thumbs!`,
		`USER_TAG considers how USER_THEY could play a card game, before looking back up with a tiny wiggle!`,
		`USER_TAG bumps into a book. Despite this though, maybe USER_THEY shouldn't read it yet.`,
		`The dungeon echoes as USER_TAG shifts USER_THEIR weight a bit, anticipating what will happen next!`,
		`USER_TAG's breath trembles slightly at the cold breeze as USER_THEY considerUSER_S the logistics of being bound by Gagbot.`,
		`Fantasies of struggling in restraints swim through USER_TAG's mind!`,
		`USER_TAG's sighs as USER_THEY realizeUSER_S USER_THEY could REALLY go for cuddles right now...`,
		`USER_TAG's mind is quite unbound right now. USER_THEY_CAP clearly wishUSER_ES that would change!`,
		`Imagining the idea of *thrashing* in some restraints right now, USER_TAG sighs in delicious fantasy!`,
		`USER_TAG fantasizes the idea of eating pizza! Pepperonis and cheese! So tasty!`,
		`USER_TAG imagines eating a chocolate chip cookie! With milk too! Just a soft warm cookie...`,
		`USER_TAG really wants some chocolate right now. Someone should feed USER_THEM some chocolate!`,
		`USER_TAG's mind drifts off to that last video game USER_THEY USER_WERE playing. Such good progress!`,
		`USER_TAG idly fantasizes about being praised. Someone should praise USER_THEM!`,
		`USER_TAG hums to USER_THEMSELF, humming some catchy tune that others probably can't identify. Unless they're in the know.`,
		`USER_TAG is considering announcing to everyone that USER_THEY lost The Game!`,
		`USER_TAG wants a new pair of handcuffs. Where? On who? Who knows!`,
		`USER_TAG wants a new pair of handcuffs. Probably on USER_THEMSELF. Someone should bind USER_THEM!`,
		`USER_TAG rubs USER_THEIR wrists. USER_THEY_CAP wonderUSER_S what it would feel like to be wearing cuffs.`,
		`USER_TAG blushes slightly as USER_THEY glanceUSER_S around at all the restraints. Maybe someone will use them on USER_THEM!`,
		`USER_TAG nods as USER_THEY USER_ISARE reminded by USER_THEIR subconscious brain to drink some water!`,
		`USER_TAG tries to imagine how best to adjust USER_THEIR speech when gagged. Perhaps with practice, USER_THEY can figure it out!`,
		`All the keys clanging and bondage restraints strewn about makes USER_TAG swim in happy thoughts!`,
		`USER_TAG twirls USER_THEIR hair absentmindedly. Someone should tie USER_THEM up with more bondage, tehe!~`,
		{
			required: (t) => {
				return !(getGag(t.serverID, t.interactionuser.id) && Math.random() > 0.75);
			},
			text: `USER_TAG clears USER_THEIR throat and then begins to speak: The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal bodeboop. A single lap should be completed every time you hear this sound. ding Remember to run in a straight line and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark. Get ready!… Start.`,
		},
		`USER_TAG's mind is fantasizing about the cute characters in that last anime USER_THEY watched. Everyone should ask USER_THEM about it!`,
		{
			required: (t) => {
				return !(getGag(t.serverID, t.interactionuser.id) && Math.random() > 0.75);
			},
			text: `USER_TAG's voice echoes through the halls as USER_THEY monologueUSER_S: ***Tell me, for whom do you fight...***`,
		},
		{
			required: (t) => {
				return !(getGag(t.serverID, t.interactionuser.id) && Math.random() > 0.75);
			},
			text: `USER_TAG pauses for a second, then begins to speak in a sultry tone: Hello Ladies~. Look at your outfit, now back to me, now back to your outfit, now back to me. Sadly, your outfit can't be mine~. But if you jumped into a Mimic instead of using the /wear command, it could look close to mine! Look down, back up, where are you? In my RP Thread! What's in your hand, back at me. I have it, it's the keys to your Collar and Belt! Look again, the keys are now vibes! Look down again, Back up. Where are you? Strapped in Display Stand! Now Cum for me~. Anything is possible when you dress using a Mimic and not by yourself! I'm on a (wooden) horse!`,
		},
		`USER_TAG wants ice cream. Everyone should have ice cream. USER_THEY_CAP wantUSER_S to know what everyone's favorite flavor is!`,
		`USER_TAG is getting cold feet. Someone should tie USER_THEM up and tickle USER_THEIR feet so they warm up!`,
		`USER_TAG wants hot cocoa and to sit cozily by a fire on a stormy day, just pleasantly reading and enjoying the warm. Under a blankey. So nice...`,
		`USER_TAG fans USER_THEMSELF as USER_THEY lookUSER_S at the strewn restraints. Gagbot has been busy. Hopefully USER_THEY USER_ISARE the next target!`,
		`USER_TAG starts mumbling, counting sheep to USER_THEMSELF. USER_THEY_CAP might be a little sleepy...`,
		`USER_TAG starts scrolling on YourSpace, and comes across a post titled, 'rawr XD' with a girl with too much eyeshadow and a terrible webcam in the dark.`,
		`USER_TAG wants to take a selfie. In bondage, of course. Who wouldn't want to take beautiful pictures wearing a ball gag?`,
		`USER_TAG is daydreaming about hosting a photoshoot. Maybe a nice bit of Shibari with USER_THEM as the model?`,
		`USER_TAG's breathing accelerates a little as USER_THEY fantasizeUSER_S about being in chains, kneeling at the feet of someone here... Who will give USER_THEM that fantasy?`,
		`USER_TAG might have had some water recently, but it's good to remember to get more. Can never have too much, afterall.`,
		`All this talk about servitude and the moans from the dungeon's denizens makes it impossible for USER_TAG to focus...`,
		`USER_TAG wants to lay in someone's lap. Or maybe have someone lay in USER_THEIR lap. Maybe both.`,
		`USER_TAG wants to pet a cute kitty. Or a cute doggo. Maybe lots of cute kitties and doggos!`,
		{
            required: (t) => {
                return !getUserTags(t.serverID, t.interactionuser.id).includes("pet");
            },
            text: `USER_TAG wonders what it would be like to be a pet kitty. Or a pet doggo. USER_THEY_CAP blushUSER_ES a little at the thought~`
        },
		`USER_TAG prepares for battle with a sword and flourishes it. USER_THEY_CAP USER_ISARE going to hunt the legendary sHE!`,
		`USER_TAG sits and looks around patiently because USER_THEY USER_ISARE a **good USER_PRAISEOBJECT!**`,
		// 2 hours in chastity
		{
			required: (t) => {
				return !isNaN(getChastity(t.serverID, t.interactionuser.id)?.timestamp) && getChastity(t.serverID, t.interactionuser.id)?.timestamp + 7200000 < Date.now();
			},
			text: `USER_TAG absentmindedly fidgets, thinking about the last time USER_THEY could let go...`,
		},
		// 24 hours in chastity
		{
			required: (t) => {
				return !isNaN(getChastity(t.serverID, t.interactionuser.id)?.timestamp) && getChastity(t.serverID, t.interactionuser.id)?.timestamp + 86400000 < Date.now();
			},
			text: `USER_TAG barely remembers what it's like to not be in chastity...`,
		},
        `USER_TAG takes a deep breath before doing USER_THEIR ultimate technique:\n\n*Wiggle!*`,
        `USER_TAG imagines what it would be like to sit down with a nice, warm soup and sip on it on a cloudy day and watch the rain out USER_THEIR window.`,
        `USER_TAG wants to pet a bunny! They're so cute and fluffy!`,
        `USER_TAG could probably go for a cup of tea. What kind will USER_THEY choose? Black, green, *herbal?* Only USER_THEY knowUSER_S!`,
        `USER_TAG smiles as USER_THEY imagineUSER_S what it's like to be wrapped up and helpless to escape. Someone should help USER_THEM experience that!`,
        `USER_TAG smiles as USER_THEY imagineUSER_S what it's like to make someone helpless. Someone should offer themselves up to USER_THEM!`,
        `USER_TAG ponders the questions of life, the universe and everything. It is taking USER_THEM quite a long time to come up with the answer...`,
        `USER_TAG pulls out an artificial evoker and yells, "Persona!" before a ghostly image of USER_THEIR favorite persona materializes in front of USER_THEM!`,
        `Spinning around with a dramatic flourish, USER_TAG puts a hand to USER_THEIR face and yells "Persona!" as a ghostly image of a persona appears in front of USER_THEM!`,
        {
			required: (t) => {
				return (!getHeavy(t.serverID, t.interactionuser.id)) || (getHeavy(t.serverID, t.interactionuser.id) && !getHeavy(t.serverID, t.interactionuser.id).type.includes("rmbinder"))
			},
			text: `USER_TAG pokes an armbinder, imagining what it would be like to have USER_THEIR arms pulled so tightly behind USER_THEM with it...`,
		},
        `USER_TAG wiggles a bit as USER_THEY prepareUSER_S to go on a grand, epic adventure! USER_THEIR_CAP backpack just needs to be packed...`,
        `USER_TAG wants to sit and watch anime with someone, cuddling under a nice warm blanket! What will they watch?`,
        `USER_TAG fusses with items on USER_THEMSELF, trying to straighten them out so they sit more comfortably on USER_THEM.`,
        `USER_TAG stares at the Abyss. The Abyss blinks and says "Hello!"`,
        `USER_TAG stares at the Abyss. The Abyss stares back. Who will break their staring first? It's a contest of the century!`,
        `USER_TAG idly considers the logistics that would be involved in having a big mansion full of everyone here enjoying their kinky selves.`,
        `USER_TAG prods a toy lying around. Obviously, such toys should be put somewhere safe and warm, as USER_THEY knowUSER_S. Where will the toy be moved to?`,
        `USER_TAG pats the Abyss. The Abyss blushes before patting USER_THEM back! Who knew the Abyss had arms?`,
        `USER_TAG wonders about the implications on if a tree falls in a forest with nobody around to hear it, would it make a sound?`,
        {
            required: (t) => {
                return !getUserTags(t.serverID, t.interactionuser.id).includes("latex");
            },
            text: `USER_TAG considers what it would be like to live on a planet full of latex and bondage. There's a certain story out there about that fantasy...`
        },
        `USER_TAG hums to USER_THEMSELF as USER_THEY consider the characters in the last book USER_THEY were reading. They were so cool!`,
        `USER_TAG wants to be the very best! Like no one ever was! To catch them is USER_THEIR great quest - to train them is USER_THEIR call!`,
        {
			required: (t) => {
				return !getGag(t.serverID, t.interactionuser.id);
			},
			text: `USER_TAG produces a deck of cards and pulls one out with a dramatic flourish, holding it up while shouting, "It's time to d-d-d-d-d-duel!`,
		},
        `USER_TAG starts planning tactics in USER_THEIR head on how to take down the elusive VAR_C menace. The 2nd one has shown up in the most unexpected places!`,
        `USER_TAG quietly ponders the science behind headpatting all of the cute people in the dungeon.`,
        `USER_TAG prods a controller USER_THEY had in USER_THEIR pocket. Which kind of controller? Clearly the best one. Simply ask, where is the X button?`,
        `USER_TAG pulls out a leash and giggles as USER_THEY fidgetUSER_S with the clicky bit. Who will the leash get secured to?`,
        `USER_TAG flops on a nearby chair. The chair is comfy. The chair offers so much softness... There is only... the chair...`,
        `USER_TAG's eyes narrow as USER_THEY spotUSER_S **The Book**. USER_THEIR_CAP thoughts race as USER_THEY strategizeUSER_S the best method with which to dispatch the creature.`,
        `USER_TAG says a silent prayer to the Goddess of RAM, hoping for the prices to return to normal.`,
        `USER_TAG hums a song to USER_THEMSELF. What is the song? Well, this time, everyone should know it!`,
        `Surely it's not the silliest idea to lock USER_THEMSELF up and then mail the key so it arrives a week later. USER_TAG would never do something so silly like that!`,
        `USER_TAG ponders on the dispute between West Coast and East Coast. Surely there's a better coast here!`,
        `USER_TAG thinks about USER_THEIR bedtime routine and how USER_THEY will brush USER_THEIR teeth when USER_THEY feelUSER_S sleepy tonight!`,
        `USER_TAG wants a vanilla flavored cookie to munch on!`,
        `USER_TAG stretches as USER_THEY considerUSER_S USER_THEIR bedtime tonight and the exact technique with which USER_THEY will brush USER_THEIR teeth.`,
        `"There are so many struggle texts," USER_TAG thinks. USER_THEY_CAP can't help but wonder just how long it took to write all these...`,
        `USER_TAG jumps onto a green pipe and with enough imagination, USER_THEY sinkUSER_S down into it, never to be seen again until a man in a red hat finds USER_THEM.`,
        `USER_TAG fusses with a triangular shaped piece of cheese, separating it into three smaller triangles, and then labelling them 'Wisdom,' 'Power' and 'Courage!'`,
        `Conjuring a musical instrument of some sort, USER_TAG starts practicing a tune silently to USER_THEMSELF. Look at USER_THEM improve!`,
        `Surely there's a limit to just how many pieces of clothing, gags and heavy bondage one can put on USER_TAG. Will it ever be discovered?`,
	],
};