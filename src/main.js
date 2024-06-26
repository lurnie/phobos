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
    'scale': 5, // ex: 10 means that, centered at (0, 0), the leftmost edge is -10, the right is 10, the top is 10, the bottom is -10
    'camX': 0,
    'camY': 0
}

function zoom(event, canvas) {
    canvas.scale += event.deltaY * (canvas.scale*0.0008);
    if (canvas.scale > 100) {canvas.scale = 100;}
}

canvasElement.onwheel = (event) => {zoom(event, canvas);};

let mouseDown = false;

document.addEventListener('mousedown', () => {
    mouseDown = true;
})

document.addEventListener('mouseup', () => {
    mouseDown = false;
})


function tick() {
    update();
    requestAnimationFrame(tick);
}

let mouse = {
    'x': 0,
    'y': 0
};

let mouseOver = false;
canvasElement.addEventListener('mouseover', () => {
    mouseOver = true;
}),
canvasElement.addEventListener('mouseout', () => {
    mouseOver = false;
})

document.addEventListener('mousemove', (event) => {
    let changeX = mouse.x - event.clientX;
    let changeY = event.clientY - mouse.y;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    const scale = 3.15; // this is an approximation of a speed that looked right, it's not exact. for some reason just 2 wouldn't work
    if (mouseDown && mouseOver) {
        canvas.camX += changeX/canvas.width * (canvas.scale*scale);
        canvas.camY += changeY/canvas.height * (canvas.scale*scale);
    }
})

function update() {
    let expression = input.value;

    let tokens;
    try {
        tokens = lexer(expression);
    }
    catch (err) {
        output.textContent = ''
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
            output.textContent = ''
        } else {
            // normal calculator
            let result = calculateFromTokens(tokens);
            if (isNaN(result)) {output.textContent = ''; return;}
            output.textContent = `= ${result}`;
        }
    }
    catch (err) {
        output.textContent = '';
        if (err === 'Function not found.' || err === 'Variable not found.' || err === 'Incorrect parenthesis.' || err === 'Function missing input.' || err === 'Unexpected equal sign.') {
            console.log(err)
        } else {
            throw err;
        }
    }
}


requestAnimationFrame(tick);
