const { convertPronounsText } = require("./pronounfunctions.js");
const { getWearable } = require("./wearablefunctions.js");
const { getChastity, getArousal } = require("./vibefunctions.js");
const { getHeadwearRestrictions } = require("./headwearfunctions.js");

const texts_chastity = {
	chastitybelt: {
		heavy: {
			chastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`, `USER_TAG wiggles a bit, trying to adjust USER_THEIR VAR_C2, but USER_THEIR VAR_C1 makes it hard to reach...`],
			nochastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`, `USER_TAG shifts USER_THEIR hips, wanting to put USER_THEMSELF in chastity because USER_THEY USER_ISARE a good USER_PRAISEOBJECT, but USER_THEIR VAR_C1 said no.`, `USER_TAG bumps into a VAR_C2, wanting so desperately to put it on USER_THEIR hips, but USER_THEIR VAR_C1 gives USER_THEM no arms with which to work with.`],
		},
		noheavy: {
			chastity: { key_other: [`You are already locked in a chastity belt and TARGET_TAG has the key!`], key_self: [`You are already locked in a chastity belt and you're holding the key!`] },
			nochastity: {
				namedchastity: {
					key_other: [
						`USER_TAG slips into a VAR_C2, slipping on a tiny lock, and then hands TARGET_TAG the key!`,
						`USER_TAG wraps a VAR_C2 around USER_THEIR waist, turns the lock and then presents the key to TARGET_TAG!`,
						`USER_TAG whispers a sweet goodbye as USER_THEY lockUSER_S USER_THEMSELF into a VAR_C2, sealing it away until TARGET_TAG says otherwise!`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `USER_TAG 'calmly' slips a VAR_C2 onto USER_THEIR waist before USER_THEY can think about it. USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `USER_TAG feverishly slips a VAR_C2 onto USER_THEIR waist before USER_THEY can regret it! USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
					],
					key_self: [
						`USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`,
						`USER_TAG slips a VAR_C2 on and turns the key, locking USER_THEMSELF away... but USER_THEY still USER_HAVE the key.`,
						`USER_TAG whispers a sweet goodbye as USER_THEY wrapUSER_S a VAR_C2 around USER_THEIR waist, sealing USER_THEIR chastity away under lock and key.`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR waist before USER_THEY touch there. USER_THEY_CAP still USER_HAVE the key, but at least it's something...`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG locks USER_THEMSELF up with a VAR_C2. Though, USER_THEY USER_ISARE still holding the key.`,
						},
					],
				},
				nonamedchastity: {
					key_other: [
						`USER_TAG slips into a VAR_C2, slipping on a tiny lock, and then hands TARGET_TAG the key!`,
						`USER_TAG wraps a VAR_C2 around USER_THEIR waist, turns the lock and then presents the key to TARGET_TAG!`,
						`USER_TAG whispers a sweet goodbye as USER_THEY lockUSER_S USER_THEMSELF into a VAR_C2, sealing it away until TARGET_TAG says otherwise!`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `USER_TAG 'calmly' slips a VAR_C2 onto USER_THEIR waist before USER_THEY can think about it. USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `USER_TAG feverishly slips a VAR_C2 onto USER_THEIR waist before USER_THEY can regret it! USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
					],
					key_self: [
						`USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`,
						`USER_TAG slips a VAR_C2 on and turns the key, locking USER_THEMSELF away... but USER_THEY still USER_HAVE the key.`,
						`USER_TAG whispers a sweet goodbye as USER_THEY wrapUSER_S a VAR_C2 around USER_THEIR waist, sealing USER_THEIR chastity away under lock and key.`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR waist before USER_THEY touch there. USER_THEY_CAP still USER_HAVE the key, but at least it's something...`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG locks USER_THEMSELF up with a VAR_C2. Though, USER_THEY USER_ISARE still holding the key.`,
						},
					],
				},
			},
		},
	},
	chastitybra: {
		heavy: {
			chastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR VAR_C2, but it's futile!`, `USER_TAG wiggles a bit, trying to adjust USER_THEIR VAR_C2, but USER_THEIR VAR_C1 makes it hard to reach...`],
			nochastity: [`USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a VAR_C2, but can't!`, `USER_TAG shifts USER_THEIR shoulder, wanting to put USER_THEMSELF in chastity because USER_THEY USER_ISARE a good USER_PRAISEOBJECT, but USER_THEIR VAR_C1 said no.`, `USER_TAG bumps into a VAR_C2, wanting so desperately to put it on USER_THEIR chest, but USER_THEIR VAR_C1 gives USER_THEM no arms with which to work with.`],
		},
		noheavy: {
			chastity: { key_other: [`You are already locked in a chastity bra and TARGET_TAG has the key!`], key_self: [`You are already locked in a chastity bra and you're holding the key!`] },
			nochastity: {
				namedchastity: {
					key_other: [
						`USER_TAG slips a VAR_C2 on, also putting on a tiny lock, and then hands TARGET_TAG the key!`,
						`USER_TAG wraps a VAR_C2 around USER_THEIR chest, turns the lock and then presents the key to TARGET_TAG!`,
						`USER_TAG whispers a sweet goodbye as USER_THEY lockUSER_S USER_THEIR breasts into a VAR_C2, sealing them away until TARGET_TAG says otherwise!`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `USER_TAG 'calmly' slips a VAR_C2 onto USER_THEIR chest before USER_THEY can think about it. USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `USER_TAG feverishly slips a VAR_C2 onto USER_THEIR chest before USER_THEY can regret it! USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
					],
					key_self: [
						`USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`,
						`USER_TAG slips a VAR_C2 on and turns the key, locking USER_THEIR breasts away... but USER_THEY still USER_HAVE the key.`,
						`USER_TAG whispers a sweet goodbye as USER_THEY wrap a VAR_C2 around USER_THEIR chest, sealing USER_THEIR chastity away under lock and key.`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR chest before USER_THEY touch there. USER_THEY_CAP still USER_HAVE the key, but at least it's something...`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG locks USER_THEMSELF up with a VAR_C2. Though, USER_THEY USER_ISARE still holding the key.`,
						},
					],
				},
				nonamedchastity: {
					key_other: [
						`USER_TAG slips a VAR_C2 on, also putting on a tiny lock, and then hands TARGET_TAG the key!`,
						`USER_TAG wraps a VAR_C2 around USER_THEIR chest, turns the lock and then presents the key to TARGET_TAG!`,
						`USER_TAG whispers a sweet goodbye as USER_THEY lockUSER_S USER_THEIR breasts into a VAR_C2, sealing them away until TARGET_TAG says otherwise!`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `USER_TAG 'calmly' slips a VAR_C2 onto USER_THEIR chest before USER_THEY can think about it. USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `USER_TAG feverishly slips a VAR_C2 onto USER_THEIR chest before USER_THEY can regret it! USER_THEY_CAP hands TARGET_TAG the key to keep USER_THEM safe from touching USER_THEMSELF!`,
						},
					],
					key_self: [
						`USER_TAG puts a VAR_C2 on and clicks a tiny lock on it before stashing the key for safekeeping!`,
						`USER_TAG slips a VAR_C2 on and turns the key, locking USER_THEIR breasts away... but USER_THEY still USER_HAVE the key.`,
						`USER_TAG whispers a sweet goodbye as USER_THEY wrap a VAR_C2 around USER_THEIR chest, sealing USER_THEIR chastity away under lock and key.`,
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 10;
							},
							text: `Taking calm, deep breaths, USER_TAG wraps a VAR_C2 on USER_THEIR chest before USER_THEY touch there. USER_THEY_CAP still USER_HAVE the key, but at least it's something...`,
						},
						{
							required: (t) => {
								return getArousal(t.interactionuser.id) > 20;
							},
							text: `In a vain attempt to be a good USER_PRAISEOBJECT, USER_TAG locks USER_THEMSELF up with a VAR_C2. Though, USER_THEY USER_ISARE still holding the key.`,
						},
					],
				},
			},
		},
	},
};

const texts_collar = {
	heavy: { collar: [`USER_TAG crinks USER_THEIR neck, trying to adjust USER_THEIR collar, but USER_THEIR VAR_C1 makes it impossible to adjust!`], nocollar: [`USER_TAG shifts USER_THEIR cheek on a collar, yearning to put it on, but USER_THEIR VAR_C1 makes it incredibly difficult to put on!`] },
	noheavy: {
		self: {
			nofreeuse: { namedcollar: [`USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key.`], nonamedcollar: [`USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key.`] },
			freeuse: { namedcollar: [`USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key. A little tag hangs off the collar with "Free Use!" written on it!`], nonamedcollar: [`USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and hiding the key. A little tag hangs off the collar with "Free Use!" written on it!`] },
		},
		other: {
			nofreeuse: { namedcollar: [`USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`], nonamedcollar: [`USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG.`] },
			freeuse: { namedcollar: [`USER_TAG puts a VAR_C2 on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`], nonamedcollar: [`USER_TAG puts a collar on USER_THEIR neck, clicking a lock on the lockable buckle and then handing the key to TARGET_TAG. A little tag hangs off the collar with "Free Use!" written on it!`] },
		},
		alreadycollared: [`You already have a collar on!`],
	},
};

const texts_collarequip = {
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
						`TARGET_TAG is already in bondage, wearing a VAR_C2!`,
						{
							only: (t) => {
								return t.c2.endsWith("'s Lap");
							},
							text: `TARGET_TAG is already trapped in VAR_C2, and it would be rude to interrupt.`,
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
							text: `USER_TAG helps TARGET_TAG slip into the VAR_C3, leaving only TARGET_THEIR head poking out as TARGET_THEY kneelUSER_S within the cube. With a humming sound the air is pumped out and the latex seals around TARGET_THEM, trapping TARGET_THEM helplessly inside!`,
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
								return t.c3.includes("Bandage");
							},
							text: `USER_TAG pulls out a roll of VAR_C3 and begins to wind them around TARGET_TAG! Soon enough TARGET_THEY TARGET_ISARE completely mummified by the VAR_C3!`,
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

const texts_corset = {
	heavy: {
		self: { chastity: [`USER_TAG nudges a VAR_C4 with USER_THEIR knee, but USER_THEIR VAR_C1 prevents USER_THEM from even trying to get the VAR_C4 around USER_THEIR waist, to say nothing of USER_THEIR chastity belt in the way!`], nochastity: [`USER_TAG looks at a VAR_C4, but USER_THEY USER_ISARE is still tightly bound in a VAR_C1 and can't effectively hold the laces!`] },
		other: { chastity: [`USER_TAG brushes a VAR_C4 with USER_THEIR chin towards TARGET_TAG but USER_THEY can't put it on TARGET_THEM because bound arms and unyielding steel chastity belts make it hard to manipulate corsets!`], nochastity: [`USER_TAG bumps into a VAR_C4 with USER_THEIR hip. Sadly, because hips don't have fingers, TARGET_TAG cannot be corseted! If only USER_THEY USER_WERENT in an unyielding VAR_C1, USER_THEY might be able to bind TARGET_THEM`] },
	},
	noheavy: {
		chastity: {
			key: {
				fumble: {
					discard: {
						self: {
							corset: { keyholder: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so USER_THEY will remain just as out of breath as before!`], clone: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! The key poofs in smoke as it falls on the floor!`] },
							nocorset: { keyholder: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! Hopefully USER_THEY can find it soon!`], clone: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! A tiny crack is heard as the cloned key is damaged beyond repair!`] },
						},
						other: {
							corset: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust TARGET_THEIR VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere so TARGET_TAG will remain just as out of breath as before!`], clone: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust TARGET_THEIR VAR_C4 but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! The key vanishes to smoke, dooming TARGET_TAG to remain out of breath.`] },
							nocorset: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's belt to put a VAR_C4 on TARGET_THEM, but fumbles with the key so much that it falls on the floor somewhere! Sorry TARGET_TAG!`], clone: [`USER_TAG tries to unlock TARGET_TAG's belt to put a VAR_C4 on TARGET_THEM, but fumbles with the key so much that it falls on the floor, shattering into a hundred pieces! Sorry TARGET_TAG!`] },
						},
					},
					nodiscard: {
						self: { corset: [`USER_TAG tries to unlock USER_THEIR belt to adjust the VAR_C4 but fumbles with the key, so USER_THEYLL have to keep taking *short* breaths!`], nocorset: [`USER_TAG tries to unlock USER_THEIR belt to put on a VAR_C4 but fumbles with the key so TARGET_TAG will remain without one!`] },
						other: { corset: [`USER_TAG tries to unlock TARGET_TAG's belt to adjust the VAR_C4 but fumbles with the key so TARGET_THEY will remain just as out of breath as before!`], nocorset: [`USER_TAG tries to unlock TARGET_TAG's belt to put on a VAR_C4 but fumbles with the key so TARGET_THEY will remain without one!`] },
					},
				},
				nofumble: {
					self: {
						corset: { tighter: [`USER_TAG unlocks USER_THEIR belt, pulling the strings on the VAR_C4 even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`], looser: [`USER_TAG unlocks USER_THEIR belt, carefully loosening the strings on the VAR_C4, taking a deep breath as USER_THEY can breathe! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S USER_THEMSELF back up!`] },
						nocorset: [`USER_TAG unlocks USER_THEIR belt and then puts a VAR_C4 on USER_THEMSELF, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S USER_THEMSELF back up!`],
						newcorset: [`USER_TAG unlocks USER_THEIR belt and removes USER_THEIR VAR_C3 and replaces it with a VAR_C4, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S USER_THEMSELF back up!`]
					},
					other: {
						corset: { tighter: [`USER_TAG unlocks TARGET_TAG's belt, pulling the strings on the VAR_C4 even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`], looser: [`USER_TAG unlocks TARGET_TAG's belt, carefully loosening the strings on the VAR_C4! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEY_CAP lockUSER_S TARGET_THEM back up!`] },
						nocorset: [`USER_TAG unlocks TARGET_TAG's belt and then puts a VAR_C4 on TARGET_THEM, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S TARGET_THEM back up!`],
						newcorset: [`USER_TAG unlocks TARGET_TAG's belt and removes TARGET_THEIR VAR_C3 and replaces it with a VAR_C4, pulling the strings tightly, leaving the length of the strings at VAR_C2! USER_THEY_CAP then lockUSER_S TARGET_THEM back up!`],
					},
				},
			},
			nokey: { self: { corset: [`USER_TAG tugs at USER_THEIR VAR_C4, but since USER_THEY can't unlock USER_THEIR chastity belt, USER_THEY will have to tolerate the lightheadedness!`], nocorset: [`USER_TAG dances USER_THEIR fingers on USER_THEIR belt while eying a VAR_C4, but USER_THEY won't be able to put it on because USER_THEY can't unlock USER_THEIR chastity belt!`] }, other: [`You do not have the key for TARGET_TAG's chastity belt!`] },
		},
		nochastity: {
			self: {
				corset: { tighten: [`USER_TAG grabs the strings on USER_THEIR VAR_C4, pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2! USER_THEIR_CAP breaths become shallower.`], loosen: [`USER_TAG grabs the strings on USER_THEIR VAR_C4, carefully loosening them with a sigh of relief! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`] },
				nocorset: [`USER_TAG wraps a VAR_C4 around USER_THEIR waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
				newcorset: [`USER_TAG removes the VAR_C3 around USER_THEIR waist and replaces it with a VAR_C4, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`]
			},
			other: {
				corset: { tighten: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, bracing with USER_THEIR knee, and pulling them even tighter! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`], loosen: [`USER_TAG grabs the strings on TARGET_TAG's VAR_C4, tugging on the laces carefully to loosen them a bit! The length of the strings hanging off of the VAR_C4 is now at VAR_C2!`] },
				nocorset: [`USER_TAG wraps a VAR_C4 around TARGET_TAG's waist, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
				newcorset: [`USER_TAG removes the VAR_C3 around TARGET_TAG's waist and replaces it with a VAR_C4, pulling the strings taut, and then further, leaving the length of the strings at VAR_C2!`],
			},
		},
	},
};

