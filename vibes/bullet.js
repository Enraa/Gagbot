const { getVibe } = require('../functions/vibefunctions.js')
const { arousedtexts, arousedtextshigh } = require('./aroused/aroused_texts.js')

// Given a string, randomly provides a stutter and rarely provides an arousal text per word.
function garbleText(text, userid, intensity=5) {
    let newtextparts = text.split(" ");
    let outtext = ''
    for (let i = 0; i < newtextparts.length; i++) {
        outtext = `${outtext} ${aux(newtextparts[i], userid)}`
    }
    return outtext
}

function aux(text, userid) {
    outtext = '';
    if (Math.random() > (1.0 - (0.2 * getVibe(userid).intensity))) { // 2-20% to cause a stutter
        let stuttertimes = Math.max(Math.floor(Math.random() * (0.3 * getVibe(userid).intensity)), 1) // Stutter between 1, 1-2 and 1-3 times, depending on intensity
        for (let i = 0; i < stuttertimes; i++) {
            outtext = `${outtext}${text.charAt(0)}-`
        }
        outtext = `${outtext}${text}`
    }
    if (Math.random() > (1.0 - (0.05 * getVibe(userid).intensity))) { // 0.5-5% to insert an arousal text
        let arousedlist = arousedtexts;
        if (getVibe(userid).intensity > 7) {
            for (let i = 0; i < arousedtextshigh; i++) { // Remove the first 5 elements to give the high arousal texts higher chance to show up
                arousedlist[i] = arousedtextshigh[i]
            }
        }
        let arousedtext = arousedtexts[Math.floor(Math.random() * arousedtexts.length)]
        outtext = `${outtext} ${arousedtext}`
    }
    return outtext;
}

exports.garbleText = garbleText;
exports.choicename = "Bullet Vibe";