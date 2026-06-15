const { getToys } = require("./getToys");

/**********
 * Gets a specific toy that a user is wearing
 * 
 * - (user id) user - The user wearing the toys
 * - (string) toytype - The item ID of the toy to get
 * ---
 * ##### Returns the toy object. All toys have the following:
 * - type: The item ID of the toy
 * - intensity: The intensity of the toy 1-20
 * - origbinder: The user ID who put the toy on the user
 **********/
function getSpecificToy(user, toytype) {
    return getToys(user).find((toy) => toy.type == toytype);
}

exports.getSpecificToy = getSpecificToy;