const texts_dollprotocol = {
	level1: [`USER_TAG has violated Doll Protocol!  Before USER_THEY can react, USER_THEIR Doll Visor installs a ball gag between USER_THEIR defective lips!`, `USER_TAG is defective!  USER_THEIR_CAP Doll Visor installs a ball gag into USER_THEIR mouth to help correct USER_THEIR vocalization subroutines.`, `USER_TAG is a Bad Doll!  USER_THEY_CAP has been equipped with a ball gag to help reinforce correct behavior.  USER_THEY_CAP **will** follow Doll Protocol.`],
	level2: [
		`USER_TAG has violated Doll Protocol **again**, reaching punishment level 2!  Before USER_THEY can react, USER_THEIR Doll Visor installs a ball gag tightly between USER_THEIR defective lips, and a pair of Cyber Doll Mittens ensures it stays on!`,
		`USER_TAG must be **very** defective - USER_THEY USER_HAVE reached punishment level 2!  USER_THEIR_CAP Doll Visor installs a ball gag tightly into USER_THEIR mouth to help correct USER_THEIR vocalization subroutines, as well as a pair of Cyber Doll Mittens to ensure USER_THEY can't remove it!`,
		`USER_TAG is still being a Bad Doll!  USER_THEY_CAP has been equipped with a tight ball gag and Cyber Doll Mittens to help reinforce correct behavior.  USER_THEY_CAP **will** follow Doll Protocol, or else!`,
	],
	level3: [
		`USER_TAG **refuses** to obey its Doll Protocol, reaching punishment level 3!  USER_THEIR_CAP cyber cuffs form hardlight tethers, tugging USER_THEIR arms behind USER_THEIR back!  A very tight ball gag and Cyber Doll Mittens make sure USER_THEY won't forget USER_THEIR punishment.`,
		`USER_TAG is a broken doll, and has reached punishment level 3!  Useless vocalization subroutines are plugged by a very tight ball gag as hardlight tethers link USER_THEIR arms behind USER_THEIR back.  A pair of Doll Mittens ensures that gag won't come off anytime soon!`,
		`As USER_TAG reaches punishment level 3, it's obvious USER_THEY USER_ISARE a **very** Bad Doll!  As punishment, USER_THEIR Cyber Cuffs are linked behind USER_THEIR back with hardlight tethers, as a ball gag and Cyber Doll Mittens keep that defective mouth **silent!**`,
	],
};

const texts_gag = {
	heavy: {
		self: { gag: [`USER_TAG looks at a VAR_C3, attempting to spit out USER_THEIR VAR_C4 and change it, but the straps hold firm! Maybe if USER_THEY had fingers USER_THEY could change USER_THEIR gag!`], nogag: [`USER_TAG squirms a bit, but USER_THEIR arms are trapped! Someone should help USER_THEM with putting a VAR_C3 on!`] },
		other: { gag: [`USER_TAG uses USER_THEIR toes to pick up a VAR_C3 by the straps and put it on TARGET_TAG, but without arms, USER_THEY can't undo TARGET_THEIR VAR_C4 to switch it out!`], nogag: [`USER_TAG flops over a table to pick up a VAR_C3 and take it over to TARGET_TAG and put it on TARGET_THEM, but USER_THEY lackUSER_S arms and fingers to work with the straps!`] },
	},
	noheavy: {
		mitten: { other: { gag: [`USER_TAG attempts to change TARGET_TAG's gag from the VAR_C4, but fumbles at holding the VAR_C3 in USER_THEIR mittens!`], nogag: [`USER_TAG attempts to gag TARGET_TAG, but fumbles at holding the VAR_C3 in USER_THEIR mittens!`] }, self: [`USER_TAG uses both of USER_THEIR mittens to pick up a VAR_C3, but can't secure the straps behind USER_THEIR head anyway.`] },
		nomitten: {
			self: {
				gag: {
					changetightness: [
						`USER_TAG adjusts USER_THEIR VAR_C3, undoing the straps before pulling them VAR_C2 around USER_THEIR head again.`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG adjusts USER_THEIR VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over USER_THEIR mouth again.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG adjusts USER_THEIR VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around USER_THEIR head and under USER_THEIR hair again.`,
						},

						//`USER_TAG carefully undoes the straps on USER_THEIR VAR_C4, allowing just a moment to let the drool fall out before replacing it with a VAR_C3, pulling the straps on it VAR_C2 before buckling.`
					],
					newgag: [
						`USER_TAG sucks in what breath USER_THEY can, before adding a VAR_C3 over top of USER_THEIR VAR_C4, pulling the straps VAR_C2 before buckling.`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG sucks in what breath USER_THEY can around USER_THEIR VAR_C4, before pressing a strip of tape VAR_C2 over USER_THEIR mouth in a loose VAR_C3.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG sucks in what breath USER_THEY can around USER_THEIR VAR_C4, before wrapping tape VAR_C2 around USER_THEIR head and under USER_THEIR hair.`,
						},
					],
				},
				nogag: [
					`USER_TAG picks up a VAR_C3, takes a deep breath, and then pushes it between USER_THEIR teeth and pulling the straps VAR_C2 behind USER_THEIR head.`,
					{
						only: (t) => {
							return t.c2.includes("loosely") && t.c3.includes("Tape");
						},
						text: `USER_TAG picks up a roll of tape, takes a deep breath, and then presses a strip VAR_C2 over USER_THEIR mouth and smoothing it down across USER_THEIR cheeks.`,
					},
					{
						only: (t) => {
							return t.c2.includes("tightly") && t.c3.includes("Tape");
						},
						text: `USER_TAG picks up a roll of tape, takes a deep breath, and then begins to wrap it VAR_C2 around USER_THEIR head and under USER_THEIR hair in a wraparound VAR_C3.`,
					},
				],
			},
			other: {
				gag: {
					changetightness: [
						`USER_TAG adjusts TARGET_TAG's VAR_C3, undoing the straps before pulling them VAR_C2 around TARGET_THEIR head again.`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG adjusts TARGET_TAG's VAR_C3, peeling away the tape before pressing fresh strips VAR_C2 over TARGET_THEIR mouth again.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG adjusts TARGET_TAG's VAR_C3, unwinding the tape before wrapping a fresh roll VAR_C2 around TARGET_THEIR head and under TARGET_THEIR hair again.`,
						},
						//`USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
					],
					newgag: [
						`USER_TAG places a VAR_C3 against TARGET_TAG's mouth over top of TARGET_THEIR VAR_C4. The buckles are pulled VAR_C2 around TARGET_THEIR head before they are buckled again.`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG applies a VAR_C3 over TARGET_TAG's VAR_C4, pressing fresh strips of tape VAR_C2 over TARGET_THEIR mouth.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG applies a VAR_C3 over TARGET_TAG's VAR_C4, winding a roll of tape VAR_C2 around TARGET_THEIR head and under TARGET_THEIR hair.`,
						},
					],
				},
				nogag: {
					gentle: [
						`USER_TAG uses a finger to gently pry open TARGET_TAG's lips before inserting a VAR_C3 between TARGET_THEIR teeth, secured VAR_C2 behind TARGET_THEIR head. A muted meep follows soon after from TARGET_THEM!`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG places a finger gently on TARGET_TAG's lips and waits for them to stop talking before gently pressing fresh strips of tape VAR_C2 over TARGET_THEIR mouth, sealing it shut.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG taps a finger gently on TARGET_TAG's lips and waits for them to stop talking before carefully winding a roll of tape VAR_C2 around TARGET_THEIR head to form a VAR_C3.`,
						},
					],
					forceful: [
						`USER_TAG takes a VAR_C3 out and brushes the hair out of TARGET_TAG's face, before pinching TARGET_THEIR nose for a moment and shoving the gag between TARGET_THEIR teeth when TARGET_THEY goTARGET_ES to breathe! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled shut!`,
						`USER_TAG holds up a VAR_C3, pressing it against TARGET_TAG's lips with ever increasing force until they part, taking away TARGET_THEIR ability to speak coherently! The straps are pulled VAR_C2 behind TARGET_THEIR head and buckled under TARGET_THEIR hair!`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG pinches TARGET_TAG's lips shut before VAR_C2 sealing them with strips of tape.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG pinches TARGET_TAG's lips shut before VAR_C2 winding a roll of tape around TARGET_THEIR head to form a VAR_C3.`,
						},
					],
					requesting: [
						`USER_TAG taps TARGET_TAG's lips, silently suggesting to say "ahh" before pushing a VAR_C3 VAR_C2 between TARGET_THEIR lips!`,
						{
							only: (t) => {
								return t.c2.includes("loosely") && t.c3.includes("Tape");
							},
							text: `USER_TAG taps on TARGET_TAG's lips, silently suggesting they keep them closed before VAR_C2 sealing them with strips of tape.`,
						},
						{
							only: (t) => {
								return t.c2.includes("tightly") && t.c3.includes("Tape");
							},
							text: `USER_TAG taps on TARGET_TAG's lips, silently suggesting they keep them closed before VAR_C2 winding a roll of tape around TARGET_THEIR head to form a VAR_C3.`,
						},
					],
				},
			},
		},
	},
	gagreflect: {
		noheavy: {
			nomitten: {
				other: {
					gag: {
						changetightness: [
							`TARGET_TAG is cheeky and tries to gag USER_TAG, but USER_TAG gets the upper hand and adjusts the tightness on the VAR_C4 that TARGET_THEY TARGET_ISARE wearing, pulling the straps VAR_C2.`,
							//`USER_TAG runs USER_THEIR hands behind TARGET_TAG's head, unbuckling the straps on TARGET_THEIR VAR_C4 and then gently pressing a VAR_C3 between TARGET_THEIR lips again. The straps are then pulled VAR_C2 and buckled again!`
						],
						newgag: [`USER_TAG looks at TARGET_TAG flatly as it instead takes the VAR_C3 and puts it on TARGET_THEM over top of the VAR_C4.`],
					},
					nogag: {
						gentle: [`USER_TAG grabs the VAR_C3 and then uses a robotic arm to gently caress TARGET_TAG's cheek, before putting it on TARGET_THEM, pulling the straps VAR_C2 and buckling them.`],
						forceful: [`TARGET_TAG tries to gag USER_TAG, but USER_TAG's deft agility allows it to wrestle the gag out of TARGET_THEIR hands before shoving it into TARGET_THEIR mouth instead.`],
						requesting: [`TARGET_TAG presents a gag to USER_TAG. It is somewhat unamused and points at TARGET_THEM to wear it instead. TARGET_THEY_CAP feelTARGET_S compelled to obey the order.`],
					},
				},
			},
		},
	},
};

// Headwear stuff
const texts_headwear = {
	heavy: {
		self: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`],
			noworn: [`USER_TAG scoots against a VAR_C2, but USER_THEY can only move it around a couple of inches, much less lift it because of USER_THEIR VAR_C1!`],
		},
		other: {
			// Ephemeral
			worn: [`TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`],
			noworn: [`USER_TAG boops a VAR_C2 towards TARGET_TAG, but USER_THEY can't really put it on TARGET_THEM because of USER_THEIR VAR_C1. USER_THEY_CAP should grow arms!`],
		},
	},
	noheavy: {
		mitten: {
			self: { worn: [`You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`], noworn: [`USER_TAG fumbles with a VAR_C2, trying to put it on USER_THEIR head, but can't grip it well enough!`] },
			other: {
				// Ephemeral
				worn: [`TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`],
				noworn: [`USER_TAG uses both mittens and throws a VAR_C2 towards TARGET_TAG, indicating to put it on. USER_THEY_CAP can't put it on TARGET_THEM though.`],
			},
		},
		nomitten: {
			self: {
				// Ephemeral
				worn: [`You are already wearing a VAR_C2!`],
				noworn: [
                    `USER_TAG places a VAR_C2 on USER_THEIR lovely head, securing the straps on snugly!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Aphrodisiacs");
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEY_CAP feelUSER_S USER_THEIR heart race as USER_THEIR nostrils are bombarded with a sensual, sweet smell that makes it nearly impossible to think about anything besides horny thoughts...`,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask";
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEIR_CAP breathing starts to hiss through the filter as USER_THEY look through glass lenses. `,
                    },
                    {
                        only: (t) => {
                            return t.c2 == "Gasmask (Linked)";
                        },
                        text: `USER_TAG places a Gasmask over USER_THEIR face. USER_THEIR_CAP breathing starts to hiss through the tube as USER_THEY decideUSER_S who to give it to...`,
                    }
                ],
			},
			other: {
				collar: {
					maskperm: {
						// Ephemeral
						worn: [`You are already wearing a VAR_C2!`],
						noworn: [
                            `USER_TAG grabs a VAR_C2 and places it gently on TARGET_TAG's head, securing the straps so it doesn't fall off.`,
                            {
                                only: (t) => {
                                    return t.c2.includes("Aphrodisiacs");
                                },
                                text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP eyes roll backward as the aphrodisiacs assault TARGET_THEIR senses, rendering TARGET_THEM unable to think clearly!`,
                            },
                            {
                                only: (t) => {
                                    return t.c2 == "Gasmask";
                                },
                                text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP breathing starts to hiss through the filter as TARGET_THEY look through glass lenses. `,
                            },
                            {
                                only: (t) => {
                                    return t.c2 == "Gasmask (Linked)";
                                },
                                text: `USER_TAG places a Gasmask over TARGET_TAG's face. TARGET_THEIR_CAP breathing starts to hiss through the tube as USER_THEY decideUSER_S who to hand it to...`,
                            }
                        ],
					},
					nomaskperm: [
						// Ephemeral
						`TARGET_TAG's collar does not allow you to mask TARGET_THEM!`,
					],
				},
				nocollar: [
					// Ephemeral
					`TARGET_TAG is not wearing a collar!`,
				],
			},
		},
	},
};

