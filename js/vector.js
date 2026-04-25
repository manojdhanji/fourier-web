// vector.js

export class Vector {

    constructor(length, angle, angularVelocity, parent = null) {
        this.length = length;                 // magnitude of the vector
        this.angle = angle;                   // current angle (radians)
        this.angularVelocity = angularVelocity; // rotation speed per frame

        this.parent = parent;                 // parent vector (if chained)

        // Tail and head in model coordinates
        this.tail = { x: 0, y: 0 };
        this.head = { x: 0, y: 0 };

        // If this vector has a parent, its tail follows the parent's head
        if (this.parent) {
            this.updateTailFromParent();
        }

        // Compute initial head position
        this.updateHead();
    }

    /** Update the tail to match the parent's head */
    updateTailFromParent() {
        this.tail.x = this.parent.head.x;
        this.tail.y = this.parent.head.y;
    }

    /** Compute head position from tail + angle + length */
    updateHead() {
        this.head.x = this.tail.x + this.length * Math.cos(this.angle);
        this.head.y = this.tail.y + this.length * Math.sin(this.angle);
    }

    /** Rotate the vector by its angular velocity */
    rotate() {
        this.angle += this.angularVelocity;
    }

    /** Update the vector for this animation frame */
    update() {
        if (this.parent) {
            this.updateTailFromParent();
        }
        this.rotate();
        this.updateHead();
    }

    /** Draw the vector (line + arrowhead) in model space */
    draw(ctx) {
        // Draw main line
        ctx.beginPath();
        ctx.moveTo(this.tail.x, this.tail.y);
        ctx.lineTo(this.head.x, this.head.y);
        ctx.stroke();

        // Draw arrowhead
        const arrowSize = 6;

        const angle = Math.atan2(
            this.head.y - this.tail.y,
            this.head.x - this.tail.x
        );

        const left = {
            x: this.head.x - arrowSize * Math.cos(angle - Math.PI / 6),
            y: this.head.y - arrowSize * Math.sin(angle - Math.PI / 6)
        };

        const right = {
            x: this.head.x - arrowSize * Math.cos(angle + Math.PI / 6),
            y: this.head.y - arrowSize * Math.sin(angle + Math.PI / 6)
        };

        ctx.beginPath();
        ctx.moveTo(this.head.x, this.head.y);
        ctx.lineTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.closePath();
        ctx.fill();
    }
}
