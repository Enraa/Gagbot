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
    { name: "Reverse-Prayer Binder", value: "armbinder_reversepray", denialCoefficient: 4.5, heavytags: ["arms"] },
    { name: "Rigid Arm Splints", value: "splints_arm", denialCoefficient: 10, heavytags: ["arms"] },
    { name: "Latex Reverse-Prayer Glove", value: "armbinder_reverseprayerlatex", denialCoefficient: 10, heavytags: ["arms"], tags: ["latex"] },
    { name: "Leather Reverse-Prayer Glove", value: "armbinder_reverseprayerleather", denialCoefficient: 10, heavytags: ["arms"], tags: ["leather"] },

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
    { name: "Leather Monoboot", value: "monoboot_leather", denialCoefficient: 2.5, heavytags: ["legs"], tags: ["leather"] },
    { name: "Latex Monoboot", value: "monoboot_latex", denialCoefficient: 2.5, heavytags: ["legs"], tags: ["latex"] },

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
	{ name: "Stocks", value: "stocks", denialCoefficient: 4, heavytags: ["legs"] },
	{ name: "One Bar Prison", value: "one_bar_prison", tags: ["metal"], denialCoefficient: 1.5, heavytags: ["legs"] },
	{ name: "Latex Encasement Stand", value: "encasementstand_latex", tags: ["latex"], denialCoefficient: 4, heavytags: ["arms", "legs"] },
	{ name: "Wooden Horse", value: "wooden_horse", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "X-Frame", value: "x_frame", denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Latex Vacbed", value: "vacbed_latex", tags: ["latex"], denialCoefficient: 3.5, heavytags: ["arms", "legs"] },
	{ name: "Latex Vaccube", value: "vaccube_latex", tags: ["latex"], denialCoefficient: 4.5, heavytags: ["arms", "legs"] },
	{ name: "Doll Processing Facility", value: "doll_processing", denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Weighted Blanket", value: "blanket_weighted", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Pile of Cats", value: "catpile", denialCoefficient: 99, heavytags: ["arms", "legs"] }, // Are you ***really*** going to disturb the kitties to let go?
    { name: "Cat in Lap", value: "catlap", denialCoefficient: 99, heavytags: ["legs" ]}, // Soft kitty, warm kitty, little ball of fur...
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
	{ name: "Hardlight Fetters", value: "hardlight_fetters", denialCoefficient: 1.5, heavytags: ["legs"] },
	{ name: "Hardlight Cuffs (strict)", value: "hardlight_strict", denialCoefficient: 4.5, heavytags: ["arms"] },
    { name: "Spreader Bar (Legs)", value: "spreaderbar_legs", denialCoefficient: 2.0, heavytags: ["legs"] },
    { name: "Spreader Bar (Arms)", value: "spreaderbar_arms", denialCoefficient: 5.0, heavytags: ["arms"] },
    { name: "Ankle Chains", value: "anklechains", denialCoefficient: 1.5, heavytags: ["legs"] },

	// Rope Restraints
	{ name: "Hogtie", value: "rope_hogtie", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Shrimp Tie", value: "rope_shrimp", denialCoefficient: 3, heavytags: ["arms", "legs"] },
	{ name: "Frogtie", value: "rope_frogtie", denialCoefficient: 2.5, heavytags: ["legs"] },
	{ name: "Hobble", value: "rope_hobble", denialCoefficient: 1.5, heavytags: ["legs"] },
	{ name: "Rope Boxtie", value: "rope_boxtie", denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Rope Armbinder", value: "rope_armbinder", denialCoefficient: 2, heavytags: ["arms"] },
	{ name: "Reverse Prayer Tie", value: "rope_reversepray", denialCoefficient: 3.5, heavytags: ["arms"] },
	{ name: "Strappado", value: "rope_strappado", denialCoefficient: 5, heavytags: ["arms"] },
	{ name: "Ribbons", value: "ribbons", denialCoefficient: 1.5, heavytags: ["arms"] },
	{ name: "Suspended Frogtie", value: "rope_suspension_frog", denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Rope Legtie", value: "rope_legtie", denialCoefficient: 2, heavytags: ["legs"] },
    { name: "Rope Hobble", value: "rope_hobble", denialCoefficient: 1.5, heavytags: ["legs"] },
    { name: "Overhead Column Tie", value: "rope_overheadcolumn", denialCoefficient: 5, heavytags: ["arms"] },

	//Encasement and Wrappings
	{ name: "Bandage Wrappings", value: "bandage_wrap", denialCoefficient: 1.5, heavytags: ["arms", "legs"] },
	{ name: "Autotape Wrapping", value: "autotape_wrap", denialCoefficient: 2, heavytags: ["arms", "legs"] },
	{ name: "Tape Mummification", value: "fulltape_wrap", denialCoefficient: 2, heavytags: ["arms", "legs"] },
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
	{ name: "Fiddle", value: "fiddle", denialCoefficient: 3, heavytags: ["arms"] },
    { name: "Bondage Exosuit", value: "exosuit_bondage", tags: ["metal"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
	{ name: "Sticky Glue", value: "stickyglue_bondage", tags: ["slime"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    { name: "Dolly", value: "dolly", tags: ["metal"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Capture Sphere", value: "capture_sphere", tags: ["confined", "dimensional"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Love Sphere", value: "capture_sphere_love", tags: ["confined", "dimensional"], denialCoefficient: 3, heavytags: ["arms", "legs"] },
    { name: "Great Sphere", value: "capture_sphere_great", tags: ["confined", "dimensional"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    { name: "Ultra Sphere", value: "capture_sphere_ultra", tags: ["confined", "dimensional"], denialCoefficient: 7, heavytags: ["arms", "legs"] },
    { name: "Master Sphere", value: "capture_sphere_master", tags: ["confined", "dimensional"], denialCoefficient: 9, heavytags: ["arms", "legs"] },
    { name: "Portal Cuffs (Arms)", value: "portalcuffs_arms", tags: ["dimensional"], denialCoefficient: 10, heavytags: ["arms"] },
    { name: "Portal Cuffs (Legs)", value: "portalcuffs_legs", tags: ["dimensional"], denialCoefficient: 1.5, heavytags: ["legs"] },
    { name: "Arcane Bindings (Upper Arms)", value: "arcanebinding_armsupper", tags: ["magic"], denialCoefficient: 10, heavytags: ["arms"] },
    { name: "Arcane Bindings (Lower Arms)", value: "arcanebinding_armslower", tags: ["magic"], denialCoefficient: 10, heavytags: ["arms"] },
    { name: "Arcane Bindings (Upper Legs)", value: "arcanebinding_legsupper", tags: ["magic"], denialCoefficient: 10, heavytags: ["legs"] },
    { name: "Arcane Bindings (Lower Legs)", value: "arcanebinding_legslower", tags: ["magic"], denialCoefficient: 10, heavytags: ["legs"] },
    { name: "Wind-up Clockwork Key", value: "windupclockwork", tags: [], denialCoefficient: 1, heavytags: ["arms"] },

    // Containers
    { name: "Pet Cage", value: "pet_cage", tags: ["pet"], denialCoefficient: 4, heavytags: ["container"] },
    { name: "Sarcophagus", value: "sarco_mummy", tags: ["confined"], denialCoefficient: 3, heavytags: ["container"] },
    { name: "Asylum Room", value: "asylum_room", tags: ["confined"], denialCoefficient: 2, heavytags: ["container"] },
    { name: "Under-bed Cage", value: "underbed_cage", tags: ["confined"], denialCoefficient: 4, heavytags: ["container"] },
    { name: "Leashing Post", value: "leashing_post", denialCoefficient: 2.5, heavytags: ["container"] },
    { name: "Doll Storage Unit", value: "doll_storage", tags: ["confined"], denialCoefficient: 3.5, heavytags: ["container"] },
    { name: "Glass Display Case", value: "glass_display_case", tags: ["confined"], denialCoefficient: 3.5, heavytags: ["container"] },
    { name: "Mermaid Tank", value: "mermaid_tank", tags: ["confined"], denialCoefficient: 3.5, heavytags: ["container"] },
    { name: "Mannequin Display", value: "mannequin_display", denialCoefficient: 7.5, heavytags: ["container"] },
    { name: "Glass Jar", value: "glass_jar", tags: ["confined"], denialCoefficient: 4.5, heavytags: ["container"] },
    { name: "Ballpit", value: "ballpit", denialCoefficient: 1.2, heavytags: ["container"] },
    { name: "Under the Desk", value: "underdesk", tags: ["confined"], denialCoefficient: 1.5, heavytags: ["container"] },
	{ name: "Dancer's Pole", value: "pole_dancer", denialCoefficient: 1.5, heavytags: ["container"] },
    { name: "Doll Case", value: "case_doll", tags: ["confined"], denialCoefficient: 4, heavytags: ["container", "arms", "legs"] },
    { name: "Delivery Crate", value: "crate_delivery", tags: ["confined"], denialCoefficient: 4, heavytags: ["container", "arms", "legs"] },
    { name: "Pet Carrier", value: "petcarrier", tags: ["pet", "confined"], denialCoefficient: 4, heavytags: ["container"] },
	{ name: "Duffel Bag", value: "duffel_bag", tags: ["confined"], denialCoefficient: 2, heavytags: ["container"] },
    { name: "Magic Binding Circle", value: "bindingcircle", tags: ["magic"], denialCoefficient: 1, heavytags: ["container"] },
    { name: "Cuddle Puddle", value: "cuddlepuddle", denialCoefficient: 0.5, heavytags: ["container"] }, // Yes, cuddlepuddle makes it EASIER

    // Dress Protocols (heavy bondage that equips other heavy bondage)
    { name: "Costumer Mimic", value: "costumer_mimic", tags: ["confined", "dressprotocol"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
	//{ name: "Costumer Mimic (Latex)", value: "costumer_mimic_latex", tags: ["confined", "latex"], denialCoefficient: 5, heavytags: ["arms", "legs"] },
    //{ name: "Costumer Mimic (Chaos) BROKEN", value: "costumer_mimic_chaos", tags: ["confined", "latex"], denialCoefficient: 5, heavytags: ["arms", "legs"], noself: true, noother: true }, // Currently MASSIVELY broken!
    { name: "Wardrobe Device", value: "wardrobe_device", tags: ["confined", "dressprotocol"], denialCoefficient: 5, heavytags: ["arms", "legs"] },

    // Heavy Bondage that is NOT binding, such as chairs. 
    // These can be added as a heavy, but will NOT impede the wearer in any way. 
    { name: "Royal Chair", value: "furniture_chair_royal", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Comfy Leather Couch", value: "furniture_couch_leather", tags: ["leather"], denialCoefficient: 1, heavytags: [] },
    { name: "Comfy Latex Couch", value: "furniture_couch_latex", tags: ["latex"], denialCoefficient: 1, heavytags: [] },
    { name: "Comfy Couch", value: "furniture_couch", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Bed with Silk Sheets", value: "furniture_bed_silk", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Bed", value: "furniture_bed", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Comfortable Blanket Throw", value: "furniture_blanket", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Footstool", value: "furniture_footstool", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Rocking Chair", value: "furniture_chair_rocking", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Royal Seneschal's Throne", value: "furniture_throne_seneschal", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Royal Princess's Throne", value: "furniture_throne_princess", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Seat of the Queen", value: "furniture_throne_queen", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Seat of the King", value: "furniture_throne_king", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Moonlit Altar", value: "furniture_altar_moonlit", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Suncrested Seat", value: "furniture_throne_sun", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Wooden Chair", value: "furniture_chair_wooden", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Metal Chair", value: "furniture_chair_metal", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Computer Chair", value: "furniture_chair_computer", tags: [], denialCoefficient: 1, heavytags: [] },
    { name: "Table", value: "furniture_table", tags: [], denialCoefficient: 1, heavytags: [] },

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
    {
		name: "Slimegirl's Engulfing Slime",
		value: "engulfing_slime",
		denialCoefficient: 3,
		noself: true,
		noother: false,
        tags: ["slime", "living"],
        heavytags: ["container", "arms", "legs"],
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
					datatoreturn.textdata.c3 = `Engulfed by ${guilduser.displayName}`;
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

exports.loadHeavyTypes = loadHeavyTypes;
exports.heavytypes = heavytypes;
exports.commandsheavy = heavytypes;