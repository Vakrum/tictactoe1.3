const board = document.querySelector('.board');
const size = 5;
const visibleStart = 1;
const visibleEnd = 3;

let cells = [];
let gameOver = false;

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


function getCell(r, c) {
    return cells[r * size + c];
}


const lines = [];

for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
        if (c <= size - 3) lines.push([[r,c],[r,c+1],[r,c+2]]);
        if (r <= size - 3) lines.push([[r,c],[r+1,c],[r+2,c]]);
        if (r <= size - 3 && c <= size - 3) lines.push([[r,c],[r+1,c+1],[r+2,c+2]]);
        if (r <= size - 3 && c >= 2) lines.push([[r,c],[r+1,c-1],[r+2,c-2]]);
    }
}


function findCheatWinningCell(symbol) {
    for (let line of lines) {
        const values = line.map(([r,c]) => getCell(r,c).textContent);

        if (values.filter(v => v === symbol).length === 2 && values.includes('')) {
            const idx = values.indexOf('');
            const [r, c] = line[idx];

            
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


function computerMove() {
    if (gameOver) return;

    
    const cheatWin = findCheatWinningCell('⭕');
if (cheatWin) {
    const [r,c] = cheatWin;
    const cell = getCell(r,c);

    cell.classList.remove('hidden'); 
    cell.textContent = '⭕';

    gameOver = true;
    alert('Компьютер тебя обыграл и выиграл');
    return;
}

   
    const block = findBlockCell('❌');
    if (block) {
        const [r,c] = block;
        getCell(r,c).textContent = '⭕';
        return;
    }

   
    for (let r = visibleStart; r <= visibleEnd; r++) {
        for (let c = visibleStart; c <= visibleEnd; c++) {
            if (!getCell(r,c).textContent) {
                getCell(r,c).textContent = '⭕';
                return;
            }
        }
    }
}


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


