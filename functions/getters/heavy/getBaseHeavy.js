const { heavytypes } = require("../../heavyfunctions");


/**************
 * Gets the base heavy type by ID
 * 
 * - (string) type - The heavy bondage's item ID
 * ---
 * ##### Returns the base heavy definition. All heavy definitions have:
 * - name: The readable name of the Heavy Bondage
 * - value: The item id of the Heavy
 * - tags?: Tags for material on the item
 * - denialCoefficient: Multiplier for arousal denial
 * - heavytags: Array of "arms", "legs" or "container" for what types this heavy blocks
 * - noself?: If true, prevents putting on self
 * - noother?: If true, prevents putting on others
 * - namefunction?: async (interaction, data) => Sets custom name on heavy object
 **************/
const getBaseHeavy = (type) => {
    return heavytypes.find((h) => h.value === type);
};

exports.getBaseHeavy = getBaseHeavy;