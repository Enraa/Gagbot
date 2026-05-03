// Function space for Delves, the function for players to have stats and encounters. 

const { ContainerBuilder } = require("discord.js")
const { getHeadwear, getBaseHeadwear } = require("./headwearfunctions")
const { getHeavyRestrictions } = require("./heavyfunctions")
const { addArousal } = require("./vibefunctions")

/*****************
 * Players will utilize their condition as returned by gags, masks, heavy bondage and the like. 
 * 
 * They can also build a stat allocation 1-20 with 120 points prior to entry with the following stats: 
 * Main
 * - Strength
 * - Dexterity
 * - Intelligence
 * - Stamina
 * Kink
 * - Dominance
 * - Submissiveness
 * - Rigger
 * - Rope Bunny
 * Affinity
 * - Latex
 * - Leather
 * - Metal
 * - Magic
 * 
 * Players will begin a delve with Resolve equal to 5 + their stamina stat. Stamina will generally be unused in skill checks, this is just for health pool. 
 * Skill checks will function on a system of 50% chance if their skill is exactly the same as the room's skill check, +/-20% for each level difference,
 * with a floor of 10% and a ceiling of 100%. Note that statspecial will modify this *after* a skill check, so actual rates may be higher or lower than expected.
 * 
 * Some floor outcomes may add inventory to a player. This inventory persists and may provide bonuses. This is the only way to receive Delve Chastity keys, which are the only way to unlock Delve chastity devices. 
 * 
 * When a player's Resolve reaches 0, they will be forced to encounter a room which terminates the Delve immediately. 
 * 
 * If a player successfully reaches thresholds in 10 floor intervals, a modifier will be applied to skill checks, to a maximum of 18 in the appropriate skill check. A player who has at least 20 in a skill will always succeed.
 */

/*************
 * Delve Rooms that can be chosen. Delve rooms will have the following properties:
 * - name: Human readable name of the room
 * - shortdesc: Simple one sentence that describes the room. 
 * - longdesc: Nuanced and flavored paragraph to describe the room.
 * - extradesc: Function which will modify the longdesc as needed. 
 * - choices: List of options with the following properties:
 *     - name: Action Name, will display on the button
 *     - shortoutcome_success: Simple one sentence describing successfully completing the action
 *     - longoutcome_success: Nuanced paragraph describing successfully completing the action
 *     - shortoutcome_failure: Simple one sentence describing failing the action
 *     - longoutcome_failure: Nuanced paragraph describing the cascade of failures in this action.
 *     - statweight: List of stats with a number corresponding to the player level. If empty, this is a default action with a 100% success rate unless statspecial provides alternatives.
 *     - statspecial: Further modifiers to statweight, which can check if the player is bound with a certain device, etc. 
 *     - successfunction: May give the player items, potentially add Resolve.
 *     - failurefunction: Generally this will reduce Resolve. May apply restraints or other things to player.
 * - weight: How likely this room is to show up
 * - weightspecial: Modify the weight by this much according to the player's condition
 * - weightforce: If undefined, this is not used. If function returns 1, this is forced as the next room, if 0, this can never roll. 
 *************/
