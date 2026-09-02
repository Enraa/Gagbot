const { getItemType } = require("../../functions/getters/config/getItemType");
const { getUserVar } = require("../../functions/getters/config/getUserVar");
const { getRestraintByUUID } = require("../../functions/getters/lock/getRestraintByUUID");
const { markForSave } = require("../../functions/other/markForSave");
const { setUserVar } = require("../../functions/setters/config/setUserVar");
const { sendLockToast } = require("../../functions/setters/lock/sendLockToast");
const { updateLockAwaiting } = require("../../functions/setters/lock/updateLockAwaiting");

// Increment the timer on the lock when the user is given a headpat!
exports.headpatfunction = async function(uuid, data) {
    if (getRestraintByUUID(uuid) && getRestraintByUUID(uuid)?.restraint?.lock && getRestraintByUUID(uuid)?.restraint?.lock?.unlocktime && getRestraintByUUID(uuid)?.restraint?.lock?.headpattime && data.returnedobject.hit) {
        let restraint = getRestraintByUUID(uuid).restraint
        let newtime = restraint.lock.unlocktime + restraint.lock.headpattime;
        restraint.lock.unlocktime = newtime;

        if ((getUserVar(restraint.lock.serverID, restraint.lock.userID, "timerlockaddedrecently") ?? 0) < Date.now()) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds to queue it properly
            sendLockToast({ 
                serverID: restraint.lock.serverID, 
                userID: restraint.lock.userID, 
                actionuser: restraint.lock.userID, 
                actiontype: "timeAdd", 
                locktype: "headpatlock", 
                restraintname: restraint.lock.restraintname, 
                restrainttype: getItemType(restraint), 
                targettype: "self" 
            })
            setUserVar(restraint.lock.serverID, restraint.lock.userID, "timerlockaddedrecently", (Date.now() + 300000)); // 5 minute cooldown for timer extension messages.
        }

        markForSave(getItemType(restraint))
    }
}