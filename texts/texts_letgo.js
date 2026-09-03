const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_letgo = {
	orgasm: [
		`USER_TAG is overwhelmed with pleasure, clenching USER_THEIR thighs in an earth-shattering orgasm!`,
		`USER_TAG convulses, finally reaching the peak and then rolls over limply, swimming in the sensation!`,
		`USER_TAG's breath seizes up as it all bursts, leaving a crumpled frame behind!`,
		`USER_TAG twitches USER_THEIR hips and thighs, finally! USER_THEY_CAP layUSER_S down, basking in the afterglow!`,
		`Like a dam bursting, USER_TAG thrashes out as USER_THEY finally reachUSER_ES the top!`,
        `USER_TAG twists USER_THEIR hips, finally getting to the peak! The rush of endorphins washes over USER_THEM as the sensations settle down!`,
        `USER_TAG's vision feels just a tad hazy as USER_THEY finally getUSER_S there! USER_THEY_CAP goUSER_ES limp as USER_THEY bask in the wonderful sensations...`,
        `It all pays off as USER_TAG explodes from the sensations, USER_THEIR body twisting involuntarily as it washes over USER_THEM!`,
        `USER_TAG does a little thrust forward to finally climax, the sensations crashing over USER_THEM in a wave of delight!`,
	],
    orgasmcontrolled: [
        `USER_TAG's Orgasm Control Module senses USER_THEIR attempts and deadens the stimulation at the very last moment!`,
        `USER_TAG squirms and softly screams as USER_THEIR sensations down there go numb right before climax!`,
        `USER_TAG thrusts USER_THEIR hips, trying to quickly finish before... the Orgasm Control Module softened the stimulation *again*.`,
        `USER_TAG pouts as USER_THEY forgetUSER_S that USER_THEY USER_DOESNT get to choose when USER_THEY can orgasm anymore.`,
        `USER_TAG grumbles as once again when USER_THEY attempt to get that last thrust, USER_THEIR crotch feels numb, ruining the moment!`,
        `USER_TAG keeps trying to get that last little bit of pleasure, but really USER_THEY should focus on behaving. USER_THEIR orgasms do *not* belong to USER_THEM.`,
        `USER_TAG bucks USER_THEIR hips again but the dams just won't open as USER_THEIR thigh muscles involuntarily stop at the peak!`,
        `USER_TAG tries to touch down there, but despite how horny USER_THEY may be, it just doesn't offer any pleasure. Perhaps if USER_THEY could press the button on USER_THEIR remote...`,
        `USER_TAG frantically claws, trying to get a little more sensation there before the Orgasm Control Module notices but its too late!`
    ],
	chastity: [
		`USER_TAG squirms, trying to adjust the belt so USER_THEY can feel ***something***, but USER_THEY just can't get over the edge!`,
		`USER_TAG holds USER_THEIR breath, feverishly stroking the smooth belt USER_THEY USER_ISARE wearing, but USER_THEY just can't let go!`,
		`USER_TAG grinds on a near by object, trying to get that last little bit of sensation to let go... but USER_THEY just can't make it!`,
		`USER_TAG buckles USER_THEIR legs, panting in short breaths as USER_THEY attemptUSER_S to (and failUSER_S miserably) to get release!`,
		`USER_TAG attempts to get relief, but **good USER_PRAISEOBJECTs** don't get to touch there.`,
		{
			required: (t) => {
				let blacklistTypes = ["livingwood", "seal"]
				return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true;
			},
			text: `USER_TAG tries to get over the edge but is denied by USER_THEIR steel prison!`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["livingwood", "seal"]
				return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true;
			},
			text: `USER_TAG tries to rub the cold steel of USER_THEIR chastity belt, but USER_THEY can't feel anything!`,
		},
		{
			required: (t) => {
				let blacklistTypes = ["seal"]
				return getChastity(t.serverID, t.interactionuser.id)?.chastitytype ? !blacklistTypes.some(blacklistTypes => getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes(blacklistTypes)) : true;
			},
			text: `USER_TAG frantically *claws* at USER_THEIR chastity belt, but it offers no sensation!`,
		},
		{
			required: (t) => {
				return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("livingwood");
			},
			text: `USER_TAG struggles fruitlessly to get over the edge, aggitating USER_THEIR livingwood chastity and causing its tendrils to squirm more insistently~!`,
		},
		{
			required: (t) => {
				return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
			},
			text: `USER_TAG struggles fruitlessly to get over the edge, but the magics in the seal applied to USER_THEM prevent USER_THEM from touching USER_THEMSELF~!`,
		}
	],
	heavy: [
		`USER_TAG shifts USER_THEIR legs to try to reach the peak! Too bad USER_THEIR VAR_C1 makes it hard to touch there!`, 
		`USER_TAG bucks USER_THEIR midsection, trying to climax, but without arms, USER_THEY USER_ISARE not getting anywhere!`, 
		`USER_TAG squirms helplessly in USER_THEIR VAR_C1, trying to let go! USER_THEY needUSER_S some more help from vibrators!`
	],
	heavy: [`USER_TAG shifts USER_THEIR legs to try to reach the peak! Too bad USER_THEIR VAR_C1 makes it hard to touch there!`, `USER_TAG bucks USER_THEIR midsection, trying to climax, but without arms, USER_THEY USER_ISARE not getting anywhere!`, `USER_TAG squirms helplessly in USER_THEIR VAR_C1, trying to let go! USER_THEY_CAP needUSER_S some more help from vibrators!`],
	free: [`USER_TAG takes a deep breath and calms USER_THEIR nerves, the hot feelings *slowly* going away...`, `USER_TAG takes some ice and holds it to USER_THEIR crotch. The sensation is unpleasant, but effective in clearing USER_THEIR mind!`, `USER_TAG fans USER_THEMSELF and closes USER_THEIR eyes, taking deep breaths.`, `USER_TAG carefully uncorks a frigid potion and chugs it. It tastes foul, but USER_THEY feelUSER_S a little more coherent now!`],
};