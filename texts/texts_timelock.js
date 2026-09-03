const { getChastity } = require("../functions/getters/chastity/getChastity");

exports.texts_timelock = {
	timelockengage: {
		everyoneaccess: {
			self: {
				chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock's magic wards away USER_THEIR hands but others may be able to do things to USER_THEM...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away USER_THEIR hands but others may still be able to do things to USER_THEM...`,
								},
							],
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
			self: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away everyone's hands until the changes fade away...`,
								},
							], 
					chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			khother: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`], chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "VAR_C1" on it as it begins to count down...`] },
			other: { chastitybelt: [`USER_TAG puts a timelock on TARGET_TAG's chastity belt, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away all but TARGET_TAG's hands until the changes fade away...`,
								},
							], 
					chastitybra: [`USER_TAG puts a timelock on TARGET_TAG's chastity bra, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on TARGET_TAG's collar, locking it firmly! The timelock reads "TARGET_TAG" on it as it begins to count down...`] },
		},
		noaccess: {
			self: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away everyone's hands until the changes fade away...`,
								},
							], 
					chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			khother: { chastitybelt: [`USER_TAG puts a timelock on USER_THEIR chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away everyone's hands until the changes fade away...`,
								},
							], 
					chastitybra: [`USER_TAG puts a timelock on USER_THEIR chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on USER_THEIR collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
			other: { chastitybelt: [`USER_TAG puts a timelock on TARGET_TAG's chastity belt, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`,
								{
									only: (t) => {
										return getChastity(t.serverID, t.interactionuser.id)?.chastitytype && getChastity(t.serverID, t.interactionuser.id)?.chastitytype.includes("seal");
									},
									text: `USER_TAG tweaks the magics of USER_THEIR chastity seal, locking it in time! The magic now wards away everyone's hands until the changes fade away...`,
								},
							], 
					chastitybra: [`USER_TAG puts a timelock on TARGET_TAG's chastity bra, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`], collar: [`USER_TAG puts a timelock on TARGET_TAG's collar, locking it firmly! The timelock reads "No Access" on it as it begins to count down...`] },
		},
	},
};