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

    // Condition to check if wearer is wearing a potential blocker
    this.blocker = (data) => { return false }

    // Condition to allow modification
    this.canModify = (data) => { return true };

    // Condition that rolls a fumble function, returning it's results
    this.fumble = (data) => { return 0 };

    // Discard function if the .fumble causes it
    this.discard = (data) => { return false }

    // Action when equipping
    this.onEquip = (data) => { return true };

    // Calculation for effective arousal change
    // Note, this should be used for checks more focused around the vibe - it will be
    // further multiplied by the chastity's checks for this, if applicable. 
    this.calcVibeEffect = (data) => { return 0 }

    // Name for the toy
    this.toyname = "Default Toy"

    // Category for the toy
    this.category = "default"
}

exports.Toy = Toy;