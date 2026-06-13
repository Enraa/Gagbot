/**********
 * Get a bar representing the user's current arousal over denial.
 * 
 * - (user id) userID - The user who is aroused
 * ---
 * ##### Returns a string representing a filled bar for arousal percentage
 **********/
function getArousalBar(userID) {
    const arousal = getArousal(userID);
    const denialCoefficient = calcDenialCoefficient(userID);
    const orgasmLimit = ORGASM_LIMIT;
    const filledbar = "■";
    const unfilled = "□";

    let targetorgasmthresh = orgasmLimit * denialCoefficient;
    let percentagefilled = arousal / targetorgasmthresh;

    // Present this bar as a 20 segment string
    let stringout = ``;
    let currprog = 0.0;
    for (let i = 0; i < 10; i++) {
        currprog += 1 / 10;
        if (currprog < percentagefilled) {
            stringout = `${stringout}${filledbar}`;
        } else {
            stringout = `${stringout}${unfilled}`;
        }
    }

    return { bar: stringout, percentage: Math.round(percentagefilled * 100) };
}

exports.getArousalBar = getArousalBar;