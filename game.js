const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');

let playerPosX = 375;  // Posição inicial do jogador
let score = 0;
let gameOver = false;

const bullets = [];
const enemies = [];
const bulletSpeed = 10;
const enemySpeed = 2;

// Movimentação do jogador
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && playerPosX > 0) {
        playerPosX -= 10;
    } else if (e.key === 'ArrowRight' && playerPosX < 750) {
        playerPosX += 10;
    }
    player.style.left = playerPosX + 'px';
});

// Atirar
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (!gameOver) {
            shoot();
        }
    }
});

// Criar tiro
function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = playerPosX + 20 + 'px';
    bullet.style.bottom = '60px';
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

// Criar inimigos
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = Math.random() * 750 + 'px';
    enemy.style.top = '-50px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// Movimentar os tiros
function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        let bulletTop = parseInt(bullet.style.bottom.replace('px', ''));
        bullet.style.bottom = bulletTop + bulletSpeed + 'px';

        if (bulletTop > 600) {
            bullet.remove();
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Movimentar os inimigos
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let enemyTop = parseInt(enemy.style.top.replace('px', ''));
        enemy.style.top = enemyTop + enemySpeed + 'px';

        // Verificar se o inimigo atingiu o jogador
        if (enemyTop >= 550 && parseInt(enemy.style.left) >= playerPosX && parseInt(enemy.style.left) <= playerPosX + 50) {
            gameOver = true;
            gameOverElement.style.display = 'block';
        }

        if (enemyTop > 600) {
            enemy.remove();
            enemies.splice(i, 1);
            i--;
            score += 10;
            scoreElement.textContent = 'Pontos: ' + score;
        }
    }
}

// Verificar colisões
function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        let bullet = bullets[i];
        let bulletTop = parseInt(bullet.style.bottom.replace('px', ''));
        let bulletLeft = parseInt(bullet.style.left.replace('px', ''));
        let bulletRight = bulletLeft + 10;

        for (let j = 0; j < enemies.length; j++) {
            let enemy = enemies[j];
            let enemyTop = parseInt(enemy.style.top.replace('px', ''));
            let enemyLeft = parseInt(enemy.style.left.replace('px', ''));
            let enemyRight = enemyLeft + 50;

            if (bulletTop > enemyTop && bulletTop < enemyTop + 50 && bulletLeft > enemyLeft && bulletRight < enemyRight) {
                enemy.remove();
                bullet.remove();
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 20;
                scoreElement.textContent = 'Pontos: ' + score;
                i--;
                break;
            }
        }
    }
}

// Função de loop do jogo
function gameLoop() {
    if (!gameOver) {
        createEnemy();
        moveBullets();
        moveEnemies();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar o jogo
gameLoop();