// Thank goodness this one is tiny lol
const texts_heavy = {
	heavy: [`USER_TAG writhes in USER_THEIR VAR_C1, trying to change USER_THEIR bondage, but may need some help!`],
	noheavy: [
		`USER_TAG slips into a VAR_C2, rendering USER_THEIR arms and hands completely useless!`,
		// Doll
		{
			only: (t) => {
				return t.c2 == "Doll Processing Facility";
			},
			text: `Unable to resist the temptation, USER_TAG throws USER_THEMSELF into a VAR_C2 to become a Doll!`,
		},
		// General Types
		{
			only: (t) => {
				return t.c2.includes("Petsuit") || t.c2.includes("Piddlefours");
			},
			text: `USER_TAG slips into a VAR_C2, trapping USER_THEIR arms and legs and forcing them to crawl like a pet!`,
		},
		// Stationary
		{
			only: (t) => {
				return t.c2.includes("Display Stand");
			},
			text: `USER_TAG climbs into the VAR_C2, securing USER_THEIR legs before sliding USER_THEIR arms into the rigid cuffs, locking them in place! USER_THEIR_CAP body is held in a strict, ramrod position!`,
		},
		{
			only: (t) => {
				return t.c2.includes("One Bar Prison");
			},
			text: `USER_TAG steps onto the VAR_C2, spreading USER_THEIR legs to stand in the footrests. The pole rises between USER_THEIR legs, trapping USER_THEM in place!`,
		},
		{
			only: (t) => {
				return t.c2.includes("X-Frame");
			},
			text: `USER_TAG steps up to the VAR_C2, bending down to secure USER_THEIR legs to the frame before reaching up and locking USER_THEIR arms into the upper cuffs leaving USER_THEMSELF completely exposed!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Wooden Horse");
			},
			text: `USER_TAG climbs onto the VAR_C2, bending down to secure USER_THEIR legs into the cuffs and then laying over the frame and slipping USER_THEIR wrists into the front cuffs! USER_THEIR_CAP weight presses the top edge of the frame into USER_THEIR crotch!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Latex Encasement");
			},
			text: `USER_TAG steps into a latex puddle, feeling it spread over USER_THEIR feet and begin to climb up USER_THEIR legs. Before long everything below USER_THEIR neck is covered in a layer of latex!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Dancer's Pole");
			},
			text: `USER_TAG climbs onto the stage and cuffs USER_THEMSELF to the VAR_C2, swaying to the beat and dancing sensually around it!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Pet Cage");
			},
			text: `USER_TAG crawls into the VAR_C2, blushing as USER_THEY hear the door to the VAR_C2 swing closed behind USER_THEM and lock with a soft click!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Leashing Post");
			},
			text: `USER_TAG walks over to the VAR_C2, clipping on a leash and blushing as USER_THEY kneelUSER_S down and tieUSER_S the other end to the VAR_C2!`,
		},
		// Latex
		{
			only: (t) => {
				return t.c2.includes("Latex Vacbed");
			},
			text: `USER_TAG slides between the sheets of the VAR_C2, allowing them to seal together behind USER_THEM. With a humming sound the air is pumped out, sealing USER_THEM helplessly in place!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Latex Vaccube");
			},
			text: `USER_TAG slips into the VAR_C2 leaving only USER_THEIR head poking out as USER_THEY kneel in place. With a humming sound the air is pumped out and the latex seals around USER_THEM, trapping USER_THEM helplessly inside!`,
		},
		// Furniture
		{
			only: (t) => {
				return t.c2.includes("Bed Restraints");
			},
			text: `Sitting on the bed, USER_TAG leans forward to lock USER_THEIR ankles into the VAR_C2, before lying back and reaching up to lock USER_THEIR arms into the remaining pair of cuffs in a spreadeagle!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Chair with Cuffs");
			},
			text: `Sitting down in the VAR_C2, USER_TAG leans forward to slip USER_THEIR ankles into the ankle cuffs, before sliding USER_THEIR arms into cuffs behind USER_THEM and allowing them to snap shut!`,
		},
		// Encasement or Wrappings
		{
			only: (t) => {
				return t.c2.includes("Autotape");
			},
			text: `USER_TAG releases a swarm of small drones that zip around USER_THEM, dispensing Autotape and binding USER_THEM into an VAR_C2!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Bandage");
			},
			text: `USER_TAG pulls out a roll of VAR_C2 and enchants them to wind around USER_THEMSELF! Soon enough USER_THEY USER_ISARE completely mummified by the VAR_C3!`,
		},
		// Comfy
		{
			only: (t) => {
				return t.c2.includes("Weighted Blanket");
			},
			text: `USER_TAG slips into a VAR_C2! Unfortunately, it is so comfy that USER_THEY can't wiggle out of the extremely heavy blanket!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Blanket Burrito");
			},
			text: `Rolling USER_THEMSELF into a VAR_C2, USER_TAG realises USER_THEY might be trapped by USER_THEIR own comfort!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Toasty Kotatsu");
			},
			text: `As USER_THEY slide into the warmth of the VAR_C2, USER_TAG realises USER_THEY can't bring USER_THEMSELF to leave the VAR_C2!`,
		},
		// Misc
		{
			only: (t) => {
				return t.c2.includes("Festive Ribbons") || t.c2.includes("Wrapping Paper");
			},
			text: `USER_THEY carefully wraps USER_THEMSELF in VAR_C2! Who is the lucky person recieving such a present~?`,
		},
		{
			only: (t) => {
				return t.c2.includes("Magic Mirror");
			},
			text: `USER_TAG places a hand on the VAR_C2, then in a flash of light finds themselves trapped within the reflection!`,
		},
		{
			only: (t) => {
				return t.c2.includes("Mimic");
			},
			text: `USER_TAG disturbs a VAR_C2! It snaps open and entangles USER_THEIR arms and legs with its tentacles, dragging USER_THEM inside and slamming shut before sealing with a resounding click!`,
		},
        {
			only: (t) => {
				return t.c2.includes("Hands-off Blouse");
			},
			text: `USER_TAG puts a VAR_C2 on, slipping USER_THEIR arms into the arms and placing USER_THEIR hands into the integrated mittens. Using a magical spell, USER_THEY threadUSER_S USER_THEIR hand mitten straps through the neck cuff and ties them into a neat bow in front!`,
		},
	],
};

const texts_key = {
	clone: {
		self: {
			collar: [`USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR collar key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`],
			chastitybelt: [`USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR chastity belt key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`],
			chastitybra: [`USER_TAG waves USER_THEIR fingers a bit and a nearly-perfect replica of USER_THEIR chastity bra key appears! USER_THEY_CAP giveUSER_S it to VAR_C2.`],
		},
		other: { collar: [`USER_TAG subtly puts TARGET_TAG's collar key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`], chastitybelt: [`USER_TAG subtly puts TARGET_TAG's chastity belt key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`], chastitybra: [`USER_TAG subtly puts TARGET_TAG's chastity bra key in a key copying machine and then hands the cloned key to VAR_C2 without TARGET_THEM noticing!`] },
	},
	give: {
		self: { collar: [`USER_TAG gives USER_THEIR collar key to VAR_C2.`], chastitybelt: [`USER_TAG gives USER_THEIR chastity belt key to VAR_C2.`], chastitybra: [`USER_TAG gives USER_THEIR chastity bra key to VAR_C2.`] },
		other: { collar: [`USER_TAG subtly gives TARGET_TAG's collar key to VAR_C2 without TARGET_THEM noticing!`], chastitybelt: [`USER_TAG subtly gives TARGET_TAG's chastity belt key to VAR_C2 without TARGET_THEM noticing!`], chastitybra: [`USER_TAG subtly gives TARGET_TAG's chastity bra key to VAR_C2 without TARGET_THEM noticing!`] },
	},
	revoke: {
		isclone: { collar: ["USER_TAG magically destroys the cloned key for TARGET_TAG's collar that USER_THEY USER_WERE holding!"], chastitybelt: ["USER_TAG magically destroys the cloned key for TARGET_TAG's chastity belt that USER_THEY USER_WERE holding!"], chastitybra: ["USER_TAG magically destroys the cloned key for TARGET_TAG's chastity bra that USER_THEY USER_WERE holding!"] },
		isprimary: { collar: ["USER_TAG has magically broken the cloned key for TARGET_TAG's collar that VAR_C2 was holding!"], chastitybelt: ["USER_TAG has magically broken the cloned key for TARGET_TAG's chastity belt that VAR_C2 was holding!"], chastitybra: ["USER_TAG has magically broken the cloned key for TARGET_TAG's chastity bra that VAR_C2 was holding!"] },
	},
	swapitem: {
		self: {
			collar: [`USER_TAG carefully undoes the strap on USER_THEIR VAR_C1, letting it fall in front of USER_THEM as USER_THEY swapUSER_S it to a VAR_C2!`],
			chastitybelt: [`USER_TAG puts the key in USER_THEIR VAR_C1. The locking mechanism opens, granting USER_THEM a brief moment of freedom before USER_THEY putUSER_S a VAR_C2 in the same place!`],
			chastitybra: [`USER_TAG unlocks the little lock on the front of USER_THEIR VAR_C1. USER_THEIR_CAP chest is free for a brief moment before it is bound again with a VAR_C2!`],
		},
		other: {
			collar: [`USER_TAG carefully undoes the strap on TARGET_TAG's VAR_C1, letting it fall in front of TARGET_THEM as USER_THEY swapUSER_S it to a VAR_C2!`],
			chastitybelt: [`USER_TAG puts the key in TARGET_TAG's VAR_C1. The locking mechanism opens, granting TARGET_THEM a brief moment of freedom before USER_THEY putUSER_S a VAR_C2 on TARGET_THEM in the same place!`],
			chastitybra: [`USER_TAG unlocks the little lock on the front of TARGET_TAG's VAR_C1. TARGET_THEIR_CAP chest is free for a brief moment before it is bound once more with a VAR_C2!`],
		},
	},
    discardkey: {
        self: {
            keyholder: [
                {
                    required: (t) => {
                        return getArousal(t.interactionuser.id) < 20;
                    },
                    text: `USER_TAG looks one last time at USER_THEIR key to USER_THEIR VAR_C1 and tosses it without a second thought.`,
                },
                {
                    required: (t) => {
                        return !getHeadwearRestrictions(t.interactionuser.id).canInspect;
                    },
                    text: `USER_TAG is unable to see, so USER_THEY toss the key to USER_THEIR VAR_C1 somewhere... Who knows where?`,
                },
                {
                    required: (t) => {
                        return getArousal(t.interactionuser.id) > 10;
                    },
                    text: `USER_TAG shudders slightly as USER_THEY stareUSER_S at USER_THEIR VAR_C1 key before flinging it off into the void!`,
                },
                {
                    required: (t) => {
                        return getArousal(t.interactionuser.id) > 20;
                    },
                    text: `Desperate to stay helpless and horny, USER_TAG throws USER_THEIR VAR_C1 key off into the distance!`,
                },
            ],
            none: [
                `USER_TAG tries to throw away USER_THEIR key... but a mysterious entity stops USER_THEM!? (this is a bug, report)`
            ]
        },
        other: {
            keyholder: [
                `USER_TAG smirks at TARGET_TAG before tossing TARGET_THEIR VAR_C1 key off into the nether.`,
                {
                    required: (t) => {
                        return !getHeadwearRestrictions(t.targetuser.id).canInspect;
                    },
                    text: `USER_TAG taunts TARGET_TAG with the key for a moment, dangling it in front of TARGET_THEIR eyes before flinging it away.`,
                }
            ],
            none: [
                `USER_TAG tries to throw away TARGET_TAG's key... but a mysterious entity stops USER_THEM!? (this is a bug, report)`
            ]
        }
    }
};

// This follows an inconsistent flat structure - consider reworking in the future.
const texts_letgo = {
	orgasm: [
		`USER_TAG is overwhelmed with pleasure, clenching USER_THEIR thighs in an earth-shattering orgasm!`,
		`USER_TAG convulses, finally reaching the peak and then rolls over limply, swimming in the sensation!`,
		`USER_TAG's breath seizes up as it all bursts, leaving a crumpled frame behind!`,
		`USER_TAG twitches USER_THEIR hips and thighs, finally! USER_THEY_CAP layUSER_S down, basking in the afterglow!`,
		`Like a dam bursting, USER_TAG thrashes out as USER_THEY finally reachUSER_ES the top!`,
	],
	chastity: [
		`USER_TAG tries to get over the edge but is denied by USER_THEIR steel prison!`,
		`USER_TAG frantically *claws* at USER_THEIR chastity belt, but it offers no sensation!`,
		`USER_TAG tries to rub the cold steel of USER_THEIR chastity belt, but USER_THEY can't feel anything!`,
		`USER_TAG squirms, trying to adjust the belt so USER_THEY can feel ***something***, but USER_THEY just can't get over the edge!`,
		`USER_TAG holds USER_THEIR breath, feverishly stroking the smooth belt USER_THEY USER_ISARE wearing, but USER_THEY just can't let go!`,
		`USER_TAG grinds on a near by object, trying to get that last little bit of sensation to let go... but USER_THEY just can't make it!`,
		`USER_TAG buckles USER_THEIR legs, panting in short breaths as USER_THEY attemptUSER_S to (and failUSER_S miserably) to get release!`,
		`USER_TAG attempts to get relief, but **good USER_PRAISEOBJECTs** don't get to touch there.`,
	],
	heavy: [`USER_TAG shifts USER_THEIR legs to try to reach the peak! Too bad USER_THEIR VAR_C1 makes it hard to touch there!`, `USER_TAG bucks USER_THEIR midsection, trying to climax, but without arms, USER_THEY USER_ISARE not getting anywhere!`, `USER_TAG squirms helplessly in USER_THEIR VAR_C1, trying to let go! USER_THEY_CAP needUSER_S some more help from vibrators!`],
	free: [`USER_TAG takes a deep breath and calms USER_THEIR nerves, the hot feelings *slowly* going away...`, `USER_TAG takes some ice and holds it to USER_THEIR crotch. The sensation is unpleasant, but effective in clearing USER_THEIR mind!`, `USER_TAG fans USER_THEMSELF and closes USER_THEIR eyes, taking deep breaths.`, `USER_TAG carefully uncorks a frigid potion and chugs it. It tastes foul, but USER_THEY feelUSER_S a little more coherent now!`],
};

