/********
 * Gets the base corset definition for a corset by type
 * 
 * - (string) corsettype - The ID of the corset to retrieve
 * ---
 * ##### Returns the base corset definition. All corset definitions have the following properties (tightness 1 to 15):
 * - maxBreath: The most breath a wearer can have (56 -> 2)
 * - minBreath: The least breath a wearer can have (-120 -> -20)
 * - breathRecovery: Breath recovered per second (4.6 -> 0.008)
 * - gaspCoefficient: The likelihood of gasps being added
 * - gaspLimit: The breath to start adding gasps (28 -> 1)
 * - silenceLimit: The minimum breath before no longer being able to speak (-56 -> -2)
 * - minWords: At least this number of words can be said (5 -> 0)
 * - category: The category of the corset (default)
 * - tags: Any tags related to the corset as an array
 * - name: The human readable name of the corset
 * ---
 * **Get Functions:**
 * - getMaxBreath: ({ tightness }) => Returns maxBreath at tightness
 * - getMinBreath: ({ tightness }) => Returns minBreath at tightness
 * - getBreathRecovery: ({ tightness }) => Returns breathRecovery at tightness
 * - getGaspLimit: ({ tightness }) => Returns gaspLimit at tightness
 * - getSilenceLimit: ({ tightness }) => Returns silenceLimit at tightness
 * - getMinWords: ({ tightness }) => Returns minWords at tightness
 * ---
 * **Events:**
 * - afterUsingBreath: (data) => Called after using breath to speak
 * - onEquip: (data) => Called immediately after wearing the corset
 * - onUnequip: (data) => Called immediately after removing the corset
 * - onAdjustTightness: (data) => Called when changing tightness on existing corset
 ********/
function getBaseCorset(corsettype) {
	return process.corsettypes[corsettype];
}

exports.getBaseCorset = getBaseCorset;