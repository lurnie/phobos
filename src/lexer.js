function numberify(num) {
    // used so that certain constants, like e or pi, don't turn into NaN
    if (num === 'e' || num === 'pi' || num === 'y' || num === 'x') {return num;}
    return Number(num);
}

function lexer(string) {
    let tokens = [];
    let currentNum = 0;

    function addToken(type, value=null) {
        tokens.push({
            'type': type,
            'value': value
        });
    }

    function isDigit(a) {
        return (!isNaN(a) && (0 >= a <= 9));
    }
    function isLetter(a) {
        let code = a.charCodeAt();
        // checks if it's a letter A through Z
        return ((code >= 'a'.charCodeAt() && code <= 'z'.charCodeAt()) || (code >= 'A'.charCodeAt() && code <= 'Z'.charCodeAt()));
    }

    function number() {
        let current = string[currentNum];
        let num = '';
        while (currentNum < string.length && isDigit(current) ) {
            num += current;

            currentNum++;
            current = string[currentNum];
        }
        if (currentNum < string.length) {currentNum--;}

        addToken('number', Number(num));
    }

    function variable() {
        let current = string[currentNum];
        let variableName = '';
        while (currentNum < string.length && isLetter(current) ) {
            variableName += current;

            currentNum++;
            current = string[currentNum];
        }
        if (currentNum < string.length) {currentNum--;}

        addToken('variable', variableName);
    }

    const symbols = ['^', '*', '/', '+', '-', '(', ')', '='];


    while (currentNum < string.length) {
        let current = string[currentNum];

        if (symbols.includes(current)) {
            if (tokens.length > 0) {
                let lastToken = tokens[tokens.length-1];

                if (lastToken.type === 'number' || lastToken.type === 'variable' || lastToken.type === ')') {
                    if (current === '(') {
                        addToken('*');
                    }
                } else {
                    if (current !== '(' && current !== '-') {
                        throw ('Syntax error.');
                    }
                }

            } else {
                if (current !== '(' && current !== '-') {
                    throw ('Syntax error.');
                }
            }
            if (currentNum + 1 === string.length && current !== ')') {
                throw ('Syntax error.');
            }
            addToken(current);
        }
        else {
            if (isDigit(current)) {
                number();
            }
            else if (isLetter(current)) {
                if (tokens.length > 0) {
                    let lastToken = tokens[tokens.length-1];
                    if (lastToken.type === 'number' || lastToken.type === 'variable' || lastToken.type === ')') {
                        addToken('*');
                    }
                }
                variable();
            } else {
                throw ('Unexpected character.');

            }
        }

        currentNum++;
    }
    return tokens;
}

export {lexer};