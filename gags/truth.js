const nlp = require("compromise");

// This is called after parsing the message tree, just after the emoji. 
const pregarble = (text, parent, locarr, intensity, msg) => {
    let outtext = text;

    // Set up sentence array. 
    let docin = nlp(outtext);
    let docarray = [];
    docarray = docin.out('array');
    
    if ((docarray.length > 0)) {
        for (let di = 0; di < docarray.length; di++) {
            let doc = nlp(docarray[di]);
            if (Math.random() < ((intensity * 0.06) + 0.4)) { // 40-100% chance to flip
                // Compromise library can be used here to solve this!
                // I'm learning more about the shenanigans of this library than I ever expected. 
                doc.verbs().forEach((s) => {
                    if (s.has('#Negative')) {
                        // This is negative, make it positive. 
                        s.toPositive()
                    }
                    else {
                        // This is positive, make it negative.
                        s.toNegative()
                    }
                })
            }

            docarray[di] = doc.text()
        }
    }
    
    return docarray.join(" ");
};

exports.pregarble = pregarble;
exports.choicename = "Gag of Truths";
