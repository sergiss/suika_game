
import { World } from "./world.js";

const VIRTUAL_SIZE = 800;

export class Game {

    constructor(canvas) {

        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.world = new World(this);

        this._loop = this._loop.bind(this);
    }

    clearScreen() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;

        if (w > h) {
            this.canvas.width  = VIRTUAL_SIZE;
            this.canvas.height = VIRTUAL_SIZE * (h / w);
        } else {
            this.canvas.width  = VIRTUAL_SIZE * (w / h);
            this.canvas.height = VIRTUAL_SIZE;
        }

        this.context.fillStyle = '#e9d5b0';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    _loop(time) {
        if(this.running) {

            this.world.update();

            this.clearScreen();
            this.world.render();
            
            requestAnimationFrame(this._loop);
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this._loop);
        }
        return this;
    }

    stop () {
        this.running = false;
        return this;
    }

}