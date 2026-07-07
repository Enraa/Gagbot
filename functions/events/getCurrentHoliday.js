/************
 * Outputs a current holiday, if any. Note, these use times given by the LOCAL time as known by the bot.
 * 
 * - (string) teststring - Which holiday to check for
 * ---
 * ##### Returns the string name of a current holiday, if any. Currently supports: 
 * - Locktober - October - Keys given to Gagbot will be held for the entire month. Resets will be logged.
 * - Christmas - December 25th
 * - NNN - November - /letgo will have a confirmation prompt. Attempts will be logged.
 ************/
function getCurrentHoliday(teststring) {
    let currtime = new Date();

    // Check for Locktober - the ENTIRE month of October
    if (currtime.getMonth() == 9) {
        return (teststring == "Locktober")
    }

    // Check for NNN - the ENTIRE month of November
    if (currtime.getMonth() == 9) {
        return (teststring == "NNN")
    }

    // Check for Christmas - The 25th of December
    if ((currtime.getMonth() == 11) && (currtime.getDate() == 25)) {
        return (teststring == "Christmas")
    }
}

exports.getCurrentHoliday = getCurrentHoliday;