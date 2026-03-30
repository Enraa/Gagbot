const fs = require("fs");
const path = require("path");
const https = require("https");

const heavytypes = [
	// Armbinders
	{ name: "Ancient Armbinder", value: "armbinder_ancient", tags: ["metal"], denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Latex Armbinder", value: "armbinder_latex", tags: ["latex"], denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Leather Armbinder", value: "armbinder_leather", tags: ["leather"], denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "High-Security Armbinder", value: "armbinder_secure", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Shadow Latex Armbinder", value: "armbinder_shadowlatex", tags: ["latex"], denialCoefficient: 3, heavytags: ["arms"] },
    { name: "Starry Latex Armbinder", value: "armbinder_starrylatex", tags: ["latex"], denialCoefficient: 3, heavytags: ["arms"] },
	{ name: "Crystal Armbinder", value: "armbinder_crystal", denialCoefficient: 3, heavytags: ["arms"] },
	{ name: "Black Hole Armbinder", value: "armbinder_blackhole", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Wolfbinder", value: "armbinder_wolf", denialCoefficient: 3, heavytags: ["arms"] },
	{ name: "Wolf Queenbinder", value: "armbinder_wolfqueen", tags: ["leather"], denialCoefficient: 3, heavytags: ["arms"] },
    { name: "Rigid Arm Splints", value: "splints_arm", denialCoefficient: 10, heavytags: ["arms"] },

	// Boxbinders
	{ name: "Latex Boxbinder", value: "boxbinder_latex", tags: ["latex"], denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Leather Boxbinder", value: "boxbinder_leather", tags: ["leather"], denialCoefficient: 2.5, heavytags: ["arms"] },
	{ name: "High-Security Boxbinder", value: "boxbinder_hisec", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Experimental Boxtie Binder", value: "boxbinder_experimental", denialCoefficient: 3.5, heavytags: ["arms"] },
    { name: "Shadow Latex Boxbinder", value: "boxbinder_shadowlatex", tags: ["latex"], denialCoefficient: 2, heavytags: ["arms"] },
    { name: "Starry Latex Boxbinder", value: "boxbinder_starrylatex", tags: ["latex"], denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Black Hole Boxbinder", value: "boxbinder_blackhole", denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Dragon Queen Straps", value: "boxbinder_dragon", tags: ["leather"], denialCoefficient: 2.5, heavytags: ["arms"] },

	// Straitjackets
	{ name: "Comfy Straitjacket", value: "straitjacket_comfy", denialCoefficient: 3, heavytags: ["arms"] },
	{ name: "Maid Straitjacket", value: "straitjacket_maid", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Maid Punishment Straitjacket", value: "straitjacket_maidpunishment", denialCoefficient: 4.5, heavytags: ["arms"] },
	{ name: "Doll Straitjacket", value: "straitjacket_doll", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Latex Straitjacket", value: "straitjacket_latex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms"] },
    { name: "Leather Straitjacket", value: "straitjacket_leather", tags: ["leather"], denialCoefficient: 4, heavytags: ["arms"] },
	{ name: "Shadow Latex Straitjacket", value: "straitjacket_shadowlatex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms"] },
    { name: "Starry Latex Straitjacket", value: "straitjacket_starrylatex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms"] },
	{ name: "Asylum Straitjacket", value: "straitjacket_asylum", denialCoefficient: 5, heavytags: ["arms"] },
	{ name: "Black Hole Straitjacket", value: "straitjacket_blackhole", denialCoefficient: 4.5, heavytags: ["arms"] },

    // Legbinders
    { name: "Comfy Legbinder", value: "legbinder_comfy", denialCoefficient: 2, heavytags: ["legs"] },
	{ name: "Maid Legbinder", value: "legbinder_maid", denialCoefficient: 2, heavytags: ["legs"] },
	{ name: "Maid Punishment Legbinder", value: "legbinder_maidpunishment", denialCoefficient: 2, heavytags: ["legs"] },
	{ name: "Doll Legbinder", value: "legbinder_doll", denialCoefficient: 2, heavytags: ["legs"] },
	{ name: "Latex Legbinder", value: "legbinder_latex", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Leather Legbinder", value: "legbinder_leather", tags: ["leather"], denialCoefficient: 3, heavytags: ["legs"] },
	{ name: "Shadow Latex Legbinder", value: "legbinder_shadowlatex", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Starry Latex Legbinder", value: "legbinder_starrylatex", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
	{ name: "Asylum Legbinder", value: "legbinder_asylum", denialCoefficient: 3.5, heavytags: ["legs"] },
	{ name: "Black Hole Legbinder", value: "legbinder_blackhole", denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Latex Mermaid Tail", value: "legbinder_latexmermaidtail", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Starry Latex Mermaid Tail", value: "legbinder_starrylatexmermaidtail", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Shadow Latex Mermaid Tail", value: "legbinder_shadowlatexmermaidtail", tags: ["latex"], denialCoefficient: 3, heavytags: ["legs"] },
    { name: "Rigid Leg Splints", value: "splints_leg", denialCoefficient: 3, heavytags: ["legs"] },

	// Petsuits
	{ name: "Piddlefours", value: "petsuit_piddlefours", tags: ["pet", "leather"], denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Leather Petsuit", value: "petsuit_leather", tags: ["pet", "leather"], denialCoefficient: 2.5, heavytags: ["arms", "legs"] },
	{ name: "Alchemical Petsuit", value: "petsuit_alchemical", tags: ["pet", "latex"], denialCoefficient: 2.5, heavytags: ["arms", "legs"] },
	{ name: "Autotape Petsuit", value: "petsuit_tape", tags: ["pet"], denialCoefficient: 2.5, heavytags: ["arms", "legs"] },
	{ name: "Latex Petsuit", value: "petsuit_latex", tags: ["pet", "latex"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Seamless Latex Petsuit", value: "petsuit_seamlesslatex", tags: ["pet", "latex"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Shadow Latex Petsuit", value: "petsuit_shadowlatex", tags: ["pet", "latex"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Bast Petsuit", value: "petsuit_bast", tags: ["pet"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Nevermere Punishment Suit", value: "petsuit_nevermere", tags: ["pet", "leather"], denialCoefficient: 3.5, heavytags: ["arms", "legs"] },
	{ name: "Ancient Petsuit", value: "petsuit_ancient", tags: ["pet", "metal"], denialCoefficient: 4, heavytags: ["arms", "legs"] },

	// Static Restraints
	{ name: "Display Stand", value: "displaystand", tags: ["metal"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Stocks", value: "stocks", denialCoefficient: 4, heavytags: ["arms"] },
	{ name: "One Bar Prison", value: "one_bar_prison", tags: ["metal"], denialCoefficient: 1.5, heavytags: ["legs"] },
	{ name: "Latex Encasement Stand", value: "encasementstand_latex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Wooden Horse", value: "wooden_horse", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "X-Frame", value: "x_frame", denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Dancer's Pole", value: "pole_dancer", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Latex Vacbed", value: "vacbed_latex", tags: ["latex"], denialCoefficient: 3.5, heavytags: ["arms", "legs"] },
	{ name: "Latex Vaccube", value: "vaccube_latex", tags: ["latex"], denialCoefficient: 4.5, heavytags: ["arms", "legs"] },
	{ name: "Doll Processing Facility", value: "doll_processing", denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Weighted Blanket", value: "blanket_weighted", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Pile of Cats", value: "catpile", denialCoefficient: 99, heavytags: ["arms", "legs"] }, // Are you ***really*** going to disturb the kitties to let go?
	{ name: "Giant Pile of Plushies", value: "plushie_pile", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Bed Restraints", value: "bedrestraints", denialCoefficient: 6, heavytags: ["arms", "legs"] },
	{ name: "Massage Table Binding", value: "massage_table_binding", denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Chair with Cuffs", value: "chaircuffs", denialCoefficient: 3.5, heavytags: ["arms", "legs"] },
	{ name: "Resin Coating", value: "resin_coated", denialCoefficient: 4, heavytags: ["arms", "legs"] },
    { name: "Pillory", value: "pillory", denialCoefficient: 8, heavytags: ["arms"] },

	// Metal Restraints
	{ name: "Scavenger's Daughter", value: "scavengersdaughter", tags: ["metal"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Yoke", value: "yoke", tags: ["metal"], denialCoefficient: 2, heavytags: ["arms"] },
    { name: "Handcuffs", value: "handcuffs", tags: ["metal"], denialCoefficient: 2, heavytags: ["arms"] },
    { name: "Handcuffs (Irish-8)", value: "handcuffs_irish8", tags: ["metal"], denialCoefficient: 4, heavytags: ["arms"] },
    { name: "Handcuffs (Hinged)", value: "handcuffs_hinged", tags: ["metal"], denialCoefficient: 4, heavytags: ["arms"] },
	{ name: "Hardlight Cuffs (loose links)", value: "hardlight_looselink", denialCoefficient: 1.5, heavytags: ["arms"] },
	{ name: "Hardlight Cuffs (hogtie)", value: "hardlight_hogtie", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Hardlight Cuffs (strict)", value: "hardlight_strict", denialCoefficient: 4.5, heavytags: ["arms"] },

	// Rope Restraints
	{ name: "Hogtie", value: "rope_hogtie", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Shrimp Tie", value: "rope_shrimp", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Frogtie", value: "rope_frogtie", denialCoefficient: 2.5, heavytags: ["legs"] },
	{ name: "Rope Boxtie", value: "rope_boxtie", denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Ribbons", value: "ribbons", denialCoefficient: 1.5, heavytags: ["arms"] },
	{ name: "Suspended Frogtie", value: "rope_suspension_frog", denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Rope Legtie", value: "rope_legtie", denialCoefficient: 1.5, heavytags: ["legs"] },
    { name: "Overhead Column Tie", value: "rope_overheadcolumn", denialCoefficient: 5, heavytags: ["arms"] },

	//Encasement and Wrappings
	{ name: "Bandage Wrappings", value: "bandage_wrap", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Autotape Wrapping", value: "autotape_wrap", denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Slime Coating", value: "encasement_slime", tags: ["slime"], denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Living Latex Puddle", value: "puddle_latex", tags: ["latex"], denialCoefficient: 3, heavytags: ["arms", "legs"] },               
	{ name: "Solidified Rubber Coating", value: "encasement_slime", tags: ["slime"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Crystalline Pillar", value: "encasement_crystal", denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Latex Ball", value: "sphere_latex", tags: ["latex"], denialCoefficient: 3.5, heavytags: ["arms", "legs"] },
	{ name: "Latex Sleepsack", value: "sleepsack_latex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Shadow Latex Ballsuit", value: "shadow_latex_ball", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Magic Mirror", value: "encasement_mirror", tags: ["confined", "dimensional"], denialCoefficient: 5, heavytags: ["arms", "legs"] },

	// Misc Heavy Restraints
	{ name: "Lockdown Virus", value: "lockdown_virus", denialCoefficient: 4, heavytags: ["arms", "legs"] },
	// { name: "Silk Cocoon", value: "silk_cocoon", denialCoefficient: 2 },   Removed due to Arachnophobia
	{ name: "Binding Dress", value: "dress_binding", denialCoefficient: 4.5, heavytags: ["arms"] },
	{ name: "Blanket Burrito", value: "blanket_burrito", denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Toasty Kotatsu", value: "kotatsu_trap", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Festive Ribbons", value: "ribbons_festive", denialCoefficient: 1.5, heavytags: ["arms"] },
	{ name: "Wrapping Paper", value: "wrapping_paper", denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Shadow Hands", value: "shadowhands", tags: ["living"], denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Entangling Vines", value: "entangling_vines", tags: ["living"], denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	//{ name: "Glue Spill", value: "glue_trap", denialCoefficient: 3.5 },
    { name: "Hands-off Blouse", value: "blouse_handsoff", denialCoefficient: 7.5, heavytags: ["arms"] },
	{ name: "Bondage Exosuit", value: "exosuit_bondage", tags: ["metal"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Sticky Glue", value: "stickyglue_bondage", tags: ["slime"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Costumer Mimic", value: "costumer_mimic", tags: ["confined", "latex"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Costumer Mimic (Latex)", value: "costumer_mimic_latex", tags: ["confined", "latex"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    { name: "Costumer Mimic (Chaos)", value: "costumer_mimic_chaos", tags: ["confined", "latex"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    { name: "Capture Sphere", value: "capture_sphere", tags: ["confined", "dimensional"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Love Sphere", value: "capture_sphere_love", tags: ["confined", "dimensional"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Great Sphere", value: "capture_sphere_great", tags: ["confined", "dimensional"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    { name: "Ultra Sphere", value: "capture_sphere_ultra", tags: ["confined", "dimensional"], denialCoefficient: 7, heavytags: ["arms", "legs"] },
    { name: "Master Sphere", value: "capture_sphere_master", tags: ["confined", "dimensional"], denialCoefficient: 9, heavytags: ["arms", "legs"] },

    // Containers
    { name: "Pet Cage", value: "pet_cage", tags: ["pet"], denialCoefficient: 4, heavytags: ["container"] },
    { name: "Sarcophagus", value: "sarco_mummy", tags: ["confined"], denialCoefficient: 3, heavytags: ["container"] },
    { name: "Asylum Room", value: "asylum_room", tags: ["confined"], denialCoefficient: 2, heavytags: ["container"] },
    { name: "Under-bed Cage", value: "underbed_cage", tags: ["confined"], denialCoefficient: 4, heavytags: ["container"] },
    { name: "Leashing Post", value: "leashing_post", denialCoefficient: 2.5, heavytags: ["container"] },
    { name: "Doll Storage Unit", value: "doll_storage", tags: ["confined"], denialCoefficient: 3.5, heavytags: ["container"] },
    { name: "Glass Display Case", value: "glass_display_case", tags: ["confined"], denialCoefficient: 3.5, heavytags: ["container"] },
    { name: "Mannequin Display", value: "mannequin_display", denialCoefficient: 7.5, heavytags: ["container"] },
    { name: "Glass Jar", value: "glass_jar", tags: ["confined"], denialCoefficient: 4.5, heavytags: ["container"] },
    { name: "Ballpit", value: "ballpit", denialCoefficient: 1.2, heavytags: ["container"] },
    { name: "Under the Desk", value: "underdesk", tags: ["confined"], denialCoefficient: 1.5, heavytags: ["container"] },
    { name: "Doll Case", value: "case_doll", tags: ["confined"], denialCoefficient: 4, heavytags: ["container","arms", "legs"] },
    { name: "Delivery Crate", value: "crate_delivery", tags: ["confined"], denialCoefficient: 4, heavytags: ["container","arms", "legs"] },
    { name: "Dolly", value: "dolly", tags: ["confined"], denialCoefficient: 3, heavytags: ["container","arms", "legs"] },
    { name: "Pet Carrier", value: "carrier", tags: ["pet", "confined"], denialCoefficient: 4, heavytags: ["container"] },
	{ name: "Duffel Bag", value: "duffel_bag", denialCoefficient: 2, heavytags: ["container"] },

	// Heavy Restraints with unique name functions
	{
		name: "Dominant's Lap",
		value: "dominants_lap",
		denialCoefficient: 3,
		noself: true,
		noother: false,
        heavytags: ["container"],
		namefunction: async (interaction, data) => {
			if (data.textarray != "texts_heavy" && data.textarray != "texts_struggle") {
				return data;
			} // Only affect struggle and heavy.
			else {
				// Typescript is going to fucking hate me for what Im about to do.
				// Guess what though? Typescript ain't my boss
				// It will *deal* with this. I'd just be putting //@ts-ignore all over this function otherwise.
				let datatoreturn = Object.assign({}, data);
				if (data.textarray == "texts_heavy") {
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

/********************
 * Get Heavy Restraint's name from heavyfunctions.js by ID
 * - **(string) type** retrieves the name for the heavy type.
 ********************/
const getHeavyName = (type) => {
    return heavytypes.find((h) => h.value === type)?.name
}

/**************
 * Gets the base heavy object from heavyfunctions.js by ID
 * - **(string) type** retrieves the object for the heavy type.
 **************/
const getBaseHeavy = (type) => {
	return heavytypes.find((h) => h.value === type);
};

/********************
 * Get Heavy Restraint's denial coefficient by ID
 * - **(string) type** retrieves the denial coefficient for the heavy type.
 ********************/
const heavyDenialCoefficient = (type) => {
	return heavytypes.find((h) => h.value === type)?.denialCoefficient;
};

/**************
 * Adds a heavy bondage to a user by userid. 
 * - **(user id) user** will receive the bondage
 * - **(string) type** is the heavy bondage id
 * - **(user id) origbinder** should be person tying them up
 * - **(string) customname** defaults to default heavy name
 **************/
const assignHeavy = (user, type, origbinder, customname) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] == undefined) {
        process.heavy[user] = [];
    }
    if (process.heavy[user].length > 0) {
        let existingheavy = process.heavy[user].find((h) => h.type === type)
        if (existingheavy) {
            existingheavy.origbinder = origbinder;
            existingheavy.displayname = customname ?? getHeavyName(type);
        }
        else {
            process.heavy[user].push({
                type: type,
                origbinder: origbinder,
                displayname: customname ?? getHeavyName(type)
            })
        }
    }
    else {
        process.heavy[user].push({
            type: type,
            origbinder: origbinder,
            displayname: customname ?? getHeavyName(type)
        })
    }
	//process.heavy[user] = { type: customname ?? convertheavy(type), typeval: type, origbinder: originalbinder ?? origbinder };
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.heavy = true;
};

/*************
 * Get Heavy Bondage worn by user ID. Check for falsy values to determine if they're free. Returns the most RELEVANT heavy bondage in the list (arms -> legs -> container). See getHeavyList to retrieve all of them. Specify a type to get a specific bondage the user is wearing. 
 * - **(user id) user** to retrieve bondage for
 * - **(string) type** to retrieve a specific bondage, if worn. 
 *************/
const getHeavy = (user, type) => { 
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    let returnarms;
    let returnlegs;
    let returncontainer;
    let returnedval;
    if (process.heavy[user] && (process.heavy[user].length > 0)) {
        if (!type) {
            let mapped = process.heavy[user].map((h) => getBaseHeavy(h.type))
        
            // return arms first
            mapped.forEach((h) => {
                if (h.heavytags.includes("arms")) {
                    returnarms = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            // return legs next
            mapped.forEach((h) => {
                if (h.heavytags.includes("legs")) {
                    returnlegs = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            // return container last
            mapped.forEach((h) => {
                if (h.heavytags.includes("container")) {
                    returncontainer = process.heavy[user].find((heavy) => heavy.type === h.value)
                }
            })
            if (returnarms) {
                returnedval = returnarms;
            }
            else if (returnlegs) {
                returnedval = returnlegs;
            }
            else if (returncontainer) {
                returnedval = returncontainer;
            }
        }
        else {
            returnedval = process.heavy[user].find((h) => h.type === type);
        }
    }
    return returnedval
};

/*************
 * Get Heavy Bondage worn by user ID. Returns a list (even if none). Use getHeavy to determine if they're wearing any heavy bondage at all.
 * - **(user id) user** to retrieve bondage for
 *************/
const getHeavyList = (user) => {
    if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user]) {
        return process.heavy[user];
    }
	else {
        return [];
    }
}

/************
 * Get Heavy Bondage's **origbinder**. Will retrieve the first bondage's **origbinder** if **type** is not specified. If **type** IS specified, will return undefined if the wearer is not wearing that bondage.
 * - **(user id) user** to retrieve bondage for
 * - **(string) type** to check for
 ************/
const getHeavyBinder = (user, type) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
	if (process.heavy[user] == undefined) {
        process.heavy[user] = [];
    }
    if (process.heavy[user].length > 0) {
        if (type) {
            return process.heavy[user].find((h) => h.type === type)?.origbinder
        }
        else {
            return process.heavy[user][0]?.origbinder
        }
    };
};

/*********
 * Remove Heavy Bondage from user. If **type** is not specified, will remove the first heavy bondage in the list. 
 * - **(user id) user** to remove heavy bondage for
 * - **(string) type** to remove specific heavy bondage
 *********/
const removeHeavy = (user, type) => {
	if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] && process.heavy[user].typeval && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user].typeval]) {
        process.onremovefunctions.heavy[process.heavy[user].typeval](user);
    }
    if (process.heavy[user]) {
        if (type) {
            let find = process.heavy[user].findIndex((h) => h.type === type)
            if (find > -1) {
                if (process.heavy[user][find] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user][find].type]) {
                    process.onremovefunctions.heavy[process.heavy[user][find].type](user);
                }
                process.heavy[user].splice(find,1);
            }
        }
        else {
            if (process.heavy[user][0] && process.onremovefunctions && process.onremovefunctions.heavy && process.onremovefunctions.heavy[process.heavy[user][0].type]) {
                process.onremovefunctions.heavy[process.heavy[user][0].type](user);
            }
            process.heavy[user].splice(0,1);
        }
    }
    if (process.heavy[user]?.length == 0) {
        delete process.heavy[user]
    }
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.heavy = true;
};

/*********
 * Retrieve a user's restrictions based on their current heavy bondage. 
 * - **(user id) user** to check heavy bondage for
 * 
 * Returns an object:
 * ###   heavytags: [array of tags user is wearing]
 * ###   touchself: boolean
 * ###   touchothers: boolean
 * ###   touchlist: [array of userIDs user can action on]*
 * 
 * *If **touchlist** is **undefined**, the user is NOT restricted from any particular target.
 *********/
const getHeavyRestrictions = (user) => {
    let returnobject = {
        heavytags: [],
        touchself: true,
        touchothers: true,
    }
    if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] == undefined) {
        return returnobject; // User is unbound, they can do anything. 
    }
    else {
        process.heavy[user].forEach((heavy) => {
            if (getBaseHeavy(heavy.type).heavytags.includes("arms")) {
                returnobject.heavytags.push("arms");
                returnobject.touchself = false;
                returnobject.touchothers = false;
            }
            if (getBaseHeavy(heavy.type).heavytags.includes("legs")) {
                returnobject.heavytags.push("legs");
                returnobject.touchothers = false;
            }
            if (getBaseHeavy(heavy.type).heavytags.includes("container")) {
                returnobject.heavytags.push("container");
                if (!returnobject.touchlist) {
                    returnobject.touchlist = [];
                }
                // Users in a container can ONLY do stuff to OTHERS in that same container. 
                Object.keys(process.heavy).forEach((k) => {
                    if (getHeavy(k, heavy.type)) {
                        returnobject.touchlist.push(k);
                    }
                }) 
            }
        })
        console.log(returnobject.touchlist);
        return returnobject;
    }
}

/*************
 * Return all heavytags affecting a user ID right now. 
 * - **(user id) user** to check heavy bondage for
 *************/
const getHeavyTagsOnUser = (user) => {
    if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] == undefined) {
        return []; // They're not bound by anything lol
    }
    else {
        let tags = [];
        process.heavy[user].forEach((heavy) => {
            getBaseHeavy(heavy.type).heavytags.forEach((t) => {
                tags.push(t);
            })
        })
        return tags;
    }
}

/************
 * Check if **user** can bind **target** by ID. Returns **true** if able to, **false** if not. 
 * - **(user id) user** to check heavy bondage for
 * - **(user id) target** to check if they can do anything to them
 */
const getHeavyBound = (user, target) => {
    if (process.heavy == undefined) {
		process.heavy = {};
	}
    if (process.heavy[user] == undefined) {
        return true; // No need to worry, they are able to do anything!
    }
    else {
        let bound;
        let heavyrestrictions = getHeavyRestrictions(user);
        // Check if we can touch ourself
        if (user == target) {
            return heavyrestrictions.touchself;
        }
        // Check if the target user is in the same container AND we can touch others
        else if (heavyrestrictions.touchlist) {
            if (heavyrestrictions.touchlist.includes(target) && heavyrestrictions.touchothers) {
                return true;
            }
        }
        // Check if we can touch others
        else {
            return heavyrestrictions.touchothers;
        }
    }
}

exports.loadHeavyTypes = loadHeavyTypes;
exports.heavytypes = heavytypes;
exports.assignHeavy = assignHeavy;
exports.getHeavy = getHeavy;
exports.getHeavyList = getHeavyList;
exports.getHeavyBinder = getHeavyBinder;
exports.removeHeavy = removeHeavy;
exports.commandsheavy = heavytypes;
exports.convertheavy = getHeavyName;
exports.getHeavyName = getHeavyName;
exports.getBaseHeavy = getBaseHeavy;
exports.heavyDenialCoefficient = heavyDenialCoefficient;

exports.getHeavyRestrictions = getHeavyRestrictions;
exports.getHeavyTagsOnUser = getHeavyTagsOnUser;
exports.getHeavyBound = getHeavyBound;