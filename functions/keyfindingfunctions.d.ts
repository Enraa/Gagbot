import { Message, Snowflake } from "discord.js";

type FixedSizeArray<N extends number, T> = { length: N } & ReadonlyArray<T>;

/**
 * Returns true if the keyholder fumbles and false if not.
 * This function handles configs and persistent state.
 * @param keyholder
 * @param locked
 */
export function rollKeyFumble(keyholder: Snowflake, locked: Snowflake): boolean;

/**
 * Returns a non-negative number representing the base fumble chance for the keyholder.
 * 0 means no fumbles, 1+ means always fumbles.
 * Note: The returned value may exceed 1.
 * @param keyholder
 * @param locked
 */
export function getFumbleChance(keyholder: Snowflake, locked: Snowflake): number;

/**
 * Handles users being able to find keys from sending a message.
 * Should be called once for every message that is allowed to find keys.
 * @param user
 */
export function handleKeyFinding(message: Message): Promise<void>;
