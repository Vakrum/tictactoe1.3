const boardElement = document.getElementById('board');
const modal = document.getElementById('gameModal');
const modalText = document.getElementById('modalText');
const restartBtn = document.getElementById('restartBtn');

const size = 5;
const vStart = 1, vEnd = 3; 
let cells = [];
let gameOver = false;
let finishTimeout = null; // Store the timer so we can cancel it

const lines = [];
for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
        if (c <= size - 3) lines.push([[r,c],[r,c+1],[r,c+2]]);
        if (r <= size - 3) lines.push([[r,c],[r+1,c],[r+2,c]]);
        if (r <= size - 3 && c <= size - 3) lines.push([[r,c],[r+1,c+1],[r+2,c+2]]);
        if (r <= size - 3 && c >= 2) lines.push([[r,c],[r+1,c-1],[r+2,c-2]]);
    }
}

// Global click listener to skip the delay
window.addEventListener('click', () => {
    if (gameOver && modal.style.display !== 'flex') {
        showModal();
    }
});

function init() {
    boardElement.innerHTML = '';
    cells = [];
    gameOver = false;
    modal.style.display = 'none';
    if (finishTimeout) clearTimeout(finishTimeout);

    for (let i = 0; i < size * size; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        if (r === 0 || r === 4 || c === 0 || c === 4) {
            cell.classList.add('hidden');
        }
        
        cell.addEventListener('click', (e) => {
            if (gameOver || cell.textContent || cell.classList.contains('hidden')) return;
            e.stopPropagation(); // Prevent the skip-delay click from firing on the same click
            cell.textContent = '❌';
            cell.style.color = '#54a0ff';
            if (checkWin('❌')) {
                finish("well u won, but at what cost, anyways u probably cheated");
                return;
            }
            setTimeout(botMove, 200);
        });

        boardElement.appendChild(cell);
        cells.push(cell);
    }
}

function getCell(r, c) { return cells[r * size + c]; }
function checkWin(sym) { return lines.some(l => l.every(([r, c]) => getCell(r,c).textContent === sym)); }

function showModal() {
    if (finishTimeout) clearTimeout(finishTimeout);
    modal.style.display = 'flex';
}

function finish(msg) {
    gameOver = true;
    modalText.textContent = msg;
    // Start the 3-second timer
    finishTimeout = setTimeout(showModal, 3000); 
}

function botMove() {
    if (gameOver) return;

    // 1. Win/Cheat Logic
    for (let l of lines) {
        const vals = l.map(([r,c]) => getCell(r,c).textContent);
        if (vals.filter(v => v === '⭕').length === 2 && vals.includes('')) {
            const idx = vals.indexOf('');
            const [r, c] = l[idx];
            const cEl = getCell(r,c);
            
            if (cEl.classList.contains('hidden')) {
                cEl.classList.remove('hidden');
                cEl.classList.add('revealed-cheat');
            }
            
            cEl.textContent = '⭕';
            cEl.style.color = '#ff4757';
            
            finish("LOL u lost to a bot in a tic taco toe game?? such a skill issue");
            return; 
        }
    }

    // 2. Block Player
    for (let l of lines) {
        const vals = l.map(([r,c]) => getCell(r,c).textContent);
        if (vals.filter(v => v === '❌').length === 2 && vals.includes('')) {
            const idx = vals.indexOf('');
            const [r, c] = l[idx];
            const cEl = getCell(r,c);
            if (r >= vStart && r <= vEnd && c >= vStart && c <= vEnd) {
                cEl.textContent = '⭕';
                cEl.style.color = '#ff4757';
                return;
            }
        }
    }

    // 3. Normal Move
    const center = getCell(2, 2);
    if (!center.textContent) {
        center.textContent = '⭕';
        center.style.color = '#ff4757';
        return;
    }

    const emptyVisible = [];
    for (let r = vStart; r <= vEnd; r++) {
        for (let c = vStart; c <= vEnd; c++) {
            if (!getCell(r,c).textContent) emptyVisible.push([r,c]);
        }
    }
    
    if (emptyVisible.length > 0) {
        const [r, c] = emptyVisible[Math.floor(Math.random() * emptyVisible.length)];
        const target = getCell(r,c);
        target.textContent = '⭕';
        target.style.color = '#ff4757';
    } else {
        finish("It's a draw... for now.");
    }
}

restartBtn.onclick = init;
init();
