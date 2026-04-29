// Function space for Delves, the function for players to have stats and encounters. 
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
    hall1: {
        name: "Long Corridor"
    }
}