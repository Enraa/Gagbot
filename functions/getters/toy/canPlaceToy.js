/********
 * Check if a toy by ID can be placed on the target by the user
 * 
 * - (user id) userID - The person placing the toy
 * - (user id) placerID - The person receiving the toy
 * - (string) toy - The specific kind of toy to place
 * ---
 * ##### Returns true if the toy is permitted to be placed
 ********/
function canPlaceToy(userID, placerID, toy) {
    return (process.toytypes && process.toytypes[toy] && process.toytypes[toy].canEquip({ userID: userID, placerID: placerID }))
}

exports.canPlaceToy = canPlaceToy;