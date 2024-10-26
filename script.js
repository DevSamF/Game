const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const joystick = document.getElementById('joystick');
const joystickContainer = document.querySelector('.joystick-container');
const containerRadius = 75;  // Limite circular para o joystick
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
    if (snake[0].x < 0) {
        snake[0].x = canvas.width - cellSize;
    } else if (snake[0].x >= canvas.width) {
        snake[0].x = 0;
    }
    if (snake[0].y < 0) {
        snake[0].y = canvas.height - cellSize;
    } else if (snake[0].y >= canvas.height) {
        snake[0].y = 0;
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

function updateDirectionFromJoystick(event) {
    const touch = event.touches ? event.touches[0] : event;
    let dx = touch.clientX - (joystickContainer.offsetLeft + joystickContainer.offsetWidth / 2);
    let dy = touch.clientY - (joystickContainer.offsetTop + joystickContainer.offsetHeight / 2);

    const distance = Math.sqrt(dx * dx + dy * dy);

    // Restringe o movimento do joystick ao raio do container
    if (distance > containerRadius) {
        dx = (dx / distance) * containerRadius;
        dy = (dy / distance) * containerRadius;
    }

    joystick.style.transform = `translate(${dx}px, ${dy}px)`;

    // Aumenta a sensibilidade do movimento
    direction = {
        x: Math.round(dx / containerRadius) * cellSize,
        y: Math.round(dy / containerRadius) * cellSize
    };
}

function resetJoystick() {
    joystick.style.transform = `translate(0, 0)`;
    direction = { x: 0, y: 0 };
}

joystick.addEventListener('touchstart', updateDirectionFromJoystick);
joystick.addEventListener('touchmove', updateDirectionFromJoystick);
joystick.addEventListener('touchend', resetJoystick);

joystick.addEventListener('mousedown', updateDirectionFromJoystick);
document.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) updateDirectionFromJoystick(event);
});
document.addEventListener('mouseup', resetJoystick);

setInterval(update, 150);
