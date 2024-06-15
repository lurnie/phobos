import { lexer } from './lexer.js'

class BinaryNode {
    constructor(value, left=null, right=null,) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

function parseAtom(tokens) {
    let left = tokens.shift();
    if (left.type === '(') {
        left = parseExpr(tokens);
        if (tokens.length < 1 || tokens.shift().type !== ')') {
            throw ('Incorrect parenthesis.');
        }
        return left;}
    return new BinaryNode(left);
}
function parsePow(tokens) {
    let left = parseAtom(tokens);

    let symbol;
    if (tokens[0]) {symbol = tokens[0].type};

    while (tokens.length > 1 && symbol === '^') {
        tokens.shift();
        let right = parseUnary(tokens);
        left = new BinaryNode(symbol, left, right);
        if (tokens[0]) {symbol = tokens[0].type;}
    }
    return left;
}

function parseUnary(tokens) {
    if (tokens.length > 1 && tokens[0].type === '-') {
        tokens.shift();
        // using the unary operator - is treated as a shortcut for multiplying by -1
        return new BinaryNode('*', new BinaryNode({'type': 'number', 'value': -1}), parsePow(tokens));
    }
    return parsePow(tokens);
}

function parseMultDiv(tokens) {
    let left = parseUnary(tokens);

    let symbol;
    if (tokens[0]) {symbol = tokens[0].type};

    while (tokens.length > 1 && (symbol === '*' || symbol === '/')) {
        tokens.shift();
        let right = parseUnary(tokens);
        left = new BinaryNode(symbol, left, right);
        if (tokens[0]) {symbol = tokens[0].type;}
    }
    return left;
}

function parseAddSub(tokens) {
    let left = parseMultDiv(tokens);

    let symbol;
    if (tokens[0]) {symbol = tokens[0].type};

    while (tokens.length > 1 && (symbol === '+' || symbol === '-')) {
        tokens.shift();
        let right = parseMultDiv(tokens);
        left = new BinaryNode(symbol, left, right);
        if (tokens[0]) {symbol = tokens[0].type;}
    }
    return left;
}

function parseExpr(tokens) {
    return parseAddSub(tokens);
}

function evaluateTree(node, variables) {
    let token = node.value;

    if (node.left === null || node.right === null) {
        if (token.type === 'variable') {
            if (Object.hasOwn(variables, token.value)) {return variables[token.value];}
            else {
                throw ('Variable not found.');
            }
        } else if (token.type === 'number') {
            return token.value;
        } else {
            // TODO: add error?
        }
    }

    let func;
    if (node.value === '^') {func = (a, b) => {return Math.pow(a, b)};}
    if (node.value === '+') {func = (a, b) => {return a+b};}
    if (node.value === '-') {func = (a, b) => {return a-b};}
    if (node.value === '*') {func = (a, b) => {return a*b};}
    if (node.value === '/') {func = (a, b) => {return a/b};}
    return func(evaluateTree(node.left, variables), evaluateTree(node.right, variables));
}

function calculateFromTokens(givenTokens, variables={}) {
    let defaultVariables = {'pi': Math.PI, 'e': Math.E};
    variables = Object.assign(variables, defaultVariables);

    let tokens = givenTokens.slice();
    if (tokens === undefined) {return;}


    let parsed = parseExpr(tokens);
    return evaluateTree(parsed, variables);
}

function calculateFromStr(expression) {
    let tokens = lexer(expression);
    if (tokens === undefined) {return;}
    return evaluateTree(parseExpr(tokens));
}

export {calculateFromStr, calculateFromTokens};