const { getUserVar, setUserVar } = require("../../functions/usercontext")
const { clearArousal, getArousal, addArousal, getChastity } = require("../../functions/vibefunctions")

// Seal of Cyclical Time
// This Seal resets the wearer to their initial state every 3 minutes
// No Increase to denial when worn
exports.denialCoefficient = (data) => { return 1 }

// Events
exports.onEquip = (data) => {
    // Configure base arousal value
    if (!getUserVar(data.userID, "base_arousal") || getUserVar(data.userID, "base_arousal") == undefined) setUserVar(data.userID, "base_arousal", getArousal(data.userID) ?? 0);

    // Add a timer which will reset the arousal every 3 mins
    let chastityinterval = setInterval(() => {
        if ((getChastity(data.userID)?.chastitytype == "belt_seal_cyclical") && getUserVar(data.userID, "base_arousal")) {
            try {
                clearArousal(data.userID);
                addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            // They're somehow not wearing the belt anymore or something else broke. 
            try {
                clearInterval(chastityinterval);
                setUserVar(data.userID, "base_arousal", undefined);
            }
            catch (err) {
                console.log(err)
            }
        }
    }, 180000)
}

exports.onUnequip = (data) => {
    //  Add All Stored Arousal at once
    clearArousal(data.userID);
    addArousal(data.userID, getUserVar(data.userID, "base_arousal"));
    setUserVar(data.userID, "base_arousal", undefined);
}

// Tags
exports.tags = ["seal"]
// Name
exports.name = "Seal of Cyclical Time"