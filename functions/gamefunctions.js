const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SeparatorBuilder, SeparatorSpacingSize, TextDisplayBuilder} = require("discord.js");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { getCollar } = require("./getters/collar/getCollar");
const { getChastity } = require("./getters/chastity/getChastity");
const { getChastityBra } = require("./getters/chastity/getChastityBra");
const { traceFirstParam } = require("./other/TESTS/traceFirstParam");

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
    traceFirstParam(arguments[0]);
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
    traceFirstParam(arguments[0]);
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
    traceFirstParam(arguments[0]);
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
    traceFirstParam(arguments[0]);
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

/****** 
 * Generate an initial gamba Deathroll message!
 * 
 * - (interaction) interaction - The message interaction that initiated this request
 * ---
 * ##### Returns a message string which can be passed directly into an interaction reply
 *******/
async function gambaDeathrollStart(interaction) {
    let initialroll = (Math.floor(Math.random() * 10) + 1)
    let text1 = new TextDisplayBuilder().setContent(`<@${interaction.user.id}> rolls an initial **${initialroll}**`)

    let separator = new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small);

    let text2 = new TextDisplayBuilder().setContent(`-# Anyone can join in the Deathroll...`);

    let rollbuttonrow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("Roll Initial (1-10)")
            .setCustomId("gamba_deathroll")
    )

    return { components: [text1, separator, text2, rollbuttonrow], flags: MessageFlags.IsComponentsV2 }
}

/****** 
 * Handle a Deathroll roll. We handle these by simply reading the message contents when clicked. 
 * 
 * - (interaction) interaction - The message interaction that initiated this request
 * ---
 * ##### Updates the message or replies to the user that they aren't allowed
 *******/
async function gambaDeathrollHandle(interaction) {
    console.log(interaction.message.components[0].content);
    // Gemini said this matchAll works. I think it looks fine. 
    let messagecontent = interaction.message.components[0].content ?? ``;
    let currentrolls = [...messagecontent.matchAll(/(.+?) rolls (?:an initial \*\*(\d+)\*\*|(\d+-\d+) and rolls a \*\*(\d+)\*\*)/g)].map(m => ({ user: m[1], initial: !!m[2], value: Number(m[2] || m[4]) }));
    console.log(currentrolls)
    let initialwinner = currentrolls[0].user;
    if (currentrolls.length > 2) {
        initialwinner = undefined;
    }
    else if (currentrolls.length == 2) {
        if (currentrolls[1].value > currentrolls[0].value) {
            initialwinner = currentrolls[1].user
        }
    }

    if ((currentrolls.length >= 2) && !currentrolls.find((f) => f.user == `<@${interaction.user.id}>`)) {
        interaction.reply({ content: `That is not your deathroll!`, flags: MessageFlags.Ephemeral })
        return;
    }
    // This to determine whose turn it is, but we should just look at the text at the end probably
    else if ((currentrolls[currentrolls.length-1].user != `<@${interaction.user.id}>`) && (currentrolls.length > 2)) {
        interaction.reply({ content: `Its not your turn yet!`, flags: MessageFlags.Ephemeral })
        return;
    }
    // Initial roll and the person didnt win! 
    else if ((currentrolls.length == 2) && (`<@${interaction.user.id}>` != initialwinner)) {
        interaction.reply({ content: `Its not your turn yet!`, flags: MessageFlags.Ephemeral })
        return;
    }
    // Initial roll and starting user tries going again lul
    else if ((currentrolls.length == 1) && (`<@${interaction.user.id}>` == initialwinner)) {
        interaction.reply({ content: `Its not your turn yet!`, flags: MessageFlags.Ephemeral })
        return;
    }
    else {
        let rollrandom = Math.random();
        let initial = false;
        // Third roll after figuring out who won! 
        if ((currentrolls[currentrolls.length-1].initial) && (currentrolls.length == 2)) {
            rollrandom = Math.floor(rollrandom * 1000) + 1
        }
        // Counter initial roll
        else if (currentrolls.length == 1) {
            rollrandom = Math.floor(rollrandom * 10) + 1
            initial = true;
        }
        else {
            rollrandom = Math.floor(rollrandom * currentrolls[currentrolls.length-1].value) + 1
        }

        let text1 = `${messagecontent}\n<@${interaction.user.id}> rolls ${initial ? `an initial` : `**1-${currentrolls[currentrolls.length-1].value}** and rolls a`} **${rollrandom}**`
        let text1comp = new TextDisplayBuilder().setContent(text1)

        let separator = new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small);

        if (initial == true) {
            let text2 = new TextDisplayBuilder().setContent(`-# ${(rollrandom > currentrolls[currentrolls.length-1].value) ? `<@${interaction.user.id}>` : currentrolls[currentrolls.length-1].user} to roll 1-1000`);
            let rollbuttonrow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`Roll (1-1000)`)
                    .setEmoji("🎲")
                    .setCustomId(`gamba_deathroll`)
            )
            interaction.update({ components: [text1comp, separator, text2, rollbuttonrow], flags: MessageFlags.IsComponentsV2 })
        }
        else if (rollrandom > 1) {
            let text2 = new TextDisplayBuilder().setContent(`-# ${currentrolls[currentrolls.length-1].user} to roll 1-${rollrandom}`);
            let rollbuttonrow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`Roll (1-${rollrandom})`)
                    .setEmoji("🎲")
                    .setCustomId(`gamba_deathroll`)
            )
            interaction.update({ components: [text1comp, separator, text2, rollbuttonrow], flags: MessageFlags.IsComponentsV2 })
        }
        else {
            let text2 = new TextDisplayBuilder().setContent(`-# <@${interaction.user}> has lost the Deathroll`);
            interaction.update({ components: [text1comp, separator, text2], flags: MessageFlags.IsComponentsV2 })
        }
    }
}

exports.gambaDeathrollStart = gambaDeathrollStart;
exports.gambaDeathrollHandle = gambaDeathrollHandle;