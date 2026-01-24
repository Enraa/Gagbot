// This is the base definition for a toy. Any new functionality that references a property
// MUST have that reference here to ensure all toys are constructed with a default. 
// The default values should generally "do nothing" as they will be overridden by the 
// default.js in each folder and then the specific toy after that. 
//
// Note to self, because I can be dumb - function () {} takes the CURRENT object context, while 
// arrow functions take the PARENT context. Context is important for the this keyword.
function Toy() {
    // These values are used whenever they're unspecified on the vibe in this folder.
    // Arousal gain per intensity for this vibe type
    this.vibescale = (data) => { return 0 },

    // Intensity change for this vibe type
    this.intensitychange = (data) => { return 0 }

    // Post Letgo effect
    this.postLetGo = (data) => { return false }

    // Condition for allowing equip
    this.canEquip = (data) => { return true }

    // Condition for allowing unequip
    this.canUnequip = (data) => { return true }

    // Condition to force unequip on refresh
    this.forceUnequip = (data) => { return false }

    // Calculation for effective arousal
    // Note, this should be used for checks more focused around the vibe - it will be
    // further multiplied by the chastity's checks for this, if applicable. 
    this.calcArousal = function (data) { return data.arousal * this.vibescale() }

    // Name for the toy
    this.toyname = "Default Toy"

    // Category for the toy
    this.category = "default"
}

exports.Toy = Toy;