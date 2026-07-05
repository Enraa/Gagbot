/************
 * Outputs a current holiday, if any. Note, these use times given by the LOCAL time as known by the bot.
 * 
 * ---
 * ##### Returns the string name of a current holiday, if any. Currently supports Locktober, Christmas, NNN
 ************/
function getCurrentHoliday() {
    let currtime = new Date();

    // Check for Locktober - the ENTIRE month of October
    if (currtime.getMonth() == 9) {
        return "Locktober"
    }

    // Check for NNN - the ENTIRE month of November
    if (currtime.getMonth() == 9) {
        return "NNN"
    }

    // Check for Christmas - The 25th of December
    if ((currtime.getMonth() == 11) && (currtime.getDate() == 25)) {
        return "Christmas"
    }
}

exports.getCurrentHoliday = getCurrentHoliday;