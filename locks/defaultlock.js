// This is the base definition for a lock that is affixed to a restraint. Any new functionality that references a property
// MUST have that reference here to ensure all locks are constructed with a default. 
// The default values should generally "do nothing" as they will be overwritten by
// the further lock types as relevant.
function Lock() {
    // The condition to allow adding this lock to a restraint
    this.canAddLock = (data) => { return true };

    // Functions
    // Remove parent device
    this.removeParent = (data) => {
        let lockeditem = getRestraintByUUID(data.uuid);
    }
}

exports.Lock = Lock;