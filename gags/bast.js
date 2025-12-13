const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        if (Math.random() > (0.50 - (0.05 * intensity))) {
            /*if (newtextparts[i].length < 3) {
                { outtext = `${outtext} ` }
                for (let t = 0; t < newtextparts[i].length; t++) {
                    if (newtextparts[i].charAt(t).search(/[A-z]|\d]/)) {
                        let repletter;
                        if (t == 0) repletter = "n"
                        else if (t == 1) if (t == 0) repletter = "y"
                        else repletter = "a"
                        if ((newtextparts[i].charAt(t)).isUppercase()) {
                            
                        }
                        if (t == 0) { outtext = `${outtext}N` }
                        else if (t == 1) { outtext = `${outtext}y` }
                        else { outtext = `${outtext}a` }
                    }
                    else {
                        { outtext = `${outtext}${newtextparts[i].charAt(t)}` }
                    }
                }
                let firstletter = (newtextparts[i].charAt(0)).isUppercase()
                if (firstletter) { outtext = `${outtext} Nya` }
                else { outtext = `${outtext} nya` }
            }
            else {*/
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
        }
        else {
            outtext = `${outtext} ${newtextparts[i]}`
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Bast Gag"