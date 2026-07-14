const { getArousal } = require("../functions/getters/arousal/getArousal")
const { getChastity } = require("../functions/getters/chastity/getChastity")
const { getChastityBra } = require("../functions/getters/chastity/getChastityBra")
const { getCollar } = require("../functions/getters/collar/getCollar")
const { getGag } = require("../functions/getters/gag/getGag")
const { getHeadwearRestrictions } = require("../functions/getters/headwear/getHeadwearRestrictions")
const { getHeavy } = require("../functions/getters/heavy/getHeavy")
const { convertPronounsText } = require("../functions/other/convertPronounsText")

/******
 * Similar to textfunctions.js, this will be a list of texts as well as a list of functions which return true/false to add a text. 
 ******/
const ballanswers = [
    `It is certain`,
    `It is decidedly so`,
    `Without a doubt`,
    `Yes definitely`,
    `You may rely on it`,
    `As I see it, yes`,
    `Most likely`,
    `Outlook good`,
    `Yes`,
    `Signs point to yes`,
    `Reply hazy, try again`,
    `Ask again later`,
    `Better not tell you now`,
    `Cannot predict now`,
    `Concentrate and ask again`,
    `Don't count on it`,
    `My reply is no`,
    `My sources say no`,
    `Outlook not so good`,
    `Very doubtful`,
    `Perhaps if you wear these handcuffs`,
    `Too many chains, ask later`,
    `Muffled moans point to yes`,
    `It is locked in!`,
    `Only if you behave`,
    `Maybe if you're good`,
    `Perhaps if I feel like it`,
    `Bind your arms for good luck`,
    `Almost certainly`,
    `My reply is mmmph~!`,
    `My sources say mmmph~!`,
    `Maybe if you get permission`,
    `No`,
    `Only if I permit it`,
    `Answer is gagged, ask again`,
    `If you squirm while asking again, maybe`,
    `I think not`,
    `I think so`,
    `Perhaps`,
    `Verily, it will be so`,
    `Let me consult the Goddess of Gags`,
    `Absolutely`,
    `Yeah`,
    `I think it will happen`,
    `Tie some rope on yourself and ask again`,
    `The answer was tied up with something, try again`,
    `Ask again after a timelock`,
    `Only if you're a good USER_PRAISEOBJECT`,
    `Good USER_PRAISEOBJECTs wait patiently`,
    `Perhaps, for a thoroughly bound USER_PRAISEOBJECT`,
    `Ask again after showing me what a good USER_PRAISEOBJECT you are`,
    `The correct way to ask is "Miss Gagbot please"`,
    {
        required: (t) => {
            return !getChastity(t.serverID, t.targetuser.id)
        },
        text: `Put a chastity belt on and maybe I'll tell you`
    },
    {
        required: (t) => {
            return getChastity(t.serverID, t.targetuser.id)
        },
        text: `Good USER_PRAISEOBJECTs stay chaste, so yes`
    },
    {
        required: (t) => {
            return !getGag(t.serverID, t.targetuser.id)
        },
        text: `Wear a gag for me to find out`
    },
    {
        required: (t) => {
            return getGag(t.serverID, t.targetuser.id)
        },
        text: `Moan harder for me, you silly thing`
    },
    {
        required: (t) => {
            return getGag(t.serverID, t.targetuser.id)
        },
        text: `If you keep moaning, maybe`
    },
    {
        required: (t) => {
            return getGag(t.serverID, t.targetuser.id)
        },
        text: `Keep wearing your beautiful gag, then yes, surely`
    },
    {
        required: (t) => {
            return getHeavy(t.serverID, t.targetuser.id)
        },
        text: `Maybe, if you squirm more in your bondage for me`
    },
    {
        required: (t) => {
            return getCollar(t.serverID, t.targetuser.id)
        },
        text: `The answer is attached to your collar!`
    },
    {
        required: (t) => {
            return !getCollar(t.serverID, t.targetuser.id)
        },
        text: `Only collared subbies can know`
    },
    {
        required: (t) => {
            return !getChastityBra(t.serverID, t.targetuser.id)
        },
        text: `If your breasts are protected, the answer is surely yes`
    },
    {
        required: (t) => {
            return !getHeadwearRestrictions(t.serverID, t.targetuser.id).canInspect
        },
        text: `You simply cannot see the answer!`
    },
    {
        required: (t) => {
            return !getHeadwearRestrictions(t.serverID, t.targetuser.id).canEmote
        },
        text: `The answer is probably written on your face`
    },
    {
        required: (t) => {
            return getHeadwearRestrictions(t.serverID, t.targetuser.id).canInspect
        },
        text: `The future is unclear, wear a blindfold`
    },
    {
        required: (t) => {
            return (getArousal(t.serverID, t.targetuser.id) > 50)
        },
        text: `You're too horny to know`
    },
    {
        required: (t) => {
            return (getArousal(t.serverID, t.targetuser.id) > 30)
        },
        text: `The answer is as warm as your breath`
    },
] 

/******
 * Get an 8Ball Question
 * 
 * - (object) data - Object containing { serverID, interactionuser, targetuser }
 * ---
 * ##### Returns a string with the response, modified as necessary. 
 ******/
function getGag8Ball(data) {
    let filteredballanswers = [];
    ballanswers.forEach((ba) => {
        if (typeof ba == "string") {
            filteredballanswers.push(convertPronounsText(ba, data))
        }
        else {
            if (ba.required(data)) {
                filteredballanswers.push(convertPronounsText(ba.text, data));
            }
        }
    })

    return filteredballanswers[Math.floor(Math.random() * filteredballanswers.length)]
}

exports.getGag8Ball = getGag8Ball;