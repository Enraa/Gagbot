/*******
 * Get delve player stats. Otherwise, create a template for the player. 
 * 
 * - (user id) user - User ID doing the Delve
 *******/
function getDelvePlayerStats(user) {
    if (process.delveuserstats == undefined) { process.delveuserstats = {} }
    if (process.delveuserstats[user] == undefined) {
        // Create a template if it does not exist. 
        process.delveuserstats[user] = {
            // Main
            strength: 6,
            dexterity: 6,
            intelligence: 6,
            stamina: 6,
            // Kink
            dominance: 6,
            submissive: 6,
            rigger: 6,
            ropebunny: 6,
            // Affinity
            latex: 6,
            leather: 6,
            metal: 6,
            magic: 6,
            // Unallocated
            unallocated: 24,
            level: 1
        }
    }
    return process.delveuserstats[user]
}

exports.getDelvePlayerStats = getDelvePlayerStats;