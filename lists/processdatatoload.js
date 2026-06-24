/*******
 * Process data variables called at runtime and referenced for saving
 * 
 *******/
const processdatatoload = [
    { textname: "gaggedusers.txt", processvar: "gags", default: {}, rts: "gags", hasusers: true },
    { textname: "mittenedusers.txt", processvar: "mitten", default: {}, rts: "mitten", hasusers: true },
    { textname: "chastityusers.txt", processvar: "chastity", default: {}, rts: "chastity", hasusers: true },
    { textname: "chastitybrausers.txt", processvar: "chastitybra", default: {}, rts: "chastitybra", hasusers: true },
    { textname: "toyusers.txt", processvar: "toys", default: {}, rts: "toys", hasusers: true },
    { textname: "collarusers.txt", processvar: "collar", default: {}, rts: "collar", hasusers: true },
    { textname: "heavyusers.txt", processvar: "heavy", default: {}, rts: "heavy", hasusers: true },
    { textname: "pronounsusers.txt", processvar: "pronouns", default: {}, rts: "pronouns", hasusers: true },
    { textname: "usersdata.txt", processvar: "usercontext", default: {}, rts: "usercontext", hasusers: true },
    { textname: "consentusers.txt", processvar: "consented", default: {}, rts: "consented", hasusers: true },
    { textname: "corsetusers.txt", processvar: "corset", default: {}, rts: "corset", hasusers: true },
    { textname: "arousal.txt", processvar: "arousal", default: {}, rts: "arousal", hasusers: true },
    { textname: "headwearusers.txt", processvar: "headwear", default: {}, rts: "headwear", hasusers: true },
    { textname: "discardedkeys.txt", processvar: "discardedKeys", rts: "discardedKeys", default: [] },
    { textname: "configs.txt", processvar: "configs", default: {}, rts: "configs", },
    { textname: "outfits.txt", processvar: "outfits", default: {}, rts: "outfits", hasusers:true },
    { textname: "dollusers.txt", processvar: "dolls", default: {}, rts: "dolls", hasusers: true },
    { textname: "wearables.txt", processvar: "wearable", default: {}, rts: "wearable", hasusers: true },
    { textname: "webhooks.txt", processvar: "webhookstoload", default: {}, rts: "webhooks", },
    { textname: "recordedmessages.txt", processvar: "recordedmessages", default: {}, rts: "recordedmessages", },
    { textname: "delveuserdata.txt", processvar: "delveuserdata", default: {}, rts: "delveuserdata", hasusers: true },
    { textname: "userstats.txt", processvar: "userstats", default: {}, rts: "userstats", hasusers: true },
    { textname: "memberavatars.txt", processvar: "memberavatars", default: {}, rts: "memberavatars", hasusers: true },
    { textname: "heldkeytimers.txt", processvar: "heldkeytimers", default: {}, rts: "heldkeytimers", hasusers: true },
]

exports.processdatatoload = processdatatoload;