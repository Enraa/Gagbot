/******
 * List of constants related to arousal.
 * 
 ******/

/**
 * Arousal initial coefficient. Arousal divided by this is how much arousal we want to gain per minute.
 */
exports.initialcoefficient = 10.0

/**
 * Percentage bonus. This is the percentage granted to the result regardless of what is rolled.
 */
exports.arousalpercentagebonus = 0.2;

/**
 * Maximum Arousal Gain per minute. Any arousal gain above this is capped. 
 */
exports.maximumarousalgainperminute = 100.0;

/** 
 * Diminishing Returns Factor. All toy standard arousal gain is multiplied by these numbers.
 * - [1.0, 0.7, 0.4, 0.1, 0.05, 0.01]
 */
exports.arousaldiminishingreturns = [1.0, 0.7, 0.4, 0.1, 0.05, 0.01]

/**
 * Decay Coefficient. This % of arousal is naturally lost per minute before decay modifications.
 */
exports.arousaldecaycoefficient = 0.2;

/**
 * Arousal Reset Limit. Any arousal below this number is immediately set to 0.
 */
exports.arousalresetlimit = 0.1;

/**
 * Orgasm Limit. Arousal must reach this number to orgasm. This is modified by chastity and orgasm resistance.
 */
exports.arousalorgasmlimit = 10;

/**
 * Orgasm Immunity. This is the length of time during which a user is "immune" to arousal gain.
 */
exports.arousalorgasmimmunity = 60000;

/**
 * Orgasm Cooldown. This is the length of time a user must wait before they can attempt to let go again
 */
exports.arousalorgasmcooldown = 60000; // This is currently NOT used

/**
 * Maximum Frustration. This is the maximum amount of frustration a wearer can have
 */
exports.arousalmaxfrustration = 50

/**
 * Frustration Coefficient. This is the rate at which frustration grows while belted
 */
exports.arousalfrustrationcoefficient = 1.06

/**
 * Frustration Breakpoint. This is where Frustration growth reduces
 */
exports.arousalfrustrationbreakpoint = 0.7

/**
 * Frustration Breakpoint Time. This is when that breakpoint should be hit
 */
exports.arousalfrustrationbreakpointtime = Math.log(0.7 * 50) / Math.log(1.06);