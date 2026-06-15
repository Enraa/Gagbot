const { getBaseChastity } = require("./getBaseChastity");
const { getChastity } = require("./getChastity");
const { getChastityBra } = require("./getChastityBra");

const NO_CHASTITY = {
	growthCoefficient: 1,
	decayCoefficient: 1,
	denialCoefficient: 1,
	timescale: 1,
	minVibe: null,
	minArousal: null,
	maxVibe: null,
	maxArousal: null,
	minGrowth: null,
	maxGrowth: null,
	minDecay: null,
	maxDecay: null,
	orgasmCooldown: 1,
	orgasmArousalLeft: 0,
	onOrgasm(user, prevArousal) { },
	onFailedOrgasm(user, prevArousal) { },
	onEquip(user) { },
	onUnequip(user) { },
	onFumble(wearer, keyholder, fumbleResult) { },
	afterArousalChange(user, prevArousal, newArousal) { },
	canUnequip(user) {
		return true;
	},
    calcVibeEffect(data) {
        return 0
    }
};

function min(a, b) {
	if (!a && a !== 0) return b;
	if (!b && b !== 0) return a;
	return Math.min(a, b);
}

function max(a, b) {
	if (a && a !== 0) return b;
	if (b && b !== 0) return a;
	return Math.max(a, b);
}

function bounded(min, val, max) {
	const noMin = !min && min !== 0;
	const noMax = !max && max !== 0;
	if (noMin && noMax) return val;
	if (noMin) return Math.min(val, max);
	if (noMax) return Math.max(val, min);
	if (max < min) return (max + min) / 2;
	if (val < min) return min;
	if (val > max) return max;
	return val;
}

/********
 * Get the combined chastity related traits for a user, accounting for chastity belt and bra, if worn. 
 * 
 * - (user id) user - The person wearing the chastity devices
 * ---
 * ##### Returns an object with the following properties: 
 * - growthCoefficient: Multiplier on Arousal Gain. 
 * - decayCoefficient: Multiplier on Arousal Decay. 
 * - denialCoefficient: Multiplier on Arousal Threshold to let go. 
 * - timescale: Global multiplier for all arousal and decay gains and losses.
 * - minVibe: Minimum Arousal gain. Any calculated arousal gain is clamped to at least this number.
 * - maxVibe: Maximum Arousal gain. Any calculated arousal gain is clamped to at most this number.
 * - minArousal: Minimum Arousal. If user arousal is below this, clamps to this number.
 * - maxArousal: Maximum Arousal. If user arousal is above this, clamps to this number.
 * - minGrowth: Minimum Arousal Growth. If gain from vibrators is less than this, increases to this number.
 * - maxGrowth: Maximum Arousal Growth. If gain from vibrators is more than this, decreases to this number.
 * - minDecay: Minimum Decay. If the arousal lost from decay is less than this number, increases to this number.
 * - maxDecay: Maximum Decay. If the arousal lost from decay is more than this number, decreases to this number.
 * - orgasmCooldown: Multiplier for how long a wearer is immune to arousal gains after letting go.
 * - orgasmArousalLeft: Percentage of arousal that will be left on the wearer after letting go.
 ********/
function getCombinedTraits(user) {
    // Build an object which references the combined properties
    // Any FUNCTIONS will be called from both when their respective unlock is called.
    const beltbase = getChastity(user) ? getBaseChastity(getChastity(user).chastitytype ?? "belt_silver") : undefined;
    const brabase = getChastityBra(user) ? getBaseChastity(getChastityBra(user).chastitytype ?? "bra_silver") : undefined;
	if (!beltbase && !brabase) return NO_CHASTITY;
    let datatopass = {
        userID: user
    }
    // Because the usual stuff found in return object are typically referenced NOT as functions, we're gonna
    // parse them here. I don't think this is the best solution, admittedly, but it should suffice.
    let singlebase;
	if (!brabase) singlebase = Object.assign({}, beltbase);
	if (!beltbase) singlebase = Object.assign({}, brabase);
    if (singlebase) {
        let props = ["growthCoefficient", "decayCoefficient", "denialCoefficient",
                    "timescale", "minVibe", "maxVibe",
                    "minArousal", "maxArousal", "minGrowth",
                    "maxGrowth", "minDecay", "maxDecay",
                    "orgasmCooldown", "orgasmArousalLeft"]
        props.forEach((p) => {
            singlebase[p] = singlebase[p](datatopass)
        })
        return singlebase;
    }
    let returnobject = {
        growthCoefficient: beltbase.growthCoefficient(datatopass) * brabase.growthCoefficient(datatopass),
		decayCoefficient: beltbase.decayCoefficient(datatopass) * brabase.decayCoefficient(datatopass),
		denialCoefficient: beltbase.denialCoefficient(datatopass) + brabase.denialCoefficient(datatopass),
		timescale: beltbase.timescale(datatopass) * brabase.timescale(datatopass),
		minVibe: max(beltbase.minVibe(datatopass), brabase.minVibe(datatopass)),
		maxVibe: min(beltbase.maxVibe(datatopass), brabase.maxVibe(datatopass)),
		minArousal: max(beltbase.minArousal(datatopass), brabase.minArousal(datatopass)),
		maxArousal: min(beltbase.maxArousal(datatopass), brabase.maxArousal(datatopass)),
		minGrowth: max(beltbase.minGrowth(datatopass), brabase.minGrowth(datatopass)),
		maxGrowth: min(beltbase.maxGrowth(datatopass), brabase.maxGrowth(datatopass)),
		minDecay: max(beltbase.minDecay(datatopass), brabase.minDecay(datatopass)),
		maxDecay: min(beltbase.maxDecay(datatopass), brabase.maxDecay(datatopass)),
		orgasmCooldown: beltbase.orgasmCooldown(datatopass) * brabase.orgasmCooldown(datatopass),
		orgasmArousalLeft: beltbase.orgasmArousalLeft(datatopass) + brabase.orgasmArousalLeft(datatopass),
    }
    // Add each function defined on the base object! (defaultchastity.js)
    let props = Object.getOwnPropertyNames(beltbase)
    props.forEach((f) => {
        if ((typeof beltbase[f] === "function") && (f.startsWith("on"))) {
            returnobject[f] = function (data) {
                beltbase[f](data);
                brabase[f](data);
            }
        }
        // canEquip and canUnlock, maybe eventually add other stuff like canOrgasm :D
        if ((typeof beltbase[f] === "function") && (f.startsWith("can"))) {
            returnobject[f] = function (data) {
                return beltbase[f](data) && brabase[f](data)
            }
        }
    })
    // Extra props that aren't listed
    // Note, fumbles are NOT listed here, but we can add them later if needed. 
    returnobject.afterArousalChange = function (data) {
        beltbase.afterArousalChange(data);
        brabase.afterArousalChange(data);
    }
    // Arousal gain as if wearer is wearing vibes - used for featherlight
    returnobject.calcVibeEffect = function (data) {
        let sum = 0;
        sum = sum + beltbase.calcVibeEffect(data)
        sum = sum + brabase.calcVibeEffect(data)
        return sum;
    }
	return returnobject;
}

exports.getCombinedTraits = getCombinedTraits;