const texts_mitten = {
	heavy: [`USER_TAG nuzzles a pair of mittens, but can't put them on because of USER_THEIR VAR_C1.`],
	// ephemeral
	mitten: [`You are already wearing mittens!`],
	nomitten: {
		namedmitten: {
			gag: [`USER_TAG puts on a set of VAR_C2. USER_THEYLL_CAP be unable to remove USER_THEIR gag!`, `USER_TAG wriggles USER_THEIR fingers into some VAR_C2. USER_THEIR_CAP gag will be impossible to remove!`, `As if USER_THEY wantUSER_S to stay gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`],
			nogag: [`USER_TAG slips USER_THEIR hands into some VAR_C2! USER_THEYLL_CAP be unable to remove a gag if someone puts one on USER_THEM!`, `USER_TAG wriggles USER_THEIR fingers into some VAR_C2. Gags will be impossible to remove!`, `As if USER_THEY wantUSER_S to be gagged, USER_TAG renders USER_THEIR hands useless with a pair of VAR_C2!`],
		},
		nonamedmitten: {
			gag: [`USER_TAG puts on a pair of mittens with a pair of padlocks. USER_THEYLL_CAP be unable to remove USER_THEIR gag!`, `USER_TAG balls up USER_THEIR fist as USER_THEY slip USER_THEIR hands into a pair of bondage mittens and secure them!`],
			nogag: [`USER_TAG puts on a pair of mittens with a pair of padlocks. USER_THEYLL_CAP be unable to remove a gag if someone puts one on USER_THEM!`, `USER_TAG balls up USER_THEIR fist as USER_THEY slip USER_THEIR hands into a pair of bondage mittens and secure them!`],
		},
	},
};

const texts_struggle = {
	heavy: [
		// True Generics
		`USER_TAG tries USER_THEIR *best* to get some leverage and escape USER_THEIR bondage, but stops just short of potentially pulling a muscle.`,
		// Blacklisted Generics - Filter Out Messages that will not read smoothly with some types
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic", "Dancer", "Horse"]
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
				let blacklistTypes = ["One Bar Prison", "Weighted Blanket", "Toasty Kotatsu"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `The VAR_C1 creaks loudly as USER_TAG *thrashes* in USER_THEIR bondage, trying to escape!`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic"]
				return !blacklistTypes.some(blacklistTypes => t.c1.includes(blacklistTypes));
			},
			text: `USER_TAG fights against USER_THEIR VAR_C1, trying to loosen it even a little bit to maybe escape...`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["Doll Processing", "Mimic"]
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
			text: `USER_TAG tugs on USER_THEIR cuffs but the VAR_C1 holds firm, leaving USER_THEM no choice but to continue dancing for USER_THEIR audience!`,
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
				return t.c1.includes("Autotape");
			},
			text: `USER_TAG struggles against the VAR_C1, but the Autotape is too sticky to come loose that easily!`,
		},
		{
			required: (t) => {
				return t.c1.includes("Bandage");
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
				return t.c1.endsWith("'s Lap");
			},
			text: `USER_TAG wiggles a little bit in VAR_C1, but a stern look quickly keeps USER_THEM in check.`,
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
				`USER_TAG wiggles USER_THEIR thighs to make USER_THEIR VAR_C4 sit more comfortably. Steel is so *unforgiving.*`,
				`USER_TAG gropes USER_THEMSELF with USER_THEIR hands, helplessly unable to touch...`,
				`USER_TAG squirms in USER_THEIR VAR_C4, but no matter how much USER_THEY USER_TRY, USER_THEY just can't feel anything...`,
				{
					required: (t) => {
						return getChastity(t.interactionuser.id).timestamp + 7200000 < Date.now();
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
				`USER_TAG caresses the smooth metal of USER_THEIR VAR_C4, but the lock holds it snugly to USER_THEIR hips!`,
				`USER_TAG tries to get a couple of fingers under USER_THEIR VAR_C4, but it's quite challenging to do so. USER_THEY_CAP should use the key!`,
				`USER_TAG squeezes USER_THEIR thumb under the waistband of USER_THEIR VAR_C4, but can accomplish little more than shift it a bit.`,
				`USER_TAG dances USER_THEIR fingernails on the protective shield of USER_THEIR VAR_C4. Oh how nice it would be to touch...`,
			],
		},
	},
    chastitybra: {
        heavy: [
            `USER_TAG wriggles USER_THEIR chest, but *obviously* USER_THEY USER_ISARE not going to be able to slip off USER_THEIR VAR_C6 while in a VAR_C1.`,
            `Sighing to USER_THEMSELF, USER_TAG gives up on the hopes of ever fighting the VAR_C4 USER_THEY USER_ISARE wearing.`,
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
                `USER_TAG gently taps USER_THEIR VAR_C6 on USER_THEIR chest, locked on and sealing away USER_THEIR breasts... if only USER_THEY could touch...`,
                `USER_TAG dances USER_THEIR fingers on the smooth exterior trapping USER_THEIR breasts. The unyielding steel denies USER_THEM any reprieve.`
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
			nofingers: [`USER_TAG prods at USER_THEIR collar. Such a good pet. Yes. That is USER_THEM! 💜`, `USER_TAG twists USER_THEIR head, trying to get some kind of grip on USER_THEIR VAR_C5 to pull it off, but... no dice.`, `Using USER_THEIR wrists, USER_TAG tries to fidget with USER_THEIR VAR_C5. USER_THEIR_CAP elbows projected out looks adorable, almost pet-like!`],
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
		`USER_TAG rubs USER_THEIR wrists. They wonder what it would feel like to be wearing cuffs.`,
		`USER_TAG blushes slightly as they glance around at all the restraints. Maybe someone will use them on USER_THEM!`,
		`USER_TAG nods as USER_THEY USER_ISARE reminded by USER_THEIR subconscious brain to drink some water!`,
		`USER_TAG tries to imagine how best to adjust USER_THEIR speech when gagged. Perhaps with practice, USER_THEY can figure it out!`,
		`All the keys clanging and bondage restraints strewn about makes USER_TAG swim in happy thoughts!`,
		`USER_TAG twirls USER_THEIR hair absentmindedly. Someone should tie USER_THEM up with more bondage, tehe!~`,
		{
			required: (t) => {
				return !(process.gags && process.gags[t.interactionuser.id]);
			},
			text: `USER_TAG clears USER_THEIR throat and then begins to speak: The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly but gets faster each minute after you hear this signal bodeboop. A single lap should be completed every time you hear this sound. ding Remember to run in a straight line and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark. Get ready!… Start.`,
		},
		`USER_TAG's mind is fantasizing about the cute characters in that last anime USER_THEY watched. Everyone should ask USER_THEM about it!`,
		{
			required: (t) => {
				return !(process.gags && process.gags[t.interactionuser.id]);
			},
			text: `USER_TAG's voice echoes through the halls as USER_THEY monologueUSER_S: ***Tell me, for whom do you fight...***`,
		},
		{
			required: (t) => {
				return !(process.gags && process.gags[t.interactionuser.id]);
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
		`USER_TAG wonders what it would be like to be a pet kitty. Or a pet doggo. USER_THEY_CAP blushUSER_ES a little at the thought~`,
		`USER_TAG prepares for battle with a sword and flourishes it. USER_THEY_CAP USER_ISARE going to hunt the legendary sHE!`,
		`USER_TAG sits and looks around patiently because USER_THEY USER_ISARE a **good USER_PRAISEOBJECT!**`,
		// 2 hours in chastity
		{
			required: (t) => {
				return !isNaN(getChastity(t.interactionuser.id)?.timestamp) && getChastity(t.interactionuser.id)?.timestamp + 7200000 < Date.now();
			},
			text: `USER_TAG absentmindedly fidgets, thinking about the last time USER_THEY could let go...`,
		},
		// 24 hours in chastity
		{
			required: (t) => {
				return !isNaN(getChastity(t.interactionuser.id)?.timestamp) && getChastity(t.interactionuser.id)?.timestamp + 86400000 < Date.now();
			},
			text: `USER_TAG barely remembers what it's like to not be in chastity...`,
		},
	],
};

const texts_toy = {
    heavy: {
        self: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but struggles to put them on because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it in because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't reach the buttons on a VAR_C2 to pleasure USER_THEMSELF.`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto USER_THEMSELF to cool off...`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to USER_THEMSELF, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock USER_THEIR chastity bra to put them on!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR chastity belt prevents USER_THEM from putting the toy inside anyway.`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure USER_THEMSELF. (this is a bug, please report)`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto USER_THEMSELF to cool off... (this is a bug, please report)`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to USER_THEMSELF, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to add it! (This is a bug, report)`
                ]
            }
        },
        other: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but struggles to put them on TARGET_TAG because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2, but can't slip it into TARGET_TAG because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure TARGET_TAG!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG bats around a piece of ice, but can't fanagle it onto TARGET_TAG to cool TARGET_THEM off...`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to TARGET_TAG, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to a pair of VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock TARGET_TAG's chastity bra to put them on TARGET_THEM!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards a VAR_C2 despite USER_THEIR VAR_C1, but TARGET_TAG's chastity belt prevents USER_THEM from putting the toy inside anyway.`
                ],
                "Wand": [
                    `USER_TAG squirms with USER_THEIR VAR_C1, but can't get a grip on a VAR_C2 to pleasure TARGET_TAG! (this is a bug, please report!)`
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to add a VAR_C2 to TARGET_TAG, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to add it! (This is a bug, report)`
                ]
            }
        }
    },
    noheavy: {
        self: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue to rock USER_THEIR hips while holding it to USER_THEIR crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a new piece of ice onto USER_THEIR crotch!`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it and adjusting the VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to adjust USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to adjust USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs the VAR_C2 but can't change it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to place some ice but... can't? (this is a bug, please report)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to adjust USER_THEIR VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG carefully adjusts the VAR_C2 on USER_THEIR breasts, changing them to VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG taps a button on the VAR_C2 USER_THEY USER_ISARE wearing! It vibrates at a strength of VAR_C3!`
                    ],
                    "Wand": [
                        `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue to rock USER_THEIR hips while holding it to USER_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a new piece of ice onto USER_THEIR crotch!`,
                        }
                    ],
                    default: [
                        `USER_TAG causes fuzzy shifting in the universe adjusting USER_THEIR VAR_C2 to VAR_C3! (This is a bug, report!)`
                    ]
                }
            },
            notoy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into USER_THEIR crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a piece of ice onto USER_THEIR crotch, cooling USER_THEM off harshly, but effectively...`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it to add a VAR_C2 at VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to add a VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to add a VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs a VAR_C2 but can't apply it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG takes a piece of ice to apply to USER_THEMSELF, but can't? (This is a bug, report!)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to add a VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG grabs a pair of VAR_C2 and places them gingerly on USER_THEIR breasts! It hums at VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG grabs a VAR_C2 and inserts it into USER_THEMSELF at VAR_C3!`
                    ],
                    "Wand": [
                        `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into USER_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a piece of ice onto USER_THEIR crotch, cooling USER_THEM off harshly, but effectively...`,
                        }
                    ],
                    default: [
                        `USER_TAG potentially summons a black hole putting on a VAR_C2 at VAR_C3 power! (This is a bug, report!)`
                    ]
                }
            }
        },
        other: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY continue holding it against TARGET_TAG's crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a new piece of ice onto TARGET_TAG's crotch, the cruel coldness briskly bringing clarity back...`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it and adjusting the VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to adjust USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to adjust USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs the VAR_C2 on TARGET_TAG but can't change it for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG grabs a new piece of ice to put on TARGET_TAG, but can't because of unforeseen magic. (this is a bug, report)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to adjust TARGET_TAG's VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG carefully adjusts the VAR_C2 on TARGET_TAG's breasts, changing them to VAR_C3!`
                    ],
                    "Vibrator": [
                        `USER_TAG taps a button on the VAR_C2 TARGET_TAG is wearing! It vibrates at a strength of VAR_C3!`
                    ],
                    "Wand": [
                        `USER_TAG grabs the VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as TARGET_TAG continues to rock TARGET_THEIR hips while holding it to TARGET_THEIR crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a new piece of ice onto TARGET_TAG's crotch, the cruel coldness briskly bringing clarity back...`,
                        }
                    ],
                    default: [
                        `USER_TAG causes fuzzy shifting in the universe adjusting TARGET_TAG's VAR_C2 to VAR_C3! (This is a bug, report!)`
                    ]
                }
            },
            notoy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a VAR_C2, turned up to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY feverishly shoveUSER_S it into TARGET_TAG's crotch!`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG places a piece of ice onto TARGET_TAG's crotch, cooling TARGET_THEM off...`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it to add a VAR_C2 at VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to add a VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to add a VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG grabs a VAR_C2 but can't apply it to TARGET_TAG for some reason... Huh. (This is a bug, report)!`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to place a piece of ice on TARGET_TAG, but can't! (this is a bug, report!)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to add a VAR_C2 to TARGET_TAG, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG grabs a pair of VAR_C2 and places them gingerly on TARGET_TAG's breasts! It hums at VAR_C3 power!`
                    ],
                    "Vibrator": [
                        `USER_TAG grabs a VAR_C2 and inserts it into TARGET_TAG! It vibrates at VAR_C3!`
                    ],
                    "Wand": [
                        `USER_TAG grabs a VAR_C2 and clicks a button. It vibrates brilliantly at VAR_C3 as USER_THEY lustfully shoveUSER_S it into TARGET_TAG's crotch!`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG places a piece of ice onto TARGET_TAG's crotch, cooling TARGET_THEM off...`,
                        }
                    ],
                    default: [
                        `USER_TAG potentially summons a black hole putting a VAR_C2 on TARGET_TAG at VAR_C3! (This is a bug, report!)`
                    ]
                }
            }
        }
    },
    toyreflect: [
        `Gagbot recognizes what you're attempting to do. Cheeky.`
    ]
}

