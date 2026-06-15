/********
 * Check if a toy by ID can be removed from the target by the user
 * 
 * - (user id) userID - The person removing the toy
 * - (user id) placerID - The person who has the toy
 * - (string) toy - The specific kind of toy to remove
 * ---
 * ##### Returns true if the toy is permitted to be placed
 ********/
function canRemoveToy(userID, placerID, toy) {
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canUnequip({ userID: userID, placerID: placerID }))
}

exports.canRemoveToy = canRemoveToy;