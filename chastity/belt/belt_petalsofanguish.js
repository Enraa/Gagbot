const { getChastity } = require("../../functions/getters/chastity/getChastity")

// Petals of Anguish as shown here: https://www.reddit.com/r/femalechastity/comments/1rbjaqq/fantasy_device_20/#lightbox
// This variant limits "actions" to the wearer to one per other user. This is simple to track with a "touchedbelt" array.
exports.canUnequip = (data) => { return !getChastity(data.userID).touchedbelt.includes(data.keyholderID) }

exports.canAccessToys = (data) => { return !getChastity(data.userID).touchedbelt.includes(data.keyholderID) }

exports.canAccessCorset = (data) => { return !getChastity(data.userID).touchedbelt.includes(data.keyholderID) }

// The keyholder will get one free touch after putting the belt on the wearer. Unless it's themselves. 
// Obviously the wearer will get instantly locked out. 
exports.onEquip = (data) => { getChastity(data.userID).touchedbelt = [data.userID] }

// This variable should get cleared in assignChastity, but just in case. 
exports.onUnequip = (data) => { delete getChastity(data.userID).touchedbelt }

// Fired on toy change! That user will no longer be allowed to access the belt. 
exports.onToyChange = (data) => { getChastity(data.userID).touchedbelt.push(data.keyholderID) }

// Fired on Corset change! That user will no longer be allowed to access the belt. 
exports.onCorsetChange = (data) => { getChastity(data.userID).touchedbelt.push(data.keyholderID) }

// Category
exports.category = "Chastity Belt"

// Name
exports.name = "Petals of Anguish"

// Tags
exports.tags = ["chastity"]