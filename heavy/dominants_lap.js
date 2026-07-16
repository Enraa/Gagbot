exports.name = "Dominant's Lap"

exports.denialCoefficient = 3

exports.heavytags = ["container"]

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
            datatoreturn.textdata.c3 = `${guilduser.displayName}'s Lap`;
        }

        return datatoreturn;
    }
}

exports.itemdescription = `The **Dominant's Lap** will pull the bottom into your lap. This will be renamed to your current display name at the time it is applied. It cannot be applied to yourself. `