exports.name = "Slimegirl's Engulfing Slime"

exports.tags = ["slime", "living"]

exports.denialCoefficient = 3

exports.heavytags = ["container", "arms", "legs"]

exports.noself = true
exports.namefunction = async (interaction, data) => {
    if (data.textarray != "texts_heavy" && data.textarray != "texts_struggle") {
        return data;
    } // Only affect struggle and heavy.
    else {
        // Typescript is going to fucking hate me for what Im about to do.
        // Guess what though? Typescript ain't my boss
        // It will *deal* with this. I'd just be putting //@ts-ignore all over this function otherwise.
        let datatoreturn = Object.assign({}, data);
        if (data.textarray == "texts_heavy") {
            let guilduser = await interaction.guild.members.cache.get(datatoreturn.textdata.interactionuser.id);
            datatoreturn.textdata.c3 = `Engulfed by ${guilduser.displayName}`;
        }

        return datatoreturn;
    }
}
