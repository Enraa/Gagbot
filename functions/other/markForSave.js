/********
 * Marks a process variable for saving. Supply an array to save multiple.
 * 
 * - (string | array) pv - The process variable or variables to save
 * ---
 * ##### *No return value*
 ********/
function markForSave(pv) {
    if (process.readytosave == undefined) {
        process.readytosave = {} 
    }
    if (Array.isArray(pv)) {
        pv.forEach((p) => {
            process.readytosave[pv] = true;
        })
    }
    else {
        process.readytosave[pv] = true;
    }
}

exports.markForSave = markForSave;