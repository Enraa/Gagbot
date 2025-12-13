
const processChunks = (text, func) => {
    const words = text.split(" ");

    const letter_chunks = words.map(word => {
        let chunks = [];
        let current_chunk = "";
        for (let char of word) {
            if (current_chunk && Boolean(current_chunk.match(/[a-zA-Z]/)) != Boolean(char.match(/[a-zA-Z]/))) {
                chunks.push(current_chunk);
                current_chunk = char;
            } else {
                current_chunk += char;
            }
        }
        if (current_chunk) {
            chunks.push(current_chunk);
        }

        if (chunks[0] == ":" && chunks[chunks.length - 1] == ":") {
            chunks = [chunks.join("")];
        }
        return chunks;
    });

    return letter_chunks.map(word => {
        return word.map(chunk => {
            if (chunk.startsWith(":") && chunk.endsWith(":")) {
                return chunk;
            }
            return func(chunk);
        }).join("");
    }).join(" ");
}

const processWords = (text, func) => {
    const words = text.split(" ");
    return words.map((word) => {
            if (word.startsWith(":") && word.endsWith(":")) {
                return word;
            }
            return func(word);
        }
    ).join(" ");
}

exports.processChunks = processChunks;
exports.processWords = processWords;