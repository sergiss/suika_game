import { Fruit, FruitTypes } from "./fruit.js";
import { Game } from "./game.js";
import { Vec2 } from "./vec2.js";

const score = document.getElementById('score');
const maxScore = document.getElementById('max-score');
const app = document.getElementById('app');
const game = new Game(app).start();

const setScore = ((currentScore) => {
    let maxValue = localStorage.getItem("max-score") || 0;
    if (maxValue < currentScore) {
        maxValue = currentScore;
        localStorage.setItem("max-score", maxValue);
    }

    maxScore.innerHTML = `${maxValue}`.padStart(6, '0');

    score.innerText = `${currentScore}`.padStart(6, '0');
    
})

game.world.onMergeFruits(setScore);

const fruitInfo = document.getElementById('fruit-info');
fruitInfo.width = 100;
fruitInfo.height = 100;

const context = fruitInfo.getContext('2d');

let nextFruit = null;
let currentFruit = null;
const rndNextFruit = () => {
    
    context.fillStyle = '#e9d5b0';
    context.fillRect(0, 0, fruitInfo.width, fruitInfo.height);

    const types = Object.keys(FruitTypes);
    const index = Math.floor(Math.random() * 4);
    nextFruit = new Fruit({
        type: FruitTypes[types[index]],
        position: new Vec2(),
    });

    nextFruit.render({
        context,
        radius: 40,
        position: { x: 50, y: 50 }
    });

}

const newGame = () => {
    game.world.clear();
    setScore(0);
    currentFruit = null;
    rndNextFruit();
}

app.addEventListener('click', (e) => {

    if (currentFruit?.hits === 0) return;

    const x = e.offsetX * (app.width / 400);

    nextFruit.position.set({
        x, y: 0
    });

    if (!game.world.canAdd(nextFruit)) {
        newGame();
    }

    game.world.add(nextFruit);
    currentFruit = nextFruit;
    rndNextFruit();

});

Fruit.img = new Image();
Fruit.img.src = 'images/fruits.png';
Fruit.img.onload = () => {  
    newGame();
}

