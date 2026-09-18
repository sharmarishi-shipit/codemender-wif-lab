const adminService = require('../../services/admin.service');

function evaluateFormula(formula) {
    if (typeof formula !== 'string' && typeof formula !== 'number') {
        throw new Error('Invalid formula');
    }
    const str = String(formula);
    let pos = 0;

    function skipWhitespace() {
        while (pos < str.length && /\s/.test(str[pos])) {
            pos++;
        }
    }

    function parseExpression() {
        let val = parseTerm();
        skipWhitespace();
        while (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
            const op = str[pos++];
            const nextVal = parseTerm();
            if (op === '+') val += nextVal;
            else val -= nextVal;
            skipWhitespace();
        }
        return val;
    }

    function parseTerm() {
        let val = parseFactor();
        skipWhitespace();
        while (pos < str.length && (str[pos] === '*' || str[pos] === '/' || str[pos] === '%')) {
            const op = str[pos++];
            const nextVal = parseFactor();
            if (op === '*') val *= nextVal;
            else if (op === '/') val /= nextVal;
            else val %= nextVal;
            skipWhitespace();
        }
        return val;
    }

    function parseFactor() {
        skipWhitespace();
        if (pos < str.length && (str[pos] === '+' || str[pos] === '-')) {
            const op = str[pos++];
            const val = parseFactor();
            return op === '-' ? -val : val;
        }
        return parsePrimary();
    }

    function parsePrimary() {
        skipWhitespace();
        if (pos < str.length && str[pos] === '(') {
            pos++;
            const val = parseExpression();
            skipWhitespace();
            if (pos >= str.length || str[pos] !== ')') {
                throw new Error('Mismatched parentheses');
            }
            pos++;
            return val;
        }

        const start = pos;
        while (pos < str.length && ((str[pos] >= '0' && str[pos] <= '9') || str[pos] === '.')) {
            pos++;
        }
        if (start === pos) {
            throw new Error(`Unexpected character at ${pos}: ${str[pos]}`);
        }
        const numStr = str.slice(start, pos);
        const num = Number(numStr);
        if (isNaN(num)) {
            throw new Error(`Invalid number: ${numStr}`);
        }
        return num;
    }

    const result = parseExpression();
    skipWhitespace();
    if (pos < str.length) {
        throw new Error(`Unexpected character at ${pos}: ${str[pos]}`);
    }
    if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Evaluation result is not a number');
    }
    return result;
}

exports.checkShippingStatus = (req, res) => {
    adminService.pingProvider(req.body.providerIP, req.body.options, out => res.send(out));
};

exports.previewDynamicPricing = (req, res) => {
    try {
        res.json({ price: evaluateFormula(req.body.formula) });
    } catch (e) {
        res.status(400).send("Evaluation Failed");
    }
};