const delveroomchoices = {
    // Special Floors
    // These floors can't normally roll except under special conditions. 
    // This is the entrance room and will always be floor 0. 
    delveentrance: {
        name: "Deepbound Palace Entrance",
        shortdesc: "An ornate door stands in front of you, an entrance to an underground crypt and it's lined with images of restraints.",
        longdesc: "You arrive at the entrance of the Deepbound Palace. It's smooth wall is decorated by images of people wearing restraints and a mural above the door depicting several kneeling submissives around a woman sitting in a chair. She is clad with what you recognize to be a black minidress in the image. The door handle is unremarkable, but it reminds you of a handle for a flogger. ",
        extradesc: (userID, text, delvedata, resolve) => { return true },
        revisitshortdesc: "You step back out of the bondage crypt and into the sunlight.",
        revisitlongdesc: "The warmth of the sun washes over you as you step out of the crypt full of restraints. A forest stretches all around your vision, blocking any reasonable traversal away from here. You might as well head back in...",
        revisitextradesc: (userID, text, delvedata, resolve) => { return true },
        choices: [
            {
                name: "Proceed Into the Dungeon",
                shortoutcome_success: "You pull on the heavy stone door and step inside, ready for your bound adventure!.",
                longoutcome_success: "Despite your senses telling you everything is wrong, you still continue forth. A sickening thought in the back of your head worries that this particular iteration of the Deepbound Palace may be cursed, but that is a problem for the developers of this place to sort out later.",
                shortoutcome_failure: "Undeterred by the obvious glitches in reality, you proceed. (Failure path, report)",
                longoutcome_failure: "Despite your senses telling you everything is wrong, you still continue forth. A sickening thought in the back of your head worries that this particular iteration of the Deepbound Palace may be cursed, but that is a problem for the developers of this place to sort out later. (Failure path, report)",
                statweight: {},
                statspecial: (userID, delvedata, resolve) => { return true },
                successfunction: (userID, delvedata, resolve) => { return true },
                failurefunction: (userID, delvedata, resolve) => { return true }
            }
        ],
        weight: 0,
        weightspecial: (userID, weight) => { return true },
        weightforce: () => { return 0 },
        accentcolor: 0xFFFFFF
    },
    // This is the fallback if a room doesn't exist
    errorroom: {
        name: "Room of Pink Squares",
        shortdesc: "You encounter a room full of pink squares and exclamation marks. You shouldn't be here. (Bug, report!)",
        longdesc: "Gone is the dungeon aesthetic, replaced by a room full of odd looking pink squares over where objects on a table in the center of the room would be. The room is completely silent, even devoid of the sounds of your own breathing. You get the irking feeling that you really should not be here. (This is a bug, please report!)",
        extradesc: (userID, text, delvedata, resolve) => { return true },
        revisitshortdesc: "You return to the pink square room. It remains in it's dormant state and it's still unsettling.",
        revisitlongdesc: "You return to the pink square room that definitely does not belong in the Deepbound Palace. You can't detect even a hint of life or anything within these walls.",
        revisitextradesc: (userID, text, delvedata, resolve) => { return true },
        choices: [
            {
                name: "Proceed Onwards",
                shortoutcome_success: "Undeterred by the obvious glitches in reality, you proceed.",
                longoutcome_success: "Despite your senses telling you everything is wrong, you still continue forth. A sickening thought in the back of your head worries that this particular iteration of the Deepbound Palace may be cursed, but that is a problem for the developers of this place to sort out later.",
                shortoutcome_failure: "Undeterred by the obvious glitches in reality, you proceed. (Failure path, report)",
                longoutcome_failure: "Despite your senses telling you everything is wrong, you still continue forth. A sickening thought in the back of your head worries that this particular iteration of the Deepbound Palace may be cursed, but that is a problem for the developers of this place to sort out later. (Failure path, report)",
                statweight: {},
                statspecial: (userID, delvedata, resolve) => { return true },
                successfunction: (userID, delvedata, resolve) => { return true },
                failurefunction: (userID, delvedata, resolve) => { return true }
            }
        ],
        weight: 0,
        weightspecial: (userID, weight) => { return true },
        weightforce: () => { return 0 },
        accentcolor: 0xFF4444
    },
    hall1: {
        name: "Long Corridor",
        shortdesc: "You encounter a long, empty hallway devoid of obstacles or inhabitants.",
        longdesc: "You turn a corner and encounter a long hallway, stretching so far back that the end of it is swallowed by the inky black void of darkness. The floor is plain and sturdy, while the walls textured only by the carved rock of the dungeon. Nothing is out of place and you can proeed without worry. ",
        extradesc: (userID, text, delvedata, resolve) => { return true },
        revisitshortdesc: "You return to the long, empty corridor.",
        revisitlongdesc: "You step back into the long, empty corridor. No inhabitants nor obstacles have shown up since the last time you were here. It still seems to stretch into a void infinity over the plain floor and carved rock walls.",
        revisitextradesc: (userID, text, delvedata, resolve) => { return true },
        choices: [
            {
                name: "Proceed Carefree",
                shortoutcome_success: "You step forth through the hallway, your footsteps echoing as you finally reach the exit.",
                longoutcome_success: "Despite appearances, you proceed forward through the hallway without concern. Nothing bad can possibly happen, and there doesn't appear to be any traps anyway. You almost close your eyes in blissful unawareness as you walk forward until you finally come to the exit of the hallway. Hopefully other rooms will be as simple and easy as this one!",
                shortoutcome_failure: "This cannot fail. (This is a bug, please report!)",
                longoutcome_failure: "Despite a 100% success rate, you somehow failed. (This is a bug, please report!)",
                statweight: {},
                statspecial: (userID, delvedata, resolve) => { return true },
                successfunction: (userID, delvedata, resolve) => { return true },
                failurefunction: (userID, delvedata, resolve) => { return true }
            }
        ],
        weight: 10,
        weightspecial: (userID, weight) => { return true },
        weightforce: undefined,
        accentcolor: 0x0099ff
    },
    garden_intoxicatingspores: {
        name: "Spore Garden",
        shortdesc: "You find a room full of foliage including plants with pink flowers. The room gives off a faint pink haze.",
        longdesc: "You encounter a room full of vines, flowers and plants snaking around stone pillars. The vines look innocuous enough but the flowers are pink and in full bloom as the room gives off a distinctly pink haze. A small whiff makes you feel slightly woozy as you find yourself suddenly considering how you feel about the various bondage restraints you usually encounter in this place.",
        extradesc: (userID, text, delvedata, resolve) => {
            if (getHeadwear(userID).find((f) => getBaseHeadwear(f)?.tags?.includes("gasmask"))) {
                text = `${text}\n\nYou are wearing a gasmask, so maintaining a clear head in this place should be trivial.`
            }
        },
        revisitshortdesc: "You return to the long, empty corridor.",
        revisitlongdesc: "You step back into the long, empty corridor. No inhabitants nor obstacles have shown up since the last time you were here. It still seems to stretch into a void infinity over the plain floor and carved rock walls.",
        revisitextradesc: (userID, text, delvedata, resolve) => { return true },
        choices: [
            {
                name: "Proceed",
                shortoutcome_success: "You walk through the room with shallow breaths and make it to the other side with no issue.",
                longoutcome_success: "Taking a deep breath, you walk through the room. The haze clouds your vision a bit, but you manage to avoid touching any of the flowers and make it to the other side without any issues. A huge sigh of relief comes as you finally through the door with a clear head.",
                shortoutcome_failure: "You attempt to walk through the room but collapse momentarily, taking a deep whiff of the pink haze. You're left dazed, confused and horny as you make it to the other side.",
                longoutcome_failure: "You take a deep breath and attempt to walk through the room, but you lose your concentration as you trip over one of the vines. Your face falls forward and into one of the blooming floors, throwing forth a floating shower of spores that assault your senses. Your mind is racing in the thoughts of being tied up now as you barely manage to crawl the rest of the way to the other side. Perhaps you should keep crawling so you don't trip again...",
                statweight: {
                    dexterity: 10,
                },
                statspecial: (userID, delvedata) => {
                    if (getHeadwear(userID).find((f) => getBaseHeadwear(f)?.tags?.includes("gasmask"))) {
                        // If they are wearing a gasmask, they will always succeed.
                        stats = {}; // This makes it 100%
                    }
                    else if (getHeavyRestrictions(userID)?.touchself && !getHeavyRestrictions(userID)?.touchothers) {
                        // If their legs are bound, they will auto fail this. 
                        stats = {
                            dexterity: 99
                        }
                    }
                },
                successfunction: (userID, delvedata, resolve) => { return true },
                failurefunction: (userID, delvedata, resolve) => {
                    addArousal(userID, 20)
                    resolve = Math.max(resolve - 5, 0)
                }
            },
            {
                name: "Burn it",
                shortoutcome_success: "You cast a fireball, exploding the room in purging fire and then walk to the other side.",
                longoutcome_success: "You wave your hands to cast a fireball. A moment later, the room explodes in bright orange fire as it consumes everything, from the vines and leaves all the way to the wretched pink flowers. The haze quickly fades away as the particles are seared into harmless nothingness. Satisfied the room is clear, you continue forth to the other side with a clear mind.",
                shortoutcome_failure: "You attempt to cast the fireball, but the plant grabs your wrist and fizzles your spell. You make it to the other side, but only after breathing in more of the fumes.",
                longoutcome_failure: "You wave your hands to cast the fireball spell, but the plant catches your wrist with a stray vine. Your spell fizzles away as it pulls you towards one of it's flowering blooms. It would be so easy to just let it tie you up... but no! You manage to pull away from the sentient vine and barely make your way to the other side of the room. The feeling of the vine holding you captive haunts your thoughts for a brief moment.",
                statweight: {
                    intelligence: 10,
                },
                statspecial: (userID, stats) => { return true },
                successfunction: (userID, delvedata, resolve) => {
                    
                },
                failurefunction: (userID, delvedata, resolve) => {
                    addArousal(userID, 20)
                    resolve = Math.max(resolve - 5, 0)
                }
            }
        ],
        weight: 5,
        weightspecial: (userID, weight) => { return true },
        weightforce: undefined,
        accentcolor: 0x0099ff
    },
}

