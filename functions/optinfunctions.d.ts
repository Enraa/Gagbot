export type OptinTypes = "KeyGiving" | "KeyFumbling" | "OthersKeyFumbling" | "BlessedLuck" | "KeyDiscarding" | "AnyFinders";
export type OptinMap = { [key: OptinTypes]: [number, string, string] };
export type Optins = {
  [Optin in OptinTypes as `set${Optin}`]: (user: number) => undefined;
} & {
  [Optin in OptinTypes as `unset${Optin}`]: (user: number) => undefined;
} & {
  [Optin in OptinTypes as `get${Optin}`]: (user: number) => bool;
};

export const optinMap: OptinMap;
export function setOptin(user: number, offset: number);
export function unsetOptin(user: number, offset: number);
export function getOptin(user: number, offset: number): bool;
export function optinIsLocked(user: number, offset: number): string?;
export const optins: Optins;
