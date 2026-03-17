function finish(msg) {
    gameOver = true;
    // Delay the modal popup by 4 seconds (4000ms)
    setTimeout(() => {
        modalText.textContent = msg;
        modal.style.display = 'flex';
    }, 4000);
}

function botMove() {
    if (gameOver) return;

    // Check for bot winning move (including cheating in hidden cells)
    for (let l of lines) {
        const vals = l.map(([r,c]) => getCell(r,c).textContent);
        if (vals.filter(v => v === '⭕').length === 2 && vals.includes('')) {
            const emptyIdx = vals.indexOf('');
            const [r, c] = l[emptyIdx];
            
            // If the winning move is in a hidden border cell
            if (r === 0 || r === 4 || c === 0 || c === 4) {
                const cEl = getCell(r,c);
                cEl.classList.remove('hidden');
                cEl.classList.add('revealed-cheat'); // Adds the red pulse from your CSS
                cEl.textContent = '⭕';
                cEl.style.color = '#ff4757';
                return finish("LOL u lost to a bot in a tic taco toe game?? such a skill issue");
            }
        }
    }

    // Standard move logic for the inner 3x3 grid
    for (let r = vStart; r <= vEnd; r++) {
        for (let c = vStart; c <= vEnd; c++) {
            if (!getCell(r,c).textContent) {
                const target = getCell(r,c);
                target.textContent = '⭕';
                target.style.color = '#ff4757';
                if (checkWin('⭕')) {
                    return finish("LOL u lost to a bot in a tic taco toe game?? such a skill issue");
                }
                return;
            }
        }
    }
}
