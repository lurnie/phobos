function numberify(num) {
    // used so that certain constants, like e or pi, don't turn into NaN
    if (num === 'e' || num === 'pi' || num === 'y' || num === 'x') {return num;}
    return Number(num);
}

const symbols = ['^', '*', '/', '+', '-', '(', ')', '='];

function lexer(string) {
    let content = [];
    let current = '';
    for (let i = 0; i < string.length; i++) {
        if (symbols.includes(string[i])) {
            // the current value is a symbol

            // this should be simplified and made more complete
            let incorrectSyntax = (
                i === 0 || (string[i] === '=' && string[i-1] !== 'y') || string[i-1] === '(' || ((i+1 === string.length && string[i] !== '=') || string[i+1] === ')') || (symbols.includes(string[i-1]) && string[i-1] !== ')')) && string[i] !== '(' && string[i] !== ')' && string[i] !== '-';
            if (incorrectSyntax) {return undefined;}

            if (current !== '') {
                content.push(numberify(current));
                }
            if (current !== '' && string[i] === '(') {content.push('*')}; // multiplication by juxtaposition
            // TODO: add multiplication by juxtaposition after parentheses, i.e. (1)2
            // warning this could have some problems with it thinking (1)-2 is (1)*-2... so maybe this isn't a good idea to implement?
            content.push(string[i]);
            current = '';
            continue;
        }
        current += string[i];

        if (i + 1 === string.length) {
            content.push(numberify(current));
        }
    }
    return content;
}

export {lexer};