/*********
 * Sets the next Delve room by choice. If choice is not specified, the user is starting a new delve. This will always default to the delveentrance room.
 * 
 * - (user ID) user - The user ID doing the delve
 * - (string) choice - The prop name in delveroomchoices
 *********/
function setNextDelveRoom(user, choice) {
    if ((getCurrentFloor(user) == undefined)) {
        process.delveuserdata[user] = {
            floorarr: ["delveentrance"],
            floorscompleted: 0,
            floor: 0,
            tempbuffs: [],
        }
    }
    else {
        process.delveuserdata[user].floorarr.push(choice);
    }
}

/********
 * Gets the current floor the user is on. Returns undefined if they're not on a delve, 0 if at delve entrance. 
 * 
 * - (user ID) user - The user ID doing the delve
 ********/
function getCurrentFloor(user) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, return the floor
        return process.delveuserdata[user].floor
    }
    else {
        // They're not in the Delve.
        return undefined;
    }
}

/*******
 * Get a floor's props. 
 * 
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - Floor number they are on
 * - (string) prop - Name of the property to save
 * - (any) value - Value to store in the prop key
 *******/
function getDelveFloorState(user, floor) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, now check what floor they're on
        if (process.delveuserdata[user].floordata == undefined) { process.delveuserdata[user].floordata = [] }
        if (process.delveuserdata[user].floordata[floor] == undefined) { process.delveuserdata[user].floordata[floor] = {} }
        return process.delveuserdata[user].floordata[floor]
    }
    else {
        return undefined;
    }
}

/*******
 * Set a floor prop on the floordata array. This is data only used by the floor itself. 
 * 
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - Floor number they are on
 * - (string) prop - Name of the property to save
 * - (any) value - Value to store in the prop key
 *******/
function setDelveFloorState(user, floor, prop, value) {
    if (process.delveuserdata == undefined) { process.delveuserdata = {} }
    if (process.delveuserdata[user]) {
        // They started a delve, now check what floor they're on
        if (process.delveuserdata[user].floordata == undefined) { process.delveuserdata[user].floordata = [] }
        if (process.delveuserdata[user].floordata[floor] == undefined) { process.delveuserdata[user].floordata[floor] = {} }
        process.delveuserdata[user].floordata[floor][prop] = value;
    }
}

/*******
 * Generates the output modal and returns it. This should be an output for a message.send function. 
 * 
 * - (user ID) user - The user ID doing the delve
 * - (integer) floor - The floor number the user is visiting.
 *******/
function generateDelveModal(user, floor) {
    let floordata = delveroomchoices[floor] ?? delveroomchoices["errorroom"]

    let outcontainer = new ContainerBuilder()
        .setAccentColor(floordata.accentcolor)
}