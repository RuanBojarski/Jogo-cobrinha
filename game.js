// 1. Configuração Inicial do Canvas
const canvas = document.getElementById("gameCanvas");
// O ctx é o contexto 2D onde desenhamos [cite: 18, 20]
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("scoreDisplay");
const restartButton = document.getElementById("restartButton");

let score = 0;
let isGameOver = false;

// Objeto para representar o alvo
let target = {
    x: 0,
    y: 0,
    radius: 20, // Tamanho do alvo
    color: 'red',
    timeToLive: 1500, // Tempo em milissegundos que o alvo fica na tela
    lastSpawnTime: 0
};

// 2. Funções de Desenho
function drawTarget() {
    // Desenha o círculo principal
    ctx.beginPath();
    // Usa ctx.arc() para desenhar um círculo no lugar de ctx.fillRect() [cite: 22]
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.color;
    ctx.fill();
    ctx.closePath();

    // Desenha o centro (ponto de maior pontuação)
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius / 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function drawBackground() {
    ctx.fillStyle = '#a0c0e0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 3. Lógica do Jogo
function spawnTarget() {
    // Gera coordenadas aleatórias dentro do limite do canvas,
    // garantindo que o alvo não apareça cortado nas bordas.
    const padding = target.radius + 5;
    target.x = padding + Math.random() * (canvas.width - 2 * padding);
    target.y = padding + Math.random() * (canvas.height - 2 * padding);
    target.color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Muda a cor a cada spawn
    target.lastSpawnTime = Date.now();
}

function checkHit(event) {
    if (isGameOver) return;

    // Obtém as coordenadas do clique do mouse em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Distância do clique até o centro do alvo (Teorema de Pitágoras)
    const distance = Math.sqrt(
        (clickX - target.x) ** 2 + (clickY - target.y) ** 2
    );

    // Lógica de Colisão: se a distância for menor que o raio, é um acerto
    if (distance < target.radius) {
        score += 1; // Aumenta a pontuação
        scoreDisplay.textContent = score;
        spawnTarget(); // Faz um novo alvo aparecer
    }
}

function update() {
    // Se o alvo atual expirou, perde-se um ponto e um novo alvo aparece.
    if (Date.now() - target.lastSpawnTime > target.timeToLive) {
        score = Math.max(0, score - 1); // Diminui o score (mas não abaixo de zero)
        scoreDisplay.textContent = score;
        spawnTarget();
    }
}

// 4. O Game Loop
// Entender a lógica de atualização de quadros (Game Loop) 
function gameLoop() {
    if (isGameOver) return;

    // 1. Atualizar o estado do jogo
    update();

    // 2. Limpar o canvas e redesenhar
    drawBackground();
    drawTarget();
    
    // 3. Chamar o próximo quadro de animação
    requestAnimationFrame(gameLoop);
}

// 5. Manipulação de Eventos
// Explorar manipulação de eventos de teclado (aqui usamos o mouse) 
canvas.addEventListener('click', checkHit);

restartButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = score;
    isGameOver = false;
    spawnTarget();
    gameLoop(); // Reinicia o loop do jogo
});

// Inicializa o jogo
spawnTarget();
gameLoop();