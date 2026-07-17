const { getChastity } = require("../chastity/getChastity");
const { getChastityBra } = require("../chastity/getChastityBra");
const { getCollar } = require("../collar/getCollar");
const { getCorset } = require("../corset/getCorset");
const { getGags } = require("../gag/getGags");
const { getHeadwear } = require("../headwear/getHeadwear");
const { getHeavyList } = require("../heavy/getHeavyList");
const { getMitten } = require("../mitten/getMitten");
const { getToys } = require("../toy/getToys");
const { getWearable } = require("../wearable/getWearable");

/*********
 * Given a UUID, returns an object with the restraint, server ID and user ID.
 * 
 * - (string) lockuuid - The UUID to retrieve
 * ---
 * ##### Returns an object with the following properties, or undefined:
 * - serverID: The server for the person with the restraint
 * - userID: The person with the restraint
 * - restraint: The actual restraint object
 *********/
function getRestraintByUUID(lockuuid) {
    // Gags
    Object.keys(process.gags).forEach((server) => {
        Object.keys(process.gags[server]).forEach((user) => {
            getGags(server, user).forEach((g) => {
                if (g.lock && g.lock.uuid == lockuuid) {
                    return { serverID: server, userID: user, restraint: g };
                }
            }) 
        })
    })
    // Toys
    Object.keys(process.toys).forEach((server) => {
        Object.keys(process.toys[server]).forEach((user) => {
            getToys(server, user).forEach((g) => {
                if (g.lock && g.lock.uuid == lockuuid) {
                    return { serverID: server, userID: user, restraint: g };
                }
            }) 
        })
    })
    // Headwear
    Object.keys(process.headwear).forEach((server) => {
        Object.keys(process.headwear[server]).forEach((user) => {
            getHeadwear(server, user).forEach((g) => {
                if (g.lock && g.lock.uuid == lockuuid) {
                    return { serverID: server, userID: user, restraint: g };
                }
            }) 
        })
    })
    // Wearables
    Object.keys(process.wearable).forEach((server) => {
        Object.keys(process.wearable[server]).forEach((user) => {
            getWearable(server, user).forEach((g) => {
                if (g.lock && g.lock.uuid == lockuuid) {
                    return { serverID: server, userID: user, restraint: g };
                }
            }) 
        })
    })
    // Heavy Bondage
    Object.keys(process.heavy).forEach((server) => {
        Object.keys(process.heavy[server]).forEach((user) => {
            getHeavyList(server, user).forEach((g) => {
                if (g.lock && g.lock.uuid == lockuuid) {
                    return { serverID: server, userID: user, restraint: g };
                }
            }) 
        })
    })
    // Mittens
    Object.keys(process.mitten).forEach((server) => {
        Object.keys(process.mitten[server]).forEach((user) => {
            if (getMitten(server, user)?.lock && (getMitten(server, user)?.lock.uuid == lockuuid)) {
                return { serverID: server, userID: user, restraint: getMitten(server, user) };
            }
        })
    })
    // Corset
    Object.keys(process.corset).forEach((server) => {
        Object.keys(process.corset[server]).forEach((user) => {
            if (getCorset(server, user)?.lock && (getCorset(server, user)?.lock.uuid == lockuuid)) {
                return { serverID: server, userID: user, restraint: getCorset(server, user) };
            }
        })
    })
    // Chastity Belt
    Object.keys(process.chastity).forEach((server) => {
        Object.keys(process.chastity[server]).forEach((user) => {
            if (getChastity(server, user)?.lock && (getChastity(server, user)?.lock.uuid == lockuuid)) {
                return { serverID: server, userID: user, restraint: getChastity(server, user) };
            }
        })
    })
    // Chastity Bra
    Object.keys(process.chastitybra).forEach((server) => {
        Object.keys(process.chastitybra[server]).forEach((user) => {
            if (getChastityBra(server, user)?.lock && (getChastityBra(server, user)?.lock.uuid == lockuuid)) {
                return { serverID: server, userID: user, restraint: getChastityBra(server, user) };
            }
        })
    })
    // Collar
    Object.keys(process.collar).forEach((server) => {
        Object.keys(process.collar[server]).forEach((user) => {
            if (getCollar(server, user)?.lock && (getCollar(server, user)?.lock.uuid == lockuuid)) {
                return { serverID: server, userID: user, restraint: getCollar(server, user) };
            }
        })
    })
    return undefined;
}

exports.getRestraintByUUID = getRestraintByUUID;