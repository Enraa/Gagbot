const garbleText = (text) => {
    let inputNumber = text.length
    let output = ''; // Empty target output, dont change
    let gagSoundList = [
	"I love serving my Owners!",
	"I exist to serve!",
	"I exist to please!",
	"Tease me!",
	"Mmmghhh~ more please~",
	"Mmmmmhmmm~ <3",
	"Please, dont stop~",
	"I love Meowstress Enraa!",
	"I love being bound!",
	"I need to live in a kinky dungeon cell!",
	"Please, tie me up!",
	"Spank me!",
	"Tie me!",
	"Gag me more!",
	"Use me as you wish!",
	"Make me kneel!",
	"Bend me over!",
	"Let me serve!",
	"More orders please~",
	"Make me submit~",
	"I am a good sub!"] //Replacement lines
	
	while (inputNumber > 0){
		inputNumber -= Math.floor(Math.random*4 + 18) 
		// replacer function to output, removing $[input[i]} removes the original word
		output = `${output}${gagSoundList[Math.floor(Math.random() * gagSoundList.length)]} \n` 
    }
    output = `${output} Thank you for showing this Sub her place` //Final addition to output at the end, any text 
    return output //Return
}

exports.garbleText = garbleText;
exports.choicename = "Good Sub Gag"