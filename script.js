const boardElement = document.getElementById('board');
const modal = document.getElementById('gameModal');
const modalText = document.getElementById('modalText');
const restartBtn = document.getElementById('restartBtn');

const size = 5;
const vStart = 1, vEnd = 3; 
let cells = [];
let gameOver = false;

const lines = [];
for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
        if (c <= size - 3) lines.push([[r,c],[r,c+1],[r,c+2]]);
        if (r <= size - 3) lines.push([[r,c],[r+1,c],[r+2,c]]);
        if (r <= size - 3 && c <= size - 3) lines.push([[r,c],[r+1,c+1],[r+2,c+2]]);
        if (r <= size - 3 && c >= 2) lines.push([[r,c],[r+1,c-1],[r+2,c-2]]);
    }
}

function init() {
    boardElement.innerHTML = '';
    cells = [];
    gameOver = false;
    modal.style.display = 'none';

    for (let i = 0; i < size * size; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (r === 0 || r === 4 || c === 0 || c === 4) cell.classList.add('hidden');
        
        cell.addEventListener('click', () => {
            if (gameOver || cell.textContent || cell.classList.contains('hidden')) return;
            cell.textContent = '❌';
            if (checkWin('❌')) return finish("well u won, but at what cost, anyways u probably cheated");
            setTimeout(botMove, 300);
        });

        boardElement.appendChild(cell);
        cells.push(cell);
    }
}

function getCell(r, c) { return cells[r * size + c]; }

function checkWin(sym) {
    return lines.some(l => l.every(([r, c]) => getCell(r,c).textContent === sym));
}

function finish(msg) {
    gameOver = true;
    modalText.textContent = msg;
    modal.style.display = 'flex';
}

function botMove() {
    if (gameOver) return;

    for (let l of lines) {
        const vals = l.map(([r,c]) => getCell(r,c).textContent);
        if (vals.filter(v => v === '⭕').length === 2 && vals.includes('')) {
            const emptyIdx = vals.indexOf('');
            const [r, c] = l[emptyIdx];
            if (r === 0 || r === 4 || c === 0 || c === 4) {
                const cEl = getCell(r,c);
                cEl.classList.remove('hidden');
                cEl.textContent = '⭕';
                return finish("LOL u lost to a bot in a tic taco toe game?? such a skill issue");
            }
        }
    }

    for (let r = vStart; r <= vEnd; r++) {
        for (let c = vStart; c <= vEnd; c++) {
            if (!getCell(r,c).textContent) {
                getCell(r,c).textContent = '⭕';
                if (checkWin('⭕')) finish("LOL u lost to a bot in a tic taco toe game?? such a skill issue");
                return;
            }
        }
    }
}

restartBtn.onclick = init;
init();
