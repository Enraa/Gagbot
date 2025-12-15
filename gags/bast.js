const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        if (Math.random() > (0.50 - (0.05 * intensity))) { // 55-100% chance to nyah
            // We're modifying this word! 
            outtext = `${outtext} `
            for (let t = 0; t < newtextparts[i].length; t++) {
                let repletter;
                if (t == 0) { repletter = "n" }
                else if (t == 1) { repletter = "y" }
                else if ((t == (newtextparts[i].length-1)) && newtextparts[i].length > 3)  {repletter = "h" }
                else { repletter = "a" }
                if (!newtextparts[i].charAt(t).search(/[A-z]|\d]/)) {
                    if (!newtextparts[i].charAt(t).search(/[A-Z]/)) { repletter = repletter.toUpperCase() }
                    outtext = `${outtext}${repletter}`
                }
                else {
                    outtext = `${outtext}${newtextparts[i].charAt(t)}`
                }
            }
            if (Math.random() > (0.80 - (0.04 * intensity))) { // 24-60% chance to add an additonal sound
                let additionalsounds = [
                    "purrrrr", "meow", "mew", "mrrp", "mrrrrrrrrrp", "purr<3", "mrrl"
                ]
                outtext = `${outtext}${additionalsounds[Math.floor(Math.random() * additionalsounds.length)]} `
            }
        }
        else {
            outtext = `${outtext} ${newtextparts[i]}`
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Bast Gag"