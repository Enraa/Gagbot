const { statsGetCounter } = require("./getters/config/statsGetCounter");
const { parseDuration } = require("./timefunctions");

/*********
 * Generates a text list for the Inspect window display with all of the tracked stats. 
 * 
 * - (user id) user - User to generate stats for
 *********/
function statsGeneratePage(user) {
    let statstogenerate = {
        Restraints: [
            {
                name: "Gagged Messages Sent",
                type: "counter",
                stat: "gaggedmessages"
            },
            {
                name: "Struggle Messages",
                type: "counter",
                stat: "strugglemessages"
            },
            {
                name: "Gags Worn",
                type: "counter",
                stat: "worngags"
            },
            {
                name: "Mittens Worn",
                type: "counter",
                stat: "wornmittens"
            },
            {
                name: "Masks Worn",
                type: "counter",
                stat: "wornmasks"
            },
            {
                name: "Heavy Bondage Worn",
                type: "counter",
                stat: "wornheavy"
            },
            {
                name: "Corsets Worn",
                type: "counter",
                stat: "worncorsets"
            },
        ],
        Arousal: [
            {
                name: "Successful Orgasms",
                type: "counter",
                stat: "orgasms"
            },
            {
                name: "Highest Arousal Let Go",
                type: "counter",
                stat: "highestarousal"
            },
            {
                name: "Highest Denial Overcome",
                type: "counter",
                stat: "highestdenial"
            },
            {
                name: "Longest Chastity Belt Worn",
                type: "special",
                special: (user) => {
                    let maxduration = Math.max(statsGetCounter(user, "chastitywornduration") ?? 0, ((process.chastity[user]) ? Date.now() - process.chastity[user].timestamp : 0))
                    console.log(maxduration);
                    if (maxduration == 0) {
                        return "Never Worn"
                    }
                    else {
                        return parseDuration(maxduration);
                    }
                }
            },
            {
                name: "Longest Chastity Bra Worn",
                type: "special",
                special: (user) => {
                    let maxduration = Math.max(statsGetCounter(user, "chastitybrawornduration") ?? 0, ((process.chastitybra[user]) ? Date.now() - process.chastitybra[user].timestamp : 0))
                    console.log(maxduration);
                    if (maxduration == 0) {
                        return "Never Worn"
                    }
                    else {
                        return parseDuration(maxduration);
                    }
                }
            }
        ],
        Headpats: [
            {
                name: "Headpats Given",
                type: "counter",
                stat: "headpatsgiven"
            },
            {
                name: "Headpats Received",
                type: "counter",
                stat: "headpatsreceived"
            },
            {
                name: "Headpats on Self",
                type: "counter",
                stat: "headpatsself"
            },
            {
                name: "Headpat Crits",
                type: "counter",
                stat: "headpatcrits"
            },
            {
                name: "Headpat Double Crits",
                type: "counter",
                stat: "headpatdoublecrits"
            },
            {
                name: "Headpat Triple Crits",
                type: "counter",
                stat: "headpattriplecrits"
            },
        ],
        Other: [
            {
                name: "Shocks Received",
                type: "counter",
                stat: "timesshocked"
            },
            {
                name: "Shocks On Self",
                type: "counter",
                stat: "timesshockedself"
            },
        ]
    }

    let outtext = ``

    Object.keys(statstogenerate).forEach((statgroup) => {
        outtext = `${outtext}### ${statgroup}\n`

        statstogenerate[statgroup].forEach((textstat) => {
            if (textstat.type == "counter") {
                outtext = `${outtext}-# • ${textstat.name}: **${statsGetCounter(user, textstat.stat) ?? 0}**\n`
            }
            else if (textstat.type == "special") {
                outtext = `${outtext}-# • ${textstat.name}: **${textstat.special(user)}**\n`
            }
        })
    })

    return outtext;
}

exports.statsGeneratePage = statsGeneratePage;