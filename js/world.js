import { Fruit, FruitTypes } from "./fruit.js";
import { Vec2 } from "./vec2.js";

const WORLD_MARGIN = 5;

export class World {

    constructor(game) {
        this.game = game;

        this.fruits = [];

        this.gravity = new Vec2({ y: 0.098 * 4 });
        this.friction = 0.99;
    }

    clear() {
        this.fruits = [];
        this.score = 0;
    }

    canAdd(fruit) {
        for (const currentFruit of this.fruits) {
            if (currentFruit.hit(fruit)) return false;
        }
        return true;
    }

    add(fruit) {
        this.fruits.push(fruit);
    }

    remove(fruit) {
        const index = this.fruits.indexOf(fruit);
        if (index > -1) {
            fruit.removed = true;
            this.fruits.splice(index, 1);
        }
    }

    mergeFruits(fruitA, fruitB) {

        if (fruitA.type !== fruitB.type) return false;

        const type = fruitA.type;
        const values = Object.values(FruitTypes).sort((a, b) => { return a.radius - b.radius });
        const index = values.indexOf(type);
        const next = values[index + 1];
        if (next) {

            this.remove(fruitA);
            this.remove(fruitB);

            const dx = fruitB.position.x - fruitA.position.x;
            const dy = fruitB.position.y - fruitA.position.y;

            const fruit = new Fruit({
                type: next,
                position: new Vec2(fruitA.position).add({ x: dx * 0.5, y: dy * 0.5 })
            });

            fruit.velocity.set(fruitA.velocity).add(fruitB.velocity).scl({ x: 0.5, y: 0.5});
            fruit.angularVelocity = (fruitA.angularVelocity + fruitA.angularVelocity) * 0.5;

            this.add(fruit);

            this.score += next.radius;

            this.mergeFruitsListener?.(this.score);

            return true; // Merged
        }

        return false;
    }

    _handleFruitCollisions() {

        const normal = new Vec2();

        const fruits = [...this.fruits];

        const n = fruits.length;
        outer: for (let i = 0; i < n; ++i) {

            const fruitA = fruits[i];
            if (fruitA.removed) continue;

            for (let j = i + 1; j < n; ++j) {

                const fruitB = fruits[j];
                if (fruitB.removed) continue;

                if (fruitA.hit(fruitB)) {

                    fruitA.hits++;
                    fruitB.hits++;

                    if (this.mergeFruits(fruitA, fruitB)) {
                        continue outer;
                    }

                    const invMass = fruitA.invMass + fruitB.invMass;

                    const dx = fruitB.position.x - fruitA.position.x;
                    const dy = fruitB.position.y - fruitA.position.y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const r = fruitA.type.radius + fruitB.type.radius;
                    const penetration = r - distance;

                    if (distance !== 0) {
                        normal.set({ x: dx / distance, y: dy / distance });
                    } else {
                        normal.set({ x: 1, y: 0 });
                    }

                    const vX = fruitA.velocity.x - fruitB.velocity.x;
                    const vY = fruitA.velocity.y - fruitB.velocity.y;

                    const normalVelocity = normal.dot({ x: vX, y: vY });

                    if (normalVelocity > 0) {
                        // Velocity correction
                        const restitution = Math.min(fruitA.restitution, fruitB.restitution);
                        const impulse = (1 + restitution) * normalVelocity / invMass;

                        fruitA.velocity.subScl(normal, impulse * fruitA.invMass);
                        fruitB.velocity.addScl(normal, impulse * fruitB.invMass);

                        // Angular velocity
                        const rd = new Vec2({ x: dx, y: dy });
                        const angularVelocity = rd.crs({ x: vX, y: vY }) / (r * r);
                        fruitA.angularVelocity =  angularVelocity;
                        fruitB.angularVelocity = -angularVelocity;
                    }

                    // Position correction
                    const correction = penetration / invMass;
                    fruitA.position.subScl(normal, correction * fruitA.invMass);
                    fruitB.position.addScl(normal, correction * fruitB.invMass);

                }

            }
        }
    }

    _handleWorldCollisions(fruit) {
        
        const { width, height } = this.game.canvas;
        const { radius, restitution = 0.2 } = fruit.type;

        // Correct X position
        const minX = fruit.position.x - radius;
        const maxX = fruit.position.x + radius;
        if (minX < WORLD_MARGIN) {
            fruit.position.x -= minX - WORLD_MARGIN;
            fruit.velocity.x = -fruit.velocity.x * restitution;
        } else if (maxX > width - WORLD_MARGIN) {
            fruit.position.x -= maxX - (width - WORLD_MARGIN);
            fruit.velocity.x = -fruit.velocity.x * restitution;
        }
        
        // Correct Y position
        const maxY = fruit.position.y + radius;
        if (maxY > height - WORLD_MARGIN) {
            
            fruit.position.y -= maxY - (height - WORLD_MARGIN);
            fruit.velocity.y = -fruit.velocity.y * restitution;

            // Apply angular velocity
            const r = new Vec2({ y: -radius });
            fruit.angularVelocity = r.crs(fruit.velocity) / (radius * radius);

            fruit.hits++;
        }
    }

    update() {

        // Update forces
        for (const fruit of this.fruits) {
            fruit.velocity.add(this.gravity);
            fruit.position.add(fruit.velocity);
            fruit.velocity.scl({ x: this.friction, y: this.friction });
            fruit.angle += fruit.angularVelocity;
            fruit.angularVelocity *= this.friction;
        }

        // Fruit collisions
        for (let i = 0; i < 2; ++i) {
            this._handleFruitCollisions();
        }

        // World limits
        for (const fruit of this.fruits) {
           this._handleWorldCollisions(fruit);
        }

    }

    render() {
        // Render small fruits first
        const fruits = this.fruits.sort((a, b) => { return b.type.radius - a.type.radius });
        for (const fruit of fruits) {
            /*fruit.debug({ 
                context: this.game.context
            });*/

            fruit.render({ 
                context: this.game.context
            });
        }
    }

    onMergeFruits(callback) {
        this.mergeFruitsListener = callback;
    }

}