/********* 
 * Gets the base chastity belt or bra type by ID.
 * 
 *  - (string) chastitytype - the type of chastity to retrieve
 * ---
 * ##### Returns the base chastity definition. All chastity definitions have:
 * - name: The full name of the chastity belt/bra
 * - category: The category of the chastity belt/bra
 * ---
 * **Get Functions**
 * - growthCoefficient: (data) => Multiplier on Arousal Gain
 * - decayCoefficient: (data) => Multiplier on Arousal Decay
 * - denialCoefficient: (data) => Multiplier on Arousal Threshold to let go.
 * - minVibe: (data) => Minimum Arousal gain. Any calculated arousal gain is clamped to at least this number
 * - maxVibe: (data) => Maximum Arousal gain. Any calculated arousal gain is clamped to at most this number
 * - vibeScaling: (data) => Multipllier for minvibe and maxvibe to get effective arousal gain
 * - vibelevel: (data) => Vibrator setting for this chastity device
 * - minArousal: (data) => Minimum Arousal. If user arousal is below this, clamps to this number
 * - maxArousal: (data) => Maximum Arousal. If user arousal is above this, clamps to this number
 * - minGrowth: (data) => Minimum Arousal Growth. If gain from vibrators is less than this, increases to this number
 * - maxGrowth: (data) => Maximum Arousal Growth. If gain from vibrators is more than this, decreases to this number
 * - minDecay: (data) => Minimum Decay. If the arousal lost from decay is less than this number, increases to this number
 * - maxDecay: (data) => Maximum Decay. If the arousal lost from decay is more than this number, decreases to this number
 * - orgasmCooldown: (data) => Multiplier for how long a wearer is immune to arousal gains after letting go
 * - orgasmArousalLeft: (data) => Percentage of arousal that will be left on the wearer after letting go
 * - fumble: (data) => Rolls a fumble function, returning relevant results (0 - Success,1 - Fail, 2 - Lost Key)
 * - canEquip: (data) => If true, can equip the chastity belt/bra
 * - canUnequip: (data) => If true, can remove the chastity belt/bra
 * - canAccessToys: (data) => If true, can access toys below this belt
 * - canAccessCorset: (data) => If true, can access corset below this belt
 * ---
 * **Event functions**
 * - onOrgasm: (data) => Fired when the user successfully orgasms
 * - onFailedOrgasm: (data) => Fired when the user fails to orgasm
 * - onEquip: (data) => Fired when the user puts on this device
 * - onUnequip: (data) => Fired when the user removes this device
 * - onFumble: (data) => Fired when the user fumbles their key
 * - afterArousalChange: (data) => Fired when the wearer's arousal changes
 * - onToyChange: (data) => Fired when the user's toys are changed
 * - onCorsetChange: (data) => Fired when the user's corset is changed
 * - calcVibeEffect: (data) => Calculates the Arousal change
 **********/
function getBaseChastity(chastitytype) {
    return process.chastitytypes[chastitytype];
}

exports.getBaseChastity = getBaseChastity;