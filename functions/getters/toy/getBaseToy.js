/********* 
 * Gets the base toy type by ID.
 * 
 *  - (string) toytype - the type of toy to retrieve
 * ---
 * ##### Returns the base toy definition. All toy definitions have:
 * - toyname: The full name of the toy
 * - category: The category of the toy
 * ---
 * **Get Functions**
 * - vibescale: (data) => Get the arousal gain per intensity for this toy
 * - canEquip: (data) => If true, can equip the toy
 * - canUnequip: (data) => If true, cannot remove the toy
 * - forceUnequip: (data) => If true, the toy is forcibly removed on next bot tick
 * - blocker: (data) => If true, the user could be blocked
 * - canModify: (data) => If true, can modify the toy
 * - fumble: (data) => Rolls a fumble function, returning relevant results (0 - Success,1 - Fail, 2 - Lost Key)
 * - calcVibeEffect: (data) => Calculates the effective arousal gain in arousal updates
 * ---
 * **Event functions**
 * - intensitychange: (data) => Fired when intensity for this toy is changed
 * - postLetGo: (data) => Fired after letting go and clearing arousal
 * - discard: (data) => If a fumble occurred, this is called to discard the key
 **********/
function getBaseToy(toytype) {
    return process.toytypes[toytype];
}

exports.getBaseToy = getBaseToy;