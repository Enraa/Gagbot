const { getBaseToy } = require("../toy/getBaseToy");
const { getToys } = require("../toy/getToys");

const arousalDRs = [1.0, 0.7, 0.4, 0.1, 0.05, 0.05];

/********
 * Given a user, returns the actual amount of arousal they are gaining. This will sort the arousal gains into an array and then multiply them to calculate diminishing returns.
 * 
 * - (server ID) serverID - The server this is running on
 * - (user ID) userID - The user wearing the toys
 * ---
 * ##### Returns a float with the total change in arousal
 ********/
function getArousalGenerationFromToys(serverID, userID) {
    // Get a list of all worn toys mapped by their output arousal generation. 
    let alltoysarousal = getToys(serverID, userID).map((t) => getBaseToy(t.type).calcVibeEffect({ intensity: t.intensity, serverID: serverID, userID: userID }))

    // If the list is 0 or 1 entry long, get outta here.
    if (alltoysarousal.length == 0) { return 0 }
    if (alltoysarousal.length == 1) { return alltoysarousal[0] }

    // Now sort the list!
    alltoysarousal.sort((a,b) => b - a)

    // For each, descending, multiply by the same place in arousalDRs, or 0.
    for (let i = 0; i < alltoysarousal.length; i++) {
        if (arousalDRs.length > i) {
            alltoysarousal[i] = alltoysarousal[i] * arousalDRs[i];
        }
        else {
            alltoysarousal[i] = 0;
        }
    }

    // Finally, return the summed list using a reducer. 
    return alltoysarousal.reduce((prev,curr) => prev + curr, 0);
}

exports.getArousalGenerationFromToys = getArousalGenerationFromToys;