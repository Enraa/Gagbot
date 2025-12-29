import { Snowflake } from "discord.js";

export type Chastity = { keyholder?: Snowflake | "discarded"; timestamp?: number; extraFrustration?: number; keyFindChance?: number; oldKeyholder?: Snowflake };
export type Vibe = { vibetype: string; intensity: number };

export function assignChastity(user: Snowflake, keyholder: Snowflake): void;
export function getChastity(user: Snowflake): Chastity;
export function removeChastity(user: Snowflake): void;
export function assignVibe(user: Snowflake, intensity: number, vibetype?: string): void;
export function getVibe(user: Snowflake): Vibe[];
export function removeVibe(user: Snowflake, vibetype?: string): void;
export function getChastityKeys(user: Snowflake): Snowflake[];

// Returns UNIX timestring of the wearer's unlock time.
// second flag to true to return a Discord UNIX timestring instead.
export function getChastityTimelock(user: Snowflake, UNIXTimestring: boolean): number | string | null;
export function getChastityTimelock(user: Snowflake, UNIXTimestring: false): number | null;
export function getChastityTimelock(user: Snowflake, UNIXTimestring: true): string | null;
export function getChastityKeyholder(user: Snowflake): Snowflake | null;

// transfer keys and returns whether the transfer was successful
export function transferChastityKey(lockedUser: Snowflake, newKeyholder: Snowflake): boolean;
export function discardChastityKey(user: Snowflake): void;
export function findChastityKey(index: number, newKeyholder: Snowflake): void;

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
export function stutterText(text: string, intensity: number): string;

/**
 * Returns a value representing arousal in a way that is roughly equivalet to intensity in the prior vibe system.
 * @param user
 */
export function getVibeEquivalent(user: Snowflake): number;

/**
 * Returns a user-presentable string giving a vague indication of the arousal of the user.
 * @param user
 */
export function getArousalDescription(user: Snowflake): string | null;

/**
 * Returns a user-presentable string giving a vague indication of the direction the arousal of the user is going in.
 * @param user
 */
export function getArousalChangeDescription(user: Snowflake): string | null;

/**
 * Returns the current arousal of the user.
 * 1 Arousal is proximately equivalent to a strength 1 vibe pre-arousal system.
 * @param user
 */
export function getArousal(user: Snowflake): number;

/**
 * Adds a value to the current arousal of the user and returns the result.
 * 1 Arousal is proximately equivalent to a strength 1 vibe pre-arousal system.
 * @param user
 */
export function addArousal(user: Snowflake, change: number): number;

/**
 * Sets the user to 0 arousal and no recent orgasm
 * @param user
 */
export function clearArousal(user: Snowflake): void;

/**
 * Returns true if the user successfully orgasms and updates stored last orgasm.
 * @param user
 */
export function tryOrgasm(user: Snowflake): boolean;

export function setArousalCooldown(user: Snowflake);

export function updateArousalValues();

/**
 * Returns a value representing the frustration of a user.
 * @param hoursBelted the number of hours since the belt was locked
 */
export function calcFrustration(hoursBelted: number): number;
