// ===== MemoryGrid - Neon Memory Challenge =====

const symbols = ['🔮','⚡','🌀','💎','🎯','🔥','🌊','❄️','🎵','💀','🪐','🧬','⚗️','🎲','🕹️','👾','🛸','🌈'];
const neonColors = ['cyan','green','purple','pink','orange'];

let gridSize = 4;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let gameTime = 0;
let timerInterval = null;
let canFlip = true;

const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const gridContainer = document.getElementById('grid-container');
const bgAudio = document.getElementById('bg-audio');
const bgCanvas = document.getElementById('bg-canvas');

// ===== Particle BG =====
function initParticleBg() {
    const ctx = bgCanvas.getContext('2d');
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * bgCanvas.width,
            y: Math.random() * bgCanvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 0.5,
            hue: 180 + Math.random() * 60
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 18, 0.08)';
        ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.4)`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; });
}
initParticleBg();

// ===== Difficulty =====
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gridSize = parseInt(btn.dataset.size);
    });
});

// ===== Game Logic =====
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateCards() {
    totalPairs = (gridSize * gridSize) / 2;
    const selected = shuffle([...symbols]).slice(0, totalPairs);
    const pairs = shuffle([...selected, ...selected]);
    return pairs.map((symbol, i) => ({
        id: i,
        symbol,
        color: neonColors[i % neonColors.length],
        flipped: false,
        matched: false
    }));
}

function renderGrid() {
    gridContainer.innerHTML = '';
    const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200, 500);
    const cardSize = Math.floor((maxSize - (gridSize - 1) * 8) / gridSize);
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${cardSize}px)`;

    cards.forEach((card, i) => {
        const el = document.createElement('div');
        el.className = 'memory-card';
        el.style.width = `${cardSize}px`;
        el.style.height = `${cardSize}px`;
        el.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back" data-color="${card.color}">${card.symbol}</div>
        `;
        el.addEventListener('click', () => flipCard(i, el));
        el.style.animationDelay = `${i * 0.03}s`;
        gridContainer.appendChild(el);
    });
}

function flipCard(index, el) {
    if (!canFlip || cards[index].flipped || cards[index].matched || flippedCards.length >= 2) return;

    cards[index].flipped = true;
    el.classList.add('flipped');
    flippedCards.push({ index, el });

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves-count').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [a, b] = flippedCards;
    canFlip = false;

    if (cards[a.index].symbol === cards[b.index].symbol) {
        // Match!
        cards[a.index].matched = true;
        cards[b.index].matched = true;
        matchedPairs++;
        document.getElementById('matches-count').textContent = `${matchedPairs}/${totalPairs}`;

        a.el.classList.add('matched');
        b.el.classList.add('matched');

        flippedCards = [];
        canFlip = true;

        if (matchedPairs === totalPairs) {
            setTimeout(endGame, 600);
        }
    } else {
        // No match
        setTimeout(() => {
            cards[a.index].flipped = false;
            cards[b.index].flipped = false;
            a.el.classList.remove('flipped');
            b.el.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 800);
    }
}

function startGame() {
    cards = generateCards();
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameTime = 0;
    canFlip = true;

    document.getElementById('moves-count').textContent = '0';
    document.getElementById('matches-count').textContent = `0/${(gridSize*gridSize)/2}`;
    document.getElementById('time-display').textContent = '00:00';

    introScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    gameScreen.classList.add('active');

    renderGrid();

    bgAudio.volume = 0.3;
    bgAudio.play().catch(() => {});

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        gameTime++;
        const min = String(Math.floor(gameTime / 60)).padStart(2, '0');
        const sec = String(gameTime % 60).padStart(2, '0');
        document.getElementById('time-display').textContent = `${min}:${sec}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    gameScreen.classList.remove('active');
    resultsScreen.classList.add('active');

    const min = String(Math.floor(gameTime / 60)).padStart(2, '0');
    const sec = String(gameTime % 60).padStart(2, '0');
    document.getElementById('final-time').textContent = `${min}:${sec}`;
    document.getElementById('final-moves').textContent = moves;

    // Score: lower moves + time = higher score
    const perfectMoves = totalPairs;
    const efficiency = Math.max(0, 1 - (moves - perfectMoves) / (totalPairs * 3));
    const timeBonus = Math.max(0, 1 - gameTime / (totalPairs * 15));
    const score = Math.round((efficiency * 700 + timeBonus * 300));
    document.getElementById('final-score').textContent = score;

    // Stars
    let stars = '★';
    if (score >= 400) stars = '★★';
    if (score >= 700) stars = '★★★';
    document.getElementById('star-rating').textContent = stars;
}

// Buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('replay-btn').addEventListener('click', startGame);
