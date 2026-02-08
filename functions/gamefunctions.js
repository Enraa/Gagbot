const fs = require("fs");
const path = require("path");
const https = require("https");
const { getCollar } = require("./collarfunctions")
const { getChastityBra } = require("./vibefunctions")
const { getChastity } = require("./vibefunctions")

// Load the game files! 
function loadGames() {
    const gametypes = {};
    const gamePath = path.join(__dirname, "..", "games");
    const gameFiles = fs.readdirSync(gamePath).filter((file) => file.endsWith(".js"));
    for (const file of gameFiles) {
        const game = require(path.join(gamePath, file));
        if (game) {
            gametypes[file.replace(".js", "")] = game;
        }
    }
    process.gametypes = gametypes;
}

// Applies an escrow on a user's restraint, preventing it from being transferred
// or removed until the game state has been concluded.
function placeEscrow(user, restraint, gameid) {
    if (process.games && process.games[gameid]) {
        if (restraint == "collar") {
            if (getCollar(user)) {
                getCollar(user).escrow = gameid
            }
        }
        if (restraint == "chastitybelt") {
            if (getChastity(user)) {
                getChastity(user).escrow = gameid
            }
        }
        if (restraint == "chastitybra") {
            if (getChastityBra(user)) {
                getChastityBra(user).escrow = gameid
            }
        }
    }
}

// Removes all restraints with gameid from user
function removeEscrow(user, gameid) {
    if (process.games && process.games[gameid]) {
        if (getCollar(user) && (getCollar(user).escrow == gameid)) {
            getCollar(user).escrow = undefined;
        }
        if (getChastity(user) && (getChastity(user).escrow == gameid)) {
            getChastity(user).escrow = undefined;
        }
        if (getChastityBra(user) && (getChastityBra(user).escrow == gameid)) {
            getChastityBra(user).escrow = undefined;
        }
    }
}

// Rewards all restraint keys placed in escrow for the loser to the winner
function rewardEscrow(winner, loser, gameid) {
    if (process.games && process.games[gameid]) {
        // Transfer the loser's keys to the winner
        if (getCollar(loser) && (getCollar(loser).escrow == gameid)) {
            getCollar(loser).escrow = undefined;
            getCollar(loser).keyholder = winner;
            if (getCollar(loser).clonedKeyholders > 0) { getCollar(loser).clonedKeyholders = [] }
        }
        if (getChastity(loser) && (getChastity(loser).escrow == gameid)) {
            getChastity(loser).escrow = undefined;
            getChastity(loser).keyholder = winner;
            if (getChastity(loser).clonedKeyholders > 0) { getChastity(loser).clonedKeyholders = [] }
        }
        if (getChastityBra(loser) && (getChastityBra(loser).escrow == gameid)) {
            getChastityBra(loser).escrow = undefined;
            getChastityBra(loser).keyholder = winner;
            if (getChastityBra(loser).clonedKeyholders > 0) { getChastityBra(loser).clonedKeyholders = [] }
        }
        // Remove the escrow over the winner's restraints
        removeEscrow(winner, gameid);
    }
}

// Creates a game object. Note that this does not start it until the .started param is added to the object,
// which will be handled when prompting everyone that is invited to the game. 
function createGame(players, gametype, escrows, options) {
    let randomid = crypto.randomUUID(); // Generates a unique 32-bit UUID.
    let playerarr = (Array.isArray(players)) ? players : [players];
    process.games[randomid] = {
        players: playerarr,
        gametype: gametype,
        escrows: escrows,
        accepted: [playerarr[0]], // The first player is always the one who initiated it. 
        options: options
    }
}

// Generate the modal which handles game selection
function generateGameSelectionModal(userid, gametype, escrows, options = null, otherplayers = []) {

    // Game picker here


    // Other players
}