const texts_unchastity = {
	chastitybelt: {
		heavy: {
			self: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to squirm out of USER_THEIR chastity belt, but USER_THEIR metal prison holds firmly to USER_THEIR body!`],
				// ephemeral
				nochastity: [`You're not in a chastity belt, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity belt, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`],
				// ephemeral
				nochastity: [`TARGET_TAG is not in a chastity belt, but you wouldn't be able to remove it anyway!`],
			},
		},
		noheavy: {
			self: {
				chastity: {
					key: {
						fumble: {
							discard: { keyholder: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`], clone: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEIR hands are so shaky that the key slips and falls somewhere and turns to magical smoke!`] },
							nodiscard: [`USER_TAG tries to put the key in the lock on USER_THEIR belt, but USER_THEY struggleUSER_S to guide it in the mechanism!`],
						},
						nofumble: [`USER_TAG puts the key in the lock on USER_THEIR belt and unlocks it, freeing USER_THEMSELF from that wretched prison!`],
					},
					nokey: [`USER_TAG runs USER_THEIR fingers uselessly on the metal of USER_THEIR chastity belt, but USER_THEY can't unlock it without the key!`],
				},
				// ephemeral
				nochastity: [`You aren't wearing a chastity belt!`],
			},
			other: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to use the key for TARGET_TAG's belt, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`], clone: [`USER_TAG tries to use the key for TARGET_TAG's belt, but USER_THEIR thoughts cause a momentary slip-up and the key bends out of shape! It's now useless!`] }, nodiscard: [`USER_TAG tries to unlock TARGET_TAG's belt, but USER_THEY can't focus enough to guide the key into the keyhole!`] },
						nofumble: [`USER_TAG puts the key into TARGET_TAG's belt and turns the lock, letting it fall open and onto the floor. TARGET_THEY_CAP TARGET_ISARE free!`],
					},
					// ephemeral
					nokey: [`You don't have the key for TARGET_TAG's belt!`],
				},
				// ephemeral
				nochastity: [`TARGET_TAG is not wearing a chastity belt!`],
			},
		},
	},
	chastitybra: {
		heavy: {
			self: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to shift out of USER_THEIR chastity bra, but USER_THEIR metal prison holds firmly to USER_THEIR body!`],
				// ephemeral
				nochastity: [`You're not in a chastity bra, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				chastity: [`USER_TAG shifts in USER_THEIR VAR_C1, trying to help TARGET_TAG out of TARGET_THEIR chastity bra, but can't get a good grip on the locking mechanism because of USER_THEIR bondage!`],
				// ephemeral
				nochastity: [`TARGET_TAG is not in a chastity bra, but you wouldn't be able to remove it anyway!`],
			},
		},
		noheavy: {
			self: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEIR hands are so shaky that the key slips and falls somewhere with a klang!`], clone: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEIR hands are so shaky that the key slips and disappears as it hits the floor!`] }, nodiscard: [`USER_TAG tries to put the key in the lock on USER_THEIR bra, but USER_THEY struggleUSER_S to guide it in the mechanism!`] },
						nofumble: [`USER_TAG puts the key in the lock on USER_THEIR bra and unlocks it, freeing USER_THEIR breasts from that wretched prison!`],
					},
					nokey: [`USER_TAG caresses USER_THEIR fingers uselessly on the smooth metal of USER_THEIR chastity bra's breast cups, but USER_THEY can't unlock it without the key!`],
				},
				// ephemeral
				nochastity: [`You aren't wearing a chastity bra!`],
			},
			other: {
				chastity: {
					key: {
						fumble: { discard: { keyholder: [`USER_TAG tries to use the key for TARGET_TAG's bra, but USER_THEIR thoughts cause a momentary slip-up and the key falls somewhere!`], clone: [`USER_TAG tries to use the key for TARGET_TAG's bra, but USER_THEIR thoughts cause a momentary slip-up and the key melts in USER_THEIR hands!`] }, nodiscard: [`USER_TAG tries to unlock TARGET_TAG's bra, but USER_THEY can't focus enough to guide the key into the keyhole!`] },
						nofumble: [`USER_TAG puts the key into TARGET_TAG's bra and turns the lock, letting it fall off of TARGET_THEIR breasts and onto the floor.`],
					},
					// ephemeral
					nokey: [`You don't have the key for TARGET_TAG's bra!`],
				},
				// ephemeral
				nochastity: [`TARGET_TAG is not wearing a chastity bra!`],
			},
		},
	},
};

const texts_uncollar = {
	heavy: {
		self: {
			collar: [`USER_TAG crinks USER_THEIR neck, trying to take off USER_THEIR collar, but without USER_THEIR arms due to USER_THEIR VAR_C1, USER_THEY can't!`],
			// Ephemeral
			nocollar: [`You aren't wearing a collar, but you wouldn't be able to take it off even if you were!`],
		},
		other: {
			collar: [`USER_TAG wriggles towards TARGET_TAG, trying to take off TARGET_THEIR collar, but USER_THEY needUSER_S arms to unlock and undo the buckle!`],
			// Ephemeral
			nocollar: [`TARGET_TAG is not wearing a collar, but you wouldn't be able to take it off anyway!`],
		},
	},
	noheavy: {
		self: {
			collar: { key: [`USER_TAG leans forward to let USER_THEIR hair fall forward, then puts a key in the tiny lock and unlocks USER_THEIR collar, undoing the buckle and putting it away!`], nokey: [`USER_TAG tugs at USER_THEIR collar, trying to adjust and maybe take it off, but without the key USER_THEY can't really take it off!`] },
			// Ephemeral
			nocollar: [`You're not wearing a collar!`],
		},
		other: {
			collar: {
				key: [`USER_TAG puts a key in TARGET_TAG's collar, unlocking it and undoing the strap around TARGET_THEIR neck.`],
				nokey: {
					// Ephemeral
					nokeyholderonly: [`TARGET_TAG's collar is unlocked, but it would be impolite to take it off!`],
					// Ephemeral
					keyholderonly: [`You don't have the key for TARGET_TAG's collar!`],
				},
			},
			// Ephemeral
			nocollar: [`TARGET_TAG is not wearing a collar!`],
		},
	},
};

const texts_uncorset = {
	heavy: {
		self: {
			corset: { chastity: [`Since USER_THEY USER_DOESNT have arms, USER_TAG wiggles USER_THEIR torso a little bit, trying to slink off USER_THEIR VAR_C2, but USER_THEIR chastity belt is in the way.`], nochastity: [`USER_TAG wriggles in USER_THEIR VAR_C1, but without arms, USER_THEY can't easily undo the laces of USER_THEIR VAR_C2 to take it off!`] },
			// Ephemeral
			nocorset: [`You aren't wearing a corset, but even if you were, you wouldn't be able to take it off!`],
		},
		other: {
			corset: { chastity: [`USER_TAG tugs against USER_THEIR VAR_C1, but USER_THEY can't really get a good grasp of TARGET_TAG's VAR_C2 strings behind TARGET_THEIR chastity belt!`], nochastity: [`Maybe in another time, USER_TAG might have been able to help TARGET_TAG out of TARGET_THEIR VAR_C2, but having no arms makes it hard.`] },
			// Ephemeral
			nocorset: [`TARGET_TAG isn't wearing a corset, but you wouldn't be able to remove it anyway!`],
		},
	},
	noheavy: {
		self: {
			corset: {
				chastity: {
					key: {
						fumble: {
							discard: {
								keyholder: [`USER_TAG tries to unlock USER_THEIR belt to remove USER_THEIR VAR_C2, but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! USER_THEY_CAP will have to remain corseted!`],
								clone: [`USER_TAG tries to unlock USER_THEIR belt to remove USER_THEIR VAR_C2, but fumbles with the key so much with the key that USER_THEY dropUSER_S it somewhere! A brilliant light coming from the clear floor indicates USER_THEY will have to remain corseted!`],
							},
							nodiscard: [`USER_TAG shakily tries to unlock USER_THEIR belt, but the key keeps slipping and not going into the mechanism. USER_THEY will have to leave USER_THEIR VAR_C2 alone until USER_THEY calm down!`],
						},
						nofumble: [`USER_TAG unlocks USER_THEIR chastity belt briefly, undoing the laces of the VAR_C2 USER_THEY USER_ISARE wearing and pulling it off of USER_THEIR waist! USER_THEY_CAP then carefully lockUSER_S USER_THEMSELF back up!`],
					},
					nokey: [`USER_TAG tugs at USER_THEIR chastity belt to try to remove USER_THEIR VAR_C2, but the locking mechanism holds firm!`],
				},
				nochastity: [`USER_TAG carefully undoes the laces and USER_THEIR VAR_C2, unwrapping it from USER_THEIR waist. USER_THEY_CAP breatheUSER_S a *huge* breath of relief!`],
			},
			// Ephemeral
			nocorset: [`You aren't wearing a corset!`],
		},
		other: {
			corset: {
				chastity: {
					key: {
						fumble: {
							discard: { keyholder: [`USER_TAG tries to unlock TARGET_TAG's chastity belt to remove TARGET_THEIR VAR_C2 but the key slips in USER_THEIR careless horniness. Despite USER_THEIR best efforts, the key seems to have disappeared.`], clone: [`USER_TAG tries to unlock TARGET_TAG's chastity belt to remove TARGET_THEIR VAR_C2 but the key slips in USER_THEIR careless horniness, falling on the floor and chipping. The clone is useless now.`] },
							nodiscard: [`USER_TAG shakily tries to unlock TARGET_TAG's chastity belt to get at TARGET_THEIR VAR_C2, but the key keeps slipping. Fortunately, it wasn't lost, but USER_THEY need to calm down first!`],
						},
						nofumble: [`USER_TAG unlocks TARGET_TAG's chastity belt, then removes TARGET_THEIR VAR_C2! While TARGET_THEY TARGET_ISARE breathing fresh air again, USER_THEY lockUSER_S TARGET_THEM back in TARGET_THEIR chastity belt!`],
					},
					public: [`USER_TAG uses the public access key to unlock TARGET_TAG's chastity belt, removing TARGET_THEIR VAR_C2, and then clicking the lock back shut!`],
					// Ephemeral
					nokey: [`You don't have the key for TARGET_TAG's chastity belt!`],
				},
				nochastity: [`USER_TAG carefully undoes the laces on TARGET_TAG's beautiful VAR_C2, loosening it until it finally falls off of TARGET_THEIR waist!`],
			},
			// Ephemeral
			nocorset: [`TARGET_TAG is not wearing a corset!`],
		},
	},
};

const texts_ungag = {
	heavy: {
		self: {
			gag: [`USER_TAG chews on USER_THEIR gag, trying to spit it out because USER_THEY can't use USER_THEIR hands and arms!`, `USER_TAG tries to push USER_THEIR gag out with USER_THEIR tongue, but only succeeds in vigorously drooling on USER_THEMSELF!`],
			// Ephemeral
			nogag: [`You're not gagged, but you wouldn't be able to remove it anyway!`],
		},
		other: {
			gag: [`USER_TAG bumps into TARGET_TAG, trying to use USER_THEIR useless arms to help TARGET_THEM out of TARGET_THEIR gag! It helped... maybe!`],
			// Ephemeral
			nogag: [`TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`],
		},
	},
	noheavy: {
		mitten: {
			self: {
				gag: [`USER_TAG paws at USER_THEIR gag, trying to get a good grasp on the straps, but to no avail!`, `USER_TAG tries to use both hands to get a grip on the buckle of USER_THEIR gag, but gets nowhere because of USER_THEIR mittens.`, `Brushing USER_THEIR cheek, USER_TAG paws at USER_THEIR gag cutely!`, `USER_TAG mews into USER_THEIR gag pitifully as USER_THEY can't grip the straps to take it out!`],
				// Ephemeral
				nogag: [`You're not gagged, but you wouldn't be able to remove it anyway!`],
			},
			other: {
				gag: [`USER_TAG paws at TARGET_TAG's gag, trying to help TARGET_THEM take it off, but USER_THEY can't really do much.`],
				// Ephemeral
				nogag: [`TARGET_TAG is not gagged, but you wouldn't be able to remove it anyway!`],
			},
		},
		nomitten: {
			self: {
				gag: {
					single: [`USER_TAG has taken USER_THEIR VAR_C2 out!`, `With a stream of drool, USER_TAG undoes the straps and takes USER_THEIR VAR_C2 out!`, `Reaching up and unclasping the straps, USER_TAG unravels USER_THEIR lips from USER_THEIR VAR_C2!`, `USER_TAG takes USER_THEIR VAR_C2 out, stretching USER_THEIR jaw slightly!`],
					multiple: [`USER_TAG undoes all the straps holding USER_THEIR gags in USER_THEIR mouth, letting them fall into USER_THEIR lap.`, `USER_TAG lets out a "pleh~" as USER_THEY undoUSER_ES the straps holding the gags in USER_THEIR mouth.`, `USER_TAG's gags are covered in drool as USER_THEY gently pullUSER_S them out from between USER_THEIR teeth.`],
				},
				// Ephemeral
				nogag: [`You aren't currently gagged right now!`],
			},
			other: {
				gag: {
					single: [`USER_TAG undoes the straps holding TARGET_TAG's VAR_C2 on TARGET_THEIR face, letting it fall out from between TARGET_THEIR teeth.`, `USER_TAG unclasps the buckle for TARGET_TAG's VAR_C2, then carefully pops it out.`, `USER_TAG carefully unbuckles TARGET_TAG's VAR_C2, and lets TARGET_THEIR face fall forward to allow the drool to drain out from TARGET_THEIR mouth.`],
					multiple: [`USER_TAG undoes all the straps holding TARGET_TAG's gags in TARGET_THEIR mouth, letting them fall into TARGET_THEIR lap.`, `TARGET_TAG lets out a "pleh~" as USER_TAG undoes the straps holding the gags in TARGET_THEIR mouth.`, `TARGET_TAG's gags are covered in drool as USER_TAG gently pulls them out from between TARGET_THEIR teeth.`],
				},
				// Ephemeral
				nogag: [`TARGET_TAG is not currently gagged right now!`],
			},
		},
	},
};

