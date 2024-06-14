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
    if (left === '(') {left = parseExpr(tokens); tokens.shift(); return left;}
    return new BinaryNode(left);
}
function parsePow(tokens) {
    let left = parseAtom(tokens);
    let symbol = tokens[0];
    while (symbol === '^') {
        tokens.shift();
        let right = parseUnary(tokens);
        left = new BinaryNode(symbol, left, right);
        symbol = tokens[0];
    }
    return left;
}

function parseUnary(tokens) {
    if (tokens[0] === '-') {
        tokens.shift();
        return new BinaryNode('*', new BinaryNode(-1), parsePow(tokens));
    }
    return parsePow(tokens);
}

function parseMultDiv(tokens) {
    let left = parseUnary(tokens);
    let symbol = tokens[0];
    while (symbol === '*' || symbol === '/') {
        tokens.shift();
        let right = parseUnary(tokens);
        left = new BinaryNode(symbol, left, right);
        symbol = tokens[0];
    }
    return left;
}

function parseAddSub(tokens) {
    let left = parseMultDiv(tokens)
    let symbol = tokens[0]
    while (symbol === '+' || symbol === '-') {
        tokens.shift();
        let right = parseMultDiv(tokens);
        left = new BinaryNode(symbol, left, right);
        symbol = tokens[0];
    }
    return left;
}

function parseExpr(tokens) {
    return parseAddSub(tokens);
}

function evaluateTree(node, variables) {
    if (Object.hasOwn(variables, node.value)) {return variables[node.value];}


    if (node.left === null || node.right === null) {return node.value;}

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
    return evaluateTree(parseExpr(tokens), variables);
}

function calculateFromStr(expression) {
    let tokens = lexer(expression);
    if (tokens === undefined) {return;}
    return evaluateTree(parseExpr(tokens));
}

export {calculateFromStr, calculateFromTokens};