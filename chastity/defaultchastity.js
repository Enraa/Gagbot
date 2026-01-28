// This is the base definition for a chastity device. Any new functionality that references a property
// MUST have that reference here to ensure all chastity devices are constructed with a default. 
// The default values should generally "do nothing" as they will be overridden by the 
// default.js in each folder and then the specific chastity after that. 
function Chastity() {
    // Growth Coefficient. Higher = more growth, this is a multiplier(?) on arousal gains
    this.growthCoefficient = (data) => { return 1 }

    // Decay Coefficient. This is a modifier for which decay is REDUCED by when in chastity
    this.decayCoefficient = (data) => { return 1 }

    // Denial Coefficient. This is the modifier for which arousal much reach to successfully let go
    this.denialCoefficient = (data) => { return 1 }

    // Minimum Vibrator Gain. This is multiplied by the vibeStrength of this device.
    // Any calculated arousal gain BELOW this number is brought up to this number.
    this.minVibe = (data) => { return -9999 }

    // Maximum Vibrator Gain. This is multiplied by the vibeStrength of this device.
    // Any calculated arousal gain ABOVE this number is brought down to this number.
    this.maxVibe = (data) => { return 9999 }

    // Vibrator Scaling. This is multipled with minvibe and maxvibe to get the effective arousal gain necessary
    this.vibeScaling = (data) => { return 0 }

    // Vibrator setting for THIS chastity device.
    this.vibelevel = (data) => { return 0 }

    // Timescale. All gains and decays are multiplied by this timescale. Can be used to receive props for arousal OR decay.
    this.timescale = (data) => { return 1 }

    // Minimum Arousal. Any time the wearer is BELOW this arousal number, they will be brought up to it. 
    this.minArousal = (data) => { return 0 }

    // Maximum Arousal. Any time the wearer is ABOVE this arousal number, they will be brought down to it.
    this.maxArousal = (data) => { return 999999 }

    // Minimum Growth. Each growth tick must be AT LEAST this amount after timescale.
    this.minGrowth = (data) => { return -99999 }

    // Maximum Growth. Each growth tick cannot be more than this amount after timescale
    this.maxGrowth = (data) => { return 99999 }

    // Minium Decay. Each decay tick must be AT LEAST this amount after timescale.
    this.minDecay = (data) => { return -99999 }

    // Maximum Decay. Each decay tick cannot be more than this amount after timescale
    this.maxDecay = (data) => { return 99999 }

    // Orgasm Cooldown. Orgasm Cooldown period length is multipled by this number.
    this.orgasmCooldown = (data) => { return 1 }

    // Orgasm Arousal Left. After Orgasm, this is the % of arousal that will be left on the wearer. 
    this.orgasmArousalLeft = (data) => { return 0 }

    // Roll Fumble Chance
    this.fumble = (data) => { return 0 }

    // Can Equip. Returns true if the wearer can equip this. 
    this.canEquip = (data) => { return true }

    // Can Unequip. Returns true if the wearer can remove this. 
    this.canUnequip = (data) => { return true }

    // Event: On Orgasm. Fired when the wearer successfully orgasms. 
    this.onOrgasm = (data) => { return false }

    // Event: On Failed Orgasm. Fired when the wearer fails to orgasm.
    this.onFailedOrgasm = (data) => { return false }

    // Event: On Equip. Fired when the wearer successfully puts on this device
    this.onEquip = (data) => { return false }

    // Event: On Unequip. Fired when the wearer successfully removes this device
    this.onUnequip = (data) => { return false }

    // Event: On Fumble. Fired when the wearer fumbles their key. 
    this.onFumble = (data) => { return false }

    // Event: After Arousal Change. Fired when the wearer's arousal changes
    this.afterArousalChange = (data) => { return false }

    // Calculate Arousal change
    this.calcVibeEffect = function (data) { return (this.vibelevel() * this.vibeScaling()) }

    // Category
    this.category = "default"

    // Name
    this.name = "Default Chastity"
}

exports.Chastity = Chastity;