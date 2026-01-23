const garbleText = (text) => {
	let newtextparts = text.split(" ");
	let outtext = "";
	for (let i = 0; i < newtextparts.length; i++) {
		for (let t = 0; t < newtextparts[i].length; t++) {
			if (newtextparts[i].charAt(t).match(/[a-z]/i)) {
				if (t == 0) {
					outtext = `${outtext}g`;
				} else {
					outtext = `${outtext}h`;
				}
			} else if (newtextparts[i].charAt(t).match(/[A-Z]/i)) {
				if (t == 0) {
					outtext = `${outtext}G`;
				} else {
					outtext = `${outtext}H`;
				}
			} else {
				outtext = `${outtext}${newtextparts[i].charAt(t)}`;
			}
		}
		outtext = `${outtext} `;
	}
	return outtext;
};

exports.garbleText = garbleText;
exports.choicename = "Ring Gag";
