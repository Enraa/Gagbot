const fs = require("fs");
const path = require("path");

let wearabletypes = [
	// Aesthetic Body Parts
	{ name: "Ears", value: "ears", colorable: true, uniqueColors: ["Cat", "Futuristic Cat", "Dog", "Floppy Dog", "Wolf", "Bunny", "Floppy Bunny", "Sheep", "Elf", "Fox", "Pony"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Tail", value: "tail", colorable: true, uniqueColors: ["Cat", "Dog", "Wolf", "Bunny", "Sheep", "Demon", "Succubus", "Fox", "Pony", "Lizard", "Dragon", "Lamia"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Wings", value: "wings", colorable: true, uniqueColors: ["Demon", "Angelic", "Imp", "Succubus", "Bat", "Butterfly", "Dragonfly", "Draconic", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Horns", value: "horns", colorable: true, uniqueColors: ["Curled", "Long", "Short", "Stubby", "Draconic", "Au'Ra", "Demon", "Demonic Sheep", "Sheep", "Goat", "Crystalline"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Womb Tattoo", value: "wombtat", colorable: true, uniqueColors: ["Glowing", "Starry", "Shimmering", "Cyber"] },
	{ name: "Vine Hair", value: "hair_vine", colorable: true, uniqueColors: ["Flowery", "Verdant"] },
	{ name: "Vampire Fangs", value: "fangs_vampire" },
	{ name: "Halo", value: "halo", colorable: true, uniqueColors: ["Angelic", "Ghostly", "Ethereal", "Holy Light", "Cyber"] },

	// Hats
	{ name: "Stylish Hat", value: "stylish_hat", colorable: true },
	{ name: "Top Hat", value: "top_hat", colorable: true },
	{ name: "Fedora", value: "fedora", colorable: true },
	{ name: "Cowboy Hat", value: "cowboy_hat", colorable: true },
	{ name: "Fascinator", value: "fascinator", colorable: true },
	{ name: "Witch Hat", value: "witchhat_normal", colorable: true, uniqueColors: ["Flowery", "Ridiculously Big", "Starry"] },
	{ name: "Crown", value: "crown", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Princess", "Twilight", "Mithril", "Crystal", "Flower", "Laurel"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Tiara", value: "tiara", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Princess", "Lunar Crescent", "Sunless", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Circlet", value: "circlet", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Glasses and Goggles
	{ name: "Glasses", value: "glasses", colorable: true, uniqueColors: ["Witchy", "Round", "Starry Night", "Full Frame", "Half-Rimmed", "Open-Framed", "Moonveil"] },
	{ name: "Sunglasses", value: "sunglasses", colorable: true, uniqueColors: ["Mirrored", "Aviator", "Heart Shaped", "Kamina"] },
	{ name: "Goggles", value: "goggles", colorable: true, uniqueColors: ["Steampunk", "Alchemist", "Ski", "Lab"] },
	{ name: "Librarian's Spectacles", value: "glasses_librarian" },
	{ name: "Monocle", value: "monocle" },

	// Misc Head, Face and Hair Accessories
	{ name: "Headchain", value: "headchain", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Mithril", "Lunar Crescent", "Starveiled", "Elemental", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Veil", value: "veil", colorable: true, uniqueColors: ["Starry", "Sheer", "Silk", "Half-Face"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hood", value: "hood", colorable: true, uniqueColors: ["Leather", "Latex", "Maid", "Hardlight", "Medieval"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hairpins", value: "hairpins", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Solar", "Lunar", "Crystal", "Obsidian", "Jade", "Amethyst", "Ruby", "Emerald", "Sapphire"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hairstick", value: "hairstick" },
	{ name: "Kitsune Half-Mask", value: "mask_kitsune" },
	{ name: "Domino Mask", value: "mask_domino" },
	{ name: "Rogue Mask", value: "roguemask", colorable: true },
	{ name: "Leather Rogue Mask", value: "roguemask_leather", colorable: true },
	{ name: "Eyeshadow", value: "eyeshadow", colorable: true, uniqueColors: ["Glittery", "Metallic Silver", "Metallic Gold"] },
	{ name: "Lipstick", value: "lipstick", colorable: true, uniqueColors: ["Glossy", "Metallic Silver", "Metallic Gold"] },
	{ name: "Kissmark", value: "kissmark", colorable: true, uniqueColors: ["Glossy", "Metallic Silver", "Metallic Gold"] },

	// Bunnygirls
	{ name: "Playbunny Headband", value: "outfit_playbunny_headwear" },
	{ name: "Playbunny Cuffs", value: "outfit_playbunny_cuffs" },
	{ name: "Bunny Bustier", value: "bunnybustier", colorable: true },
	{ name: "Leather Bunny Bustier", value: "bunnybustier_leather", colorable: true },
	{ name: "Latex Bunny Bustier", value: "bunnybustier_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bunny Tights", value: "bunnytights", colorable: true },
	{ name: "Latex Bunny Tights", value: "bunnytights_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bunny Shoes", value: "bunnybustier", colorable: true },
	{ name: "Latex Bunny Shoes", value: "bunnybustier_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },

	// Ponygirls
	{ name: "Leather Pony Boots", value: "ponyboots_leather", colorable: true },
	{ name: "Leather Thigh Belts", value: "thighbelts_leather", colorable: true },
	{ name: "Leather Pony Tack", value: "ponytack_leather", colorable: true },
	{ name: "Leather Head Harness", value: "headharness_leather" },
	{ name: "Blinkers", value: "blinkers_leather", colorable: true },
	{ name: "Reins", value: "reins_leather", colorable: true },

	// Maids
	{ name: "Maid Dress", value: "maid_dress", colorable: true, uniqueColors: ["Gothic", "Victorian", "Oriental", "French", "Cyber", "Frilly"] },
	{ name: "Latex Maid Dress", value: "maiddress_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Gothic", "French", "Cyber"] },
	{ name: "Apron", value: "maid_apron", colorable: true, forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Latex Apron", value: "maidapron_latex", colorable: true, forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Maid Headdress", value: "maid_headdress" },
	{ name: "Maid Badge of Office", value: "maid_badge", colorable: true, uniqueColors: ["Brass", "Silver", "Gold"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	//Dolls and Drones
	{ name: "Drone Suit", value: "dronesuit", colorable: true },
	{ name: "Latex Drone Suit", value: "dronesuit_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Control Harness", value: "control_harness" },
	{ name: "Cyber Doll Harness", value: "cyberdoll_harness" },
	{ name: "Doll Heels", value: "doll_heels" },
	{ name: "Doll Barcode", value: "cyberdoll_barcode" },

	//Faux Bondage and Non Restrictive Gear
	{ name: "Harness", value: "harness_leather", colorable: true, uniqueColors: ["Vine", "Leather", "Latex", "Leather", "Rubber", "Shibari"] },
	{ name: "Bondage Wrist Cuffs", value: "cuffswrist_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Wrist Cuffs", value: "cuffswrist_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bondage Ankle Cuffs", value: "cuffsankle_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Ankle Cuffs", value: "cuffsankle_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bondage Thigh Cuffs", value: "cuffsthigh_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Thigh Cuffs", value: "cuffsthigh_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Cyber Doll Cuffs", value: "cuffs_cyberdoll", colorable: true },
	{ name: "Latex Legbinder", value: "legbinder_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leather Legbinder", value: "legbinder_leather", colorable: true },
	{ name: "Latex Hobble Skirt", value: "hobble_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leather Hobble Skirt", value: "hobble_leather", colorable: true },
	{ name: "Rope Karada", value: "rope_karada", colorable: true },
	{ name: "Rope Ties", value: "rope_ties", colorable: true },
	{ name: "Shock Module", value: "shock_module" },
	{ name: "Crop", value: "crop" },
	{ name: "Leather Paddle", value: "paddle_leather", colorable: true, uniqueColors: ["Studded"] },
	{ name: "Leash", value: "leash", colorable: true, uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic"] },
	{ name: "Nipple Clamps", value: "nippleclamps", colorable: true, uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic", "Crystal"] },
	{ name: "Wingbinders", value: "wingbinders", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },

	// Cosplay, Swimwear and Outfits
	{ name: "Labcoat", value: "labcoat" },
	{ name: "Outfit", value: "outfit", colorable: true, uniqueColors: ["Nurse", "Latex Nurse", "Race Queen", "Cheerleader", "Dancer"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Suit", value: "suit_outfit", colorable: true, uniqueColors: ["Infiltration", "Spy", "Playbunny", "Reverse Playbunny", "Ghillie", "Nevermere", "Nevermere Executive"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Songbird Ensemble", value: "outfit_songbird", colorable: true },
	{ name: "Fashionable Suit", value: "suit_fashionable", colorable: true },
	{ name: "Wool Suit", value: "suit_wool", colorable: true },
	{ name: "Sukumizu", value: "sukumizu", colorable: true },
	{ name: "Bikini", value: "bikini", colorable: true, uniqueColors: ["Cow Print", "Skimpy", "Frilly", "Tiger Print", "Leaf", "Dragonscale", "Chainmail", "Yellow Polka-Dot"] },
	{ name: "Latex Bikini", value: "bikini_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Cow Print"] },
	{ name: "Armour", value: "armour", colorable: true, uniqueColors: ["Steel", "Cobalt", "Dragon Scale", "Holy Knight", "Black Knight", "Chainmail", "Crystal", "Leather"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Exhibitionist", value: "exhibitionist" },
	{ name: "Empress' Robes", value: "empressnewdress" },
	{ name: "Latex Mermaid Tail", value: "mermaid_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Harem Silks", value: "haremsilks", colorable: true },
	{ name: "Magical Girl Uniform", value: "outfit_magicalgirl", colorable: true },
	{ name: "Latex Magical Girl Uniform", value: "outfit_magicalgirl_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },

	// Upper Body
	{ name: "Comfy Oversized Hoodie", value: "hoodie_oversized", colorable: true },
	{ name: "Eared Hoodie", value: "hoodie_eared", colorable: true, uniqueColors: ["Fox", "Cat", "Dog", "Wolf", "Bunny"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Turtleneck Sweater", value: "turtleneck", colorable: true },
	{ name: "Wooly Sweater", value: "sweater_wooly", colorable: true },
	{ name: "Halter Top", value: "top_halter", colorable: true },
	{ name: "Crop Top", value: "top_crop", colorable: true },
	{ name: "Leather Crop Top", value: "top_crop_leather", colorable: true },
	{ name: "Latex Crop Top", value: "top_crop_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Tube Top", value: "top_tube", colorable: true, uniqueColors: ["Latex"] },
	{ name: "Bandeau", value: "bandeau", colorable: true },
	{ name: "Floaty Silk Top", value: "top_floatysilk", colorable: true },
	{ name: "Mesh Top", value: "top_mesh", colorable: true },
	{ name: "Lycra Top", value: "top_lycra", colorable: true },
	{ name: "Checked Shirt", value: "shirt_checked", colorable: true },
	{ name: "Button-up Blouse", value: "buttonup_blouse", colorable: true, uniqueColors: ["Witchy", "Latex"] },
	{ name: "Comfortable Jacket", value: "jacket_comfortable", colorable: true, uniqueColors: ["Leather", "Bomber", "Double-breasted"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "T-shirt", value: "tshirt", colorable: true, uniqueColors: ["Goth Metal", "Plain", "Black", "Alternative", "Grey", "Simple", "Striped"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Lower Body
	{ name: "Pleated Skirt", value: "pleated_skirt", colorable: true, uniqueColors: ["Latex", "Witchy", "Gothic", "Starry", "Shadow"] },
	{ name: "Miniskirt", value: "mini_skirt", colorable: true, uniqueColors: ["Latex", "Witchy", "Gothic", "Cheerleader"] },
	{ name: "Pencil Skirt", value: "pencil_skirt", colorable: true, uniqueColors: ["Latex", "Witchy", "Gothic", "Cheerleader"] },
	{ name: "Skirt", value: "skirt", colorable: true },
	{ name: "Pareo", value: "pareo", colorable: true },
	{ name: "Leather Skirt", value: "skirt_leather", colorable: true },
	{ name: "Latex Skirt", value: "skirt_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Suit Pants", value: "pants", colorable: true },
	{ name: "Leather Pants", value: "pants_leather", colorable: true },
	{ name: "Latex Pants", value: "pants_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Shorts", value: "shorts", colorable: true },
	{ name: "Lycra Shorts", value: "shorts_lycra", colorable: true },
	{ name: "Denim Shorts", value: "shorts_denim", colorable: true },
	{ name: "Booty Shorts", value: "bootyshorts", colorable: true },
	{ name: "Leather Booty Shorts", value: "bootyshorts_leather", colorable: true },
	{ name: "Latex Booty Shorts", value: "bootyshorts_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Leapord Print"] },

	// Dresses
	{ name: "Leather Dress", value: "dress_leather", colorable: true },
	{ name: "Latex Dress", value: "dress_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Witchy"] },
	{ name: "Frilled Dress", value: "frilled_dress", colorable: true },
	{ name: "Strapless Dress", value: "strapless_dress", colorable: true },
	{ name: "Halter Dress", value: "halter_dress", colorable: true },
	{ name: "Skimpy Dress", value: "skimpy_dress", colorable: true },
	{ name: "Salsa Dress", value: "salsa_dress", colorable: true },
	{ name: "Little Black Dress", value: "littleblack_dress", colorable: false },
	{ name: "Flowy Dress", value: "flowy_dress", colorable: true, uniqueColors: ["Gothic", "Floral"] },
	{ name: "Latex Flowy Dress", value: "flowy_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Evening Dress", value: "evening_dress", colorable: true, uniqueColors: ["Gothic", "Golden", "Silver"] },
	{ name: "Latex Evening Dress", value: "evening_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Sequin Dress", value: "evening_dress", colorable: true, uniqueColors: ["Golden", "Silver"] },
	{ name: "Ballgown", value: "ballgown", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Princess Dress", value: "princess_dress", colorable: true, uniqueColors: ["Gothic", "Sheep"] },
	{ name: "Sundress", value: "sun_dress", colorable: true },
	{ name: "Kimono", value: "kimono", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Latex Kimono", value: "kimono_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Yukata", value: "yukata", colorable: true, uniqueColors: ["Gothic", "Floral"] },
	{ name: "Latex Yukata", value: "yukata_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Minidress", value: "mini_dress", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Latex Minidress", value: "mini_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Chinese Dress", value: "chinese_dress", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Latex Chinese Dress", value: "chinese_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Shrine Maiden's Robe", value: "shrine_maiden", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Latex Shrine Maiden's Robe", value: "shrine_maiden_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Binding Dress", value: "binding_dress", colorable: true, uniqueColors: ["Latex", "Leather"] },
	{ name: "Sweater Dress", value: "sweater_dress", colorable: true },
	{ name: "Backless Sweater Dress", value: "sweater_dress_backless", colorable: true },
	{ name: "Oversized T-shirt", value: "tshirt_oversized", colorable: true },

	// Underwear and Sleepwear
	{ name: "Leather Bra", value: "bra_leather", colorable: true },
	{ name: "Latex Bra", value: "bra_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lacy Bra", value: "bra_lacy", colorable: true },
	{ name: "Strapless Bra", value: "bra_strapless", colorable: true },
	{ name: "Leather Panties", value: "panties_leather", colorable: true },
	{ name: "Panties", value: "panties", colorable: true },
	{ name: "Latex Panties", value: "panties_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lacy Panties", value: "panties_lacy", colorable: true },
	{ name: "Side Tie Panties", value: "panties_sidetie", colorable: true },
	{ name: "Lingerie", value: "lingerie", colorable: true },
	{ name: "Royal Icing Lingerie", value: "lingerie_royalicing", colorable: false },
	{ name: "Nightie", value: "nightie", colorable: true },
	{ name: "Sheer Nightie", value: "nightie_sheer", colorable: true },
	{ name: "Lacy Nightie", value: "nightie_lacy", colorable: true },
	{ name: "Silk Nightdress", value: "nightdress_silk", colorable: true },
	{ name: "Silk Robe", value: "silk_robe", colorable: true },
	{ name: "Waist Cincher", value: "waistcincher", colorable: true },
	{ name: "Latex Waist Cincher", value: "waistcincher_latex", colorable: true },
	{ name: "Nipple Pasties", value: "nipple_pasties", colorable: true },
	{ name: "Stockings", value: "stockings", colorable: true, uniqueColors: ["Checked"] },
	{ name: "Pantyhose", value: "pantyhose", colorable: true },
	{ name: "Latex Stockings", value: "stockings_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Latex Pantyhose", value: "pantyhose_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Fishnets", value: "fishnets", colorable: true },
	{ name: "Tights", value: "tights", colorable: true },
	{ name: "Stirrup Leggings", value: "leggings_stirrup", colorable: true },
	{ name: "Garters", value: "garters", colorable: true },
	{ name: "Latex Garters", value: "garters_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Garter Belt", value: "gartersbelt", colorable: true },
	{ name: "Latex Garter Belt", value: "gartersbelt_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lace Thigh Band", value: "thighband_lace", colorable: true },
	{ name: "Leather Thigh Band", value: "thighband_leather", colorable: true },
	{ name: "Latex Thigh Band", value: "thighband_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Thighhighs", value: "thighhighs", colorable: true },
	{ name: "Latex Thighhighs", value: "thighhighs_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Cowprint"] },
	{ name: "Striped Socks", value: "stripedsocks", colorable: true },
	{ name: "Bodystocking", value: "bodystocking", colorable: true },
	{ name: "Leather Catsuit", value: "catsuit_leather", colorable: true },
	{ name: "Latex Catsuit", value: "catsuit_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leotard", value: "leotard", colorable: true },
	{ name: "Latex Leotard", value: "leotard_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "High Waist Leotard", value: "leotard_highwaist", colorable: true },
	{ name: "Latex High Waist Leotard", value: "leotard_highwaist_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },

	// Footwear
	{ name: "High Heels", value: "highheels", colorable: true, uniqueColors: ["Ruby", "Glass"] },
	{ name: "Latex High Heels", value: "highheels_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Ballet Heels", value: "balletheels", colorable: true },
	{ name: "Latex Ballet Heels", value: "balletheels_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Ballet Shoes", value: "ballet_shoes", colorable: true },
	{ name: "Sandals", value: "sandals", colorable: true },
	{ name: "Strappy Sandals", value: "sandals_strappy", colorable: true },
	{ name: "Toenail Polish", value: "polish_toenails", colorable: true, uniqueColors: ["Iridescent", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
	{ name: "Ankle Boots", value: "ankleboots", colorable: true },
	{ name: "Cowboy Boots", value: "cowboyboots", colorable: true },
	{ name: "Knee High Boots", value: "kneehighboots", colorable: true },
	{ name: "Thigh High Boots", value: "thighhighboots", colorable: true },
	{ name: "Latex Thigh High Boots", value: "thighhighboots_latex", colorable: true },
	{ name: "Platform Heels", value: "platformheels", colorable: true },
	{ name: "Pumps", value: "pumps", colorable: true },
	{ name: "Anklets", value: "anklets", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Greaves", value: "greaves", colorable: true, uniqueColors: ["Steel", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Gloves and Armwear
	{ name: "Opera Gloves", value: "gloves_opera", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Leather Opera Gloves", value: "gloves_opera_leather", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Latex Opera Gloves", value: "gloves_opera_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Leather Gloves", value: "gloves_leather", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Fishnet Gloves", value: "gloves_fishnet", colorable: true },
	{ name: "Wooly Mittens", value: "wooly_mitts", colorable: true },
	{ name: "Fingerless Gloves", value: "gloves_fingerless", colorable: true },
	{ name: "Fingerless Elbow Gloves", value: "gloves_fingerlesselbow", colorable: true },
	{ name: "Latex Gloves", value: "gloves_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Cowprint"] },
	{ name: "Detached Sleeves", value: "sleeves_detatched", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Detached Latex Sleeves", value: "sleeves_detached_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Long Detached Sleeves", value: "sleeves_longdetatched", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Long Detached Latex Sleeves", value: "sleeves_longdetached_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Fingernail Polish", value: "polish_fingernails", colorable: true, uniqueColors: ["Iridescent", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
	{ name: "Wristcuff", value: "wristcuff", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Bracelets", value: "bracelets", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black", "Starmetal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Armbands", value: "armbands", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black", "Starmetal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Gauntlets", value: "gauntlet", colorable: true, uniqueColors: ["Steel", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	//Misc Accessories
	{ name: "Backpack", value: "backpack" },
	{ name: "Nametag", value: "nametag" },
	{ name: "Big Cute Ribbon", value: "bigcute_ribbon", colorable: true },
	{ name: "Feather Boa", value: "feather_boa", colorable: true },
	{ name: "Bridal Wristlets", value: "wristlets_bridal", colorable: true, uniqueColors: ["Gothic"] },
	{ name: "Choker", value: "choker", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Tattoo"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Leather Choker", value: "choker_leather", colorable: true },
	{ name: "Cloak", value: "cloak", colorable: true, uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded", "Elven"] },
	{ name: "Latex Cloak", value: "cloak_latex", colorable: true, uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded"] },
	{ name: "Fluffy Scarf", value: "scarf_fluffy", colorable: true },
	{ name: "Cozy Blanket", value: "blanket_cozy", colorable: true },
	{ name: "Silk Scarf", value: "scarf_silk", colorable: true },
	{ name: "Necklace", value: "necklace", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Bowtie", value: "bowtie", colorable: true },
	{ name: "Tie", value: "tie", colorable: true },
	{ name: "Hoshi no Tama", value: "tama" },
	{ name: "Silk Belt", value: "belt_silk", colorable: true },
	{ name: "Leather Belt", value: "belt_leather", colorable: true },
	{ name: "Leather Bandolier", value: "bandolier_leather" },
	{ name: "", value: "tome", colorable: true, uniqueColors: ["Tome of Bondage", "Cursed Tome", "Shadowy Tome", "Chained Tome", "Gothic Tome", "Angelic Tome"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "", value: "staff", colorable: true, uniqueColors: ["Staff of Chains", "Caduceus", "Elemental Staff", "Lunar Staff", "Dollmaker's Staff", "Quarterstaff", "Gohei"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
];

// Each colorable entry above will have a copy of the following added
// Unless it is excluded on forbiddenColors.
const colors = ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"];

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadWearables = () => {
	// Copy the array so we dont mutate the original lmao
	let wearablestoadd = wearabletypes.slice(0);
	// Iterate over each wearable type, filtering only the ones that are colorable.
	let colorables = wearabletypes.filter((w) => w.colorable);

	// Now for each colorable, add an instance of each color to the list.
	colorables.forEach((w) => {
		let uniqueColors = w.uniqueColors ?? [];
		// Filter out any forbidden colors, if specified;
		let colorss = colors.slice(0);
		if (w.forbiddenColors) {
			colorss = colorss.filter((c) => !w.forbiddenColors.includes(c));
		}
		// Add all the colors and their unique forms
		let colorstoadd = colorss.concat(...uniqueColors);
		// Now for each color, push to the array.
		colorstoadd.forEach((c) => {
			let newobject = Object.assign({}, w);
			newobject.name = `${c} ${w.name}`;
			newobject.value = `${w.value}_${c.toLowerCase()}`;
			wearablestoadd.push(newobject);
		});
	});

	let outarr = wearablestoadd.map((item) => {
		return { name: item.name, value: item.value };
	});
	// Since I have zero clue how to prevent the duplicates,
	// the code feels solid and doesnt seem to have any obvious bugs.
	// I'm just gonna dedupe them before committing them. This is a dumb workaround.
	let outmap = new Map();
	for (const i of outarr) {
		outmap.set(i.value, i);
	}
	process.wearableslist = Array.from(outmap.values());
	console.log(`Wearables list is ${process.wearableslist.length} entries long.`);
};

const assignWearable = (userID, wearable) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[userID]) {
		process.wearable[userID].wornwearable.push(wearable);
	} else {
		process.wearable[userID] = { wornwearable: [wearable] };
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.wearable = true;
};

const getWearable = (userID) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	return process.wearable[userID]?.wornwearable ? process.wearable[userID]?.wornwearable : [];
};

const getLockedWearable = (userID) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	return process.wearable[userID]?.locked ? process.wearable[userID]?.locked : [];
};

const addLockedWearable = (userID, wearable) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[userID]) {
		if (process.wearable[userID].locked == undefined) {
			process.wearable[userID].locked = [wearable];
		} else {
			process.wearable[userID].locked.push(wearable);
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.wearable = true;
};

const removeLockedWearable = (userID, wearable) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (process.wearable[userID]) {
		if (process.wearable[userID].locked == undefined) {
			return;
		} else {
			if (process.wearable[userID].locked.includes(wearable)) {
				process.wearable[userID].locked.splice(process.wearable[userID].locked.indexOf(wearable), 1);
			}
			if (process.wearable[userID].locked.length == 0) {
				delete process.wearable[userID].locked;
			}
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.wearable = true;
};

const deleteWearable = (userID, wearable) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	if (!process.wearable[userID]) {
		return false;
	}
	if (wearable && process.wearable[userID].wornwearable.includes(wearable) && !getLockedWearable(userID).includes(wearable)) {
		process.wearable[userID].wornwearable.splice(process.wearable[userID].wornwearable.indexOf(wearable), 1);
		if (process.wearable[userID].wornwearable.length == 0) {
			delete process.wearable[userID];
		}
	} else if (process.wearable[userID]) {
		let locks = getLockedWearable(userID);
		let savedheadgear = [];
		process.wearable[userID].wornwearable.forEach((g) => {
			if (locks.includes(g)) {
				savedheadgear.push(g);
			}
		});
		process.wearable[userID].wornwearable = savedheadgear;
		if (process.wearable[userID].wornwearable.length == 0) {
			delete process.wearable[userID];
		}
	}
	if (process.readytosave == undefined) {
		process.readytosave = {};
	}
	process.readytosave.wearable = true;
};

const getWearableName = (userID, wearablename) => {
	if (process.wearable == undefined) {
		process.wearable = {};
	}
	let convertmittenarr = {};
	for (let i = 0; i < process.wearableslist.length; i++) {
		convertmittenarr[process.wearableslist[i].value] = process.wearableslist[i].name;
	}
	if (wearablename) {
		return convertmittenarr[wearablename];
	} else {
		return undefined;
	}
};

exports.wearabletypes = wearabletypes;
exports.loadWearables = loadWearables;
exports.wearablecolors = colors;

exports.assignWearable = assignWearable;
exports.getWearable = getWearable;
exports.deleteWearable = deleteWearable;
exports.getWearableName = getWearableName;

exports.addLockedWearable = addLockedWearable;
exports.getLockedWearable = getLockedWearable;
exports.removeLockedWearable = removeLockedWearable;
