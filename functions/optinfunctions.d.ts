export type OptinTypes = "KeyGiving" | "EnableVibes" | "DynamicArousal" | "KeyFumbling" | "OthersKeyFumbling" | "FumbleOthersKeys" | "BlessedLuck" | "KeyDiscarding" | "AnyFinders";
export type OptinMap = { [Optin in OptinTypes]: [number, string, string] };
export type Optins = {
  [Optin in OptinTypes as `set${Optin}`]: (user: number) => undefined;
} & {
  [Optin in OptinTypes as `unset${Optin}`]: (user: number) => undefined;
} & {
  [Optin in OptinTypes as `get${Optin}`]: (user: number) => boolean;
};

export const optinMap: OptinMap;
export function setOptin(user: number, offset: number): void;
export function unsetOptin(user: number, offset: number): void;
export function getOptin(user: number, offset: number): boolean;
export function optinIsLocked(user: number, offset: number): string | null;
export const optins: Optins;