const texts_unheadwear = {
	heavy: {
		self: {
			single: {
				worn: [`USER_TAG tries to use the wall to push off the VAR_C2 on USER_THEIR face, but can't really get any leverage!`],
				// Ephemeral
				noworn: [`You aren't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`USER_TAG tries to use the wall to push off the headgear on USER_THEIR face, but can't really get any leverage!`],
				// Ephemeral
				noworn: [`You aren't wearing any head restraints, but you couldn't remove them anyway!`],
			},
		},
		other: {
			single: {
				worn: [`USER_TAG brushes up against TARGET_TAG, trying to peel off the VAR_C2 stuck on TARGET_THEIR head, but it holds firmly!`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`USER_TAG brushes up against TARGET_TAG, trying to peel off the headwear stuck on TARGET_THEIR head, but it all holds firmly!`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`],
			},
		},
	},
	noheavy: {
		mitten: {
			self: {
				single: {
					worn: [`USER_TAG paws at USER_THEIR VAR_C2, trying to scoot it off of USER_THEIR head! No fingers makes it impossible to slip off!`],
					// Ephemeral
					noworn: [`You aren't wearing a VAR_C2, but you couldn't remove it anyway!`],
				},
				multiple: {
					worn: [`USER_TAG paws at USER_THEIR head restraints, trying to scoot them off of USER_THEIR head! No fingers makes it impossible to slip any off!`],
					// Ephemeral
					noworn: [`You aren't wearing any head restraints, but you couldn't remove them anyway!`],
				},
			},
			other: {
				single: {
					worn: [`USER_TAG paws at the VAR_C2 on TARGET_TAG's head, trying to inch it off of TARGET_THEIR face!`],
					// Ephemeral
					noworn: [`TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`],
				},
				multiple: {
					worn: [`USER_TAG paws at the head gear on TARGET_TAG's head, trying to inch it all off of TARGET_THEIR face!`],
					// Ephemeral
					noworn: [`TARGET_TAG isn't wearing any head restraints, but you couldn't remove them anyway!`],
				},
			},
		},
		nomitten: {
			self: {
				single: {
					worn: [`USER_TAG carefully undoes the straps on the VAR_C2, gently pulling it off of USER_THEIR head!`],
					// Ephemeral
					noworn: [`You aren't currently wearing a VAR_C2!`],
				},
				multiple: {
					worn: [`USER_TAG carefully undoes the straps on all of the headgear USER_THEY USER_ISARE wearing, gently pulling it off of USER_THEIR head, one by one!`],
					// Ephemeral
					noworn: [`You aren't currently wearing any headgear!`],
				},
			},
			other: {
				single: {
					worn: [`USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR VAR_C2 and taking it off!`],
					// Ephemeral
					noworn: [`TARGET_TAG isn't currently wearing a VAR_C2!`],
				},
				multiple: {
					worn: [`USER_TAG runs USER_THEIR hands on TARGET_TAG's head, unclasping the straps to TARGET_THEIR head restraints and peeling them all off!`],
					// Ephemeral
					noworn: [`TARGET_TAG isn't currently wearing any headgear!`],
				},
			},
		},
	},
};

const texts_unheavy = {
	heavy: {
		self: [
			`USER_TAG wiggles in USER_THEIR VAR_C1, but obviously USER_THEY USER_ISARE *very* helpless and can't get far with taking it off on USER_THEIR own!`,
			{
				only: (t) => {
					return t.c1.endsWith("'s Lap");
				},
				text: `USER_TAG wiggles a bit in VAR_C1, but it's so warm and comfy there...`,
			},
		],
		other: [`USER_TAG brushes up against TARGET_TAG to help TARGET_THEM out of TARGET_THEIR VAR_C2, but being trapped in a VAR_C1, USER_THEY can't really help TARGET_THEM out much.`],
	},
	noheavy: {
		heavyequipped: [
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
					return t.c2.endsWith("'s Lap");
				},
				text: `USER_TAG helps TARGET_TAG off of the warm lap TARGET_THEY TARGET_WERE laying on!`,
			},
		],
		noheavyequipped: { self: [`You aren't in any kind of heavy bondage!`], other: [`TARGET_TAG is not in any kind of heavy bondage!`] },
	},
};

const texts_unmitten = {
	heavy: { self: [`USER_TAG wriggles USER_THEIR hands in USER_THEIR VAR_C1, but can't get good leverage to take USER_THEIR mittens off!`], other: [`USER_TAG uses USER_THEIR nose to help TARGET_TAG but can't help TARGET_THEM out of TARGET_THEIR mittens!`] },
	noheavy: { 
        other: { 
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

const texts_untoy = {
    heavy: {
        self: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to take off USER_THEIR VAR_C2, but because USER_THEY USER_HAVE no arms, USER_THEY can't get very far!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips to take off USER_THEIR VAR_C2, but can't because USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG twists USER_THEIR thighs slightly, but can't click the button on USER_THEIR VAR_C2 to turn it off!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice on USER_THEIR crotch... but can't grip it without hands!`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to take off USER_THEIR VAR_C2, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to remove USER_THEIR VAR_C2, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock USER_THEIR chastity bra to put them on!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips to remove USER_THEIR VAR_C2 despite USER_THEIR VAR_C1, but USER_THEIR chastity belt prevents USER_THEM from getting to it.`
                ],
                "Wand": [
                    `USER_TAG twists USER_THEIR thighs slightly, but can't click the button on USER_THEIR VAR_C2 to turn it off! (this is a bug, please report)`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice, but is blocked for some reason?! (this is a bug, report!)`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove USER_THEIR VAR_C2 from USER_THEMSELF, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to remove it! (This is a bug, report)`
                ]
            }
        },
        other: {
            access: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest to remove TARGET_TAG's VAR_C2, but struggles to remove them because USER_THEY USER_HAVE no arms!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards TARGET_TAG to remove USER_THEIR VAR_C2, but USER_THEY USER_HAVE no hands to work with!`
                ],
                "Wand": [
                    `USER_TAG wiggles towards TARGET_TAG, but can't click the button on TARGET_THEIR VAR_C2 to turn it off!`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice on TARGET_TAG's crotch... but can't grip it without hands!`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove the VAR_C2 on TARGET_TAG, but can't because of USER_THEIR VAR_C1! (This is a bug, report)`
                ]
            },
            noaccess: {
                "Nipple Vibrator": [
                    `USER_TAG twists USER_THEIR chest over to remove the VAR_C2 from TARGET_TAG, but even if USER_THEY USER_HAVE had USER_THEIR arms, USER_THEY wouldn't be able to unlock TARGET_THEIR chastity bra to get to them!`
                ],
                "Vibrator": [
                    `USER_TAG bucks USER_THEIR hips over towards TARGET_TAG to remove TARGET_THEIR VAR_C2 despite USER_THEIR VAR_C1. TARGET_THEIR_CAP chastity belt prevents USER_THEM from removing the toy anyway, though.`
                ],
                "Wand": [
                    `USER_TAG wiggles towards TARGET_TAG, but can't click the button on TARGET_THEIR VAR_C2 to turn it off! (this is a bug, please report)`
                ],
                "Misc": [
                    {
                        only: (t) => {
                            return (t.c2 == "Ice")
                        },
                        text: `USER_TAG tries to remove the ice, but is blocked for some reason?! (this is a bug, report!)`,
                    }
                ],
                default: [
                    `USER_TAG attempts to use reality defying magic to remove a VAR_C2 from TARGET_TAG, but even if USER_THEY USER_WERE not in a VAR_C1, USER_THEY wouldn't be able to remove it! (This is a bug, report)`
                ]
            }
        }
    },
    noheavy: {
        self: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR bra to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR bra, unlocking it and removing USER_THEIR VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in USER_THEIR belt to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in USER_THEIR belt, unlocking it removing USER_THEIR VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG presses the button on USER_THEIR VAR_C2, turning off the pleasurable vibrations for now...`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG removes the frigid ice from USER_THEIR crotch!`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* to remove USER_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something*, unlocking it and removing USER_THEIR VAR_C2 to VAR_C3 power! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity bra to remove USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock USER_THEIR chastity belt to remove USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG tries to press the button on USER_THEIR VAR_C2, but... can't? (this is a bug, please report)`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to remove the ice but can't?! (This is a bug, report!)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to remove USER_THEIR VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG removes the teasing VAR_C2 from USER_THEIR breasts. The sensation continues to haunt USER_THEM as USER_THEY putUSER_S them away.`
                    ],
                    "Vibrator": [
                        `USER_TAG gently removes the VAR_C2 from inside USER_THEM and puts it away. `
                    ],
                    "Wand": [
                        `USER_TAG presses the button on USER_THEIR VAR_C2, turning off the pleasurable vibrations for now...`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG removes the frigid ice from USER_THEIR crotch!`,
                        }
                    ],
                    default: [
                        `USER_TAG materializes a tear in reality to remove the VAR_C2 from USER_THEM! (This is a bug, report)`
                    ],
                }
            },
            notoy: [
                `You are not wearing a VAR_C2!`
            ]
        },
        other: {
            toy: {
                blocker: {
                    access: {
                        "Nipple Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's bra to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's bra, unlocking it and removing the VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Vibrator": {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in TARGET_TAG's belt to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the VAR_C2! USER_THEY_CAP then closeUSER_S and lockUSER_S TARGET_THEM back up.`
                            ]
                        },
                        "Wand": {
                            nofumble: [
                                `USER_TAG presses the button on TARGET_TAG's VAR_C2, turning off the pleasurable vibrations for now...`
                            ]
                        },
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG removes the frigid ice from TARGET_TAG's crotch!`,
                            }
                        ],
                        default: {
                            fumble: {
                                keyloss: {
                                    keyholder: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen. (This is a bug, report)`
                                    ], 
                                    clone: [
                                        `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips and falls on the floor. The pieces are scattered about. (This is a bug, report)`
                                    ] 
                                },
                                nokeyloss: [
                                    `USER_TAG tries to put the key in *something* on TARGET_TAG to remove TARGET_THEIR VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it! (This is a bug, report)`
                                ]
                            },
                            nofumble: [
                                `USER_TAG puts the key in *something* on TARGET_TAG, unlocking it and removing TARGET_THEIR VAR_C2! (This is a bug, report)`
                            ]
                        }
                    },
                    noaccess: {
                        "Nipple Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity bra to remove USER_THEIR VAR_C2.`
                        ],
                        "Vibrator": [
                            `USER_TAG tries as USER_THEY might, but is unable to unlock TARGET_TAG's chastity belt to remove USER_THEIR VAR_C2.`
                        ],
                        "Wand": [
                            `USER_TAG tries to press the button on TARGET_TAG's VAR_C2, but... can't? (this is a bug, please report)`
                        ],
                        "Misc": [
                            {
                                only: (t) => {
                                    return (t.c2 == "Ice")
                                },
                                text: `USER_TAG tries to remove the ice from TARGET_TAG... but can't access it somehow. (this is a bug, report!)`,
                            }
                        ],
                        default: [
                            `USER_TAG tries to remove TARGET_TAG's VAR_C2, but some kind of reality-defying magic prevents USER_THEM! (This is a bug, report)`
                        ],
                    }
                },
                noblocker: {
                    "Nipple Vibrator": [
                        `USER_TAG removes the teasing VAR_C2 from TARGET_TAG's breasts. The sensation continues to haunt TARGET_THEM as USER_THEY putUSER_S them away.`
                    ],
                    "Vibrator": [
                        `USER_TAG gently removes the VAR_C2 from inside TARGET_TAG and puts it away. `
                    ],
                    "Wand": [
                        `USER_TAG presses the button on TARGET_TAG's VAR_C2, turning off the pleasurable vibrations for now...`
                    ],
                    "Misc": [
                        {
                            only: (t) => {
                                return (t.c2 == "Ice")
                            },
                            text: `USER_TAG removes the frigid ice from TARGET_TAG's crotch!`,
                        }
                    ],
                    default: [
                        `USER_TAG materializes a tear in reality to remove the VAR_C2 from TARGET_TAG! (This is a bug, report)`
                    ],
                }
            },
            notoy: [
                `TARGET_TAG is not wearing a VAR_C2!`
            ]
        }
    },
    toyreflect: [
        `Gagbot recognizes what you're attempting to do. Cheeky.`
    ]
}

const texts_unvibe = {
	heavy: {
		self: {
			chastity: { single: [`USER_TAG tries to knock USER_THEIR VAR_C2 off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`], both: [`USER_TAG tries to knock USER_THEIR vibrators off with USER_THEIR thighs, but USER_THEY can't because USER_THEIR arms are useless from USER_THEIR VAR_C1. Well, and USER_THEIR chastity belt of course!`] },
			nochastity: { single: [`USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`], both: [`USER_TAG thrashes USER_THEIR thighs to try to knock out USER_THEIR VAR_C2, however it stays pretty secure in USER_THEIR body!`] },
		},
		other: {
			chastity: { single: [`USER_TAG tries to knock TARGET_TAG's VAR_C2 off with USER_THEIR knees, however TARGET_THEIR chastity belt holds it firmly in place!`], both: [`USER_TAG tries to knock TARGET_TAG's vibrators off with USER_THEIR knees, however TARGET_THEIR chastity belt holds them firmly in place!`] },
			nochastity: { single: [`USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's VAR_C2, however it stays pretty secure in TARGET_THEIR body!`], both: [`USER_TAG shifts USER_THEIR knees to try to knock out TARGET_TAG's vibrator, however it stays pretty secure in TARGET_THEIR body!`] },
		},
	},
	noheavy: {
		self: {
			hasvibe: {
				chastity: {
					key: {
						fumble: {
							discard: {
								single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips and falls somewhere. The key goes up in flames on the floor.`] },
								both: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips and falls somewhere. A small ghostly key flies up after it lands on the floor and vanishes.`] },
							},
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], both: [`USER_TAG tries to put the key in USER_THEIR belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking USER_THEMSELF back up.`], both: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and removing the tormenting vibrators before closing it and locking USER_THEMSELF back up.`] },
					},
					// No public access to self belt
					nokey: [`USER_TAG claws feverishly at USER_THEIR belt, the agonizing vibrators offering USER_THEM no reprieve from their sweet sensation!`],
				},
				nochastity: { single: [`USER_TAG carefully removes USER_THEIR VAR_C2 and turns it off. Freedom from the torment!`], both: [`USER_TAG carefully removes USER_THEIR vibrator and turns them off. Freedom from the torment!`] },
			},
			novibe: { single: [`You do not have a VAR_C2 on yourself!`], both: [`You do not have any vibrators on yourself!`] },
		},
		other: {
			hasvibe: {
				chastity: {
					key: {
						fumble: {
							discard: {
								single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips and falls somewhere and crumbles into dust.`] },
								both: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips and falls somewhere. It's nowhere to be seen.`] },
							},
							nodiscard: { single: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out the teasing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], both: [`USER_TAG tries to put the key in TARGET_TAG's belt to take out all of the taunting vibrators, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`], both: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and removing the tormenting VAR_C2 before closing it and locking TARGET_THEM back up.`], both: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and removing the tormenting vibrators before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG carefully removes TARGET_TAG's VAR_C2 and turns it off. Freedom from the torment!`], both: [`USER_TAG carefully removes TARGET_TAG's vibrator and turns them off. Freedom from the torment!`] },
			},
			novibe: { single: [`TARGET_TAG does not have a VAR_C2 on TARGET_THEM!`], both: [`TARGET_TAG does not have any vibrators on TARGET_THEM!`] },
		},
	},
};

