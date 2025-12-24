const { convertPronounsText } = require("./pronounfunctions.js");

const texts_chastity = {
    heavy: {
        chastity: [
            `USER_TAG squirms in USER_THEIR VAR_C1, trying to adjust USER_THEIR chastity belt, but it's futile!`
        ],
        nochastity: [
            `USER_TAG squirms in USER_THEIR VAR_C1, trying to put on a chastity belt, but can't!`
        ]
    },
    noheavy: {
        chastity: {
            key_other: [
                `You are already locked in a chastity belt and TARGET_TAG has the key!`
            ],
            key_self: [
                `You are already locked in a chastity belt and you're holding the key!`
            ]
        },
        nochastity: {
            key_other: [
                `USER_TAG slips into a chastity belt, slipping on a tiny lock, and then hands TARGET_TAG the key!`
            ],
            key_self: [
                `USER_TAG puts a chastity belt on and clicks a tiny lock on it before stashing the key for safekeeping!`
            ]
        }
    }
}


const textarrays = {
    texts_chastity: texts_chastity,
    //texts_corset: texts_corset,
    //texts_gag: texts_gag
}


/* ----------------------------------
getText() -> Returns a full text depending on data
NOTE: data MUST be constructed in the same property
order as specified on the relevant texts string, which should
be referenced in the beginning of the data function. 
For example, to retrieve the chastity text with no heavy bondage,
chastity, held by self, you should construct the data like this:
    data: {
        textarray: "texts_chastity", // the array to retrieve from
        textdata: { interactionuser, targetuser, ...c1, c2, etc } // see convertPronounsText function

        noheavy: true,
        chastity: true,
        key_self: true
    }
These properties are constructed dynamically with a for... in loop 
and then retrieved from the array using texts_chastity["noheavy"]["chastity"]["key_self"] 
to get the particular array of texts for that condition. 

THE PROPERTY ORDER IS IMPORTANT TO ENSURE THE TEXT RETRIEVAL WORKS AS INTENDED.
-------------------------------------*/
const getText = (data) => {
    try {
        let textarray = data.textarray;
        let data_in = data.textdata;
        let props = [];
        for (k in data) {
            if ((k != "textarray") && (k != "textdata")) {
                props.push(k); // Should create the same order. 
            }
        }
        // At first I thought, a reducer might not be good performance. 
        // Then I remembered, javascript passes *objects* and *arrays* by reference.
        // This is gonna be so clever.
        let sentencearr = props.reduce((prev, curr) => {
            return prev[curr];
        }, textarrays[textarray]);
        /* so what is this thing doing? 
        It is iterating over each property and then returning the object at the named property.
        This should always end with an array AS LONG AS THE INPUT OBJECT IS CONSTRUCTED
        EXACTLY THE WAY THE TREE IS SET UP */
        if (Array.isArray(sentencearr)) {
            let outstring = sentencearr[Math.floor(Math.random() * sentencearr.length)];
            outstring = convertPronounsText(outstring, data_in);

            return outstring;
        }
        else {
            return "There was an error generating this text. No error, but the destination was not an array of strings."
        }
    }
    catch (err) {
        console.log(err)
        return "There was an error generating this text. See console error."
    }
}

exports.getText = getText;