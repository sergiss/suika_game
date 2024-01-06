export class Vec2 {

    constructor(vec2 = { x: 0, y: 0 }) {
        this.set(vec2);
    }

    set({ x = 0, y = 0 }) {
        this.x = x;
        this.y = y;
        return this;
    }

    sub({ x = 0, y = 0 }) {
        this.x -= x;
        this.y -= y;
        return this;
    }

    add({ x = 0, y = 0 }) {
        this.x += x;
        this.y += y;
        return this;
    }

    addScl({ x = 0, y = 0 }, scl) {
        this.x += x * scl;
        this.y += y * scl;
        return this;
    }

    subScl({ x = 0, y = 0 }, scl) {
        this.x -= x * scl;
        this.y -= y * scl;
        return this;
    }

    scl({ x = 0, y = 0 }) {
        this.x *= x;
        this.y *= y;
        return this;
    }

    dst2({ x = 0, y = 0 }) {
        let dx = x - this.x;
        let dy = y - this.y;
        return dx * dx + dy * dy;
    }

    dot({ x = 0, y = 0 }) {
        return this.x * x + this.y * y;
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    crs({ x = 0, y = 0 }) {
        return this.x * y - this.y * x;
    }

    copy(vec2 = { x: this.x, y: this.y }) {
        return new Vec2(vec2);
    }

}