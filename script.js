const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

const cellSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize, y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize };
let score = 0;

function drawSnake() {
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, cellSize, cellSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize;
    food.y = Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, cellSize, cellSize);
}

function checkCollision() {
    // Verifica se a cabeça da cobra saiu dos limites da tela
    if (snake[0].x < 0) {
        snake[0].x = canvas.width - cellSize; // Reaparece no lado direito
    } else if (snake[0].x >= canvas.width) {
        snake[0].x = 0; // Reaparece no lado esquerdo
    }
    if (snake[0].y < 0) {
        snake[0].y = canvas.height - cellSize; // Reaparece na parte inferior
    } else if (snake[0].y >= canvas.height) {
        snake[0].y = 0; // Reaparece na parte superior
    }
}

function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    generateFood();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawSnake();
    drawFood();
    document.title = `Score: ${score}`;
}

function changeDirection(newDirection) {
    if (!(direction.x === -newDirection.x && direction.y === -newDirection.y)) {
        direction = newDirection;
    }
}

document.addEventListener('keydown', event => {
    const keyDirectionMap = {
        ArrowUp: { x: 0, y: -cellSize },
        ArrowDown: { x: 0, y: cellSize },
        ArrowLeft: { x: -cellSize, y: 0 },
        ArrowRight: { x: cellSize, y: 0 }
    };
    if (keyDirectionMap[event.key]) {
        changeDirection(keyDirectionMap[event.key]);
    }
});

document.getElementById('up').addEventListener('click', () => changeDirection({ x: 0, y: -cellSize }));
document.getElementById('down').addEventListener('click', () => changeDirection({ x: 0, y: cellSize }));
document.getElementById('left').addEventListener('click', () => changeDirection({ x: -cellSize, y: 0 }));
document.getElementById('right').addEventListener('click', () => changeDirection({ x: cellSize, y: 0 }));

setInterval(update, 100);
