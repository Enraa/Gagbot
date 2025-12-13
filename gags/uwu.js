const garbleText = (text, intensity) => {
    let newtextparts = text.split(" ");
    let outtext = '';
    let uwutexts = ["uwu", "owo", ">w<", "^w^", "nwn", "0w0", "UwU", "qwq", "TvT", ":3", ">^_^<"]
    for (let i = 0; i < newtextparts.length; i++) {
        if (Math.random() > (0.7 - (0.05 * intensity))) {
            outtext = `${outtext}${newtextparts[i]} ${uwutexts[Math.floor(Math.random() * uwutexts.length)]} `
        }
        else {
            outtext = `${outtext}${newtextparts[i]} `
        }
    }
    outtext = `${outtext} UwU~`
    return outtext
}

exports.garbleText = garbleText;
exports.choicename = "UwU Gag"