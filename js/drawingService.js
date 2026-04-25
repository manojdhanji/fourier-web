// drawingService.js

import { Constants } from './constants.js';

export class DrawingService {

    constructor(drawingContext) {
        this.dc = drawingContext;       // DrawingContext instance
        this.ctx = drawingContext.ctx;  // Canvas 2D context

        this.vectors = [];              // list of Vector objects
        this.trace = [];                // list of {x, y} points
        this.drawTraceEnabled = false;  // whether to draw the trace of the endpoint
        this.isRunning = false;         // controls whether vectors should update
    }

    /** Add a vector to the system */
    addVector(vector) {
        this.vectors.push(vector);
    }

    /** Clear all vectors and trace */
    reset() {
        this.vectors = [];
        this.trace = [];
    }

    /** Update all vectors for this animation frame */
    update() {
        if (!this.isRunning) return;

        for (const v of this.vectors) {
            v.update();
        }

        // Add the head of the last vector to the trace
        if (this.vectors.length > 0 && this.drawTraceEnabled) {
            const last = this.vectors.at(-1);
            this.trace.push({ x: last.head.x, y: last.head.y });
        }
    }

    /** Draw everything: grid, axes, vectors, trace */
    draw() {
        this.dc.applyTransforms();
        const ctx = this.ctx;

        this.drawAxes(ctx);
        this.drawGrid(ctx);
        this.drawVectors(ctx);
        this.drawTrace(ctx);
    }

    /** Draw all vectors */
    drawVectors(ctx) {
        ctx.strokeStyle = Constants.VECTOR_COLOR;
        ctx.fillStyle = Constants.VECTOR_COLOR;
        ctx.lineWidth = Constants.VECTOR_WIDTH;

        for (const v of this.vectors) {
            v.draw(ctx);
        }
    }

    /** Draw the trace of the endpoint */
    drawTrace(ctx) {
        if (!this.drawTraceEnabled || this.trace.length < 2) return;

        ctx.strokeStyle = Constants.TRACE_COLOR;
        ctx.lineWidth = Constants.TRACE_WIDTH;

        ctx.beginPath();
        ctx.moveTo(this.trace[0].x, this.trace[0].y);

        for (let i = 1; i < this.trace.length; i++) {
            ctx.lineTo(this.trace[i].x, this.trace[i].y);
        }

        ctx.stroke();
    }

    /** Draw X/Y axes */
    drawAxes(ctx) {
        ctx.strokeStyle = Constants.AXIS_COLOR;
        ctx.lineWidth = Constants.AXIS_WIDTH;

        ctx.beginPath();
        ctx.moveTo(-10000, 0);
        ctx.lineTo(10000, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -10000);
        ctx.lineTo(0, 10000);
        ctx.stroke();
    }

    /** Draw grid lines */
    drawGrid(ctx) {
        const spacing = Constants.GRID_SPACING;

        ctx.strokeStyle = "#e0e0e0";
        ctx.lineWidth = 0.5;

        // Vertical lines
        for (let x = -2000; x <= 2000; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, -2000);
            ctx.lineTo(x, 2000);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = -2000; y <= 2000; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(-2000, y);
            ctx.lineTo(2000, y);
            ctx.stroke();
        }
    }
}
