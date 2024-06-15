import { calculateFromTokens } from "./calculate.js";
import { lexer } from "./lexer.js"
import { graph, drawGrid } from "./graph.js";

'use strict';

const calculator = document.querySelector('.calculator')
const input = document.querySelector('#input');
const output = document.querySelector('#output');

const canvasElement = document.querySelector('#graph');
const ctx = canvasElement.getContext('2d');


let canvas = {
    'canvas': canvasElement,
    'ctx' : ctx,
    'width': canvasElement.width,
    'height': canvasElement.height,
    'scale': 5 // ex: 10 means that, centered at (0, 0), the leftmost edge is -10, the right is 10, the top is 10, the bottom is -10
}

function zoom(event, canvas) {
    canvas.scale += event.deltaY * (canvas.scale*0.0008);
    if (canvas.scale > 100) {canvas.scale = 100;}
}

canvasElement.onwheel = (event) => {zoom(event, canvas);};

function tick() {
    update();
    requestAnimationFrame(tick);
}

function update() {
    let expression = input.value;

    let tokens;
    try {
        tokens = lexer(expression);
    }
    catch (err) {
        if (err === 'Syntax error.' || err === 'Unexpected character.') {
            console.log(err)
        } else {
            throw err;
        }
    }

    drawGrid(canvas);

    if (tokens === undefined || tokens.length === 0) {output.textContent = ''; return;}

    let isGraph = tokens.length > 2  && (tokens[0].value === 'y' && tokens[1].type === '=');
    try {
        if (isGraph) {
            graph(canvas, tokens.slice(2));
        } else {
            // normal calculator
            let result = calculateFromTokens(tokens);
            if (isNaN(result)) {output.textContent = ''; return;}
            output.textContent = `= ${result}`;
        }
    }
    catch (err) {
        if (err === 'Syntax error.' || err === 'Variable not found.' || err === 'Incorrect parenthesis.') {
            console.log(err)
        } else {
            throw err;
        }
    }
}


requestAnimationFrame(tick);

/*
bugs:

errors don't work properly

*/
