// This is a base type for the Lockable Gag Harness
// When this is worn, this will prevent removing the associated gag until this is removed.
// It's also lockable and will lock to the origbinder. 
exports.name = "Lockable Harness";

exports.setupfunction = (data) => {
    let gags = Object.keys(process.gagtypes)
    let returnheadwear = [];
    gags.forEach((g) => {
        returnheadwear.push({
            type: `gagharness_${g}`,
            name: `Lockable Harness (${process.gagtypes[g].choicename})`,
            lockable: true,
            // Only show in autocomplete if the user is currently wearing the gag. 
            showfunction: (serverID, targetuser) => { return (process.gags[serverID] && process.gags[serverID][targetuser] && process.gags[serverID][targetuser].find((ga) => ga.gagtype == g)) }
        })
    })
    return returnheadwear;
}