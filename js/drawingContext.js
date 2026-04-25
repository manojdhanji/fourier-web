// drawingContext.js

import { Constants } from './constants.js';

export class DrawingContext {

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Center of the canvas in screen space
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        // Model -> screen scaling
        this.scale = 1;                 // base scale (can be 1)
        this.zoom = Constants.DEFAULT_ZOOM;

        // For panning (optional future feature)
        this.offsetX = 0;
        this.offsetY = 0;
    }

    /** Update canvas size and recenter */
    resize() {
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    /** Prepare the canvas for drawing in model space */
    applyTransforms() {
        const ctx = this.ctx;

        ctx.setTransform(1, 0, 0, 1, 0, 0);   // reset
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Move origin to center
        ctx.translate(this.centerX + this.offsetX, this.centerY + this.offsetY);

        // Apply zoom + scale
        ctx.scale(this.zoom * this.scale, -this.zoom * this.scale);
    }

    /** Zoom in */
    zoomIn() {
        this.zoom *= 1.1;
    }

    /** Zoom out */
    zoomOut() {
        this.zoom /= 1.1;
    }

    setZoom(z) {
        this.zoom = z;
        this.applyTransforms();
    }

}
