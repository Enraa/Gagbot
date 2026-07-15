/***************
 * Given a parent object that is a Message_AST, gets to the root, and then inserts a message at the location in the AST. 
 * 
 * - (message AST) parent - The Message AST to insert into
 * - (array) locarr - The Location Array of the message function. Text will be inserted just before the current segment's locarr.
 * - (string) text - The text to insert into the AST
 * - (string) segmenttype? - "OOC" or "IC", defaults to OOC
 * - (boolean) after? - If true, will insert AFTER the current segment (+1 on final locarr entry)
 * ---
 * ##### *No return value*
 ***************/
function insertIntoAST(parent, locarr, text, segmenttype = "OOC", after = false) {
    // while loop parent to get to the root segment. 
    let parentroot = parent;
    let nested = 0;
    while ((nested < 100) && parentroot.type != "root") {
        parentroot = parentroot.parent;
    }
    // If after is specified, then increment the second to last locarr by 1
    if ((locarr.length > 1) && after) {
        locarr[locarr.length-1] = (locarr[locarr.length-1] + 1)
    }

    // And finally, insert OOC segment using locarr. 
    parentroot.insertSegment(locarr, segmenttype, text);
}

exports.insertIntoAST = insertIntoAST;