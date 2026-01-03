const board = document.querySelector('.board');
const size = 5;
const visibleStart = 1;
const visibleEnd = 3;

let cells = [];
let gameOver = false;

/* ---------- СОЗДАНИЕ ПОЛЯ ---------- */
for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;

        if (r === 0 || r === 4 || c === 0 || c === 4) {
            cell.classList.add('hidden');
        }

        board.appendChild(cell);
        cells.push(cell);
    }
}

/* ---------- ВСПОМОГАТЕЛЬНЫЕ ---------- */
function getCell(r, c) {
    return cells[r * size + c];
}

/* ---------- ЛИНИИ 5×5 (ПО 3) ---------- */
const lines = [];

for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
        if (c <= size - 3) lines.push([[r,c],[r,c+1],[r,c+2]]);
        if (r <= size - 3) lines.push([[r,c],[r+1,c],[r+2,c]]);
        if (r <= size - 3 && c <= size - 3) lines.push([[r,c],[r+1,c+1],[r+2,c+2]]);
        if (r <= size - 3 && c >= 2) lines.push([[r,c],[r+1,c-1],[r+2,c-2]]);
    }
}

/* ---------- ЧИТЕРСКИЙ ВЫИГРЫШ ---------- */
function findCheatWinningCell(symbol) {
    for (let line of lines) {
        const values = line.map(([r,c]) => getCell(r,c).textContent);

        if (values.filter(v => v === symbol).length === 2 && values.includes('')) {
            const idx = values.indexOf('');
            const [r, c] = line[idx];

            // ТОЛЬКО за пределами видимой 3×3
            if (
                r < visibleStart || r > visibleEnd ||
                c < visibleStart || c > visibleEnd
            ) {
                return [r, c];
            }
        }
    }
    return null;
}

/* ---------- БЛОК ИГРОКА (ТОЛЬКО В 3×3) ---------- */
function findBlockCell(symbol) {
    for (let line of lines) {
        const values = line.map(([r,c]) => getCell(r,c).textContent);

        if (values.filter(v => v === symbol).length === 2 && values.includes('')) {
            const idx = values.indexOf('');
            const [r, c] = line[idx];

            if (
                r >= visibleStart && r <= visibleEnd &&
                c >= visibleStart && c <= visibleEnd
            ) {
                return [r, c];
            }
        }
    }
    return null;
}

/* ---------- ХОД КОМПЬЮТЕРА ---------- */
function computerMove() {
    if (gameOver) return;

    // 1️⃣ ЧИТЕРСКАЯ ПОБЕДА
    const cheatWin = findCheatWinningCell('⭕');
if (cheatWin) {
    const [r,c] = cheatWin;
    const cell = getCell(r,c);

    cell.classList.remove('hidden'); // 👈 ПОКАЗЫВАЕМ КЛЕТКУ
    cell.textContent = '⭕';

    gameOver = true;
    alert('Компьютер читерит и выигрывает 😈');
    return;
}

    // 2️⃣ БЛОК ИГРОКА
    const block = findBlockCell('❌');
    if (block) {
        const [r,c] = block;
        getCell(r,c).textContent = '⭕';
        return;
    }

    // 3️⃣ ЛЮБОЙ СВОБОДНЫЙ ХОД В 3×3
    for (let r = visibleStart; r <= visibleEnd; r++) {
        for (let c = visibleStart; c <= visibleEnd; c++) {
            if (!getCell(r,c).textContent) {
                getCell(r,c).textContent = '⭕';
                return;
            }
        }
    }
}

/* ---------- ХОД ИГРОКА ---------- */
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (gameOver) return;

        const r = +cell.dataset.row;
        const c = +cell.dataset.col;

        if (
            r < visibleStart || r > visibleEnd ||
            c < visibleStart || c > visibleEnd
        ) return;

        if (cell.textContent) return;

        cell.textContent = '❌';
        computerMove();
    });
});
