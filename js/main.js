// main.js
import { strategies } from './strategy.js';
import { DrawingContext } from './drawingContext.js';
import { DrawingService } from './drawingService.js';
import { Vector } from './vector.js';
import { Constants } from './constants.js';

// ======================================================
// 1. Canvas + DrawingContext setup
// ======================================================

const canvas = document.getElementById("fourierCanvas");
const dc = new DrawingContext(canvas);
const drawingService = new DrawingService(dc);

// Resize canvas to fill the right panel
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    dc.resize();
}
window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

// ======================================================
// 2. Load Fourier JSON and build vector chain
// ======================================================

async function loadShape(name) {
    const response = await fetch(`./data/${name}.json`);
    const coeffs = await response.json();
    buildVectorsFromCoeffs(coeffs);
}

function loadRandomFromStrategy() {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    console.log("Random strategy selected:", strategy.constructor.name);
    const coeffs = strategy.generate(Constants.RANDOM_COUNT);
    buildVectorsFromCoeffs(coeffs);
}

function buildVectorsFromCoeffs(coeffs) {
    drawingService.reset();

    let parent = null;
    const SCALE = 200; // same as before

    for (const c of coeffs) {
        const length = Math.hypot(c.re, c.im) * SCALE;
        const angle = Math.atan2(c.im, c.re);
        const angularVelocity = c.n * 0.02;

        const v = new Vector(length, angle, angularVelocity, parent);
        drawingService.addVector(v);

        parent = v;
    }
}

// ======================================================
// 3. Animation loop
// ======================================================

function animate() {
    drawingService.update();
    drawingService.draw();
    requestAnimationFrame(animate);
}

// ======================================================
// 5. UI Controls
// ======================================================

document.getElementById("startBtn").addEventListener("click", () => {
    if (drawingService.vectors.length === 0) {
        const shape = document.getElementById("shapeSelect").value;
        if (shape === "random") {
            loadRandomFromStrategy();
        } else {
            loadShape(shape);
        }
    }
    drawingService.drawTraceEnabled = true;
    drawingService.isRunning = true;
});


document.getElementById("pauseBtn").addEventListener("click", () => {
    drawingService.isRunning = false;
});

document.getElementById("zoomInBtn").addEventListener("click", () => {
    dc.zoomIn();
});

document.getElementById("zoomOutBtn").addEventListener("click", () => {
    dc.zoomOut();
});

document.getElementById("clearBtn").addEventListener("click", () => {
    drawingService.trace = [];
});

document.getElementById("resetBtn").addEventListener("click", () => {
    drawingService.isRunning = false;
    drawingService.drawTraceEnabled = true;

    drawingService.vectors = [];
    drawingService.trace = [];

    // Reset zoom
    dc.setZoom(Constants.DEFAULT_ZOOM);
    dc.offsetX = 0;
    dc.offsetY = 0;
    // Redraw blank canvas
    drawingService.draw();
    document.getElementById("shapeSelect").value = "heart";
});

animate();