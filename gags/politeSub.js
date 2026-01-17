const garbleText = (text, intensity) => {
    let honorifictitles = [
        // Oh god its hard to type these without caps
        "miss",
        "master",
        "sir",
        "ma\'am",
        "maam",
        "lady",
        "lord",
        "queen",
        "king",
        "mistress",
        "goddess",
        "maitresse",
        "administrator",
        "mommy",
        "daddy",
        "mxtress",
        "overseer",
        "headmaid",
        "head\ maid",
        "mix",
        "duke",
        "dame",
        "count"
    ]

    let silenttitles = [
        `\n*looks down silently*\n`,
        `\n*tries to speak, but no words come out*\n`,
        `\n*nods without a word*\n`,
        `\n*looks down and to the side*\n`,
        `\n*twiddles thumbs meekly*\n`,
        `\n*pouts as the gag stops impolite speech*\n`,
        `\n*goes mute without an honorific*\n`,
        `\n*meeps but produces no audible words*\n`,
        `\n*casts eyes downward, like a good sub*\n`,
        `\n*blushes and mumbles something*\n`
    ]

    let garblemode = false;
    let textout = silenttitles[Math.floor(Math.random() * silenttitles.length)]

    let honorificsmap = honorifictitles.join('|');
    let regexpattern = new RegExp(`\\b(${honorificsmap})\\b`, "i")

    if (regexpattern.test(text)) {
        textout = text;
        garblemode = true;
    }

    return { text: textout, garble: garblemode };
}

exports.garbleText = garbleText;
exports.choicename = "Polite Sub Gag"