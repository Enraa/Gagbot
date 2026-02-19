const fs = require("fs");
const path = require("path");
const https = require("https");

const heavytypes = [
	// Armbinders
	{ name: "Ancient Armbinder", value: "armbinder_ancient", tags: ["metal"], denialCoefficient: 3.5 },
	{ name: "Latex Armbinder", value: "armbinder_latex", tags: ["latex"], denialCoefficient: 2 },
	{ name: "Leather Armbinder", value: "armbinder_leather", tags: ["leather"], denialCoefficient: 2 },
	{ name: "High-Security Armbinder", value: "armbinder_secure", denialCoefficient: 3.5 },
	{ name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex", tags: ["latex"], denialCoefficient: 3 },
	{ name: "Crystal Armbinder", value: "armbinder_crystal", denialCoefficient: 3 },
	{ name: "Black Hole Armbinder", value: "armbinder_blackhole", denialCoefficient: 3.5 },
	{ name: "Wolfbinder", value: "armbinder_wolf", denialCoefficient: 3 },
	{ name: "Wolf Queenbinder", value: "armbinder_wolfqueen", tags: ["leather"], denialCoefficient: 3 },

	// Boxbinders
	{ name: "Latex Boxbinder", value: "boxbinder_latex", tags: ["latex"], denialCoefficient: 2 },
	{ name: "Leather Boxbinder", value: "boxbinder_leather", tags: ["leather"], denialCoefficient: 2.5 },
	{ name: "High-Security Boxbinder", value: "boxbinder_hisec", denialCoefficient: 3.5 },
	{ name: "Experimental Boxtie Binder", value: "boxbinder_experimental", denialCoefficient: 3.5 },
	{ name: "Black Hole Boxbinder", value: "boxbinder_blackhole", denialCoefficient: 2 },
	{ name: "Dragon Queen Straps", value: "boxbinder_dragon", tags: ["leather"], denialCoefficient: 2.5 },

	// Straitjackets
	{ name: "Comfy Straitjacket", value: "straitjacket_comfy", denialCoefficient: 3 },
	{ name: "Maid Straitjacket", value: "straitjacket_maid", denialCoefficient: 3.5 },
	{ name: "Maid Punishment Straitjacket", value: "straitjacket_maidpunishment", denialCoefficient: 4.5 },
	{ name: "Doll Straitjacket", value: "straitjacket_doll", denialCoefficient: 3.5 },
	{ name: "Latex Straitjacket", value: "straitjacket_latex", tags: ["latex"], denialCoefficient: 4 },
	{ name: "Shadow Latex Straitjacket", value: "straitjacket_shadowlatex", tags: ["latex"], denialCoefficient: 4 },
	{ name: "Asylum Straitjacket", value: "straitjacket_asylum", denialCoefficient: 5 },
	{ name: "Black Hole Straitjacket", value: "straitjacket_blackhole", denialCoefficient: 4.5 },

	// Petsuits
	{ name: "Piddlefours", value: "petsuit_piddlefours", tags: ["leather"], denialCoefficient: 2 },
	{ name: "Leather Petsuit", value: "petsuit_leather", tags: ["leather"], denialCoefficient: 2.5 },
	{ name: "Alchemical Petsuit", value: "petsuit_alchemical", tags: ["latex"], denialCoefficient: 2.5 },
	{ name: "Autotape Petsuit", value: "petsuit_tape", denialCoefficient: 2.5 },
	{ name: "Latex Petsuit", value: "petsuit_latex", tags: ["latex"], denialCoefficient: 3 },
	{ name: "Seamless Latex Petsuit", value: "petsuit_seamlesslatex", tags: ["latex"], denialCoefficient: 3 },
	{ name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex", tags: ["latex"], denialCoefficient: 3 },
	{ name: "Bast Petsuit", value: "petsuit_bast", denialCoefficient: 3 },
	{ name: "Nevermere Punishment Suit", value: "petsuit_nevermere", tags: ["leather"], denialCoefficient: 3.5 },
	{ name: "Ancient Petsuit", value: "petsuit_ancient", tags: ["metal"], denialCoefficient: 4 },

	// Static Restraints
	{ name: "Display Stand", value: "displaystand", tags: ["metal"], denialCoefficient: 4 },
	{ name: "Stocks", value: "stocks", denialCoefficient: 4 },
	{ name: "One Bar Prison", value: "one_bar_prison", tags: ["metal"], denialCoefficient: 1.5 },
	{ name: "Latex Encasement Stand", value: "encasementstand_latex", tags: ["latex"], denialCoefficient: 4 },
	{ name: "Sarcophagus", value: "sarco_mummy", denialCoefficient: 3 },
	{ name: "Wooden Horse", value: "wooden_horse", denialCoefficient: 3 },
	{ name: "X-Frame", value: "x_frame", denialCoefficient: 5 },
	{ name: "Dancer's Pole", value: "pole_dancer", denialCoefficient: 1.5 },
	{ name: "Leashing Post", value: "leashing_post", denialCoefficient: 2.5 },
	{ name: "Latex Vacbed", value: "vacbed_latex", tags: ["latex"], denialCoefficient: 3.5 },
	{ name: "Latex Vaccube", value: "vaccube_latex", tags: ["latex"], denialCoefficient: 4.5 },
	{ name: "Doll Processing Facility", value: "doll_processing", denialCoefficient: 5 },
	{ name: "Doll Storage Unit", value: "doll_storage", denialCoefficient: 3.5 },
	{ name: "Weighted Blanket", value: "blanket_weighted", denialCoefficient: 1.5 },
	{ name: "Pile of Cats", value: "catpile", denialCoefficient: 99 }, // Are you ***really*** going to disturb the kitties to let go?
	{ name: "Giant Pile of Plushies", value: "plushie_pile", denialCoefficient: 1.5 },
	{ name: "Bed Restraints", value: "bedrestraints", denialCoefficient: 6 },
	{ name: "Massage Table Binding", value: "massage_table_binding", denialCoefficient: 2 },
	{ name: "Pet Cage", value: "pet_cage", denialCoefficient: 4 },
	{ name: "Chair with Cuffs", value: "chaircuffs", denialCoefficient: 3.5 },
	{ name: "Resin Coating", value: "resin_coated", denialCoefficient: 4 },
    { name: "Pillory", value: "pillory", denialCoefficient: 8 },

	// Metal Restraints
	{ name: "Scavenger's Daughter", value: "scavengersdaughter", tags: ["metal"], denialCoefficient: 4 },
	{ name: "Yoke", value: "yoke", tags: ["metal"], denialCoefficient: 2 },
    { name: "Handcuffs", value: "handcuffs", tags: ["metal"], denialCoefficient: 2 },
    { name: "Handcuffs (Irish-8)", value: "handcuffs_irish8", tags: ["metal"], denialCoefficient: 4 },
    { name: "Handcuffs (Hinged)", value: "handcuffs_hinged", tags: ["metal"], denialCoefficient: 4 },
	{ name: "Hardlight Cuffs (loose links)", value: "hardlight_looselink", denialCoefficient: 1.5 },
	{ name: "Hardlight Cuffs (hogtie)", value: "hardlight_hogtie", denialCoefficient: 3 },
	{ name: "Hardlight Cuffs (strict)", value: "hardlight_strict", denialCoefficient: 4.5 },

	// Rope Restraints
	{ name: "Hogtie", value: "rope_hogtie", denialCoefficient: 3 },
	{ name: "Shrimp Tie", value: "rope_shrimp", denialCoefficient: 3 },
	{ name: "Frogtie", value: "rope_frogtie", denialCoefficient: 2.5 },
	{ name: "Rope Boxtie", value: "rope_boxtie", denialCoefficient: 2 },
	{ name: "Ribbons", value: "ribbons", denialCoefficient: 1.5 },
	{ name: "Suspended Frogtie", value: "rope_suspension_frog", denialCoefficient: 3 },

	//Encasement and Wrappings
	{ name: "Bandage Wrappings", value: "bandage_wrap", denialCoefficient: 1.5 },
	{ name: "Autotape Wrapping", value: "autotape_wrap", denialCoefficient: 2 },
	//{ name: "Slime Coating", value: "encasement_slime", tags: ["slime"], denialCoefficient: 2 },               Names Needed?
	//{ name: "Solidified Rubber Coating", value: "encasement_slime", tags: ["slime"], denialCoefficient: 3 },
	{ name: "Crystalline Pillar", value: "encasement_crystal", denialCoefficient: 4 },
	{ name: "Latex Sphere", value: "sphere_latex", tags: ["latex"], denialCoefficient: 3.5 },
	{ name: "Latex Sleepsack", value: "sleepsack_latex", tags: ["latex"], denialCoefficient: 4 },
	{ name: "Duffel Bag", value: "duffel_bag", denialCoefficient: 2 },
	{ name: "Shadow Latex Ballsuit", value: "shadow_latex_ball", tags: ["latex"], denialCoefficient: 4 },
	{ name: "Magic Mirror", value: "encasement_mirror", denialCoefficient: 5 },

	// Misc Heavy Restraints
	{ name: "Lockdown Virus", value: "lockdown_virus", denialCoefficient: 4 },
	// { name: "Silk Cocoon", value: "silk_cocoon", denialCoefficient: 2 },   Removed due to Arachnophobia
	{ name: "Binding Dress", value: "dress_binding", denialCoefficient: 4.5 },
	{ name: "Blanket Burrito", value: "blanket_burrito", denialCoefficient: 2 },
	{ name: "Toasty Kotatsu", value: "kotatsu_trap", denialCoefficient: 1.5 },
	{ name: "Festive Ribbons", value: "ribbons_festive", denialCoefficient: 1.5 },
	{ name: "Wrapping Paper", value: "wrapping_paper", denialCoefficient: 2 },
	{ name: "Shadow Hands", value: "shadowhands", tags: ["living"], denialCoefficient: 1.5 },
	{ name: "Entangling Vines", value: "entangling_vines", tags: ["living"], denialCoefficient: 1.5 },
	//{ name: "Glue Spill", value: "glue_trap", denialCoefficient: 3.5 },
    { name: "Hands-off Blouse", value: "blouse_handsoff", denialCoefficient: 7.5 },
	{ name: "Bondage Exosuit", value: "exosuit_bondage", tags: ["metal"], denialCoefficient: 5 },
	{ name: "Sticky Glue", value: "stickyglue_bondage", tags: ["slime"], denialCoefficient: 5 },
	{ name: "Costumer Mimic", value: "costumer_mimic", denialCoefficient: 5 },
	{ name: "Costumer Mimic (Latex)", value: "costumer_mimic_latex", tags: ["latex"], denialCoefficient: 5 },
    { name: "Costumer Mimic (Chaos)", value: "costumer_mimic_chaos", denialCoefficient: 5 },
    { name: "Capture Sphere", value: "capture_sphere", denialCoefficient: 3 },
    { name: "Great Sphere", value: "capture_sphere_great", denialCoefficient: 5 },
    { name: "Ultra Sphere", value: "capture_sphere_ultra", denialCoefficient: 7 },
    { name: "Master Sphere", value: "capture_sphere_master", denialCoefficient: 9 },

	// Heavy Restraints with unique name functions
	{
		name: "Dominant's Lap",
		value: "dominants_lap",
		denialCoefficient: 3,
		noself: true,
		noother: false,
		namefunction: async (interaction, data) => {
			if (data.textarray != "texts_collarequip" && data.textarray != "texts_struggle") {
				return data;
			} // Only affect struggle and collarequip.
			else {
				// Typescript is going to fucking hate me for what Im about to do.
				// Guess what though? Typescript ain't my boss
				// It will *deal* with this. I'd just be putting //@ts-ignore all over this function otherwise.
				let datatoreturn = Object.assign({}, data);
				if (data.textarray == "texts_collarequip") {
					let guilduser = await interaction.guild.members.cache.get(datatoreturn.textdata.interactionuser.id);
					datatoreturn.textdata.c3 = `${guilduser.displayName}'s Lap`;
				}

				return datatoreturn;
			}
		},
	},
];

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadHeavyTypes = () => {
	process.heavytypes = heavytypes.map((item) => {
		return { name: item.name, value: item.value };
	});
};

const convertheavy = (type) => {
	let convertheavyarr;
	for (let i = 0; i < heavytypes.length; i++) {
		if (convertheavyarr == undefined) {
			convertheavyarr = {};
		}
		convertheavyarr[heavytypes[i].value] = heavytypes[i].name;
	}
	return convertheavyarr[type];
};

// Get the base heavy object by type
const getBaseHeavy = (type) => {
	return heavytypes.find((h) => h.value == type);
};

const heavyDenialCoefficient = (type) => {
	return heavytypes.find((h) => h.value == type)?.denialCoefficient;
};

const assignHeavy = (user, type, origbinder, customname) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
	let originalbinder = process.heavy[user]?.origbinder;
	process.heavy[user] = { type: customname ?? convertheavy(type), typeval: type, origbinder: originalbinder ?? origbinder };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.heavy = true;
};

const getHeavy = (user) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
	return process.heavy[user];
};

const getHeavyBinder = (user) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
	return process.heavy[user]?.origbinder;
};

const removeHeavy = (user) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] && process.heavy[user].typeval && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user].typeval]) {
        process.onremovefunctions.heavy[process.heavy[user].typeval](user);
    }
	delete process.heavy[user];
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.heavy = true;
};

exports.loadHeavyTypes = loadHeavyTypes;
exports.heavytypes = heavytypes;
exports.assignHeavy = assignHeavy;
exports.getHeavy = getHeavy;
exports.getHeavyBinder = getHeavyBinder;
exports.removeHeavy = removeHeavy;
exports.commandsheavy = heavytypes;
exports.convertheavy = convertheavy;
exports.getBaseHeavy = getBaseHeavy;
exports.heavyDenialCoefficient = heavyDenialCoefficient;
