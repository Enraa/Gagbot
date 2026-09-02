exports.texts_heavy = {
	heavy: [`USER_TAG writhes in USER_THEIR VAR_C1, trying to change USER_THEIR bondage, but may need some help!`],
	noheavy: {
        self: {
            canwear: {
                arms: [
                    `USER_TAG slips into a VAR_C2, rendering USER_THEIR arms and hands completely useless!`,
                    `USER_TAG pulls out a VAR_C2 and carefully wraps it around USER_THEIR arms before whispering a spell to pull it tightly around them!`,
                    `Conjuring a VAR_C2 with a quick spell, USER_TAG slips it on over USER_THEIR arms, sealing them away!`,
                    `USER_TAG carefully positions a VAR_C2 to slip it on over USER_THEIR arms and pulls tightly. USER_THEIR_CAP arms are thoroughly locked away!`,
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
                        text: `USER_TAG slips into a VAR_C2, trapping USER_THEIR arms and legs and forcing USER_THEM to crawl like a pet!`,
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
                    {
                        only: (t) => {
                            return t.c2.includes("Tape Mummi")
                        },
                        text: `USER_TAG pulls out a roll of tape and begins to wrap it around USER_THEMSELF! Soon enough USER_THEY USER_ISARE completely mummified by tape!`,
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
                            return t.c2.includes("Wardrobe Device");
                        },
                        text: `USER_TAG steps into a VAR_C2, the lights inside lighting up brilliantly as the door shuts behind USER_THEM, sealing USER_THEM inside until it changes USER_THEM into a new outfit!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Hands-off Blouse");
                        },
                        text: `USER_TAG puts a VAR_C2 on, slipping USER_THEIR arms into the arms and placing USER_THEIR hands into the integrated mittens. Using a magical spell, USER_THEY threadUSER_S USER_THEIR hand mitten straps through the neck cuff and ties them into a neat bow in front!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Sphere");
                        },
                        text: `USER_TAG tosses a VAR_C2 in the air and lets it hit USER_THEIR head, activating its capture function and sealing USER_THEM inside!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Pile of Cats");
                        },
                        text: `USER_TAG reaches out to pet a cat. Soon after, the cat hops into USER_THEIR lap! USER_THEY_CAP USER_ISARE trapped as more cats show up to cuddle with USER_THEM!`,
                    },
					{
					    only: (t) => {
					        return t.c2.includes("Sticky Glue");
					    },
					    text: `USER_TAG wanders around for a while, then decides to flop into a VAR_C2 trap!`,
					},
                    {
                        only: (t) => {
                            return t.c2.includes("Lockdown Virus");
                        },
                        text: `USER_TAG taps a few too many pop-ups on USER_THEIR tablet and suddenly finds USER_THEIR joints seizing up! USER_THEIR_CAP OS Daemon processes are locked up from a rogue virus USER_THEY 'accidentally' allowed!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Wind-up");
                        },
                        text: `USER_TAG pulls out an enchanted Wind-Up Key! Reaching carefully behind USER_THEMSELF with it, USER_THEY feels it snap into place, leaving USER_THEM feeling like a clockwork toy~!`,
                    },
                ],
                legs: [
                    `USER_TAG pulls out a VAR_C2 and wraps it over USER_THEIR legs! USER_THEY_CAP will be quite unable to move now!`,
                    `USER_TAG conjures a VAR_C2 and puts it on over USER_THEIR legs, securing it tightly to prevent USER_THEIR movement!`,
                    `With dreams of immobility, USER_TAG takes out a VAR_C2 and puts it on over USER_THEIR legs, keeping USER_THEM from reaching anyone!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Cat in Lap");
                        },
                        text: `USER_TAG sits down while talking. Suddenly, a cute and adorable cat hops up into USER_THEIR lap and starts purring!`,
                    }
                ],
                container: [
                    `USER_TAG steps into a VAR_C2 and closes the door behind USER_THEM! The space inside feels so defined now!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Pet Cage");
                        },
                        text: `USER_TAG crawls into the VAR_C2, blushing as USER_THEY hearUSER_S the door to the VAR_C2 swing closed behind USER_THEM and lock with a soft click!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Leashing Post");
                        },
                        text: `USER_TAG walks over to the VAR_C2, clipping on a leash and blushing as USER_THEY kneelUSER_S down and tieUSER_S the other end to the VAR_C2!`,
                    },
					{
                        only: (t) => {
                            return t.c2.includes("Dancer's Pole");
                        },
                        text: `USER_TAG climbs onto the stage, stalking over to the VAR_C2 and beginning to dance sensuously for the pleasure of USER_THEIR audience!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Cuddle Puddle");
                        },
                        text: `USER_TAG walks towards the VAR_C2! It envelops USER_THEM in a neverending cascade of cuddles!`,
                    },                
                    {
                        only: (t) => {
                            return t.c2.includes("Duffel Bag");
                        },
                        text: `USER_TAG pulls the zip down on a VAR_C2 before slipping USER_THEMSELF inside and pulling the zipper closed behind USER_THEM!`,
                    },                
                ],
                furniture: [
                    `USER_TAG pulls up a VAR_C2, planting USER_THEIR body comfortably on it!`,
                    `USER_TAG sidles up to a VAR_C2, slipping down to rest USER_THEIR body atop it!`,
                    {
                        only: (t) => {
                            return t.c2.includes("Stable");
                        },
                        text: `USER_TAG opens the stall door of the VAR_C2, stepping through before closing and latching it behind USER_THEMSELF!`,
                    },
                ]
            },
            nocanwear: {
                arms: [
                    `USER_TAG tries to put their arms in a VAR_C3 somehow, but USER_THEIR VAR_C4 is in the way!`
                ],
                legs: [
                    `USER_TAG tries to further restrain USER_THEIR legs with a VAR_C3, but that's quite unnecessary because of USER_THEIR VAR_C4.`
                ],
                container: [
                    `USER_TAG tries to step into a VAR_C3, but since USER_THEY USER_ISARE already in a VAR_C4, USER_THEY would need some kind of spacial magic!`
                ],
                furniture: [
                    `USER_TAG walks up to a VAR_C3, but cannot maneuver USER_THEIR bound body into it!`
                ]
            }
        },
        other: {
            canwear: {
                arms: [
                    `USER_TAG pulls a VAR_C3 out and grabs TARGET_TAG, forcing TARGET_THEIR arms and hands into the tight restraint! TARGET_THEY_CAP squirmTARGET_S in protest, but TARGET_THEY can't do anything about it!`,
                    `USER_TAG grabs TARGET_TAG and gently pushes TARGET_THEIR arms into a VAR_C3, securing it tightly around TARGET_THEIR body!`,
                    `USER_TAG conjures a VAR_C3 and pulls it tightly over TARGET_TAG's arms, rendering TARGET_THEIR arms helpless! A small pout can be heard from TARGET_THEM!`,
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
                            return t.c3.includes("Pile of Cats");
                        },
                        text: `Like the Simpsons crazy cat lady, USER_TAG picks up a bunch of cats and starts lobbing them one by one at TARGET_TAG! Soon, TARGET_THEY TARGET_ISARE stunned as TARGET_THEY becomeTARGET_S trapped by a purring VAR_C3!`,
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
                            return t.c3.includes("Mimic");
                        },
                        text: `With a cheeky grin, USER_TAG tosses TARGET_TAG towards a resting VAR_C3! It snaps open and drags TARGET_THEM inside with its tentacles before slamming shut and sealing with a resounding click!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Wardrobe Device");
                        },
                        text: `USER_TAG gently pushes TARGET_TAG into a big box with blinking lights and a sign on it that says "VAR_C3!" It quickly shuts the door behind TARGET_THEM and a screen on the outside reads "Occupied!"`,
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
                    {
                        only: (t) => {
                            return t.c3.includes("Arcane Bindings");
                        },
                        text: `USER_TAG traces some runes in the air near TARGET_TAG's arms, placing TARGET_THEM into a set of VAR_C3!`,
                    },
					{
					    only: (t) => {
					        return t.c3.includes("Sticky Glue");
					    },
					    text: `USER_TAG pushes TARGET_TAG from behind as TARGET_THEY TARGET_ISARE looking away, causing TARGET_THEM to fall into a VAR_C3 trap!`,
					},
                    {
                        only: (t) => {
                            return t.c3.includes("Lockdown Virus");
                        },
                        text: `USER_TAG uses a tablet to upload a malicious zero-day code to TARGET_TAG! TARGET_THEIR_CAP joints seize up instantly as the Daemon takes hold of TARGET_THEIR OS!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Wind-up");
                        },
                        text: `USER_TAG slips behind TARGET_TAG with an enchanted Wind-Up Key! As it is pressed against TARGET_TAG's back it snaps into place, leaving TARGET_THEM looking like a clockwork toy in need of some winding~!`,
                    },
                ],
                legs: [
                    `USER_TAG grabs TARGET_TAG's legs and wraps a VAR_C3 over them, pulling the restraint tightly around and securing it.`,
                    `USER_TAG pulls out a VAR_C3 and puts it on over TARGET_TAG's legs, immobilizing TARGET_THEM in place!`,
                    `USER_TAG trips TARGET_TAG and catches TARGET_THEM before putting a VAR_C3 on over TARGET_THEIR legs, binding TARGET_THEM in place!`,
                    {
                        only: (t) => {
                            return t.c3.includes("Arcane Bindings");
                        },
                        text: `USER_TAG traces some runes in the air near TARGET_TAG's legs, placing TARGET_THEM into a set of VAR_C3!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Cat in Lap");
                        },
                        text: `USER_TAG places a cat toy in TARGET_TAG's lap. Suddenly, an adorable little furball shows up and roosts itself in TARGET_THEIR lap, purring loudly!`,
                    }
                ],
                container: [
                    `USER_TAG guides TARGET_TAG into a VAR_C3 and then closes the door shut behind TARGET_THEM, sealing TARGET_THEM in!`,
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
                    {
                        only: (t) => {
                            return t.c3.endsWith("'s Lap");
                        },
                        text: `USER_TAG pulls TARGET_TAG into USER_THEIR lap, holding TARGET_THEM gently but firmly.`,
                    },
                    {
                        only: (t) => {
                            return t.c3.startsWith("Engulfed");
                        },
                        text: `USER_TAG creeps towards TARGET_TAG and swallows TARGET_THEM in a pool of slime!`,
                    },
					{
                        only: (t) => {
                            return t.c3.includes("Dancer's Pole");
                        },
                        text: `USER_TAG helps TARGET_TAG climb onto the stage and pushes TARGET_THEM gently towards the VAR_C3, swatting TARGET_THEM on the ass before climbing down and settling into a comfortable seat to watch TARGET_TAG dancing sensually for USER_THEIR enjoyment!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Binding Circle");
                        },
                        text: `USER_TAG inscribes an intricate set of runes and circles on the floor near TARGET_TAG, creating a VAR_C3 that traps TARGET_THEM inside!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Cuddle Puddle");
                        },
                        text: `USER_TAG pulls TARGET_TAG into the VAR_C2! It welcomes TARGET_THEM as one of its own!`,
                    },
                    {
                        only: (t) => {
                            return t.c3.includes("Duffel Bag");
                        },
                        text: `USER_TAG pulls the zip down on a VAR_C2 before slipping TARGET_TAG inside and pulling the zipper closed, sealing TARGET_THEM inside!`,
                    }, 
                ],
                furniture: [
                    `USER_TAG guides TARGET_TAG over to a VAR_C3, before offering TARGET_THEM to make TARGET_THEMSELF comfortable!`,
                    `USER_TAG leads TARGET_TAG towards a VAR_C3, gently pushing TARGET_THEM down on top of it!`,                                   
                    {
                        only: (t) => {
                            return t.c2.includes("Stable");
                        },
                        text: `USER_TAG opens the stall door of the VAR_C2, leading TARGET_TAG inside before slipping back out and latching it behind USER_THEM!`,
                    },
                ]
            },
            nocanwear: {
                arms: [
                    `USER_TAG tries to put TARGET_TAG's arms into a VAR_C3, however TARGET_THEIR arms are already quite helplessly bound in a VAR_C4.`
                ],
                legs: [
                    `USER_TAG tries to immobilize TARGET_TAG's legs using a VAR_C3, but TARGET_THEY TARGET_ISARE already unable to reach everyone because of TARGET_THEIR VAR_C4.`
                ],
                container: [
                    `USER_TAG tries to toss TARGET_TAG into a VAR_C3, but TARGET_THEY are already trapped in a VAR_C4!`
                ],
                furniture: [
                    `USER_TAG tries to guide TARGET_TAG to a VAR_C3, but fails to direct TARGET_THEM appropriately because of USER_THEIR bound body.`
                ]
            }
        },
        reflect: {
            other: {
                canwear: {
                    arms: [
                        `TARGET_TAG tries to put USER_TAG in a VAR_C3. Unfortunately for TARGET_THEM, it is far faster and instead turns the tables to put it on TARGET_THEM!`,
                        `The USER_TAG stares at TARGET_TAG, almost audibly sighing to itself as it sees the VAR_C3. It places it swiftly on the brat.`,
                        `USER_TAG grins widely as TARGET_TAG throws a VAR_C3 at it, before picking it up with several mechanical arms and forcing TARGET_THEM into it.`,
                        `A giggle is heard from the USER_TAG's vocal servos as it grabs the VAR_C3 out of TARGET_TAG's hands and forces TARGET_THEM into it!`
                    ],
                    legs: [
                        `TARGET_TAG tries to catch USER_TAG and place a VAR_C3 over its legs, however robotic strength is a bit overpowering, and so the bot places it on TARGET_THEM instead.`,
                        `USER_TAG grabs TARGET_TAG as TARGET_THEY pull out a VAR_C3 and immediately sets to work wrapping it on TARGET_THEIR legs. TARGET_THEIR_CAP movements are extremely restricted now!`
                    ],
                    container: [
                        `TARGET_TAG tries to push USER_TAG into a VAR_C3, but fails as the drone's propulsion quickly shifts itself at the last moment as TARGET_THEY fallTARGET_S into it instead!`,
                        `USER_TAG stares at the VAR_C3 in confusion as TARGET_TAG tries to push it in. Registering TARGET_THEIR true intent, it shoves TARGET_THEM into it instead.`,
                        {
                            only: (t) => {
                                return (t.interactionuser.id == process.client.user.id);
                            },
                            text: `USER_TAG grins as TARGET_TAG attempts to pull it into TARGET_THEIR lap. Obviously TARGET_THEY wantTARGET_S to be in someone's lap, so it gently pulls TARGET_THEM into its own instead with a gentle headpat. A happy sound can be heard from TARGET_THEM!`
                        }
                    ],
                    furniture: [
                        `TARGET_TAG tries to offer USER_TAG a nice comfy place to relax. But USER_THEY USER_ISARE too nice and direct TARGET_THEM to the VAR_C2 instead!`
                    ]
                },
                nocanwear: {
                    arms: [
                        `TARGET_TAG scoots against a VAR_C3, but since USER_THEY USER_ISARE wearing a VAR_C4, the USER_TAG simply laughs at the useless response.`
                    ],
                    legs: [
                        `TARGET_TAG tries USER_THEIR very best to bind the USER_TAG's legs with a VAR_C3. Since it cannot put it on TARGET_THEM due to TARGET_THEIR VAR_C4, it quietly discards the restraint.`
                    ],
                    container: [
                        `TARGET_TAG tries to throw USER_TAG into a VAR_C3 using dimensional space magic but the spell fizzles. It cannot retaliate because it does not know such space magic.`
                    ]
                }
            }
        }
    }
};