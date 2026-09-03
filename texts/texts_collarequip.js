exports.texts_collarequip = {
	heavy: [`USER_TAG tugs against USER_THEIR VAR_C1, trying to get USER_THEIR hands on TARGET_TAG's collar, but USER_THEY can't reach it!`],
	noheavy: {
		tryingself: [`You can't do anything with your own collar!\n-# Don't be cheeky.`],
		collar: {
			key: {
				mitten: {
					namedmitten: { alreadyworn: [`TARGET_TAG's hands are already occupied by a pair of VAR_C3!`], allowed: [`USER_TAG grabs TARGET_TAG's hands, shoving a set of VAR_C3 on them! TARGET_THEY_CAP won't be able to use TARGET_THEIR hands!`], notallowed: [`TARGET_TAG's collar does not allow you to mitten TARGET_THEM!`] },
					nonamedmitten: { alreadyworn: [`TARGET_TAG is already wearing mittens!`], allowed: [`USER_TAG grabs TARGET_TAG's hands, shoving a pair of mittens on, and putting a lock on the straps, sealing away TARGET_THEIR hands!`], notallowed: [`TARGET_TAG's collar does not allow you to mitten TARGET_THEM!`] },
				},
				heavybondage: {
					alreadyworn: [
						`TARGET_TAG is already in bondage, wearing a VAR_C3!`,
						{
							only: (t) => {
								return t.c3.endsWith("'s Lap");
							},
							text: `TARGET_TAG is already trapped in VAR_C3, and it would be rude to interrupt.`,
						},
					],
					allowed: [
						`USER_TAG pulls a VAR_C3 out and grabs TARGET_TAG, forcing TARGET_THEIR arms and hands into the tight restraint! TARGET_THEY_CAP squirmTARGET_S in protest, but TARGET_THEY can't do anything about it!`,
						// Doll
						{
							only: (t) => {
								return t.c3 == "Doll Processing Facility";
							},
							text: `Snickering to USER_THEMSELF, USER_TAG throws TARGET_TAG into a VAR_C3 to become a Doll!`,
						},
						// General Types
						{
							only: (t) => {
								return t.c3.includes("Petsuit") || t.c3.includes("Piddlefours");
							},
							text: `USER_TAG pushes TARGET_TAG to TARGET_THEIR knees before kneeling down USER_THEMSELF and slipping TARGET_THEIR limbs into a VAR_C3, forcing TARGET_THEM to crawl around like a pet!`,
						},
						// Stationary
						{
							only: (t) => {
								return t.c3.includes("Display Stand");
							},
							text: `USER_TAG lifts TARGET_TAG into the VAR_C3, securing TARGET_THEIR legs before guiding TARGET_THEIR arms into the rigid cuffs, locking them in place! TARGET_THEIR_CAP body is held in a strict, ramrod position!`,
						},
						{
							only: (t) => {
								return t.c3.includes("One Bar Prison");
							},
							text: `USER_TAG guides TARGET_TAG onto the VAR_C3, forcing TARGET_THEM to spread TARGET_THEIR legs to stand in the footrests before holding TARGET_THEM in place as the pole rises between TARGET_THEIR's legs, trapping TARGET_THEM in place!`,
						},
						{
							only: (t) => {
								return t.c3.includes("X-Frame");
							},
							text: `USER_TAG presses TARGET_TAG up against the VAR_C3, reaching up and locking TARGET_THEIR arms into the upper cuffs. Then after trapping TARGET_THEM, USER_THEY bendUSER_S down to lock TARGET_THEIR legs to the frame, leaving TARGET_THEM completely exposed!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Wooden Horse");
							},
							text: `USER_TAG helps TARGET_TAG climb onto the VAR_C3, securing TARGET_THEIR legs into the cuffs and then reaching over and securing TARGET_THEIR wrists into the front cuffs! Stepping back to enjoy the sight of TARGET_TAG squirming as TARGET_THEIR_CAP weight presses the top edge of the frame into TARGET_THEIR crotch!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Living Latex");
							},
							text: `USER_TAG bumps TARGET_TAG into a latex puddle, watching as it spreads over TARGET_THEIR feet and begins to climb up TARGET_THEIR legs. Before long everything below TARGET_THEIR neck is covered in a layer of latex!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Latex Encasement");
							},
							text: `USER_TAG guides TARGET_TAG into a latex puddle, watching as it spreads over TARGET_THEIR feet and begins to climb up TARGET_THEIR legs. Before long everything below TARGET_THEIR neck is covered in a layer of latex!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Dancer's Pole");
							},
							text: `USER_TAG helps TARGET_TAG climb onto the stage and cuffs TARGET_THEMSELF to the VAR_C3, swatting TARGET_THEM on the ass before climbing down and settling into a comfortable seat to watch TARGET_TAG dancing sensually for USER_THEIR enjoyment~!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Pet Cage");
							},
							text: `USER_TAG opens the door and gestures for TARGET_TAG to crawl into the VAR_C3, swinging the door closed behind TARGET_THEM and locking it in place with a soft but final click!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Leashing Post");
							},
							text: `USER_TAG leads TARGET_TAG over to the VAR_C3, forcing TARGET_THEM to kneel down before leashing TARGET_THEM securely to the VAR_C3!`,
						},
						// Latex
						{
							only: (t) => {
								return t.c3.includes("Latex Vacbed");
							},
							text: `USER_TAG lifts the upper sheet of the VAR_C3, waiting while TARGET_TAG slides into the VAR_C3, before dropping it back in place and allowing the sheets to seal together around TARGET_THEM. With a humming sound the air is pumped out, sealing TARGET_TAG helplessly in place!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Latex Vaccube");
							},
							text: `USER_TAG helps TARGET_TAG slip into the VAR_C3, leaving only TARGET_THEIR head poking out as TARGET_THEY kneelTARGET_S within the cube. With a humming sound the air is pumped out and the latex seals around TARGET_THEM, trapping TARGET_THEM helplessly inside!`,
						},
						// Furniture
						{
							only: (t) => {
								return t.c3.includes("Bed Restraints");
							},
							text: `Guiding TARGET_TAG to stretch out on the bed, USER_TAG leans over to lock TARGET_THEIR ankles into the VAR_C3 before straddling TARGET_THEM and reaching up to lock TARGET_THEIR arms into the remaining pair of cuffs, leaving TARGET_THEM helplessly spread out beneath USER_THEM~!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Chair with Cuffs");
							},
							text: `Sitting TARGET_TAG down in the VAR_C3, USER_TAG kneels and slips TARGET_THEIR ankles into the ankle cuffs, before standing up and walking around to slip TARGET_THEIR arms into cuffs behind TARGET_THEM and snapping them shut!`,
						},
						// Encasement or Wrappings
						{
							only: (t) => {
								return t.c3.includes("Autotape");
							},
							text: `USER_TAG releases a swarm of small drones that zip around TARGET_TAG, dispensing Autotape and binding TARGET_THEM into an VAR_C3!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Bandage")
							},
							text: `USER_TAG pulls out a roll of VAR_C3 and begins to wind them around TARGET_TAG! Soon enough TARGET_THEY TARGET_ISARE completely mummified by the VAR_C3!`,
						},
                        {
							only: (t) => {
								return t.c3.includes("Tape Mumm")
							},
							text: `USER_TAG pulls out a roll of tape and begins to wrap it around TARGET_TAG! Soon enough TARGET_THEY TARGET_ISARE completely mummified by tape!`,
						},
						// Comfy
						{
							only: (t) => {
								return t.c3.includes("Weighted Blanket");
							},
							text: `USER_TAG tosses a VAR_C3 over TARGET_TAG! It is so comfy that TARGET_THEY can't bring TARGET_THEMSELF to wriggle out from under the extremely heavy blanket!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Blanket Burrito");
							},
							text: `USER_TAG wraps TARGET_TAG up into a VAR_C3! It doesn't take TARGET_TAG long before TARGET_THEY realiseUSER_S USER_TAG has trapped TARGET_THEM in a warm comfy prison!`,
						},
						{
							only: (t) => {
								return t.c3.includes("Toasty Kotatsu");
							},
							text: `As USER_TAG helps TARGET_TAG slide into the warmth of the VAR_C3, TARGET_TAG realises TARGET_THEY can't bring TARGET_THEMSELF to leave the VAR_C3!`,
						},
						// Misc
						{
							only: (t) => {
								return t.c3.includes("Festive Ribbons") || t.c3.includes("Wrapping Paper");
							},
							text: `USER_TAG carefully wraps TARGET_TAG in VAR_C3! Who USER_ISARE USER_THEY planning to gift such a present to~?`,
						},
						{
							only: (t) => {
								return t.c3.includes("Magic Mirror");
							},
							text: `USER_TAG pushes TARGET_TAG backwards into a VAR_C3! As TARGET_THEY touchUSER_ES it the Mirror emits a bright flash of light, and TARGET_TAG finds TARGET_THEMSELF trapped within the reflection!`,
						},
						{
							only: (t) => {
								return t.c3.endsWith("'s Lap");
							},
							text: `USER_TAG pulls TARGET_TAG into USER_THEIR lap, holding TARGET_THEM gently but firmly.`,
						},
						{
							only: (t) => {
								return t.c3.includes("Mimic");
							},
							text: `With a cheeky grin, USER_TAG tosses TARGET_TAG towards a resting VAR_C3! It snaps open and drags TARGET_THEM inside with its tentacles before slamming shut and sealing with a resounding click!`,
						},
                        {
                            only: (t) => {
                                return t.c3.includes("Hands-off Blouse");
                            },
                            text: `USER_TAG helps TARGET_TAG into a VAR_C3, pulling the arm sleeves and integrated mittens over TARGET_THEIR arms and hands! Once buttoned up, USER_THEY grabUSER_S the straps on TARGET_THEIR mittens and pulls them behind TARGET_THEM into a reverse prayer, threading the mitten straps through TARGET_THEIR neck cuff on the blouse, and then tying them into a neat bow.`,
                        },
                        {
                            only: (t) => {
                                return t.c3.includes("Sphere");
                            },
                            text: `USER_TAG throws a VAR_C3 at TARGET_TAG! It clunks off of TARGET_THEIR body before activating and pulling TARGET_THEM inside!`,
                        },
					],
					notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in heavy bondage!`],
				},
				chastity: {
					chastitybelt: {
						namedchastity: {
							alreadyworn: [`TARGET_TAG is already in a chastity belt, with keys held by VAR_C4!`],
							allowed: { key_self: [`USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR waist and clicking the lock shut before TARGET_THEY can even react!`], key_other: [`USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR waist before clicking the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`] },
						},
						nonamedchastity: {
							alreadyworn: [`TARGET_TAG is already in a chastity belt, with keys held by VAR_C4!`],
							allowed: { key_self: [`USER_TAG grabs TARGET_TAG and wraps a chastity belt around TARGET_THEIR waist and clicking the lock shut before TARGET_THEY can even react!`], key_other: [`USER_TAG grabs TARGET_TAG and wraps a chastity belt around TARGET_THEIR waist before clicking the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`] },
							notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`],
						},
						notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`],
					},
					chastitybra: {
						namedchastity: { alreadyworn: [`TARGET_TAG is already in a chastity bra, with keys held by VAR_C4!`], allowed: { key_self: [`USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR chest and clicks the lock shut before TARGET_THEY can even react!`], key_other: [`USER_TAG grabs TARGET_TAG and wraps a VAR_C3 around TARGET_THEIR chest and clicks the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`] } },
						nonamedchastity: {
							alreadyworn: [`TARGET_TAG is already in a chastity bra, with keys held by VAR_C4!`],
							allowed: { key_self: [`USER_TAG grabs TARGET_TAG and wraps a chastity bra around TARGET_THEIR chest and clicks the lock shut before TARGET_THEY can even react!`], key_other: [`USER_TAG grabs TARGET_TAG and wraps a chastity bra around TARGET_THEIR chest and clicks the lock shut and tossing the key over to VAR_C5! TARGET_THEY_CAP will no doubt have to earn TARGET_THEIR chastity back!`] },
							notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`],
						},
						notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`],
					},
					notallowed: [`TARGET_TAG's collar does not allow you to put TARGET_THEM in chastity!`],
				},
			},
			nokey: [`You don't have the key to TARGET_TAG's collar!`],
		},
		nocollar: [`TARGET_TAG is not wearing a collar!`],
	},
};