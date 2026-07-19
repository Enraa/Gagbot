/************
 * Gets the base definition for a lock object by its string ID
 * 
 * - (string) lockID - The string ID of the lock
 * ---
 * ##### Returns the base lock definition. All lock definitions have the following properties:
 * - name: Name displayed to user
 * - category: "Lock" - Displayed for lists
 * - locktype: "large", "small", ______
 * ##### Conditions:
 * - canAddLock: Can this lock be added
 * - canAccessLock: Can the underlying item this lock is on be accessed
 * - canCloneKeys: Can the keys for this lock be cloned
 * - canRemoveCloneKeys: Can the cloned keys be removed
 * - canTransfer: Can the primary keyholder be transferred
 * - canUnlock: Can the lock be unlocked
 * ---
 * ##### Events:
 * - onLock: Called immediately after applying the lock
 * - onUnlock: Called immediately before removing the lock
 * - onClonedKeys: Called when modifying cloned keyholders
 * - onTransfer: Called when changing primary keyholders
 * ---
 * ##### Functions:
 * - removeParent: ({ uuid }) => Remove host restraint
 * - modifyLock: ({ uuid, param, value }) => Modify lock
 * - modifyRestraint: ({ uuid, param, value }) => Modify host restraint
 * - startLock: ({ uuid }) => Move lock from awaiting to host restraint
 * - initalizeLock: ({ uuid }) => Initialize awaiting lock
 * - lockinteraction: ({ interaction, { uuid }}) => Menu for awaiting lock
 * - lockinteractionresponse: ({ interaction }) => Respond to buttons in menu
 * - lockinteractionmodalresponse: ({ interaction }) => Respond to modal from menu
 ************/
function getBaseLock(lockID) {
    return process.locktypes[lockID];
}

exports.getBaseLock = getBaseLock;