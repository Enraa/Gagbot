const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    for (let i = 0; i < newtextparts.length; i++) {
        if (Math.random() > (0.80 - (0.08 * intensity))) {
            let randomlength = newtextparts[i].length + 3 - (6 * Math.random())
            for (let t = 0; t < randomlength - 2; t++) {
                if (t == 0) {
                    outtext = `${outtext}M`
                }
                else {
                    outtext = `${outtext}m`
                }
            }
            outtext = `${outtext}ph `
        }
        else {
            outtext = `${outtext}${newtextparts[i]} `
        }
    }
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "Stuff Gag"