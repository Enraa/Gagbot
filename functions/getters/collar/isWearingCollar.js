const { getCollar } = require("./getCollar");

/***********
 * Returns true/false if the user is wearing a certain collar type or not. 
 * 
 * - (server id) serverID - The server this is running on
 * - (user id) userID - The user wearing the collar
 * - (string) collartype - The collar type to check
 * ---
 * ##### Returns true or false, if the user is wearing this collar type or not. 
 ***********/
function isWearingCollar(serverID, userID, collartype) {
    return ((getCollar(serverID,userID)?.collartype === collartype) || (getCollar(serverID,userID)?.additionalcollars?.includes(collartype)))
}

exports.isWearingCollar = isWearingCollar;