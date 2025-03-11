const canvas = document.getElementById('petCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x = canvas.width / 2, y = canvas.height / 2;
let dx = 0, dy = 0;
const catSpeed = 7;
let obstacles = [];
const obstacleWidth = 120, obstacleHeight = 120; // Increased size
let obstacleSpeed = 3;
let spawnRate = 0.02;
let score = 0;
let isGameOver = false;

const catImage = new Image();
catImage.src = 'ghost.png';

const obstacleImage = new Image();
obstacleImage.src = 'trap1.png';

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') dy = -catSpeed;
    if (event.key === 'ArrowDown' || event.key === 's') dy = catSpeed;
    if (event.key === 'ArrowLeft' || event.key === 'a') dx = -catSpeed;
    if (event.key === 'ArrowRight' || event.key === 'd') dx = catSpeed;
});
document.addEventListener('keyup', (event) => {
    if (['ArrowUp', 'w', 'ArrowDown', 's'].includes(event.key)) dy = 0;
    if (['ArrowLeft', 'a', 'ArrowRight', 'd'].includes(event.key)) dx = 0;
});

function drawCat() {
    ctx.drawImage(catImage, x - 50, y - 50, 100, 100);
}

function drawObstacle(obstacle) {
    ctx.drawImage(obstacleImage, obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
}

function createObstacle() {
    const xPos = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: xPos, y: -obstacleHeight });
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (x + 50 > obstacle.x && x - 50 < obstacle.x + obstacleWidth &&
            y + 50 > obstacle.y && y - 50 < obstacle.y + obstacleHeight) {
            gameOver();
        }
    });
}

function animate() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x = Math.max(50, Math.min(canvas.width - 50, x + dx));
    y = Math.max(50, Math.min(canvas.height - 50, y + dy));
    drawCat();

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.y += obstacleSpeed;
        drawObstacle(obstacle);
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
            score++;
        }
    }

    if (Math.random() < spawnRate) createObstacle();
    checkCollision();
    updateScoreboard();
    requestAnimationFrame(animate);
}

function updateScoreboard() {
    document.getElementById('scoreboard').innerText = `Score: ${score}`;
}

function gameOver() {
    isGameOver = true;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('finalScore').innerText = `Final Score: ${score}`;
}

function restartGame() {
    isGameOver = false;
    score = 0;
    obstacles = [];
    x = canvas.width / 2;
    y = canvas.height / 2;
    document.getElementById('gameOverScreen').style.display = 'none';
    animate();
}

animate();
