import { calculateFromTokens } from "./calculate.js";

function getScreenX(mathX, canvas) {
    return ((mathX/canvas.scale) + 1) * (canvas.width/2)
}
function getMathX(screenX, canvas) {
    return ((screenX/(canvas.width/2))-1) * canvas.scale;
}

function getScreenY(mathY, canvas) {
    return canvas.height-((mathY/canvas.scale) + 1) * (canvas.height/2);
}

function graph(canvas, tokens) {
    const constantWidth = (3/500);
    canvas.ctx.lineWidth = constantWidth*canvas.width;
    canvas.ctx.strokeStyle = 'blue'


    let screenY = 0;

    console.log(calculateFromTokens(tokens, {'x': 1}))

    for (let screenX = -1; screenX <= canvas.width; screenX++) {
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(screenX-1, screenY);

        let mathX = getMathX(screenX, canvas);

        let mathY = calculateFromTokens(tokens, {'x': mathX}); // gets the Y value

        screenY = getScreenY(mathY, canvas)
        if (screenX >= 0) {canvas.ctx.lineTo(screenX, screenY);}

        canvas.ctx.closePath()
        canvas.ctx.stroke()
    }
}


function drawGrid(canvas) {
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the grid
    canvas.ctx.strokeStyle = 'grey';

    let gridDistance = 1;

    let pixelGridDistance = canvas.width/(canvas.scale*2/gridDistance);

    const constantWidth = (1/500)

    for (let i = getScreenX(-pixelGridDistance*canvas.scale/gridDistance, canvas); i < canvas.width; i += pixelGridDistance) {
        canvas.ctx.lineWidth = constantWidth*canvas.width*0.2;
        if (Math.round(i) === canvas.width/2) {
            canvas.ctx.lineWidth = constantWidth*canvas.width;
        }
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(i, 0);
        canvas.ctx.lineTo(i, canvas.height);

        canvas.ctx.moveTo(0, i);
        canvas.ctx.lineTo(canvas.width, i);

        canvas.ctx.closePath();
        canvas.ctx.stroke();
    }
}

export {drawGrid, graph};