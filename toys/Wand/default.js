const { getOption } = require("../../functions/configfunctions")
const { rollKeyFumble } = require("../../functions/keyfindingfunctions")
const { canAccessChastity, addArousal, getChastity } = require("../../functions/vibefunctions")

// These values are used whenever they're unspecified on the vibe in this folder.
// Arousal gain per intensity for this vibe type
exports.vibescale = (data) => { return 1.0 }

// Intensity change for this vibe type
exports.intensitychange = (data) => { return 0 }

// Post Letgo
exports.postLetGo = (data) => { return false }

// Condition for allowing equip
exports.canEquip = (data) => { return true }

// Condition for allowing unequip
exports.canUnequip = (data) => { return true }

// Condition to force unequip on refresh
exports.forceUnequip = (data) => { return false }

// Condition to check if wearer is wearing a potential blocker
exports.blocker = (data) => { return false }

// Condition to allow modification
exports.canModify = (data) => { return true };

// Condition that rolls a fumble function, returning it's results
// 0 = Success, 1 = Fail, no loss, 2 = Fail, loss
exports.fumble = (data) => { return 0 };

// Discard function if the .fumble causes it
exports.discard = (data) => { return () => { return false }}

// Action when equipping
exports.onEquip = (data) => { addArousal(data.userID, 0.2) }; // hopefully enough to jumpstart, if not oh well

// Calculation for effective arousal
// Note, this should be used for checks more focused around the vibe - it will be
// further multiplied by the chastity's checks for this, if applicable. 
exports.calcVibeEffect = function (data) { 
    if (getChastity(data.userID)) {
        return data.intensity * (this.vibescale() * 0.25) // 25% effectiveness if in chastity
    }
    else {
        return data.intensity * this.vibescale()
    }
}

// Name for the toy!
exports.toyname = "Default Wand"

// Category Name for the toy
exports.category = "Wand"