const texts_unwear = {
	heavy: {
		self: {
			single: {
				worn: [`Try as USER_THEY might, USER_TAG can't wriggle out of USER_THEIR VAR_C2 right now in USER_THEIR bondage.`],
				// Ephemeral
				noworn: [`You aren't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`Try as USER_THEY might, USER_TAG can't really take off USER_THEIR clothes while USER_THEY USER_ISARE tied up.`],
				// Ephemeral
				noworn: [`You aren't wearing any clothes, but you couldn't remove them anyway!`],
			},
		},
		other: {
			single: {
				worn: [`Despite all of USER_THEIR enthusiasm, USER_TAG is unable to take off TARGET_TAG's VAR_C2 without USER_THEIR arms.`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [`Despite all of USER_THEIR enthusiasm, USER_TAG is unable to undress TARGET_TAG without USER_THEIR arms.`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing any clothes, but you couldn't remove them anyway!`],
			},
		},
	},
	noheavy: {
		self: {
			single: {
				worn: [
					`USER_TAG slowly slips out of USER_THEIR VAR_C2, folding it and putting it away for future wear!`,
					{
						only: (t) => {
							return t.c2.includes("Lipstick");
						},
						text: `USER_TAG uses makeup remover to wipe USER_THEIR VAR_C2 off USER_THEIR lips!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Kissmark");
						},
						text: `USER_TAG uses makeup remover to wipe away USER_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Eyeshadow");
						},
						text: `USER_TAG uses makeup remover to wipe away USER_THEIR VAR_C2 from USER_THEIR eyes!`,
					},
					{
						only: (t) => {
							return t.c2.includes("lasses") || t.c2.includes("Librarian's Spectacles");
						},
						text: `USER_TAG takes off USER_THEIR VAR_C2 and folds the arms on them before setting them gently to the side!`,
					},
					{
						only: (t) => {
							return t.c2.includes("attoo");
						},
						text: `USER_TAG uses a bit of magic to erase USER_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Barcode");
						},
						text: `USER_TAG steps into the Doll Terminal, which promptly erases USER_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Polish");
						},
						text: `USER_TAG uses some nail polish remover to remove USER_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Heels") || t.c2.includes("Shoes") || t.c2.includes("Boots") || t.c2.includes("Pumps") || t.c2.includes("Anklets") || t.c2.includes("Greaves");
						},
						text: `USER_TAG slips USER_THEIR VAR_C2 off USER_THEIR feet, putting them away!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Wingbinders");
						},
						text: `USER_TAG reaches around and loosens the straps on USER_THEIR VAR_C2, slowly releasing the tension and allowing USER_THEM to stretch USER_THEIR wings once more!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Outfit");
						},
						text: `USER_TAG strips out of USER_THEIR VAR_C2, packing the outfit away for the next time USER_THEY need it!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Suit");
						},
						text: `USER_TAG slips out of USER_THEIR VAR_C2, carefully hanging each piece up and putting it away.`,
					},
					{
						only: (t) => {
							return t.c2.includes("Magical Girl");
						},
						text: `USER_TAG relaxes and releases USER_THEIR magical transformation. USER_THEIR_CAP VAR_C2 fades away until it is needed again!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Nametag");
						},
						text: `USER_TAG removes USER_THEIR VAR_C2 to go incognito!`,
					},
				],
				// Ephemeral
				noworn: [`You aren't currently wearing a VAR_C2!`],
			},
			multiple: {
				worn: [`USER_TAG slowly slips out of USER_THEIR clothes, folding them all up and stowing them away for future wear!`],
				// Ephemeral
				noworn: [`You aren't currently wearing any headgear!`],
			},
		},
		other: {
			single: {
				worn: [
					`Slowly, USER_TAG runs USER_THEIR fingers over TARGET_TAG, sensually pulling off TARGET_THEIR VAR_C2 and setting it aside.`,
					{
						only: (t) => {
							return t.c2.includes("Lipstick");
						},
						text: `USER_TAG uses makeup remover to wipe TARGET_TAG's VAR_C2 off TARGET_THEIR lips!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Kissmark");
						},
						text: `USER_TAG uses makeup remover to wipe away TARGET_TAG's VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Eyeshadow");
						},
						text: `USER_TAG uses makeup remover to wipe away TARGET_TAG's VAR_C2 from TARGET_THEIR eyes!`,
					},
					{
						only: (t) => {
							return t.c2.includes("lasses") || t.c2.includes("Librarian's Spectacles");
						},
						text: `USER_TAG takes off TARGET_TAG's VAR_C2 and folds the arms on them before setting them gently to the side!`,
					},
					{
						only: (t) => {
							return t.c2.includes("attoo");
						},
						text: `USER_TAG uses a bit of magic to erase TARGET_TAG's VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Barcode");
						},
						text: `USER_TAG leads TARGET_TAG into the Doll Terminal, which promptly erases TARGET_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Polish");
						},
						text: `USER_TAG uses some nail polish remover to remove TARGET_TAG's VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Heels") || t.c2.includes("Shoes") || t.c2.includes("Boots") || t.c2.includes("Pumps") || t.c2.includes("Anklets") || t.c2.includes("Greaves");
						},
						text: `USER_TAG slips TARGET_TAG's VAR_C2 off TARGET_THEIR feet, putting them away!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Wingbinders");
						},
						text: `USER_TAG loosens the straps on TARGET_TAG's VAR_C2, gradually allowing TARGET_THEIR wings to open out and move freely!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Outfit");
						},
						text: `USER_TAG strips TARGET_TAG out of TARGET_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Suit");
						},
						text: `USER_TAG helps TARGET_TAG remove and hang up TARGET_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Magical Girl");
						},
						text: `In a flash of magic, USER_TAG undoes TARGET_TAG's magical transformation, leaving TARGET_THEIR bereft of TARGET_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return t.c2.includes("Nametag");
						},
						text: `USER_TAG removes TARGET_TAG's VAR_C2!`,
					},
				],
				// Ephemeral
				noworn: [`TARGET_TAG isn't currently wearing a VAR_C2!`],
			},
			multiple: {
				worn: [`Giggling with glee, USER_TAG pulls all the clothes off of TARGET_TAG and sets them aside!`],
				// Ephemeral
				noworn: [`TARGET_TAG isn't currently wearing any headgear!`],
			},
		},
	},
};

const texts_vibe = {
	heavy: {
		self: { chastity: { single: [`USER_TAG scoots a VAR_C2 with USER_THEIR ankle, but can't slip it past USER_THEIR chastity belt!`] }, nochastity: { single: [`USER_TAG tries to fanagle a VAR_C2 into USER_THEMSELF with USER_THEIR toes, but isn't flexible enough!`] } },
		other: { chastity: { single: [`USER_TAG tries to carefully manipulate a VAR_C2 into TARGET_TAG, but isn't able to get past TARGET_THEIR chastity belt without arms!`] }, nochastity: { single: [`USER_TAG twists USER_THEIR leg to push a VAR_C2 towards TARGET_TAG, but without arms, USER_THEY can't really put it on TARGET_THEM.`] } },
	},
	noheavy: {
		self: {
			vibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to change the settings on the VAR_C2, but the key slips and falls on the floor. The pieces are scattered about.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to adjust the VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it and adjusting the VAR_C2 to VAR_C3 power! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`] },
					},
					// No public access to self belt
					nokey: [`USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`],
				},
				nochastity: { single: [`USER_TAG adjusts USER_THEIR VAR_C2 and sets it to VAR_C3! The toy buzzes gently!`] },
			},
			novibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips and vanishes. There's a loud crack as it lands on the floor.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in USER_THEIR belt to add a VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in USER_THEIR belt, unlocking it before adding a VAR_C2 set to VAR_C3! USER_THEY_CAP then closeUSER_S and lockUSER_S USER_THEMSELF back up.`] },
					},
					// No public access to self belt
					nokey: [`USER_TAG prods at USER_THEIR belt, trying to open it to play with a vibe, but the belt is locked tightly!`],
				},
				nochastity: { single: [`USER_TAG carefully inserts a VAR_C2 set to VAR_C3! The toy buzzes gently!`] },
			},
		},
		other: {
			vibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to change the VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to change the VAR_C2, but the key slips and explodes as it lands on the floor. A small amount of dust remains.`] } },
							nodiscard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to adjust the buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to adjust the buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] } },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adjusting the buzzing VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adjusting the VAR_C2, setting it to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG adjusts the VAR_C2 inside TARGET_TAG, setting it to VAR_C3. The toy's buzzing song continues TARGET_THEIR joy!`] },
			},
			novibe: {
				chastity: {
					key: {
						fumble: {
							discard: { single: { keyholder: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a VAR_C2, but the key slips and falls somewhere. It's nowhere to be seen.`], clone: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a VAR_C2, but the key slips and falls somewhere, but it wasn't lost! Unfortunately, the key is bent horribly out of shape and is no longer usable.`] } },
							nodiscard: { single: [`USER_TAG tries to put the key in TARGET_TAG's belt to insert a buzzing VAR_C2, but the key slips! Thankfully, USER_THEY didn't lose it!`] },
						},
						nofumble: { single: [`USER_TAG puts the key in TARGET_TAG's belt, unlocking it and adding a buzzing VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					},
					public: { single: [`USER_TAG puts the public access key in TARGET_TAG's belt, unlocking it and adding a VAR_C2 set to VAR_C3 before closing it and locking TARGET_THEM back up.`] },
					nokey: [`You do not have the key to TARGET_TAG's chastity belt.`],
				},
				nochastity: { single: [`USER_TAG carefully adds a VAR_C2 to TARGET_TAG, setting it to VAR_C3. The toy's buzzing song precludes TARGET_THEIR joy!`] },
			},
		},
	},
};

const texts_wear = {
	heavy: {
		self: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2, but you wouldn't be able to put it on anyway!`],
			noworn: [`USER_TAG nuzzles a VAR_C2, but putting it on would be kinda difficult without USER_THEIR arms.`],
		},
		other: {
			// Ephemeral
			worn: [`TARGET_TAG is already wearing a VAR_C2, but you wouldn't be able to put it on TARGET_THEM anyway!`],
			noworn: [`USER_TAG tries to pick up a VAR_C2 and slip it on TARGET_TAG... with something besides USER_THEIR arms, since USER_THEY USER_ISARE wearing a VAR_C1.`],
		},
	},
	noheavy: {
		self: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2!`],
			noworn: [
				`USER_TAG picks up a beautiful VAR_C2 and puts it on! It sits snugly on USER_THEM!`,
				{
					only: (t) => {
						return t.c2.includes("Lipstick");
					},
					text: `USER_TAG pulls out a makeup bag and applies VAR_C2 to USER_THEMSELF!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Kissmark");
					},
					text: `USER_TAG pulls out a makeup bag and carefully scribbles a VAR_C2 on USER_THEMSELF!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Eyeshadow");
					},
					text: `USER_TAG pulls out a makeup bag and applies VAR_C2 to USER_THEIR eyes!`,
				},
				{
					only: (t) => {
						return t.c2.includes("lasses") || t.c2.includes("Librarian's Spectacles");
					},
					text: `USER_TAG unfolds a pair of VAR_C2 and puts them on USER_THEIR nose! USER_THEIR_CAP eyes peer through the glass!`,
				},
				{
					only: (t) => {
						return t.c2.includes("attoo") || t.c2.includes("Barcode");
					},
					text: `USER_TAG uses a tattoo gun to apply a VAR_C2 to USER_THEMSELF!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Barcode");
					},
					text: `USER_TAG allows the Doll Terminal to hold them in place while a mechanical arm applies a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Polish");
					},
					text: `USER_TAG applies VAR_C2 to USER_THEIR nails! So pretty!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Heels") || t.c2.includes("Shoes") || t.c2.includes("Boots") || t.c2.includes("Pumps") || t.c2.includes("Anklets") || t.c2.includes("Greaves");
					},
					text: `USER_TAG slips a pair of VAR_C2 on USER_THEIR feet!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Wingbinders");
					},
					text: `As USER_TAG eases into a pair of VAR_C2 and pulls the straps taut, USER_THEY feelUSER_S it tighten around USER_THEIR wings, gradually locking them away and denying USER_THEM USER_THEIR flight!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Outfit");
					},
					text: `USER_TAG blushes as USER_THEY dresses up in a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Suit");
					},
					text: `USER_TAG slips into a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Empress");
					},
					text: `USER_TAG pulls on the VAR_C2 USER_THEY had commissioned! USER_THEY_CAP feel so incredibly light and airy!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Magical Girl");
					},
					text: `Striking a pose, USER_TAG triggers a magical transformation, feeling as USER_THEIR normal clothes disappear and are replaced with a brilliant VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Nametag");
					},
					text: `USER_TAG clips on a VAR_C2! Now all of the server will know what to call USER_THEM!`,
				},
				{
					required: (t) => {
						return t.c2.includes("Latex");
					},
					text: `USER_TAG eases into a VAR_C2, carefully smoothing out the wrinkles on USER_THEMSELF! Squeak squeak!`,
				},
			],
		},
		other: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2!`],
			noworn: [
				`USER_TAG helps TARGET_TAG into a VAR_C2, ensuring it all fits snugly!`,
				{
					only: (t) => {
						return t.c2.includes("Lipstick");
					},
					text: `USER_TAG pulls out a makeup bag and applies VAR_C2 to TARGET_TAG!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Kissmark") && getWearable(t.interactionuser.id).filter((f) => f.includes("lipstick")).length > 0;
					},
					text: `USER_TAG kisses TARGET_TAG, leaving a VAR_C2 on USER_THEIR cheek!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Kissmark") && getWearable(t.interactionuser.id).filter((f) => f.includes("lipstick")).length == 0;
					},
					text: `USER_TAG applies some lipstick to USER_THEIR lips, and then kisses TARGET_TAG, leaving a VAR_C2 on TARGET_THEIR cheek! USER_THEY_CAP then removes the lipstick.`,
				},
				{
					only: (t) => {
						return t.c2.includes("Eyeshadow");
					},
					text: `USER_TAG pulls out a makeup bag and applies VAR_C2 to TARGET_TAG's eyes!`,
				},
				{
					only: (t) => {
						return t.c2.includes("lasses") || t.c2.includes("Librarian's Spectacles");
					},
					text: `USER_TAG unfolds a pair of VAR_C2 and puts them on TARGET_TAG's nose! TARGET_THEIR_CAP eyes peer through the glass!`,
				},
				{
					only: (t) => {
						return t.c2.includes("attoo");
					},
					text: `USER_TAG uses a tattoo gun to apply a VAR_C2 to TARGET_TAG!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Barcode");
					},
					text: `USER_TAG holds TARGET_TAG in place while a mechanical arm applies a VAR_C2 to TARGET_TAG!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Polish");
					},
					text: `USER_TAG applies VAR_C2 to TARGET_TAG's nails! So pretty!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Heels") || t.c2.includes("Shoes") || t.c2.includes("Boots") || t.c2.includes("Pumps") || t.c2.includes("Anklets") || t.c2.includes("Greaves");
					},
					text: `USER_TAG slips a pair of VAR_C2 on TARGET_TAG's feet!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Wingbinders");
					},
					text: `USER_TAG slips TARGET_TAG's into a pair of VAR_C2, feeling them twitch under USER_THEIR fingers as the straps are tightened down!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Outfit");
					},
					text: `USER_TAG dresses TARGET_TAG up in a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Suit");
					},
					text: `USER_TAG helps TARGET_TAG slip into a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Magical Girl");
					},
					text: `With a burst of magic, USER_TAG triggers a magical transformation on TARGET_TAG, who now finds USER_THEMSELF wearing a VAR_C2!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Nametag");
					},
					text: `USER_TAG clips a VAR_C2 onto TARGET_TAG! Now everyone will know what USER_THEY wantUSER_S to call TARGET_THEM!`,
				},
				{
					required: (t) => {
						return t.c2.includes("Latex");
					},
					text: `USER_TAG helps TARGET_TAG into a VAR_C2, carefully smoothing out the wrinkles! Squeak squeak!`,
				},
			],
		},
	},
};

