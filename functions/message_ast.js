const { Message } = require("discord.js");

// Regex used to separate OOC text from IC text, AND encapsulate linebreaks.
const REGEX_OOC_NOCONTROLCHARS = /(?<OOC>(((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_))|(?<linebreak>\n)/g;
const REGEX_OOC =/(?<OOC>(((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*.*\*|\*{2})+\*)(?!)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_))|(?<linebreak>\n)/g;

// Regex used when splitting IC or OOC text.
// > Named capture groups identify what the regex matches.
// > NOTE - REGEX_SENTENCE must *NEVER* match more than one named capture group at a time.
//                      |--corset moans--| |----  Tags ----| |-Text Emotes >///<-| |------ Match code block ---| |---------------- ANSI Color Username Block -------------------| |-------ANSI Colors -------| |-----------------------------  Match website URLs     ---------------------------------------------------------| |-------- Emojis --------| |----------------- Unicode Emoji ------------------------------------------------| |--- \n -------|
const REGEX_SENTENCE = /(?<moan>[^]+)|(?<tag><@[0-9]+>)|(?<textEmote>(>\/+<))|(?<codeBlock>```((ansi|js))?)|(?<ANSIUsername>\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(?<ANSIColor>\u001b\[.+?m) ?|(?<websiteURL><?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(?<emoji><a?:[^:]+:[^>]+>)|(?<unicodeEmoji>\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(?<linebreak>\n)/g;

// Regex to isolate a VALID subscript tag. Identifies if subscript or superscript.
// > NOTE: A message that is just " -# " is not a valid subscript - discord treats it as plaintext.
const REGEX_CHECKSCRIPT = /((?<=^|\n)[\t ]*(?<super>#{1,3})[\t ]+)|((?<=^|\n)[\t ]*(?<sub>-#)[\t ]+)/;

// Regex for isolating code blocks
const REGEX_ISOLATE_CODEBLOCK = /(\n[\t ]*)?```([^`]|`{1,2}(?!`))+```([\t ]*\n)?/;

const HIGHESTLEVELNODES = ["IC", "OOC"];

//region MessageAST Class
/**********************************************
 * Break down provided text into an AST-like format
 ************************************************/
class MessageAST {
	constructor(text) {
		this.data = messageSplit_AST(text, this);
		this.type = "root";
		this.parent = null;
	}
	rebuild(text){
		this.data = messageSplit_AST(text, this);
	}
	/**************************************************
	 * Run a function on the specified type of segment
	 * @param inFunction - Function to call. First two args MUST be text and parent, handled by this.
	 * @param icOnly - Run on IC segments, or IC and OOC?
	 * @param type - Type to run on. Can be a string, or array of strings.
	 * @param args - Additional arguments to pass into inFunction, AFTER text and parent.
	 **************************************************/
	callFunc(inFunction, icOnly = true, type = "rawText", args = []) {
		if(!inFunction){return;}
		// Call a helper due to scope issues with recursive functions
		modifyMessage(this, this, inFunction, icOnly, type, args);
		return this; // Allow chaining
	}
	// Remove all triple-backtick codeblocks
	stripCodeblocks() {
		this.data = this.data.filter((e) => {
			return e.data.length == 0 || e.data[0].data[0].type != "codeBlock";
		});
		for (let x = 0; x < this.data.length; x++) {
			if (this.data[x].disableSubscript === "codeBlocked") {
				this.data[x].disableSubscript = false;
			}
		}
		return this; // Allow chaining
	}
	/*********************************************************************************
	 * Set the subscript flag of all lines of the AST
	 * @param subscript - Level of scripting. -1 for subscript, or 1-3 for 1-3 #'s.
	 ********************************************************************************/
	subscript(subscript = -1) {
		for (x in this.data) {
			this.data[x].subscript = subscript;
		}
		return this; // Allow chaining.
	}
	// Output AST as a string.
	toString() {
		let output = "";
		// For each line
		for (x in this.data) {
			if (this.data[x].data) {
				// Handle Subscripting
				let subscript = this.data[x].type == "line" && this.data[x].subscript != 0 && this.data[x].disableSubscript == false;
				if (subscript) {
					if (this.data[x].subscript > 0) {
						output += "#".repeat(this.data[x].subscript) + " ";
					} else {
						output += "-# ";
					}
				}

				// Handle Newlines
				let linebreak = this.data[x].type == "line" && x < this.data.length - 1;
				output += unpackMessage(this.data[x].data);
				if (linebreak) {
					output += "\n";
				} // Don't output trailing newline
			} else {
				output += this.data[x].text;
			}
		}
		return output;
	}
}

//region messageSplit_AST
/**************************************************
 * Construct an Abstract Syntax Tree-like Model of a Message
 * @param text      - Raw text of the discord message.
 *************************************************/
const messageSplit_AST = (text, parent) => {
	// Isolate codeblocks on newlines, remove preceding whitespace, then split on newlines.
	let deepCopy = isolateCodeBlocks(text)
		.replace(/^[\s]*/, "")
		.split("\n"); //.filter((e) => e != "")
	let output = [];

	//console.log(deepCopy);

	// Recursively split each newline.
	for (x in deepCopy) {
		messageSplitPush(output, messageSplitRecursive(deepCopy[x]), "line");
	}

	// Determine if lines of the message are subscripted
	configureSubscript(output);

	// Configure parent
	configureParent(output, parent);

	return output;
};


/**************************************************
 * Helper function to add parents to nodes.
 * @param text      - Raw text of the discord message.
 *************************************************/
const configureParent = (dollAST, parent) =>  {
	for (let x = 0; x < dollAST.length; x++) {
		dollAST[x].parent = parent
		if(dollAST[x].data){
			for(let y = 0; y < dollAST[x].data.length; y++){
				configureParent(dollAST[x].data, dollAST[x])
			}
		}
	}
}

//region Helper Functions
/**************************************************
 * Helper function to determine if a line needs to be subscripted.
 * @param dollAST   - AST
 *************************************************/
const configureSubscript = (dollAST) => {
	let inCodeBlock = false;
	for (let x = 0; x < dollAST.length; x++) {
		if (dollAST[x].data.length == 0) {
			dollAST[x].disableSubscript = true;
		}
		// IC messages always hold the subscript text.
		else if (dollAST[x].data[0].type == "IC") {
			if (dollAST[x].data[0].data[0].type == "codeBlock") {
				inCodeBlock = !inCodeBlock;
				dollAST[x].disableSubscript = true;
			} else if (inCodeBlock) {
				dollAST[x].disableSubscript = "codeBlocked";
			}
			if (dollAST[x].data[0].data[0].type == "rawText") {
				let matchScript = dollAST[x].data[0].data[0].text.match(REGEX_CHECKSCRIPT);
				if (matchScript) {
					let matchTag = Object.keys(matchScript.groups).find((e) => {
						return !!matchScript.groups[e];
					});
					dollAST[x].data[0].data[0].text = dollAST[x].data[0].data[0].text.replace(REGEX_CHECKSCRIPT, "");
					if (matchTag == "sub") {
						dollAST[x].subscript = -1;
					} else if (matchTag == "super") {
						// Script level is number of '#' in the string. I feel kinda slick for this one.
						dollAST[x].subscript = matchScript.groups[matchTag].length;
					}

					// If the IC fragment is now an empty STR, get rid of it.
					if (dollAST[x].data[0].data[0].text == "") {
						dollAST[x].data[0].data.splice(0, 1);
					}
					if (dollAST[x].data[0].data.length == 0) {
						dollAST[x].data.splice(0, 1);
					}
				}
			}
		}
	}

	// Handle code blocks
};

/**************************************************
 * Add a new object to the syntax tree
 * @param arr   - Array to push onto
 * @param data  - Raw text
 * @param type  - What does this text represent?
 *************************************************/
const messageSplitPush = (arr, data, type) => {
	let newObject = { type: type };

	// Highest-level nodes (IC, OOC) contain arrays of text, and handle subscripting
	if (HIGHESTLEVELNODES.includes(type)) {
		newObject["data"] = data;
		// Lower-level nodes contain raw text only.
	} else if (type == "line") {
		newObject["data"] = data;
		newObject["subscript"] = 0;
		newObject["disableSubscript"] = false;
	} else if (type == "linebreak") {
		newObject["text"] = data;
	} else {
		newObject["text"] = data;
	}
	arr.push(newObject); // Add it to the array.
};

/**************************************************
 * Recursively construct an Abstract Syntax Tree-like Model of a line of text
 * Intended Use: splitMessage(text)
 * @param text      - Raw text of the discord message.
 * @param inRegex   - Regex to split with.
 * @param base      - Is this function call the uppermost level?
 *************************************************/
const messageSplitRecursive = (text, inRegex = REGEX_OOC, base = true) => {
	// RegExp have writable properties - get a fresh copy just in case of synchronization issues.
	let regex = new RegExp(inRegex.source, "g");

	let output = [];

	// Split on the regex, match by match
	let curr, chunk;
	let startIndex = 0;
	while ((curr = regex.exec(text)) !== null) {
		// If anything is before the match, snag it.
		///////////////////////////////////////////////
		if (startIndex != curr.index) {
			chunk = text.substring(startIndex, curr.index);
			if (base) {
				messageSplitPush(output, messageSplitRecursive(chunk, REGEX_SENTENCE, false), "IC");
			} else {
				messageSplitPush(output, chunk, "rawText");
			}
		}

		// Get the match itself.
		////////////////////////////////////////
		let matchTag = Object.keys(curr.groups).find((e) => {
			return !!curr.groups[e];
		});
		if (base && matchTag == "linebreak") {
			messageSplitPush(output, curr[0], matchTag);
		} else if (base) {
			messageSplitPush(output, messageSplitRecursive(curr[0], REGEX_SENTENCE, false), matchTag);
		} else {
			messageSplitPush(output, curr[0], matchTag);
		}
		startIndex = regex.lastIndex;
	}

	// Get the text after the last match, if any.
	if (startIndex < text.length) {
		chunk = text.substring(startIndex);
		if (base) {
			messageSplitPush(output, messageSplitRecursive(chunk, REGEX_SENTENCE, false), "IC");
		} else {
			messageSplitPush(output, chunk, "rawText");
		}
	}

	//if(output.length == 0){messageSplitPush(output,"\n","linebreak")}

	return output;
};

/**************************************************
 * Modify a discord message to put all triple backtick codeblocks on newlines.
 * @param text      - Raw text of a discord message
 *************************************************/
const isolateCodeBlocks = (text) => {
	// RegExp have writable properties - get a fresh copy just in case of synchronization issues.
	let regex = new RegExp(REGEX_ISOLATE_CODEBLOCK.source, "g");
	let output = "";

	// Split on the regex, match by match
	let curr, chunk;
	let startIndex = 0;
	while ((curr = regex.exec(text)) !== null) {
		// If anything is before the match, snag it.
		///////////////////////////////////////////////
		if (startIndex != curr.index) {
			output += text.substring(startIndex, curr.index);
		}

		// Handle the matched codeblock
		chunk = curr[0];
		// Extract header.
		let regex_header = new RegExp(/```(([^\s]+)?\n)?/, "g"); // Match the header of a codeblock with optional language and linebreak
		let match_header = regex_header.exec(chunk);
		let footer_startIndex = regex_header.lastIndex;

		let header = match_header[0].replaceAll("\n", "");
		output += "\n" + header + "\n";

		// Extract footer
		chunk = chunk.substring(footer_startIndex);
		let regex_footer = new RegExp(/\n?```/, "g"); // Match the footer
		let match_footer = regex_footer.exec(chunk);

		output += chunk.substring(0, match_footer.index);
		output += "\n```\n";

		startIndex = regex.lastIndex;
	}

	// Get the text after the last match, if any.
	if (startIndex < text.length) {
		output += text.substring(startIndex);
	}

	return output;
};

/**************************************************
 * Unpack AST message into raw text.
 * @param message   - Message object
 *************************************************/
const unpackMessage = (message) => {
	let output = "";
	// For each line
	for (x in message) {
		if (message[x].data) {
			// Handle Subscripting
			let subscript = message[x].type == "line" && message[x].subscript == true && message[x].disableSubscript == false;
			if (subscript) {
				output += "-# ";
			}

			//  Handle Newlines
			let linebreak = message[x].type == "line" && x < message.length - 1;
			output += unpackMessage(message[x].data);
			if (linebreak) {
				output += "\n";
			}
		} else {
			output += message[x].text;
		}
	}
	return output;
};

/**************************************************
 * Run a function on the AST.
 * Automatically removes empty objects.
 * @param message - AST
 * @param inFunction - Function to run on the text
 * @param icOnly - Run on only IC parts? Default true.
 * @param type - rawText, but can be emoji, etc.
 *************************************************/
const modifyMessage = (message, parent, inFunction, icOnly = true, type = "rawText", args) => {
	// Handle lowest-level node by modifying text.
	if(message.text && !message.data){
		// Do we edit this message?
		let modify = Array.isArray(type) ? (type.includes(message.type)) : (type == message.type)
		if (modify) {
			//console.log(args)
			let ret = inFunction(message.text, parent, ...args);
			if(ret !== undefined){message.text = ret}
		}
	// Drop into lower levels.
	}else{
		// Carry parent down
		// For each line
		for (x in message.data) {
			if (message.data[x].text || message.data[x].type == "IC" || message.data[x].type == "line"  || (!icOnly && message.data[x].type == "OOC")) {
				modifyMessage(message.data[x], message, inFunction, icOnly, type, args);
			}
		}
		// Filter out empty stuff
		message.data = message.data.filter((e) => {return checkEmpty(e)})
	}
};

const checkEmpty = (node) => {
	if(node.data){
		if(node.data.length == 0){return false;}
	}else{
		if(node.text == ""){return false}
	}
	return true;
}

// region Unit Testing
////////////////////////////////////////////////////////
const runOldTests = () => {
	console.log("Unit Test #1\n--------------------");
	let strA = "Test meowssage. >///< *Italics meowssage.* More text. *Meowre text! >///<* uwu";
	let strA_result = messageSplit_AST(strA);

	console.log("Original: " + strA);
	console.log("Unpacked: " + unpackMessage(strA_result));
	console.log(strA_result);
	console.log(`TEST #1 RESULT - ${strA == unpackMessage(strA_result) ? "PASSED!" : "FAILED T_T"}`);

	console.log("\nUnit Test #2 - Code Block!\n--------------------");
	let strB = "Code block incoming!```ansi\nOh no!```";
	let strB_result = messageSplit_AST(strB);

	console.log("Original:\n" + strB);
	console.log("Unpacked:\n" + unpackMessage(strB_result));
	console.log(strB_result);

	strB_result = stripCodeblocks(strB_result);
	subscriptMessage(strB_result);
	console.log(strB_result);
	console.log("Unpacked:\n" + unpackMessage(strB_result));
	//console.log(`TEST #2 RESULT - ${strB == unpackMessage(strB_result) ? "PASSED!" : "FAILED T_T"}`)

	console.log("\nUnit Test #3\n--------------------");
	let strC = "-# *Wriggles in a corset. *>///< I got put in a corset. *Smol text.*\n-# Smol text.\nLarge text.";
	let strC_result = messageSplit_AST(strC);

	console.log("Original:\n" + strC);
	console.log("Unpacked:\n" + unpackMessage(strC_result));
	console.log(strC_result);
	console.log(`TEST #3 RESULT - ${strC == unpackMessage(strC_result) ? "PASSED!" : "FAILED T_T"}`);

	const meowify = (text) => {
		return ":3c";
	};

	modifyMessage(strC_result, meowify, false, "textEmote");
	console.log("EDITED:\n" + unpackMessage(strC_result));

	console.log("\nUnit Test #4\n--------------------");
	let strD = "Oh, how I wish someone would put me into a corset!\n```ansi\ndon't corset this```";
	let strD_result = messageSplit_AST(strD);
	subscriptMessage(strD_result);
	console.log(strD_result);

	console.log("Original:\n" + strD);
	console.log("Unpacked:\n" + unpackMessage(strD_result));

	// TODO - Fix this pile of garbage.
	let derangedSTR = "some text ```ansi\nsome text```meow\n```ansi\nmore text```";
	let derangedOUT = messageSplit_AST(derangedSTR);
	console.log(derangedOUT);
	console.log(unpackMessage(derangedOUT));

	// TODO - Fix this pile of garbage.
	let derangedSTR3 = "Have some text ```and a fucking inline codeblock```";
	console.log(messageSplit_AST(derangedSTR3));
	console.log(unpackMessage(messageSplit_AST(derangedSTR3)));

	// Really awkward unit test.
	let derangedSTR2 = " -# ";
	let derangedOutput2 = messageSplit_AST(derangedSTR2);
	derangedOutput2[0].subscript = false;
	console.log(derangedOutput2);
	console.log(`"${unpackMessage(derangedOutput2)}"`);

	let dollSTR = "```ansi\n[1;35mDOLL-0014: [0mtext```";
	console.log("Original:\n" + dollSTR);

	let dollSTRAST = messageSplit_AST(dollSTR);
	console.log(dollSTRAST);
	modifyMessage(dollSTRAST, meowify);
	console.log("Edited:\n" + unpackMessage(dollSTRAST));
};

// Run unit tests on MessageAST
////////////////////////////////////
const testClass_MessageAST = () => {
	let meowify = (text) => {
		return text + ":3c";
	};
	console.log("AST Testing:");

	console.log("TEST 1 - ");

	let newASTTest = new MessageAST("```ansi\n[1;35mDOLL-0014: [0mtext```");
	console.log(newASTTest.stripCodeblocks().callFunc(meowify).subscript().toString());

	testSTR_1 = "-# I am whispering 💜 \n*The doll is being really quiet for some reason.*\n\nOkay, okay.  I'll talk like a normal person now. >///<";
	testAST_1 = new MessageAST(testSTR_1);

	console.log("Original: " + testSTR_1);
	console.log("Modified: " + testAST_1.subscript().toString());

	testSTR_2 = "Oh, how I wish someone would put me into a corset!\n```ansi\ndon't corset this```";
	testAST_2 = new MessageAST(testSTR_2);
	console.log("Original: " + testSTR_2);
	console.log("Modified: " + testAST_2.subscript(2).toString());

	testSTR_3 = "some text ```ansi\nsome text```meow```ansi\nmore text```text";
	testAST_3 = new MessageAST(testSTR_3);
	console.log("Original: " + testSTR_3);
	console.log("Modified: " + testAST_3.subscript().toString());

	testSTR_4 = " # RAWR! BIG KITTY!\n -# rawr.... smol kitty....";
	testAST_4 = new MessageAST(testSTR_4);
	console.log("Original: " + testSTR_4);
	console.log("Modified: " + testAST_4.subscript(3).toString());
};


const test_callFunc = () => {

	let matchFound = {"modified": false,}
	const replaceEmoji = (text, parent, replaceEmoji, matchFound) => {
		if(text != replaceEmoji){
			matchFound.modified = true;
			console.log(parent.parent.subscript)
			return replaceEmoji;
		}
	}

	const purgeText = (text, parent) => {
		return ""
	}

	testSTR_1 = "Test meowssage <:vanillaBlush:395448030003855360>"

	testAST_1 = new MessageAST(testSTR_1)
	console.log(testAST_1)
	testAST_1.subscript(1)
	testAST_1.callFunc(replaceEmoji,true,["emoji","unicodeEmoji"],["",matchFound])
	
	console.log(testAST_1)
	console.log(testAST_1.toString())
	console.log(matchFound.modified)


	let testSTR_2 = "Test meowssage >////< Gonna test that meowssage!  >////<\nMeow!"
	let testAST_2 = new MessageAST(testSTR_2)
	console.log(testAST_2)
	testAST_2.callFunc(purgeText)
	console.log(testAST_2.toString())
	console.log(testAST_2)
}

//testClass_MessageAST();
//test_callFunc();

exports.MessageAST = MessageAST;
