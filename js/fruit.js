import { shadeColor } from "./utils.js";
import { Vec2 } from "./vec2.js";

export const FruitTypes = {
    a: { color: "#C40233", radius: 20, index: 39 },
    b: { color: "#4B0082", radius: 30, index: 3 },
    c: { color: "#FC5A8D", radius: 50, index: 26 },
    d: { color: "#D1E231", radius: 70, index: 2 },
    e: { color: "#FFE5B4", radius: 80, index: 21 },
    f: { color: "#B22222", radius: 90, index: 17 },
    g: { color: "#E5823A", radius: 100, index: 9 },
    h: { color: "#FFA500", radius: 110, index: 30 },
    y: { color: "#FFD700", radius: 120, index: 32 },
    j: { color: "#98FF98", radius: 140, index: 29 },
}

export class Fruit {

    constructor({ type, position }) {

        this.type = type;
        this.position = new Vec2(position);
        this.velocity = new Vec2();
        this.invMass = 1 / type.radius;
        this.restitution = 0.3;

        this.angle = 0;
        this.angularVelocity = 0;

        this.hits = 0;

    }

    drawFruit(ctx, radius, index) {

        radius *= 1.3;

        const img = Fruit.img;
    
        const cols = 5;
        const rows = 8;

        const w = img.width / cols;
        const h = img.height / rows;

        const x = index % cols;
        const y = Math.floor(index / cols);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, x * w, y * h, w, h, -radius, -radius, radius * 2, radius * 2);
        
    }

    render({
        context, 
        position = this.position, 
        radius = this.type.radius, 
    }) {

        // this.debug({ context, position, radius });

        const { x, y } = position;

        context.translate(x, y);
        context.rotate(this.angle);
        this.drawFruit(context, radius, this.type.index || 0);

        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    debug({ 
        context, 
        position = this.position, 
        radius = this.type.radius, 
        color = this.type.color 
    }) {

        const { x, y } = position;

        context.translate(x, y);
        context.rotate(this.angle);
        context.translate(-x, -y);

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();

        const darkerColor = shadeColor(color, -20);
        context.strokeStyle = darkerColor;
        context.lineWidth = 5;
        context.stroke();

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + radius, y);
        context.strokeStyle = darkerColor;
        context.lineWidth = 5;
        context.stroke();

        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    hit(fruit) {
        const r = this.type.radius + fruit.type.radius;
        return this.position.dst2(fruit.position) < r * r;
    }

}