exports.texts_unwear = {
	heavy: {
		self: {
			single: {
				worn: [
                    `Try as USER_THEY might, USER_TAG can't wriggle out of USER_THEIR VAR_C2 right now in USER_THEIR bondage.`,
                    `USER_TAG wants to slip USER_THEIR VAR_C2 off of USER_THEIR body, but USER_THEIR bondage makes that a challenge...`,
                    `If only USER_TAG wasn't tied up, maybe USER_THEY could take USER_THEIR VAR_C2 off...`,
                ],
				// Ephemeral
				noworn: [`You aren't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [
                    `Try as USER_THEY might, USER_TAG can't really take off USER_THEIR clothes while USER_THEY USER_ISARE tied up.`,
                    `USER_TAG is tied up, so despite USER_THEIR efforts to squirm out of USER_THEIR clothes, they all remain pretty secure on USER_THEIR body.`,
                    `USER_TAG runs USER_THEIR fingers all over USER_THEIR body to take off USER_THEIR clothes... in USER_THEIR head. USER_THEIR_CAP bondage doesn't permit anything else, afterall.`,
                ],
				// Ephemeral
				noworn: [`You aren't wearing any clothes, but you couldn't remove them anyway!`],
			},
		},
		other: {
			single: {
				worn: [
                    `Despite all of USER_THEIR enthusiasm, USER_TAG is unable to take off TARGET_TAG's VAR_C2 without USER_THEIR arms.`,
                    `USER_TAG wiggles in USER_THEIR bondage, eager to help TARGET_TAG out of TARGET_THEIR VAR_C2!`,
                    `USER_TAG would love nothing more than to take the VAR_C2 off of TARGET_TAG, but USER_THEY USER_ISARE bound tightly!`
                ],
				// Ephemeral
				noworn: [`TARGET_TAG isn't wearing a VAR_C2, but you couldn't remove it anyway!`],
			},
			multiple: {
				worn: [
                    `Despite all of USER_THEIR enthusiasm, USER_TAG is unable to undress TARGET_TAG without USER_THEIR arms.`,
                    `USER_TAG imagines TARGET_TAG is a manniquin and USER_THEY USER_ISARE undressing TARGET_THEM. It's all imagination though since USER_THEY USER_ISARE bound.`,
                    `USER_TAG does USER_THEIR best impression of taking off TARGET_TAG's clothes. It's not very effective though. `
                ],
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
                    `USER_TAG pulls off USER_THEIR VAR_C2, setting it aside to store in USER_THEIR closet later!`,
                    `USER_TAG slinks off USER_THEIR VAR_C2! It's time for a wardrobe change!`,
                    `USER_TAG carefully slides the VAR_C2 off of USER_THEIR body and sets it on the floor!`,
					{
						only: (t) => {
							return t.c2.includes("Lipstick");
						},
						text: `USER_TAG uses makeup remover to wipe USER_THEIR VAR_C2 off USER_THEIR lips!`,
					},
					{
						only: (t) => {
							return (t.c2.includes("Kissmark") || t.c2.includes("Blush") || t.c2.includes("Foundation"));
						},
						text: `USER_TAG uses makeup remover to wipe away USER_THEIR VAR_C2!`,
					},
					{
						only: (t) => {
							return (t.c2.includes("Eyeshadow") || t.c2.includes("Eyeliner") || t.c2.includes("Mascara"));
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
                    {
						only: (t) => {
							return t.c2.endsWith("Eyes");
						},
						text: `USER_TAG closes USER_THEIR eyes for a moment and then opens them again, now back to normal!`,
					},
                    {
						only: (t) => {
							return t.c2.includes("Fangs");
						},
						text: `USER_TAG scrunches USER_THEIR face a moment before USER_THEIR VAR_C2 retract!`,
					},
                    {
                        only: (t) => {
                            return (t.c2.includes("Piercing") || t.c2.includes("Nose Ring"));
                        },
                        text: `USER_TAG carefully undoes retainer on USER_THEIR VAR_C2 and slides it out!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Earrings");
                        },
                        text: `USER_TAG carefully unclasps USER_THEIR VAR_C2 and slides them out of USER_THEIR ears!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Blåhaj")
                        },
                        text: `USER_TAG finally loosens USER_THEIR grip on the VAR_C2 and sets it aside with a promise to cuddle it some more later!`,
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
                    `USER_TAG dances USER_THEIR fingers over TARGET_TAG, under the VAR_C2 and slipping it off of TARGET_THEIR body.`,
                    `USER_TAG has decided that TARGET_TAG has worn TARGET_THEIR VAR_C2 long enough and takes it off of TARGET_THEM.`,
                    `USER_TAG gingerly slips the VAR_C2 off of TARGET_TAG and folds it up before setting it aside.`,
					{
						only: (t) => {
							return t.c2.includes("Lipstick");
						},
						text: `USER_TAG uses makeup remover to wipe TARGET_TAG's VAR_C2 off TARGET_THEIR lips!`,
					},
					{
						only: (t) => {
							return (t.c2.includes("Kissmark") || t.c2.includes("Blush") || t.c2.includes("Foundation"));
						},
						text: `USER_TAG uses makeup remover to wipe away TARGET_TAG's VAR_C2!`,
					},
					{
						only: (t) => {
							return (t.c2.includes("Eyeshadow") || t.c2.includes("Eyeliner") || t.c2.includes("Mascara"));
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
                    {
						only: (t) => {
							return t.c2.endsWith("Eyes");
						},
						text: `USER_TAG runs USER_THEIR hand over TARGET_TAG's eyes and they return to normal again!`,
					},
                    {
						only: (t) => {
							return t.c2.includes("Fangs");
						},
						text: `USER_TAG gently pushes against TARGET_TAG's gums, causing TARGET_THEIR VAR_C2 to retract!`,
					},
                    {
                        only: (t) => {
                            return (t.c2.includes("Piercing") || t.c2.includes("Nose Ring"));
                        },
                        text: `USER_TAG carefully undoes retainer on TARGET_TAG's VAR_C2 and slides it out!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Earrings");
                        },
                        text: `USER_TAG carefully unclasps TARGET_TAG's VAR_C2 and slides them out of TARGET_THEIR ears!`,
                    },
                    {
                        only: (t) => {
                            return t.c2.includes("Blåhaj")
                        },
                        text: `USER_TAG gently pulls the VAR_C2 from TARGET_TAG's arms and sets it aside, despite TARGET_THEIR protesting eyes!`,
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