const texts_timelock = {
	timelockengage: {
		everyoneaccess: {
			self: {
				chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
				chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
				collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
			},
			khother: {
				chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
				chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
				collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`],
			},
			other: {
				chastitybelt: [`USER_TAG puts a timelock on TARGET_TAG's chastity belt, locking it firmly! The timelock's magic wards away TARGET_THEIR hands but others may be able to do things to TARGET_THEM...`],
				chastitybra: [`USER_TAG puts a timelock on TARGET_TAG's chastity bra, locking it firmly! The timelock's magic wards away TARGET_THEIR hands but others may be able to do things to TARGET_THEM...`],
				collar: [`USER_TAG puts a timelock on TARGET_TAG's collar, locking it firmly! The timelock's magic wards away TARGET_THEIR hands but others may be able to do things to TARGET_THEM...`],
			},
		},
		keyholderaccess: {
			self: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			khother: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`] },
			other: { chastitybelt: [`USER_TAG puts a timelock on TARGET_TAG's chastity belt, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on TARGET_TAG's chastity bra, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on TARGET_TAG's collar, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`] },
		},
		noaccess: {
			self: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			khother: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			other: { chastitybelt: [`USER_TAG puts a timelock on TARGET_TAG's chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on TARGET_TAG's chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on TARGET_TAG's collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
		},
	},
};

const texts_eventfunctions = {
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
							return t.c1.includes("Lipstick") || t.c1.includes("Eyeshadow");
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
							return t.c1.includes("Lipstick") || t.c1.includes("Eyeshadow");
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
							return t.c1.includes("Lipstick") || t.c1.includes("Eyeshadow");
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
							return t.c1.includes("Lipstick") || t.c1.includes("Eyeshadow");
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
				chastitybelt: { replace: [`The Costumer Mimic rips off the VAR_C1 that USER_TAG is wearing, storing it away before locking a VAR_C2 in its place.`], add: [`The Costumer Mimic locks a VAR_C2 onto USER_TAG, sealing away USER_THEIR chastity.`] },
				chastitybra: { replace: [`The Costumer Mimic picks the locking mechanism on USER_TAG's VAR_C1, dragging it into its storage. But USER_THEY gets no moment to enjoy the freedom as the mimic traps USER_THEIR breasts in a VAR_C2.`], add: [`The Costumer Mimic wraps a VAR_C2 around USER_TAG's chest, locking away USER_THEIR breasts.`] },
				collar: { replace: [`The Costumer Mimic forces USER_TAG to lean forward as it removes USER_THEIR VAR_C1, consuming it as it instead secures a VAR_C2 around USER_THEIR throat.`], add: [`USER_TAG is forced to lean forward as the Costumer Mimic moves USER_THEIR hair out of the way and wraps a VAR_C2 around USER_THEIR throat.`] },
				headwear: { add: [`The Costumer Mimic produces a VAR_C1 from within itself and secures it onto USER_TAG's head.`] },
				gag: { add: [`The Costumer Mimic pulls a VAR_C1 from its storage and secures it into USER_TAG's mouth.`] },
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
				], 
				none: [`The Costumer Mimic finishes dressing USER_TAG and reluctantly spits USER_THEM out, fully dressed in its chosen costume.`] },
		},
	},
};

const textarrays = {
	texts_chastity: texts_chastity,
	texts_collar: texts_collar,
	texts_collarequip: texts_collarequip,
	texts_corset: texts_corset,
	texts_dollprotocol: texts_dollprotocol,
	texts_gag: texts_gag,
	texts_headwear: texts_headwear,
	texts_heavy: texts_heavy,
	texts_key: texts_key,
	texts_letgo: texts_letgo,
	texts_mitten: texts_mitten,
	texts_struggle: texts_struggle,
    texts_toy: texts_toy,
	texts_unchastity: texts_unchastity,
	texts_uncollar: texts_uncollar,
	texts_uncorset: texts_uncorset,
	texts_ungag: texts_ungag,
	texts_unheadwear: texts_unheadwear,
	texts_unheavy: texts_unheavy,
	texts_unmitten: texts_unmitten,
    texts_untoy: texts_untoy,
	texts_unvibe: texts_unvibe,
	texts_unwear: texts_unwear,
	texts_vibe: texts_vibe,
	texts_wear: texts_wear,
	texts_timelock: texts_timelock,
	texts_eventfunctions: texts_eventfunctions,
};

// Get generic text and spit out a pronoun respecting version YAY
const getTextGeneric = (type, data_in) => {
	let generics = {
		unbind: ["TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be removed. Please wait as TARGET_THEY confirmTARGET_S (5 minute timeout)."],
		unbind_decline: ["TARGET_TAG has declined your help with USER_THEIR VAR_C1."],
		unbind_accept: ["TARGET_TAG has accepted your offer to help with TARGET_THEIR VAR_C1!"],
		unbind_timeout: ["The request to help TARGET_TAG timed out!"],
		changebind: ["TARGET_TAG has elected to prompt for TARGET_THEIR VAR_C1 to be changed. Please wait as TARGET_THEY confirmTARGET_S (5 minute timeout)."],
		changebind_decline: ["TARGET_TAG has declined allowing you to change TARGET_THEIR bindings."],
		changebind_accept: ["TARGET_TAG has allowed you to change TARGET_THEIR bindings."],
		clone_accept: ["TARGET_TAG has allowed you to make a clone of TARGET_THEIR VAR_C1 key, giving it to VAR_C2!"],
		clone_accept_self: ["Cloning your key..."],
		clone_decline: ["TARGET_TAG has forbidden you from making a clone of TARGET_THEIR VAR_C1 key for VAR_C2!"],
		give_accept: ["TARGET_TAG has allowed you to give TARGET_THEIR VAR_C1 key to VAR_C2!"],
		give_accept_self: ["Giving your key..."],
		give_decline: ["TARGET_TAG has forbidden you from giving TARGET_THEIR VAR_C1 key to VAR_C2!"],
		revoke_accept: ["You have destroyed the key VAR_C2 had to TARGET_TAG's VAR_C1."],
        find_key_self: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! Lucky find!`,
            `USER_TAG spots a shiny glint and picks it up. It turns out to be the key to USER_THEIR VAR_C1!`,
            `USER_TAG steps on something weird and picks it up. Fortunately, it's USER_THEIR VAR_C1 key!`
        ],
        find_key_other: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! What will TARGET_THEY have to do to get it back?`,
            `As USER_TAG is chatting, USER_THEY spotUSER_S a shiny key that seems to match TARGET_TAG's VAR_C1!`
        ],
        find_key_self_mitten: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up... and just BARELY grasps it.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Despite having no fingers, USER_THEY still somehow manageUSER_S to pick it up.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in relief as USER_THEY just barely pick it up.`
        ],
        find_key_other_mitten: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had fingers... But! Despite no fingers, USER_THEY still manageUSER_S to pick it up!`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! USER_TAG_CAP bats it around a little bit, but in the end, manages to pick it up using both mittens!`
        ],
        find_keyfail_self: [
            `USER_TAG paws around in the dark, but just barely misses the key to USER_THEIR VAR_C1...`
        ],
        find_keyfail_other: [
            `USER_TAG paws around in the dark, but just barely misses the key to TARGET_TAG's VAR_C1...`
        ],
        find_keyfail_self_mitten: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up... and fails.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Unhelpfully, USER_THEY bat it because USER_THEY USER_HAVE no fingers.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in frustration as USER_THEY can't pick it up.`
        ],
        find_keyfail_other_mitten: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had fingers...`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! Not that USER_THEY can pick it up, of course, but it's the thought that counts.`
        ],
        find_keyfail_self_heavy: [
            `USER_TAG finds USER_THEIR key to USER_THEIR VAR_C1! USER_THEY_CAP attemptUSER_S to pick it up, but obviously fails because USER_THEIR arms are tightly bound.`,
            `USER_TAG sees a glint that looks a lot like USER_THEIR VAR_C1 key! Unhelpfully, USER_THEY bat it because USER_THEY USER_HAVE no arms.`,
            `USER_TAG spots USER_THEIR VAR_C1 key! USER_THEY_CAP sighs in frustration as USER_THEY can't pick it up.`
        ],
        find_keyfail_other_heavy: [
            `USER_TAG finds the key to TARGET_TAG's VAR_C1! TARGET_THEY_CAP would be in trouble if USER_TAG had arms to pick it up...`,
            `TARGET_TAG's key has been missing for a bit, but fortunately, USER_TAG spots it! Not that USER_THEY can pick it up, of course, but it's the thought that counts.`
        ],
	};

	let chosentext = generics[type][Math.floor(generics[type].length * Math.random())];
	return convertPronounsText(chosentext, data_in);
};

/* ----------------------------------
getText() -> Returns a full text depending on data
NOTE: data MUST be constructed in the same property
order as specified on the relevant texts string, which should
be referenced in the beginning of the data function. 
For example, to retrieve the chastity text with no heavy bondage,
chastity, held by self, you should construct the data like this:
	data: {
		textarray: "texts_chastity", // the array to retrieve from
		textdata: { interactionuser, targetuser, ...c1, c2, etc } // see convertPronounsText function

		noheavy: true,
		chastity: true,
		key_self: true
	}
These properties are constructed dynamically with a for... in loop 
and then retrieved from the array using texts_chastity["noheavy"]["chastity"]["key_self"] 
to get the particular array of texts for that condition. 

THE PROPERTY ORDER IS IMPORTANT TO ENSURE THE TEXT RETRIEVAL WORKS AS INTENDED.
-------------------------------------*/
const getText = (data) => {
	try {
		let textarray = data.textarray;
		let data_in = data.textdata;
		let props = [];
		for (k in data) {
			if (k != "textarray" && k != "textdata") {
				props.push(k); // Should create the same order.
			}
		}
		// At first I thought, a reducer might not be good performance.
		// Then I remembered, javascript passes *objects* and *arrays* by reference.
		// This is gonna be so clever.
		console.log(props);
		let sentencearr = props.reduce((prev, curr) => {
			return prev[curr];
		}, textarrays[textarray]);
		/* so what is this thing doing? 
			It is iterating over each property and then returning the object at the named property.
			This should always end with an array AS LONG AS THE INPUT OBJECT IS CONSTRUCTED
			EXACTLY THE WAY THE TREE IS SET UP */
		if (Array.isArray(sentencearr)) {
			// Within the array, we want to handle the following cases:
			// - Standard strings
			// - Required strings via "required: (userID) => {}" -- When true, the phrase is included along with standard strings
			// - Only strings via "only: (userID) => {}" -- When any are true, only use these phrases
			//
			// For example, { only: () => { return data_in.c1.includes("Lipstick") }, `USER_TAG wipes off USER_THEIR VAR_C1` }
			// would allow only this phrase to be used when the chosen item is something Lipstick in the c1 slot.
			//
			// If there are *any* onlyphrases, then chosenphrases will not be used.
			let chosenphrases = [];
			let onlyphrases = [];
			let only = false;
			sentencearr.forEach((a) => {
				if (typeof a == "string") {
					chosenphrases.push(a);
				} else {
					if (a.only != undefined && a.only(data_in)) {
						onlyphrases.push(a.text);
						only = true;
					} else if (a.required != undefined && a.required(data_in)) {
						chosenphrases.push(a.text);
					}
				}
			});
			let outstring;
			if (only) {
				outstring = onlyphrases[Math.floor(Math.random() * onlyphrases.length)];
			} else {
				outstring = chosenphrases[Math.floor(Math.random() * chosenphrases.length)];
			}
			outstring = convertPronounsText(outstring, data_in);

			return outstring;
		} else {
			return "There was an error generating this text. No error, but the destination was not an array of strings. Please tell Enraa that the tree followed this path: " + props.join(", ");
		}
	} catch (err) {
		console.log(err);
		return "There was an error generating this text. See console error.";
	}
};

exports.getText = getText;
exports.getTextGeneric = getTextGeneric;
