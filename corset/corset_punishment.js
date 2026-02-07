// Punishment Corset
// tightens after overexertion
exports.gaspCoefficient = 1.2

// We should consider rewriting this to use a UserVar like the Livingwood set.
exports.afterUsingBreath = function (data) {
    if (data.tightness < 11 && data.corset.breath < this.minBreath[data.tightness]) {
        data.corset.tightness++;
    }
}

exports.name = "Punishment Corset"