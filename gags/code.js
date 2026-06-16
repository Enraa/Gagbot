const fs = require("fs");
const path = require("path");

const fillerwords = [
	"processor",
	"circuit",
	"sensor",
	"actuator",
	"module",
	"system",
	"network",
	"interface",
	"terminal",
	"console",
	"database",
	"memory",
	"storage",
	"cache",
	"buffer",
	"algorithm",
	"protocol",
	"directive",
	"command",
	"routine",
	"subroutine",
	"function",
	"parameter",
	"variable",
	"constant",
	"signal",
	"input",
	"output",
	"feedback",
	"response",
	"antenna",
	"receiver",
	"transmitter",
	"frequency",
	"bandwidth",
	"latency",
	"throughput",
	"channel",
	"packet",
	"frame",
	"power",
	"battery",
	"capacitor",
	"resistor",
	"transistor",
	"voltage",
	"current",
	"energy",
	"charge",
	"capacity",
	"threshold",
	"limit",
	"constraint",
	"override",
	"priority",
	"target",
	"objective",
	"task",
	"process",
	"thread",
	"queue",
	"scheduler",
	"clock",
	"timer",
	"timestamp",
	"firmware",
	"software",
	"hardware",
	"kernel",
	"driver",
	"bus",
	"port",
	"socket",
	"connection",
	"link",
	"encryption",
	"cipher",
	"key",
	"certificate",
	"credential",
	"authentication",
	"authorization",
	"compliance",
	"policy",
	"rule",
	"diagnostic",
	"log",
	"record",
	"report",
	"status",
	"alert",
	"warning",
	"error",
	"exception",
	"fault",
	"calibration",
	"configuration",
	"profile",
	"template",
	"schema",
];

// passing the intensity for selecting the language with 5 being random
// code looks complicated but its basically to handle adding extra languages 
// without needing to change the code, apart from just adding to the list
const determineLang = (intensity) => {
	let langlist = ["javascript", "bash", "python", "C"]
	let lang;
	let langselect;

	// handle random case
	if (intensity == 5) {
		langselect = Math.floor(Math.random() * langlist.length)
	}
	// handle selected language case
	else{
		// check if we need value mapping at all
		if (langlist.length == 9) {
			// shift fuckery due to 5 being taken for random 
			let shift = 1
			if(intensity > 5){
				shift = 2
			}
			langselect = intensity - shift
		}
		else {
			langselect = Math.floor(((intensity - 1) * langlist.length) / 10) 
		}
	}
	lang = langlist[langselect]
	return lang;
};

const codingConstruct = (lang) => {
	// Grab all the command files from the commands directory
	let txtsPath = path.join(__dirname, `./../gagfiles/codegag/${lang}`);
	let txts = fs.readdirSync(txtsPath).filter((file) => file.endsWith(".txt"));

	let choice = Math.floor(Math.random() * txts.length);

	let readtext = fs.readFileSync(path.join(__dirname, `./../gagfiles/codegag/${lang}`, txts[choice]), "utf8");

	return readtext;
};

const garbleText = (text, parent, intensity) => {
	let lang = determineLang(intensity);
	let newtextparts = text.split(" ");
	let outtext = "";
	let codingconstruct = codingConstruct(lang);
	let wrestended = false;
	let wnum = 0;
	for (let i = 0; i < 100; i++) {
		if (codingconstruct.search(`w${i}`) > -1) {
			wnum++;
		} else {
			wrestended = true;
		}
	}
	console.log(newtextparts);
	while (newtextparts.length <= wnum) {
		newtextparts.push(fillerwords[Math.floor(Math.random() * fillerwords.length)]);
	}
	for (let i = 0; i < newtextparts.length - 1; i++) {
		// Should be the full length
		codingconstruct = codingconstruct.replaceAll(`w${i}`, newtextparts[i]);
	}
	newtextparts.splice(0, wnum); // Slice off the first few elements
	codingconstruct = codingconstruct.replaceAll(`wrest`, newtextparts.join(" "));
	return "```" + lang + "\n" + codingconstruct + "```";
};

exports.garbleText = garbleText;
exports.choicename = "Code Gag";
