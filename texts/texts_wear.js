const { getWearable } = require("../functions/getters/wearable/getWearable");

exports.texts_wear = {
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
                `USER_TAG decides to put a VAR_C2 on USER_THEMSELF! It fit really well!`,
                `USER_TAG slips a VAR_C2 on! It seems like it was made just right for USER_THEM!`,
                `USER_TAG carefully digs through USER_THEIR closet to find a VAR_C2 and puts it on!`,
                `USER_TAG decides that today is the perfect day to wear a VAR_C2!`,
				{
					only: (t) => {
						return (t.c2.includes("Lipstick") || t.c2.includes("Blush") || t.c2.includes("Foundation"));
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
						return (t.c2.includes("Eyeshadow") || t.c2.includes("Eyeliner") || t.c2.includes("Mascara"));
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
                {
					only: (t) => {
						return t.c2.endsWith("Eyes");
					},
					text: `USER_TAG closes USER_THEIR eyes for a moment and opens them again to reveal a pair of VAR_C2!`,
				},
                {
					only: (t) => {
						return t.c2.includes("Fangs");
					},
					text: `USER_TAG opens USER_THEIR mouth, flexing it a moment before baring a set of VAR_C2!`,
				},
                {
					only: (t) => {
						return (t.c2.includes("Piercing") || t.c2.includes("Nose Ring"));
					},
					text: `USER_TAG enchants a needle and gently pierces USER_THEMSELF with a VAR_C2!`,
				},
                {
                    only: (t) => {
                        return t.c2.includes("Earrings");
                    },
                    text: `USER_TAG takes a pair of beautiful VAR_C2 and puts them on USER_THEIR ears!`,
                },
                {
					only: (t) => {
						return t.c2.includes("Blåhaj")
					},
					text: `USER_TAG picks up a VAR_C2 and cuddles it tightly! USER_THEY_CAP becomeUSER_S the Blåhaj!`,
				},
			],
		},
		other: {
			// Ephemeral
			worn: [`You are already wearing a VAR_C2!`],
			noworn: [
				`USER_TAG helps TARGET_TAG into a VAR_C2, ensuring it all fits snugly!`,
                `USER_TAG puts a VAR_C2 on TARGET_TAG, smoothing out all the wrinkles!`,
                `USER_TAG slips a VAR_C2 onto TARGET_TAG's body! It seems to fit just right!`,
                `USER_TAG thinks a VAR_C2 would look fantastic on TARGET_TAG, and so USER_THEY helpUSER_S TARGET_THEM into it!`,
				{
					only: (t) => {
						return (t.c2.includes("Lipstick") || t.c2.includes("Blush") || t.c2.includes("Foundation"));
					},
					text: `USER_TAG pulls out a makeup bag and applies VAR_C2 to TARGET_TAG!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Kissmark") && getWearable(t.serverID, t.interactionuser.id).filter((f) => f.includes("lipstick")).length > 0;
					},
					text: `USER_TAG kisses TARGET_TAG, leaving a VAR_C2 on TARGET_THEIR cheek!`,
				},
				{
					only: (t) => {
						return t.c2.includes("Kissmark") && getWearable(t.serverID, t.interactionuser.id).filter((f) => f.includes("lipstick")).length == 0;
					},
					text: `USER_TAG applies some lipstick to USER_THEIR lips, and then kisses TARGET_TAG, leaving a VAR_C2 on TARGET_THEIR cheek! USER_THEY_CAP then removeUSER_S the lipstick.`,
				},
				{
					only: (t) => {
						return (t.c2.includes("Eyeshadow") || t.c2.includes("Eyeliner") || t.c2.includes("Mascara"));
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
                {
					only: (t) => {
						return t.c2.endsWith("Eyes");
					},
					text: `USER_TAG passes a hand over TARGET_TAG's eyes and they transform into a pair of VAR_C2!`,
				},
                {
					only: (t) => {
						return t.c2.includes("Fangs");
					},
					text: `USER_TAG opens TARGET_TAG's mouth, massaging the gums a moment to tickle out a set of VAR_C2!`,
				},
                {
					only: (t) => {
						return (t.c2.includes("Piercing") || t.c2.includes("Nose Ring"));
					},
					text: `Using a needle with unparalleled precision, USER_TAG gently pierces TARGET_TAG with a VAR_C2!`,
				},
                {
                    only: (t) => {
                        return t.c2.includes("Earrings");
                    },
                    text: `USER_TAG takes a pair of beautiful VAR_C2 and puts them on TARGET_TAG's ears!`,
                },
                {
					only: (t) => {
						return t.c2.includes("Blåhaj")
					},
					text: `USER_TAG picks up a VAR_C2 and hands it to TARGET_TAG to cuddle! TARGET_THEY_CAP TARGET_ISARE so cute!`,
				},
			],
		},
	},
};