const fs = require('fs');
const path = require('path');

let wearabletypes = [
    // Tails and Misc Body Parts
    { name: "Tail", value: "tail", colorable: true, uniqueColors: ["Cat", "Dog", "Bunny", "Sheep", "Demon", "Fox", "Pony", "Lizard", "Dragon"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Wings", value: "wings", colorable: true, uniqueColors: ["Cat", "Dog", "Demon", "Angel", "Imp", "Succubus", "Bat", "Butterfly", "Dragon", "Crystal"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Womb Tattoo", value: "wombtat", colorable: true, uniqueColors: ["Glowing"], forbiddenColors: [] },
    { name: "Vine Hair", value: "hair_vine", colorable: true, uniqueColors: ["Flowery", "Dog", "Bunny", "Sheep", "Demon", "Fox", "Pony", "Lizard"], forbiddenColors: [] },

    // Headwear - Relocate to Masks?
    { name: "Stylish Hat", value: "stylish_hat", colorable: true },

    // Bunnygirls
    { name: "Playbunny Outfit", value: "outfit_playbunny" },
    { name: "Reverse Playbunny Outfit", value: "outfit_playbunny_reverse" },
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
    { name: "Blinkers", value: "blinkers_leather", colorable: true },
    { name: "Reins", value: "reins_leather", colorable: true },

    // Maids
    { name: "Maid Dress", value: "maid_dress", colorable: true, uniqueColors: ["Gothic", "Victorian", "Oriental", "French", "Cyber", "Frilly"] },
    { name: "Latex Maid Dress", value: "maiddress_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Gothic", "French", "Cyber"] },
    { name: "Apron", value: "maid_apron", colorable: true, forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"]},
    { name: "Latex Apron", value: "maidapron_latex", colorable: true, forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"]},

    //Dolls and Drones
    { name: "Drone Suit", value: "dronesuit", colorable: true },
    { name: "Latex Drone Suit", value: "dronesuit_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Control Harness", value: "control_harness" },
    { name: "Cyber Doll Harness", value: "cyberdoll_harness" },

    //Faux Bondage and Non Restrictive Gear
    { name: "Leather Harness", value: "harness_leather" },
    { name: "Bondage Wrist Cuffs", value: "cuffswrist_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
    { name: "Latex Wrist Cuffs", value: "cuffswrist_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Bondage Ankle Cuffs", value: "cuffsankle_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
    { name: "Latex Ankle Cuffs", value: "cuffsankle_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Bondage Thigh Cuffs", value: "cuffsthigh_bondage", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },
    { name: "Latex Thigh Cuffs", value: "cuffsthigh_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Latex Legbinder", value: "legbinder_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Leather Legbinder", value: "legbinder_leather", colorable: true},
    { name: "Latex Hobble Skirt", value: "hobble_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Leather Hobble Skirt", value: "hobble_leather", colorable: true},
    { name: "Rope Karada", value: "rope_karada", colorable: true },
    { name: "Rope Ties", value: "rope_ties", colorable: true },
    { name: "Shock Module", value: "shock_module" },
    { name: "Leash", value: "leash", colorable: true, uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic"] },
    { name: "Nipple Clamps", value: "nippleclamps", colorable: true, uniqueColors: ["Hardlight", "Leather", "Rubber", "Magic"] },
    { name: "Wingbinders", value: "wingbinders", colorable: true, uniqueColors: ["Hardlight", "Steel", "Golden", "Leather", "Rubber", "Cursed"] },

    // Cosplay, Swimwear and Outfits
    { name: "Labcoat", value: "labcoat" },
    { name: "Nurse Outfit", value: "outfit_nurse" },
    { name: "Latex Nurse Outfit", value: "outfitnurse_latex" },
    { name: "Race Queen Outfit", value: "outfit_racequeen", },
    { name: "Spy Suit", value: "outfit_spy", },
    { name: "Cheerleader Costume", value: "outfit_cheerleader", },
    { name: "Songbird Ensemble", value: "outfit_songbird", colorable: true },
    { name: "Fashionable Suit", value: "suit_fashionable", colorable: true },
    { name: "Wool Suit", value: "suit_wool", colorable: true },
    { name: "Sukumizu", value: "sukumizu", colorable: true },
    { name: "Bikini", value: "bikini", colorable: true, uniqueColors: ["Cow Print", "Skimpy", "Frilly", "Tiger Print"] },
    { name: "Latex Bikini", value: "bikini_latex", colorable: true, uniqueColors: ["Starry", "Shadow", "Cow Print", "Tiger Print"] },
    { name: "Holy Knight Armor", value: "armor_holyknight" },
    { name: "Dragonscale Bikini", value: "dragonscale_bikini" },
    { name: "Dragonscale Mail", value: "dragonscale_mail", colorable: true },
    { name: "Exhibitionist", value: "exhibitionist" },
    { name: "Empress' Robes", value: "empressnewdress" },
    { name: "Latex Mermaid Tail", value: "mermaid_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Harem Silks", value: "haremsilks", colorable: true },
    { name: "Dancer Outfit", value: "dancer_outfit", colorable: true },
    { name: "Magical Girl Uniform", value: "outfit_magicalgirl", colorable: true },
    { name: "Latex Magical Girl Uniform", value: "outfit_magicalgirl_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },

    // Upper Body
    { name: "Comfy Oversized Hoodie", value: "hoodie_oversized", colorable: true },
    { name: "Eared Hoodie", value: "hoodie_eared", colorable: true, uniqueColors: ["Fox", "Cat", "Dog", "Wolf", "Bunny"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Turtleneck Sweater", value: "turtleneck", colorable: true },
    { name: "Winter Sweater", value: "sweater_winter", colorable: true },
    { name: "Halter Top", value: "top_halter", colorable: true },
    { name: "Crop Top", value: "top_crop", colorable: true },
    { name: "Leather Crop Top", value: "top_crop_leather", colorable: true },
    { name: "Latex Crop Top", value: "top_crop_latex", colorable: true, uniqueColors: ["Starry", "Shadow"]  },
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
    { name: "Flowy Dress", value: "flowy_dress", colorable: true, uniqueColors: ["Gothic"] },
    { name: "Latex Flowy Dress", value: "flowy_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
    { name: "Evening Dress", value: "evening_dress", colorable: true, uniqueColors: ["Gothic", "Golden", "Silver",] },
    { name: "Latex Evening Dress", value: "evening_dress_latex", colorable: true, uniqueColors: ["Gothic", "Starry", "Shadow"] },
    { name: "Sequin Dress", value: "evening_dress", colorable: true, uniqueColors: ["Golden", "Silver",] },
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
    { name: "Stockings", value: "stockings", colorable: true },
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
    { name: "Leather Catsuit", value: "catsuit_leather", colorable: true},
    { name: "Latex Catsuit", value: "catsuit_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Leotard", value: "leotard", colorable: true },
    { name: "Latex Leotard", value: "leotard_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "High Waist Leotard", value: "leotard_highwaist", colorable: true },
    { name: "Latex High Waist Leotard", value: "leotard_highwaist_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },

    // Footwear
    { name: "High Heels", value: "highheels", colorable: true },
    { name: "Latex High Heels", value: "highheels_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Ballet Heels", value: "balletheels", colorable: true},
    { name: "Latex Ballet Heels", value: "balletheels_latex", colorable: true, uniqueColors: ["Starry", "Shadow"] },
    { name: "Ballet Shoes", value: "ballet_shoes", colorable: true },
    { name: "Sandals", value: "sandals", colorable: true },
    { name: "Strappy Sandals", value: "sandals_strappy", colorable: true },
    { name: "Toenail Polish", value: "polish_toenails", colorable: true, uniqueColors: ["Color-changing", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
    { name: "Ankle Boots", value: "ankleboots", colorable: true },
    { name: "Cowboy Boots", value: "cowboyboots", colorable: true },
    { name: "Knee High Boots", value: "kneehighboots", colorable: true },
    { name: "Thigh High Boots", value: "thighhighboots", colorable: true },
    { name: "Platform Heels", value: "platformheels", colorable: true },
    { name: "Pumps", value: "pumps", colorable: true },
    { name: "Anklets", value: "anklets", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Greaves", value: "greaves", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

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
    { name: "Fingernail Polish", value: "polish_fingernails", colorable: true, uniqueColors: ["Color-changing", "Sparkly", "Glow-in-the-Dark", "Ultraviolet", "Sanguine"] },
    { name: "Wristcuff", value: "wristcuff", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Bracelet", value: "bracelet", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Armbands", value: "armbands", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Gauntlets", value: "gauntlet", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Black"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },

    //Misc Accessories
    { name: "Backpack", value: "backpack" },
    { name: "Nametag", value: "nametag", },
    { name: "Big Cute Ribbon", value: "bigcute_ribbon", colorable: true },
    { name: "Feather Boa", value: "feather_boa", colorable: true },
    { name: "Bridal Wristlets", value: "wristlets_bridal", colorable: true, uniqueColors: ["Gothic"] },
    { name: "Choker", value: "choker", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Leather Choker", value: "choker_leather", colorable: true },
    { name: "Cloak", value: "cloak", colorable: true, uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded", "Elven"] },
    { name: "Latex Cloak", value: "cloak_latex", colorable: true, uniqueColors: ["Witch", "Rogue", "Vampire", "Hooded"] },
    { name: "Fluffy Scarf", value: "scarf_fluffy", colorable: true },
    { name: "Silk Scarf", value: "scarf_fluffy", colorable: true },
    { name: "Necklace", value: "necklace", colorable: true, uniqueColors: ["Silver", "Gold", "Platinum", "Cobalt", "Gothic", "Vampire", "Angel Wings"], forbiddenColors: ["Black", "Red", "Purple", "Green", "Orange", "Red", "Pink", "White", "Yellow", "Cyan", "Aqua", "Blue", "Indigo", "Gray", "Brown"] },
    { name: "Bowtie", value: "bowtie", colorable: true },
    { name: "Tie", value: "tie", colorable: true },
    { name: "Hoshi no Tama", value: "tama", colorable: true },
    { name: "Silk Belt", value: "belt_silk", colorable: true },
    { name: "Leather Belt", value: "belt_leather", colorable: true },
    { name: "Leather Bandolier", value: "belt_leather", colorable: true },
]

// Each colorable entry above will have a copy of the following added
// Unless it is excluded on forbiddenColors. 
const colors = ["Black", "Red", "Purple", "Green",
    "Orange", "Red", "Pink", "White",
    "Yellow", "Cyan", "Aqua", "Blue",
    "Indigo", "Gray", "Brown"]

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
            newobject.value = `${w.value}_${c.toLowerCase()}`
            wearablestoadd.push(newobject)
        })
    })

    let outarr = wearablestoadd.map((item) => { return { name: item.name, value: item.value } })
    // Since I have zero clue how to prevent the duplicates, 
    // the code feels solid and doesnt seem to have any obvious bugs.
    // I'm just gonna dedupe them before committing them. This is a dumb workaround. 
    let outmap = new Map();
    for (const i of outarr) {
        outmap.set(i.value, i)
    }
    process.wearableslist = Array.from(outmap.values());
    console.log(`Wearables list is ${process.wearableslist.length} entries long.`);
}

const assignWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        process.wearable[userID].wornwearable.push(wearable);
    }
    else {
        process.wearable[userID] = {
            wornwearable: [wearable]
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const getWearable = (userID) => {
    if (process.wearable == undefined) { process.wearable = {} }
    return process.wearable[userID]?.wornwearable ? process.wearable[userID]?.wornwearable : [];
}

const getLockedWearable = (userID) => {
    if (process.wearable == undefined) { process.wearable = {} }
    return process.wearable[userID]?.locked ? process.wearable[userID]?.locked : [];
}

const addLockedWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        if (process.wearable[userID].locked == undefined) {
            process.wearable[userID].locked = [wearable]
        }
        else {
            process.wearable[userID].locked.push(wearable);
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const removeLockedWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (process.wearable[userID]) {
        if (process.wearable[userID].locked == undefined) {
            return;
        }
        else {
            if (process.wearable[userID].locked.includes(wearable)) {
                process.wearable[userID].locked.splice(process.wearable[userID].locked.indexOf(wearable), 1);
            }
            if (process.wearable[userID].locked.length == 0) {
                delete process.wearable[userID].locked
            }
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const deleteWearable = (userID, wearable) => {
    if (process.wearable == undefined) { process.wearable = {} }
    if (!process.wearable[userID]) { return false }
    if (wearable && process.wearable[userID].wornwearable.includes(wearable) && !getLockedWearable(userID).includes(wearable)) {
        process.wearable[userID].wornwearable.splice(process.wearable[userID].wornwearable.indexOf(wearable), 1)
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID]
        }
    }
    else if (process.wearable[userID]) {
        let locks = getLockedWearable(userID);
        let savedheadgear = [];
        process.wearable[userID].wornwearable.forEach((g) => {
            if (locks.includes(g)) {
                savedheadgear.push(g)
            }
        })
        process.wearable[userID].wornwearable = savedheadgear;
        if (process.wearable[userID].wornwearable.length == 0) {
            delete process.wearable[userID]
        }
    }
    if (process.readytosave == undefined) { process.readytosave = {} }
    process.readytosave.wearable = true;
}

const getWearableName = (userID, wearablename) => {
    if (process.wearable == undefined) { process.wearable = {} }
    let convertmittenarr = {}
    for (let i = 0; i < process.wearableslist.length; i++) {
        convertmittenarr[process.wearableslist[i].value] = process.wearableslist[i].name
    }
    if (wearablename) {
        return convertmittenarr[wearablename];
    }
    else {
        return undefined;
    }
}

exports.wearabletypes = wearabletypes
exports.loadWearables = loadWearables;

exports.assignWearable = assignWearable
exports.getWearable = getWearable
exports.deleteWearable = deleteWearable
exports.getWearableName = getWearableName;

exports.addLockedWearable = addLockedWearable;
exports.getLockedWearable = getLockedWearable;
exports.removeLockedWearable = removeLockedWearable; 