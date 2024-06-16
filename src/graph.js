import { calculateFromTokens } from "./calculate.js";

function getScreenX(mathX, canvas) {
    return (((mathX-canvas.camX)/canvas.scale) + 1) * (canvas.width/2)
}
function getMathX(screenX, canvas) {
    return (((screenX/(canvas.width/2))-1) * canvas.scale) + canvas.camX;
}

function getScreenY(mathY, canvas) {
    return canvas.height-(((mathY - canvas.camY)/canvas.scale) + 1) * (canvas.height/2);
}

function graph(canvas, tokens) {
    const constantWidth = (3/500);
    canvas.ctx.lineWidth = constantWidth*canvas.width;
    canvas.ctx.strokeStyle = 'blue'


    let screenY = 0;
    let oldMathX = 1;
    let oldScreenY = 0;

    let xStep = 1*(5/canvas.scale);
    if (xStep > 1) {xStep = 1;}

    for (let screenX = -xStep; screenX <= canvas.width; screenX += xStep) {
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(screenX-1, oldScreenY);

        let mathX = getMathX(screenX, canvas);

        let mathY = calculateFromTokens(tokens, {'x': mathX}); // gets the Y value

        screenY = getScreenY(mathY, canvas);

        let wentToPosAndNegInfinity = (oldScreenY > canvas.height && screenY < 0) || (oldScreenY < 0 && screenY > canvas.height);


        if (screenX >= 0 && !wentToPosAndNegInfinity) {canvas.ctx.lineTo(screenX, screenY);}

        canvas.ctx.closePath()
        canvas.ctx.stroke()

        oldMathX = mathX;
        oldScreenY = screenY;
    }
}


function drawGrid(canvas) {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the grid
    canvas.ctx.strokeStyle = 'grey';

    let gridDistance = 1;

    let pixelGridDistance = canvas.width/(canvas.scale*2/gridDistance);

    const constantWidth = (2/500)

    for (let x = getScreenX(Math.ceil((canvas.camX - canvas.scale)), canvas); x < canvas.width; x += pixelGridDistance) {
        canvas.ctx.lineWidth = constantWidth*canvas.width*0.1;
        if (Math.round(x) === Math.round(getScreenX(0, canvas))) {
            canvas.ctx.lineWidth = constantWidth*canvas.width;
        }
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(x, 0);
        canvas.ctx.lineTo(x, canvas.height);

        canvas.ctx.closePath();
        canvas.ctx.stroke();

    }
    for (let y = getScreenY(Math.ceil(canvas.camY + canvas.scale), canvas); y < canvas.height; y += pixelGridDistance) {
        canvas.ctx.lineWidth = constantWidth*canvas.height*0.2;
        if (Math.round(y) === Math.round(getScreenY(0, canvas))) {
            canvas.ctx.lineWidth = constantWidth*canvas.width;
        }
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(0, y);
        canvas.ctx.lineTo(canvas.width, y);

        canvas.ctx.closePath();
        canvas.ctx.stroke();
    }
}

export {drawGrid, graph};