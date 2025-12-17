const { getVibe, getChastity } = require("./vibefunctions");
const { getMitten } = require("./gagfunctions");

// the arousal under which calculations get reset to avoid long back-calculations
const RESET_LIMT = 0.1;
// the minimum arousal required for frustration to also impact speach
const STUTTER_LIMIT = 1;
// the arousal needed for an unbelted user to orgasm
const ORGASM_LIMIT = 10;
// the coefficient for how much arousal is lost on orgasm
const RELEASE_STRENGTH = 16;
// the rate of arousal decay without orgasms when unbelted
const UNBELTED_DECAY = 0.05;
// the maximum frustration that can be reached
const MAX_FRUSTRATION = 100;
// the rate frustration grows at while belted
const FRUSTRATION_COEFFICIENT = 1.06;
// the portion of maximum frustration where the growth rate reduces
const FRUSTRATION_BREAKPOINT = 0.8;
const FRUSTRATION_BREAKPOINT_TIME =
  Math.log(FRUSTRATION_BREAKPOINT * MAX_FRUSTRATION) /
  Math.log(FRUSTRATION_COEFFICIENT);
// the rate frustration reaches the maximum after the breakpoint
const FRUSTRATION_MAX_COEFFICIENT = 7;

// return of 0 = never, 1+ = always
function getStutterChance(user) {
  let chance = getArousal(user);
  if (chance < RESET_LIMT) chance = 0;
  if (chance >= STUTTER_LIMIT) {
    const chastity = getChastity(user);
    if (chastity) {
      const hoursBelted = (Date.now() - chastity.timestamp) / (60 * 60 * 1000);
      chance += calcFrustration(hoursBelted);
    }
  }
  return chance / 100;
}

// return of 0 = never, 1+ = always
function getFumbleChance(user) {
  let chance = getArousal(user);
  const chastity = getChastity(user);
  if (chastity) {
    const hoursBelted = Date.now() - chastity.timestamp / (60 * 60 * 1000);
    chance += calcFrustration(hoursBelted);
  }

  // chance is increased if the user is wearing mittens
  if (getMitten(user)) {
    chance += 10;
    chance *= 1.1;
  }

  return chance / 100;
}

function getArousal(user) {
  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user] ?? { prev: 0, prev2: 0 };
  const now = Date.now();
  let timeStep = 1;
  if (arousal.timestamp && arousal.prev < RESET_LIMT) {
    timeStep = (now - arousal.timestamp) / (60 * 1000);
  }
  while (timeStep > 1) {
    const next = calcNextArousal(
      arousal.prev,
      arousal.prev2,
      calcGrowthCoefficient(user),
      calcDecayCoefficient(user),
      1,
      ORGASM_LIMIT,
      RELEASE_STRENGTH,
      true
    );
    arousal.prev2 = arousal.prev;
    arousal.prev = next;

    // abort loop early if arousal goes below the reset limit
    if (next < RESET_LIMT) {
      timeStep = 1;
      break;
    }

    timeStep -= 1;
  }
  const next = calcNextArousal(
    arousal.prev,
    arousal.prev2,
    calcGrowthCoefficient(user),
    calcDecayCoefficient(user),
    timeStep,
    ORGASM_LIMIT,
    RELEASE_STRENGTH,
    true
  );
  arousal.prev2 = arousal.prev;
  arousal.prev = next;
  arousal.timestamp = now;
  process.arousal[user] = arousal;
  fs.writeFileSync(
    `${process.GagbotSavedFileDirectory}/arousal.txt`,
    JSON.stringify(process.arousal)
  );
  return next;
}

function addArousal(user, change) {
  if (process.arousal == undefined) process.arousal = {};
  const arousal = process.arousal[user] ?? { prev: 0, prev2: 0 };
  const now = Date.now();
  let timeStep = 1;
  if (arousal.timestamp && arousal.prev < RESET_LIMT) {
    timeStep = (now - arousal.timestamp) / (60 * 1000);
  }
  // for large gaps, calculate it in steps
  while (timeStep > 1) {
    const next = calcNextArousal(
      arousal.prev,
      arousal.prev2,
      calcGrowthCoefficient(user),
      calcDecayCoefficient(user),
      1,
      ORGASM_LIMIT,
      RELEASE_STRENGTH,
      true
    );
    arousal.prev2 = arousal.prev;
    arousal.prev = next;

    // abort loop early if arousal goes below the reset limit
    if (next < RESET_LIMT) {
      timeStep = 1;
      break;
    }

    timeStep -= 1;
  }
  const next =
    calcNextArousal(
      arousal.prev,
      arousal.prev2,
      calcGrowthCoefficient(user),
      calcDecayCoefficient(user),
      timeStep,
      ORGASM_LIMIT,
      RELEASE_STRENGTH,
      true
    ) + change;
  arousal.prev2 = arousal.prev;
  arousal.prev = next;
  arousal.timestamp = now;
  process.arousal[user] = arousal;
  fs.writeFileSync(
    `${process.GagbotSavedFileDirectory}/arousal.txt`,
    JSON.stringify(process.arousal)
  );
  return next;
}

function calcNextArousal(
  prev,
  prev2,
  growthCoefficient,
  decayCoefficient,
  timeStep,
  orgasmLimit,
  releaseStrength,
  canOrgasm
) {
  const noDecay = prev + timeStep * growthCoefficient;
  let next = noDecay - timeStep * decayCoefficient * (prev + prev2 / 2);
  if (canOrgasm && prev >= (UNBELTED_DECAY * orgasmLimit) / decayCoefficient) {
    next -=
      (decayCoefficient * decayCoefficient * releaseStrength * orgasmLimit) /
      UNBELTED_DECAY;
  }
  return next;
}

// modify when more things affect it
function calcGrowthCoefficient(user) {
  return getVibe(user)?.intensity ?? 0;
}

// modify when more things affect it
function calcDecayCoefficient(user) {
  return getChastity(user) ? UNBELTED_DECAY / 5 : UNBELTED_DECAY;
}

// modify when more things affect it
function calcFrustration(hoursBelted) {
  if (hoursBelted <= FRUSTRATION_BREAKPOINT_TIME) {
    return Math.pow(FRUSTRATION_COEFFICIENT, hoursBelted);
  }

  const unbounded =
    MAX_FRUSTRATION * FRUSTRATION_BREAKPOINT +
    FRUSTRATION_MAX_COEFFICIENT *
      Math.log10(hoursBelted - FRUSTRATION_BREAKPOINT_TIME + 1);

  if (unbounded > MAX_FRUSTRATION) return MAX_FRUSTRATION;
  return unbounded;
}

exports.getStutterChance = getStutterChance;
exports.getFumbleChance = getFumbleChance;
exports.getArousal = getArousal;
exports.addArousal = addArousal;
