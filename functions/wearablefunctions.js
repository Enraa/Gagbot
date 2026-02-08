const fs = require("fs");
const path = require("path");

let wearabletypes = [
	// Aesthetic Body Parts
	{ name: "Ears", value: "ears", category: "Body Part", colorable: true, uniqueColors: ["Cat", "Futuristic Cat", "Dog", "Floppy Dog", "Wolf", "Bunny", "Floppy Bunny", "Sheep", "Elf", "Fox", "Pony"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Tail", value: "tail", category: "Body Part", colorable: true, uniqueColors: ["Cat", "Dog", "Wolf", "Bunny", "Sheep", "Demon", "Succubus", "Fox", "Pony", "Lizard", "Dragon", "Lamia"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Eared Headband", value: "earheadband", category: "Body Part", colorable: true, uniqueColors: ["Cat", "Futuristic Cat", "Dog", "Floppy Dog", "Wolf", "Bunny", "Floppy Bunny", "Sheep", "Elf", "Fox", "Pony"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Wings", value: "wings", category: "Body Part", colorable: true, uniqueColors: ["Demon", "Angelic", "Imp", "Succubus", "Bat", "Butterfly", "Dragonfly", "Draconic", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Horns", value: "horns", category: "Body Part", colorable: true, uniqueColors: ["Curled", "Long", "Short", "Stubby", "Draconic", "Au'Ra", "Demon", "Demonic Sheep", "Sheep", "Goat", "Crystalline"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Horned Headband", value: "hornheadband", category: "Body Part", colorable: true, uniqueColors: ["Curled", "Long", "Short", "Stubby", "Draconic", "Au'Ra", "Demon", "Demonic Sheep", "Sheep", "Goat", "Crystalline"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Womb Tattoo", value: "wombtat", category: "Body Part", colorable: true, uniqueColors: ["Glowing", "Starry", "Shimmering", "Cyber"] },
	{ name: "Vine Hair", value: "hair_vine", category: "Body Part", colorable: true, uniqueColors: ["Flowery", "Verdant"] },
	{ name: "Vampire Fangs", value: "fangs_vampire", category: "Body Part" },
	{ name: "Halo", value: "halo", category: "Body Part", colorable: true, uniqueColors: ["Angelic", "Ghostly", "Ethereal", "Holy Light", "Cyber"] },

	// Hats
	{ name: "Stylish Hat", value: "stylish_hat", category: "Hat", colorable: true },
	{ name: "Top Hat", value: "top_hat", category: "Hat", colorable: true },
	{ name: "Fedora", value: "fedora", category: "Hat", colorable: true },
	{ name: "Cowboy Hat", value: "cowboy_hat", category: "Hat", colorable: true },
	{ name: "Fascinator", value: "fascinator", category: "Hat", colorable: true },
	{ name: "Witch Hat", value: "witchhat_normal", category: "Hat", colorable: true, uniqueColors: ["Flowery", "Ridiculously Big", "Starry"] },
	{ name: "Crown", value: "crown", category: "Hat", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Princess", "Twilight", "Mithril", "Crystal", "Flower", "Laurel"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Tiara", value: "tiara", category: "Hat", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Princess", "Lunar Crescent", "Sunless", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Circlet", value: "circlet", category: "Hat", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Glasses and Goggles
	{ name: "Glasses", value: "glasses", category: "Glasses", colorable: true, uniqueColors: ["Witchy", "Round", "Starry Night", "Full Frame", "Half-Rimmed", "Open-Framed", "Moonveil"] },
	{ name: "Sunglasses", value: "sunglasses", category: "Glasses", colorable: true, uniqueColors: ["Mirrored", "Aviator", "Heart Shaped", "Kamina"] },
	{ name: "Goggles", value: "goggles", category: "Glasses", colorable: true, uniqueColors: ["Steampunk", "Alchemist", "Ski", "Lab"] },
	{ name: "Librarian's Spectacles", value: "glasses_librarian", category: "Glasses", },
	{ name: "Monocle", value: "monocle", category: "Glasses", },

	// Misc Head, Face and Hair Accessories
	{ name: "Headchain", value: "headchain", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Mithril", "Lunar Crescent", "Starveiled", "Elemental", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Veil", value: "veil", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Starry", "Sheer", "Silk", "Half-Face"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hood", value: "hood", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Leather", "Latex", "Maid", "Hardlight", "Medieval"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hairpins", value: "hairpins", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Solar", "Lunar", "Crystal", "Obsidian", "Jade", "Amethyst", "Ruby", "Emerald", "Sapphire"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Hairstick", value: "hairstick", category: "Head/Hair Accessories" },
	{ name: "Kitsune Half-Mask", value: "mask_kitsune", category: "Head/Hair Accessories" },
	{ name: "Domino Mask", value: "mask_domino", category: "Head/Hair Accessories" },
	{ name: "Rogue Mask", value: "roguemask", category: "Head/Hair Accessories", colorable: true },
	{ name: "Leather Rogue Mask", value: "roguemask_leather", category: "Head/Hair Accessories", colorable: true },
	{ name: "Eyeshadow", value: "eyeshadow", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Glittery", "Metallic Silver", "Metallic Gold"] },
	{ name: "Lipstick", value: "lipstick", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Glossy", "Metallic Silver", "Metallic Gold"] },
	{ name: "Kissmark", value: "kissmark", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Glossy", "Metallic Silver", "Metallic Gold"] },
    { name: "Eyeliner", value: "eyeliner", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Glittery", "Metallic Silver", "Metallic Gold"] },
    { name: "Foundation", value: "foundation", category: "Head/Hair Accessories", colorable: true},
    { name: "Cateye Eyeliner", value: "eyeliner_cateye", category: "Head/Hair Accessories", colorable: true, uniqueColors: ["Glittery", "Metallic Silver", "Metallic Gold"] },
    { name: "Mascara", value: "mascara", category: "Head/Hair Accessories"},
    { name: "Blush", value: "makeupblush", category: "Head/Hair Accessories", colorable: true },

	// Bunnygirls
	{ name: "Playbunny Headband", value: "outfit_playbunny_headwear", category: "Cosplay",  },
	{ name: "Playbunny Cuffs", value: "outfit_playbunny_cuffs", category: "Cosplay", },
	{ name: "Bunny Bustier", value: "bunnybustier", category: "Cosplay", colorable: true },
	{ name: "Leather Bunny Bustier", value: "bunnybustier_leather", category: "Cosplay", colorable: true },
	{ name: "Latex Bunny Bustier", value: "bunnybustier_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bunny Tights", value: "bunnytights", category: "Cosplay", colorable: true },
	{ name: "Latex Bunny Tights", value: "bunnytights_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bunny Shoes", value: "bunnybustier", category: "Cosplay", colorable: true },
	{ name: "Latex Bunny Shoes", value: "bunnybustier_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow"] },

	// Ponygirls
	{ name: "Leather Pony Boots", value: "ponyboots_leather", category: "Cosplay", colorable: true },
	{ name: "Leather Thigh Belts", value: "thighbelts_leather", category: "Cosplay",colorable: true },
	{ name: "Leather Pony Tack", value: "ponytack_leather", category: "Cosplay", colorable: true },
	{ name: "Leather Head Harness", value: "headharness_leather", category: "Cosplay", },
	{ name: "Blinkers", value: "blinkers_leather", category: "Cosplay", colorable: true },
	{ name: "Reins", value: "reins_leather", category: "Cosplay", colorable: true },

	// Maids
	{ name: "Maid Dress", value: "maid_dress", colorable: true, category: "Cosplay", uniqueColors: ["Gothic", "Victorian", "Oriental", "French", "Cyber", "Frilly"] },
	{ name: "Latex Maid Dress", value: "maiddress_latex", colorable: true, category: "Cosplay", uniqueColors: ["Starry", "Shadow", "Gothic", "French", "Cyber"] },
	{ name: "Apron", value: "maid_apron", colorable: true, category: "Cosplay", forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Latex Apron", value: "maidapron_latex", colorable: true, category: "Cosplay", forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Maid Headdress", value: "maid_headdress", category: "Cosplay", },
	{ name: "Maid Badge of Office", value: "maid_badge", colorable: true, category: "Cosplay", uniqueColors: ["Brass", "Silver", "Gold"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	//Dolls and Drones
	{ name: "Drone Suit", value: "dronesuit", colorable: true, category: "Doll" },
	{ name: "Latex Drone Suit", value: "dronesuit_latex", colorable: true, category: "Doll", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Control Harness", value: "control_harness", category: "Doll" },
	{ name: "Cyber Doll Harness", value: "cyberdoll_harness", category: "Doll" },
	{ name: "Doll Heels", value: "doll_heels", category: "Doll" },
	{ name: "Doll Barcode", value: "cyberdoll_barcode", category: "Doll" },

	//Faux Bondage and Non Restrictive Gear
	{ name: "Harness", value: "harness_leather", colorable: true, category: "Bondage", uniqueColors: ["Vine", "Leather", "Latex", "Leather", "Rubber", "Shibari"] },
	{ name: "Bondage Wrist Cuffs", value: "cuffswrist_bondage", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Wrist Cuffs", value: "cuffswrist_latex", colorable: true, category: "Bondage", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bondage Ankle Cuffs", value: "cuffsankle_bondage", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Ankle Cuffs", value: "cuffsankle_latex", colorable: true, category: "Bondage", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Bondage Thigh Cuffs", value: "cuffsthigh_bondage", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
	{ name: "Latex Thigh Cuffs", value: "cuffsthigh_latex", colorable: true, category: "Bondage", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Cyber Doll Cuffs", value: "cuffs_cyberdoll", colorable: true, category: "Bondage" },
	{ name: "Latex Legbinder", value: "legbinder_latex", colorable: true, category: "Bondage", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leather Legbinder", value: "legbinder_leather", colorable: true, category: "Bondage" },
	{ name: "Latex Hobble Skirt", value: "hobble_latex", colorable: true, category: "Bondage", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leather Hobble Skirt", value: "hobble_leather", colorable: true, category: "Bondage" },
	{ name: "Rope Karada", value: "rope_karada", colorable: true, category: "Bondage" },
	{ name: "Rope Ties", value: "rope_ties", colorable: true, category: "Bondage" },
	{ name: "Shock Module", value: "shock_module", category: "Bondage" },
	{ name: "Crop", value: "crop", category: "Bondage" },
	{ name: "Leather Paddle", value: "paddle_leather", colorable: true, category: "Bondage", uniqueColors: ["Studded"] },
	{ name: "Leash", value: "leash", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic"] },
	{ name: "Nipple Clamps", value: "nippleclamps", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic", "Crystal"] },
	{ name: "Wingbinders", value: "wingbinders", colorable: true, category: "Bondage", uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },

	// Cosplay, Swimwear and Outfits
	{ name: "Labcoat", value: "labcoat", category: "Cosplay" },
	{ name: "Outfit", value: "outfit", colorable: true, category: "Cosplay", uniqueColors: ["Nurse", "Latex Nurse", "Race Queen", "Cheerleader", "Dancer"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Suit", value: "suit_outfit", colorable: true, category: "Cosplay", uniqueColors: ["Infiltration", "Spy", "Playbunny", "Reverse Playbunny", "Ghillie", "Nevermere", "Nevermere Executive"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Songbird Ensemble", value: "outfit_songbird", category: "Cosplay", colorable: true },
	{ name: "Fashionable Suit", value: "suit_fashionable", category: "Cosplay", colorable: true },
	{ name: "Wool Suit", value: "suit_wool", category: "Cosplay", colorable: true },
	{ name: "Sukumizu", value: "sukumizu", category: "Cosplay", colorable: true },
	{ name: "Bikini", value: "bikini", category: "Cosplay", colorable: true, uniqueColors: ["Cow Print", "Skimpy", "Frilly", "Tiger Print", "Leaf", "Dragonscale", "Chainmail", "Yellow Polka-Dot"] },
	{ name: "Latex Bikini", value: "bikini_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow", "Cow Print"] },
	{ name: "Armour", value: "armour", category: "Cosplay", colorable: true, uniqueColors: ["Steel", "Cobalt", "Dragon Scale", "Holy Knight", "Black Knight", "Chainmail", "Crystal", "Leather", "Bark"], forbiddenColors: ["Black", "White", "Red", "Purple", "Green", "Orange", "Red", "Pink", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Exhibitionist", value: "exhibitionist", category: "Cosplay" },
	{ name: "Empress' Robes", value: "empressnewdress", category: "Cosplay" },
	{ name: "Latex Mermaid Tail", value: "mermaid_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow"] },
	{ name: "Harem Silks", value: "haremsilks", category: "Cosplay", colorable: true },
	{ name: "Magical Girl Uniform", value: "outfit_magicalgirl", category: "Cosplay", colorable: true },
	{ name: "Latex Magical Girl Uniform", value: "outfit_magicalgirl_latex", category: "Cosplay", colorable: true, uniqueColors: ["Starry", "Shadow"] },

	// Upper Body
	{ name: "Comfy Oversized Hoodie", value: "hoodie_oversized", colorable: true, category: "Upper Body" },
	{ name: "Eared Hoodie", value: "hoodie_eared", colorable: true, category: "Upper Body", uniqueColors: ["Fox", "Cat", "Dog", "Wolf", "Bunny"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Turtleneck Sweater", value: "turtleneck", colorable: true, category: "Upper Body" },
	{ name: "Wooly Sweater", value: "sweater_wooly", colorable: true, category: "Upper Body" },
	{ name: "Halter Top", value: "top_halter", colorable: true, category: "Upper Body" },
	{ name: "Crop Top", value: "top_crop", colorable: true, category: "Upper Body", uniqueColors: ["Floral", "Leafy"] },
	{ name: "Leather Crop Top", value: "top_crop_leather", colorable: true, category: "Upper Body" },
	{ name: "Latex Crop Top", value: "top_crop_latex", colorable: true, category: "Upper Body", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Tube Top", value: "top_tube", colorable: true, category: "Upper Body", uniqueColors: ["Latex"] },
	{ name: "Bandeau", value: "bandeau", colorable: true, category: "Upper Body", uniqueColors: ["Floral", "Leafy"] },
	{ name: "Floaty Silk Top", value: "top_floatysilk", colorable: true, category: "Upper Body" },
	{ name: "Mesh Top", value: "top_mesh", colorable: true, category: "Upper Body" },
	{ name: "Lycra Top", value: "top_lycra", colorable: true, category: "Upper Body" },
	{ name: "Checked Shirt", value: "shirt_checked", colorable: true, category: "Upper Body" },
	{ name: "Button-up Blouse", value: "buttonup_blouse", colorable: true, category: "Upper Body", uniqueColors: ["Witchy", "Latex"] },
	{ name: "Comfortable Jacket", value: "jacket_comfortable", colorable: true, category: "Upper Body", uniqueColors: ["Leather", "Bomber", "Double-breasted"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "T-shirt", value: "tshirt", colorable: true, category: "Upper Body", uniqueColors: ["Goth Metal", "Plain", "Black", "Alternative", "Grey", "Simple", "Striped"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Lower Body
	{ name: "Pleated Skirt", value: "pleated_skirt", colorable: true, category: "Lower Body", uniqueColors: ["Latex", "Witchy", "Gothic", "Starry", "Shadow"] },
	{ name: "Miniskirt", value: "mini_skirt", colorable: true, category: "Lower Body", uniqueColors: ["Latex", "Witchy", "Gothic", "Cheerleader", "Floral", "Leafy"] },
	{ name: "Pencil Skirt", value: "pencil_skirt", colorable: true, category: "Lower Body", uniqueColors: ["Latex", "Witchy", "Gothic", "Cheerleader"] },
	{ name: "Side Split Skirt", value: "split_skirt", colorable: true, category: "Lower Body" },
	{ name: "Skirt", value: "skirt", colorable: true, category: "Lower Body" },
	{ name: "Pareo", value: "pareo", colorable: true, category: "Lower Body", uniqueColors: ["Leafy"]  },
	{ name: "Leather Skirt", value: "skirt_leather", colorable: true, category: "Lower Body" },
	{ name: "Latex Skirt", value: "skirt_latex", colorable: true, category: "Lower Body", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Suit Pants", value: "pants", colorable: true, category: "Lower Body" },
	{ name: "Leather Pants", value: "pants_leather", colorable: true, category: "Lower Body" },
	{ name: "Latex Pants", value: "pants_latex", colorable: true, category: "Lower Body", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Shorts", value: "shorts", colorable: true, category: "Lower Body" },
	{ name: "Lycra Shorts", value: "shorts_lycra", colorable: true, category: "Lower Body" },
	{ name: "Denim Shorts", value: "shorts_denim", colorable: true, category: "Lower Body" },
	{ name: "Booty Shorts", value: "bootyshorts", colorable: true, category: "Lower Body" },
	{ name: "Leather Booty Shorts", value: "bootyshorts_leather", colorable: true, category: "Lower Body" },
	{ name: "Latex Booty Shorts", value: "bootyshorts_latex", colorable: true, category: "Lower Body", uniqueColors: ["Starry", "Shadow", "Leapord Print"] },

	// Dresses
	{ name: "Leather Dress", value: "dress_leather", colorable: true, category: "Dress" },
	{ name: "Latex Dress", value: "dress_latex", colorable: true, category: "Dress", uniqueColors: ["Starry", "Shadow", "Witchy"] },
	{ name: "Frilled Dress", value: "frilled_dress", colorable: true, category: "Dress" },
	{ name: "Strapless Dress", value: "strapless_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Floral", "Leafy"] },
	{ name: "Halter Dress", value: "halter_dress", colorable: true, category: "Dress" },
	{ name: "Skimpy Dress", value: "skimpy_dress", colorable: true, category: "Dress" },
	{ name: "Salsa Dress", value: "salsa_dress", colorable: true, category: "Dress" },
	{ name: "Little Black Dress", value: "littleblack_dress", colorable: false, category: "Dress" },
	{ name: "Flowy Dress", value: "flowy_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Floral", "Leafy"] },
	{ name: "Side Split Dress", value: "split_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Floral", "Leafy"] },
	{ name: "Latex Flowy Dress", value: "flowy_dress_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Evening Dress", value: "evening_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Golden", "Silver"] },
	{ name: "Latex Evening Dress", value: "evening_dress_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Sequin Dress", value: "evening_dress", colorable: true, category: "Dress", uniqueColors: ["Golden", "Silver"] },
	{ name: "Ballgown", value: "ballgown", colorable: true, category: "Dress", uniqueColors: ["Gothic"] },
	{ name: "Princess Dress", value: "princess_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Sheep"] },
	{ name: "Sundress", value: "sun_dress", colorable: true, category: "Dress" },
	{ name: "Kimono", value: "kimono", colorable: true, category: "Dress", uniqueColors: ["Gothic"] },
	{ name: "Latex Kimono", value: "kimono_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Yukata", value: "yukata", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Floral"] },
	{ name: "Latex Yukata", value: "yukata_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Minidress", value: "mini_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic"] },
	{ name: "Latex Minidress", value: "mini_dress_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Chinese Dress", value: "chinese_dress", colorable: true, category: "Dress", uniqueColors: ["Gothic"] },
	{ name: "Latex Chinese Dress", value: "chinese_dress_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Shrine Maiden's Robe", value: "shrine_maiden", colorable: true, category: "Dress", uniqueColors: ["Gothic"] },
	{ name: "Latex Shrine Maiden's Robe", value: "shrine_maiden_latex", colorable: true, category: "Dress", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Binding Dress", value: "binding_dress", colorable: true, category: "Dress", uniqueColors: ["Latex", "Leather"] },
	{ name: "Sweater Dress", value: "sweater_dress", colorable: true, category: "Dress" },
	{ name: "Backless Sweater Dress", value: "sweater_dress_backless", colorable: true, category: "Dress" },
	{ name: "Oversized T-shirt", value: "tshirt_oversized", colorable: true, category: "Dress" },

	// Underwear and Sleepwear
	{ name: "Leather Bra", value: "bra_leather", colorable: true, category: "Undergarments" },
	{ name: "Latex Bra", value: "bra_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lacy Bra", value: "bra_lacy", colorable: true, category: "Undergarments" },
	{ name: "Strapless Bra", value: "bra_strapless", colorable: true, category: "Undergarments" },
	{ name: "Leather Panties", value: "panties_leather", colorable: true, category: "Undergarments" },
	{ name: "Panties", value: "panties", colorable: true, category: "Undergarments" },
	{ name: "Latex Panties", value: "panties_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lacy Panties", value: "panties_lacy", colorable: true, category: "Undergarments" },
	{ name: "Side Tie Panties", value: "panties_sidetie", colorable: true, category: "Undergarments" },
	{ name: "Lingerie", value: "lingerie", colorable: true, category: "Undergarments" },
	{ name: "Royal Icing Lingerie", value: "lingerie_royalicing", colorable: false, category: "Undergarments" },
	{ name: "Nightie", value: "nightie", colorable: true, category: "Undergarments" },
	{ name: "Sheer Nightie", value: "nightie_sheer", colorable: true, category: "Undergarments" },
	{ name: "Lacy Nightie", value: "nightie_lacy", colorable: true, category: "Undergarments" },
	{ name: "Silk Nightdress", value: "nightdress_silk", colorable: true, category: "Undergarments" },
	{ name: "Silk Robe", value: "silk_robe", colorable: true, category: "Undergarments" },
	{ name: "Waist Cincher", value: "waistcincher", colorable: true, category: "Undergarments" },
	{ name: "Latex Waist Cincher", value: "waistcincher_latex", colorable: true, category: "Undergarments" },
	{ name: "Nipple Pasties", value: "nipple_pasties", colorable: true, category: "Undergarments" },
	{ name: "Stockings", value: "stockings", colorable: true, category: "Undergarments", uniqueColors: ["Checked"] },
	{ name: "Pantyhose", value: "pantyhose", colorable: true, category: "Undergarments" },
	{ name: "Latex Stockings", value: "stockings_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Latex Pantyhose", value: "pantyhose_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Fishnets", value: "fishnets", colorable: true, category: "Undergarments" },
	{ name: "Tights", value: "tights", colorable: true, category: "Undergarments" },
	{ name: "Stirrup Leggings", value: "leggings_stirrup", colorable: true, category: "Undergarments" },
	{ name: "Garters", value: "garters", colorable: true, category: "Undergarments" },
	{ name: "Latex Garters", value: "garters_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Garter Belt", value: "gartersbelt", colorable: true, category: "Undergarments" },
	{ name: "Latex Garter Belt", value: "gartersbelt_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Lace Thigh Band", value: "thighband_lace", colorable: true, category: "Undergarments" },
	{ name: "Leather Thigh Band", value: "thighband_leather", colorable: true, category: "Undergarments" },
	{ name: "Latex Thigh Band", value: "thighband_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Thighhighs", value: "thighhighs", colorable: true, category: "Undergarments" },
	{ name: "Latex Thighhighs", value: "thighhighs_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow", "Cowprint"] },
	{ name: "Striped Socks", value: "stripedsocks", colorable: true, category: "Undergarments" },
	{ name: "Bodystocking", value: "bodystocking", colorable: true, category: "Undergarments" },
	{ name: "Leather Catsuit", value: "catsuit_leather", colorable: true, category: "Undergarments" },
	{ name: "Latex Catsuit", value: "catsuit_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Leotard", value: "leotard", colorable: true, category: "Undergarments" },
	{ name: "Latex Leotard", value: "leotard_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },
	{ name: "High Waist Leotard", value: "leotard_highwaist", colorable: true, category: "Undergarments" },
	{ name: "Latex High Waist Leotard", value: "leotard_highwaist_latex", colorable: true, category: "Undergarments", uniqueColors: ["Starry", "Shadow"] },

	// Footwear
	{ name: "High Heels", value: "highheels", colorable: true, category: "Footwear", uniqueColors: ["Ruby", "Glass"] },
	{ name: "Latex High Heels", value: "highheels_latex", colorable: true, category: "Footwear", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Kitten Heels", value: "highheels_kitten", colorable: true, category: "Footwear", uniqueColors: ["Ruby", "Glass"] },
	{ name: "Ballet Heels", value: "balletheels", colorable: true, category: "Footwear" },
	{ name: "Latex Ballet Heels", value: "balletheels_latex", colorable: true, category: "Footwear", uniqueColors: ["Starry", "Shadow"] },
	{ name: "Ballet Shoes", value: "ballet_shoes", colorable: true, category: "Footwear" },
	{ name: "Canvas Shoes", value: "canvas_shoes", colorable: true, category: "Footwear" },
	{ name: "Tennis Shoes", value: "tennis_shoes", colorable: true, category: "Footwear" },
	{ name: "Sneakers", value: "sneakers", colorable: true, category: "Footwear" },
	{ name: "Sandals", value: "sandals", colorable: true, category: "Footwear" },
	{ name: "Strappy Sandals", value: "sandals_strappy", colorable: true, category: "Footwear", uniqueColors: ["Floral", "Leafy"], },
	{ name: "Toenail Polish", value: "polish_toenails", colorable: true, category: "Footwear", uniqueColors: ["Iridescent", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
	{ name: "Ankle Boots", value: "ankleboots", colorable: true, category: "Footwear" },
	{ name: "Cowboy Boots", value: "cowboyboots", colorable: true, category: "Footwear" },
	{ name: "Leather Chaps", value: "chaps_leather", colorable: true, category: "Footwear" },
	{ name: "Knee High Boots", value: "kneehighboots", colorable: true, category: "Footwear" },
	{ name: "Thigh High Boots", value: "thighhighboots", colorable: true, category: "Footwear" },
	{ name: "Latex Thigh High Boots", value: "thighhighboots_latex", colorable: true, category: "Footwear" },
	{ name: "Platform Heels", value: "platformheels", colorable: true, category: "Footwear" },
	{ name: "Pumps", value: "pumps", colorable: true, category: "Footwear" },
	{ name: "Anklets", value: "anklets", colorable: true, category: "Footwear", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black", "Floral", "Leafy"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Greaves", value: "greaves", colorable: true, category: "Footwear", uniqueColors: ["Steel", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	// Gloves and Armwear
	{ name: "Opera Gloves", value: "gloves_opera", colorable: true, category: "Hands", uniqueColors: ["Gothic"] },
	{ name: "Leather Opera Gloves", value: "gloves_opera_leather", colorable: true, category: "Hands", uniqueColors: ["Gothic"] },
	{ name: "Latex Opera Gloves", value: "gloves_opera_latex", colorable: true, category: "Hands", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Leather Gloves", value: "gloves_leather", colorable: true, category: "Hands", uniqueColors: ["Gothic"] },
	{ name: "Fishnet Gloves", value: "gloves_fishnet", colorable: true, category: "Hands" },
	{ name: "Wooly Mittens", value: "wooly_mitts", colorable: true, category: "Hands" },
	{ name: "Fingerless Gloves", value: "gloves_fingerless", colorable: true, category: "Hands" },
	{ name: "Fingerless Elbow Gloves", value: "gloves_fingerlesselbow", colorable: true, category: "Hands" },
	{ name: "Latex Gloves", value: "gloves_latex", colorable: true, category: "Hands", uniqueColors: ["Starry", "Shadow", "Cowprint"] },
	{ name: "Detached Sleeves", value: "sleeves_detatched", colorable: true, category: "Hands", uniqueColors: ["Gothic"] },
	{ name: "Detached Latex Sleeves", value: "sleeves_detached_latex", colorable: true, category: "Hands", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Long Detached Sleeves", value: "sleeves_longdetatched", colorable: true, category: "Hands", uniqueColors: ["Gothic"] },
	{ name: "Long Detached Latex Sleeves", value: "sleeves_longdetached_latex", colorable: true, category: "Hands", uniqueColors: ["Gothic", "Starry", "Shadow"] },
	{ name: "Fingernail Polish", value: "polish_fingernails", colorable: true, category: "Hands", uniqueColors: ["Iridescent", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
	{ name: "Wristcuff", value: "wristcuff", colorable: true, category: "Hands", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Bracelets", value: "bracelets", colorable: true, category: "Hands", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black", "Starmetal", "Floral", "Leafy"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Armbands", value: "armbands", colorable: true, category: "Hands", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black", "Starmetal", "Floral", "Livingwood"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Gauntlets", value: "gauntlet", colorable: true, category: "Hands", uniqueColors: ["Steel", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

	//Misc Accessories
	{ name: "Backpack", value: "backpack", category: "Misc" },
	{ name: "Nametag", value: "nametag", category: "Misc" },
	{ name: "Big Cute Ribbon", value: "bigcute_ribbon", colorable: true, category: "Misc" },
	{ name: "Feather Boa", value: "feather_boa", colorable: true, category: "Misc" },
	{ name: "Bridal Wristlets", value: "wristlets_bridal", colorable: true, category: "Misc", uniqueColors: ["Gothic"] },
	{ name: "Choker", value: "choker", colorable: true, category: "Misc", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Tattoo"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Leather Choker", value: "choker_leather", colorable: true, category: "Misc" },
	{ name: "Cloak", value: "cloak", colorable: true, category: "Misc", uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded", "Elven"] },
	{ name: "Latex Cloak", value: "cloak_latex", colorable: true, category: "Misc", uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded"] },
	{ name: "Fluffy Scarf", value: "scarf_fluffy", colorable: true, category: "Misc" },
	{ name: "Cozy Blanket", value: "blanket_cozy", colorable: true, category: "Misc" },
	{ name: "Silk Scarf", value: "scarf_silk", colorable: true, category: "Misc" },
	{ name: "Necklace", value: "necklace", colorable: true, category: "Misc", uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "Bowtie", value: "bowtie", colorable: true, category: "Misc" },
	{ name: "Tie", value: "tie", colorable: true, category: "Misc" },
	{ name: "Hoshi no Tama", value: "tama", category: "Misc" },
	{ name: "Silk Belt", value: "belt_silk", colorable: true, category: "Misc" },
	{ name: "Leather Belt", value: "belt_leather", colorable: true, category: "Misc" },
	{ name: "Leather Bandolier", value: "bandolier_leather", category: "Misc" },
	{ name: "", value: "tome", colorable: true, category: "Misc", uniqueColors: ["Tome of Bondage", "Cursed Tome", "Shadowy Tome", "Chained Tome", "Gothic Tome", "Angelic Tome"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
	{ name: "", value: "staff", colorable: true, category: "Misc", uniqueColors: ["Staff of Chains", "Caduceus", "Elemental Staff", "Lunar Staff", "Dollmaker's Staff", "Quarterstaff", "Gohei"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
];

// Each colorable entry above will have a copy of the following added
// Unless it is excluded on forbiddenColors.
const colors = ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"];

// This is a list of tags to add to the wearables, assuming they match a word here. 
// This should NOT be used to add a bunch of random tags. Categories should be relatively
// broad things people may have a yuck or yum for. Examples include "latex", "leather", "metal"
// "living", "slime" and so on. 
// This can include a regex instead of "word" - it will be doing a case-insensitive .match on the NAME value.
const tagstoadd = [
    { match: `latex`, tag: "latex" },
    { match: `leather`, tag: "leather" },
    { match: `lipstick`, tag: "makeup" },
    { match: `eyeliner`, tag: "makeup" },
    { match: `eyeshadow`, tag: "makeup" },
    { match: `kissmark`, tag: "makeup" },
    { match: `foundation`, tag: "makeup" },
    { match: `eyeliner_cateye`, tag: "makeup" },
    { match: `mascara`, tag: "makeup" },
    { match: `makeupblush`, tag: "makeup" },
]

/**************
 * Discord API Requires an array of objects in form:
 * { name: "Latex Armbinder", value: "armbinder_latex" }
 ********************/
const loadWearables = async () => {
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
    // Iterate through each wearablestoadd and parse the tag list 
    wearablestoadd.forEach((wearable) => {
        if (!wearable.tags) { wearable.tags = {} }
        tagstoadd.forEach((tag) => {
            if (wearable.name.toLowerCase().match(tag.match.toLowerCase())) {
                wearable.tags[tag.tag] = true;
            }
        })
    })
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
    // Add the full wearables list to the process vars. 
    process.wearabletypes = Array.from(wearablestoadd);
    // Add to autocompletes. 
    if (process.autocompletes == undefined) { process.autocompletes = {} }
	process.autocompletes.wearables = Array.from(outmap.values());
	console.log(`Wearables list is ${process.autocompletes.wearables.length} entries long.`);
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
	for (let i = 0; i < process.wearabletypes.length; i++) {
		convertmittenarr[process.wearabletypes[i].value] = process.wearabletypes[i].name;
	}
	if (wearablename) {
		return convertmittenarr[wearablename];
	} else {
		return undefined;
	}
};

const getBaseWearable = (type) => {
    try {
        let returnval = wearabletypes.find((w) => w.value == type)
        if (!returnval) {
            let colortosearch = type.split("_").slice(0,-1).join("_"); // remove the last element which should only be the color
            returnval = wearabletypes.find((w) => w.value == colortosearch)
        }
        return returnval;
    }
    catch (err) {
        console.log(err);
    }
};

exports.wearabletypes = wearabletypes;
exports.loadWearables = loadWearables;
exports.wearablecolors = colors;

exports.assignWearable = assignWearable;
exports.getWearable = getWearable;
exports.deleteWearable = deleteWearable;
exports.getWearableName = getWearableName;
exports.getBaseWearable = getBaseWearable;

exports.addLockedWearable = addLockedWearable;
exports.getLockedWearable = getLockedWearable;
exports.removeLockedWearable = removeLockedWearable;