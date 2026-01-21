// Regex used to separate OOC text from IC text, AND encapsulate linebreaks.
const REGEX_OOC = /(?<OOC>(((?<![\*\\])\*{1})(\*{2})?(\\\*|[^\*]|\*{2})+\*)|((\-#\s+)?((?<!\_)\_{1})(\_{2})?([^\_]|\_{2})+\_))|(?<linebreak>\n)/g;

// Regex used when splitting IC or OOC text.
// > Named capture groups identify what the regex matches.
// > NOTE - REGEX_SENTENCE must *NEVER* match more than one named capture group at a time.
//                       |----  Tags ---| |-Text Emotes >///<-| |------ Match code block -----| |---------------- ANSI Color Username Block -------------------| |-------ANSI Colors -------| |-----------------------------  Match website URLs     ---------------------------------------------------------| |-------- Emojis --------| |----------------- Unicode Emoji -----------------------------------------------| |--- \n -------|
const REGEX_SENTENCE = /(?<tag><@[0-9]+>)|(?<textEmote>(>\/+<))|(?<codeBlock>```((ansi|js))?)|(?<ANSIUsername>\u001b\[[0-9];[0-9][0-9]m([^\u0000-\u0020]+: ?))|(?<ANSIColor>\u001b\[.+?m) ?|(?<websiteURL><?https?\:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)>?)|(?<emoji><a?:[^:]+:[^>]+>)|(?<uncodeEmoji>\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(?<linebreak>\n)/g;

// Regex to find valid positions to drop '\n' before triple backticks.
// > These newlines don't affect the final formatting, but make implementation easier.
const REGEX_CODEBLOCK = /((?<!\n)(?=```[^`\s]+\n)(?=[\s\S]+```))|((?<=```[^`]*\n[^\n`]+)(?=```))/g; // /(?<!\n)(?=```[^`\s]+\n)(?=[\s\S]+```)/g

// Regex to isolate a VALID subscript tag.
// > NOTE: A message that is just " -# " is not a valid subscript - discord treats it as plaintext.
const REGEX_CHECKSUBSCRIPT = /^\s*-#\s+/; //  (?=\S)/

const HIGHESTLEVELNODES = ["IC", "OOC"];

//region messageSplit_AST
/**************************************************
 * Construct an Abstract Syntax Tree-like Model of a Message
 * @param text      - Raw text of the discord message.
 *************************************************/
const messageSplit_AST = (text) => {
	// Sanitize message, then split on newline, removing the delimiter
	let deepCopy = text
		.replace(REGEX_CODEBLOCK, "\n")
		.split("\n")
		.filter((e) => e != "");
	let output = [];

	// Recursively split each newline.
	for (x in deepCopy) {
		messageSplitPush(output, messageSplitRecursive(deepCopy[x]), "line");
	}

	// Determine if lines of the message are subscripted
	configureSubscript(output);

	return output;
};

/**************************************************
 * Helper function to determine if a line needs to be subscripted.
 * @param dollAST   - AST
 *************************************************/
const configureSubscript = (dollAST) => {
	let inCodeBlock = false;
	for (let x = 0; x < dollAST.length; x++) {
		// IC messages always hold the subscript text.
		if (dollAST[x].data[0].type == "IC") {
			if (dollAST[x].data[0].data[0].type == "codeBlock") {
				inCodeBlock = !inCodeBlock;
				dollAST[x].disableSubscript = true;
			} else if (inCodeBlock) {
				dollAST[x].disableSubscript = "codeBlocked";
			}
			if (dollAST[x].data[0].data[0].type == "rawText" && dollAST[x].data[0].data[0].text.match(REGEX_CHECKSUBSCRIPT)) {
				dollAST[x].data[0].data[0].text = dollAST[x].data[0].data[0].text.replace(REGEX_CHECKSUBSCRIPT, "");
				dollAST[x].subscript = true;

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
		newObject["subscript"] = false;
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

	return output;
};

//region Unpack Message
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

//region Useful Tools
/**************************************************
 * Make an AST-ified message subscripted.
 * @param message   - Message object made with splitMessage()
 *************************************************/
const subscriptMessage = (message) => {
	for (x in message) {
		message[x].subscript = true;
	}
};

/**************************************************
 * Remove codeblocks from an AST.
 * @param dollAST - AST
 *************************************************/
const stripCodeblocks = (dollAST) => {
	dollAST = dollAST.filter((e) => {
		return e.data[0].data[0].type != "codeBlock";
	});
	for (let x = 0; x < dollAST.length; x++) {
		if (dollAST[x].disableSubscript === "codeBlocked") {
			dollAST[x].disableSubscript = false;
		}
	}
	return dollAST;
};

/**************************************************
 * Run a function on the AST.
 * @param message - AST
 * @param inFunction - Function to run on the text
 * @param icOnly - Run on only IC parts? Default true.
 * @param type - rawText, but can be emoji, etc.
 *************************************************/
const modifyMessage = (message, inFunction, icOnly = true, type = "rawText") => {
	// For each line
	for (x in message) {
		if (message[x].data && (!icOnly || message[x].type != "OOC")) {
			modifyMessage(message[x].data, inFunction, icOnly, type);
		} else {
			if (message[x].type == type) {
				message[x].text = inFunction(message[x].text);
			}
		}
	}
};

// region Unit Testing
////////////////////////////////////////////////////////
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
console.log(messageSplit_AST(derangedSTR));
console.log(unpackMessage(messageSplit_AST(derangedSTR)));

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
